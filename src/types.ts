export type Mode = 'visualizer' | 'spaces'

/**
 * idle: the selected room is at rest.
 * dragging: the user is moving the carousel horizontally.
 * settling: the carousel is animating into its final position.
 */
export type CarouselPhase = 'idle' | 'dragging' | 'settling'
