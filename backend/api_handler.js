const fs = require('fs');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');

const GraphQLDate = require('./graphql_date.js');
const about = require('./about.js');
const conversation = require('./conversation.js');
const users = require('./user.js');
const auth = require('./auth.js');


const resolvers = {
  Query: {
    about: about.getMessage,
    user: auth.resolveUser,
    conversation: conversation.get,
    userCount: conversation.getUserCount,
  },
  Mutation: {
    setAboutMessage: about.setMessage,
    seekConvo: conversation.seekConvo,
    createMessage: conversation.createMessage,
    vetoVideo: conversation.vetoVideo,
    endConvo: conversation.endConvo,
    deleteConvo: conversation.purgeConversation,
    createUser: users.createUser,
    createAnonymous: users.createAnonymous,
    deleteUser: users.deleteUser,
    checkIn: conversation.checkIn,
    checkOut: conversation.checkOut,
  },
  GraphQLDate,
};

function getContext({ req }) {
  const user = auth.getUser(req);
  return { user };
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  playground: true,
  introspection: true,
  context: getContext,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

function installHandler(app) {
  const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
  console.log('CORS setting:', enableCors);
  let cors;
  if (enableCors) {
    const origin = process.env.UI_SERVER_ORIGIN || 'http://localhost:8000';
    const methods = 'POST';
    cors = { origin, methods, credentials: true };
  } else {
    cors = 'false';
  }
  server.applyMiddleware({ app, path: '/graphql', cors });
}

module.exports = { installHandler };
