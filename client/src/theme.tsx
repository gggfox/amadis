import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

const fonts = { mono: `'Menlo', monospace` }

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
})

const theme = extendTheme({
  colors: {
    polarNight: {
      0:'#2E3440',
      1:'#3B4252',
      2:'#434C5E',
      3:'#4C566A',
    },
    snowStorm: {
      0: '#D8DEE9',
      1: '#E5E9F0',
      2: '#ECEFF4',
    },
    frost: {
      0: '#8FBCBB',
      1: '#88C0D0',
      2: '#81A1C1',
      3: '#5E81AC',
    },
    aurora: {
      red:    '#BF616A',
      orange: '#D08770',
      yellow: '#EBCB8B',
      green:  '#A3BE8C',
      purple: '#B48EAD',
    },
    black: '#16161D',

    bd: '#2F2F35',
    bl: '#3B3B42',
    pd: '#4B63F8',
    pl: '#8AAAFE',
    wl: '#EDF2F6',
    rl: '#FF5656',


  },
  fonts,
  breakpoints,
  icons: {
    logo: {
      path: (
        <svg
          width="3000"
          height="3163"
          viewBox="0 0 3000 3163"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="3000" height="3162.95" fill="none" />
          <path
            d="M1470.89 1448.81L2170 2488.19H820V706.392H2170L1470.89 1448.81ZM1408.21 1515.37L909.196 2045.3V2393.46H1998.84L1408.21 1515.37Z"
            fill="currentColor"
          />
        </svg>
      ),
      viewBox: '0 0 3000 3163',
    },
  },
})

export default theme
