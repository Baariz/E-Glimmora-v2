/**
 * Scroll reveal variants for viewport-triggered animations
 * Use with useInView hook from framer-motion
 */

const easeOut = [0, 0, 0.2, 1]

export const fadeUp = {
  initial: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
}

export const fadeIn = {
  initial: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
}

export const scaleIn = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
}

export const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}
