/**
* Enhanced Router dengan support untuk subdirectory dan global components
*/
class Router {
	constructor(options = {}) {
		this.routes = [];
		this.notFoundHandler = options.notFound || this.defaultNotFound;
		this.beforeEach = options.beforeEach || null;
		this.afterEach = options.afterEach || null;
		this.container = options.container || '#app';
		this.mode = options.mode || 'hash'; // 'hash' atau 'history'
		this.currentRoute = null;

		// Base path untuk subdirectory (misal: '/my-app' atau '/projects/spa')
		this.basePath = options.basePath || '';
		if (this.basePath && !this.basePath.startsWith('/')) {
			this.basePath = '/' + this.basePath;
		}
		// Remove trailing slash
		this.basePath = this.basePath.replace(/\/$/, '');

		// Global components (navbar, footer, sidebar, dll)
		this.globalComponents = {
			header: options.header || null,
			footer: options.footer || null,
			sidebar: options.sidebar || null,
			...options.components
		};

		// Layout configuration
		this.layout = options.layout || 'default';
		this.layouts = options.layouts || {};

		this.init();
	}

	init() {
		// Listen untuk perubahan URL
		if (this.mode === 'history') {
			window.addEventListener('popstate', () => this.handle());

			// Intercept semua link clicks
			document.addEventListener('click', (e) => {
				const link = e.target.closest('[data-link]');
				if (link) {
					e.preventDefault();
					const href = link.getAttribute('href');
					this.navigate(href);
				}
			});
		} else {
			window.addEventListener('hashchange', () => this.handle());
		}

		// Handle initial load
		this.handle();
	}

	/**
	* Mendaftarkan route
	* @param {string} path - Path pattern (bisa pakai :param untuk dynamic)
	* @param {Function} handler - Handler function yang return HTMLElement
	* @param {Object} options - Route options (layout, middleware, meta, dll)
	*/
	route(path, handler, options = {}) {
		this.routes.push({
			path,
			handler,
			regex: this.pathToRegex(path),
			layout: options.layout || this.layout,
			meta: options.meta || {},
			middleware: options.middleware || []
		});
		return this;
	}

