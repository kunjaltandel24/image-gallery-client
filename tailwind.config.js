const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  important: true,
  corePlugins: {
    // container: false,
    // preflight: false,
  },
  theme: {
    extend: {
      lineHeight: {
        7: '1.625rem',
      },
      keyframes: {
        'container-in': {
          from: {
            transform: 'rotateX(-60deg)',
            opacity: 0,
          },
          to: {
            transform: 'rotateX(0)',
            opacity: 1,
          },
        },
        'container-out': {
          from: {
            transform: 'rotateX(0)',
            opacity: 1,
          },
          to: {
            transform: 'rotateX(-60deg)',
            opacity: 0,
          },
        },
        'fade-container-in': {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          },
        },
        'fade-container-out': {
          from: {
            opacity: 1,
          },
          to: {
            opacity: 0,
          },
        },
      },
      animation: {
        'menubar-container-in': 'container-in 300ms ease-in-out forwards',
        'menubar-container-out': 'container-out 300ms ease-in-out forwards',
        'menu-fade-container-in': 'fade-container-in 300ms ease-in-out forwards',
        'menu-fade-container-out': 'fade-container-out 300ms ease-in-out forwards',
      },
    },
    // container and screen sizes
    screens: {
      sm: { min: '320px', max: '767px' },
      md: { min: '768px', max: '1023px' },
      lg: { min: '1024px', max: '1279px' },
      xl: { min: '1280px', max: '1440px' },
      xxl: { min: '1440px' },
    },
    // brand colors
    colors: {
      transparent: 'transparent',
      black: '#000000', // explore primary
      white: '#FFFFFF',

      // explore module primary colors
      gray: {
        50: '#F7F7F7',
        100: '#EBEBEB',
        200: '#D1D1D1',
        300: '#B8B8B8',
        400: '#9E9E9E',
        500: '#858585',
        600: '#6B6B6B', // secondary
        700: '#424242',
        800: '#212121',
      },

      // buidl module primary colors
      orange: {
        50: '#FDF4F2',
        100: '#F9E2DC',
        200: '#F1BFB1',
        300: '#E99D86',
        400: '#E2795A',
        500: '#DA552F', // buidl primary
        600: '#B64220',
        700: '#8B3219',
        800: '#682512',
      },

      // invest module primary colors
      purple: {
        50: '#F4F3FC',
        100: '#E0DFF6',
        200: '#BAB6EC',
        300: '#948EE1',
        400: '#6E66D6',
        500: '#483ECC',
        600: '#362DA9', // invest primary
        700: '#292281',
        800: '#1F1A61',
      },

      // tertiary red
      red: {
        50: '#FEF1F0',
        100: '#FDDBD8',
        200: '#FAAEA8',
        300: '#F88078',
        400: '#F55347',
        500: '#F22617', // error
        600: '#CB180B',
        700: '#9B1208',
        800: '#740E06',
      },

      // tertiary yellow
      yellow: {
        50: '#FFFCF0',
        100: '#FFF7D7',
        200: '#FEEDA4',
        300: '#FEE472',
        400: '#FDDA3F',
        500: '#FDD00D', // warning
        600: '#D4AD02',
        700: '#A28402',
        800: '#796301',
      },

      // tertiary green
      green: {
        50: '#F4FAF5',
        100: '#E3F3E3',
        200: '#BFE3C0',
        300: '#9BD49E',
        400: '#78C47B',
        500: '#54B558', // success
        600: '#419544',
        700: '#317234',
        800: '#255527',
      },
    },
    // spacing system (margin, padding)
    spacing: {
      px: '1px',
      0: '0px',
      0.5: '0.125rem', // 2px
      1: '0.25rem', // 4px
      1.5: '0.375rem', // 6px
      2: '0.5rem', // 8px
      2.5: '0.625rem', // 10px
      3: '0.75rem', // 12px
      3.5: '0.875rem', // 14px
      4: '1rem', // 16px
      5: '1.25rem', // 20px
      6: '1.5rem', // 24px
      7: '1.75rem', // 28px
      8: '2rem', // 32px
      9: '2.25rem', // 36px
      10: '2.5rem', // 40px
      11: '2.75rem', // 44px
      12: '3rem', // 48px
      14: '3.5rem', // 56px
      16: '4rem', // 64px
      20: '5rem', // 80px
      24: '6rem', // 96px
      28: '7rem', // 112px
      32: '8rem', // 128px
      36: '9rem', // 144px
      40: '10rem', // 160px
    },
    // font size system
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
      base: ['1rem', { lineHeight: '1.5rem' }], // 16px
      lg: ['1.125rem', { lineHeight: '1.625rem' }], // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
      '3xl': ['2rem', { lineHeight: '2.625rem' }], // 32px
      '4xl': ['2.5rem', { lineHeight: '3.25rem' }], // 40px
      '5xl': ['3rem', { lineHeight: '3.75rem' }], // 48px
      '6xl': ['3.75rem', { lineHeight: '4.375rem' }], // 60px
      '7xl': ['4.5rem', { lineHeight: '5.125rem' }], // 72px
    },
    // font-family
    fontFamily: {
      sans: ['Inter'],
      text: ['Urbanist'],
    },
    fontWeight: {
      normal: '400',
      semibold: '500',
      bold: '800',
    },
    // Spacing between letter system
    letterSpacing: {
      normal: '-0.5px',
      wide: '-1.5px',
    },
    // Border Radius system
    borderRadius: {
      none: '0px', // 0px
      sm: '0.125rem', // 2px
      DEFAULT: '0.25rem', // 4px
      md: '0.375rem', // 6px
      lg: '0.5rem', // 8px
      xl: '0.75rem', // 12px
      '2xl': '1rem', // 16px
      '3xl': '1.25rem', // 20px
      '4xl': '1.5rem', // 24px
      full: '9999px',
    },
    // Box Shadow system
    boxShadow: {
      none: 'none',
      xs: '0px 2px 4px -2px rgba(33, 33, 33, 0.12), 0px 4px 4px -2px rgba(33, 33, 33, 0.08)',
      sm: '0px 4px 6px -4px rgba(33, 33, 33, 0.12), 0px 8px 8px -4px rgba(33, 33, 33, 0.08)',
      md: '0px 6px 8px -6px rgba(33, 33, 33, 0.12), 0px 8px 16px -6px rgba(33, 33, 33, 0.08)',
      lg: '0px 6px 12px -6px rgba(33, 33, 33, 0.12), 0px 8px 24px -4px rgba(33, 33, 33, 0.08)',
      xl: '0px 6px 14px -6px rgba(33, 33, 33, 0.12), 0px 10px 32px -4px rgba(33, 33, 33, 0.1)',
      '2xl': '0px 8px 18px -6px rgba(33, 33, 33, 0.12), 0px 12px 42px -4px rgba(33, 33, 33, 0.12)',
      '3xl': '0px 8px 22px -6px rgba(33, 33, 33, 0.12), 0px 14px 64px -4px rgba(33, 33, 33, 0.12)',
    },
    // Opacity system
    opacity: {
      0: '0',
      5: '0.05',
      10: '0.1',
      20: '0.2',
      25: '0.25',
      30: '0.3',
      40: '0.4',
      50: '0.5',
      60: '0.6',
      70: '0.7',
      75: '0.75',
      80: '0.8',
      90: '0.9',
      95: '0.95',
      100: '1',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/aspect-ratio'),
    function ({ addComponents }) {
      addComponents({
        '.container': {
          maxWidth: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          '@screen sm': {
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          },
          '@screen md': {
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
          '@screen lg': {
            maxWidth: '960px',
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
          '@screen xl': {
            maxWidth: '1200px',
          },
          '@screen xxl': {
            maxWidth: '1344px',
          },
        },
      })
    },
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide'),
    plugin(function ({ addVariant, e }) {
      addVariant('child(2)', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`child(2)${separator}${className}`)}:nth-child(2)`
        })
      })
      addVariant('child(3)', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`child(3)${separator}${className}`)}:nth-child(3)`
        })
      })
      addVariant('child(4)', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`child(4)${separator}${className}`)}:nth-child(4)`
        })
      })
    }),
  ],
}
