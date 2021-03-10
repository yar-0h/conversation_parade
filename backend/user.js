/* eslint-disable no-underscore-dangle */
const {
  getDb,
} = require('./db.js');

async function createAnonymous() {
  const db = getDb();
  const anonymousUser = Object.assign({});
  anonymousUser.name = 'stranger';
  const result = await db.collection('users').insertOne(anonymousUser);
  const establishedUser = await db.collection('users').findOne({ _id: result.insertedId });
  return establishedUser;
}

// PLACEHOLDER
async function createUser() {
  const db = getDb();
  const anonymousUser = Object.assign({});
  anonymousUser.name = 'stranger';
  const result = await db.collection('users').insertOne(anonymousUser);
  const establishedUser = await db.collection('users').findOne({ _id: result.insertedId });
  return establishedUser;
}

async function deleteUser() {
  const db = getDb();
  const anonymousUser = Object.assign({});
  anonymousUser.name = 'stranger';
  const result = await db.collection('users').insertOne(anonymousUser);
  const establishedUser = await db.collection('users').findOne({ _id: result.insertedId });
  return establishedUser;
}

// async function openConvo(_, { Conversation }) {
//   const db = getDb();
//
//   const newConversation = Object.assign({}, Conversation);
//   newConversation.id = generateConvoId();
//   newConversation.isFull = false;
//
//   const result = await db.collection('conversations').insertOne(newConversation);
//   const saved = await db.collection('conversations').findOne({ _id: result.insertedId });
//   return saved;
// }
//
// async function joinConvo(vacantConversation) {
//   const db = getDb();
//   const joiningConversation = vacantConversation;
//
//   joiningConversation.isFull = true;
//   joiningConversation.date = new Date();
//   joiningConversation.video = getNewVideo();
//
//   const result = await db.collection('conversations').updateOne({ id: joiningConversation.id },
//     { $set: joiningConversation });
//   const started = await db.collection('conversations').findOne({ _id: result._id });
//   return started;
// }
//
// function seekConvo() {
//   const openConversation = findVacant();
//   let joinedConvo;
//   if (!openConversation) {
//     joinedConvo = openConvo();
//   } else {
//     joinedConvo = joinConvo(openConversation);
//   }
//   return joinedConvo;
// }
//
// async function postMessage(_, { conversation, message, user }) {
//   const db = getDb();
//
//   const newMessage = { author: user, time: new Date().getTime(), contents: message };
//
//   const result = await db.collection('conversations').updateOne({ _id: conversation._id },
//   { $set: { messages: [conversation.messages, newMessage] } });
//   const posted = await db.collection('conversations').findOne({ _id: result._id });
//   return posted;
// }
//
// async function purgeConversation(_, { id }) {
//   const db = getDb();
//
//   const result = await db.collection('conversations').removeOne({ id });
//   return result.deletedCount === 1;
// }

module.exports = {
  createAnonymous,
  createUser,
  deleteUser,
  // restore: mustBeSignedIn(restore),
};
