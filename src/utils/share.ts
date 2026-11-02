import { isPredefinedRoomId, rooms } from '../data/rooms'
import type { Room } from '../data/rooms'

const ROOM_PARAM = 'room'

export type ShareOutcome = 'shared' | 'copied' | 'cancelled'

/**
 * The room ID a public link can point to, or null if there isn't one. A copy of a
 * predefined room links to the original, which has the same image and materials. An
 * upload only exists in this browser, so no URL could open it anywhere else.
 */
export function shareableRoomId(room: Room) {
  const id = room.sourceRoomId ?? room.id
  return isPredefinedRoomId(id) ? id : null
}

export function buildRoomUrl(roomId: string) {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = ''
  url.searchParams.set(ROOM_PARAM, roomId)
  return url.href
}

/** Which room a shared link asks for. An unknown ID falls back to the default room. */
export function readSharedRoom() {
  const id = new URLSearchParams(window.location.search).get(ROOM_PARAM)
  const index = rooms.findIndex((room) => room.id === id)
  return { index: Math.max(index, 0), isInvalid: id !== null && index === -1 }
}

/** Uses the native share sheet when available, otherwise copies. Throws if neither works. */
export async function shareLink(title: string, url: string): Promise<ShareOutcome> {
  if (navigator.share && (navigator.canShare?.({ url }) ?? true)) {
    try {
      await navigator.share({ title, url })
      return 'shared'
    } catch (error) {
      if ((error as Error).name === 'AbortError') return 'cancelled'
      // The share sheet failed rather than being dismissed, so try copying instead.
    }
  }
  await navigator.clipboard.writeText(url)
  return 'copied'
}
