---
title: Authentication
---

# Authentication

By default, whatsapp-web.js does not save session information. This means that you would have to scan the QR code to reauthenticate every time you restart the client. If you'd like to persist the session, you can pass an `authStrategy` as a client option. The library provides a few authentication strategies to choose from, but you can also choose to extend them or build your own.

For most cases we recommend using the [`LocalAuth` strategy](#localauth-strategy) or the [`RemoteAuth` strategy](#remoteauth-strategy) for more flexibility.

## `NoAuth` Strategy

This is the default authentication strategy used when you don't provide one. It does not provide any means of saving and restoring sessions. You can set this if you'd like to be explicit about getting a fresh session every time the client is restarted:

```js
const { Client, NoAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new NoAuth()
});
```

:::tip INFO
The code above is equivalent to:

```js
const { Client } = require('whatsapp-web.js');
const client = new Client();
```
:::

## `LocalAuth` Strategy

:::warning IMPORTANT
`LocalAuth` requires a persistent filesystem to be able to restore sessions. This means that out of the box it is not compatible with hosts that provide ephemeral file systems, such as Heroku.
:::

This strategy enables session-restore functionality by passing a persistent [user data directory](https://chromium.googlesource.com/chromium/src/+/master/docs/user_data_dir.md) to the browser. This means that other data, such as message history, will also be persisted and restored:

```js
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});
```

By default, the relevant session files are stored under a `.wwebjs_auth` directory, but you can change this by specifying the `dataPath` option when instantiating `LocalAuth`:

```js
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'yourFolderName'
    })
});
```

This will create a `yourFolderName` folder with a stored session.

### Multiple Sessions

If you're using multiple clients belonging to different sessions, you can pass a `clientId` to segregate them:

```js
const { Client, LocalAuth } = require('whatsapp-web.js');

const client1 = new Client({
    authStrategy: new LocalAuth({ clientId: 'client-one' })
});

const client2 = new Client({
    authStrategy: new LocalAuth({ clientId: 'client-two' })
});
```

This will create a `wwebjs_auth` folder with folders `session-client-one` and `session-client-two` in it respectively.

## `RemoteAuth` Strategy
[![](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pedroslopez/whatsapp-web.js/pull/1450)

The `RemoteAuth` strategy allows you to save the WhatsApp session into a remote database. Instead of depending on a persistent file system, `RemoteAuth` is able to save, extract & restore sessions efficiently. It also generates periodic backups so that the saved session is always on sync and this avoids data-loss.

### Remote Stores

Stores are external-independent database plugins that allow storing the session into different databases. New stores will need to implement the following interface in order to work with `RemoteAuth`:

<code-group>
<code-block title="save" active>
```javascript
await store.save({ session: 'yourSessionName' });
```
</code-block>

<code-block title="delete">
```javascript
await store.delete({ session: 'yourSessionName' });
```
</code-block>

<code-block title="sessionExists">
```javascript
await store.sessionExists({ session: 'yourSessionName'});
```
</code-block>

<code-block title="extract">
```javascript
await store.extract({ session: 'yourSessionName' });
```
</code-block>
</code-group>

You can implement your own store or use already [implemented ones](./authentication.html#implemented-stores).

### Cross Platform Compatibility

| Status    | OS                                |
| :-------: |:--------------------------------- |
| ✅        | MacOS                            |
| ✅        | Ubuntu 20.04 (Heroku Compatible) |
| ✅        | Windows                          |

### Implemented Stores

There is a couple of already implemented stores that are ready to use:
1. [MongoDB Store](./authentication.html#mongodb-store)
2. [AWS S3 Store](./authentication.html#aws-s3-store)

### MongoDB Store
[![](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jtouris/wwebjs-mongo)

To use this authentication strategy you need to install the `wwebjs-mongo` module in your terminal first:

<code-group>
<code-block title="npm" active>
```bash
npm i wwebjs-mongo
```
</code-block>

<code-block title="yarn">
```bash
yarn add wwebjs-mongo
```
</code-block>
</code-group>

#### Usage Example

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

After the initial QR scan to link the device, `RemoteAuth` takes about **1 minute** to successfully save the WhatsApp session into the remote database, therefore the ready event does not mean the session has been saved yet.

In order to listen to this event, you can now use the following:

```javascript
client.on('remote_session_saved', () => {
    // Do Stuff...
});
```

### AWS S3 Store
[![](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/arbisyarifudin/wwebjs-aws-s3)

To use this authentication strategy you need to install the `wwebjs-aws-s3` module in your terminal first:

<code-group>
<code-block title="npm" active>
```bash
npm i wwebjs-aws-s3
```
</code-block>

<code-block title="yarn">
```bash
yarn add wwebjs-aws-s3
```
</code-block>
</code-group>

#### Usage Example

```js
const { Client, RemoteAuth } = require('whatsapp-web.js');
const { AwsS3Store } = require('wwebjs-aws-s3');
const {
    S3Client,
    PutObjectCommand,
    HeadObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: 'AWS_REGION',
    credentials: {
        accessKeyId: 'AWS_ACCESS_KEY_ID',
        secretAccessKey: 'AWS_SECRET_ACCESS_KEY'
    }
});

const putObjectCommand = PutObjectCommand;
const headObjectCommand = HeadObjectCommand;
const getObjectCommand = GetObjectCommand;
const deleteObjectCommand = DeleteObjectCommand;

const store = new AwsS3Store({
    bucketName: 'example-bucket',
    remoteDataPath: 'example/path/',
    s3Client: s3,
    putObjectCommand,
    headObjectCommand,
    getObjectCommand,
    deleteObjectCommand
});

const client = new Client({
    authStrategy: new RemoteAuth({
        clientId: 'yourSessionName',
        dataPath: './.wwebjs_auth',
        store: store,
        backupSyncIntervalMs: 600000
    })
});

client.initialize();
```
