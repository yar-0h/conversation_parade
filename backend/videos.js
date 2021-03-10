/* eslint-disable no-underscore-dangle */
const {
  getDb,
} = require('./db.js');
const { youtubeGen } = require('./youtubeGen.js');


async function populateVideo() {
  const db = getDb();
  const newBatch = await youtubeGen();
  let i;
  const freshBatch = [];
  for (i = 0; i < newBatch.data.items.length; i += 1) {
    const freshVideo = Object.assign({});
    // TODO VALIDATE URL AGAINST DATABASE
    freshVideo.url = `https://www.youtube.com/watch?v=${newBatch.data.items[i].id.videoId}`;
    freshBatch[i] = freshVideo;
  }

  await db.collection('videos').insertMany(freshBatch);
}

async function getNewVideoUrl() {
  const db = getDb();

  // TODO ADD QUERY
  // var query = { state: 'OK' };
  const n = await db.collection('videos').count();
  if (n === 0) {
    for (let i = 0; i < 111; i += 1) {
      populateVideo();
    }
  }
  const r = Math.floor(Math.random() * n);
  console.log(`${n} VIDEOS REMAINING IN POOL`);
  let newVideo = await db.collection('videos').find().toArray();
  // const videoUrl = newVideo[0];
  newVideo = (newVideo[r]);

  await db.collection('videos').deleteOne({ id: newVideo.id });
  return newVideo.url;
}

module.exports = {
  getNewVideoUrl,
};
