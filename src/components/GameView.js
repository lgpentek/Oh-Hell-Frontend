/* This file contains the GameView component in which users interact with the
 * game. It has a PregameView child component that is displayed before the game
 * starts. It has state, and that state should also be consistent with the
 * gamestate stored on the server.
 */

import React, { Component } from "react";
import styled from "styled-components";
import Server from "../server.js";
import "../gameview.css";
import "../cards.css";
import PregameView from "./PregameView.js";
import io from "socket.io-client";
import { Button } from "react-bootstrap";

const PersonalStats = styled.p`
  display: inline-block;
  marginLeft: 5px;
`;

class GameView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: {},
      messages: null,
      id: props.gameID,
      username: props.username,
      server: new Server.Game(props.gameID, this.stateCallback.bind(this)),
      loading: true
    };
  }

  componentDidMount() {
    this.loadGame();
    const socket = io(Server.url);
    socket.emit("join", this.state.id);
    socket.on("update", data => {
      this.socketCallback(data);
    });
  }

  componentWillUnmount() {
    console.log("Game view unmounting");
  }

  loadGame() {
    if (this.state.id) {
      this.state.server.get();
    } else {
      console.error("No game id provided");
    }
  }

  socketCallback = response => {
    //TODO add check for game id
    this.loadGame();
  };

  stateCallback(response) {
    if (response.alert) {
      //window.alert(response.alert);
    }
    if (response.state && response.message) {
      this.setState({
        gameState: response.state,
        messages: response.message.concat(this.state.messages),
        loading: false
      });
      return;
    }
    if (response.state) {
      this.setState({ gameState: response.state, loading: false });
      return;
    }
  }

  render() {
    if (this.state.loading === true) {
      return <p>Loading game...</p>;
    }
    if (
      this.state.gameState.joined === false ||
      this.state.gameState.started === false
    ) {
      return (
        <PregameView
          maxPlayers={this.state.gameState.maxPlayers}
          minPlayers={this.state.gameState.minPlayers}
          players={this.state.gameState.players}
          gameName={this.state.gameState.gameName}
          hasPassword={this.state.gameState.hasPassword}
          joined={this.state.gameState.joined}
          isOwner={this.state.gameState.isOwner}
          join={password => {
            this.state.server.join(password);
          }}
          start={() => this.state.server.start(this.state.id)}
        />
      );
    }
    return (
      <GameTable
        server={this.state.server}
        state={this.state.gameState}
        username={this.state.username}
      />
    );
  }
}

export default GameView;

function Opponent(props) {
  let name = props.name;
  let bets = props.state.state.bets[name];
  let tricks = props.state.state.tricks[name] || 0;
  let borderColor;
  if (props.betting)
    borderColor = !Number.isInteger(bets) 
    ? "3px solid yellow"
    : "2px solid #751010";
  else
    borderColor = props.turn
    ? "3px solid yellow"
    : "2px solid #751010";

  let PlayerInfo = styled.div`
    display:inline-block;
    float:left;
    margin-right:10px;
    text-align:left;
  `;
  let scoreSum = 0;
  for (let i = 0; i < Object.keys(props.state.state.scores.round).length; i++) {
    scoreSum += Object.values(props.state.state.scores.round)[i][name];
  }

  if (props.betting) {
    return (
      <div style={{ border: borderColor }} className="opponent">
        <PlayerInfo>
          <h4 style={{ "font-family": "Lobster" }}>{name}</h4><hr />
          <span>Tippelés</span><br />
         <span>Ütés: {tricks}</span><br />
         <span>Pont: {scoreSum}</span>
       </PlayerInfo>
       <div
         style={{ float: "right", "padding-top": "10%" }}
         className="playingCards"
       >
         {(() => {
            if (props.card) {
              return <Card code={props.card.id} />;
            } 
         })()}
       </div>
     </div>
    );
  } else {
  return (
    <div style={{ border: borderColor }} className="opponent">
      <PlayerInfo>
        <h4 style={{ "font-family": "Lobster" }}>{name}</h4><hr />
        <span>Tipp: {bets}</span><br />
       <span>Ütés: {tricks}</span><br />
       <span>Pont: {scoreSum}</span>
     </PlayerInfo>
     <div
       style={{ float: "right", "padding-top": "10%" }}
       className="playingCards"
     >
       {(() => {
          if (props.card) {
           //console.log(name, " played ", props.card)
           return <Card code={props.card.id} />;
         }
       })()}
     </div>
   </div>
  );
  }
}

