import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const _filename = fileURLToPath(import.meta.url);
const __dirname = dirname(_filename);
const dbPath = path.join(__dirname, '.', 'database', 'database.json');

let dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

function writeDB(data) {
  dbData = data;
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function readDB() {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  if (!db.users) {
    db.users = {};
  }
  if (!db.groups) {
    db.groups = {};
  }
  return db;
}

function getUser(id) {
  const db = readDB();
  return db.users[id];
}

function setUser(id, data) {
  const db = readDB();
  db.users[id] = data;
  writeDB(db);
}

function getGroup(id) {
  const db = readDB();
  return db.groups[id];
}

function setGroup(id, data) {
  const db = readDB();
  if (!db.groups[id]) {
    db.groups[id] = {};
  }
  db.groups[id] = { ...db.groups[id], ...data };
  writeDB(db);
}

function getGroupPrefix(id) {
  const db = readDB();
  return db.groups[id] && db.groups[id].prefix;
}

function setGroupPrefix(id, prefix) {
  const db = readDB();
  if (!db.groups[id]) {
    db.groups[id] = {};
  }
  db.groups[id].prefix = prefix;
  writeDB(db);
}



function setBannedUser(userID, reason) {
  const db = readDB();
  if (!db.bannedUsers) {
    db.bannedUsers = {};
  }
  db.bannedUsers[userID] = reason;
  writeDB(db);
}

function removeBannedUser(userID) {
  const db = readDB();
  if (db.bannedUsers && db.bannedUsers[userID]) {
    delete db.bannedUsers[userID];
    writeDB(db);
  }
}

function isBannedUser(userID) {
  const db = readDB();
  return db.bannedUsers && db.bannedUsers[userID] !== undefined;
}

function setBannedThread(threadID, reason) {
  const db = readDB();
  if (!db.bannedThreads) {
    db.bannedThreads = {};
  }
  db.bannedThreads[threadID.toString()] = reason;
  writeDB(db);
}

function removeBannedThread(threadID) {
  const db = readDB();
  if (db.bannedThreads && db.bannedThreads[threadID]) {
    delete db.bannedThreads[threadID];
    writeDB(db);
  }
}

function isBannedThread(threadID) {
  const db = readDB();
  return db.bannedThreads && db.bannedThreads[threadID] !== undefined;
}
function getWarnings(threadID, userID) {
  const groupData = getGroup(threadID);
  if (!groupData || !groupData.warnings) {
    return 0;
  }
  return groupData.warnings[userID] || 0;
}

function getUserCoins(userID) {
  const db = readDB();
  return db.users[userID] ? db.users[userID].coins : 0;
}

function setUserCoins(userID, amount) {
  const db = readDB();
  if (!db.users[userID]) {
    db.users[userID] = {};
  }
  db.users[userID].coins = amount;
  writeDB(db);
}

function addCoins(userID, amount) {
  const currentCoins = getUserCoins(userID);
  setUserCoins(userID, currentCoins + amount);
}

function removeCoins(userID, amount) {
  const currentCoins = getUserCoins(userID);
  if (currentCoins >= amount) {
    setUserCoins(userID, currentCoins - amount);
  }
}

function get(key) {
  const db = readDB();
  return db[key];
}

function set(key, value) {
  const db = readDB();
  db[key] = value;
  writeDB(db);
}

export default {
  getUser,
  setUser,
  getGroup,
  setGroup,
  getGroupPrefix,
  setGroupPrefix,
  setBannedUser,
  removeBannedUser,
  isBannedUser,
  setBannedThread,
  removeBannedThread,
  isBannedThread,
  readDB,
  getWarnings,
  getUserCoins,
  setUserCoins,
  addCoins,
  removeCoins,
  get,
  set,
};