import { useRef } from 'react'
import type { ChangeEvent } from 'react'
import { Plus } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { galleryFade } from '../animation'
import { ACCEPTED_IMAGE_TYPES } from '../data/uploadedRoom'
import './AddSpaceCard.css'

type AddSpaceCardProps = {
  /** The card is only on screen, and so only focusable, beside the last room. */
  focusable: boolean
  onFile: (file: File) => void
}

export function AddSpaceCard({ focusable, onFile }: AddSpaceCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Clear the value so choosing the same file again still fires a change event.
    event.target.value = ''
    if (file) onFile(file)
  }

  return (
    <>
      <motion.button
        className="add-space"
        type="button"
        variants={galleryFade}
        tabIndex={focusable ? 0 : -1}
        aria-label="Add space"
        onClick={() => inputRef.current?.click()}
      >
        <Plus className="add-space__icon" weight="thin" aria-hidden="true" />
      </motion.button>
      <input ref={inputRef} type="file" accept={ACCEPTED_IMAGE_TYPES} hidden onChange={handleChange} />
    </>
  )
}
