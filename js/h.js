/**
* Enhanced factory function dengan fitur tambahan
*/
function createElement(tag, props = {}, ...children) {
	const element = document.createElement(tag);

	if (props) {
		Object.entries(props).forEach(([key, value]) => {
			// Event listeners (on*)
			if (key.startsWith('on') && typeof value === 'function') {
				const eventName = key.substring(2).toLowerCase();
				element.addEventListener(eventName, value);
			}
			// className atau class
			else if (key === 'className' || key === 'class') {
				element.className = value;
			}
			// classList (array)
			else if (key === 'classList' && Array.isArray(value)) {
				element.classList.add(...value);
			}
			// style object
			else if (key === 'style' && typeof value === 'object') {
				Object.assign(element.style, value);
			}
			// dataset object
			else if (key === 'dataset' && typeof value === 'object') {
				Object.assign(element.dataset, value);
			}
			// ref callback
			else if (key === 'ref' && typeof value === 'function') {
				value(element);
			}
			// innerHTML (hati-hati dengan XSS!)
			else if (key === 'innerHTML') {
				element.innerHTML = value;
			}
			// textContent
			else if (key === 'textContent') {
				element.textContent = value;
			}
			// Boolean attributes
			else if (typeof value === 'boolean') {
				if (value) element.setAttribute(key, '');
				else element.removeAttribute(key);
			}
			// Regular attributes
			else if (value !== null && value !== undefined) {
				element.setAttribute(key, value);
			}
		});
	}

	// Append children
	const appendChildren = (items) => {
		items.forEach(child => {
			if (child === null || child === undefined || child === false) return;

			if (Array.isArray(child)) {
				appendChildren(child);
			} else if (child instanceof Node) {
				element.appendChild(child);
			} else {
				element.appendChild(document.createTextNode(String(child)));
			}
		});
	};

	appendChildren(children);

	return element;
}

// Alias untuk syntax yang lebih pendek
const h = createElement;

// Helper untuk fragment (seperti React.Fragment)
function Fragment(props, ...children) {
	const fragment = document.createDocumentFragment();
	children.flat(Infinity).forEach(child => {
		if (child instanceof Node) {
			fragment.appendChild(child);
		} else if (child !== null && child !== undefined) {
			fragment.appendChild(document.createTextNode(String(child)));
		}
	});
	return fragment;
}