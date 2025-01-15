
import { commands } from '../../index.js'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const _filename = fileURLToPath(import.meta.url);
const __dirname = dirname(_filename);

export default {
  config: {
    name: "help2",
    description: "📚 View all available commands and their categories",
    usage: "help [page number]",
    category: "utility",
    permission: 0
  },

  run: async ({ api, message, args }) => {
    const commands = global.client.commands;
    const PREFIX = global.config.PREFIX || "!";
    const pageSize = 8;
    const page = parseInt(args[0]) || 1;

    const categories = new Map();
    commands.forEach((cmd, name) => {
      const category = cmd.config.category?.toUpperCase() || "MISC";
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category).push({
        name: name,
        desc: cmd.config.description || "No description available"
      });
    });

    const sortedCategories = [...categories.keys()].sort();
    const totalPages = Math.ceil(sortedCategories.length / pageSize);

    if (page < 1 || page > totalPages) {
      return api.sendMessage(
        `❌ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚙𝚊𝚐𝚎! 𝙿𝚕𝚎𝚊𝚜𝚎 𝚌𝚑𝚘𝚘𝚜𝚎 𝟷-${totalPages}`,
        message.threadID,
        message.messageID
      );
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const displayCategories = sortedCategories.slice(start, end);

    let response = `╭─❍ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 ❍─╮\n\n`;
    response += `📎 𝐏𝐫𝐞𝐟𝐢𝐱: ${PREFIX}\n`;
    response += `📄 𝐏𝐚𝐠𝐞: ${page}/${totalPages}\n\n`;

    for (const category of displayCategories) {
      const cmds = categories.get(category);
      response += `╭─❍ ${category} ❍─╮\n`;
      
      for (const cmd of cmds) {
        response += `┃ ⭔ ${cmd.name}\n`;
      }
      
      response += `╰────────⟡\n\n`;
    }

    response += `╭─❍ 𝐇𝐎𝐖 𝐓𝐎 𝐔𝐒𝐄 ❍─╮\n`;
    response += `┃ ⭔ ${PREFIX}help [page]\n`;
    response += `┃ ⭔ ${PREFIX}help [command]\n`;
    response += `╰──────────⟡\n\n`;

    if (totalPages > 1) {
      response += `📩 𝐓𝐲𝐩𝐞: ${PREFIX}help ${page + 1} 𝐟𝐨𝐫 𝐧𝐞𝐱𝐭 𝐩𝐚𝐠𝐞\n`;
    }

    response += `╰─❍ 𝐄𝐍𝐃 ❍─╯`;

    if (args[0] && !isNaN(args[0]) && categories.has(args[0].toUpperCase())) {
      const category = args[0].toUpperCase();
      const cmds = categories.get(category);
      
      let categoryHelp = `╭─❍ ${category} 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 ❍─╮\n\n`;
      
      for (const cmd of cmds) {
        categoryHelp += `┃ ⭔ ${cmd.name}\n`;
        categoryHelp += `┃ └─ ${cmd.desc}\n\n`;
      }
      
      categoryHelp += `╰────────⟡`;
      
      return api.sendMessage(categoryHelp, message.threadID, message.messageID);
    }

    api.sendMessage(response, message.threadID, message.messageID);

    const commandInfo = commands.get(args[0]?.toLowerCase());
    if (commandInfo) {
      let helpInfo = `╭─❍ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ❍─╮\n\n`;
      helpInfo += `📝 𝐍𝐚𝐦𝐞: ${commandInfo.config.name}\n`;
      helpInfo += `📚 𝐃𝐞𝐬𝐜: ${commandInfo.config.description || "No description"}\n`;
      helpInfo += `💭 𝐔𝐬𝐚𝐠𝐞: ${PREFIX}${commandInfo.config.usage || commandInfo.config.name}\n`;
      helpInfo += `📁 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲: ${commandInfo.config.category || "Misc"}\n`;
      helpInfo += `🔐 𝐏𝐞𝐫𝐦: ${commandInfo.config.permission || 0}\n`;
      helpInfo += `\n╰───────⟡`;

      api.sendMessage(helpInfo, message.threadID);
    }
  }
};