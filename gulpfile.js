const babel = require("gulp-babel");
const cssnano = require("cssnano");
const del = require("del");
const gulp = require("gulp");
const postcss = require("gulp-postcss");
const postcssImport = require("postcss-import");
const postcssPresetEnv = require("postcss-preset-env");
const rollup = require("rollup");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const terser = require("rollup-plugin-terser");

const buildFolder = "dist/";
const jsFolder = "frontend/assets/js/";
const jsFiles = [
	"iframe.js",
	"iframe.build.js",
	"iframe.axe.js",
	"main.js",
	"main.build.js",
];
const cssFiles = [
	"frontend/assets/css/iframe-background.css",
	"frontend/assets/css/iframe.css",
	"frontend/assets/css/main.css",
	"frontend/assets/css/prism.css",
];
const jsDist = `${buildFolder}js/`;
const cssDist = `${buildFolder}css/`;

gulp.task("build:js", (done) => {
	const promises = [];

	jsFiles.forEach((jsFile) => {
		promises.push(
			new Promise((resolve) => {
				rollup
					.rollup({
						input: `${jsFolder}${jsFile}`,
						plugins: [nodeResolve(), babel(), terser.terser()],
					})
					.then((bundle) => {
						bundle.write({
							dir: jsDist,
							format: "esm",
						});
						resolve();
					})
					.catch((err) => console.error(err));
			})
		);
	});

	return Promise.all(done());
});

gulp.task("build:css", () =>
	gulp
		.src(cssFiles)
		.pipe(
			postcss([
				postcssImport,
				postcssPresetEnv({
					features: {
						"logical-properties-and-values": false,
					},
					browsers:
						"last 2 Chrome versions, last 2 Firefox versions, last 2 Safari versions, last 2 ios versions, last 2 ChromeAndroid versions, last 2 Edge versions",
				}),
				cssnano,
			])
		)
		.pipe(gulp.dest(cssDist))
);

gulp.task("clean", () => {
	return del([`${buildFolder}**/*`]);
});

gulp.task(
	"build",
	gulp.series("clean", gulp.parallel("build:js", "build:css"))
);
