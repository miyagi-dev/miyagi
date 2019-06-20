const babel = require("gulp-babel");
const del = require("del");
const gulp = require("gulp");
const postcss = require("gulp-postcss");
const rollupResolve = require("rollup-plugin-node-resolve");
const rollupCommonJs = require("rollup-plugin-commonjs");
const rollup = require("rollup");
const terser = require("rollup-plugin-terser");

const buildFolder = "dist/";
const jsFolder = "assets/js/";
const jsFiles = ["iframe.js", "main.js"];
const cssFiles = ["assets/css/iframe.css", "assets/css/main.css"];
const jsDist = `${buildFolder}js/`;
const cssDist = `${buildFolder}css/`;

gulp.task("build:js", () => {
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

  return Promise.all(promises);
});

gulp.task("build:css", () =>
  gulp
    .src(cssFiles)
    .pipe(postcss())
    .pipe(gulp.dest(cssDist))
);

gulp.task("clean", () => {
  return del([`${buildFolder}**/*`]);
});

gulp.task(
  "build",
  gulp.series("clean", gulp.parallel("build:js", "build:css"))
);
