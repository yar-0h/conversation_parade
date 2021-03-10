const { google } = require('googleapis');

const API_KEY = 'AIzaSyCdTD0b44hzm9cmZSrrQejSk0kPuBxOAKU';

function generateString() {
  return Math.random().toString(36).substr(2, 3);
}

const youtube = google.youtube({
  version: 'v3',
  auth: API_KEY,
});

// // EXAMPLE FOR USING AUTHENTIFICATION
// const {authenticate} = require('@google-cloud/local-auth');
// async function runSample() {
//   const auth = await authenticate({
//     keyfilePath: path.join(__dirname, '../oauth2.keys.json'),
//     scopes: ['https://www.googleapis.com/auth/youtube'],
//   });
//   google.options({auth});


// function loadClient() {
//   google.client.setApiKey(API_KEY);
//   return google.client.load('https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest')
//     .then(() => { console.log('GAPI client loaded for API'); },
//       (err) => { console.error('Error loading GAPI client for API', err); });
// }

// async function youtubeGen() {
//   loadClient();
//   const qValue = generateString();
//   return google.client.youtube.search.list({
//     part: [
//       'id',
//     ],
//     q: qValue,
//     type: [
//       'video',
//     ],
//   })
//     .then((response) => {
//       console.log(qValue);
//       console.log('Response', response);
//     },
//     (err) => { console.error('Execute error', err); });
// }
// google.load('client:auth2', () => {
//   google.auth2.init({ client_id: 'YOUR_CLIENT_ID' });
// });

async function youtubeGen() {
  const qValue = generateString();
  const result = await youtube.search.list({
    part: [
      'id',
    ],
    q: qValue,
    maxResults: 6,
    type: [
      'video',
    ],
  });
  return result;
}

module.exports = {
  youtubeGen,
};
