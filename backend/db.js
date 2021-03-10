require('dotenv').config();
const { MongoClient } = require('mongodb');

let db;

async function connectToDb() {
  const url = process.env.DB_URL || 'mongodb://localhost/conversationparade';
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

async function isConvoIdOriginal(convoId) {
  return !await db.collection('conversations').find({ id: convoId });
}

function generateConvoId() {
  let convoId = Math.random().toString(36).substr(2, 7);
  while (!isConvoIdOriginal(convoId)) {
    convoId = Math.random().toString(36).substr(2, 7);
  }
  return convoId;
}

function getDb() {
  return db;
}


module.exports = {
  connectToDb, generateConvoId, getDb,
};
