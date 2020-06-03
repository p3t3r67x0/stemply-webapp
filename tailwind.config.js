module.exports = {
  purge: {
    content: [
      './components/**/*.vue',
      './layouts/**/*.vue',
      './pages/**/*.vue'
    ],
    options: {
      whitelist: ['markdown']
    }
  },
  theme: {},
  variants: {
    backgroundColor: ['responsive', 'odd', 'even', 'hover', 'focus', 'group-hover'],
    textColor: ['responsive', 'hover', 'focus', 'group-hover'],
    opacity: ['responsive', 'hover', 'focus', 'group-hover']
  },
  plugins: []
}
