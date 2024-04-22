---
lang: en-US
title: Mentioning Groups
description: How to get and send messages with mentioned Groups
---

# Mentioning Groups
![Example of message with a mentioned group](./images/group-mentions.png)

## Getting Mentioned Groups

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

## Sending Messages with Group Mentions

You can send a message with clickable group mentions, and similar to [contact mentions](/mentioning-contacts/), when the group mention is tapped, a chat with that mentioned group will be opened.

:::tip
As a name of a group to mention, you can provide **your custom group name**. It aslo can be an original name, this is for your choice.
:::

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