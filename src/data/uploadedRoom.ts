import type { Room } from './rooms'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const ACCEPTED_IMAGE_TYPES = ACCEPTED_TYPES.join(',')

let nextUploadId = 1

/**
 * Turns a picked file into a room backed by a local object URL. Rejects anything
 * that isn't an accepted type or can't be decoded, without leaking the URL.
 */
export async function createUploadedRoom(file: File): Promise<Room> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error('Please choose a JPG, PNG or WebP image.')
  }

  const url = URL.createObjectURL(file)
  try {
    const probe = new Image()
    probe.src = url
    await probe.decode()
  } catch {
    URL.revokeObjectURL(url)
    throw new Error("That image couldn't be opened. Please try another file.")
  }

  const name = file.name.replace(/\.[^.]+$/, '') || 'Uploaded space'
  return {
    id: `upload-${nextUploadId++}`,
    name,
    floor: 'Not specified',
    wall: 'Not specified',
    image: url,
    alt: `Uploaded room photo: ${name}`,
  }
}
