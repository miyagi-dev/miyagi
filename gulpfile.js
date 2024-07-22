import path from "node:path";
import cssnano from "cssnano";
import del from "del";
import gulp from "gulp";
import postcss from "gulp-postcss";
import postcssImport from "postcss-import";
import { rollup } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const buildFolder = "dist/";
const jsFolder = "frontend/assets/js/";
const jsFiles = ["iframe.js", "iframe.build.js", "main.js", "main.build.js"];
const cssFiles = [
	"frontend/assets/css/iframe-background.css",
	"frontend/assets/css/iframe.css",
	"frontend/assets/css/main.css",
];
const jsDist = path.join(buildFolder, "js");
const cssDist = path.join(buildFolder, "css");

gulp.task("build:js", (done) => {
	const promises = [];

	jsFiles.forEach((jsFile) => {
		promises.push(
			new Promise((resolve) => {
				rollup({
					input: path.join(jsFolder, jsFile),
					plugins: [nodeResolve(), terser()],
				})
					.then((bundle) => {
						bundle.write({
							dir: jsDist,
							format: "esm",
						});
						resolve();
					})
					.catch((err) => console.error(err));
			}),
		);
	});

	return Promise.all(done());
});

gulp.task("build:css", () =>
	gulp
		.src(cssFiles)
		.pipe(postcss([postcssImport, cssnano]))
		.pipe(gulp.dest(cssDist)),
);

gulp.task("clean", () => {
	return del([`${buildFolder}**/*`]);
});

gulp.task(
	"build",
	gulp.series("clean", gulp.parallel("build:js", "build:css")),
);
