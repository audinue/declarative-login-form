function pipe (...fs) {
	return x => fs.reduce((x, f) => f(x), x)
}

const modifiers = pipe(
	StateModifier,
	FetchModifier,
	HtmlModifier
)

const wrappers = pipe( // This should be compose.
	HtmlWrapper,
	FetchWrapper,
	StateWrapper,
	EventWrapper('input', 'submit', 'fetchResult')
)

const main = wrappers(modifiers)

main({
	state: {
		username: '',
		password: '',
		loginState: 'idle'
	}
})
