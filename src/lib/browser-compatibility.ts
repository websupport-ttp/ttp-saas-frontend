/**
 * Browser compatibility utilities and polyfills
 * Ensures consistent behavior across Chrome, Firefox, Safari, and Edge
 */

// Browser detection utilities
export const getBrowserInfo = () => {
	if (typeof window === "undefined")
		return { name: "unknown", version: "unknown" };

	const userAgent = window.navigator.userAgent;

	// Chrome
	if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
		const match = userAgent.match(/Chrome\/(\d+)/);
		return { name: "chrome", version: match ? match[1] : "unknown" };
	}

	// Firefox
	if (userAgent.includes("Firefox")) {
		const match = userAgent.match(/Firefox\/(\d+)/);
		return { name: "firefox", version: match ? match[1] : "unknown" };
	}

	// Safari
	if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
		const match = userAgent.match(/Version\/(\d+)/);
		return { name: "safari", version: match ? match[1] : "unknown" };
	}

	// Edge
	if (userAgent.includes("Edg")) {
		const match = userAgent.match(/Edg\/(\d+)/);
		return { name: "edge", version: match ? match[1] : "unknown" };
	}

	return { name: "unknown", version: "unknown" };
};

// Feature detection
export const supportsFeature = {
	// CSS Grid support
	cssGrid: () => {
		if (typeof window === "undefined") return true;
		return CSS.supports("display", "grid");
	},

	// CSS Flexbox support
	flexbox: () => {
		if (typeof window === "undefined") return true;
		return CSS.supports("display", "flex");
	},

	// CSS Custom Properties (CSS Variables)
	cssCustomProperties: () => {
		if (typeof window === "undefined") return true;
		return CSS.supports("--custom", "property");
	},

	// CSS Backdrop Filter
	backdropFilter: () => {
		if (typeof window === "undefined") return true;
		return (
			CSS.supports("backdrop-filter", "blur(10px)") ||
			CSS.supports("-webkit-backdrop-filter", "blur(10px)")
		);
	},

	// CSS Aspect Ratio
	aspectRatio: () => {
		if (typeof window === "undefined") return true;
		return CSS.supports("aspect-ratio", "16/9");
	},

	// Intersection Observer API
	intersectionObserver: () => {
		if (typeof window === "undefined") return true;
		return "IntersectionObserver" in window;
	},

	// Web Animations API
	webAnimations: () => {
		if (typeof window === "undefined") return true;
		return "animate" in document.createElement("div");
	},

	// WebP image format
	webp: () => {
		if (typeof window === "undefined") return true;
		const canvas = document.createElement("canvas");
		canvas.width = 1;
		canvas.height = 1;
		return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
	},
};

// CSS fallbacks for older browsers
export const getCSSFallbacks = () => {
	const browser = getBrowserInfo();
	const fallbacks: Record<string, string> = {};

	// Grid fallbacks for older browsers
	if (!supportsFeature.cssGrid()) {
		fallbacks["grid-fallback"] = "display: flex; flex-wrap: wrap;";
	}

	// Backdrop filter fallbacks
	if (!supportsFeature.backdropFilter()) {
		fallbacks["backdrop-fallback"] =
			"background-color: rgba(255, 255, 255, 0.9);";
	}

	// Aspect ratio fallbacks
	if (!supportsFeature.aspectRatio()) {
		fallbacks["aspect-ratio-fallback"] =
			"padding-bottom: 56.25%; height: 0; position: relative;";
	}

	return fallbacks;
};

// Polyfills for missing features
export const loadPolyfills = async () => {
	const polyfills: Promise<void>[] = [];

	// Intersection Observer polyfill
	if (!supportsFeature.intersectionObserver()) {
		const polyfillPromise = (async () => {
			try {
				// Try to load polyfill if available (this will fail in our setup, but that's ok)
				await Promise.resolve(); // Placeholder for actual polyfill import
			} catch {
				// Fallback: Create a basic polyfill
				if (
					typeof window !== "undefined" &&
					!("IntersectionObserver" in window)
				) {
					(window as any).IntersectionObserver = class {
						constructor(callback: any) {
							// Basic fallback - immediately trigger callback
							setTimeout(() => callback([{ isIntersecting: true }]), 0);
						}
						observe() {}
						disconnect() {}
						unobserve() {}
					};
				}
			}
		})();
		polyfills.push(polyfillPromise);
	}

	// Web Animations API polyfill
	if (!supportsFeature.webAnimations()) {
		const polyfillPromise = (async () => {
			try {
				// Try to load polyfill if available (this will fail in our setup, but that's ok)
				await Promise.resolve(); // Placeholder for actual polyfill import
			} catch {
				// Fallback: Add basic animate method
				if (
					typeof window !== "undefined" &&
					!("animate" in Element.prototype)
				) {
					(Element.prototype as any).animate = function () {
						return {
							finished: Promise.resolve(),
							cancel: () => {},
							pause: () => {},
							play: () => {},
						} as any;
					};
				}
			}
		})();
		polyfills.push(polyfillPromise);
	}

	await Promise.all(polyfills);
};

