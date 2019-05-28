import { drizzleConnect } from 'drizzle-react'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ReceivedComponent extends Component {
	constructor(props, context) { 
		super (props)
		this.contracts = context.drizzle.contracts
		this.groupEvalContract = this.contracts['GroupEval']
		this.utils = context.drizzle.web3.utils
		this.state = {
			receivedNames: [],
			receivedAddrs: [],
			receivedPoints:[]
		}
		
		this.handlePointsReceived = this.handlePointsReceived.bind(this)
		this.groupEvalContract.events.pointsReceived().on('data', this.handlePointsReceived)
	}
	
	handlePointsReceived(event) {
		if (event && event['returnValues']) {
			this.setState(prevState => ({
				receivedNames: [...prevState.receivedNames, event['returnValues']['name']],
				receivedAddrs: [...prevState.receivedAddrs, event['returnValues']['addr']],
				receivedPoints: [...prevState.receivedPoints, event['returnValues']['points']]
			}))
		}
	}
		
	render() {

			return (
				<form>
				<p> {this.state['receivedNames']} </p>	
				<br/>
				<p> {this.state['receivedAddrs']} </p>	
				<p> {this.state['receivedPoints']} </p>
				</form>
			)

	}

}

ReceivedComponent.contextTypes = {
	drizzle: PropTypes.object
}


ReceivedComponent.propTypes = {

}

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	}
}

export default drizzleConnect(ReceivedComponent, mapStateToProps)






