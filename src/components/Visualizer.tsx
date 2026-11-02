import { motion, useReducedMotion } from 'motion/react'
import type { Room } from '../data/rooms'
import './Visualizer.css'

type VisualizerProps = {
  room: Room
  onImageError: () => void
}

export function Visualizer({ room, onImageError }: VisualizerProps) {
  const reduceMotion = useReducedMotion()

  return (
    <main className="visualizer">
      {/* Shares its layoutId with the room's gallery card, so one animates into the other. */}
      <motion.div
        className="visualizer__frame"
        layoutId={reduceMotion ? undefined : room.id}
        layoutCrossfade={false}
        style={{ borderRadius: 0 }}
      >
        <img
          className="visualizer__image"
          src={room.image}
          alt={room.alt}
          draggable={false}
          onError={onImageError}
        />
      </motion.div>
    </main>
  )
}
