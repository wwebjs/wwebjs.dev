---
title: Interfacing With Groups
description: Learn about the methods and features to handle groups
---

# Interefacing With Group Chats

## Creating a group chat

You can create a group chat by utilizing the Client's [`createGroup()`](https://docs.wwebjs.dev/Client.html#createGroup) method. 

You pass in the name as the first parameter, and an array of IDs you want to add for the second paramters.

```javascript
client.on("ready", async () => {
    await client.createGroup("Testing 1", ["123456789@c.us", "234567980@c.us"])
})
```

This method returns the ID of the created group, and the participants that couldn't be added.

```javascript
client.on("ready', async () => {
  const res = await client.createGroup("Testing 2", ["345678901@c.us", "987654321@c.us"])

  res.gid // ID of the group that was just created (string)
  res.missingParticipants // Participants that couldn't be added to the group, and the reason with more info ({[jid]: {}})
})
