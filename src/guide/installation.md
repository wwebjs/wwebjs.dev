---
lang: en-US
title: Installation
description: Installation guide for node.js and whatsapp-web.js
---

# {{ $frontmatter.title }}

Before getting started with whatsapp-web.js, it's essential for you to install [Node.js](#installing-node-js) and [whatsapp-web.js](#installing-whatsapp-web-js) itself on your machine. Please note that whatsapp-web.js v1 requires Node v18 or higher.

::: tip
To check if you already have Node installed on your machine, run `node -v` in your **terminal**. If the output is `v18` or higher, then you're good to go! Otherwise you should continue reading.

::: warning
If you already have Node installed, but you are using an older version that is below v18, you need to upgrade your Node version too. You can do this by installing the [nvm](https://github.com/nvm-sh/nvm#installing-and-updating).
:::

## Installing Node.js

### Installation on Windows

Installing Node on Windows works just like any other program. 

1. Download any [version above 18+](https://nodejs.org/) from the official Node.js website.
2. After the download is complete, open the downloaded file and follow the installer steps.
3. Once the installation is complete, you can use Node.js and npm in your terminal.

### Installation on macOS

Installing Node on macOS is as easy as with installing Node on Windows.

1. Download any [version above 18+](https://nodejs.org/) from the official Node.js website.
2. After the download is complete, open the downloaded file and follow the installer steps.
3. Once the installation is complete, you can use Node.js and npm in your terminal.

You can also install Node.js using [Homebrew](https://brew.sh/), if you have that already installed.

```bash
# Run this command in your terminal
brew install node
```

### Installation on Linux

You can install Node.js on Linux using the [package manager](https://nodejs.org/en/download/package-manager/) of your choice. 

#### Installation on no-gui systems

If you want to installing whatsapp-web.js on a system without a GUI, such as a ``linux server image``, and you need puppeteer to emulate the Chromium browser, there are a few additional steps you'll need to take. 

First, you'll need to install dependencies required by puppeteer, such as the necessary libraries and tools for running a headless Chromium browser. 

```bash	
sudo apt install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

After installing these dependencies, you can proceed with installing whatsapp-web.js and puppeteer as usual. When puppeteer installs, it will download a version of Chromium suitable for headless environments.

## Setup essentials

After installed Node, you can now run commands in your terminal. We recommend using [npm](https://www.npmjs.com/)(Node's package manager) that comes bundelt with every Node installation. However, you have the option to use either [Yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/) as your package manager. The guide supports all three package managers in the examples.

### Choose an editor

As for code editors, you have the freedom to choose any editor you prefer. However, we recommend [Visual Studio Code](https://code.visualstudio.com/). It's a free and open-source editor available for Windows, macOS, and Linux. Visual Studio Code offers a plethora of features, extensions, and a vibrant community, making it immensely popular and user-friendly. 

If you don't find VSC appealing, you can explore a list of other code editors here:

- [Atom](https://atom.io/)
- [Sublime Text](https://www.sublimetext.com/)
- [Notepad++](https://notepad-plus-plus.org/)
- [Brackets](http://brackets.io/)
- [WebStorm](https://www.jetbrains.com/webstorm/)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/)

### Create your project folder

::: tip
**Setup via Terminal**

Depending on your preference, you can create a new project folder using the terminal.

The folder is created on your directory you are currently located in. You can navigate to the location of your choice on your machine via `cd path/to/your/folder` and create a new folder.

```bash	
mkdir wwebjs-bot
cd wwebjs-bot
```
:::

Navigate to the location of your choice on your machine and create a new folder named `wwebjs-bot` (or whatever you want) for your project. Next you'll need to open your terminal in your folder.

::: tip
If you use [Visual Studio Code](https://code.visualstudio.com/), you can press <code>Ctrl + `</code> to open its integrated terminal.
:::

With the terminal open, run the `node -v` command to ensure that you've successfully installed Node.js. If it outputs `v18` or higher, you're all set! If not, you should consider reinstalling Node.js and following the installation steps again.

#### Initialize your project

<CodeGroup>
<CodeGroupItem title="NPM" active>

```bash
npm init
```
</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash
yarn init
```

</CodeGroupItem>

<CodeGroupItem title="PNPM">

```bash
pnpm init
```

</CodeGroupItem>
</CodeGroup>

This command creates a `package.json` file for your project, which will keep track of the dependencies your project uses, as well as other information. When you run it, it will ask you a series of questions. You should fill them out according to your project's needs. If you're unsure about something or want to skip it entirely, you can leave it blank and press Enter.

::: tip

For a quick start, simply run the following command to automatically fill in all the details for you.

<CodeGroup>
<CodeGroupItem title="NPM" active>

```bash
npm init -y
```
</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash
yarn init -y
```

</CodeGroupItem>

<CodeGroupItem title="PNPM">

```bash
pnpm init -y
```

</CodeGroupItem>
</CodeGroup>

::: details Example `package.json` file
```json
{
  "name": "wwebjs-bot",
  "version": "1.0.0",
  "description": "This is a simple example for this library.",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```
:::

Once you've completed that step, you're all set to install whatsapp-web.js!

## Installing whatsapp-web.js

Now that you have your project folder set up, you can install whatsapp-web.js. To do this, open your terminal again within your folder and execute the following command:

<CodeGroup>
<CodeGroupItem title="NPM" active>

```bash
npm install whatsapp-web.js
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash
yarn add whatsapp-web.js
```

</CodeGroupItem>
<CodeGroupItem title="PNPM">

```bash
pnpm add whatsapp-web.js
```

</CodeGroupItem>
</CodeGroup>

In your console, the downloading progress will now be displayed. Once the download is completed, you'll be ready to start with your project.
