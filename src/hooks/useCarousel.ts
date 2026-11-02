import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { animate, useIsPresent, useMotionValue, useReducedMotion } from 'motion/react'
import type { AnimationPlaybackControls, PanInfo } from 'motion/react'
import { SPRING } from '../animation'
import type { CarouselPhase } from '../types'

/** A swipe commits past this share of a slide, or when flicked at this speed in px/s. */
const COMMIT_RATIO = 0.2
const FLICK_VELOCITY = 500

type UseCarouselOptions = {
  roomCount: number
  selectedIndex: number
  onSelect: (index: number) => void
  phase: CarouselPhase
  onPhaseChange: (phase: CarouselPhase) => void
}

/**
 * CSS rests the track on the selected room using its index, so `x` is only a temporary
 * offset that always returns to 0. Resizing therefore needs no JS, and the selected
 * card is at its true position whenever Done measures it for the expansion.
 */
export function useCarousel({ roomCount, selectedIndex, onSelect, phase, onPhaseChange }: UseCarouselOptions) {
  const x = useMotionValue(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const reduceMotion = useReducedMotion()
  const isPresent = useIsPresent()

  const animation = useRef<AnimationPlaybackControls | null>(null)
  const dragAxis = useRef<'x' | 'y' | null>(null)
  const suppressClick = useRef(false)
  const releaseVelocity = useRef<number | null>(null)
  const previousIndex = useRef(selectedIndex)
  const focusBeforeMove = useRef<HTMLElement | null>(null)

  function startMoving(next: CarouselPhase) {
    // Done gets disabled while moving, which drops its focus, so remember it to restore.
    if (phase === 'idle') focusBeforeMove.current = document.activeElement as HTMLElement | null
    onPhaseChange(next)
  }

  function settle(velocity = x.getVelocity()) {
    startMoving('settling')
    animation.current?.stop()
    if (reduceMotion) {
      x.jump(0)
      onPhaseChange('idle')
      return
    }
    // onComplete doesn't fire when a new press or drag interrupts the spring.
    animation.current = animate(x, 0, { ...SPRING, velocity, onComplete: () => onPhaseChange('idle') })
  }

  useLayoutEffect(() => {
    const track = trackRef.current!
    const measure = () => setStep(measureStep(track))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [])

  // CSS has already moved the track to the new room. Offset it back to where it was on
  // screen and spring to 0, however the selection changed.
  useLayoutEffect(() => {
    const moved = selectedIndex - previousIndex.current
    previousIndex.current = selectedIndex
    if (moved === 0) return
    const velocity = releaseVelocity.current ?? x.getVelocity()
    releaseVelocity.current = null
    x.jump(x.get() + moved * measureStep(trackRef.current!))
    settle(velocity)
    // settle reads the latest values from its closure; only a new selection should start it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex])

  useEffect(() => {
    if (phase !== 'idle' || !focusBeforeMove.current) return
    if (document.activeElement === document.body) focusBeforeMove.current.focus({ preventScroll: true })
    focusBeforeMove.current = null
  }, [phase])

  useEffect(() => () => animation.current?.stop(), [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
      if (direction === 0 || phase === 'dragging' || !isPresent) return
      event.preventDefault()
      const target = selectedIndex + direction
      if (target >= 0 && target < roomCount) onSelect(target)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase, isPresent, selectedIndex, roomCount, onSelect])

  const trackProps = {
    drag: 'x' as const,
    dragDirectionLock: true,
    dragMomentum: false,
    dragElastic: 0.12,
    dragConstraints: {
      left: -(roomCount - 1 - selectedIndex) * step,
      right: selectedIndex * step,
    },
    onDirectionLock(axis: 'x' | 'y') {
      dragAxis.current = axis
      suppressClick.current = true
      // Only a confirmed horizontal gesture blurs the images and disables Done.
      if (axis === 'x') startMoving('dragging')
    },
    onDragEnd(_event: unknown, info: PanInfo) {
      const axis = dragAxis.current
      dragAxis.current = null
      if (axis !== 'x') {
        if (x.get() !== 0) settle()
        return
      }
      const direction = swipeDirection(info.offset.x, info.velocity.x, step)
      const target = Math.min(Math.max(selectedIndex + direction, 0), roomCount - 1)
      if (target === selectedIndex) {
        settle(info.velocity.x)
      } else {
        releaseVelocity.current = info.velocity.x
        onSelect(target)
      }
    },
    onPointerDownCapture() {
      suppressClick.current = false
    },
    // A press stops the spring. If it doesn't turn into a drag, finish the move on release.
    onPointerUpCapture() {
      if (phase === 'settling' && !dragAxis.current) settle()
    },
    onPointerCancelCapture() {
      if (phase === 'settling' && !dragAxis.current) settle()
    },
    // detail is 0 for keyboard activation, which should never be treated as a drag.
    onClickCapture(event: ReactMouseEvent) {
      if (suppressClick.current && event.detail > 0) {
        event.preventDefault()
        event.stopPropagation()
      }
    },
  }

  return { x, trackRef, trackProps }
}

/** Returns the index change a release should cause: -1, 0 or 1. */
function swipeDirection(offset: number, velocity: number, step: number) {
  const dragDirection = Math.sign(offset)
  const speedAlongDrag = velocity * dragDirection
  // Dragged one way, then thrown back the other: the user changed their mind.
  if (speedAlongDrag < -FLICK_VELOCITY) return 0
  const committed = Math.abs(offset) > step * COMMIT_RATIO || speedAlongDrag > FLICK_VELOCITY
  return committed ? -dragDirection : 0
}

function measureStep(track: HTMLElement) {
  const [first, second] = track.children as unknown as [HTMLElement, HTMLElement]
  return second.offsetLeft - first.offsetLeft
}
