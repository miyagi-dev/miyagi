const colors = {
	grey: "\x1b[90m",
	red: "\x1b[31m",
	yellow: "\x1b[33m",
	green: "\x1b[32m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",
	reset: "\x1b[0m",
};

const types = {
	error: { console: "error", label: "Error", color: "red" },
	warn: { console: "log", label: "Warning", color: "yellow" },
	success: { console: "log", label: "Success", color: "green" },
	info: { console: "info", label: "Info", color: "cyan" },
};

/**
 * Module for pretty cli logs
 * @module logger
 * @param {string} [type]
 * @param {string} message
 * @returns {string}
 */
export default function log(type, message) {
	if (process.env.MIYAGI_JS_API) return;

	const date = new Date();
	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1);
	const day = pad(date.getDate());
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const seconds = pad(date.getSeconds());

	const dateStr = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

	return console[types[type].console](
		`${colorize("grey", dateStr)} ${colorize(
			types[type].color,
			`${types[type].label}:`,
		)} ${colors.reset}${message}`,
	);
}

/**
 * @param {string} color
 * @param {string} str
 * @returns {string}
 */
function colorize(color, str) {
	return `${colors[color]}${str}`;
}

/**
 * @param {Date} value
 * @returns {string}
 */
function pad(value) {
	return value.toString().padStart(2, "0");
}
