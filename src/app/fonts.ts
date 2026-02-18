// TODO: Replace with licensed Miller Display and Avenir LT Std .woff2 files
// These fonts are client-specified from the moodboard and must be provided by the client.
// Until real fonts are provided, the fallback stack (Georgia for serif, system-ui for sans) will render.
//
// Font file structure expected:
// - public/fonts/MillerDisplay-Light.woff2 (weight: 300)
// - public/fonts/MillerDisplay-LightItalic.woff2 (weight: 300, italic)
// - public/fonts/MillerDisplay-Roman.woff2 (weight: 400)
// - public/fonts/MillerDisplay-Italic.woff2 (weight: 400, italic)
// - public/fonts/MillerDisplay-Bold.woff2 (weight: 700)
// - public/fonts/AvenirLTStd-Book.woff2 (weight: 400)
// - public/fonts/AvenirLTStd-BookOblique.woff2 (weight: 400, italic)
// - public/fonts/AvenirLTStd-Medium.woff2 (weight: 500)
// - public/fonts/AvenirLTStd-Heavy.woff2 (weight: 700)

// For now, export mock font objects that provide the CSS variable names
// The fallback font stack will be used until real fonts are provided
export const millerDisplay = {
  variable: '--font-miller-display',
  className: '',
}

export const avenirLT = {
  variable: '--font-avenir-lt',
  className: '',
}

// When real font files are provided, uncomment this and remove the mock exports above:
/*
import localFont from 'next/font/local'

export const millerDisplay = localFont({
  src: [
    {
      path: '../../public/fonts/MillerDisplay-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/MillerDisplay-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/fonts/MillerDisplay-Roman.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/MillerDisplay-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/MillerDisplay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-miller-display',
  display: 'swap',
})

export const avenirLT = localFont({
  src: [
    {
      path: '../../public/fonts/AvenirLTStd-Book.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/AvenirLTStd-BookOblique.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/AvenirLTStd-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/AvenirLTStd-Heavy.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-avenir-lt',
  display: 'swap',
})
*/
