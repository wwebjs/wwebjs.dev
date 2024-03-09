---
lang: en-US
title: Authentication
description: Authenticate your bot with WhatsApp
---

# {{ $frontmatter.title }}

By default, whatsapp-web.js does not save session information. This means that you would have to scan the QR-Code to reauthenticate every time you restart the client. If you'd like to persist the session, you can pass an `authStrategy` as a client option. The library provides a few authentication strategies to choose from, but you can also choose to extend them or build your own.

::: tip
For most usage cases, we would recommend the [`LocalAuth` strategy](#localauth-strategy) because it is the easiest to use. However, you can also use the [RemoteAuth strategy](#remoteauth-strategy) for more flexibility and customization.
:::

## `NoAuth` Strategy

This is the default `authStrategy` used when you don't provide one. It does not provide any means of saving and restoring sessions. You can set this if you'd like to be explicit about getting a fresh session every time the client is restarted. 

```js {1,7}
const { Client, NoAuth } = require('whatsapp-web.js');

const client = new Client();

// equivalent to:
const client = new Client({
    authStrategy: new NoAuth()
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
    authStrategy: new LocalAuth()
});
```

### Location Path

By default, the relevant session files are stored under a `.wwebjs_auth` directory. However, you can change this by specifying the `dataPath` option when instantiating `LocalAuth` Strategy:

```js {4-6}
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'yourFolderName'
    })
});
```

This will create a `yourFolderName` folder with a stored session.

### Multiple Sessions

If you're interested in using multiple clients belonging to different sessions, you can pass a `clientId` to segregate them from each other. This is useful when you want to run multiple clients at the same time.

```js {3-6,8-11}
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

The [RemoteAuth strategy](#remoteauth-strategy) allows you to save the WhatsApp Multi-Device session in a remote database. Instead of relying on a persistent file system, RemoteAuth can efficiently save, extract, and restore sessions. It also generates periodic backups to ensure that the saved session is always in sync and avoids data loss.

```js {1,3,5-8}
const { Client, RemoteAuth } = require('whatsapp-web.js');

const store = new MongoStore({ mongoose: mongoose });
const client = new Client({
    authStrategy: new RemoteAuth({
        store: store,
        backupSyncIntervalMs: 300000
    })
});
```

### Remote Stores

Stores are external-independent database plugins that enable storing the session into different databases. To work with RemoteAuth, new stores must implement the following interface.

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

You can either implement your own store or use already implemented ones.

#### MongoDB Store

Before you can use this Auth strategy you need to install the [`wwebjs-mongo`](https://github.com/jtouris/wwebjs-mongo) module in your terminal:

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

#### AWS S3 Store

Before you can use this Auth strategy you need to install the [`wwebjs-aws-s3`](https://github.com/arbisyarifudin/wwebjs-aws-s3) module in your terminal:

<CodeGroup>
<CodeGroupItem title="NPM" active>

```bash
npm install wwebjs-aws-s3
```

</CodeGroupItem>
<CodeGroupItem title="YARN">

```bash
yarn add wwebjs-aws-s3
```

</CodeGroupItem>
<CodeGroupItem title="PNPM">

```bash
pnpm add wwebjs-aws-s3
```

</CodeGroupItem>
</CodeGroup>

Once the package is installed, you have to import it and pass it to the `RemoteAuth`strategy as follows:

```js {1-9,11-17,19-22,24-32,34-41}
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
        dataPath: 'yourFolderName',
        store: store,
        backupSyncIntervalMs: 600000
    })
});
```

### Session Saved

After the initial QR scan to link the device, RemoteAuth takes about `1 minute` to successfully save the WhatsApp session into the remote database, therefore the ready event does not mean the session has been saved yet. In order to listen to this event, you can now use the following:

```js {1-3}
client.on('remote_session_saved', () => {
    // Do Stuff...
}
```

### Platform Compatibility

| Status    | OS                                |
| :-------: |:--------------------------------- |
| ✅        | MacOS                             |
| ✅        | Windows                           |
| ✅        | Ubuntu 20.04 (Heroku Compatible)  |