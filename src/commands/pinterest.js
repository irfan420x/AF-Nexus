export default {
config: {
name: 'pinterest',
description: 'Search images on Pinterest',
usage: '(prefix)pinterest',
permission: 0,
author: "Frank kaumba x Asta",
category: "image"
},
Nexus: async ({ api, message, args, nexusMessage }) => {
try {
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const searchQuery = args.join(" ");
if (!searchQuery.includes("-")) {
return nexusMessage.reply(`Invalid format. Example: {prefix}pinterest cats -5`);
}
const [query, numImages] = searchQuery.split("-").map(str => str.trim());
const numberOfImages = parseInt(numImages);
if (isNaN(numberOfImages) || numberOfImages <= 0 || numberOfImages > 8) {
return nexusMessage.reply("Please specify a number between 1 and 8.");
}
const apiUrl = `https://lance-frank-asta.onrender.com/api/pinterest?text=${encodeURIComponent(query)}`;
const response = await axios.get(apiUrl);
const imageData = response.data.result;
if (!imageData || !Array.isArray(imageData) || imageData.length === 0) {
return nexusMessage.reply(`No images found for "${query}".`);
}
const imgData = [];
for (let i = 0; i < Math.min(numberOfImages, imageData.length); i++) {
const imageUrl = imageData[i];
try {
const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
await fs.outputFile(imgPath, imgResponse.data);
imgData.push(fs.createReadStream(imgPath));
} catch (error) {
console.error(error);
}
}
await nexusMessage.reply({ attachment: imgData, body: `` });
} catch (error) {
console.error(error);
await nexusMessage.reply(`An error occurred.`);
}
}
};