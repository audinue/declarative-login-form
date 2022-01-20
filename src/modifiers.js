function UpdateUsername ({ state, event }) {
	return event !== null && event.type === 'input' && event.target.id === 'username'
		? event.target.value
		: state.username
}

function UpdatePassword ({ state, event }) {
	return event !== null && event.type === 'input' && event.target.id === 'password'
		? event.target.value
		: state.password
}

function UpdateLoading ({ state, event }) {
	return event !== null && event.type === 'submit' && event.target.id === 'loginForm'
		? (event.preventDefault() /* HACK */, true)
		: state.loading && event !== null && event.type === 'fetchResult'
			? false
			: state.loading
}

function UpdateRequesting ({ state, event }) {
	return event !== null && event.type === 'submit' && event.target.id === 'loginForm'
}

function UpdateLoginState ({ state, event }) {
	return event !== null && event.type === 'fetchResult'
		? (event.data ? 'success' : 'failed')
		: state.loginState
}

function StateModifier (context) {
	return {
		...context,
		state: {
			...context.state,
			username: UpdateUsername(context),
			password: UpdatePassword(context),
			loading: UpdateLoading(context),
			requesting: UpdateRequesting(context),
			loginState: UpdateLoginState(context)
		}
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
				? `Login success!`
				: `Login failed!`
	}
}
