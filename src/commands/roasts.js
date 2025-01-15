export default {
  config: {
    name: 'roast',
    description: 'Roasts a user',
    usage: '(prefix)roast [username]',
category : 'fun',
    permission: 0,
    author: "FRANK| asta"
  },
  Nexus: async ({ nexusMessage, args }) => {
    const roasts = [
      "You're so slow, you make turtles look like The Flash!",
      "I'm not saying you're dumb, but you make me wonder if you're actually a genius and just pretending to be stupid.",
      "You're about as useful as a screen door on a submarine.",
      "Your brain is so empty, it's like a black hole – nothing can escape, not even a thought.",
      "I'm not roasting you, I'm just explaining why you're wrong.",
      "You're so bad at this, you make me want to give up on life.",
      "Do you have a map? I just keep getting lost in your stupidity.",
      "Your IQ is lower than your shoe size.",
      "You're not even a good bad example.",
      "Do you need a lifeguard? Because you're drowning in your own ignorance.",
    ];
    if (args.length === 0) {
      nexusMessage.reply("Who do you want me to roast?");
    } else {
      nexusMessage.reply(`Hey ${args.join(' ')}, ${roasts[Math.floor(Math.random() * roasts.length)]}`);
    }
  }
};