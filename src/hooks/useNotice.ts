import { useEffect, useState } from 'react'

const DEFAULT_SECONDS = 5

export type NoticeMessage = {
  text: string
  /** A link to show after the text, for when it couldn't be copied automatically. */
  link?: string
  seconds?: number
}

export function useNotice(initial: NoticeMessage | null) {
  const [notice, setNotice] = useState(initial)

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(null), (notice.seconds ?? DEFAULT_SECONDS) * 1000)
    return () => clearTimeout(timer)
  }, [notice])

  return { notice, showNotice: setNotice }
}
