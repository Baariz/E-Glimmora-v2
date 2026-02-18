/**
 * Micro-interaction variants for UI elements
 * Use with whileHover, whileTap, or animate props
 */

export const buttonTap = {
  scale: 0.97,
}

export const buttonHover = {
  scale: 1.02,
  transition: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
  },
}

export const cardHover = {
  y: -4,
  transition: {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
  },
}

export const pulseOnce = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
}

export const shimmer = {
  backgroundPosition: ['200% 0', '-200% 0'],
  transition: {
    duration: 2,
    ease: 'linear',
    repeat: Infinity,
  },
}

export const loadingPulse = {
  opacity: [0.6, 0.8, 0.6],
  transition: {
    duration: 1.5,
    ease: 'easeInOut',
    repeat: Infinity,
  },
}

export const linkHover = {
  x: 4,
  transition: {
    duration: 0.15,
    ease: [0.4, 0, 0.2, 1],
  },
}

export const cardLift = {
  y: -8,
  scale: 1.01,
  transition: {
    duration: 0.25,
    ease: [0.4, 0, 0.2, 1],
  },
}

export const navScrollTransition = {
  backdropFilter: 'blur(24px)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  transition: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
}
