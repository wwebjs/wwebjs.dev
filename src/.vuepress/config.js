import { defaultTheme } from 'vuepress'
import { searchPlugin } from '@vuepress/plugin-search'
import { head, navbar, sidebar } from './config/index'

export default {
  head: head,
  locales: {
    // The key is the path for the locale to be nested under.
    // As a special case, the default locale can use '/' as its path.
    '/': {
      lang: 'en-US',
      description: 'A WhatsApp client library for NodeJS that connects through the WhatsApp Web browser app',
    }
  },
  theme: defaultTheme({
    docsRepo: 'https://github.com/wwebjs/wwebjs.dev',
    docsBranch: 'candy',
    docsDir: 'src',
    repo: 'https://github.com/wwebjs/wwebjs.dev',
    logo: '/images/banner_green_logo.png',
    colorModeSwitch: true,
    locales: {
      '/': {
        selectLanguageName: 'English',
        navbar: navbar,
        sidebar: sidebar,
      }
    },
  }),
  plugins: [
    searchPlugin({
      locales: {
        '/': {
          placeholder: 'Search'
        }
      },
    }),
  ],
}