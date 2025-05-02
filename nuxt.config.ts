export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', 'nuxt-icon', 'nuxt-highcharts'],
  css: [
    'vue3-toastify/dist/index.css'
  ],
  plugins: [
    { src: '~/plugins/toast.client.ts', mode: 'client' }
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  components: {
    dirs: [
      {
        path: '~/components',
        priority: 2  // Higher priority
      },
      {
        path: '~/components/ui',
        priority: 1  // Lower priority
      }
    ]
  },

  compatibilityDate: '2025-04-25'
})