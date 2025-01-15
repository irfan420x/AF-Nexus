export default {
  config: {
    name: 'hack',
    description: 'Simulates a hacking scene',
category: 'system',
    usage: '(prefix)hack',
    permission: 0,
    author: "Frank x asta"
  },
  Nexus: async ({ nexusMessage }) => {
    const hackingScene = [
      "Initializing hack... ",
      "Bypassing firewall... ",
      "Accessing mainframe... ",
      "Downloading sensitive data... ",
      "Uploading virus... ",
      "HACK COMPLETE!",
    ];
    for (let i = 0; i < hackingScene.length; i++) {
      await nexusMessage.reply(hackingScene[i]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};