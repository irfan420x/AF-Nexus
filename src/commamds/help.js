 import { commands } from '../../index.js';

export default {
  config: {
    name: 'help',
    version: '2.2',
    author: 'Frank X Asta',
    cooldown: 5,
   permission: 0,
    category: 'Menu',
    description: 'View command usage'
  },

  run: async ({ nexusMessage, args, prefix }) => {
    if (!args.length) {
      const categories = new Map();
      let output = `╭─⭓𝐀𝐅 𝐍𝐄𝐗𝐔𝐒 𝐁𝐎𝐓⭓────\n│\n`;

      commands.forEach((cmd, name) => {
        const category = cmd.config.category || '𝐆𝐄𝐍𝐄𝐑𝐀𝐋';
        if (!categories.has(category)) {
          categories.set(category, []);
        }
        categories.get(category).push(name);
      });

      [...categories].sort().forEach(([category, cmdList]) => {
        output += `├─⭓  ${styleBold(category)}\n│  `;
        output += cmdList.sort().join(', ');
        output += '\n│\n';
      });

      output += '│\n';
      output += `├─⭓📖 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${commands.size}\n`;
      output += `╰─⭓ 📑𝐔𝐬𝐞: ${config.prefix}help <command>
╰─⭓𝐁𝐎𝐓 𝐍𝐀𝐌𝐄: ${config.botName}\n`;

      return nexusMessage.reply(output);
    }

    const command = commands.get(args[0].toLowerCase());
    if (!command) {
      return nexusMessage.reply(`╭─────⭓\n│ ❌ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝\n╰────⭓`);
    }

    const info = `╭─⭓ ${styleBold(command.config.name.toUpperCase())} ⭓─╮ \n│ \n├─⭓ 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲 : ${command.config.category ? styleBold(command.config.category) : 'No category'} \n├─⭓ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : ${command.config.version} \n├─⭓ 𝐑𝐨𝐥𝐞 : ${command.config.role || '0'} \n├─⭓ 𝐂𝐨𝐨𝐥𝐝𝐨𝐰𝐧 : ${command.config.cooldown}s \n╰─⭓ 𝐔𝐬𝐚𝐠𝐞 : ${command.config.usage || `${prefix}${command.config.name}`}`;

    return nexusMessage.reply(info);
  }
};

function styleBold(text) {
  const boldMap = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜',
    'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥',
    'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    ' ': ' '
  };
  
  return text.split('').map(char => boldMap[char.toUpperCase()] || char).join('');
}