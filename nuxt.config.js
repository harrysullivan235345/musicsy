const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: "Musicsy",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Cabin:400,700' },
      { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.6.0/css/all.css' }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: 'lightblue', continuous: true },

  /*
   ** Global CSS
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/vue-context",
    "~/plugins/vee-validate",
    "~/plugins/vue-range-slider",
    "~/plugins/vue2-touch-events",
    "~/plugins/vue-mobile-detection",
    { src: "~/plugins/vue-js-modal", ssr: false }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    '@nuxtjs/toast',
    // '@nuxtjs/pwa',
    ['@nuxtjs/google-analytics', {
      id: 'UA-141176531-1'
    }]
  ],

  toast: {
    position: 'bottom-right'
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },

  env: {
    baseUrl: process.env.NODE_ENV === 'production' ? 'https://musicsy.herokuapp.com' : 'http://localhost:3000'
  },

  serverMiddleware: [
    { path: '/api', handler: '~/server/routes/api.js' },
  ]
}
