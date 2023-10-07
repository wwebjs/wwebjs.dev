---
lang: en-US
title: Introduction
description: The introduction to whatsapp-web.js
---

:::warning INFORMATION
The whatsapp-web.js guide is a work in progress, which means there may be typos or unintentional errors. If this happens, please create an [issue on Github](https://github.com/wwebjs/wwebjs.dev/issues/new). The guide may not offer all available functions. To learn more about all the functions available to you in the library, please see the [documentation](https://docs.wwebjs.dev/).
:::

# {{ $frontmatter.title }}

[whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) is not an official library by WhatsApp; it is an Open Source project, meticulously maintained and supported by a passionate community of developers, designed to create automated WhatsApp clients, chatbots, applications and more using [node.js](https://nodejs.org/about).

## Disclaimer

This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with WhatsApp or any of its subsidiaries or its affiliates. The official WhatsApp website can be found at [whatsapp.com](https://whatsapp.com). "WhatsApp" as well as related names, marks, emblems and images are registered trademarks of their respective owners. Also it is not guaranteed you will not be blocked by using this method. WhatsApp does not allow bots or unofficial clients on their platform, so this shouldn't be considered totally safe.

## How It Works

The library operates by launching the WhatsApp Web browser application and managing it using Puppeteer to create a genuine instance of WhatsApp Web, thereby mitigating the risk of being blocked. The WhatsApp API client connects through the WhatsApp Web browser app, accessing its internal functions. This grants you access to nearly all the features available on WhatsApp Web, enabling dynamic handling similar to any other Node.js application.

## Requirement

Important to notice that this Guide is not exactly made for beginners, but we had made it as far as possible easy to understand for everyone. You should at least have a basic understanding of JavaScript and Node.js. If you having trouble you can join the [Discord community](https://discord.gg/wyKybbF) and ask a question in the [#help forum](https://discord.gg/qxbwdQsEAn).

If you are a complete beginner, please take your time to learn more about the basics and come back with a better understanding of JavaScript and Node.js. Here are some free educational resources:

- [JavaScript Basics](https://www.udacity.com/course/javascript-basics--ud804)
- [Modern JavaScript tutorials and examples](https://javascript.info/)
- [Codecademy with it's interactive JavaScript course](https://www.codecademy.com/learn/introduction-to-javascript)
- [NodeSchool learns you JavaScirpt and Node.js](https://nodeschool.io/)
- [Alternative Node.js tutorials on W3Schools](https://www.w3schools.com/nodejs/default.asp)
- [Node.js Documentation](https://nodejs.org/en/docs/)