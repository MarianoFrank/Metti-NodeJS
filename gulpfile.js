import gulp from "gulp";
const { src, dest, watch, parallel } = gulp;

// CSS
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import sourcemaps from "gulp-sourcemaps";
import concat from "gulp-concat";
//import tailwindcss from "tailwindcss";

//WebPack
import webpack from "webpack-stream";
import webpackConfig from "./webpack.config.js";

const paths = {
  css: "src/css/**/*.css",
  js: "src/js/**/*.js",
  php: "../**/*.php",
};


function compileCss() {
  return src(paths.css)
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(concat("style.css"))
    .pipe(sourcemaps.write("."))
    .pipe(dest("../"));
}

// function compileTailwind() {
//   return src("src/css/tailwind.css")
//     .pipe(postcss([tailwindcss(), autoprefixer(), cssnano()]))
//     .pipe(concat("tailwind.css"))
//     .pipe(dest("../"));
// }

function compileJS() {
  return webpack(webpackConfig).pipe(dest("../js"));
}

function watchs(done) {
  // watch(paths.php, compileTailwind);
  watch(paths.css, compileCss);
  watch(paths.js, compileJS);
  done();
}

//para este proyecto no usare tailwind
const dev = parallel(
  compileCss,
  // compileTailwind,
  compileJS,
  watchs
);

export { dev };
