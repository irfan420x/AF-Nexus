 import { commands } from '../../index.js';

export default {
  config: {
    name: 'help',
    version: '2.5',
    author: 'Frank X Asta',
    aliases: ['h'],
    cooldown: 5,
    permission: 0,
    category: 'Menu',
    description: 'View available commands and their details',
    usage: '{prefix}help [page|command]'
  },

  run: async ({ nexusMessage, args, config, message }) => {
    const prefix = global.prefix;
    try {
      const chatId = message.threadID;
    const mode = global.helpModes.get(chatId) || 'category';
      const itemsPerPage = 6;
      const maxLineLength = 40;

      if (mode === 'category') {
        const categories = new Map();
        let output = `┏━━『 𝗔𝗙 𝗡𝗘𝗫𝗨𝗦 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 』━━━┓\n┃\n`;

        commands.forEach((cmd, name) => {
          const category = (cmd.config?.category || 'General').toString();
          if (!categories.has(category)) {
            categories.set(category, []);
          }
          categories.get(category).push(name);
        });

        [...categories].sort().forEach(([category, cmdList]) => {
          output += `┣━━『 ${boldText(category.toUpperCase())} 』${getEmoji(category)}\n`;
          let currentLine = '┃  ';
          const lines = [];
          
          cmdList.sort().forEach((cmd, index) => {
            if (currentLine.length + cmd.length > maxLineLength) {
              lines.push(currentLine);
              currentLine = '┃  ' + cmd;
            } else {
              currentLine += (currentLine.length > 3 ? ' • ' : '') + cmd;
            }
            
            if (index === cmdList.length - 1) {
              lines.push(currentLine);
            }
          });
          
          output += lines.join('\n') + '\n┃\n';
        });

        const totalCommands = commands.size;
        const totalCategories = categories.size;
        const avgCommandsPerCategory = (totalCommands / totalCategories).toFixed(1);

        output += `┣━━『 𝗦𝗧𝗔𝗧𝗜𝗦𝗧𝗜𝗖𝗦 』━━┓\n`;
        output += `┃ 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${totalCommands}\n`;
        output += `┃ 𝗧𝗼𝘁𝗮𝗹 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗲𝘀: ${totalCategories}\n`;
        output += `┃ 𝗔𝘃𝗲𝗿𝗮𝗴𝗲 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${avgCommandsPerCategory}\n`;
        output += `┃ 𝗣𝗿𝗲𝗳𝗶𝘅: ${global.prefix}\n`;
        output += `┃ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${global.version || '1.0.0'}\n`;
        output += `┃ 𝗨𝗽𝘁𝗶𝗺𝗲: ${getUptime()}\n`;
        output += `┗━━━━━━━━━┛`;

        return nexusMessage.reply(output);
      }

      if (mode === 'name') {
        const page = args.length ? parseInt(args[0]) : 1;
        
        if (isNaN(page)) {
          const command = commands.get(args[0].toLowerCase());
          if (!command) {
            return nexusMessage.reply(`┏━『 ❌ 𝗘𝗥𝗥𝗢𝗥 』━━┓\n┃ Command not found!\n┗━━━━━━━━┛`);
          }

          const info = `┏━━━『 ${boldText(command.config?.name?.toUpperCase() || 'COMMAND')} 』━━┓
┃
┣━━━『 𝗗𝗘𝗧𝗔𝗜𝗟𝗦 』
┃ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${boldText(command.config?.category || 'None')} ${getEmoji(command.config?.category)}
┃ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: v${command.config?.version?.toString() || '1.0'}
┃ 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: ${command.config?.permission || '0'}
┃ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: ${command.config?.cooldown || '0'}s
┃
┣━━━『 𝗨𝗦𝗔𝗚𝗘 』
┃ ${command.config?.usage?.replace('{prefix}', prefix) || `${prefix}${command.config?.name || 'command'}`}
┃
┣━━━『 𝗗𝗘𝗦𝗖𝗥𝗜𝗣𝗧𝗜𝗢𝗡 』
┃ ${command.config?.description || 'No description available'}
┃
┗━━━━━━━━━┛`;

          return nexusMessage.reply(info);
        }

        const cmdArray = [...commands].map(([name, cmd]) => ({ 
          name, 
          ...cmd.config 
        })).sort((a, b) => a.name.localeCompare(b.name));

        const totalPages = Math.ceil(cmdArray.length / itemsPerPage);
        const startIdx = (page - 1) * itemsPerPage;
        const pageCommands = cmdArray.slice(startIdx, startIdx + itemsPerPage);

        let output = `┏━━『 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗣𝗔𝗚𝗘 ${page}/${totalPages} 』━━┓\n┃\n`;

        pageCommands.forEach(cmd => {
          output += `┣━━━『 ${boldText(cmd.name.toUpperCase())} 』${getEmoji(cmd.category)}\n`;
          output += `┃ ${cmd.description || 'No description available'}\n`;
          output += `┃ Usage: ${cmd.usage?.replace('{prefix}', prefix) || `${prefix}${cmd.name}`}\n┃\n`;
        });

        output += `┗━━━『 𝗣𝗔𝗚𝗘 ${page}/${totalPages} • ${prefix}help <number> 』━━━━┛`;

        return nexusMessage.reply(output);
      }

    } catch (error) {
      console.error('Help command error:', error);
      return nexusMessage.reply(`┏━━『 ❌ 𝗘𝗥𝗥𝗢𝗥 』━━┓\n┃ ${error.message || 'An unknown error occurred'}\n┗━━━━━━━━┛`);
    }
  }
};

function getEmoji(category) {
  const emojiMap = {
    'Menu': ' 📜',
    'General': ' 🌐',
    'Admin': ' 👑',
    'Fun': ' 🎮',
    'Utility': ' 🛠️',
    'Music': ' 🎵',
    'Moderation': ' 🛡️',
    'Economy': ' 💰',
    'Games': ' 🎲',
    'Social': ' 🤝',
    'Config': ' ⚙️',
    'Info': ' ℹ️',
    'Tools': ' 🔧',
    'NSFW': ' 🔞',
    'Leveling': ' 📊',
    'Premium': ' 💎',
    'Reaction': ' 😄',
    'Search': ' 🔍'
  };
  
  return emojiMap[category] || ' ';
}

function getUptime() {
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.join(' ') || '0s';
}

function boldText(text) {
  const boldChars = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜',
    'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥',
    'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
  };
  return text.split('').map(char => boldChars[char.toUpperCase()] || char).join('');
}