import React from 'react'

import {
	AccountData,
	ContractData,
	ContractForm
} from 'drizzle-react-components'

import InitEvaluation from './GroupEval/InitEvaluationComponent'
import Deposit from './GroupEval/DepositComponent'
import CloseDeposit from './GroupEval/CloseDepositComponent'
import Evaluate from './GroupEval/EvaluateComponent'
import EndEvaluation from './GroupEval/EndEvaluationComponent'
import Registered from './GroupEval/RegisteredComponent'
import Received from './GroupEval/ReceivedComponent'







export default ({ accounts }) => (
	<div className='App'>
		<h1> UCoin </h1>

		<div className='section'>
			<h2> Active accounts </h2>
			<AccountData accountIndex='0' units='ether' precision='3' />
		</div>

		<div className='section'>
			<h2> Balance Of </h2>

			<ContractData
				contract='UCoin'
				method='balanceOf'
				methodArgs={ [accounts[0]] }
			/>
		

			<h2> Send Coins </h2>
			<ContractForm
				contract='UCoin'
				method='transfer'
				labels={['To Address', 'Amount to send']}
			/>
	
		
		<h1>
			Group Evaluation
		</h1>
		
		<div className='section'>
			<h2> InitEvaluation </h2>
			<InitEvaluation />		
		</div>
		<div className='section'>
			<h2> Deposit </h2>
			<Deposit />
		</div>

		<div className='section'>
			<h2> Close Deposit </h2>
			<CloseDeposit />
		</div>

		<div className='section'>
			<h2> Evaluate </h2>
			<Evaluate />
		</div>
	
		<div className='section'>
			<h2> End Evaluation </h2>
			<EndEvaluation />
		</div>
		<div className='section'>
			<h2> Registered Members </h2>
			<Registered />
		</div>
		<div className='section'>
			<h2> Points Received </h2>
			<Received />
		</div>



			
		</div>
	</div>
	
)






