import chalk from 'chalk';

export default {
  config: {
    name: 'ping',
    description: 'Check the bot\'s latency',
    usage: 'ping',
  },
  onStart: async ({ api, message, args }) => {
    const startTime = Date.now();
    api.sendMessage('Pong!', message.threadID);
    const endTime = Date.now();
    const latency = endTime - startTime;
    api.sendMessage(`Latency: ${latency}ms`, message.threadID);
  },
};