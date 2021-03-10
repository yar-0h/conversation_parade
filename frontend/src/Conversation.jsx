import React from 'react';
// import URLSearchParams from 'url-search-params';
// import { Col, Pagination, Button } from 'react-bootstrap';
import { Col, Row } from 'react-bootstrap';
import Chat from './Chat.jsx';
import Video from './Video.jsx';

import graphQLFetch from './graphQLFetch.js';
// import generateName from './nameGen.js';
import store from './store.js';
import provideDC from './disconnectedRoom.js';

// import { LinkContainer } from 'react-router-bootstrap';


class Conversation extends React.Component {
  static async fetchData(id) {
    const vars = { convoId: id };
    const query = `query conversation($convoId: String!) {
        conversation(id: $convoId) {
          id videoUrl vetoVote isFull hasEnded 
          kouhai kCheckIn senpai sCheckIn messages {
            author time contents
            }
        }
    }`;
    // noinspection UnnecessaryLocalVariableJS
    const data = await graphQLFetch(query, vars);
    return data;
  }

  constructor() {
    super();
    const anonName = store.user;
    // console.log(anonName);
    const startUp = {
      id: '0', user: anonName, videoUrl: '', isFull: false, hasEnded: true, messages: [], autoPlayChoice: false,
    };
    const initialData = store.initialData || startUp;
    const {
      id, user, videoUrl, isFull, hasEnded, messages, autoPlayChoice,
    } = initialData;
    delete store.initialData;
    this.state = {
      id,
      user,
      videoUrl,
      isFull,
      hasEnded,
      messages,
      autoPlayChoice,
    };
    this.startConvo = this.startConvo.bind(this);
    this.endConvo = this.endConvo.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.vetoVideo = this.vetoVideo.bind(this);
    this.toggleAutoPlay = this.toggleAutoPlay.bind(this);
    // this.editPrefs = this.editPrefs.bind(this);
    // this.sendReport = this.sendReport.bind(this);
  }

  componentDidMount() {
    this.renderTimer = setInterval(
      () => this.loadData(),
      2000,
    );
    this.checkInTimer = setInterval(
      () => this.checkIn(),
      6000,
    );
    window.addEventListener('beforeunload', this.endConvo);
    window.addEventListener('beforeunload', this.checkOut);
  }

  componentDidUpdate() {
    const { hasEnded } = this.state;
    if (hasEnded) {
      clearInterval(this.renderTimer);
      this.renderTimer = null;
    } else if (!this.renderTimer) {
      this.renderTimer = setInterval(
        () => this.loadData(),
        2000,
      );
    }
  }

  async loadData() {
    const { id } = this.state;
    const anonName = store.user;
    const data = await Conversation.fetchData(id);
    if (data) {
      this.timeOutCounter = 0;
      const currentConversation = data.conversation;
      this.setState({
        id: currentConversation.id,
        user: anonName,
        videoUrl: currentConversation.videoUrl,
        vetoVote: currentConversation.vetoVote,
        isFull: currentConversation.isFull,
        hasEnded: currentConversation.hasEnded,
        kouhai: currentConversation.kouhai,
        senpai: currentConversation.senpai,
      });
      store.hasEnded = currentConversation.hasEnded;
      if (data.conversation.messages) {
        this.setState({
          messages: data.conversation.messages,
        });
      }
      if (data.conversation.vetoVote === 0) {
        this.setState({
          calledForVeto: false,
        });
      }
      const autoScroll = document.getElementById('EOM');
      autoScroll.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.timeOutCounter += 1;
      if (this.timeOutCounter > 6) {
        clearInterval(this.renderTimer);
        const dCRoom = provideDC();
        this.setState({
          id: dCRoom.id,
          videoUrl: dCRoom[0].videoUrl,
          hasEnded: dCRoom[0].hasEnded,
          messages: dCRoom[0].messages,
        });
      }
    }
  }

  // async noticeMe() {
  //   const { id, user } = this.state;
  //   const vars = { NoticeMeInputs: { convoId: id, user } };
  //   const query = `mutation noticeMe($NoticeMeInputs: NoticeMeInputs!) {
  //     noticeMe(notice: $NoticeMeInputs)
  //   }`;
  //   const data = await graphQLFetch(query, vars);
  //   return data;
  // }
  //
  // async noticeYou() {
  //   const {
  //     id, user, senpai, kouhai, sCheckIn, kCheckIn,
  //   } = this.state;
  //
  //   const userStatus = (user === senpai) ? 'senpai' : 'kouhai';
  //   const lastMemory = (userStatus === 'senpai') ? kCheckIn : sCheckIn;
  //   const vars = { NoticeYouInputs: { convoId: id, user, memory: lastMemory } };
  //   const query = `mutation noticeYou($NoticeYouInputs: NoticeYouInputs!) {
  //     noticeYou(notice: $NoticeYouInputs)
  //   }`;
  //   const data = await graphQLFetch(query, vars);
  //   console.log(data.noticeYou);
  //   console.log(data.noticeYou.toString());
  //   if (data.noticeYou.toString() === lastMemory.toString()) {
  //     console.log('MISS');
  //   } else {
  //     console.log('HIT');
  //   }
  //   // if (data) {
  //   //   this.loadData();
  //   // }
  // }


