---
title: Mentioning Contacts
description: How to get and send messages with mentioned Contacts
---

# Mentioning Contacts
![Example of message with a mentioned Contact](./images/mentions.png)

## Getting mentioned Contacts

You can get all Contacts that have been mentioned in a message by using `getMentions()`. This will conveniently return a list of [Contacts](https://docs.wwebjs.dev/Contact.html).

```javascript
client.on('message', async (msg) => {
    const mentions = await msg.getMentions();
    
    for(let contact of mentions) {
        console.log(`${contact.pushname} was mentioned`);
    }
});
```

This is just a helper function for parsing the `mentionedIds` array available on messages. This just contains a list of user ids, so you can use this instead if you don't intend to do anything like getting their name or accessing any properties on their Contact.

## Sending messages with mentions

You can mention other contacts by using the `mentions` option when sending a message. Note that the message text needs to also reference mentioned contacts by using the format `@[number]`.

```javascript
// Mention contacts that send you a message

client.on('message', async (msg) => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    
    await chat.sendMessage(`Hello @${contact.id.user}`, {
        mentions: [contact]
    });
});
```

#### Example: Mention all group members

The following is a simple command that mentions all contacts in a group if someone sends a `!everyone` message:

```javascript
// Mention everyone
client.on('message', async (msg) => {
    if(msg.body === '!everyone') {
        const chat = await msg.getChat();
        
        let text = "";
        let mentions = [];

        for(let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);
            
            mentions.push(contact);
            text += `@${participant.id.user} `;
        }

        await chat.sendMessage(text, { mentions });
    }
});
```

