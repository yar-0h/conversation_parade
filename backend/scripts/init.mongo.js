/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *   mongo conversationparade scripts/init.mongo.js
 * Atlas:
 *   mongo mongodb+srv://simmonsy:A9AmswJAlwVuIUwZ@cluster0-zvipy.mongodb.net/conversationParade scripts/init.mongo.js
 */

/* global db print */
/* eslint no-restricted-globals: "off" */

db.conversations.remove({});
db.mother.remove({});
db.users.remove({});

const entranceMessage = {
  author: 'CONVERSATION_BOSS',
  time: new Date('0000-00-00'),
  contents: 'WELCOME TO CONVERSATION PARADE :)',
};

const exitMessage = {
  author: 'CONVERSATION_BOSS',
  time: new Date('1111-11-11'),
  contents: 'CONVERSATION ENDED ;)',
};

const conversationDB = [
  {
    id: '0',
    videoUrl: 'https://www.youtube.com/watch?v=jCX77Je16fk',
    VetoVote: -99999,
    isFull: true,
    hasEnded: true,
    messages: [entranceMessage],
    adminRoom: true,
  },
  {
    id: '1',
    videoUrl: 'https://www.youtube.com/watch?v=S-XKYCaIq-8',
    VetoVote: -99999,
    isFull: true,
    hasEnded: true,
    messages: [exitMessage],
    adminRoom: true,
  },
];

const initializeMother = { online: 0 };

db.conversations.insertMany(conversationDB);
db.mother.insert(initializeMother);

const count = db.conversations.count();
print('Inserted', count, 'starter conversations');
