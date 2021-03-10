

export default function provideDC() {
  const entranceMessage = {
    author: 'CONVERSATION_BOSS',
    time: new Date('0000-00-00'),
    contents: ' D: YOU SEEM TO BE HAVING TROUBLE CONNECTING TO THE SERVER',
  };

  const dCRoom = [
    {
      id: '-1',
      videoUrl: 'https://www.youtube.com/watch?v=ikl9iDsnaF0',
      VetoVote: -99999,
      isFull: true,
      hasEnded: true,
      messages: [entranceMessage],
    },
  ];

  return dCRoom;
}