function Card(props) {
  let sizeClass = props.small ? "inText" : "simpleCards";
  let code = props.code;
  let rank;
  if (props.code.id) {
    rank = props.code.id.slice(0, props.code.length - 1);
  } else {
    rank = code.substring(0, code.length == 2 ? 1 : 2);
  }
  console.log(rank);
  let suit = code[code.length == 2 ? 1 : 2];
  const suitMap = { D: "diams", H: "hearts", S: "spades", C: "clubs" };
  const charMap = { D: "9830", H: "9829", S: "9824", C: "9827" };
  let suitClass = suitMap[suit];
  return (
    //<div className={"playingCards " + sizeClass}>
    (
      <div className={`card rank-${rank} ${suitClass}`}>
        <span className="rank">{rank}</span>
        <span className="suit">{String.fromCharCode(charMap[suit])}</span>
      </div>
    )
    //</div>
  );
}
class MessageTicker extends Component {
  constructor(props) {
    super(props);
  }
  componentDidUpdate() {
    console.log("message window", this.scrollWindow);
    this.scrollWindow.scrollTop = this.scrollWindow.scrollHeight;
  }
  render() {
    const MessageDiv = styled.div`
      position: relative;
      bottom: 0px;
      right: 0px;
      width:100%;
      overflow:hidden;
    `;
    const MessageWindow = styled.div`
      overflow-y:scroll;
      box-shadow: inset 0 7px 10px 0px rgba(0,0,0,0.4);
      color:white;
      opacity: 0.7;
      max-height:110px;
      padding: 15px;
    `;
    let messages = this.props.messages.map(message => <p>{message}</p>);
    return (
      <MessageDiv>
        <h5>Messages</h5>
        <MessageWindow
          innerRef={scrollWindow => {
            this.scrollWindow = scrollWindow;
          }}
        >
          {messages}
        </MessageWindow>
      </MessageDiv>
    );
  }
}

