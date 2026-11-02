import { useEffect, useState } from 'react'
import { isPredefinedRoomId } from '../data/rooms'

const STORAGE_KEY = 'my-spaces:favorites'

/**
 * Only predefined rooms are saved. Uploads and duplicates disappear on reload, and their
 * IDs restart each session, so a saved one could wrongly mark a later room as a favourite.
 */
function loadFavorites(): string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(stored) ? stored.filter(isPredefinedRoomId) : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(loadFavorites)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds.filter(isPredefinedRoomId)))
    } catch {
      // Storage can be blocked or full. Favourites still work until the page reloads.
    }
  }, [favoriteIds])

  function toggleFavorite(roomId: string) {
    setFavoriteIds((current) =>
      current.includes(roomId) ? current.filter((id) => id !== roomId) : [...current, roomId],
    )
  }

  return { favoriteIds, toggleFavorite }
}
