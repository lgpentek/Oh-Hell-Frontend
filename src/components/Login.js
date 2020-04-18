/* This is the login-form component. It can make requests to the server to log
 * a user in. It is displayed by default if a user does not have a valid cookie.
 */


import React, { Component } from "react";
import styled from "styled-components";
import Server from "../server.js";
import PropTypes from "prop-types";
import {
  ListGroupItem,
  Button,
  Form,
  ControlLabel,
  FormControl
} from "react-bootstrap";
import {
  Link
} from "react-router-dom";

const LobbyHeader = styled.h1`
  color: lightgrey;
`;

const HeaderPanel = styled(ListGroupItem)`
  text-align: center;
  background-color: #751010;
  border:none;
`;

const StyledButton = styled(Button)`
  margin-top: 5px;
  margin-right: 5px;
  background-color: #751010;
  color: lightgrey;
`;

const StyledLink = styled(Link)`
  vertical-align: -webkit-baseline-middle;
`;

// TODO: add functionality if invalid credientails
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    if (document.cookie.indexOf("id") !== -1) {
      this.login();
    }
  }

  componentDidMount() {
    // if (document.cookie.indexOf('id') !== -1){
    //   this.login();
    // }
  }

  handleTextUpdate(event, field) {
    this.setState({ [field]: event.target.value });
  }

  login() {
    if (this.state.email && this.state.password) {
      const user = {
        email: this.state.email,
        password: this.state.password
      };
      Server.User.login(user).then(
        response => {
          console.log("Login response", response);
          if (response.user) {
            this.props.setUser(response.user);
            this.props.redirect();
          } else {
            window.alert("Either password or username is incorrect");
          }
        },
        error => {
          window.alert("Either password or username is incorrect");
        }
      );
    } else {
      Server.User.login().then(response => {
        if (response.user) {
          this.props.setUser(response.user);
          this.props.redirect();
        }
      });
    }
  }

  render() {
    return (
      <div className="overlay" style={{ margin: "0 auto", maxWidth: "650px" }}>
        <HeaderPanel>
          <LobbyHeader>Ri-ki-ki</LobbyHeader>
        </HeaderPanel>
        <ListGroupItem className="overlay">
          <Form>
            <div>
              <ControlLabel>Email</ControlLabel>
              <FormControl
                type="text"
                value={this.state.email}
                placeholder=""
                onChange={event => this.handleTextUpdate(event, "email")}
              />
            </div>
            <div style={{ "marginTop": "10px", "marginBottom": "5px" }}>
              <ControlLabel>Password</ControlLabel>
              <FormControl
                type="password"
                value={this.state.password}
                placeholder=""
                onChange={event => this.handleTextUpdate(event, "password")}
              />
            </div>
          </Form>

          <Link to="/lobby">
            <StyledButton
              disabled={
                this.state.email.trim() === "" ||
                  this.state.password.trim() === ""
              }
              onClick={() => this.login()}
            >
              Login
            </StyledButton>
          </Link>
          <StyledLink to="/register">
            Not Registered?
          </StyledLink>
        </ListGroupItem>
      </div>
    );
  }
}

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
  redirect: PropTypes.func.isRequired
};


export default Login;
