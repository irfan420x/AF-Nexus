export default {
  config: {
    name: 'weather',
    version: '1.0',
    author: 'Frank X Asta',
    aliases: ['w'],
    cooldown: 5,
    permission: 0,
    category: 'Utility',
    description: 'Shows weather information for a location',
    usage: '{prefix}weather [location]'
  },

  run: async ({ nexusMessage, args }) => {
    try {
      if (!args[0]) {
        return nexusMessage.reply(`┏━━『 ❌ 𝗘𝗥𝗥𝗢𝗥 』━━┓\n┃ Please provide a location!\n┗━━━━━━━━┛`);
      }

      const location = args.join(" ");
      const apiKey = 'KbJ1pgLpCpa7lGmk56EO7kUWAUmgArV0';
      const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${encodeURIComponent(location)}`;

      const locationResponse = await fetch(locationUrl);
      const locationData = await locationResponse.json();

      if (!locationData || !locationData.length) {
        return nexusMessage.reply(`┏━━『 ❌ 𝗘𝗥𝗥𝗢𝗥 』━━┓\n┃ Location not found!\n┗━━━━━━━┛`);
      }

      const locationKey = locationData[0].Key;
      const weatherUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}&details=true`;

      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      if (!weatherData || !weatherData.length) {
        return nexusMessage.reply(`┏━━『 ❌ 𝗘𝗥𝗥𝗢𝗥 』━━┓\n┃ Weather data not available!\n┗━━━━━━━┛`);
      }

      const weather = weatherData[0];
      const output = `┏━『 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 𝗜𝗡𝗙𝗢 』━┓\n┃\n` + 
        `┣━━『 📍 𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡 』\n` +
        `┃ ${locationData[0].LocalizedName}, ${locationData[0].Country.LocalizedName}\n┃\n` +
        `┣━━『 🌡️ 𝗧𝗘𝗠𝗣𝗘𝗥𝗔𝗧𝗨𝗥𝗘 』\n` +
        `┃ ${Math.round(weather.Temperature.Metric.Value)}°C\n` +
        `┃ Feels like: ${Math.round(weather.RealFeelTemperature.Metric.Value)}°C\n┃\n` +
        `┣━━『 🌅 𝗖𝗢𝗡𝗗𝗜𝗧𝗜𝗢𝗡𝗦 』\n` +
        `┃ ${weather.WeatherText}\n┃\n` +
        `┣━━『 💨 𝗪𝗜𝗡𝗗 』\n` +
        `┃ Speed: ${weather.Wind.Speed.Metric.Value} km/h\n` +
        `┃ Direction: ${weather.Wind.Direction.Degrees}°\n┃\n` +
        `┣━━『 💧 𝗛𝗨𝗠𝗜𝗗𝗜𝗧𝗬 』\n` +
        `┃ ${weather.RelativeHumidity}%\n┃\n` +
        `┣━━『 🌍 𝗣𝗥𝗘𝗦𝗦𝗨𝗥𝗘 』\n` +
        `┃ ${weather.Pressure.Metric.Value} hPa\n` +
        `┗━━━━━━━━┛`;

      return nexusMessage.reply(output);

    } catch (error) {
      console.error('Weather command error:', error);
      return nexusMessage.reply(`┏━━『 ❌ 𝗘𝗥𝗥𝗢𝗥 』━━┓\n┃ ${error.message || 'An unknown error occurred'}\n┗━━━━━━━┛`);
    }
  }
};
