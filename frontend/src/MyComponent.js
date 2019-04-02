import React from 'react'

import {
	AccountData,
	ContractData,
	ContractForm
} from 'drizzle-react-components'
class 


export default ({ accounts }) => (
	<div className='App'>
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
				
		</div>
	</div>
	
)






