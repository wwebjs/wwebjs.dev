---
lang: en-US
title: Authentication
description: What's new in whatsapp-web.js lasted version
---

# {{ $frontmatter.title }}

By default, whatsapp-web.js does not save session information. This means that you would have to scan the QR-Code to reauthenticate every time you restart the client. If you'd like to persist the session, you can pass an `authStrategy` as a client option. The library provides a few authentication strategies to choose from, but you can also choose to extend them or build your own.

For most usage cases we would recommend the [`LocalAuth` strategy](#localauth-strategy), because it is the easyist to use. 

## `NoAuth` Strategy

This is the default `authStrategy` used when you don't provide one. It does not provide any means of saving and restoring sessions. You can set this if you'd like to be explicit about getting a fresh session every time the client is restarted. 

```js {1,7}
const { Client, NoAuth } = require('whatsapp-web.js');

const client = new Client();

// equivalent to
const client = new Client({
    authStrategy: new NoAuth();
});
```

## `LocalAuth` Strategy

:::warning
`LocalAuth` requires a persistent filesystem to be able to restore sessions. This means that out of the box it is not compatible with hosts that provide ephemeral file systems, such as Heroku.
:::

This strategy enables session-restore functionality by passing a persistent [user data directory](https://chromium.googlesource.com/chromium/src/+/master/docs/user_data_dir.md) to the browser. This means that other data, such as message history when using a multidevice-enabled account, will also be persisted and restored. 

```js {1,4}
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth();
});
```

By default, the relevant session files are stored under a `.wwebjs_auth` directory, but you can change this by specifying the `dataPath` option when instantiating `LocalAuth`.

### Multiple sessions

If you're interrested in using multiple clients belonging to different sessions, you can pass a `clientId` to segregate them from each other:

```js {1,3-6,8-11}
const { Client, LocalAuth } = require('whatsapp-web.js');

const client1 = new Client({
    authStrategy: new LocalAuth({
    clientId: "client-one" })
});

const client2 = new Client({
    authStrategy: new LocalAuth({
    clientId: "client-two" })
});
```

## `RemoteAuth` Strategy

::: danger INFO
As the [`LegacySessionAuth` strategy](https://github.com/pedroslopez/whatsapp-web.js/blob/main/src/authStrategies/LegacySessionAuth.js) is not useable anymore since [multidevice-enabled accounts](https://blog.whatsapp.com/one-whatsapp-account-now-across-multiple-phones) you can use [`RemoteAuth` strategy](#remoteauth-strategy) instead for more flexibility. 
::: 

The [RemoteAuth strategy](#remoteauth-strategy) allows you to save the WhatsApp Multi-Device session in a remote database. Instead of relying on a persistent file system, RemoteAuth can efficiently save, extract, and restore sessions. It also generates periodic backups to ensure that the saved session is always in sync and avoids data loss.

To use this Auth strategy you need to install the `wwebjs-mongo` module in your terminal first.

<CodeGroup>
<CodeGroupItem title="NPM" active>

```bash
npm install wwebjs-mongo
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash
yarn add wwebjs-mongo
```

</CodeGroupItem>
<CodeGroupItem title="PNPM">

```bash
pnpm add wwebjs-mongo
```

</CodeGroupItem>
</CodeGroup>

Once the package is installed, you have to import it and pass it to the `RemoteAuth` strategy as follows:

```js {1,4-5,8-9,11-14}
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
```

### Session saved

After the initial QR scan to link the device, RemoteAuth takes about `1 minute` to successfully save the WhatsApp session into the remote database, therefore the ready event does not mean the session has been saved yet.

In order to listen to this event, you can now use the following:

```js
client.on('remote_session_saved', () => {
    // Do Stuff...
}
```

### Remote stores
Stores are external-independent database plugins that allow storing the session into different databases. New Stores will need to implement the following interface in order to work with RemoteAuth:

<CodeGroup>
<CodeGroupItem title="sessionExists" active>

```js
await store.sessionExists({session: 'yourSessionName'});
```

</CodeGroupItem>
<CodeGroupItem title="save">

```js
await store.save({session: 'yourSessionName'});
```

</CodeGroupItem>
<CodeGroupItem title="sessionExists">

```js
await store.extract({session: 'yourSessionName'});
```

</CodeGroupItem>
<CodeGroupItem title="delete" active>

```js
await store.delete({session: 'yourSessionName'});
```

</CodeGroupItem>
</CodeGroup>

## Status events

These events are not bound to a single authentication strategy; they will be fired for any strategy.

### Authenticated

```js {2-4}
// When the client is authenticated, run this code
client.once('authenticated', () => {
    console.log('AUTHENTICATED');
});
```

### Failed to authenticate

```js {2-5}
// When the client is failed to authenticate, run this code
client.once('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});
```

#### Next steps

Now that you have picked a strategy, we go on to advanced our configuration. 