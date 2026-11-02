import { Check, Columns, ShareNetwork, SignOut } from '@phosphor-icons/react'
import type { Mode } from '../types'
import { ActionButton } from './ActionButton'
import './Toolbar.css'

type ToolbarProps = {
  mode: Mode
  doneDisabled: boolean
  onOpenSpaces: () => void
  onDone: () => void
  onShare: () => void
}

export function Toolbar({ mode, doneDisabled, onOpenSpaces, onDone, onShare }: ToolbarProps) {
  const inSpaces = mode === 'spaces'

  return (
    <div
      className={inSpaces ? 'toolbar toolbar--spaces' : 'toolbar'}
      role="group"
      aria-label={inSpaces ? 'My Spaces actions' : 'Visualizer actions'}
    >
      {!inSpaces && <ActionButton icon={SignOut} mirrored label="Exit" />}
      {/* One button that changes role, so keyboard focus stays on it across modes. */}
      <ActionButton
        icon={inSpaces ? Check : Columns}
        label={inSpaces ? 'Done' : 'My Spaces'}
        primary={!inSpaces}
        disabled={inSpaces && doneDisabled}
        onClick={inSpaces ? onDone : onOpenSpaces}
      />
      {!inSpaces && <ActionButton icon={ShareNetwork} label="Share" onClick={onShare} />}
    </div>
  )
}
