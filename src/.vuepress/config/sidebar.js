export const sidebar = {
    "/guide/": [
        {
            text: 'Documentation',
            link: 'https://docs.wwebjs.dev/',
        },
        {
            text: "GETTING STARTED",
            children: [
                "/guide/README.md",
                "/guide/what-is-new.md",
                "/guide/installation.md"
            ],
        },
        {
            text: "APPLICATION",
            children: [
                "/guide/application/README.md",
                "/guide/application/authentication.md",
                "/guide/application/configuration.md",
            ],
        },
    ],
};