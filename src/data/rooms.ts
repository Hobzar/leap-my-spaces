import cosyBedroomImage from '../assets/rooms/cosy-bedroom.jpg'
import livingRoomImage from '../assets/rooms/living-room.jpg'

export type Room = {
  id: string
  name: string
  floor: string
  wall: string
  image: string
  alt: string
  /** On a duplicate: the room it was ultimately copied from. */
  sourceRoomId?: string
}

export const rooms: Room[] = [
  {
    id: 'living-room',
    name: 'Living room',
    floor: 'Dark forest hardwood',
    wall: 'Pearl white',
    image: livingRoomImage,
    alt: 'Bright living room with white walls, a white sofa, a pale rug and a wood floor',
  },
  {
    id: 'cosy-bedroom',
    name: 'Cosy bedroom',
    floor: 'Hawk maple hardwood',
    wall: 'Deep night blue',
    image: cosyBedroomImage,
    alt: 'Bedroom with deep navy walls, two large windows, a dark made bed and a wood floor',
  },
]

/** Predefined rooms exist for every visitor. Uploads and duplicates only exist in this tab. */
export function isPredefinedRoomId(id: string) {
  return rooms.some((room) => room.id === id)
}

let nextCopyId = 1

/** Copies a room as a new entry. The image URL is shared, so no image data is duplicated. */
export function duplicateRoom(original: Room, existingRooms: Room[]): Room {
  return {
    ...original,
    id: `copy-${nextCopyId++}`,
    name: copyName(original.name, existingRooms),
    sourceRoomId: original.sourceRoomId ?? original.id,
  }
}

function copyName(name: string, existingRooms: Room[]) {
  const baseName = name.replace(/ \(Copy(?: \d+)?\)$/, '')
  const isTaken = (candidate: string) => existingRooms.some((room) => room.name === candidate)
  let candidate = `${baseName} (Copy)`
  for (let number = 2; isTaken(candidate); number++) {
    candidate = `${baseName} (Copy ${number})`
  }
  return candidate
}
