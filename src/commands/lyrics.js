import axios from 'axios';

export default {
  config: {
    name: 'lyrics',
    aliases: [],
    description: 'Fetches the lyrics of a song',
    usage: '(prefix)lyrics <song name>',
    author: 'Your Name',
    category: 'music',
    permission: 0,
  },
  run: async ({ api, message, args, nexusMessage }) => {
    if (!args[0]) {
      nexusMessage.reply('Please provide a song name');
      return;
    }

    const songName = args.join(' ');
    const encodedSongName = encodeURIComponent(songName);

    try {
      const response = await axios.get(`https://project-lyrics-api.vercel.app/lyrics?q=${encodedSongName}`);
      const lyricsData = response.data;

      if (!lyricsData.status) {
        nexusMessage.reply('Lyrics not found');
        return;
      }

      const lyrics = lyricsData.lyrics;
      let lyricsText = '';

      lyrics.forEach((lyric) => {
        lyricsText += `${lyric.text}\n`;
      });

      const totalTime = lyricsData.timestamps.end;
      lyricsText += `\nTotal Time: ${totalTime}`;

      nexusMessage.reply(lyricsText);
    } catch (error) {
      nexusMessage.reply('Error fetching lyrics');
    }
  },
};