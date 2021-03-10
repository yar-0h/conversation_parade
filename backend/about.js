const { mustBeSignedIn } = require('./auth.js');

let aboutMessage = 'Conversation Parade API v0.9.0';

function setMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}

function getMessage() {
  return aboutMessage;
}

// module.exports = { getMessage, setMessage: mustBeSignedIn(setMessage) };
module.exports = { getMessage, setMessage };
