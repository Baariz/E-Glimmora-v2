/**
 * Parallax animation configuration presets
 * Scroll-linked motion for hero sections and cinematic breaks
 */

export const heroParallax = {
  textY: [0, -100],
  textOpacity: [1, 0.5, 0],
  bgY: [0, -200],
}

export const cinematicBreak = {
  contentY: [0, -50],
  contentOpacity: [0.8, 1, 0.8],
}

export const sectionReveal = {
  y: [100, 0],
  opacity: [0, 1],
}
