import Hercai from 'hercai';
const herc = new Hercai();
export default {
config: {
  name: 'hercai',
  version: '1.0.0',
  permission: 0,
  description: "An AI command powered by Hercai",
  usage: "hercai [prompt]",
  author: "Developer",
  cooldown: 3,
  category: 'ai' 
},
Nexus: async ({ api, message, args}) => {
  const input = args.join(' ');
  if (!input) {
    api.sendMessage(`Please provide a question or statement after 'hercai'. For example: 'hercai What is the capital of France?'`, message.threadID, message.messageID);
    return;
  }
  api.sendMessage(`🔍 "${input}"`, message.threadID, message.messageID);
  try {
    const response = await herc.question({
      model: "v3",
      content: input
    });
    api.sendMessage(response.reply, message.threadID, message.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while processing your request.', message.threadID, message.messageID);
  }
},
};