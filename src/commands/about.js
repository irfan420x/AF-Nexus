export default {
  config: {
    name: 'about',
    description: 'Displays information about the bot and its owners',
category: ' info',
    usage: '(prefix)about',
    permission: 0,
    author: "Frank kaumba x Asta"
  },

  Nexus: async ({ nexusMessage }) => {
    const botInfo = `
╭━━━━━━━━━╮
┃  𝙽𝙴𝚇𝚄𝚂 𝙱𝙾𝚃 𝙸𝙽𝙵𝙾  
┃━━━━━━━━━━
┃ 🤖 Bot Name: Nexus
┃ 🌟 Version: 1.0.0
┃ 🔧 Prefix: .
┃
┃ 👑 𝙾𝚆𝙽𝙴𝚁𝚂:
┃ • Frank (EfkidTrapGamer)
┃   └╼ https://www.facebook.com/Efkidtrapgamer
┃ • Asta (Femi)
┃   └╼ https://www.facebook.com/femi.gbemi.58
┃
┃ 📚 𝚁𝙴𝚂𝙾𝚄𝚁𝙲𝙴𝚂:
┃ • GitHub: https://github.com
┃ • Commands: Use help cmd
┃
┃ 💝 Thanks for using
┃   Nexus Bot!
╰━━━━━━━━━╯`.trim()
    return nexusMessage.reply(botInfo);
  }
};