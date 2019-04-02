import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import drizzleOptions from './drizzleOptions'
import MyContainer from './MyContainer' 

import { DrizzleProvider } from 'drizzle-react'
import { LoadingContainer } from 'drizzle-react-components'



class App extends Component {
	render() {
	    return (
			<DrizzleProvider options={drizzleOptions}>
				<LoadingContainer>
					<MyContainer />
				</LoadingContainer>
			</DrizzleProvider>
		);
  }
}

export default App;