function GameTable(props) {
  console.log("Rendering gametable", props);
/*  let players = props.state.players.filter(
    username => username !== props.username
  );
*/
let players = props.state.players;
let player_help = players.shift();
let PlayerInfo = styled.div`
display:inline-block;
float:left;
margin-right:10px;
text-align:center;
`;
let hivo;

while (player_help !== props.state.turn) {
  players.push(player_help);
  player_help = players.shift();
}
players.unshift(player_help);
hivo = player_help;
player_help = players.pop();

while (props.state.cardsInPlay[player_help]) {
  hivo = player_help;
  players.unshift(player_help);
  player_help = players.pop();
}

if (props.state.cardsInPlay[hivo]) {
  let card = props.state.cardsInPlay[hivo];
  let szin;
  if ( card.suit == "Clubs" )
    szin="Treff";
  else if ( card.suit == "Diamonds" )
    szin="Káró";
  else if ( card.suit == "Hearts" )
    szin="Kőr";
  else if ( card.suit == "Spades" )
    szin="Pikk";

  hivo = hivo + " (" + szin + " " + card.value + ")";
}
while (player_help !== props.username) {
  players.push(player_help);
  player_help = players.shift();
}

  let dist = threeDistribution(players);
  let containers = [];
  for (let i = dist.length-1; i >= 0 ; i--) {
    containers[i] = [];
    for (let j = dist[i]-1; j >= 0 ; j--) {
      let player = players.shift();
      const turn = props.state.turn === player;
      console.log(`${player}'s turn? ${turn} `);
      containers[i].push(
        <Opponent
          key={player}
          turn={turn}
          state={props}
          card={props.state.cardsInPlay[player]}
          name={player}
          betting={props.state.betting}
        />
      );
    }
  }
  // self view components
  let scoreSum = 0;
  for (let i = 0; i < Object.keys(props.state.scores.round).length; i++) {
    scoreSum += Object.values(props.state.scores.round)[i][props.username];
  }
  let bets = props.state.bets[props.username];
  let tricks = props.state.tricks[props.username] || 0;
  let borderColor;

  if (props.state.betting)
    borderColor = !Number.isInteger(bets) 
    ? "3px solid yellow"
    : "2px solid #751010";
  else
    borderColor = props.state.turn === props.username
    ? "3px solid yellow"
    : "2px solid #751010";
  return (
    <div id="grid">
      <div id="left-table">{containers[0]}</div>
      <div id="top-table">{containers[1]}</div>
      <div id="right-table">{containers[2]}</div>
      <div id="table">
        <h3 style={{ "font-family": "Lobster" }}>Ri-ki-ki</h3>
        <p>Hívó: {hivo}</p>
        <MessageTicker messages={props.state.messages} />
      </div>
      <div id="hand" style={{ border: borderColor }} className="playingCards">
        <ul>
        <PlayerInfo>
          <h3 style={{ "font-family": "Lobster" }}>{props.username}</h3>
          <div>
            <PersonalStats>Tipp: {bets}</PersonalStats>
            <PersonalStats>Ütés: {tricks}</PersonalStats>
            <PersonalStats>Pont: {scoreSum}</PersonalStats>

          </div>
        </PlayerInfo>
        <div
           style={{ float: "right", "padding-right": "0%" }}
           className="playingCards"
          >
           {(() => {
              if (props.state.cardsInPlay[props.username]) {
                return <Card code={props.state.cardsInPlay[props.username].id} />;
              } 
           })()}
        </div>
        </ul>


        <BetMaker
          betFunc={props.server.bet}
          bet={props.state.bets[props.username]}
          show={props.state.betting}
          maxBet={props.state.hand.length}
        />

       <Hand
          play={cardID => {
            props.server.playCard(cardID);
          }}
          state={props}
          cards={props.state.hand.map(card => card.id)}
          betting={props.state.betting}
          round={props.state.round}
          maxBet={props.state.hand.length}
        />
 
      </div>
    </div>
  );
}

function BetMaker(props) {
  if (props.show === true) {
    let betButtons = [];
    for (let i = 0; i <= props.maxBet; i++) {
      const haveBet = props.bet != null;
      const style = props.bet === i ? "success" : "default";
      betButtons.push(
        //<Button type="button" key={"bet" + i} disabled={haveBet} style={{"backgroundColor": color}} onClick={() => {props.betFunc(i)}} value={i} />
        <Button
          bsSize="xs"
          bsStyle={style}
          onClick={() => {
            props.betFunc(i);
          }}
          disabled={haveBet}
          key={"bet" + i}
        >
          {i}
        </Button>
      );
    }
    return <div>Klikk a tippeléshez: {betButtons}</div>;
  } else {
    return null;
  }
}

function Hand(props) {
  console.log(props);
  const gameID = props.state.state.id;
  let cards = props.cards.map(card => {
    return (
      <li key={card} onClick={() => props.play(card)}>
        {" "}<Card code={card} />{" "}
      </li>
    );
  });
    if ( (props.betting) && (props.maxBet ==1) )
      return (
        <ul className="hand">
          {}
        </ul>
      );
    else
      return (
        <ul className="hand">
          {cards}
        </ul>
      );
}

function threeDistribution(listorlength) {
  let length, result, dist;
  if (Array.isArray(listorlength)) {
    length = listorlength.length;
  } else {
    length = listorlength;
  }
  switch (length % 3) {
    case 0:
      dist = length / 3;
      result = [dist, dist, dist];
      break;
    case 1:
      dist = (length - 1) / 3;
      result = [dist, dist + 1, dist];
      break;
    case 2:
      dist = (length - 2) / 3;
      result = [dist + 1, dist, dist + 1];
      break;
    default:
      console.error("Uh oh");
  }
  return result;
}
