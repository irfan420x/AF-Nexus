import axios from 'axios';

export default {
  config: {
    name: 'coral',
    description: 'Have a conversation with the AI',
    usage: '(prefix)coral <query>',
    category: 'AI',
    permission: 0,
    author: "Frank kaumba x Asta |API by lance"
  },
  onStart: async ({ api, message, args, nexusMessage }) => {
    if (!args.length) {
      return nexusMessage.reply('Please provide a query');
    }

    const query = args.join(' ');
    const senderID = message.senderID;
    const apiUrl = `https://cohere-api-by-lanceq.onrender.com/api/chat?message=${encodeURIComponent(query)}&&chat_id=${senderID}`;

    try {
      let lastMessage;

      async function sendMessage(msg) {
        const reply = await nexusMessage.replyWithCallback(msg, async (response) => {
          lastMessage = response;
        });
      }

      const response = await axios.get(apiUrl);
      const aiResponse = response.data.text;
      await sendMessage(aiResponse);

      while (true) {
        if (!lastMessage) break;

        const followUpQuery = encodeURIComponent(lastMessage.body);
        const followUpUrl = `https://cohere-api-by-lanceq.onrender.com/api/chat?message=${followUpQuery}&&chat_id=${senderID}`;
        
        try {
          const followUpResponse = await axios.get(followUpUrl);
          const followUpMessage = followUpResponse.data.text;
          await sendMessage(followUpMessage);
        } catch (error) {
          nexusMessage.reply('An error occurred in follow-up conversation');
          break;
        }
      }
    } catch (error) {
      nexusMessage.reply(`Error: ${error.message}`);
    }
  }
};