const del = require("del");
const gulp = require("gulp");
const postcss = require("gulp-postcss");

const buildFolder = "dist/";
const cssFiles = ["src/index.css"];

gulp.task("build:css", () =>
  gulp
    .src(cssFiles)
    .pipe(postcss())
    .pipe(gulp.dest(buildFolder))
);

gulp.task("clean", () => {
  return del([`${buildFolder}**/*`]);
});

gulp.task("build", gulp.series("clean", gulp.parallel("build:css")));
