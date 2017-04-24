import React, { Component } from 'react';
import Login from './Login.js';
import Register from './Register.js';
import GameContainer from './GameContainer.js'

const SERVER = 'http://localhost:5000'

class OhHellContainer extends Component {
   constructor(){
     super();
     this.state = {
       mode: 'main'
     }
  }

  login(user) {
    const userStr = JSON.stringify(user);
    const request = new Request(
      SERVER + '/users/login',
      {
        mode: 'no-cors', //????
        method:'POST',
        body:userStr,
        headers: new Headers({'Content-type':'application/json'})
      }
    );
    console.log(userStr);
    fetch(request)
    .then((response)=>{
      console.log(response.status);
      if (response.ok){
        this.setState({mode:'join'})
      }
    })
  }

  register(user) {
    const userStr = JSON.stringify(user);
    const request = new Request(
      SERVER + '/users/register',
      {
        mode: 'no-cors', //????
        method:'POST',
        body:userStr,
        headers: new Headers({'Content-type':'application/json'})
      }
    );
    console.log(userStr);
    fetch(request)
    .then((response)=>{
      console.log(response.status);
      if (response.ok){
        this.setState({mode:'join'})
      }
    })
  }

  render(){
    if (this.state.mode === 'main'){
      return(
        <div>
          <input type="button" onClick={()=>{this.setState({mode:'login'})}} value="Login"/>
          <input type='button' onClick={()=>{this.setState({mode:'register'})}} value = "Register"/>
          <input type='button' onClick={()=>{this.setState({mode:'game'})}} value = "Game"/>
        </div>
        );
      } else if (this.state.mode === 'login'){
        return(
          <div>
            <Login login={(user)=> this.login(user)}/>
            <input type='button' onClick={()=>{this.setState({mode:'main'})}} value = "Back"/>
          </div>
        )
      } else if (this.state.mode === 'register'){
        return(
          <div>
            <Register register={(user)=> this.register(user)}/>
            <input type='button' onClick={()=>{this.setState({mode:'main'})}} value = "Back"/>
          </div>
        )
      } else if (this.state.mode === 'join'){
        return(
          <div>
          <h1> Logged in </h1>
          </div>
        )
      } else if (this.state.mode === 'game'){
        return(
          <div>
            <GameContainer/>
            <input type='button' onClick={()=>{this.setState({mode:'main'})}} value = "Back"/>
          </div>
        )
      }
    }
}

export default OhHellContainer
