function UpdateState ({ state, event }) {
	return {
		username: event.type === 'input' && event.target.id === 'username'
			? event.target.value
			: state.username,
		password: event.type === 'input' && event.target.id === 'password'
			? event.target.value
			: state.password,
		loading: event.type === 'submit' && event.target.id === 'loginForm'
			? true
			: state.loading && event.type === 'fetchResult'
				? false
				: state.loading,
		requesting: event.type === 'submit' && event.target.id === 'loginForm',
		loginState: event.type === 'fetchResult'
			? (event.data ? 'success' : 'failed')
			: state.loginState
	}
}

function StateModifier (context) {
	return context.state === undefined || (event.type === 'click' && event.target.id === 'reset')
		? {
			...context,	
			state: {
				username: '',
				password: '',
				loading: false,
				requesting: false,
				loginState: 'idle'
			}
		}
		: {
			...context,
			state: UpdateState(context)
		}
}

function FetchModifier (context) {
	const { state: { requesting, username, password } } = context
	return {
		...context,
		fetch: requesting
			? {
				url: 'login.php',
				data: { username, password }
			}
			: null
	}
}

function HtmlModifier (context) {
	const { state: { loginState, loading, username, password } } = context
	return {
		...context,
		html: loginState === 'idle'
			? `
				<form id="loginForm">
					Username: <input id="username"${loading ? ` disabled` : ``} value="${username}"><br>
					Password: <input id="password" type="password"${loading ? ` disabled` : ``} value="${password}"><br>
					<button${loading ? ` disabled` : ``}>Login</button>
				</form>
			`
			: loginState === 'success'
				? `
					Login success!<br>
					<button id="reset">Reset</button>
				`
				: `
					Login failed!<br>
					<button id="reset">Reset</button>
				`
	}
}

function EventsModifier (context) {
	return {
		...context,
		event: {
			types: ['click', 'input', 'submit', 'fetchResult'],
			preventDefault: e => e.type === 'submit'
		}
	}
}
