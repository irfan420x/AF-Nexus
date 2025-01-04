# NEXUS FACEBOOK BOT

* new generation FCA
* auto bypass on automation messages
* simple to make commands of your choice 

[![Version](https://img.shields.io/badge/NEXUS-2.0.0-blueviolet?style=for-the-badge)](https://github.com/Asta-project/Nexusfb)
[![Node](https://img.shields.io/badge/NODE-16+-darkgreen?style=for-the-badge)](https://nodejs.org)
[![License](https://img.shields.io/badge/LICENSE-MIT-red?style=for-the-badge)](LICENSE)

</div>


 <p align="center">
  <a href="#"><img src="http://readme-typing-svg.herokuapp.com?color=cyan&center=true&vCenter=true&multiline=false&lines=NEXUS+BOT+BY+FRANK+AND+ASTA" alt="">

<br>

-------

### ⚡ SUPERCHARGE YOUR CHAT

Transform your Facebook Messenger into an intelligent command center with Nexus Bot - where automation meets elegance.

### 🛠️ NEXUS BOT FEATURES 

```ARCHITECTURE 
📱 MODULAR COMMANDS  │  Advanced chat handling
🔐 ROBUST SECURITY   │  Multi-level permissions
📊 SMART ANALYTICS   │  Real-time monitoring
🔄 STATEFUL CHAT    │  Context-aware replies
```

### 🚀 QUICK START

```bash
git clone https://github.com/Asta-project/Nexusfb
cd nexus-bot
npm install
```

### ⚙️ CONFIG

```js
// config.js
export default {
  "botName": "Nexus",
  "prefix": ".",
  "adminIds": ["100062160914296", "61557780285734"],
  "facebookAccount": {
    "email": "astapersonal1@gmail.com",
    "password": "asta@0123"
  },
  "language": "en",
  "autoRestart": {
    "time": null
  },
  "optionsFca": {
    "forceLogin": true,
    "listenEvents": true,
    "updatePresence": true,
    "autoMarkDelivery": true,
    "autoMarkRead": true,
    "userAgent": "Mozilla/5.0 (Linux; Android 6.0.1; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Mobile Safari/537.36"
  }
}
```

### 📦 CREATE COMMANDS

```js
export default {
config: {
name: 'hello',// Name of the command
description: 'Replies with a hello message',//describe the command
usage: '(prefix)hello',//usage of the command
permission: 0,// Permission level of the command (0 = everyone, 1 = admins)
author: "Frank kaumba x Asta"//name of owner of command 
},

Nexus: async ({ api, message, args, config, nexusMessage, onReply, sendMessage }) => {
// Send a hello message
nexusMessage.reply('Hello!');
//you can also use return 'hello'; buh it's not advisable 
//you can also use api.sendMessage("hello", message.threadID, message.messageID);
},
};
/*
api:API object for interacting with the chat platform
message:Message object containing information about the message that triggered the command
args: Array of arguments passed to the command
config: Configuration object for the command
nexusMessage:Object for sending messages
onReply: Function to set a reply listener for the command
// Function to send a message
*/

//note you can also use run: async or onStart: async
```


### 👑 ARCHITECTS

- **Asta** - *Developer*
- **Frank Kaumba** - *Developer*

### 📞 CONNECT

```yaml
Email   : efkidgamer@outlook.com
Github  : github.com/Asta-project/Nexusfb
Discord : [Coming Soon]
```

### 🤝 CONTRIBUTE

1. Fork it
2. Create your branch (`git checkout -b feature/Amazing`)
3. Commit (`git commit -m 'Add Amazing'`)
4. Push (`git push origin feature/Amazing`)
5. Open PR

---

<div align="center">

### Made with 💜 by [Frank](https://github.com/efkidgamerdev) and [Asta](https://gitHub.com/asta-project)

*[MIT License](LICENSE) • Contribute with Stars ⭐*

</div>
