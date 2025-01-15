import chalk from 'chalk';

import config from '../config.js';

import { commands, generateRandomDelay } from '../index.js';

import db from '../db.js';

class ReplyManager {

  constructor() {

    this.replyListeners = new Map();

  }

  registerReplyListener(messageId, callback, options = {}) {

    const { timeout = 5 * 60 * 1000, oneTime = true, filter = () => true } = options;

    const listener = {

      callback,

      createdAt: Date.now(),

      timeout,

      oneTime,

      filter,

    };

    this.replyListeners.set(messageId, listener);

    setTimeout(() => {

      this.removeReplyListener(messageId);

    }, timeout);

  }

  async handleReply(api, message) {

  const replyListener = this.replyListeners.get(message.messageReply.messageID);

  if (!replyListener) return false;

  if (!replyListener.filter(message)) return false;

  try {

    await replyListener.callback(message);

    if (replyListener.oneTime) {

      this.removeReplyListener(message.messageReply.messageID);

    }

    return true;

  } catch (error) {

    console.error(chalk.red('Error in reply listener:'), error);

    this.removeReplyListener(message.messageReply.messageID);

    return false;

  }

}

  removeReplyListener(messageId) {

    this.replyListeners.delete(messageId);

  }

  cleanupExpiredListeners() {

    const now = Date.now();

    for (const [messageId, listener] of this.replyListeners.entries()) {

      if (now - listener.createdAt > listener.timeout) {

        this.replyListeners.delete(messageId);

      }

    }

  }

}

const replyManager = new ReplyManager();

