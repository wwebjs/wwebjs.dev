---
lang: en-US
title: Create the main file
description: What's new in whatsapp-web.js lasted version
---

# {{ $frontmatter.title }}

Now we really get started with our project, create a new file in your project directory. We suggest that you save the file as `main.js`, but you may name it whatever you wish. If you want to change the name of the file, then don't forget to change it into `"main": main.js` in your `package.json` file.

Here's the base code to get you started:

```js
const { Client } = require('whatsapp-web.js');

// Create a new client instance
const client = new Client();

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
});

// Start your client
client.initialize();
```

:::warning
If you want to install whatsapp-web.js on a system without a GUI (for example you run on a `linux server images` that can only be accessed via a shell and don't have a desktop), there are a couple of things you need to do to enable Puppeteer to emulate the Chromium browser.

For puppeteer to work, you need to install the following dependencies with the `apt-get` command (remember to `apt-get update` before you install)
```bash::no-line-numbers
$ sudo apt install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

You will also need to set the `--no-sandbox` flag in the puppeteer launch command:
```js
...
new Client({
	...,
	puppeteer: {
		args: ['--no-sandbox'],
	}
})
...
```

::: tip
If you are running your program with root privileges, you should also use the `--disable-setuid-sandbox` flag since chromium doesn't support running root with no sandbox by default.
:::

## QR-Code gernation

Since whatsapp-web.js works by running WhatsApp Web in the background and automating its interaction, you'll need to authorize the client by scanning a QR code from WhatsApp on your phone. Right now, we're just logging the text representation of that QR code to the console. Let's install and use [qrcode-terminal](https://www.npmjs.com/package/qrcode-terminal) so we can render the QR code.

<CodeGroup>
<CodeGroupItem title="NPM" active>

```bash
npm install qrcode-terminal
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash
yarn add qrcode-terminal
```

</CodeGroupItem>
<CodeGroupItem title="PNPM">

```bash
pnpm add qrcode-terminal
```

</CodeGroupItem>
</CodeGroup>

And now we'll modify our code to use this new module:

```js {2,11}
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.initialize();
```

Our modification now causes the QR code to be displayed in the terminal upon startup, and from that point onwards, the QR code will be regenerated every 30 seconds until you scan it with your mobile device. After the scan, the client should be authorized, and you will see a `Client is ready!` message being printed out in the terminal.

## Run your application

To run your application, you need to run `node main.js` in your terminal. If you have done everything correctly and followed the steps you have now a conncted client to WhatsApp Web.

::: tip
You can open your `package.json` file and edit the `"scripts": {}` field to start your application easier. You can then `npm start` in your terminal to start the process!

```json
"scripts": {
    "start": "node ."
},
```

After closing the process with `Ctrl + C`, you can press the up arrow on your keyboard to bring up the latest commands you've run. Pressing up and then enter after closing the process is a quick way to start it up again.
:::

## Listening for messages

To listen for incoming messages, the client has to listen for the `message` event. When a message is received, it emits a Message object in response, providing information about the message. In this example, we aim to receive the message and log it to the console. Here's how you can do it:

```js {2-4}
// Listening to all incoming messages
client.on('message_create', message => {
	console.log(message.body);
});
```

### Replying to messages

To reply to a message, you can use the `sendMessage` method. This method accepts a string as a parameter, which will be sent as a message. This capability also allows you to create commands. Here's an example of a simple ping/pong command:

```js {2-5}
client.on('message_create', message => {
	if (message.body === '!ping') {
		// send back "pong" to the chat the message was sent in
		client.sendMessage(message.from, 'pong');
	}
});
```

The messages object contains also a `reply()` method, which allows you to directly reply to a message. This method also require a string as a parameter, which will be sent as a message.

```js {3-4}
client.on('message_create', message => {
	if (message.body === '!ping') {
		// reply back "pong" directly to the message
		message.reply('pong');
	}
});
```

In this case, notice that we didn't have to specify which chat we were sending the message to.

### Creating commands

You learnd how to create a simple command. You already have an if statement that checks messages for a ping/pong command. Adding other command checks is just as easy; chain an `else if` to your existing condition.

```js {5-7}
client.on('message_create', message => {
	if (message.body === '!ping') {
		message.reply('pong');
	}
	else if (message.body === '!beep') {
		message.reply('meep');
	}
});
```

Now, armed with this knowledge, let's proceed to create more commands. In this case, we will add two additional commands that provide user information. The first command will display the number of open chats on your phone, while the second will reveal the connection information of the client.

For the first command, where we aim to retrieve all the chats, we'll need to make the first line `async`. This change is necessary because we'll need to `await` the `getChats()` method to accurately count all the open chats on the phone.

For the second command, we recive the client information from the `client.info` object. This object contains the `pushname`, `wid.user` and `platform` of the client.

```js {1,8-11,13-20}
client.on('message_create', async message => {
	if (message.body === '!ping') {
		message.reply(message.from, 'pong');
	}
	else if (message.body === '!beep') {
		message.reply(message.from, 'meep');
    }
	else if (message.body === '!chats') {
        const chats = await client.getChats();
        message.reply(message.from, `You have ${chats.length} chats open.`);
    }

	else if (message.body === '!user info') {
    	let info = client.info;
        message.reply(message.from,
            `*Connection info*\n`+
            `User name: ${info.pushname}\n`+
            `My number: ${info.wid.user}\n`+
            `Platform: ${info.platform}`
        );
    }
};
```

#### Next steps

Now that you have a basic understanding of how to create commands and how to connect your client to WhatsApp Web, you can proceed to the next step. In the next section, you will learn more about the authentication and how to save your session, removing the need to scan the QR-Code every time you restart.