import db from '../../db.js';

export default {
  config: {
    name: 'unban',
    description: 'Unban a user or thread',
    usage: '(prefix)unban <user/thread> <id>',
    category: 'utility',
    permission: 1
  },
  Nexus: async ({ api, message, args, config, nexusMessage }) => {
    if (args.length < 2) {
      return nexusMessage.reply('Please specify the type (user/thread) and ID.');
    }

    const type = args[0].toLowerCase();
    const id = args[1];

    if (type === 'user') {
      try {
        db.removeBannedUser(id);
        nexusMessage.reply(`User ${id} has been unbanned.`);
      } catch (error) {
        nexusMessage.reply('Invalid user ID.');
      }
    } else if (type === 'thread') {
      try {
        db.removeBannedThread(id);
        nexusMessage.reply(`Thread ${id} has been unbanned.`);
      } catch (error) {
        nexusMessage.reply('Invalid thread ID.');
      }
    } else {
      nexusMessage.reply('Invalid type. Please use "user" or "thread".');
    }
  },
};