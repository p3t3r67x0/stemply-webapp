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

  css: [],

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

  build: {
    extend(config, ctx) {}
  }
}
