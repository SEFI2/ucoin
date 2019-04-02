import UCoin from './contracts/UCoin.json'

const options = {
	web3: {
		block: false,
		fallback: {
			type: 'ws',
			url: 'ws://127.0.0.1:8545',
		}
	},
	contracts: [UCoin],
	// TODO: add events (events:)
	
	polls: {
		accounts: 1500,
	},
};

export default options

