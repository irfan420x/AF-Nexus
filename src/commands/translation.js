import axios from 'axios';

export default {
  config: {
    name: 'translate',
     aliases: ['trans'],
    description: 'Translate text from one language to another',
    usage: '(prefix)translate <text to translate> [language code]',
     category: 'utility ',
    permission: 0,
  },
  run: async ({ api, message, args, config }) => {
    if (message.messageReply) {
      const textToTranslate = message.messageReply.body;
      const lang = 'en';

      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(textToTranslate)}`;

      try {
        const response = await axios.get(url);
        const translatedText = response.data.sentences[0].trans;

        api.sendMessage(`(🌲Translation) \n ${translatedText} \n\n translated from ${response.data.src} to ${lang}`, message.threadID, message.messageID);
      } catch (error) {
        api.sendMessage('Error translating text. Please try again later.', message.threadID, message.messageID);
      }
    } else {
      const textToTranslate = args.join(' ');

      let lang;
      let originalText;

      if (textToTranslate.includes('=>')) {
        [originalText, lang] = textToTranslate.split('=>');
      } else if (textToTranslate.includes('=')) {
        [originalText, lang] = textToTranslate.split('=');
      } else {
        originalText = textToTranslate;
        lang = 'en';
      }

      originalText = originalText.trim();
      lang = lang.trim();

      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(originalText)}`;

      try {
        const response = await axios.get(url);
        const translatedText = response.data.sentences[0].trans;

        api.sendMessage(`(🌲Translation) \n ${translatedText} \n\n translated from ${response.data.src} to ${lang}`, message.threadID, message.messageID);
      } catch (error) {
        api.sendMessage('Error translating text. Please try again later.', message.threadID, message.messageID);
      }
    }
  },
};