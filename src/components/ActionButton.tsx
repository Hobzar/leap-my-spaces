import type { Icon, IconWeight } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import './ActionButton.css'

type ActionButtonProps = {
  icon: Icon
  iconWeight?: IconWeight
  label: string
  /** Replaces the visible label for screen readers when it needs more context. */
  ariaLabel?: string
  mirrored?: boolean
  primary?: boolean
  /** Makes this a toggle button. */
  pressed?: boolean
  /** Temporarily unavailable, as with Done while the carousel moves. */
  disabled?: boolean
  /** Change this to give the icon a small pop. Stays still while it's 0 or unchanged. */
  popKey?: number
  /** Without a handler the action doesn't exist yet, so the button is disabled. */
  onClick?: () => void
}

export function ActionButton({
  icon: IconComponent,
  iconWeight,
  label,
  ariaLabel,
  mirrored,
  primary,
  pressed,
  disabled,
  popKey,
  onClick,
}: ActionButtonProps) {
  const className = primary ? 'action-button action-button--primary' : 'action-button'

  return (
    <button
      className={className}
      type="button"
      disabled={disabled || !onClick}
      title={onClick ? undefined : 'Not available yet'}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      onClick={onClick}
    >
      <motion.span
        className="action-button__icon"
        key={popKey}
        animate={popKey ? { scale: [1, 1.35, 1] } : undefined}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <IconComponent size="1.25em" weight={iconWeight} mirrored={mirrored} aria-hidden="true" />
      </motion.span>
      {label}
    </button>
  )
}
