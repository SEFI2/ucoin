import { drizzleConnect } from 'drizzle-react'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

class EvaluateComponent extends Component {
	constructor(props, context) { 
		super (props)
		this.handleEvaluate = this.handleEvaluate.bind(this)
		this.handleGroupID = this.handleGroupID.bind(this)
		this.handleMemberName = this.handleMemberName.bind(this)
		this.handlePoints = this.handlePoints.bind(this)
		this.contracts = context.drizzle.contracts
		this.groupEvalContract = this.contracts['GroupEval']
		this.utils = context.drizzle.web3.utils
		this.state = {}
	}
		
	
	handleGroupID(event) {
		this.setState({ 'groupID': event.target.value })
	}
	handlePoints(event) {
		this.setState({ 'points': event.target.value })
	}
	handleMemberName(event) {
		this.setState({ 'memberName': event.target.value })
	}	
	

	handleEvaluate (event) {
		event.preventDefault();
		const groupID = this.state['groupID'].type === 'bytes32' ?
							  this.utils.toHex(this.state['groupID']) :
							  this.state['groupID']
		const points = this.state['points'].type === 'bytes32' ?
						   this.utils.toHex(this.state['points']) :
						   this.state['points']
	
		const memberName = this.state['memberName'].type === 'bytes32' ?
						   this.utils.toHex(this.state['memberName']) :
						   this.state['memberName']
	
		return this.groupEvalContract.methods['evaluate'].cacheSend(groupID, points, memberName)
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
					key='points'
					name='points'
					onChange={this.handlePoints}
					value={this.state['points']}
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
					onClick={this.handleEvaluate}
				>
					deposit
				</button>
				</form>
			)	
	}

}

EvaluateComponent.contextTypes = {
	drizzle: PropTypes.object
}


EvaluateComponent.propTypes = {

}

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	}
}

export default drizzleConnect(EvaluateComponent, mapStateToProps)






