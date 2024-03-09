---
lang: en-US
title: Mentioning Contacts
description: How to get and send messages with mentioned Contacts
---

# Mentioning Contacts
![Example of message with a mentioned Contact](./images/mentions.png)

:::tip
It is possible to mention also those users who are not in your contact list.
:::

## Getting Mentioned Users

You can get all users that have been mentioned in a message by using `getMentions` method of a `Message` object. This will conveniently return a list of [users](https://docs.wwebjs.dev/Contact.html):

```javascript
// client initialization...

client.on('message', async (msg) => {
    const mentions = await msg.getMentions();
    
    for (let user of mentions) {
        console.log(`${user.pushname} was mentioned`);
    }
});
```

This is just a helper function for parsing the `mentionedIds` array available on messages. This just contains a list of user IDs, so you can use this instead if you don't intend to do anything like getting their name or accessing any properties on their `Contact`.

## Sending Messages with Mentions

You can mention other user by using the `mentions` option when sending a message. Note that the message text needs to also reference mentioned users by using the format `@[phone number]` **without a '+' at the beginning of a phone number**:

```javascript
// client initialization...

client.on('message', async (msg) => {
    const chat = await msg.getChat();
    let user = await msg.getContact();
    await chat.sendMessage(`Hello @${user.id.user}`, {
        mentions: [user]
    });

    // OR

    let userPhone = '123456789';
    await chat.sendMessage(`Hello @${userPhone}`, {
        mentions: [userPhone + 'c.us']
    });
});
```

:::tip
You can mention users in a message without explicitly referencing them by using the format `@[phone number]` in a message body. Those users will still be mentioned but silently; they won't see their mentioned nicknames in a message body but will still be pinged.
:::

#### Example of Mentioning All Group Members

The following is a simple command that mentions all users in a group if someone sends a `!everyone` message:

```javascript
// client initialization...

client.on('message', async (msg) => {
    if (msg.body === '!everyone') {
        const chat = await msg.getChat();
        
        let text = '';
        let mentions = [];

        for (let participant of chat.participants) {
            mentions.push(`${participant.id.user}@c.us`);
            text += `@${participant.id.user} `;
        }

        await chat.sendMessage(text, { mentions });
    }
});
```