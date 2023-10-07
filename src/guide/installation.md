---
lang: en-US
title: Installation
description: Installing Node on your machine
---

# {{ $frontmatter.title }}

Here is an overview of what your project directory will look like in the further steps of this guide:

```bash
└─ whatsapp-app
  ├─ .wwebjs_auth
  │  └─ ...
  ├─ .wwebjs_cache
  │  └─ ...
  ├─ node_modules
  │  └─ whatsapp-web.js
  ├─ main.js       # <- What we will create
  ├─ package-lock.json
  └─ package.json
```

## Installing Node.js

Before you can start working on your project, you need to install [Node.js](https://nodejs.org/) first. whatsapp-web.js `v1` is requring Node.js `v12` or higher. (This can change in the future )

::: tip
To check if you already have Node installed on your machine, run `node -v` in your **terminal**. If the output is `v12` or higher, then you're good to go! Otherwise you should continue reading this.

::: warning
If you already have Node installed, but you are using an older version that is below v12, you need to upgrade your Node version too. You can do this by installing the [nvm](https://github.com/nvm-sh/nvm#installing-and-updating).
:::

### Installation on Windows

Installing Node on Windows works just like any other program. Download any [version above 12+](https://nodejs.org/), open the downloaded file and follow the installer steps.

### Installation on macOS

This also applies to macOS. Download any [version above 12+](https://nodejs.org/), open the downloaded file and follow the installer steps. You may need to use a package manager like [Homebrew](https://brew.sh/) though. Use this with the command `brew install node`.

### Installation on Linux

If you are using Linux, chances are you already have Node installed. Check this with `node -v`, if you have an approximate output of `12.0` or higher, you can continue scrolling. If this is not the case, we recommend that you visit [this Node.js](https://nodejs.org/en/download/package-manager/) site.

## Setup essentials

After installed Node, you can now run commands in your console. We recommend using [npm](https://www.npmjs.com/)(Node's package manager) that comes with every Node installation, but you can use both [Yarn](https://yarnpkg.com/) and [pnpm](https://pnpm.io/) as package manager. However, we support all package managers in the guide.

### Choose an editor

You can use any editor you want, but we recommend using [Visual Studio Code](https://code.visualstudio.com/). It's a free and open source editor, which is available for Windows, macOS and Linux. It has a lot of features and extensions, which makes it very popular.

If you don't find VSC appealing, you can explore a list of other code editors here:

- [Atom](https://atom.io/)
- [Sublime Text](https://www.sublimetext.com/)
- [Notepad++](https://notepad-plus-plus.org/)
- [Brackets](http://brackets.io/)
- [WebStorm](https://www.jetbrains.com/webstorm/)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/)


### Create your project folder

Go to a location of your choice on your computer and establish a fresh directory anywhere, naming it `whatsapp-app` (or any other name you prefer). Next you'll need to open your terminal in your folder, type this command in and execute it. If you're using [Visual Studio Code](https://code.visualstudio.com/), you can open it by clicking on `Terminal` in the top menu bar and then below on the `New Terminal` button. 

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
  
This start a seqeuence, wich will ask you questions about your project. If you're not sure of something or want to skip it as a whole, leave it blank and press enter. 

When that command is executed, it will create a file named `package.json` in your folder. This file is essential for the project as it contains all the important information about the project and its dependencies. The file's content structure is expected to be somewhat like this:

```json
{
  "name": "whatsapp-app",
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

::: tip
For a quick start, you can execute the following command to automate the setup process.

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
:::

## Installing whatsapp-web.js

Now that you have your project folder set up, you can install whatsapp-web.js. To do this, you need to open your terminal agian in your folder and execute the following command:

::: tip
If you use [Visual Studio Code](https://code.visualstudio.com/), you can press <code>Ctrl + `</code> (backtick) to open its integrated terminal.
:::

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

In your console will now show up the downloading progress. After the download is completed, you are ready to go to start with your application.