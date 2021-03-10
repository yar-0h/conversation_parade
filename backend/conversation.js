/* eslint-disable no-underscore-dangle */
const {
  getDb, generateConvoId,
} = require('./db.js');
const { getNewVideoUrl } = require('./videos');

async function get(_, { id }) {
  const db = getDb();
  // const filter = {};
  // if (id) filter.id = id;
  return db.collection('conversations').findOne({ id });
}

async function findVacant() {
  const db = getDb();
  const vacancy = await db.collection('conversations').findOne({ isFull: false });
  return vacancy;
}

async function updateUserCount() {
  const db = getDb();
  const disconnectMessage = {
    author: 'CONVERSATION_BOSS', time: new Date(), contents: 'YOUR CHAT PARTNER HAS LEFT',
  };
  const data = await db.collection('mother').findOne();
  const currentTime = new Date().getTime();
  const cutoffTime = currentTime - 12000;
  db.collection('users').deleteMany({ checkIn: { $lte: cutoffTime } });
  const userList = await db.collection('users').distinct('name');
  const userCount = await db.collection('users').countDocuments();
  await db.collection('conversations').deleteMany(
    { senpai: { $nin: userList }, adminRoom: { $ne: true }, hasEnded: { $eq: true } },
  );
  await db.collection('conversations').updateMany({ senpai: { $nin: userList }, adminRoom: { $ne: true } },
    { $set: { hasEnded: true }, $push: { messages: disconnectMessage } });
  // console.log(db.collection('users').find({ checkIn: { $lte: cutoffTime } }));
  await db.collection('mother').findOneAndUpdate({ _id: data._id },
    { $set: { online: userCount } });
  return true;
}

async function getUserCount() {
  const db = getDb();
  const data = await db.collection('mother').findOne();
  return data.online;
}

async function checkIn(_, user) {
  const db = getDb();
  const userCheckIn = { name: user.user, checkIn: new Date().getTime() };
  const userCheck = await db.collection('users').findOne({ name: userCheckIn.name });
  if (userCheck) {
    await db.collection('users').updateOne({ name: userCheckIn.name },
      { $set: { checkIn: userCheckIn.checkIn } });
  } else {
    await db.collection('users').insertOne(userCheckIn);
  }
  return true;
}

async function checkOut() {
  const db = getDb();
  const data = await db.collection('mother').findOne();
  const onlineCount = data.online - 1;
  await db.collection('mother').updateOne({ _id: data._id },
    { $set: { online: onlineCount } });
  return true;
}
//
// async function checkOut() {
//   const db = getDb();
//   const vacancy = await db.collection('conversations').findOne({ isFull: false });
//   return vacancy;
// }

async function openConvo(user) {
  const db = getDb();

  const connectingMessage = {
    author: 'CONVERSATION_BOSS', time: new Date(), contents: 'WAITING FOR PARTNER...',
  };
  console.log(user.user);
  const newConversation = Object.assign({});
  newConversation.id = generateConvoId();
  newConversation.isFull = false;
  newConversation.messages = [connectingMessage];
  newConversation.senpai = user.user;
  newConversation.adminRoom = false;

  const result = await db.collection('conversations').insertOne(newConversation);
  const saved = await db.collection('conversations').findOne({ _id: result.insertedId });
  return saved;
}

async function joinConvo(vacantConversation, user) {
  const db = getDb();
  const joiningConversation = vacantConversation;
  const connectingMessage = {
    author: 'CONVERSATION_BOSS', time: new Date(), contents: 'CONNECTION SUCCESS',
  };
  joiningConversation.isFull = true;
  joiningConversation.hasEnded = false;
  joiningConversation.vetoVote = 0;
  joiningConversation.date = new Date();
  joiningConversation.videoUrl = await getNewVideoUrl();
  joiningConversation.messages = [connectingMessage];
  joiningConversation.kouhai = user.user;
  await db.collection('conversations').updateOne({ _id: joiningConversation._id },
    { $set: joiningConversation });

  const started = await db.collection('conversations').findOne({ _id: joiningConversation._id });
  return started;
}

