export default {
config: {
name: 'wouldyourather',
description: 'Gives you two random "would you rather" options',
usage: '(prefix)wouldyourather',
permission: 0,
category: 'Fun',
author: "Asta",
allies: ['wyr', 'rather']
},
Nexus: async ({ nexusMessage }) => {
const options = [
["Give up your phone or your computer?", "Give up your phone", "Give up your computer"],
["Have a lifetime supply of your favorite food or be able to travel anywhere for free?", "Have a lifetime supply of your favorite food", "Be able to travel anywhere for free"],
["Be able to speak any language fluently or be able to play any musical instrument perfectly?", "Be able to speak any language fluently", "Be able to play any musical instrument perfectly"],
["Have a private island or a private jet?", "Have a private island", "Have a private jet"],
["Have the ability to teleport anywhere or be able to time travel?", "Have the ability to teleport anywhere", "Be able to time travel"],
];
const randomOption = options[Math.floor(Math.random() * options.length)];
nexusMessage.reply(Would you rather {randomOption[1]}\nB) ${randomOption[2]});
}
};