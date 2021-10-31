---
title: Resuming Sessions
---

# Resuming Sessions

You probably don't want to have to scan a QR code every time you restart your bot. This can be done by saving the session info you get from the `authenticated` event and later passing it as an option while instantiating the client.

## The authenticated event

This event is emitted after authentication is successful, whether it's due to the QR Code being scanned or the session has been restored successfully. This event gives you a `session` object that you can use to later restore the same session.

```javascript
client.on('authenticated', (session) => {    
    // Save the session object however you prefer.
    // Convert it to json, save it to a file, store it in a database...
});
```

## Restoring the session

The same object you get from the `authenticated` event can be passed as an option when creating the client:

```javascript
const client = new Client({
    session: {} // saved session object
});
```

## Example: Saving session data to a file

```javascript
const fs = require('fs');
const { Client } = require('whatsapp-web.js');

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
    session: sessionData
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
