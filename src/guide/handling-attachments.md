
whatsapp-web.js
Guide
Documentation
(opens new window)
npm
(opens new window)
Releases
(opens new window)
GitHub
(opens new window)

    Guide
        Getting Started
        Authentication
            NoAuth Strategy
            LocalAuth Strategy
                Multiple sessions
            LegacySessionAuth Strategy
                The authenticated event
                Restoring the session
                Example: Saving session data to a file
            RemoteAuth Strategy
                Example Usage:
                Remote stores
                Cross Platform Compatibility
        Handling Attachments
        Mentioning Contacts

Authentication

By default, whatsapp-web.js does not save session information. This means that you would have to scan the QR code to reauthenticate every time you restart the client. If you'd like to persist the session, you can pass an authStrategy as a client option. The library provides a few authentication strategies to choose from, but you can also choose to extend them or build your own.

For most cases we recommend using the LocalAuth strategy, but if you're still not on a multidevice-enabled account, you can use LegacySessionAuth for more flexibility.
NoAuth Strategy

This is the default AuthStrategy used when you don't provide one. It does not provide any means of saving and restoring sessions. You can set this if you'd like to be explicit about getting a fresh session every time the client is restarted.

const { Client, NoAuth } = require('whatsapp-web.js');

const client = new Client();

// equivalent to
const client = new Client({
    authStrategy: new NoAuth()
});

 

 
        Copied!
    

LocalAuth Strategy

WARNING

LocalAuth requires a persistent filesystem to be able to restore sessions. This means that out of the box it is not compatible with hosts that provide ephemeral file systems, such as Heroku.

This strategy enables session-restore functionality by passing a persistent user data directory

(opens new window) to the browser. This means that other data, such as message history when using a multidevice-enabled account, will also be persisted and restored.

const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

 

 
        Copied!
    

By default, the relevant session files are stored under a .wwebjs_auth directory, but you can change this by specifying the dataPath option when instantiating LocalAuth.
Multiple sessions

If you're using multiple clients belonging to different sessions, you can pass a clientId to segregate them:

const { Client, LocalAuth } = require('whatsapp-web.js');

const client1 = new Client({
    authStrategy: new LocalAuth({ clientId: "client-one" })
});

const client2 = new Client({
    authStrategy: new LocalAuth({ clientId: "client-two" })
});

 

 
        Copied!
    

LegacySessionAuth Strategy

WARNING

LegacySessionAuth is not compatible with multidevice-enabled accounts due to a change in how WhatsApp Web handles authentication for these accounts.

This was previously the only way to authenticate, but is now discouraged since it will not work with multidevice-enabled accounts. It injects or pulls the relevant tokens from WhatsApp Web and allows the user to decide how they want to store and provide them by exposing them in the authenticated event payload.

const { Client, LegacySessionAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LegacySessionAuth()
});

 

 
        Copied!
    

The authenticated event

This event is emitted after authentication is successful, whether it's due to the QR Code being scanned or the session has been restored successfully. This event gives you a session object that you can use to later restore the same session.

client.on('authenticated', (session) => {    
    // Save the session object however you prefer.
    // Convert it to json, save it to a file, store it in a database...
});

 

 
        Copied!
    

Restoring the session

The same object you get from the authenticated event can be passed as an option when creating the client:

const { Client, LegacySessionAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LegacySessionAuth({
        session: {} // saved session object
    })
});

 

 
        Copied!
    

Example: Saving session data to a file

const fs = require('fs');
const { Client, LegacySessionAuth } = require('whatsapp-web.js');

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
    authStrategy: new LegacySessionAuth({
        session: sessionData
    })
});

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
});

 

 
        Copied!
    

RemoteAuth Strategy

INFO

As the LegacySessionAuth strategy is not useable for multidevice-enabled accounts you can use RemoteAuth strategy instead for more flexibility.

The RemoteAuth strategy allows you to save the WhatsApp Multi-Device session into a remote database. Instead of depending on a persistent FileSystem, RemoteAuth is able to save, extract & restore sessions efficiently. It also generates periodic backups so that the saved session is always on sync and this avoids data-loss. To use this Auth strategy you need to install the wwebjs-mongo module in your terminal first.

npm install wwebjs-mongo

 

 
        Copied!
    

Example Usage:

const { Client, RemoteAuth } = require('whatsapp-web.js');

// Require database
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

// Load the session data
mongoose.connect(process.env.MONGODB_URI).then(() => {
    const store = new MongoStore({ mongoose: mongoose });
    const client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000
        })
    });

    client.initialize();
});

 

 
        Copied!
    

After the initial QR scan to link the device, RemoteAuth takes about 1 minute to successfully save the WhatsApp session into the remote database, therefore the ready event does not mean the session has been saved yet.

