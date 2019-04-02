import MyComponent from './MyComponent'

import { drizzleConnect } from 'drizzle-react'


const mapStateToProps = state => {
	return {
		accounts: state.accounts,
		UCoin: state.contracts.UCoin,
		drizzleStatus: state.drizzleStatus
	}
}

const MyContainer = drizzleConnect(MyComponent, mapStateToProps)

export default MyContainer