export default async function commandHandler(api, message) {

  const nexusMessage = {

    reply: async (response) => {

      api.sendMessage(response, message.threadID, message.messageID);

    },

    replyWithCallback: async (response, callback) => {

      const sentMessage = await api.sendMessage(response, message.threadID, message.messageID);

      replyManager.registerReplyListener(sentMessage.messageID, callback);

    },

  };
 api.getUserInfo(message.senderID, async (err, userInfo) => {

  if (err) {

    console.error(err);

    return;

  }

  const userName = userInfo[message.senderID].name;

  db.setUser(message.senderID, {

    name: userName,

  });

});

  api.getThreadInfo(message.threadID, async (err, threadInfo) => {
  const groupPrefix = db.getGroupPrefix(message.threadID) || config.prefix;

if (err) {

console.error(err);

return;

}

const threadName = threadInfo.name;

db.setGroup(message.threadID, {

name: threadName,
prefix : groupPrefix,

});

});


const groupPrefix = db.getGroupPrefix(message.threadID) || config.prefix;
  const messageBody = message.body ? message.body.trim() : '';

  if (config.logging.messageObjects) {

    console.log('Message object:', message);

  }

  if (message.type === 'message_reply') {

    const originalMessageID = message.messageReply.messageID;

    const replyListener = replyManager.replyListeners.get(originalMessageID);

    if (replyListener) {

      await replyListener.callback(message);

      delete replyManager.replyListeners[originalMessageID];

      return;

    }

  }

  if (message.type === 'typ' || message.type === 'presence') {

    return;

  }

  for (const command of commands.values()) {

    if (command.onChat && typeof command.onChat === 'function' && messageBody.toLowerCase().startsWith(command.config.name.toLowerCase() + ' ')) {

      const args = messageBody.trim().split(' ').slice(1);

      if (db.isBannedUser(message.senderID)) {

        const reason = db.readDB().bannedUsers[message.senderID];

        api.sendMessage(`⚠️\n𝖠𝖼𝖼𝖾𝗌𝗌 𝖽𝖾𝗇𝗂𝖾𝖽 𝗒𝗈𝗎 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝖻𝖺𝗇𝗇𝖾𝖽 𝖿𝗋𝗈𝗆 𝗎𝗌𝗂𝗇𝗀 𝖻𝗈𝗍 𝙍𝙚𝙖𝙨𝙤𝙣: ${reason}\n𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙱𝙾𝚃 𝙰𝙳𝙼𝙸𝙽`, message.threadID, message.messageID);

        return;

      }

      if (db.isBannedThread(message.threadID)) {

        const reason = db.readDB().bannedThreads[message.threadID];

        api.sendMessage(`─━━⚠️\n𝖠𝖼𝖼𝖾𝗌𝗌 𝖽𝖾𝗇𝗂𝖾𝖽 𝖦𝗋𝗈𝗎𝗉 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝖻𝖺𝗇𝗇𝖾𝖽 𝖿𝗋𝗈𝗆 𝗎𝗌𝗂𝗇𝗀 𝖻𝗈𝗍 𝙍𝙚𝙖𝙨𝙤𝙣: ${reason}\n𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙱𝙾𝚃 𝙰𝙳𝙼𝙸𝙽`, message.threadID, message.messageID);

        return;

      }
        
  if (global.adminOnlyMode && !global.adminBot.includes(message.senderID)) {

  nexusMessage.reply("⚠️.𝖡𝗈𝗍 𝗂𝗌 𝗈𝗇 𝖺𝖽𝗆𝗂𝗇 𝗈𝗇𝗅𝗒 𝗎𝗌𝖾 .");

  return;

}

      command.onChat({ api, message, args, config, nexusMessage, onReply: async (reply) => { await command.onReply?.({ api, message, reply, config, nexusMessage }); }, sendMessage: async (text) => { const sentMessage = await api.sendMessage(text, message.threadID); return sentMessage; }, });

    } else if (command.onChat && typeof command.onChat === 'function' && messageBody.toLowerCase() === command.config.name.toLowerCase()) {

      if (db.isBannedUser(message.senderID)) {

        const reason = db.readDB().bannedUsers[message.senderID];

        api.sendMessage(`⚠️\n𝖠𝖼𝖼𝖾𝗌𝗌 𝖽𝖾𝗇𝗂𝖾𝖽 𝗒𝗈𝗎 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝖻𝖺𝗇𝗇𝖾𝖽 𝖿𝗋𝗈𝗆 𝗎𝗌𝗂𝗇𝗀 𝖻𝗈𝗍 𝙍𝙚𝙖𝙨𝙤𝙣: ${reason}\n𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙱𝙾𝚃 𝙰𝙳𝙼𝙸𝙽`, message.threadID, message.messageID);

        return;

      }

      if (db.isBannedThread(message.threadID)) {

        const reason = db.readDB().bannedThreads[message.threadID];

        api.sendMessage(`⚠️\n𝖠𝖼𝖼𝖾𝗌𝗌 𝖽𝖾𝗇𝗂𝖾𝖽 𝗒𝗈𝗎 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝖻𝖺𝗇𝗇𝖾𝖽 𝖿𝗋𝗈𝗆 𝗎𝗌𝗂𝗇𝗀 𝖻𝗈𝗍 𝙍𝙚𝙖𝙨𝙤𝙣: ${reason}\n𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙱𝙾𝚃 𝙰𝙳𝙼𝙸𝙽`, message.threadID, message.messageID);

        return;

      }

        if (global.adminOnlyMode && !global.adminBot.includes(message.senderID)) {
  nexusMessage.reply("⚠️𝖡𝗈𝗍 𝗂𝗌 𝗈𝗇 𝖺𝖽𝗆𝗂𝗇 𝗈𝗇𝗅𝗒 𝗎𝗌𝖾");

  return;

}
      
      
      const args = [];

      command.onChat({ api, message, args, config, nexusMessage, onReply: async (reply) => { await command.onReply?.({ api, message, reply, config, nexusMessage }); }, sendMessage: async (text) => { const sentMessage = await api.sendMessage(text, message.threadID); return sentMessage; }, });

    }

  }

  if (messageBody === groupPrefix) {
      
    if (db.isBannedUser(message.senderID)) {

        const reason = db.readDB().bannedUsers[message.senderID];

        api.sendMessage(`⚠️\n𝖠𝖼𝖼𝖾𝗌𝗌 𝖽𝖾𝗇𝗂𝖾𝖽 𝗒𝗈𝗎 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝖻𝖺𝗇𝗇𝖾𝖽 𝖿𝗋𝗈𝗆 𝗎𝗌𝗂𝗇𝗀 𝖻𝗈𝗍 𝙍𝙚𝙖𝙨𝙤𝙣: ${reason}\n𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙱𝙾𝚃 𝙰𝙳𝙼𝙸𝙽`, message.threadID, message.messageID);

        return;

      }

      if (db.isBannedThread(message.threadID)) {

        const reason = db.readDB().bannedThreads[message.threadID];

        api.sendMessage(`─⚠️\n𝖠𝖼𝖼𝖾𝗌𝗌 𝖽𝖾𝗇𝗂𝖾𝖽 𝗒𝗈𝗎 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝖻𝖺𝗇𝗇𝖾𝖽 𝖿𝗋𝗈𝗆 𝗎𝗌𝗂𝗇𝗀 𝖻𝗈𝗍 𝙍𝙚𝙖𝙨𝙤𝙣: ${reason}\n𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙱𝙾𝚃 𝙰𝙳𝙼𝙸𝙽`, message.threadID, message.messageID);

        return;

      }
      
    if (global.adminOnlyMode && !global.adminBot.includes(message.senderID)) {
  nexusMessage.reply("⚠️𝖡𝗈𝗍 𝗂𝗌 𝗈𝗇 𝖺𝖽𝗆𝗂𝗇 𝗈𝗇𝗅𝗒 𝗎𝗌𝖾");

  return;

}

    nexusMessage.reply(` 🛰𝖳𝖧𝖤 𝖡𝖮𝖳 𝖲𝖸𝖲𝖳𝖤𝖬 𝖮𝖯𝖤𝖱𝖠𝖳𝖨𝖮𝖭𝖠𝖫 𝖳𝖸𝖯𝖤 𝖧𝖤𝖫𝖯 𝖳𝖮 𝖲𝖤𝖤 𝖠𝖫𝖫 𝖢𝖮𝖬𝖬𝖠𝖭𝖣𝖲`);

    return;

  }

  if (!messageBody.startsWith(groupPrefix)) {

    return;

  }
    
if (!messageBody.startsWith(groupPrefix)) {

    return;

  }

  const args = messageBody.slice(groupPrefix.length).trim().split(/ +/);

  const commandName = args.shift().toLowerCase();

  // Check if the command name is an alias for another command

  const command = Array.from(commands.values()).find((command) => {

    return command.config.name.toLowerCase() === commandName ||

      (command.config.aliases && command.config.aliases.includes(commandName));

  });
    
if (db.isBannedUser(message.senderID)) {
    const reason = db.readDB().bannedUsers[message.senderID];
    api.sendMessage(`⚠️\n𝖠𝖼𝖼𝖾𝗌𝗌 𝖽𝖾𝗇𝗂𝖾𝖽 𝗒𝗈𝗎 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝖻𝖺𝗇𝗇𝖾𝖽 𝖿𝗋𝗈𝗆 𝗎𝗌𝗂𝗇𝗀 𝖻𝗈𝗍 𝙍𝙚𝙖𝙨𝙤𝙣: ${reason}\n𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙱𝙾𝚃 𝙰𝙳𝙼𝙸𝙽`, message.threadID, message.messageID);
    return;
  }

  if (db.isBannedThread(message.threadID)) {
    const reason = db.readDB().bannedThreads[message.threadID];
    api.sendMessage(`⚠️\n𝖠𝖼𝖼𝖾𝗌𝗌 𝖽𝖾𝗇𝗂𝖾𝖽 𝗒𝗈𝗎 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝖻𝖺𝗇𝗇𝖾𝖽 𝖿𝗋𝗈𝗆 𝗎𝗌𝗂𝗇𝗀 𝖻𝗈𝗍 𝙍𝙚𝙖𝙨𝙤𝙣: ${reason}\n𝙲𝙾𝙽𝚃𝙰𝙲𝚃 𝙱𝙾𝚃 𝙰𝙳𝙼𝙸𝙽`, message.threadID, message.messageID);
    return;
  }
    
 if (global.adminOnlyMode && !global.adminBot.includes(message.senderID)) {

  nexusMessage.reply("⚠️𝖡𝗈𝗍 𝗂𝗌 𝗈𝗇 𝖺𝖽𝗆𝗂𝗇 𝗈𝗇𝗅𝗒 𝗎𝗌𝖾");

  return;

}

if (command && command.onLoad) {

    await command.onLoad({ api, message });

  }

  if (!command) {

    nexusMessage.reply(`⛔𝖳𝖧𝖤  𝖢𝖮𝖬𝖬𝖠𝖭𝖣 "${commandName}"𝖨𝖲 𝖭𝖮𝖳 𝖨𝖭𝖲𝖳𝖠𝖫𝖫𝖤𝖣 𝖳𝖸𝖯𝖤 ${global.prefix} help`);

    return;

  }

  // Check if a command with the same name has an onChat function defined

  const commandWithOnChat = Array.from(commands.values()).find((cmd) => cmd.config.name.toLowerCase() === commandName && cmd.onChat);

  if (commandWithOnChat && !command.run && !command.onStart && !command.Nexus) {

  nexusMessage.reply(`𝖳𝖧𝖤 𝖢𝖮𝖬𝖬𝖠𝖭𝖣 "${commandName}" 𝖶𝖮𝖱𝖪𝖲 𝖶𝖨𝖳𝖧𝖮𝖴𝖳 𝖯𝖱𝖤𝖥𝖨𝖷. 𝖸𝖮𝖴 𝖢𝖠𝖭 𝖴𝖲𝖤 𝖨𝖳 𝖡𝖸 𝖳𝖸𝖯𝖨𝖭𝖦 "${commandName}" 𝖥𝖮𝖫𝖫𝖮𝖶𝖤𝖣 𝖡𝖸 𝖸𝖮𝖴𝖱 𝖢𝖮𝖬𝖬𝖠𝖭𝖣.`);

  return;

}

  if (command.config && command.config.permission === 1 && !config.adminIds.includes(message.senderID)) {

    nexusMessage.reply(`⛔𝖸𝖮𝖴 𝖣𝖮 𝖭𝖮𝖳 𝖧𝖠𝖵𝖤 𝖤𝖭𝖮𝖴𝖦𝖧 𝖯𝖤𝖱𝖬𝖨𝖲𝖲𝖨𝖮𝖭 𝖳𝖮 𝖴𝖲𝖤 𝖳𝖧𝖤 𝖢𝖮𝖬𝖬𝖠𝖭𝖣 `);

    return;

  }

if (command.config && command.config.permission === 2) {

  const isAdmin = await api.getThreadInfo(message.threadID);

  const isAdminVar = isAdmin.participantIDs.includes(message.senderID) && isAdmin.adminIDs.some(admin => admin.id === message.senderID);

  if (!isAdminVar) {

    nexusMessage.reply(`⛔𝖸𝖮𝖴 𝖭𝖤𝖤𝖣 𝖳𝖮 𝖡𝖤 𝖦𝖱𝖮𝖴𝖯 𝖠𝖣𝖬𝖨𝖭 𝖳𝖮 𝖴𝖲𝖤 𝖳𝖧𝖨𝖲 𝖢𝖮𝖬𝖬𝖠𝖭𝖣`);

    return;

  }

}



  try {
if (command.config && command.config.cooldown) {

  const cooldownTime = command.config.cooldown * 1000; // convert cooldown time to milliseconds

  const cooldownKey = `cooldown_${command.config.name}_${message.senderID}`;

  const lastUsedTimestamp = await db.get(cooldownKey); // await the db.get() method

  if (lastUsedTimestamp) {

    const timeRemaining = cooldownTime - (Date.now() - lastUsedTimestamp);

    if (timeRemaining > 0) {

      nexusMessage.reply(`You need to wait, you have ${Math.ceil(timeRemaining / 1000)} seconds before using this command again.`);

      return;

    }

  }

  await db.set(cooldownKey, Date.now()); // await the db.set() method

}
    setTimeout(async () => {
        

      try {

        let response;

        const enhancedSendMessage = async (text, options = {}) => {

  const sentMessage = await api.sendMessage(text, message.threadID);

  if (options.onReply) {

    replyManager.registerReplyListener(sentMessage.messageID, async (reply) => {

      if (command.onReply) {

        console.log(chalk.green(`Calling onReply function for command: ${command.config.name}`));

        await command.onReply({ api, message, reply, config, nexusMessage, sendMessage: enhancedSendMessage });

      }

      if (options.onReply) {

        await options.onReply(reply);

      }

    }, { 

      timeout: options.replyTimeout || 5 * 60 * 1000, 

      oneTime: options.oneTimeReply ?? true, 

      filter: (message) => message.body !== '' 

    });

  }

  return { ...sentMessage, replyMessageID: sentMessage.messageID };

};
          
       if (command.run) {



  await command.run({ api, message, args, config, nexusMessage, replyManager, onReply: async (reply) => {

    await command.onReply?.({ api, message, reply, config, nexusMessage });

  }, sendMessage: async (text) => {

    const sentMessage = await api.sendMessage(text, message.threadID);

    return sentMessage;

  }, });

} else if (command.onStart) {



      await command.onStart({

      api,

      message,

      args,

      config,

      nexusMessage,

      replyManager,

      onReply: async (reply) => {

        if (command.onReply) {

          await command.onReply({ api, message, reply, config, nexusMessage });

        }

      },

      sendMessage: async (text) => {

        const sentMessage = await api.sendMessage(text, message.threadID);

        return sentMessage;

      },

    });

  } else if (command.Nexus) {



  await command.Nexus({ api, message, args, config, nexusMessage, replyManager, onReply: async (reply) => {

    await command.onReply?.({ api, message, reply, config, nexusMessage });

  }, sendMessage: async (text) => {

    const sentMessage = await api.sendMessage(text, message.threadID);

    return sentMessage;

  }, });

}

        if (response) {

          nexusMessage.reply(response);

        }

      } catch (error) {

        console.error(chalk.red(`Error in command "${commandName}":`), error);

        nexusMessage.reply(`❌"𝖤𝖱𝖱𝖮𝖱 𝖨𝖭 𝖳𝖧𝖤 𝖢𝖮𝖬𝖬𝖠𝖭𝖣${commandName}": ${error.message}\n𝖯𝖫𝖤𝖠𝖲𝖤 𝖱𝖤𝖯𝖮𝖱𝖳 𝖳𝖧𝖤 𝖤𝖱𝖱𝖮𝖱 𝖳𝖮 𝖡𝖮𝖳 𝖣𝖤𝖵𝖲.`);

      }

    }, generateRandomDelay(1000, 3000));

  } catch (error) {

  nexusMessage.reply(`❌"𝖤𝖱𝖱𝖮𝖱 𝖨𝖭 𝖳𝖧𝖤 𝖢𝖮𝖬𝖬𝖠𝖭𝖣${commandName}": ${error.message}\n𝖯𝖫𝖤𝖠𝖲𝖤 𝖱𝖤𝖯𝖮𝖱𝖳 𝖳𝖧𝖤 𝖤𝖱𝖱𝖮𝖱 𝖳𝖮 𝖡𝖮𝖳 𝖣𝖤𝖵𝖲.`);

}

}

setInterval(() => {

  replyManager.cleanupExpiredListeners();

}, 10 * 60 * 1000);
