---
lang: en-US
title: Mentions
description: How to get and send messages with mentions
---

# {{ $frontmatter.title }}

With the help of the library, you can mention WhatsApp users and groups you are participating in.

## Mentioning Users

![Example of message with a mentioned users](./images/mentions.png)

:::tip
It is possible to mention also those users who are not in your contact list.
:::

### Getting Mentioned Users

You can get all users that have been mentioned in a message by using `getMentions` method of a `Message` object. This will conveniently return a list of [`Contact`](https://docs.wwebjs.dev/Contact.html) objects:

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

### Sending Messages with User Mentions

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

## Mentioning Groups

![Example of a message with a mentioned group](./images/group-mentions.png)

:::tip
As a name of a group to mention, you can provide **your custom group name** (like in the image above). It aslo can be an original group name, this is for your choice.
:::

### Getting Mentioned Groups

You can get all groups that have been mentioned in a message by using `getGroupMentions` method of a `Message` object. This will conveniently return a list of [groups](https://docs.wwebjs.dev/GroupChat.html):

```javascript
// client initialization...

client.on('message', async (msg) => {
    const group_mentions = await msg.getGroupMentions();
    
    for (const group of group_mentions) {
        console.log(`Group ${group.name} with an ID ${group.id._serialized} was mentioned`);
    }
});
```

This is just a helper function that simply prints group names mentioned in the message along with their IDs for demonstration.

### Sending Messages with Group Mentions

You can send a message with clickable group mentions, and similar to [user mentions](./#mentioning-users), when the group mention is tapped, a chat with that mentioned group will be opened.

:::warning IMPORTANT
Users who do not participate in the mentioned group, will not be able to get that group opened by tapping on its mention, the same when the group does not exist.
:::

```javascript
// client initialization...

client.on('message', async (msg) => {    
    if (msg.body === '!mentionGroups') {
        const chat = await msg.getChat(); // defining chat to send the group mention to
        const groupId = 'YYYYYYYYYY@g.us'; // defining an ID of a group to mention

        // To mention one group:
        await chat.sendMessage(
            `@${groupId}`,
            { groupMentions: { subject: 'Your Group Name Here', id: groupId } }
        );

        // To mention a list of groups:
        const anotherGrpId = 'XXXXXXXXXX@g.us'; // defining another ID of a group to mention
        await chat.sendMessage(
            `Here can be your custom text... @${groupId}, @${anotherGrpId}`, {
            groupMentions: [
                { subject: 'Some Group Name Of Your Choice', id: groupId },
                { subject: 'Some Another Group Name', id: anotherGrpId }
            ]
        });
    }
});
```