// Browser-specific CSS classes
export const getBrowserClasses = () => {
	const browser = getBrowserInfo();
	const classes = [`browser-${browser.name}`];

	// Add version-specific classes for major versions
	if (browser.version !== "unknown") {
		const majorVersion = parseInt(browser.version, 10);
		classes.push(`browser-${browser.name}-${majorVersion}`);

		// Add legacy class for older browsers
		if (
			(browser.name === "chrome" && majorVersion < 88) ||
			(browser.name === "firefox" && majorVersion < 85) ||
			(browser.name === "safari" && majorVersion < 14) ||
			(browser.name === "edge" && majorVersion < 88)
		) {
			classes.push("browser-legacy");
		}
	}

	return classes;
};

// Performance optimizations per browser
export const getBrowserOptimizations = () => {
	const browser = getBrowserInfo();

	const optimizations = {
		// Chrome optimizations
		chrome: {
			useGPUAcceleration: true,
			preferWebP: true,
			enableServiceWorker: true,
		},

		// Firefox optimizations
		firefox: {
			useGPUAcceleration: true,
			preferWebP: true,
			enableServiceWorker: true,
		},

		// Safari optimizations
		safari: {
			useGPUAcceleration: false, // Can cause issues on older Safari
			preferWebP: false, // Limited WebP support in older Safari
			enableServiceWorker: true,
		},

		// Edge optimizations
		edge: {
			useGPUAcceleration: true,
			preferWebP: true,
			enableServiceWorker: true,
		},
	};

	return (
		optimizations[browser.name as keyof typeof optimizations] ||
		optimizations.chrome
	);
};

// Accessibility enhancements per browser
export const getBrowserA11yEnhancements = () => {
	const browser = getBrowserInfo();

	return (
		{
			// Enhanced focus management for Safari
			safari: {
				enhancedFocusManagement: true,
				customFocusRings: true,
			},

			// Screen reader optimizations for Firefox
			firefox: {
				ariaLiveRegionOptimization: true,
				enhancedKeyboardNavigation: true,
			},

			// Default enhancements for other browsers
			default: {
				standardCompliance: true,
			},
		}[browser.name] || { standardCompliance: true }
	);
};

// CSS custom properties fallbacks
export const getCSSVariableFallbacks = () => {
	if (supportsFeature.cssCustomProperties()) {
		return {};
	}

	// Fallback values for browsers that don't support CSS custom properties
	return {
		"--brand-red": "#e21e24",
		"--brand-blue": "#141b34",
		"--brand-orange": "#ff6b35",
		"--brand-yellow": "#fbbf24",
		"--gray-50": "#fafafa",
		"--gray-100": "#f5f5f5",
		"--gray-500": "#737373",
		"--gray-900": "#171717",
	};
};

// Initialize browser compatibility
export const initBrowserCompatibility = () => {
	if (typeof window === "undefined") return;

	// Add browser classes to document
	const classes = getBrowserClasses();
	document.documentElement.classList.add(...classes);

	// Load necessary polyfills
	loadPolyfills();

	// Apply CSS variable fallbacks if needed
	const fallbacks = getCSSVariableFallbacks();
	if (Object.keys(fallbacks).length > 0) {
		const style = document.createElement("style");
		style.textContent = `:root { ${Object.entries(fallbacks)
			.map(([key, value]) => `${key}: ${value};`)
			.join(" ")} }`;
		document.head.appendChild(style);
	}

	// Log browser info for debugging
	if (process.env.NODE_ENV === "development") {
		const browser = getBrowserInfo();
		console.log("Browser detected:", browser);
		console.log("Feature support:", {
			cssGrid: supportsFeature.cssGrid(),
			flexbox: supportsFeature.flexbox(),
			backdropFilter: supportsFeature.backdropFilter(),
			aspectRatio: supportsFeature.aspectRatio(),
			webp: supportsFeature.webp(),
		});
	}
};

// Export browser compatibility status
export const browserCompatibility = {
	getBrowserInfo,
	supportsFeature,
	getCSSFallbacks,
	loadPolyfills,
	getBrowserClasses,
	getBrowserOptimizations,
	getBrowserA11yEnhancements,
	initBrowserCompatibility,
};
