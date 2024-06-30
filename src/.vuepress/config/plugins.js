import { docsearchPlugin } from '@vuepress/plugin-docsearch'

export const plugins = [
  docsearchPlugin({
    appId: '8AJ0E0DA1M',
    apiKey: 'fcc76d2a115c516c8d01512303f43a8b',
    indexName: 'wwebjs',
    locales: {
      '/': {
        placeholder: 'Search',
        translations: {
          button: {
            buttonText: 'Search'
          }
        }
      }
    }
  })
];