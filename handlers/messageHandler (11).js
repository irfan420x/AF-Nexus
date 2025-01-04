import commandHandler from './commandHandler.js';

export default async function messageHandler(api, message) {
await commandHandler(api, message);
}