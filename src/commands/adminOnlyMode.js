export default {
  config: {
    name: "adminonly",
    aliases: ["ao"],
    usage: "admin only [on/off]",
    category: "Admin",
    description: "a command that allows only admins of the bot to use it",
    permission: 1
  },
  run: async ({ api, message, args, config, nexusMessage }) => {
    if (args[0] === "on") {
      global.adminOnlyMode = true;
      nexusMessage.reply("AdminOnly mode is now enabled. Only admins can use the bot.");
    } else if (args[0] === "off") {
      global.adminOnlyMode = false;
      nexusMessage.reply("AdminOnly mode is now disabled. Everyone can use the bot.");
    } else {
      nexusMessage.reply("Invalid argument. Please use 'on' or 'off'.");
    }
  }
};