import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sqlite from '../../sqlite.js';

const _filename = fileURLToPath(import.meta.url);
const __dirname = dirname(_filename);
const restartFilePath = path.join(__dirname, '..', '..', 'restart.json');

export default {
  config: {
    name: 'restart',
    description: 'Restart the bot',
    usage: '.restart',
    category: 'utility',
    permission: 1
  },
  run: async ({ api, message, nexusMessage }) => {
    const startTime = Date.now();
    await nexusMessage.reply('🔘Restarting...');
    await new Promise(resolve => setTimeout(resolve, 2000)); //
    const restartData = { timestamp: startTime, threadID: message.threadID, messageID: message.messageID };
    fs.writeFileSync(restartFilePath, JSON.stringify(restartData));
    process.exit(2);
  }
};