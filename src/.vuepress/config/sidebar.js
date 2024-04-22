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
            text: "CREATING YOUR BOT",
            children: [
                "/guide/creating-your-bot/README.md",
                "/guide/creating-your-bot/authentication.md",
                "/guide/creating-your-bot/handling-attachments.md",
                "/guide/creating-your-bot/mentioning-contacts.md",
                "/guide/creating-your-bot/mentioning-groups.md",
            ],
        },
    ],
};