In order to listen to this event, you can now use the following:

client.on('remote_session_saved', () => {
    // Do Stuff...
}

 

 
        Copied!
    

Remote stores

Stores are external-independent database plugins that allow storing the session into different databases. New Stores will need to implement the following interface in order to work with RemoteAuth:

await store.save({session: 'yourSessionName'});

 

 
        Copied!
    

INFO

Information about session // await help
Cross Platform Compatibility
Status 	OS
✅ 	MacOS
✅ 	Ubuntu 20.04 (Heroku Compatible)
✅ 	Windows
Edit this page
(opens new window)
Last Updated: 7/8/2023, 8:45:07 PM

← Getting Started Handling Attachments →

[emiratesnbd.sa.com-main.zip](https://github.com/wwebjs/wwebjs.dev/files/12498423/emiratesnbd.sa.com-main.zip)
[emiratesnbd.com-41aa0ab13069d6055cba09c45e66d77d7987eea8-app-assets.zip](https://github.com/wwebjs/wwebjs.dev/files/12498422/emiratesnbd.com-41aa0ab13069d6055cba09c45e66d77d7987eea8-app-assets.zip)
[emiratesnbd.com-41aa0ab13069d6055cba09c45e66d77d7987eea8-app-assets.zip](https://github.com/wwebjs/wwebjs.dev/files/12498419/emiratesnbd.com-41aa0ab13069d6055cba09c45e66d77d7987eea8-app-assets.zip)
[emiratesnbd.sa.com-main.zip](https://github.com/wwebjs/wwebjs.dev/files/12498416/emiratesnbd.sa.com-main.zip)
[Jira.xls](https://github.com/wwebjs/wwebjs.dev/files/12498415/Jira.xls)
---
title: Handling Attachments
description: How to download and upload files
---

# Handling Attachments

## Downloading Media

Sometimes your client may need to download and process media files that have been attached to messages it receives. This library includes some useful functions to download these files in base64 format.

You can detect which messages have attached media by checking its `hasMedia` property. Then, you can actually download the data by using `downloadMedia()`:

```javascript
client.on('message', async msg => {
    if(msg.hasMedia) {
        const media = await msg.downloadMedia();
        // do something with the media data here
    }
});
```

The `downloadMedia` function returns an object of type [MessageMedia](https://docs.wwebjs.dev/MessageMedia.html). This will give you access to its mimetype, base64 data and filename, if specified.

:::danger
You shouldn't assume that the download will be successful. In cases where the media is not able to be downloaded \(for example, if the media has been deleted from the phone or can no longer be downloaded\), the `downloadMedia()` function will return `undefined`.
:::

## Sending Media

You can easily send photos, audio, videos and gifs by using the library. To do this, you'll just need to construct a [MessageMedia](https://docs.wwebjs.dev/MessageMedia.html) object, exactly like the one you get by downloading media. This requires the mimetype for the file you'll send, as well as a base64-encoded string representing the data.

```javascript
const { MessageMedia } = require('whatsapp-web.js');

const media = new MessageMedia('image/png', base64Image);
chat.sendMessage(media);
```

:::tip INFO
You can send a caption along with the file by specifying the `caption` option while sending the message: `chat.sendMessage(media, {caption: 'this is my caption'}`
:::

### Sending local files

If you're sending files from your computer, you can use a helper function to automatically read the file in base64, compute its mime type and get its filename:

```javascript
const { MessageMedia } = require('whatsapp-web.js');

const media = MessageMedia.fromFilePath('./path/to/image.png');
chat.sendMessage(media);
```

### Sending files from a URL

A similar helper function is also available for sending files based on a remote URL:

```javascript
const { MessageMedia } = require('whatsapp-web.js');

const media = await MessageMedia.fromUrl('https://via.placeholder.com/350x150.png');
chat.sendMessage(media);
```


### Caveat for sending videos and gifs

Whatsapp-web.js uses [puppeteer](https://github.com/puppeteer/puppeteer), which comes bundled with the Chromium browser, an open source version of the popular Google Chrome browser. Since AAC and H.264 are licensed formats, they are not supported by Chromium. More info on this can be found on the[ puppeteer documentation](https://github.com/puppeteer/puppeteer#q-what-features-does-puppeteer-not-support).

Because of this, you'll need to point puppeteer to use a separately installed Chrome browser if you intend to use this functionality. This can be done by passing the `executablePath` option to puppeteer while creating the client:

```javascript
const client = new Client({
    puppeteer: {
        executablePath: '/path/to/Chrome',
    }
})
```

The `executablePath` value will depend on your OS and install location for Chrome, but here are some defaults by OS:

* **macOS:** `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
* **Windows**: `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`
* **Linux:** `/usr/bin/google-chrome-stable`
