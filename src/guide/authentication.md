---
title: Authentication
---

# Authentication

By default, whatsapp-web.js does not save session information. This means that you would have to scan the QR code to reauthenticate every time you restart the client. If you'd like to persist the session, you can pass an `authStrategy` as a client option. The library provides a few authentication strategies to choose from, but you can also choose to extend them or build your own.

For most cases we recommend using the [`LocalAuth` strategy](#localauth-strategy), but if you're still not on a multidevice-enabled account, you can use [`LegacySessionAuth`](#legacysessionauth-strategy) for more flexibility.

## `NoAuth` Strategy

This is the default `AuthStrategy` used when you don't provide one. It does not provide any means of saving and restoring sessions. You can set this if you'd like to be explicit about getting a fresh session every time the client is restarted. 

```js
const { Client, NoAuth } = require('whatsapp-web.js');

const client = new Client();

// equivalent to
const client = new Client({
    authStrategy: new NoAuth()
});
```

## `LocalAuth` Strategy

:::warning
`LocalAuth` requires a persistent filesystem to be able to restore sessions. This means that out of the box it is not compatible with hosts that provide ephemeral file systems, such as Heroku.
:::

This strategy enables session-restore functionality by passing a persistent [user data directory](https://chromium.googlesource.com/chromium/src/+/master/docs/user_data_dir.md) to the browser. This means that other data, such as message history when using a multidevice-enabled account, will also be persisted and restored. 

```js
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});
```

By default, the relevant session files are stored under a `.wwebjs_auth` directory, but you can change this by specifying the `dataPath` option when instantiating `LocalAuth`.

### Multiple sessions
If you're using multiple clients belonging to different sessions, you can pass a `clientId` to segregate them:

```js
const { Client, LocalAuth } = require('whatsapp-web.js');

const client1 = new Client({
    authStrategy: new LocalAuth({ clientId: "client-one" })
});

const client2 = new Client({
    authStrategy: new LocalAuth({ clientId: "client-two" })
});
```

## `LegacySessionAuth` Strategy

:::warning
`LegacySessionAuth` is not compatible with multidevice-enabled accounts due to a change in how WhatsApp Web handles authentication for these accounts.
:::

This was previously the only way to authenticate, but is now discouraged since it will not work with multidevice-enabled accounts. It injects or pulls the relevant tokens from WhatsApp Web and allows the user to decide how they want to store and provide them by exposing them in the `authenticated` event payload.

```js
const { Client, LegacySessionAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LegacySessionAuth()
});
```

### The authenticated event

This event is emitted after authentication is successful, whether it's due to the QR Code being scanned or the session has been restored successfully. This event gives you a `session` object that you can use to later restore the same session.

```javascript
client.on('authenticated', (session) => {    
    // Save the session object however you prefer.
    // Convert it to json, save it to a file, store it in a database...
});
```

### Restoring the session

The same object you get from the `authenticated` event can be passed as an option when creating the client:

```javascript
const { Client, LegacySessionAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LegacySessionAuth({
        session: {} // saved session object
    })
});
```

### Example: Saving session data to a file

```javascript
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
```

## `RemoteAuth` Strategy

::: warning INFO
As the [`LegacySessionAuth` strategy]() is not useable for [multidevice-enabled accounts]()  you can use [`RemoteAuth` strategy]() instead for more flexibility. 
::: 

The [`RemoteAuth` strategy]() allows you to save the WhatsApp Multi-Device session into a remote database. Instead of depending on a persistent FileSystem, RemoteAuth is able to save, extract & restore sessions efficiently. It also generates periodic backups so that the saved session is always on sync and this avoids data-loss. To use this Auth strategy you need to install the `wwebjs-mongo` module in your terminal first.

<code-group>
<code-block title="npm" active>
```bash
npm install wwebjs-mongo
```
</code-block>

<code-block title="yarn">
```bash
yarn add wwebjs-mongo
```
</code-block>
</code-group>

### Example Usage:

```javascript
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
After the initial QR scan to link the device, RemoteAuth takes about `1 minute` to successfully save the WhatsApp session into the remote database, therefore the ready event does not mean the session has been saved yet.

In order to listen to this event, you can now use the following:

```javascript
client.on('remote_session_saved', () => {
    // Do Stuff...
}
```

### Remote stores
Stores are external-independent database plugins that allow storing the session into different databases. New Stores will need to implement the following interface in order to work with RemoteAuth:

<code-group>
<code-block title="save" active>
```javascript
await store.save({session: 'yourSessionName'});
```
</code-block>

<code-block title="delete">
```javascript
await store.delete({session: 'yourSessionName'});
```
</code-block>

<code-block title="sessionExists">
```javascript
await store.sessionExists({session: 'yourSessionName'});
```
</code-block>

<code-block title="extract">
```javascript
await store.extract({session: 'yourSessionName'});
```
</code-block>
</code-group>

::: tip INFO
Information about session // await help
:::

### Cross Platform Compatibility

| Status    | OS                               |
| :-------: |:---------------------------------|
| ✅        | MacOS                            |
| ✅        | Ubuntu 20.04 (Heroku Compatible) |
| ✅        | Windows                          |
