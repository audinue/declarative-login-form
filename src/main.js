function pipe (...fs) {
	return x => fs.reduce((x, f) => f(x), x)
}

const modifiers = pipe(
	StateModifier,
	FetchModifier,
	EventsModifier,
	HtmlModifier,
)

const wrappers = pipe( // This should be compose.
	HtmlWrapper,
	FetchWrapper,
	StateWrapper,
	EventWrapper
)

const main = wrappers(modifiers)

main({})
