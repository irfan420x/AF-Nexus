import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import gradient from 'gradient-string';
import config from './config.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';
import figlet from 'figlet';
import http from 'http';
import login from 'newgen-fca';
import commandHandler from './handlers/commandHandler.js';
import db from './db.js';
import sqlite from './sqlite.js';
import eventsHandler from './handlers/eventsHandler.js';

import restart from './src/commands/restart.js';
const _filename = fileURLToPath(import.meta.url);
const __dirname = dirname(_filename);
const restartFilePath = path.join(__dirname, '.', 'restart.json');

function generateRandomDelay(min = 500, max = 2000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showBanner() {
  return new Promise((resolve) => {
    figlet("Nexus", (err, data) => {
      if (!err) console.log(gradient.rainbow(data));
      resolve();
    });
  });
}

const commands = new Map();
const cooldowns = new Map();
const events = new Map();
const failedCommands = [];
const failedEvents = [];

async function secureRequest(url, options = {}) {
  try {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      'Mozilla/5.0 (X11; Linux x86_64)',
    ];
    const response = await axios({
      ...options,
      url,
      headers: {
        ...options.headers,
        'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: 'https://www.facebook.com/',
      },
    });
    return response.data;
  } catch (error) {
    console.error(chalk.red('Secure Request Failed:'), error.message);
    return null;
  }
}

async function loadCommands() {
  const commandPath = path.join(__dirname, '.', 'src', 'commands');
  const files = fs.readdirSync(commandPath);
  for (const file of files) {
    if (file.endsWith('.js')) {
      try {
        const command = await import(path.join(commandPath, file));
        console.log(chalk.green(`Loaded command: ${command.default.config.name}`));
        commands.set(command.default.config.name, command.default);
      } catch (err) {
        failedCommands.push(file);
        console.log(
          chalk.red(`Failed to load command: ${file}`),
          chalk.yellow(err.message)
        );
      }
    }
  }
}
async function loadEvents() {
  const eventPath = path.join(__dirname, '.', 'src', 'events');
  const files = fs.readdirSync(eventPath);
  for (const file of files) {
    if (file.endsWith('.js')) {
      try {
        const event = await import(path.join(eventPath, file));
        events.set(event.default.config.name, event.default);
      } catch (err) {
        failedEvents.push(file);
        console.log(
          chalk.red(`Failed to load event: ${file}`),
          chalk.yellow(err.message)
        );
      }
    }
  }
}

async function loginCredentials() {
  await showBanner();
  let appState;
  try {
    const appStateData = await fs.promises.readFile('appState.json', 'utf8');
    appState = JSON.parse(appStateData.toString());
  } catch (error) {
    console.log(chalk.red('Error reading appstate.json:', error));
    return;
  }
  if (!appState) {
    console.error('App state is empty or undefined');
    return;
  }
  console.log('Sending appState to login function:');
  login({ appState: appState }, (err, api) => {
    if (err) {
      console.error(chalk.red('Login Error:'), err);
      process.exit(1);
    } else {
      api.setOptions({
        listenEvents: true,
        selfListen: false,
        logLevel: 'warn',
      });
      const appState = api.getAppState();
      fs.writeFileSync('appState.json', JSON.stringify(appState));
      console.log('Successfully logged in');
      main(api);
    }
  });
}

async function main(api) {
  console.log(chalk.green('Loading commands...'));
  const commandPath = path.join(__dirname, '.', 'src', 'commands');
  const files = fs.readdirSync(commandPath);
  let i = 0;
  const interval = setInterval(async () => {
    if (i < files.length) {
      if (files[i].endsWith('.js')) {
        try {
          const command = await import(path.join(commandPath, files[i]));
          console.log(chalk.green(`Loaded command: ${command.default.config.name}`));
          commands.set(command.default.config.name, command.default);
        } catch (err) {
          failedCommands.push(files[i]);
          console.log(chalk.red(`Failed to load command: ${files[i]}`), chalk.yellow(err.message));
        }
      }
      i++;
    } else {
      clearInterval(interval);
      await loadEvents();
      console.log(chalk.green(`Loaded ${commands.size} commands`));
      console.log(chalk.green(`Loaded ${events.size} events`));
      console.log(chalk.green(`Failed to load ${failedCommands.length} commands`));
      console.log(chalk.green(`Failed to load ${failedEvents.length} events`));
      console.log(chalk.green('Ready!'));
      api.listenMqtt(async (err, message) => {
        if (err) {
          console.error(chalk.red('Listener Error:'), err);
          return;
        }
        if (message.type === 'typ' || message.type === 'presence') {
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, generateRandomDelay()));
        const groupPrefix = await db.getGroupPrefix(message.threadID);
        commandHandler(api, message, db);
        await eventsHandler(api, message);
      });
 if (fs.existsSync(restartFilePath)) {
  const restartData = JSON.parse(fs.readFileSync(restartFilePath, 'utf8'));
  const restartTime = (Date.now() - restartData.timestamp) / 1000;
  api.sendMessage(`✅Bot has restarted successfully \n🕜time: ${restartTime.toFixed(1)} seconds`, restartData.threadID, restartData.messageID);
  fs.unlinkSync(restartFilePath);
}
    }
  }, 100);
}
const server = http.createServer((req, res) => {
const filePath = path.join(__dirname, 'index.html');
fs.readFile(filePath, (err, data) => {
if (err) {
console.error(err);
res.writeHead(404);
res.end('File not found');
} else {
res.writeHead(200, { 'Content-Type': 'text/html' });
res.end(data);
}
});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  const text = `Nexus`;
  let i = 0;
  const interval = setInterval(() => {
    process.stdout.write(text[i]);
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      console.log('');
      setTimeout(() => {
        console.log(chalk.bold.cyan(`-----------------------Nexus-------------------`));
      }, 500);
      setTimeout(() => {
        console.log(chalk.bold.cyan(`Advanced Messenger Bot`) + chalk.gray(`| v${config.version || '2.0.0'}`));
      }, 1000);
      setTimeout(() => {
        console.log(chalk.green(' Prefix: '), chalk.yellow(config.prefix));
      }, 1500);
      setTimeout(() => {
        console.log(chalk.green(' Admin IDs: '), chalk.yellow(config.adminIds));
      }, 2000);
      setTimeout(() => {
        console.log(chalk.green(' Bot Name: '), chalk.yellow(config.botName));
      }, 2500);
      setTimeout(() => {
        console.log(`Server listening on port ${PORT}`);
        loginCredentials();
      }, 3000);
    }
  }, 100);
});
function autoRestart(config) {
if (config.autoRestart && config.autoRestart.status) {
const cron = require("node-cron");
cron.schedule(`*/${config.autoRestart.time} * * * *`, () => {
console.log(chalk.yellow('Restarting the bot...'));
process.exit(1);
});
}
}

global.config = config;
global.botName = config.botName;
global.prefix = config.prefix;
global.adminBot = config.adminIds || [];

autoRestart(config);

// Added logging mechanism
const logSeparator = (message) => {
const separator = '—'.repeat(10);
console.log(gradient.pastel(`${separator} ${message} ${separator}`));
};

const systemLog = (message) => {
console.log(gradient.pastel(`[ SYSTEM ] ${message}`));
};

// Call the systemLog function
systemLog('Starting up Nexus...');
// Call the logSeparator function
logSeparator('Nexus Starting Up');

export { commands, generateRandomDelay, loadCommands };

