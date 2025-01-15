import fs from 'fs';
import config from '../../config.js';

export default {
  config: {
    name: 'admin',
    aliases: [],
    description: 'Manage bot administrators',
    usage: '(prefix)admin <add/remove/list> [uid/tag]',
     category: 'utility',
    permission: 1
  },
  run: async ({ api, message, args, config, nexusMessage }) => {
    if (args.length === 0) {
      return nexusMessage.reply(`Usage: ${config.prefix}admin <add/remove/list> [uid/tag]`);
    }

    switch (args[0].toLowerCase()) {
case 'add': {
  if (args.length === 1) {
    return nexusMessage.reply(`Usage: ${config.prefix}admin add <uid/tag>`);
  }

  let uid;
  if (message.messageReply) {
    uid = message.messageReply.senderID;
  } else if (args[1].startsWith('@')) {
    if (message.mentions) {
      uid = Object.keys(message.mentions)[0];
    } else {
      nexusMessage.reply('Invalid mention format.');
      return;
    }
  } else {
    uid = args[1].replace('@', '');
  }
const userInfo = await api.getUserInfo(uid)
const userName = userInfo[uid].name || uid;
  if (config.adminIds.includes(uid)) {
    return nexusMessage.reply(`${userName} is already an admin`);
  }

  config.adminIds.push(uid);
  fs.writeFileSync('config.js', `export default ${JSON.stringify(config, null, 2)}`);
  return nexusMessage.reply(`${userName} added as admin`);
}

      case 'remove': {
  if (args.length === 1) {
    return nexusMessage.reply(`Usage: ${config.prefix}admin remove <uid>`);
  }
  const uid = args[1];
  const userInfo = await api.getUserInfo(uid);
  const userName = userInfo[uid].name || uid;
  if (!config.adminIds.includes(uid)) {
    return nexusMessage.reply(`${userName} is not an admin`);
  }
  config.adminIds = config.adminIds.filter(id => id !== uid);
  fs.writeFileSync('config.js', `export default ${JSON.stringify(config, null, 2)}`);
  return nexusMessage.reply(`${userName} removed as admin`);
}

      case 'list': {
        if (config.adminIds.length === 0) {
          return nexusMessage.reply(`No admins found`);
        }

        const adminList = config.adminIds.join('\n★');
        return nexusMessage.reply(`Admins:\n★${adminList}`);
      }

      default: {
        return nexusMessage.reply(`Invalid option. Use ${config.prefix}admin <add/remove/list>`);
      }
    }
  },
};