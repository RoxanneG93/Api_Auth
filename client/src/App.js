import React, { Component } from 'react';
import Login from './components/Login/Login';
// import Welcome from './components/Welcome/Welcome';

import './App.css';

class App extends Component {
  state = { users: [] }

  render() {
    return (
      <div className="App">
        <h1>this is the React Client side app!</h1>
        <h1>Users</h1>
        <Login />
      </div>
    );
  }
}

export default App;
