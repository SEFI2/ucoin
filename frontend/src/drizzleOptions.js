import UCoin from './contracts/UCoin.json'
import GroupEval from './contracts/GroupEval.json'


const options = {
	web3: {
		block: false,
		fallback: {
			type: 'ws',
			url: 'ws://127.0.0.1:9545',
		}
	},
	contracts: [UCoin, GroupEval],
	// TODO: add events (events:)
	
	polls: {
		accounts: 1500,
	},
};

export default options

