import { drizzleConnect } from 'drizzle-react'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

class RegisteredComponent extends Component {
	constructor(props, context) { 
		super (props)
		this.contracts = context.drizzle.contracts
		this.groupEvalContract = this.contracts['GroupEval']
		this.utils = context.drizzle.web3.utils
		this.state = {
			registeredNames: [],
			registeredAddrs: [],
		}
		
		this.handleMemberRegistered = this.handleMemberRegistered.bind(this)
		this.groupEvalContract.events.memberRegistered().on('data', this.handleMemberRegistered)
	}
	
	handleMemberRegistered(event) {
		if (event && event['returnValues']) {
			this.setState(prevState => ({
				registeredNames: [...prevState.registeredNames, event['returnValues']['name']],
				registeredAddrs: [...prevState.registeredAddrs, event['returnValues']['addr']],
			}))
		}
	}
		
	render() {

			return (
				<form>
				<p> {this.state['registeredNames']} </p>	
				<br/>
				<p> {this.state['registeredAddrs']} </p>	
				</form>
			)

	}

}

RegisteredComponent.contextTypes = {
	drizzle: PropTypes.object
}


RegisteredComponent.propTypes = {

}

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	}
}

export default drizzleConnect(RegisteredComponent, mapStateToProps)






