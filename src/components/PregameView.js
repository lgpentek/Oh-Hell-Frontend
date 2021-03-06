/* This is the PregameView component. It should be displayed when a game is
 * waiting to be filled up with players and started. It displays how many
 * players are in the game and their usernames.
 */
 
import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {
  ListGroupItem,
  Form,
  FormControl,
  ControlLabel,
  Button,
  Glyphicon
} from "react-bootstrap";
import { Link } from "react-router-dom";

const EmptyUser = styled(Glyphicon)`
  color: #CA5F5F;
  font-size: 20px;
  marginRight: 2px;
`;

const FullUser = styled(Glyphicon)`
  font-size: 20px;
  marginRight: 2px;
  color: #2B0000;
`;

const LobbyHeader = styled.h1`
  color: lightgrey;
`;

const HeaderPanel = styled(ListGroupItem)`
  text-align: center;
  background-color: #751010;
  border: none;
`;

const BodyPanel = styled(ListGroupItem)`
  text-align: center;
`;

const StyledButton = styled(Button)`
  margin-right: 5px;
`;
const PlayerName = styled.p`
  margin: 2px;
`;

const PlayerHeader = styled.h4`
  marginTop: 5px;
  marginBottom: 5px;
`;

class PregameView extends Component {
  constructor() {
    super();
    this.state = {
      password: ""
    };
  }

  handleTextUpdate(event, field) {
    this.setState({ [field]: event.target.value });
  }

  render() {
    let joinedList = this.props.players.map(username => (
      <PlayerName key={username}>{username}</PlayerName>
    ));
    let userBar = [];
    for (let i = 0; i < this.props.maxPlayers; i++) {
      if (i < this.props.players.length) {
        userBar.push(<FullUser key={i} glyph="user" />);
      } else {
        userBar.push(<EmptyUser key={i} glyph="user" />);
      }
    }
    let passwordField;
    if (this.props.hasPassword && !this.props.joined) {
      passwordField = (
        <Form
          style={{
            "margin-top": "2px",
            "margin-bottom": "5px",
            "text-align": "left"
          }}
        >
          <ControlLabel>Password</ControlLabel>
          <FormControl
            type="password"
            value={this.state.password}
            placeholder=""
            onChange={event => this.handleTextUpdate(event, "password")}
          />
        </Form>
      );
    } else {
      passwordField = null;
    }
    let joinButton;
    if (!this.props.joined) {
      joinButton = (
        <StyledButton
          onClick={() => this.props.join(this.state.password)}
          bsStyle="success"
        >
          Join
        </StyledButton>
      );
    } else if (this.props.joined && !this.props.isOwner) {
      joinButton = (
        <StyledButton
          onClick={() => this.props.join(this.state.password)}
          bsStyle="success"
          disabled
        >
          Joined
        </StyledButton>
      );
    } else {
      //joinButton becomes a start button for the owner
      joinButton = (
        <StyledButton
          onClick={this.props.start}
          bsStyle="danger"
          disabled={this.props.players.length < this.props.minPlayers}
        >
          Start
        </StyledButton>
      );
    }
    return (
      <div className="overlay" style={{ margin: "0 auto", maxWidth: "300px" }}>
        <HeaderPanel>
          <LobbyHeader>{this.props.gameName}</LobbyHeader>
          {userBar}
        </HeaderPanel>
        <BodyPanel>
          <PlayerHeader>Players:</PlayerHeader>
          {joinedList}
        </BodyPanel>
        <BodyPanel>
          {passwordField}
          {joinButton}
          <Link to="/lobby"><Button>Cancel</Button></Link>
        </BodyPanel>
      </div>
    );
  }
}

PregameView.propTypes = {
  maxPlayers: PropTypes.number.isRequired,
  minPlayers: PropTypes.number.isRequired,
  players: PropTypes.array.isRequired,
  gameName: PropTypes.string.isRequired,
  hasPassword: PropTypes.bool.isRequired,
  joined: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired,
  join: PropTypes.func.isRequired,
  start: PropTypes.func.isRequired
};

export default PregameView;
