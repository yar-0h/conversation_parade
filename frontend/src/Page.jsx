import React from 'react';
import {
  Navbar, Nav, NavDropdown,
  MenuItem, Glyphicon,
  Grid, Col, NavItem, Row,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Contents from './Contents.jsx';
//
// import UserCountNavItem from './UserCountNavItem.jsx';
import SignInNavItem from './SignInNavItem.jsx';

// import UserContext from './UserContext.js';
import nameGen from './nameGen.js';
import graphQLFetch from './graphQLFetch.js';
import store from './store.js';

function NavBar({
  user, count, onUserChange, shuffleName,
}) {
  const ended = store.hasEnded;
  return (
    <Navbar fluid>
      <Grid fluid>
        <Row>
          <Col>
            <Navbar.Header>
              <Navbar.Brand>
                CONVERSATION
                {' '}
                <Glyphicon style={{ color: '#EA4492' }} glyph="glyphicon glyphicon-heart" />
                {' '}
                PARADE
              </Navbar.Brand>
            </Navbar.Header>
          </Col>
          <Col xsHidden>
            <Nav>
              <NavItem disabled>
                <Glyphicon glyph="glyphicon glyphicon-heart-empty" />
                {' '}
                {count}
                {' '}
                Online
              </NavItem>
            </Nav>
          </Col>
          <Col xsHidden>
            <Nav pullRight>
              <SignInNavItem
                user={user}
                ended={ended}
                onUserChange={onUserChange}
                shuffleName={shuffleName}
              />
              <NavDropdown
                id="user-dropdown"
                title={<Glyphicon glyph="option-vertical" />}
                noCaret
              >
                <LinkContainer to="/about">
                  <MenuItem>About</MenuItem>
                </LinkContainer>
              </NavDropdown>
            </Nav>
          </Col>
        </Row>
      </Grid>
    </Navbar>
  );
}

function Footer() {
  return (
    <small>
      <hr />
      <p className="text-center">
        Full source code available at this
        {' '}
        <a href="https://github.ccs.neu.edu/NEU-CS5610-SU20/Group_Project_Laughing_UI">
          GitHub repository
        </a>
      </p>
    </small>
  );
}

export default class Page extends React.Component {
  static async fetchData(cookie) {
    const query = `query { user {
      name
    }}`;
    // noinspection UnnecessaryLocalVariableJS
    const data = await graphQLFetch(query, null, null, cookie);
    return data;
  }


  static async fetchOnlineCount() {
    const query = `query {
      userCount
    }`;
    // noinspection UnnecessaryLocalVariableJS
    const data = await graphQLFetch(query);
    return data;
  }


  constructor(props) {
    super(props);
    const user = store.user ? store.user : null;
    delete store.userData;
    this.state = { user };

    this.onUserChange = this.onUserChange.bind(this);
    this.shuffleName = this.shuffleName.bind(this);
  }

  async componentDidMount() {
    this.userCounter = setInterval(
      () => this.refreshCount(),
      12000,
    );
    const { user } = this.state;
    if (user === null) {
      // const data = await Page.fetchData();
      const userName = nameGen();
      store.user = userName;
      this.setState({ user: userName });
    }
  }


  onUserChange(user) {
    this.setState({ user });
  }

  async shuffleName() {
    const userName = nameGen();
    this.setState({ user: userName });
    store.user = userName;
  }

  async refreshCount() {
    const data = await Page.fetchOnlineCount();
    this.setState({ count: data.userCount });
  }


  render() {
    const { user, count } = this.state;
    if (user == null) return null;

    return (
      <div>
        <NavBar
          user={user}
          count={count}
          onUserChange={this.onUserChange}
          shuffleName={this.shuffleName}
        />
        <Grid fluid>
          <Contents />
        </Grid>
        <Footer />
      </div>
    );
  }
}
