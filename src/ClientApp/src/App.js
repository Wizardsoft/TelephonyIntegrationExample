import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Testing } from './components/Testing';

import './custom.css'
import './components/Testing.css'

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path='/' component={Testing} /> 
        <Route path='/testing' component={Testing} />
        <Route path='/auth/callback' component={Testing} />
      </Layout>
    );
  }
}
