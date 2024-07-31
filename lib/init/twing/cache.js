export default class TwingCache {
	#cache = new Map();

	/**
	 * @param {string} key
	 * @returns {object|null}
	 */
	load(key) {
		if (this.#cache.get(key)?.content) {
			return this.#cache.get(key)?.content;
		}

		return null;
	}

	/**
	 * @param {string} key
	 * @param {object} content
	 */
	write(key, content) {
		const timestamp = new Date().getTime();
		const value = { content, timestamp };

		this.#cache.set(key, value);
	}

	/**
	 * @param {string} key
	 * @returns {number|null}
	 */
	getTimestamp(key) {
		return this.#cache.get(key)?.timestamp ?? null;
	}
}
