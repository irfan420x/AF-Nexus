import config from '../../config.js';

export default {
  config: {
    name: 'leave',
    version: '2.0.0'
  },
  eventType: 'log:unsubscribe',
  goodbyes: [
    "{name} has left {group}!",
    "👋 {name} left {group}!",
    "🚫 {name} has been removed from {group}!",
  ],
  async run(api, event) {
    try {
      const threadID = event.threadID;
      const leftParticipants = event.logMessageData.leftParticipants;

      if (leftParticipants && leftParticipants.length > 0) {
        const user = leftParticipants[0];

        if (user.userFbId === api.getCurrentUserID()) {
          console.log('Bot left the group');
          const groupInfo = await api.getThreadInfo(threadID);
          const adminMessage = `Bot removed from: ${groupInfo.name} (${threadID})\nRemoved by: ${event.author.fullName} (${event.author.userFbId})`;
          for (const adminId of config.adminIds) {
            await api.sendMessage(adminMessage, adminId);
          }
        } else {
          console.log(`${user.fullName} left the group`);
          const msg = this.getRandom(this.goodbyes)
            .replace('{name}', user.fullName)
            .replace('{group}', threadID);
          await api.sendMessage(msg, threadID);
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
  getRandom: arr => arr[Math.floor(Math.random() * arr.length)],
};
