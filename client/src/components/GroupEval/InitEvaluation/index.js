import { drizzleConnect } from 'drizzle-react'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

class InitEvaluationComponent extends Component {
	constructor(props, context) { 
		super (props)
		this.handleInitEvaluation = this.handleInitEvaluation.bind(this)
		this.handleDepositAmount = this.handleDepositAmount.bind(this)
		this.handleMemberName = this.handleMemberName.bind(this)
		this.handleGroupID = this.handleGroupID.bind(this)
		this.contracts = context.drizzle.contracts
		this.groupEvalContract = this.contracts['GroupEval']
		//this.utils = context.drizzle.web3.utils
		this.state = {}
		this.groupID = null;
		this.groupEvalContract.events.announceGroupID().on('data', this.handleGroupID);
	}
	
	handleGroupID(event) {
		if (event && event['returnValues']) {
			this.setState({ 'groupID': event['returnValues']['groupID'] })
		}
	}
	
	handleDepositAmount(event) {
		this.setState({ 'depositAmount': event.target.value })
	}
	
	handleMemberName(event) {
		this.setState({ 'memberName': event.target.value })
	}	
	

	handleInitEvaluation (event) {
		event.preventDefault();
		const depositAmount = this.state['depositAmount'].type === 'bytes32' ?
							  this.utils.toHex(this.state['depositAmount']) :
							  this.state['depositAmount']
		const memberName = this.state['memberName'].type === 'bytes32' ?
						   this.utils.toHex(this.state['memberName']) :
						   this.state['memberName']
		

		return this.groupEvalContract.methods['initEvaluation'].cacheSend(depositAmount, memberName)
	}
	
		
	render() {
			return (
				<form>
				<input 
					key='depositAmount'
					name='depositAmount'
					onChange={this.handleDepositAmount}
					value={this.state['depositAmount']}
				/>
				
				<input 
					key='memberName'
					name='memberName'
					onChange={this.handleMemberName}
					value={this.state['memberName']}
				/>
				<button
					key='initEvaluation'
					className='pure-button'
					type='button'
					onClick={this.handleInitEvaluation}
				>
					initEvaluation
				</button>
				{
					this.state['groupID'] && <h3> Ynur groupID: {this.state['groupID']} </h3>
				}
				</form>
			)	
	}

}

InitEvaluationComponent.contextTypes = {
	drizzle: PropTypes.object
}


InitEvaluationComponent.propTypes = {

}

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	}
}

export default drizzleConnect(InitEvaluationComponent, mapStateToProps)







