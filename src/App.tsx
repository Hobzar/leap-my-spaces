import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'motion/react'
import { SPRING } from './animation'
import { Notice } from './components/Notice'
import { SpacesGallery } from './components/SpacesGallery'
import { Toolbar } from './components/Toolbar'
import { Visualizer } from './components/Visualizer'
import { duplicateRoom, rooms as initialRooms } from './data/rooms'
import { createUploadedRoom } from './data/uploadedRoom'
import { useFavorites } from './hooks/useFavorites'
import { useNotice } from './hooks/useNotice'
import type { CarouselPhase, Mode } from './types'
import { buildRoomUrl, readSharedRoom, shareableRoomId, shareLink } from './utils/share'

const sharedRoom = readSharedRoom()

export default function App() {
  const [mode, setMode] = useState<Mode>('visualizer')
  const [rooms, setRooms] = useState(initialRooms)
  const [selectedIndex, setSelectedIndex] = useState(sharedRoom.index)
  const [carouselPhase, setCarouselPhase] = useState<CarouselPhase>('idle')
  const { favoriteIds, toggleFavorite } = useFavorites()
  const { notice, showNotice } = useNotice(
    sharedRoom.isInvalid ? { text: "That room link isn't available, so here's the default room." } : null,
  )
  const uploadedUrls = useRef<string[]>([])
  const isSharing = useRef(false)
  const selectedRoom = rooms[selectedIndex]

  useEffect(() => {
    // Load every room up front so neighbours are ready when the gallery opens.
    initialRooms.forEach((room) => {
      new Image().src = room.image
    })
    const urls = uploadedUrls.current
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  async function handleAddFile(file: File) {
    try {
      const room = await createUploadedRoom(file)
      uploadedUrls.current.push(room.image)
      setRooms((current) => [...current, room])
      setSelectedIndex(rooms.length)
    } catch (error) {
      showNotice({ text: (error as Error).message })
    }
  }

  async function handleShare() {
    const roomId = shareableRoomId(selectedRoom)
    if (!roomId) {
      showNotice({
        text: "This photo only exists in your browser, so it can't be shared by link. Public sharing needs hosted image storage.",
        seconds: 7,
      })
      return
    }
    if (isSharing.current) return
    isSharing.current = true
    const url = buildRoomUrl(roomId)
    try {
      const outcome = await shareLink(selectedRoom.name, url)
      if (outcome === 'cancelled') return
      const message = outcome === 'copied' ? 'Link copied!' : 'Link shared!'
      showNotice({ text: selectedRoom.sourceRoomId ? `${message} It opens the original room.` : message })
    } catch {
      showNotice({ text: "Couldn't copy the link automatically. Here it is:", link: url, seconds: 15 })
    } finally {
      isSharing.current = false
    }
  }

  function handleDuplicate() {
    const copy = duplicateRoom(selectedRoom, rooms)
    const copyIndex = selectedIndex + 1
    setRooms((current) => [...current.slice(0, copyIndex), copy, ...current.slice(copyIndex)])
    setSelectedIndex(copyIndex)
    showNotice({ text: `Duplicated as "${copy.name}"`, seconds: 3 })
  }

  function handleImageError() {
    showNotice({ text: "This room's image is no longer available." })
  }

  return (
    <MotionConfig reducedMotion="user" transition={SPRING}>
      <Toolbar
        mode={mode}
        doneDisabled={carouselPhase !== 'idle'}
        onOpenSpaces={() => setMode('spaces')}
        onDone={() => setMode('visualizer')}
        onShare={handleShare}
      />
      <AnimatePresence>
        {mode === 'spaces' && (
          <SpacesGallery
            key="spaces"
            rooms={rooms}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            phase={carouselPhase}
            onPhaseChange={setCarouselPhase}
            onAddFile={handleAddFile}
            isFavorite={favoriteIds.includes(selectedRoom.id)}
            onToggleFavorite={() => toggleFavorite(selectedRoom.id)}
            onShare={handleShare}
            onDuplicate={handleDuplicate}
            onImageError={handleImageError}
          />
        )}
      </AnimatePresence>
      {mode === 'visualizer' && <Visualizer room={selectedRoom} onImageError={handleImageError} />}
      <Notice notice={notice} />
    </MotionConfig>
  )
}
