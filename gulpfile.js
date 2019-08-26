const babel = require("gulp-babel");
const cssnano = require("cssnano");
const del = require("del");
const gulp = require("gulp");
const postcss = require("gulp-postcss");
const postcssImport = require("postcss-import");
const postcssPresetEnv = require("postcss-preset-env");
const rollup = require("rollup");
const rollupCommonJs = require("rollup-plugin-commonjs");
const rollupResolve = require("rollup-plugin-node-resolve");
const terser = require("rollup-plugin-terser");

const buildFolder = "dist/";
const jsFolder = "assets/js/";
const jsFiles = ["iframe.js", "iframe.build.js", "main.js", "main.build.js"];
const cssFiles = ["assets/css/iframe.css", "assets/css/main.css"];
const jsDist = `${buildFolder}js/`;
const cssDist = `${buildFolder}css/`;

gulp.task("build:js", done => {
  const promises = [];

  jsFiles.forEach(jsFile => {
    promises.push(
      new Promise(resolve => {
        rollup
          .rollup({
            input: `${jsFolder}${jsFile}`,
            plugins: [
              rollupResolve(),
              rollupCommonJs(),
              babel(),
              terser.terser()
            ]
          })
          .then(bundle => {
            bundle.write({
              file: `${jsDist}/${jsFile}`,
              format: "esm"
            });
            resolve();
          });
      })
    );
  });

  return Promise.all(done());
});

gulp.task("build:css", () =>
  gulp
    .src(cssFiles)
    .pipe(postcss([postcssImport, postcssPresetEnv, cssnano]))
    .pipe(gulp.dest(cssDist))
);

gulp.task("clean", () => {
  return del([`${buildFolder}**/*`]);
});

gulp.task(
  "build",
  gulp.series("clean", gulp.parallel("build:js", "build:css"))
);
