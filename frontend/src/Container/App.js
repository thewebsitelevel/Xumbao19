import React, { Component } from 'react';
import colors from '../Utilities/colors';
import './App.css';
import 'tachyons';
// import Dashboard from '../Components/Dashboard/Dashboard.js';
import AppRouter from '../Router/AppRouter';

class App extends Component {
  render() {
    return (
      <div className="App" style={{ background: colors.purp }} >
        <AppRouter />
      </div>
    );
  }
}

export default App;
