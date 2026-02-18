// Simple className utility function
export function cn(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(price);
}

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(amount);
}

export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

export function throttle<T extends (...args: any[]) => any>(
	func: T,
	limit: number
): (...args: Parameters<T>) => void {
	let inThrottle: boolean;
	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
}

// Search parameter management
export const searchParamManager = {
	saveSearchData: (serviceType: string, data: any) => {
		const searchData = {
			timestamp: Date.now(),
			serviceType,
			data,
		};
		localStorage.setItem(
			`travelplace_search_${serviceType}`,
			JSON.stringify(searchData)
		);
		localStorage.setItem("travelplace_last_search", JSON.stringify(searchData));
	},

	getSearchData: (serviceType: string) => {
		const stored = localStorage.getItem(`travelplace_search_${serviceType}`);
		if (stored) {
			const data = JSON.parse(stored);
			// Return data if it's less than 24 hours old
			if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
				return data.data;
			}
		}
		return null;
	},

	getUrlParameters: () => {
		if (typeof window === "undefined") return {};
		const params = new URLSearchParams(window.location.search);
		const data: Record<string, string> = {};

		// Use forEach instead of for...of to avoid iteration issues
		params.forEach((value, key) => {
			data[key] = value;
		});

		return data;
	},
};
