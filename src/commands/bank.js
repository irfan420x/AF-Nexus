import db from '../../db.js';

export default {
  config: {
    name: 'bank',
    version: '1.0',
    author: 'Frank Kaumba',
    cooldown: 5,
    permission: 0,
    category: 'Fun',
    description: 'Virtual banking system',
    usage: '(prefix)bank [check/deposit/withdraw/transfer/loan/gamble/daily/help]'
  },
  run: async ({ nexusMessage, args, prefix }) => {
    const userID = nexusMessage.senderID;
    const command = args[0]?.toLowerCase();
    const amount = parseFloat(args[1]);
    const recipientID = args[2];

    let userData = db.getUser(userID);
    if (!userData) {
      userData = {
        balance: 1000,
        savings: 0,
        loan: 0,
        lastDaily: null,
        transactions: []
      };
      db.setUser(userID, userData);
    }

    if (!command || command === 'help') {
        const prefix = global.prefix;
      return nexusMessage.reply(
        `╭─⭓ 𝐁𝐀𝐍𝐊 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 ⭓─╮
│ ├─⭓ 𝐁𝐚𝐬𝐢𝐜 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬:
│ • ${prefix}bank check - View balance
│ • ${prefix}bank deposit [amount]
│ • ${prefix}bank withdraw [amount]
│ • ${prefix}bank transfer [amount] [userID]
│ ├─⭓ 𝐒𝐚𝐯𝐢𝐧𝐠𝐬 (3% 𝐢𝐧𝐭𝐞𝐫𝐞𝐬𝐭):
│ • ${prefix}bank savings deposit [amount]
│ • ${prefix}bank savings withdraw [amount]
│ ├─⭓ 𝐋𝐨𝐚𝐧𝐬 & 𝐆𝐚𝐦𝐛𝐥𝐢𝐧𝐠:
│ • ${prefix}bank loan [amount] - Max $5000
│ • ${prefix}bank pay [amount] - Pay loan
│ • ${prefix}bank gamble [amount] - 50% chance
│ ├─⭓ 𝐃𝐚𝐢𝐥𝐲 & 𝐒𝐞𝐜𝐮𝐫𝐢𝐭𝐲:
│ • ${prefix}bank daily - Get bonus
│ • ${prefix}bank protect - Buy protection
│ • ${prefix}bank history - View transactions
╰──────⭓`
      );
    }

    if (command === 'check') {
      const loanText = userData.loan > 0 ? `\n├─⭓ 𝐋𝐨𝐚𝐧: $${userData.loan.toFixed(2)}` : '';
      const protectionText = userData.robberyProtection ? '\n├─⭓ 𝐏𝐫𝐨𝐭𝐞𝐜𝐭𝐢𝐨𝐧: Active' : '';
      return nexusMessage.reply(
        `╭─⭓ 𝐁𝐀𝐍𝐊 𝐁𝐀𝐋𝐀𝐍𝐂𝐄 ⭓─╮
├─⭓ 𝐁𝐚𝐥𝐚𝐧𝐜𝐞: $${userData.balance.toFixed(2)}
├─⭓ 𝐒𝐚𝐯𝐢𝐧𝐠𝐬: $${userData.savings.toFixed(2)}${loanText}${protectionText}
╰──────⭓`
      );
    }

    if (command === 'deposit') {
      if (!amount || amount <= 0) return nexusMessage.reply("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐚𝐦𝐨𝐮𝐧𝐭");
      const currentBalance = db.getUserCoins(userID);
db.setUserCoins(userID, currentBalance + bonus + savingsInterest);
      return nexusMessage.reply(
        `╭─⭓ 𝐃𝐄𝐏𝐎𝐒𝐈𝐓 ⭓─╮

├─⭓ 𝐀𝐦𝐨𝐮𝐧𝐭: $${amount.toFixed(2)}
├─⭓ 𝐍𝐞𝐰 𝐛𝐚𝐥𝐚𝐧𝐜𝐞: $${(db.getUserCoins(userID) + amount).toFixed(2)}
╰──────⭓`
);
}

if (command === 'withdraw') {
  if (!amount || amount <= 0) return nexusMessage.reply("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐚𝐦𝐨𝐮𝐧𝐭");
  if (amount > db.getUserCoins(userID)) return nexusMessage.reply("❌ 𝐈𝐧𝐬𝐮𝐟𝐟𝐢𝐜𝐢𝐞𝐧𝐭 𝐟𝐮𝐧𝐝𝐬");
  db.setUserCoins(userID, db.getUserCoins(userID) - amount);
  return nexusMessage.reply(
    `╭─⭓ 𝐖𝐈𝐓𝐇𝐃𝐑𝐀𝐖 ⭓─╮
├─⭓ 𝐀𝐦𝐨𝐮𝐧𝐭: $${amount.toFixed(2)}
├─⭓ 𝐍𝐞𝐰 𝐛𝐚𝐥𝐚𝐧𝐜𝐞: $${(db.getUserCoins(userID) - amount).toFixed(2)}
╰──────⭓`
);
}

if (command === 'transfer') {
  if (!amount || amount <= 0) return nexusMessage.reply("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐚𝐦𝐨𝐮𝐧𝐭");
  if (amount > db.getUserCoins(userID)) return nexusMessage.reply("❌ 𝐈𝐧𝐬𝐮𝐟𝐟𝐢𝐜𝐢𝐞𝐧𝐭 𝐟𝐮𝐧𝐝𝐬");
  const recipientData = db.getUser(recipientID);
  if (!recipientData) return nexusMessage.reply("❌ 𝐑𝐞𝐜𝐢𝐩𝐢𝐞𝐧𝐭 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝");
  db.setUserCoins(userID, db.getUserCoins(userID) - amount);
  db.setUserCoins(recipientID, db.getUserCoins(recipientID) + amount);
  return nexusMessage.reply(
    `╭─⭓ 𝐓𝐑𝐀𝐍𝐒𝐅𝐄𝐑 ⭓─╮
├─⭓ 𝐀𝐦𝐨𝐮𝐧𝐭: $${amount.toFixed(2)}
├─⭓ 𝐑𝐞𝐜𝐢𝐩𝐢𝐞𝐧𝐭: ${recipientID}
╰──────⭓`
);
}

if (command === 'loan') {
  if (!amount || amount <= 0) return nexusMessage.reply("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐚𝐦𝐨𝐮𝐧𝐭");
  if (amount > 5000) return nexusMessage.reply("❌ 𝐋𝐨𝐚𝐧 𝐚𝐦𝐨𝐮𝐧𝐭 𝐭𝐨𝐨 𝐡𝐢𝐠𝐡");
  db.setUserCoins(userID, db.getUserCoins(userID) + amount);
  db.setUser(userID, { ...userData, loan: userData.loan + amount });
  return nexusMessage.reply(
    `╭─⭓ 𝐋𝐎𝐀𝐍 ⭓─╮
├─⭓ 𝐀𝐦𝐨𝐮𝐧𝐭: $${amount.toFixed(2)}
├─⭓ 𝐍𝐞𝐰 𝐛𝐚𝐥𝐚𝐧𝐜𝐞: $${(db.getUserCoins(userID) + amount).toFixed(2)}
╰──────⭓`
);
}

if (command === 'pay') {
  if (!amount || amount <= 0) return nexusMessage.reply("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐚𝐦𝐨𝐮𝐧𝐭");
  if (amount > userData.loan) return nexusMessage.reply("❌ 𝐀𝐦𝐨𝐮𝐧𝐭 𝐭𝐨𝐨 𝐡𝐢𝐠𝐡");
  db.setUserCoins(userID, db.getUserCoins(userID) - amount);
  db.setUser(userID, { ...userData, loan: userData.loan - amount });
  return nexusMessage.reply(
    `╭─⭓ 𝐏𝐀𝐘 ⭓─╮
├─⭓ 𝐀𝐦𝐨𝐮𝐧𝐭: $${amount.toFixed(2)}
├─⭓ 𝐍𝐞𝐰 𝐛𝐚𝐥𝐚𝐧𝐜𝐞: $${(db.getUserCoins(userID) - amount).toFixed(2)}
╰──────⭓`
);
}

if (command === 'gamble') {
  if (!amount || amount <= 0) return nexusMessage.reply("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐚𝐦𝐨𝐮𝐧𝐭");
  if (amount > db.getUserCoins(userID)) return nexusMessage.reply("❌ 𝐈𝐧𝐬𝐮𝐟𝐟𝐢𝐜𝐢𝐞𝐧𝐭 𝐟𝐮𝐧𝐝𝐬");
  const win = Math.random() >= 0.5;
  const newBalance = win ? db.getUserCoins(userID) + amount : db.getUserCoins(userID) - amount;
  db.setUserCoins(userID, newBalance);
  return nexusMessage.reply(
    `╭─⭓ 𝐆𝐀𝐌𝐁𝐋𝐄 ⭓─╮
├─⭓ 𝐑𝐞𝐬𝐮𝐥𝐭: ${win ? '𝐖𝐈𝐍!' : '�𝐎𝐒𝐓!'}
├─⭓ 𝐀𝐦𝐨𝐮𝐧𝐭: $${amount.toFixed(2)}
├─⭓ 𝐍𝐞𝐰 𝐛𝐚𝐥𝐚𝐧𝐜𝐞: $${newBalance.toFixed(2)}
╰──────⭓`
);
}

if (command === 'daily') {
  const now = new Date();
  const lastDaily = userData.lastDaily ? new Date(userData.lastDaily) : null;
  if (lastDaily && now - lastDaily < 86400000) {
    const timeLeft = 86400000 - (now - lastDaily);
    const hoursLeft = Math.floor(timeLeft / 3600000);
    const minutesLeft = Math.floor((timeLeft % 3600000) / 60000);
    return nexusMessage.reply(
      `╭─⭓ 𝐃𝐀𝐈𝐋𝐘 𝐁𝐎𝐍𝐔𝐒 ⭓─╮
├─⭓ 𝐒𝐭𝐚𝐭𝐮𝐬: On cooldown
├─⭓ 𝐓𝐢𝐦𝐞 𝐥𝐞𝐟𝐭: ${hoursLeft}h ${minutesLeft}m
╰──────⭓`
    );
  }
  const bonus = 100;
  const savingsInterest = Math.floor(db.getUserCoins(userID) * 0.03);
  db.setUserCoins(userID, db.getUserCoins(userID) + bonus + savingsInterest);
  db.setUser(userID, { ...userData, lastDaily: now.toISOString() });
  return nexusMessage.reply(
    `╭─⭓ 𝐃𝐀𝐈�
├─⭓ 𝐃𝐀𝐈𝐋𝐘 𝐁𝐎𝐍𝐔𝐒 ⭓─╮
├─⭓ 𝐁𝐨𝐧𝐮𝐬: $${bonus}
├─⭓ 𝐈𝐧𝐭𝐞𝐫𝐞𝐬𝐭: $${savingsInterest}
├─⭓ 𝐍𝐞𝐰 𝐛𝐚𝐥𝐚𝐧𝐜𝐞: $${(db.getUserCoins(userID) + bonus + savingsInterest).toFixed(2)}
╰──────⭓`
);
}

if (command === 'protect') {
  const protectionCost = 100;
  if (db.getUserCoins(userID) < protectionCost) return nexusMessage.reply("❌ 𝐈𝐧𝐬𝐮𝐟𝐟𝐢𝐜𝐢𝐞𝐧𝐭 𝐟𝐮𝐧𝐝𝐬");
  db.setUserCoins(userID, db.getUserCoins(userID) - protectionCost);
  db.setUser(userID, { ...userData, robberyProtection: true });
  return nexusMessage.reply(
    `╭─⭓ 𝐏𝐑𝐎𝐓𝐄𝐂𝐓𝐈𝐎𝐍 ⭓─╮
├─⭓ 𝐂𝐨𝐬𝐭: $${protectionCost}
├─⭓ 𝐏𝐫𝐨𝐭𝐞𝐜𝐭𝐢𝐨𝐧: Active
╰──────⭓`
);
}
if (command === 'history') {
  const transactions = userData.transactions;
  if (transactions.length === 0) return nexusMessage.reply("❌ 𝐍𝐨 𝐭𝐫𝐚𝐧𝐬𝐚𝐜𝐭𝐢𝐨𝐧𝐬 𝐟𝐨𝐮𝐧𝐝");
  const transactionHistory = transactions.map((transaction, index) => {
    return `├─⭓ ${index + 1}. ${transaction.type} $${transaction.amount}`;
  }).join('\n');
  return nexusMessage.reply(
    `╭─⭓ 𝐓𝐑𝐀𝐍𝐒𝐀𝐂𝐓𝐈𝐎𝐍 𝐇𝐈𝐒𝐓𝐎𝐑𝐘 ⭓─╮
${transactionHistory}
╰──────⭓`
);
}
return nexusMessage.reply("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐜𝐨𝐦𝐦𝐚𝐧𝐝. 𝐔𝐬𝐞 'bank help' 𝐭𝐨 𝐬𝐞𝐞 𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬.");
}
};