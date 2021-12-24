import babel from "gulp-babel";
import cssnano from "cssnano";
import del from "del";
import gulp from "gulp";
import postcss from "gulp-postcss";
import postcssImport from "postcss-import";
import postcssPresetEnv from "postcss-preset-env";
import { rollup } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const buildFolder = "dist/";
const jsFolder = "assets/js/";
const jsFiles = [
  "iframe.js",
  "iframe.build.js",
  "iframe.axe.js",
  "main.js",
  "main.build.js",
];
const cssFiles = [
  "assets/css/iframe-background.css",
  "assets/css/iframe.css",
  "assets/css/main.css",
  "assets/css/prism.css",
];
const jsDist = `${buildFolder}js/`;
const cssDist = `${buildFolder}css/`;

gulp.task("build:js", (done) => {
  const promises = [];

  jsFiles.forEach((jsFile) => {
    promises.push(
      new Promise((resolve) => {
        rollup({
          input: `${jsFolder}${jsFile}`,
          plugins: [nodeResolve(), babel(), terser()],
        }).then((bundle) => {
          bundle.write({
            dir: jsDist,
            format: "esm",
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
