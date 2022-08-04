module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: "whatsapp-web.js",
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description:
    "A WhatsApp client library for NodeJS that connects through the WhatsApp Web browser app",

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: "pedroslopez/whatsapp-web.js",
    docsRepo: "wwebjs/wwebjs.dev",
    docsBranch: "main",
    editLinks: true,
    docsDir: "src",
    lastUpdated: "Last Updated",
    sidebarDepth: 3,
    nav: [
      {
        text: "Guide",
        link: "/guide/",
      },
      {
        text: "Documentation",
        link: "https://docs.wwebjs.dev",
      },
      {
        text: "npm",
        link: "https://npmjs.com/package/whatsapp-web.js",
      },
      {
        text: "Releases",
        link: "https://github.com/pedroslopez/whatsapp-web.js/releases",
      },
    ],
    sidebar: {
      "/guide/": [
        {
          title: "Guide",
          collapsable: false,
          children: [
            "",
            "authentication",
            "handling-attachments",
            "mentioning-contacts",
          ],
        },
      ],
    },
  },

  theme: "yuu",

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    "@vuepress/plugin-back-to-top",
    "@vuepress/plugin-medium-zoom",
    [
      "vuepress-plugin-code-copy",
      {
        align: "bottom",
        color: "#42b983",
        backgroundColor: "#42b983",
      },
    ],
  ],
};
