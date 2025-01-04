export default {
  config: {
    name: 'welcome',
    version: '2.0.0'
  },
  eventType: 'log:subscribe',
  welcomes: [
    "Welcome {name} has joined {group}!Be respectful to everyone 😊 and you're the {count}th person to join this group!",
    "🎉 Welcome to {group}, {name}!we glad having you around 🫡. You're now part of a {count} member community!",
    "🚀 {name} landed in {group}!hope you will make new friends here 😊. You're the {count}th astronaut to join this crew!",
  ],
  botMsgs: [
    "👋 Ready to help in {group}!avoid spamming and we will roll till infinity",
    "🤖 Thanks for adding me to {group}!l will try my best helping with your requests",
  ],
  async run(api, event) {
    try {
      const threadID = event.threadID;
      const user = event.logMessageData.addedParticipants[0];
      const group = await api.getThreadInfo(threadID);
      const participantCount = group.participantIDs.length;

      if (user.userFbId === api.getCurrentUserID()) {
        console.log('Bot is the added participant');
        const msg = this.getRandom(this.botMsgs).replace('{group}', group.name);
        await api.sendMessage(`${msg}\n${global.prefix}help for commands`, threadID);
        for (const admin of global.config.adminIds) {
          await api.sendMessage(`Bot added to: ${group.name} (${threadID})\nAdded by: ${user.fullName} (${user.userFbId})`, admin);
        }
      } else {
        console.log('Bot is not the added participant');
        const msg = this.getRandom(this.welcomes)
          .replace('{name}', user.fullName)
          .replace('{group}', group.name)
          .replace('{count}', participantCount);
        await api.sendMessage(msg, threadID);
      }
    } catch (error) {
      console.error(error);
    }
  },
  getRandom: arr => arr[Math.floor(Math.random() * arr.length)],
};
