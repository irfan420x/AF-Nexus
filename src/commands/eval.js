import axios from 'axios';
export default {
config: {
name: 'eval',
aliases: [],
description: 'Evaluates JavaScript code',
usage: '(prefix)eval <code>',
author: 'asta ichiyukimøri',
category: 'utility',
permission: 1,
},
run: async ({ api, message, args, config, nexusMessage }) => {
if (!args[0]) {
nexusMessage.reply('Please provide a code to evaluate.');
return;
}
const code = args.join(' ');
try {
const result = await evaluateCode(code, api, message, nexusMessage);
if (result) nexusMessage.reply(result);
} catch (error) {
nexusMessage.reply(`Error: ${error.message}`);
}
},
};
function evaluateCode(code, api, message, nexusMessage) {
  return new Promise((resolve, reject) => {
    try {
      const console = {
        log: (message) => nexusMessage.reply(message),
      };

      const out = (x) => nexusMessage.reply(x);

      let result = "";
      const outFunction = (message) => (result += message + "\n");
      const replyProxy = (message) => nexusMessage.reply(message);
      const apiProxy = {
  sendMessage: (message, threadID, messageID) =>
    api.sendMessage(message, threadID, messageID),
  get: async (endpoint) => {
    const response = await axios.get(endpoint);
    return response.data;
  },
  post: async (endpoint, data) => {
    const response = await axios.post(endpoint, data);
    return response.data;
  },
};
      eval(`
        (async () => {
          const api = apiProxy;
          const message = ${JSON.stringify(message)};
          const nexusMessage = { reply: replyProxy };
          const console = ${JSON.stringify(console)};
          const out = (x) => outFunction(x);
          { ${code} }
        })();
      `);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}