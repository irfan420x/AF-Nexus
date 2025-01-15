export default {
  config: {
    name: 'leave',
    description: 'Leave a group chat',
    usage: '(prefix)leave [groupID]',
    permission: 1,
    category: 'admin',
    author: "Frank kaumba x Asta"
  },

  Nexus: async ({ api, message, args, nexusMessage }) => {
    try {
      const threadID = args[0] || message.threadID;
      
      const threadInfo = await api.getThreadInfo(threadID);
      
      if (!threadInfo.isGroup) {
        return nexusMessage.reply("❌ This command can only be used in group chats.");
      }

      await api.sendMessage("👋 Goodbye! I'm leaving this group chat.", threadID);
      
      await api.removeUserFromGroup(api.getCurrentUserID(), threadID);
      
      if (threadID !== message.threadID) {
        return nexusMessage.reply(`✅ Successfully left the group: ${threadInfo.threadName}`);
      }

    } catch (error) {
      console.error(error);
      return nexusMessage.reply("❌ An error occurred while trying to leave the group.");
    }
  }
};
