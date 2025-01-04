import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const _filename = fileURLToPath(import.meta.url);
const __dirname = dirname(_filename);

async function eventsHandler(api, event) {
  const eventsPath = path.join(__dirname, '..', 'src', 'events');
  const eventFiles = fs.readdirSync(eventsPath);

  for (const file of eventFiles) {
    if (file.endsWith('.js')) {
      const eventFunction = await import(path.join(eventsPath, file));
      if (eventFunction.default.eventType === event.logMessageType) {
        await eventFunction.default.run(api, event);
      }
    }
  }
}

export default eventsHandler;