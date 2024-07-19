const COLORS = {
	grey: "\x1b[90m",
	red: "\x1b[31m",
	yellow: "\x1b[33m",
	green: "\x1b[32m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",
	reset: "\x1b[0m",
};

const TYPES = {
	error: { console: "error", label: "Error", color: "red" },
	warn: { console: "warn", label: "Warning", color: "yellow" },
	success: { console: "log", label: "Success", color: "green" },
	info: { console: "info", label: "Info", color: "cyan" },
};

/**
 * @param {string} type
 * @param {string} [message]
 * @param {string} [verboseMessage]
 */
export default function log(type, message, verboseMessage) {
	if (process.env.MIYAGI_JS_API) return;
	if (!(type in TYPES)) return;

	const date = new Date();
	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1);
	const day = pad(date.getDate());
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const seconds = pad(date.getSeconds());
	const dateStr = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
	const params = {
		type: TYPES[type].console,
		dateStr,
		color: TYPES[type].color,
		label: TYPES[type].label,
	};

	if (message) {
		printMessage({
			...params,
			message,
		});
	}

	if (process.env.VERBOSE && verboseMessage) {
		if (type === "error") {
			console.error(verboseMessage);
			return;
		}

		printMessage({
			...params,
			message: verboseMessage,
		});
	}
}

/**
 * @param {string} color
 * @param {string} str
 * @returns {string}
 */
function colorize(color, str) {
	return `${COLORS[color]}${str}`;
}

/**
 * @param {Date} value
 * @returns {string}
 */
function pad(value) {
	return value.toString().padStart(2, "0");
}

/**
 * @param {object} o
 * @param {string} o.type
 * @param {string} o.dateStr
 * @param {string} o.color
 * @param {string} o.label
 * @param {string} o.message
 */
function printMessage({ type, dateStr, color, label, message }) {
	console[type](
		`${colorize("grey", dateStr)} ${colorize(
			color,
			`${label}:`,
		)} ${COLORS.reset}${message}`,
	);
}