  async startConvo() {
    // console.log('ATTEMPTING TO START CONVO');
    const { user } = this.state;
    const vars = { user };

    const query = `mutation seekConvo($user: String!) {
      seekConvo(user: $user) {
      id videoUrl isFull
      }
    }`;
    if (this.timeOutCounter > 6) {
      this.timeOutCounter = 0;
      this.renderTimer = setInterval(
        () => this.loadData(),
        1000,
      );
    }
    const data = await graphQLFetch(query, vars);
    if (data.seekConvo.isFull) {
      this.setState({
        id: data.seekConvo.id,
        videoUrl: data.seekConvo.videoUrl,
        vetoVote: data.seekConvo.vetoVote,
        isFull: data.seekConvo.isFull,
        hasEnded: data.seekConvo.hasEnded,
      });
    } else {
      this.setState({
        id: data.seekConvo.id,
        videoUrl: data.seekConvo.videoUrl,
        vetoVote: data.seekConvo.vetoVote,
        isFull: data.seekConvo.isFull,
        hasEnded: data.seekConvo.hasEnded,
      });
    }
    this.loadData();
  }

  async endConvo() {
    // console.log('ATTEMPTING TO END CONVO');
    const { id } = this.state;
    const vars = { id };
    const query = `mutation endConvo($id: String!) {
      endConvo(id: $id)
    }`;
    const data = await graphQLFetch(query, vars);
    if (data) {
      this.setState({
        id: '1',
        hasEnded: false,
      });
      this.loadData();
    } else {
      this.loadData();
    }
  }

  async sendMessage(message) {
    // console.log('ATTEMPTING TO SEND MESSAGE');
    const { id, user } = this.state;
    const vars = { messageDetails: { convoId: id, message, user } };
    const query = `mutation createMessage($messageDetails: MessageInputs!) {
      createMessage(messageDetails: $messageDetails)
    }`;
    const data = await graphQLFetch(query, vars);
    if (data) {
      this.loadData();
    }
  }


  async vetoVideo() {
    // console.log('VETO LAUNCHED');
    const { id } = this.state;
    const vars = { id };
    const query = `mutation vetoVideo($id: String!) {
      vetoVideo(id: $id)
    }`;
    this.setState({
      calledForVeto: true,
    });
    const data = await graphQLFetch(query, vars);
    if (data) {
      this.loadData();
    }
  }

  async toggleAutoPlay() {
    // console.log('VETO LAUNCHED');
    const { autoPlayChoice } = this.state;

    this.setState({
      autoPlayChoice: !autoPlayChoice,
    });
  }

  async checkIn() {
    const { user } = this.state;
    // console.log('CHECKINGIN');
    const vars = { user };
    const query = `mutation checkIn($user: String!) { 
    checkIn(user: $user) 
    }`;
    await graphQLFetch(query, vars);
  }

  async checkOut() {
    // const query = `mutation {
    //   checkOut
    // }`;
    // const data = await graphQLFetch(query);
    // if (data) {
    //   this.loadData();
    // }
    clearInterval(this.checkInTimer);
    this.renderTimer = null;
  }


  // async editPrefs(id) {
  //
  //   const query = `mutation issueRestore($id: Int!) {
  //     issueRestore(id: $id)
  //   }`;
  //   const { showSuccess, showError } = this.props;
  //   const data = await graphQLFetch(query, { id }, showError);
  //   if (data) {
  //     showSuccess(`Issue ${id} restored successfully.`);
  //     this.loadData();
  //   }
  // }

  // async sendReport(id) {
  //
  //   const query = `mutation issueRestore($id: Int!) {
  //     issueRestore(id: $id)
  //   }`;
  //   const { showSuccess, showError } = this.props;
  //   const data = await graphQLFetch(query, { id }, showError);
  //   if (data) {
  //     showSuccess(`Issue ${id} restored successfully.`);
  //     this.loadData();
  //   }
  // }


  render() {
    const {
      id, user, videoUrl, vetoVote, calledForVeto,
      autoPlayChoice, isFull, hasEnded, messages, kouhai, senpai,
    } = this.state;
    // console.log({ onlineCount });
    return (
      <React.Fragment>
        <Row>
          <Col xs={12} sm={6} smPush={6}>
            <Video
              calledForVeto={calledForVeto}
              autoPlayChoice={autoPlayChoice}
              videoUrl={videoUrl}
              vetoVote={vetoVote}
              toggleAutoPlay={this.toggleAutoPlay}
              vetoVideo={this.vetoVideo}
            />
          </Col>
          <Col xs={12} sm={6} smPull={6}>
            <Chat
                // PROPS
              user={user}
              kouhai={kouhai}
              senpai={senpai}
              id={id}
              isFull={isFull}
              hasEnded={hasEnded}
              messages={messages}
              startConvo={this.startConvo}
              endConvo={this.endConvo}
              sendMessage={this.sendMessage}
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Conversation;
