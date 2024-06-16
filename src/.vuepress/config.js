import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { head, navbar, sidebar, plugins } from './config/index.js'

export default defineUserConfig({
  head,
  locales: {
    // The key is the path for the locale to be nested under.
    // As a special case, the default locale can use '/' as its path.
    '/': {
      lang: 'en-US',
      description: 'A WhatsApp client library for NodeJS that connects through the WhatsApp Web browser app',
    }
  },
  bundler: viteBundler(),
  theme: defaultTheme({
    docsRepo: 'https://github.com/wwebjs/wwebjs.dev',
    docsBranch: 'main',
    docsDir: 'src',
    repo: 'https://github.com/pedroslopez/whatsapp-web.js',
    logo: '/images/banner_green_green.png',
    colorModeSwitch: true,
    locales: {
      '/': {
        selectLanguageName: 'English',
        navbar: navbar,
        sidebar: sidebar,
      }
    },
  }),
  plugins: plugins
})
