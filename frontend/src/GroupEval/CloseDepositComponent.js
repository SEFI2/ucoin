import { drizzleConnect } from 'drizzle-react'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

class CloseDepositComponent extends Component {
	constructor(props, context) { 
		super (props)
		this.handleCloseDeposit = this.handleCloseDeposit.bind(this)
		this.handleGroupID = this.handleGroupID.bind(this)
		this.contracts = context.drizzle.contracts
		this.groupEvalContract = this.contracts['GroupEval']
		this.utils = context.drizzle.web3.utils
		this.state = {}
	}
		
	
	handleGroupID(event) {
		this.setState({ 'groupID': event.target.value })
	}
	

	handleCloseDeposit (event) {
		event.preventDefault();
		const groupID = this.state['groupID'].type === 'bytes32' ?
							  this.utils.toHex(this.state['groupID']) :
							  this.state['groupID']
		return this.groupEvalContract.methods['closeDeposit'].cacheSend(groupID)
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
				
				<button
					key='close-deposit'
					className='pure-button'
					type='button'
					onClick={this.handleCloseDeposit}
				>
					Close Deposit
				</button>
				</form>
			)	
	}

}

CloseDepositComponent.contextTypes = {
	drizzle: PropTypes.object
}


CloseDepositComponent.propTypes = {

}

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	}
}

export default drizzleConnect(CloseDepositComponent, mapStateToProps)






