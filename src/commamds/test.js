export default {
  config: {
    name: 'test',
    description: 'A test command',
    usage: '(prefix)test',
    permission: 0,
  },
  run: async ({ api, message, args, config, nexusMessage }) => {
    nexusMessage.replyWithCallback('Please reply with a message!', async (reply) => {
      api.sendMessage(`You replied with: ${reply.body}`, reply.threadID, reply.messageID);
    });
  },
}