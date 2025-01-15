import db from '../../db.js';

export default {
  config: {
    name: 'group',
    description: 'Manage groups',
    category: 'admin',
    permission: 0,
    author: 'asta X frank',
    usage: '{p}group <list/search/leave/add> [arguments]',
  },
  run: async ({ api, message, args, config, nexusMessage }) => {
    if (args.length === 0) {
      nexusMessage.reply('Please provide an argument for the group command.');
      return;
    }
    const action = args.shift().toLowerCase();
    const threadID = message.threadID;

    switch (action) {
      case 'list': {
  const groups = db.readDB().groups;
  const groupList = Object.keys(groups).map((groupID) => {
    const warnedUsers = groups[groupID].warnedUsers;
    return `${groups[groupID].name} \nthreadID: ${groupID}\ngroupPrefix: ${groups[groupID].prefix}\nWarned Users:\n${warnedUsers || 'None'}`;
  }).join('\n\n');
  nexusMessage.reply(groupList);
  break;
}

case 'search': {
  if (args.length === 0) {
    nexusMessage.reply('Please provide a search query.');
    return;
  }
  const searchQuery = args.join(' ');
  if (!searchQuery) {
    nexusMessage.reply('Please provide a valid search query.');
    return;
  }
  const groups = db.readDB().groups;
  const searchResults = Object.keys(groups).filter(groupID => groups[groupID].name).filter((groupID) => {
    return groups[groupID].name.toLowerCase().match(searchQuery.toLowerCase());
  }).map((groupID, index) => {
    return `${index + 1}. ${groups[groupID].name} (ID: ${groupID})`;
  }).join('\n');
  if (searchResults) {
    nexusMessage.reply(searchResults);
  } else {
    nexusMessage.reply('No groups found matching the search query.');
  }
  break;
}
      case 'leave': {
  if (args.length === 0) {
    nexusMessage.reply('Please provide a group ID.');
    return;
  }
  const groupID = args.shift();
  try {
    await api.removeUserFromGroup(api.getCurrentUserID(), groupID);
    delete db.readDB().groups[groupID];
    db.writeDB(db.readDB());
    nexusMessage.reply(`Left group with ID ${groupID}.`);
  } catch (error) {
    nexusMessage.reply(`Failed to leave group with ID ${groupID}. Error: ${error.message}`);
  }
  break;
}
      case 'add': {
        if (args.length === 0) {
          nexusMessage.reply('Please provide a group ID.');
          return;
        }
        const groupID = args.shift();
        try {
          await api.addUserToGroup(message.senderID, groupID);
          nexusMessage.reply(`you to group with ID ${groupID}.`);
          if (!db.readDB().groups[groupID]) {
            db.set('groups', { ...db.get('groups'), [groupID]: { name: 'Unknown Group' } });
          }
        } catch (error) {
          nexusMessage.reply(`Failed to add you to group with ID ${groupID}. Error: ${error.message}`);
        }
        break;
      }
      default: {
        nexusMessage.reply(`Invalid action "${action}" for the group command.`);
        break;
      }
    }
  },
};