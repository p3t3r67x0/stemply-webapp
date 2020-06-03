export default {
  mode: 'universal',

  head: {
    title: process.env.npm_package_name || '',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },

  loading: {
    color: '#0075f2'
  },

  css: [{
    src: '@/assets/css/markdown.css'
  }],

  plugins: [{
    src: "@/plugins/vClickOutside",
    ssr: false
  }, {
    src: "@/plugins/axiosInterceptors",
    ssr: true
  }],

  router: {
    middleware: 'router'
  },

  buildModules: [
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    ['nuxt-i18n', {
      locales: [{
          name: 'Deutsch',
          code: 'de',
          iso: 'de-CH',
          file: 'de-CH.js'
        },
        {
          name: 'English',
          code: 'en',
          iso: 'en-GB',
          file: 'en-GB.js'
        },
        {
          name: 'Français',
          code: 'fr',
          iso: 'fr-CH',
          file: 'fr-CH.js'
        },
      ],
      langDir: 'lang/',
      lazy: true,
      defaultLocale: 'de',
    }],
    ['nuxt-fontawesome', {
      component: 'fa',
      imports: [{
          set: '@fortawesome/free-solid-svg-icons',
          icons: ['fas']
        },
        {
          set: '@fortawesome/free-brands-svg-icons',
          icons: ['fab']
        }
      ]
    }]
  ],

  purgeCSS: {
    whitelist: ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'],
    whitelistPatterns: [/markdown/]
  },

  build: {
    extend(config, ctx) {}
  }
}
