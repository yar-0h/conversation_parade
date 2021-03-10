import React from 'react';
import { Row } from 'react-bootstrap';
import ChatContents from './ChatContents.jsx';
import ChatControls from './ChatControls.jsx';

export default function Chat({
  user, kouhai, senpai, id, isFull, hasEnded, messages, startConvo, endConvo, sendMessage,
}) {
  return (
    <React.Fragment>
      <div style={{ padding: '10px' }}>
        <Row>
          <ChatContents
            user={user}
            kouhai={kouhai}
            senpai={senpai}
            isFull={isFull}
            hasEnded={hasEnded}
            messages={messages}
          />
        </Row>
        <Row>
          <ChatControls
            user={user}
            id={id}
            isFull={isFull}
            hasEnded={hasEnded}
            startConvo={startConvo}
            endConvo={endConvo}
            sendMessage={sendMessage}
          />
        </Row>
      </div>
    </React.Fragment>
  );
}
