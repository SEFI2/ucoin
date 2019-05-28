import { drizzleConnect } from 'drizzle-react'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

class DepositComponent extends Component {
	constructor(props, context) { 
		super (props)
		this.handleDeposit = this.handleDeposit.bind(this)
		this.handleGroupID = this.handleGroupID.bind(this)
		this.handleMemberName = this.handleMemberName.bind(this)
		this.contracts = context.drizzle.contracts
		this.groupEvalContract = this.contracts['GroupEval']
		this.utils = context.drizzle.web3.utils
		this.state = {}
		
	}
	handleGroupID(event) {
		this.setState({ 'groupID': event.target.value })
	}
	
	handleMemberName(event) {
		this.setState({ 'memberName': event.target.value })
	}	
	

	handleDeposit (event) {
		event.preventDefault();
		const groupID = this.state['groupID'].type === 'bytes32' ?
							  this.utils.toHex(this.state['groupID']) :
							  this.state['groupID']
		const memberName = this.state['memberName'].type === 'bytes32' ?
						   this.utils.toHex(this.state['memberName']) :
						   this.state['memberName']
		return this.groupEvalContract.methods['deposit'].cacheSend(groupID, memberName)
	}
	
		
	render() {
			return (
				<form>
				<input 
					key='groupID'
					name='groupID'
					onChange={this.handleGroupID}
					value={this.state['groupID']}
				/>
				
				<input 
					key='memberName'
					name='memberName'
					onChange={this.handleMemberName}
					value={this.state['memberName']}
				/>
				<button
					key='deposit'
					className='pure-button'
					type='button'
					onClick={this.handleDeposit}
				>
					deposit
				</button>
				</form>
			)	
	}

}

DepositComponent.contextTypes = {
	drizzle: PropTypes.object
}


DepositComponent.propTypes = {

}

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	}
}

export default drizzleConnect(DepositComponent, mapStateToProps)






