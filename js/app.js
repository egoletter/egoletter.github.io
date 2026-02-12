// ============================================
// GLOBAL COMPONENTS
// ============================================

// Navbar Component
const Navbar = (currentRoute) => {
	const isActive = (path) => {
		return currentRoute && currentRoute.path === path ? 'active': '';
	};

	return h('nav', {
		className: 'navbar'
	},
		h('div', {
			className: 'nav-container'
		},
			h('a', {
				href: '/', 'data-link': '', className: 'nav-brand'
			}, 'MySPA'),
			h('ul', {
				className: 'nav-menu'
			},
				h('li', null,
					h('a', {
						href: '/',
						'data-link': '',
						className: `nav-link ${isActive('/')}`
					}, 'Home')
				),
				h('li', null,
					h('a', {
						href: '/about',
						'data-link': '',
						className: `nav-link ${isActive('/about')}`
					}, 'About')
				),
				h('li', null,
					h('a', {
						href: '/products',
						'data-link': '',
						className: `nav-link ${isActive('/products')}`
					}, 'Products')
				),
				h('li', null,
					h('a', {
						href: '/contact',
						'data-link': '',
						className: `nav-link ${isActive('/contact')}`
					}, 'Contact')
				)
			)
		)
	);
};

// Footer Component
const Footer = () => {
	return h('footer', {
		className: 'footer'
	},
		h('div', {
			className: 'footer-container'
		},
			h('p', null, `© ${new Date().getFullYear()} MySPA. All rights reserved.`),
			h('div', {
				className: 'footer-links'
			},
				h('a', {
					href: '/privacy', 'data-link': ''
				}, 'Privacy'),
				h('a', {
					href: '/terms', 'data-link': ''
				}, 'Terms'),
				h('a', {
					href: '/contact', 'data-link': ''
				}, 'Contact')
			)
		)
	);
};

// Sidebar Component
const Sidebar = (currentRoute) => {
	return h('aside', {
		className: 'sidebar'
	},
		h('div', {
			className: 'sidebar-content'
		},
			h('h3', null, 'Dashboard'),
			h('ul', {
				className: 'sidebar-menu'
			},
				h('li', null, h('a', {
					href: '/dashboard', 'data-link': ''
				}, 'Overview')),
				h('li', null, h('a', {
					href: '/dashboard/stats', 'data-link': ''
				}, 'Statistics')),
				h('li', null, h('a', {
					href: '/dashboard/settings', 'data-link': ''
				}, 'Settings'))
			)
		)
	);
};

// Loading Component
const Loading = () => {
	return h('div', {
		className: 'loading-spinner'
	},
		h('div', {
			className: 'spinner'
		}),
		h('p', null, 'Loading...')
	);
};

// ============================================
// CUSTOM LAYOUTS
// ============================================

// Layout tanpa navbar dan footer (untuk login page)
const AuthLayout = (content) => {
	return h('div', {
		className: 'auth-layout'
	},
		h('div', {
			className: 'auth-container'
		},
			content
		)
	);
};

// Layout dengan sidebar (untuk dashboard)
const DashboardLayout = (content, globalComponents) => {
	return h('div', {
		className: 'dashboard-layout'
	},
		globalComponents.header ? globalComponents.header(): null,
		h('div', {
			className: 'dashboard-body'
		},
			h('aside', {
				className: 'sidebar'
			},
				Sidebar()
			),
			h('main', {
				className: 'dashboard-main'
			},
				content
			)
		)
	);
};

// ============================================
// PAGES
// ============================================

const HomePage = () => {
	return h('div', {
		className: 'home-page'
	},
		h('div', {
			className: 'hero'
		},
			h('h1', null, 'Welcome to MySPA'),
			h('p', null, 'A modern single page application'),
			h('a', {
				href: '/products',
				'data-link': '',
				className: 'btn btn-primary'
			}, 'View Products')
		)
	);
};

const AboutPage = () => {
	return h('div', {
		className: 'about-page'
	},
		h('h1', null, 'About Us'),
		h('p', null, 'We are a company that builds awesome SPAs.'),
		h('p', null, 'This page is rendered with global navbar and footer!')
	);
};

