import fs from 'fs';

import path from 'path';

import { fileURLToPath } from 'url';

import { dirname } from 'path';

const _filename = fileURLToPath(import.meta.url);

const __dirname = dirname(_filename);

const dbPath = path.join(__dirname, 'database.json');

let dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

function readDB() {

  return dbData;

}

function writeDB(data) {

  dbData = data;

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

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

  db.groups[id] = data;

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

function getWarnings(threadID, userID) {

  const db = readDB();

  if (!db.groups[threadID]) {

    db.groups[threadID] = {};

  }

  if (!db.groups[threadID].warnings) {

    db.groups[threadID].warnings = {};

  }

  return db.groups[threadID].warnings[userID];

}

function setWarnings(threadID, userID, warnings) {

  const db = readDB();

  if (!db.groups[threadID]) {

    db.groups[threadID] = {};

  }

  if (!db.groups[threadID].warnings) {

    db.groups[threadID].warnings = {};

  }

  db.groups[threadID].warnings[userID] = warnings;

  writeDB(db);

}

function resetWarnings(threadID, userID) {

  const db = readDB();

  if (db.groups[threadID] && db.groups[threadID].warnings && db.groups[threadID].warnings[userID]) {

    delete db.groups[threadID].warnings[userID];

    writeDB(db);

  }

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

  getWarnings,

  setWarnings,

  resetWarnings,

  setBannedUser,

  removeBannedUser,

  isBannedUser,

  readDB,

  get,

  set

};
