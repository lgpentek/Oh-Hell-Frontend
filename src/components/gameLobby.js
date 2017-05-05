// This file contains a functional component to render a game lobby
// Props: an array of games, a callback to set view state, a callback to
// join a game, a callback to create a game, a server.

import React, {Component} from 'react';
import Server from '../server.js';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class Lobby extends Component {
  constructor(){
    super();
    this.state = {
      activeGames: []
    }
    Server.game.getGames().then((games)=>(this.setState({activeGames: games})));
 }

  render(){
    console.log(this.state.activeGames);
    const games = this.state.activeGames.map((game)=>{
      return (
        <div>
          <Link to={'/game/' + game.id}>
            <span>{game.id} </span>
            <span>{game.playersInGame}/{game.maxPlayers}</span>
          </Link>
        </div>
      )
    });

    return(
      <div style={{marginLeft: 3 + 'em'}} id="Lobby">
        <h1>Gamelobby</h1>
        <button type="button" onClick={() => Server.game.createGame()}>Create Game</button>
        <button type="button" onClick={() => {Server.game.getGames().then((games)=>{this.setState({activeGames: games})})}}>Refresh</button>
        <div>{games}</div>
      </div>
    )
  }
}

export default Lobby;