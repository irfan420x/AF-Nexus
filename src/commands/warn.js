import db from '../../db.js';

export default {
  config: {
    name: 'warn',
    aliases: ['warning'],
    permission: 2,
    category: 'utility',
    usage: 'p warning ',
    description: 'warn user'
  },
  Nexus: async ({ api, message, args, nexusMessage }) => {
    if (message.threadID === message.senderID) {
      nexusMessage.reply('This command only works in groups.');
      return;
    }
    const isAdmin = await api.getThreadInfo(message.threadID);
    const botID = await api.getCurrentUserID();
if (!isAdmin.adminIDs.some(admin => admin.id === botID)) {
  nexusMessage.reply('The bot needs to be an admin in the group to use this command.');
  return;
}
    if (args.length < 2) {
      nexusMessage.reply('Please provide a user ID or tag the user and a reason for the warning.');
      return;
    }
    
    let userID;
    if (args[0].startsWith('@')) {
  if (message.mentions) {
    userID = Object.keys(message.mentions)[0];
  } else {
    nexusMessage.reply('Invalid mention format.');
    return;
  }
} else {
  userID = args[0];
}
    const reason = args.slice(1).join(' ');

    const groupData = db.getGroup(message.threadID);
if (!groupData) {
  nexusMessage.reply('Group data not found.');
  return;
}


      

const existingGroupData = db.getGroup(message.threadID) || {};
if (!existingGroupData.warnings) {
  existingGroupData.warnings = {};
}
if (!existingGroupData.warnings[userID]) {
  existingGroupData.warnings[userID] = 0;
}
existingGroupData.warnings[userID]++;

db.setGroup(message.threadID, existingGroupData);

nexusMessage.reply(`User ${userID} has been warned. Reason: ${reason} | Warnings remaining: ${3 - existingGroupData.warnings[userID]}`);

if (existingGroupData.warnings[userID] >= 3) {
  api.removeUserFromGroup(userID, message.threadID);
  nexusMessage.reply(`User ${userID} has been kicked from the group.`);
  existingGroupData.warnings[userID] = 0; // Reset warnings
  db.setGroup(message.threadID, existingGroupData);
}
      },
    };