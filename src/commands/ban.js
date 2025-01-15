import db from '../../db.js';

export default {
  config: {
    name: 'ban',
    description: 'Ban a user or thread',
    usage: '(prefix)ban <user/thread> <id>',
    category: 'admin',
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
        const reason = args.slice(2).join(' ') || 'No reason provided';
        const userInfo = await api.getUserInfo(id);
        const userName = userInfo[id].name || id;

        db.setBannedUser(id, reason);
        nexusMessage.reply(`User ${userName} (${id}) has been banned.\nReason: ${reason}`);
      } catch (error) {
        nexusMessage.reply('Invalid user ID.');
      }
    } else if (type === 'thread') {
      try {
        const reason = args.slice(2).join(' ') || 'No reason provided';
        db.setBannedThread(id, reason);
        nexusMessage.reply(`Thread ${id} has been banned.\nReason: ${reason}`);
      } catch (error) {
        nexusMessage.reply('Invalid thread ID.');
      }
    } else {
      nexusMessage.reply('Invalid type. Please use "user" or "thread".');
    }
  },
};