import sqlite3 from 'better-sqlite3';
import cron from 'node-cron';

const db = new sqlite3('./database/nexus.db');

async function createDatabase() {
  db.prepare('CREATE TABLE IF NOT EXISTS restart_status (status INTEGER)').run();
}

async function setRestartStatus(status) {
  await createDatabase();
  db.prepare('INSERT OR REPLACE INTO restart_status (status) VALUES (?)').run(status);
}

async function getRestartStatus() {
  await createDatabase();
  const row = db.prepare('SELECT status FROM restart_status').get();
  return row ? row.status : 0;
}

// Schedule a task to delete all data every 2 hours
cron.schedule('0 */2 * * *', async () => {
  db.prepare('DELETE FROM sqlite_sequence').run();
  db.prepare('DELETE FROM restart_status').run();
});

export default { setRestartStatus, getRestartStatus };