	/**
	* Konversi path pattern ke regex
	*/
	pathToRegex(path) {
		const pattern = path
			.replace(/\//g, '\\/')
			.replace(/:\w+/g, '([^/]+)')
			.replace(/\*/g, '.*');
		return new RegExp(`^${pattern}$`);
	}

	/**
	* Extract params dari URL
	*/
	extractParams(path, route) {
		const params = {};
		const paramNames = route.path.match(/:\w+/g) || [];
		const values = path.match(route.regex);

		if (values) {
			paramNames.forEach((name, i) => {
				params[name.substring(1)] = values[i + 1];
			});
		}

		return params;
	}

	/**
	* Get current path (tanpa basePath)
	*/
	getPath() {
		let path;

		if (this.mode === 'history') {
			path = window.location.pathname;
			// Remove basePath dari path
			if (this.basePath && path.startsWith(this.basePath)) {
				path = path.substring(this.basePath.length);
			}
		} else {
			path = window.location.hash.slice(1) || '/';
		}

		return path || '/';
	}

	/**
	* Get full path (dengan basePath)
	*/
	getFullPath(path) {
		if (this.mode === 'history') {
			return this.basePath + path;
		}
		return path;
	}

	/**
	* Navigate ke path baru
	*/
	navigate(path) {
		if (this.mode === 'history') {
			const fullPath = this.getFullPath(path);
			window.history.pushState({}, '', fullPath);
			this.handle();
		} else {
			window.location.hash = path;
		}
	}

	/**
	* Replace current URL tanpa menambah history
	*/
	replace(path) {
		if (this.mode === 'history') {
			const fullPath = this.getFullPath(path);
			window.history.replaceState({}, '', fullPath);
			this.handle();
		} else {
			window.location.replace('#' + path);
		}
	}

	/**
	* Go back
	*/
	back() {
		window.history.back();
	}

	/**
	* Go forward
	*/
	forward() {
		window.history.forward();
	}

	/**
	* Get query parameters
	*/
	getQueryParams() {
		const params = {};
		const queryString = window.location.search.substring(1);
		const pairs = queryString.split('&');

		pairs.forEach(pair => {
			const [key, value] = pair.split('=');
			if (key) {
				params[decodeURIComponent(key)] = decodeURIComponent(value || '');
			}
		});

		return params;
	}

	/**
	* Render layout dengan global components
	*/
	renderLayout(content,
		layoutName) {
		const containerElement = document.querySelector(this.container);
		if (!containerElement) {
			console.error(`Container element ${this.container} tidak ditemukan`);
			return;
		}

		// Clear container
		containerElement.innerHTML = '';

		// Jika ada custom layout
		if (layoutName && this.layouts[layoutName]) {
			const layout = this.layouts[layoutName](content, this.globalComponents);
			containerElement.appendChild(layout);
			return;
		}

		// Default layout dengan header, main, footer
		const layout = h('div', {
			className: 'app-layout'
		},
			// Header/Navbar
			this.globalComponents.header ? this.globalComponents.header(this.currentRoute): null,

			// Sidebar (jika ada)
			this.globalComponents.sidebar ?
			h('div', {
					className: 'layout-with-sidebar'
				},
				this.globalComponents.sidebar(this.currentRoute),
				h('main', {
					className: 'main-content', id: 'main-content'
				}, content)
			) :
			h('main', {
				className: 'main-content', id: 'main-content'
			}, content),

			// Footer
			this.globalComponents.footer ? this.globalComponents.footer(this.currentRoute): null
		);

		containerElement.appendChild(layout);
	}

	/**
	* Handle route change
	*/
	async handle() {
		const path = this.getPath();

		// Cari route yang cocok
		let matchedRoute = null;
		let params = {};

		for (const route of this.routes) {
			if (route.regex.test(path)) {
				matchedRoute = route;
				params = this.extractParams(path, route);
				break;
			}
		}

		const context = {
			path,
			params,
			query: this.getQueryParams(),
			route: matchedRoute,
			meta: matchedRoute?.meta || {},
			navigate: this.navigate.bind(this),
			replace: this.replace.bind(this),
			back: this.back.bind(this),
			forward: this.forward.bind(this)
		};

		// beforeEach guard
		if (this.beforeEach) {
			const result = await this.beforeEach(context, this.currentRoute);
			if (result === false) return; // Cancel navigation
			if (typeof result === 'string') {
				this.navigate(result);
				return;
			}
		}

		// Run route-specific middleware
		if (matchedRoute && matchedRoute.middleware.length > 0) {
			for (const middleware of matchedRoute.middleware) {
				const result = await middleware(context);
				if (result === false) return;
				if (typeof result === 'string') {
					this.navigate(result);
					return;
				}
			}
		}

		// Render route
		let content;
		if (matchedRoute) {
			try {
				content = await matchedRoute.handler(context);
			} catch (error) {
				console.error('Error rendering route:', error);
				content = h('div', {
					className: 'error'
				},
					h('h1', null, 'Error'),
					h('p', null, 'An error occurred while loading this page.')
				);
			}
		} else {
			// 404 Not Found
			content = await this.notFoundHandler(context);
		}

		// Render dengan layout
		const layoutName = matchedRoute?.layout || 'default';

		if (content instanceof Node || typeof content === 'string') {
			this.renderLayout(content, layoutName);
		}

		// afterEach hook
		if (this.afterEach) {
			await this.afterEach(context, this.currentRoute);
		}

		this.currentRoute = context;

		// Scroll to top
		window.scrollTo(0, 0);
	}

	/**
	* Update global component
	*/
	updateGlobalComponent(name, component) {
		this.globalComponents[name] = component;
		this.handle(); // Re-render
	}

	/**
	* Default 404 handler
	*/
	defaultNotFound(context) {
		return h('div', {
			className: 'not-found'
		},
			h('h1', null, '404'),
			h('p', null, `Page "${context.path}" not found`),
			h('a', {
				href: '/', 'data-link': ''
			}, 'Go Home')
		);
	}
}

// Export
window.Router = Router;