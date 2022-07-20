var gulp = require("gulp");
var browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
var kit = require("gulp-kit-2");
// const fileinclude = require("gulp-file-include");
var gcmq = require("gulp-group-css-media-queries");
var autoprefixer = require("gulp-autoprefixer");
var del = require("del");
var svgSprite = require("gulp-svg-sprite");
  var svgmin = require("gulp-svgmin");
  var cheerio = require("gulp-cheerio");
  var replace = require("gulp-replace");

// sass.compiler = require("node-sass");
gulp.task("clean", function() {
  return del(["dest/**", "!dest", "!dest/img"]);
});
gulp.task("sass", function() {
  return gulp
    .src("./src/styles/**/*.scss")
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(
      autoprefixer({
        
        cascade: false,
      })
      )
    // .pipe(gcmq())
    .pipe(gulp.dest("./dest/css/"))
    .pipe(browserSync.stream());
});


gulp.task("kit", async function() {
  gulp
    .src("./src/*.kit")
    .pipe(kit())
    .pipe(gulp.dest("dest/"))
    .pipe(browserSync.stream());
 
});


// gulp.task("fileinclude", function () {
//   gulp.src("./src/kit/*.html")
//     .pipe(
//       fileinclude({
//         prefix: "@@",
//         basepath: "@file",
//       })
//     )
//     .pipe(gulp.dest("dest/"))
//     .pipe(browserSync.stream());
// });
gulp.task("svg", function () {
  return (
    gulp
      .src("./src/svg/*.svg")
      // minify svg
      .pipe(
        svgmin({
          js2svg: {
            pretty: true,
          },
        })
      )

      // remove all fill, style and stroke declarations in out shapes
      .pipe(
        cheerio({
          run: function ($) {
            $("[fill]").removeAttr("fill");
            $("[stroke]").removeAttr("stroke");
            $("[style]").removeAttr("style");
          },
          parserOptions: { xmlMode: true },
        })
      )
      // cheerio plugin create unnecessary string '&gt;', so replace it.
      .pipe(replace("&gt;", ">"))
      // build svg sprite
      .pipe(
        svgSprite({
          mode: {
            symbol: {
              sprite: "../sprite.svg",
            },
          },
        })
      )

      .pipe(gulp.dest("dest/img/svg/"))
  );
});




gulp.task("serve", function() {
  browserSync.init({
    browser: "Google Chrome Canary",
    notify: false,
    server: "dest/",
  });
  gulp.watch("src/styles/**/*.scss", gulp.series("sass"));
  // gulp.watch("src/kit/**/*.html", gulp.series("fileinclude"));
  gulp.watch("./src/**/*.kit", gulp.series("kit"));
  gulp.watch("./src/svg/*.svg", gulp.series("svg"));
  gulp.watch("dest/*.html").on("change", browserSync.reload);
});

gulp.task("default", gulp.series("serve", "sass"));



