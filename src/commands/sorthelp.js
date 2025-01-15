import { commands } from '../../index.js';

const helpModes = new Map();
global.helpModes = helpModes;
export default {
  config: {
    name: 'sorthelp',
    version: '1.0',
    author: 'Frank X Asta',
    cooldown: 5,
    permission: 0,
    category: 'Menu',
    description: 'Change help display mode for this chat',
    usage: '{prefix}sorthelp [category|name]',
  },
  run: async ({ nexusMessage, args, message }) => {
    const prefix = global.prefix;
    
    const chatId = message.threadID;
    try {
      if (!args.length) {
        return nexusMessage.reply(`┏━━『 ℹ️ Usage 』━━┓\n┃\n┃ ${prefix}sorthelp category - Group commands by category\n┃ ${prefix}sorthelp name - Show detailed command pages\n┃\n┗━━━━━━━━━━┛`);
      }
      const option = args[0].toLowerCase();
      if (option === 'category' || option === 'name') {
        helpModes.set(chatId, option);
        return nexusMessage.reply(`┏━━『 ✅ Success 』━━┓\n┃ Help display mode set to: ${option}\n┃ Use ${prefix}help to see the new format\n┗━━━━━━━━━━┛`);
      }
      return nexusMessage.reply(`┏━━『 ❌ Error 』━━┓\n┃ Invalid option. Use 'category' or 'name'\n┗━━━━━━━━━━┛`);
    } catch (error) {
      console.error('Sorthelp command error:', error);
      return nexusMessage.reply(`┏━━『 ❌ Error 』━━┓\n┃ ${error.message || 'An unknown error occurred'}\n┗━━━━━━━━━━┛`);
    }
  },
};