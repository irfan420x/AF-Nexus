export default {
  config: {
    name: 'approve',
    description: 'View and approve message requests from groups and users',
    usage: '(prefix)approve [number]',
    permission: 1,
    category: 'admin',
    author: "Frank kaumba"
  },

  Nexus: async ({ api, message, args, nexusMessage }) => {
    try {
      const messageRequests = await api.getThreadList(20, null, ['PENDING']);
      
      
      if (!args[0]) {
        if (messageRequests.length === 0) {
          return nexusMessage.reply("❌ No pending message requests found.");
        }

        let msg = "📋 Pending Message Requests:\n\n";
        messageRequests.forEach((thread, index) => {
          msg += `${index + 1}. ${thread.isGroup ? '👥 Group: ' : '👤 User: '}${thread.name}\n`;
        });
        msg += "\nℹ️ Reply with (prefix)approve [number] to accept a request";
        
        return nexusMessage.reply(msg);
      }

      
      const choice = parseInt(args[0]);
      if (isNaN(choice) || choice < 1 || choice > messageRequests.length) {
        return nexusMessage.reply("❌ Invalid number. Please check the list and try again.");
      }

      const selectedThread = messageRequests[choice - 1];
      
     
      await api.handleMessageRequest(selectedThread.threadID, true);
    
      await api.changeArchivedStatus(selectedThread.threadID, false);

      return nexusMessage.reply(`✅ Successfully approved request from ${selectedThread.isGroup ? 'group' : 'user'}: ${selectedThread.name}`);

    } catch (error) {
      console.error(error);
      return nexusMessage.reply("❌ An error occurred while processing message requests.");
    }
  }
};
