import type { Transition, Variants } from 'motion/react'

/** Shared by the carousel track and the card-to-full-screen expansion. */
export const SPRING: Transition = { type: 'spring', duration: 0.5, bounce: 0.08 }

/** Everything in the gallery except the selected room fades in and out. */
export const galleryFade: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  shown: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
}

/**
 * The selected room stays opaque through the fade because it becomes the full-screen
 * room. It needs its own variants: with none, Motion would animate opacity back to the
 * 0 it started from when a neighbour becomes selected.
 */
export const selectedRoom: Variants = {
  hidden: { opacity: 1, transition: { duration: 0 } },
  shown: { opacity: 1, transition: { duration: 0 } },
}