async function seekConvo(_, user) {
  const openConversation = await findVacant();
  let joinedConvo;

  if (!openConversation) {
    joinedConvo = await openConvo(user);
  } else {
    joinedConvo = await joinConvo(openConversation, user);
  }
  return joinedConvo;
}

async function createMessage(_, { messageDetails }) {
  const db = getDb();

  if (!messageDetails.message.trim().length) {
    return false;
  }
  const newMessage = {
    author: messageDetails.user, time: new Date(), contents: messageDetails.message,
  };
  const currentConversation = await db.collection('conversations').findOne({ id: messageDetails.convoId });
  console.log('MESSAGE SENT');
  console.log(newMessage);
  if (currentConversation.adminRoom === true) {
    return false;
  }
  const result = await db.collection('conversations').updateOne({ _id: currentConversation._id },
    { $push: { messages: newMessage } });
  return !!result;
}

// async function noticeMe(_, NoticeInputs) {
//   const db = getDb();
//   const currentConversation
//   = await db.collection('conversations').findOne({ id: NoticeInputs.notice.convoId });
//   console.log(NoticeInputs);
//   const noticing = NoticeInputs.notice.user;
//   const noticePlea = new Date();
//
//   if (noticing === currentConversation.senpai) {
//     currentConversation.sCheckIn = noticePlea;
//   } else if (noticing === currentConversation.kouhai) {
//     currentConversation.kCheckIn = noticePlea;
//   }
//
//   try {
//     await db.collection('conversations').updateOne({ _id: currentConversation._id },
//       { $set: currentConversation });
//     return true;
//   } catch (e) {
//     return false;
//   }
// }

// async function noticeYou(_, NoticeInputs) {
//   const db = getDb();
//   const currentConversation
//   = await db.collection('conversations').findOne({ id: NoticeInputs.notice.convoId });
//   const noticing = NoticeInputs.notice.user;
//   if (noticing === currentConversation.senpai) {
//     return currentConversation.kCheckIn;
//   } if (noticing === currentConversation.kouhai) {
//     return currentConversation.sCheckIn;
//   }
//   return NoticeInputs.notice.memory;
// }

async function vetoVideo(_, conversation) {
  const db = getDb();
  console.log(conversation.id);
  const currentConversation = await db.collection('conversations').findOne({ id: conversation.id });
  console.log(currentConversation);
  currentConversation.vetoVote += 1;
  if (currentConversation.vetoVote >= 2) {
    currentConversation.vetoVote = 0;
    currentConversation.videoUrl = await getNewVideoUrl();
  }
  const result = await db.collection('conversations').updateOne({ _id: currentConversation._id },
    { $set: { vetoVote: currentConversation.vetoVote, videoUrl: currentConversation.videoUrl } });
  return !!result;
}

async function endConvo(_, conversation) {
  const db = getDb();
  const currentConversationId = conversation.id;
  const currentConversation = await db.collection('conversations').findOne({ id: conversation.id });

  if (currentConversation.adminRoom) {
    return false;
  }
  const disconnectMessage = {
    author: 'CONVERSATION_BOSS', time: new Date(), contents: 'YOUR CHAT PARTNER HAS LEFT',
  };
  await db.collection('conversations').updateOne({ id: currentConversationId },
    { $push: { messages: disconnectMessage } });
  const result = await db.collection('conversations').updateOne({ id: currentConversationId },
    { $set: { hasEnded: true } }, { $push: { messages: disconnectMessage } });
  return !!result;
}

async function purgeConversation(_, { id }) {
  const db = getDb();
  const result = await db.collection('conversations').removeOne({ id });
  return result.deletedCount === 1;
}

module.exports = {
  get,
  updateUserCount,
  getUserCount,
  seekConvo,
  createMessage,
  vetoVideo,
  endConvo,
  purgeConversation,
  checkIn,
  checkOut,
  // restore: mustBeSignedIn(restore),
  // counts,
};
