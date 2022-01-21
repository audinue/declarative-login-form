function EventWrapper  (f) {
	let initial = true
	return function (t) {
		const r = f({ ...t, event: new Event('null') })
		if (initial) {
			for (const type of r.event.types) {
				addEventListener(type, function (e) {
					if (r.event.preventDefault(e)) {
						e.preventDefault()
					}
					f({ ...t, event: e })
				})
			}
			initial = false
		}
		return r
	}
}

function StateWrapper (f) {
	let state = undefined
	return function (t) {
		if (state === undefined) {
			state = t.state
		}
		const r = f({ ...t, state })
		state = r.state
		return r
	}
}

function patch (prev, next) {
	if (prev.nodeName !== next.nodeName) {
		prev.parentNode.replaceChild(next, prev)
	} else if (prev.nodeType === Node.TEXT_NODE) {
		if (prev.textContent !== next.textContent) {
			prev.textContent = next.textContent
		}
	} else {
		for (const { name, value } of next.attributes) {
			if (prev.getAttribute(name) !== value) {
				prev.setAttribute(name, value)
			}
		}
		for (const { name } of [...prev.attributes]) {
			if (!next.hasAttribute(name)) {
				prev.removeAttribute(name)
			}
		}
		const p = [...prev.childNodes]
		const n = [...next.childNodes]
		if (p.length < n.length) {
			for (let i = p.length; i < n.length; i++) {
				prev.appendChild(n[i])
			}
		}
		if (p.length > n.length) {
			for (let i = n.length; i < p.length; i++) {
				prev.removeChild(p[i])
			}
		}
		const min = Math.min(p.length, n.length)
		for (let i = 0; i < min; i++) {
			patch(p[i], n[i])
		}
	}
}

function patchBody (html) {
	const body = document.createElement('body')
	body.innerHTML = html
	patch(document.body, body)
}

function HtmlWrapper (f) {
	let initial = true
	return function (t) {
		const r = f(t)
		if (r.html !== null) {
			if (initial) {
				if (document.body) {
					patchBody(r.html)
				} else {
					addEventListener('DOMContentLoaded', function () {
						patchBody(r.html)
					})
				}
				initial = false
			} else {
				patchBody(r.html)
			}
		}
		return r
	}
}

function FetchWrapper (f) {
	return function (t) {
		const r = f(t)
		if (r.fetch !== null) {
			fetch(r.fetch.url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: Object.entries(r.fetch.data)
					.map(function ([key, value]) {
						return `${key}=${encodeURI(value)}`
					})
					.join('&')
			}).then(function (response) {
				return response.json()
			}).then(function (data) {
				dispatchEvent(Object.assign(new Event('fetchResult'), { data }))
			})
		}
		return r
	}
}
