import axios from 'axios';

export default {
  config: {
    name: 'gemini',
    description: 'chat with ai',
    usage: '(prefix)ai <query>',
    permission: 0,
    author: "Nexus"
  },
  Nexus: async ({ api, message, args, nexusMessage }) => {
    if (!args.length) {
      return nexusMessage.reply('Please provide a query');
    }
    const encodedPrompt = encodeURIComponent(args.join(" "));
try {
        const url = await axios.get(`https://sandipbaruwal.onrender.com/gemini?prompt=${encodedPrompt}`);

     const UPoL = url.data.answer; 

      const upolres = `${UPoL}`;

        nexusMessage.reply(upolres);
    } catch (error) {
      nexusMessage.reply(`Error: ${error.message}`);
    }
  }
};