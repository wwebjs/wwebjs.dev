import { docsearchPlugin } from '@vuepress/plugin-docsearch'

const { ALGOLIA_DOCSEARCH_APP_ID, ALGOLIA_DOCSEARCH_API_KEY } = process.env;

export const plugins = [
  docsearchPlugin({
    appId: '8AJ0E0DA1M',
    apiKey: 'fcc76d2a115c516c8d01512303f43a8b',
    indexName: 'wwebjs_guide',
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