const ProductsPage = () => {
	const products = [{
		id: 1,
		name: 'Product A',
		price: '$99'
	},
		{
			id: 2,
			name: 'Product B',
			price: '$149'
		},
		{
			id: 3,
			name: 'Product C',
			price: '$199'
		}];

	return h('div', {
		className: 'products-page'
	},
		h('h1', null, 'Our Products'),
		h('div', {
			className: 'product-grid'
		},
			...products.map(product =>
				h('div', {
					className: 'product-card'
				},
					h('h3', null, product.name),
					h('p', null, product.price),
					h('a', {
						href: `/products/${product.id}`,
						'data-link': '',
						className: 'btn btn-small'
					}, 'View Details')
				)
			)
		)
	);
};

const ProductDetailPage = (context) => {
	const productId = context.params.id;

	return h('div', {
		className: 'product-detail-page'
	},
		h('h1', null, `Product #${productId}`),
		h('p', null, 'Product details go here...'),
		h('a', {
			href: '/products', 'data-link': '', className: 'btn'
		}, '← Back to Products')
	);
};

const LoginPage = () => {
	return h('div', {
		className: 'login-page'
	},
		h('h1', null, 'Login'),
		h('p', null, 'This page uses a different layout without navbar/footer'),
		h('form', {
			className: 'login-form'
		},
			h('input', {
				type: 'email', placeholder: 'Email'
			}),
			h('input', {
				type: 'password', placeholder: 'Password'
			}),
			h('button', {
				type: 'submit', className: 'btn btn-primary'
			}, 'Login')
		),
		h('p', null,
			h('a', {
				href: '/', 'data-link': ''
			}, 'Back to Home')
		)
	);
};

const DashboardPage = () => {
	return h('div', {
		className: 'dashboard-page'
	},
		h('h1', null, 'Dashboard'),
		h('p', null, 'This page uses dashboard layout with sidebar'),
		h('div', {
			className: 'stats-grid'
		},
			h('div', {
				className: 'stat-card'
			},
				h('h3', null, 'Users'),
				h('p', {
					className: 'stat-number'
				}, '1,234')
			),
			h('div', {
				className: 'stat-card'
			},
				h('h3', null, 'Revenue'),
				h('p', {
					className: 'stat-number'
				}, '$12,345')
			),
			h('div', {
				className: 'stat-card'
			},
				h('h3', null, 'Orders'),
				h('p', {
					className: 'stat-number'
				}, '567')
			)
		)
	);
};

// ============================================
// ROUTER SETUP
// ============================================

const router = new Router( {
	container: '#app',
	mode: 'history', // atau 'hash'

	// Base path untuk subdirectory
	// Jika app ada di: https://example.com/my-app/
	basePath: '/', // Kosongkan jika di root domain

	// Global components
	header: Navbar,
	footer: Footer,

	// Custom layouts
	layouts: {
		auth: AuthLayout,
		dashboard: DashboardLayout
	},

	// Default layout
	layout: 'default',

	// Guards
	beforeEach: (to, from) => {
		console.log('Navigating from', from?.path, 'to', to.path);

		// Update page title
		document.title = to.meta.title || 'MySPA';

		// Auth guard
		if (to.meta.requiresAuth && !isLoggedIn()) {
			return '/login';
		}
	},

	afterEach: (to) => {
		// Analytics
		console.log('Page view:', to.path);
	},

	// 404 handler
	notFound: (context) => {
		return h('div', {
			className: 'not-found-page'
		},
			h('h1', null, '404'),
			h('p', null, `Page "${context.path}" not found`),
			h('a', {
				href: '/', 'data-link': '', className: 'btn'
			}, 'Go Home')
		);
	}
});

// ============================================
// REGISTER ROUTES
// ============================================

router
// Public routes dengan default layout (navbar + footer)
.route('/', HomePage, {
	meta: {
		title: 'Home - MySPA'
	}
})
.route('/about', AboutPage, {
	meta: {
		title: 'About - MySPA'
	}
})
.route('/products', ProductsPage, {
	meta: {
		title: 'Products - MySPA'
	}
})
.route('/products/:id', ProductDetailPage, {
	meta: {
		title: 'Product Detail - MySPA'
	}
})

// Auth routes dengan auth layout (tanpa navbar/footer)
.route('/login', LoginPage, {
	layout: 'auth',
	meta: {
		title: 'Login - MySPA'
	}
})

// Dashboard routes dengan dashboard layout (sidebar)
.route('/dashboard', DashboardPage, {
	layout: 'dashboard',
	meta: {
		title: 'Dashboard - MySPA',
		requiresAuth: true
	}
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function isLoggedIn() {
	// Implement your auth logic
	return localStorage.getItem('token') !== null;
}

// Save router globally
window.appRouter = router;