import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Copy, Heart, ShareNetwork } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import { galleryFade, selectedRoom as selectedRoomVariants } from '../animation'
import type { Room } from '../data/rooms'
import { useCarousel } from '../hooks/useCarousel'
import type { CarouselPhase } from '../types'
import { ActionButton } from './ActionButton'
import { AddSpaceCard } from './AddSpaceCard'
import './SpacesGallery.css'

type SpacesGalleryProps = {
  rooms: Room[]
  selectedIndex: number
  onSelect: (index: number) => void
  phase: CarouselPhase
  onPhaseChange: (phase: CarouselPhase) => void
  onAddFile: (file: File) => void
  isFavorite: boolean
  onToggleFavorite: () => void
  onShare: () => void
  onDuplicate: () => void
  onImageError: () => void
}

export function SpacesGallery({
  rooms,
  selectedIndex,
  onSelect,
  phase,
  onPhaseChange,
  onAddFile,
  isFavorite,
  onToggleFavorite,
  onShare,
  onDuplicate,
  onImageError,
}: SpacesGalleryProps) {
  const selectedRoom = rooms[selectedIndex]
  const [favoritePopKey, setFavoritePopKey] = useState(0)
  const reduceMotion = useReducedMotion()
  const { x, trackRef, trackProps } = useCarousel({
    roomCount: rooms.length,
    selectedIndex,
    onSelect,
    phase,
    onPhaseChange,
  })

  function handleDuplicate() {
    const image = trackRef.current?.querySelector<HTMLImageElement>('[aria-current="true"] img')
    // Finished loading with no pixels means the image is gone, so don't copy a broken room.
    if (image?.complete && image.naturalWidth === 0) {
      onImageError()
      return
    }
    onDuplicate()
  }

  return (
    <motion.main className="spaces" initial="hidden" animate="shown" exit="hidden">
      <div className="spaces__viewport" style={{ '--selected-index': selectedIndex } as CSSProperties}>
        <motion.div
          ref={trackRef}
          className="spaces__track"
          role="group"
          aria-label="Saved spaces"
          data-phase={phase}
          style={{ x }}
          {...trackProps}
        >
          {rooms.map((room, index) => {
            const isSelected = index === selectedIndex
            return (
              <motion.button
                className="spaces__card"
                key={room.id}
                type="button"
                data-room-id={room.id}
                // A constant dependency means cards only animate when they swap with the
                // full-screen room, never when the track moves.
                layoutId={reduceMotion ? undefined : room.id}
                layoutDependency={0}
                layoutCrossfade={false}
                variants={isSelected ? selectedRoomVariants : galleryFade}
                style={{ borderRadius: 20 }}
                tabIndex={Math.abs(index - selectedIndex) === 1 ? 0 : -1}
                aria-current={isSelected || undefined}
                aria-disabled={isSelected || undefined}
                onClick={() => {
                  if (!isSelected) onSelect(index)
                }}
              >
                <img
                  className="spaces__image"
                  src={room.image}
                  alt={room.alt}
                  draggable={false}
                  onError={onImageError}
                />
              </motion.button>
            )
          })}
          <AddSpaceCard focusable={selectedIndex === rooms.length - 1} onFile={onAddFile} />
        </motion.div>
      </div>

      <motion.div className="spaces__details" variants={galleryFade}>
        <div className="spaces__info" aria-live="polite">
          <h1 className="spaces__name">{selectedRoom.name}</h1>
          <p className="spaces__materials">
            <span>Floor - {selectedRoom.floor}</span>
            <span>Wall - {selectedRoom.wall}</span>
          </p>
        </div>

        <div className="spaces__actions" role="group" aria-label="Space actions">
          <ActionButton icon={ShareNetwork} label="Share" onClick={onShare} />
          <ActionButton
            icon={Heart}
            iconWeight={isFavorite ? 'fill' : 'regular'}
            label="Favorite"
            ariaLabel={`Favorite ${selectedRoom.name}`}
            pressed={isFavorite}
            popKey={favoritePopKey}
            onClick={() => {
              onToggleFavorite()
              setFavoritePopKey((key) => key + 1)
            }}
          />
          {/* Disabled unless idle, so a new room can never land in the middle of a gesture. */}
          <ActionButton icon={Copy} label="Duplicate" disabled={phase !== 'idle'} onClick={handleDuplicate} />
        </div>
      </motion.div>
    </motion.main>
  )
}
