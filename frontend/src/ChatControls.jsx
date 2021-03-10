import React from 'react';
import {
  Row, Col, FormControl, Form, FormGroup, Button, Glyphicon, NavItem,
} from 'react-bootstrap';

export default function ChatControls({
  isFull, hasEnded, startConvo, endConvo, sendMessage,
}) {
  function connect(e) {
    // console.log('hitting CONNECT');
    e.preventDefault();
    startConvo();
  }

  function disconnect(e) {
    // console.log('hitting DISCONNECT');
    e.preventDefault();
    endConvo();
  }

  // CREATE 'TYPING...' UTILITY
  // function send(e) {
  //   console.log(e.target.value);
  // }

  function handleSubmit(event) {
    event.preventDefault();
    // console.log(`SENDING MESSAGE:${event.target.elements[0].value}`);
    sendMessage(event.target.elements[0].value);
    // eslint-disable-next-line no-param-reassign
    event.target.elements[0].value = '';
  }
  const connectionButton = (
    <Button style={{ backgroundColor: '#EA4492', borderColor: 'white' }} bsStyle="success" bsSize="lg" block onClick={connect}>
      <Glyphicon glyph="glyphicon glyphicon-play" />
    </Button>
  );

  const connectionInProgressStyle = (!isFull)
    ? ({ backgroundColor: '#FF9CDA', borderColor: 'white', color: 'white' })
    : ({ backgroundColor: '#EA4492', borderColor: 'black' });
  const connectionInProgressText = (!isFull) ? '...' : <Glyphicon glyph="glyphicon glyphicon-stop" />;

  const dcButton = (
    <Button
        bsStyle="success"
      style={connectionInProgressStyle}
      bsSize="lg"
      block
      disabled={!isFull}
      onClick={disconnect}
    >
      {connectionInProgressText}
    </Button>
  );

  const currentButton = (hasEnded) ? connectionButton : dcButton;
  return (
    <React.Fragment>
      <Row>
        <Col xs={3}>
          {currentButton}
        </Col>
        <Col xs={9}>
          <Form onSubmit={handleSubmit}>
            <FormGroup bsSize="lg">
              <FormControl
                style={{ borderColor: '#EA4492' }}
                bsSize="lg"
                disabled={hasEnded || !isFull}
              />
            </FormGroup>
          </Form>
        </Col>
      </Row>
    </React.Fragment>
  );
}
