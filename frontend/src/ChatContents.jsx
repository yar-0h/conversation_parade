import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import { FormControl } from 'react-bootstrap';

// export default function ChatContents(props) {

export default function ChatContents({
  user, kouhai, senpai, isFull, hasEnded, messages,
}) {
  let sentMessages = (
    <dd />
  );

  if (messages !== undefined) {
    sentMessages = messages.map((message) => {
      const author = (message.author === user) ? ({ color: '#FF9CDA' }) : ({ color: '#428CD4' });
      const authorColor = ((message.author === kouhai) || (message.author === senpai)) ? author : ({ color: '#EA4492' });
      return (
        <div>
          <dt style={authorColor}>
            {message.author}
          </dt>
          <dd>
            {message.contents}
          </dd>
        </div>
      );
    });
  }

  return (
    <React.Fragment>
      <div style={{ position: 'relative', paddingTop: '56.25%', wordBreak: 'break-all' }}>
        <Panel
          id="messageBody"
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '90%',
            overflowY: 'auto',
            borderColor: '#EA4492',
            padding: '9px',
          }}
        >
          <dl>
            {sentMessages}
          </dl>
          <div id="EOM" />
        </Panel>
      </div>
    </React.Fragment>
  );
}
