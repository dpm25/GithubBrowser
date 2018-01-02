/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Login from './Login.js';
import AuthService from './AuthService.js';
import AppContainer from './AppContainer.js';

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {};

    let authService =  new AuthService();
    authService.getAuthInfo((err, authInfo) => {
      this.setState({
        checkingAuth: true
      })
    });
  }

  onLogin = () => {
    console.log('We are now logged in');
    this.setState({isLoggedIn: true});
  }

  render() {
    if (this.state.checkingAuth) {
      return (
        <AppContainer />
      )
    }
    else {
      return (
        <Login onLogin={this.onLogin} />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
