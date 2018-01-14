'use strict'


const gulp = require('gulp')
const gutil = require('gulp-util')
const newer = require('gulp-newer')
const imagemin = require('gulp-imagemin')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const deporder = require('gulp-deporder')
const concat = require('gulp-concat')
const stripdebug = require('gulp-strip-debug')
const uglify = require('gulp-uglify')
const fs = require('fs')
let browsersync = false

// Define theme location
let themeDir = 'E:/xampp/htdocs/wordpress/wp-content/themes/' + readPackage().name + '/'
const dir = {
  src: 'src/',
  build: themeDir
}
const php = {
  src: dir.src + 'template/**/*.php',
  build: dir.build
}

const images = {
  src: dir.src + 'images/**/*',
  build: dir.build + 'images/'
}

const css = {
  src: dir.src + 'scss/style.scss',
  watch: dir.src + 'scss/**/*',
  build: dir.build,
  sassOpts: {
    outputStyle: 'nested',
    imagePath: images.build,
    precision: 3,
    errLogToConsole: true
  },
  processors: [
    require('postcss-assets')({
      loadPaths: ['images'],
      basePath: dir.build,
      baseUrl: themeDir
    }),
    require('autoprefixer')({
      browsers: ['last 2 versions', '> 2%']
    }),
    require('css-mqpacker'),
    require('cssnano')
  ]
}

const syncOpts = {
  proxy: 'localhost/wordpress',
  files: dir.build + '**/*',
  open: false,
  notify: true,
  ghostMode: false,
  ui: {
    port: 8001,
    
  }
}
const js = {
  src: dir.src + 'js/**/*',
  build: dir.build + 'js/',
  filename: 'scripts.js'
}

/* Helper functions */
function readPackage () {
  return JSON.parse(fs.readFileSync('./package.json'))  
}

/* Tasks */
gulp.task('browsersync', () => {
  if (browsersync === false) {
    browsersync = require('browser-sync').create();
    browsersync.init(syncOpts);
  }
});

gulp.task('php', () => {
  if (!fs.existsSync(dir.build)) {
    fs.mkdirSync(dir.build)
  }
  console.log('Exporting theme to ' + dir.build)
  return gulp.src(php.src)
  .pipe(newer(php.build))
  .pipe(gulp.dest(php.build))
})

gulp.task('css', ['images'], () => {
  return gulp.src(css.src)
  .pipe(sass(css.sassOpts))
  .pipe(postcss(css.processors))
  .pipe(gulp.dest(css.build))
  .pipe(browsersync ? browsersync.reload({ stream: true }) : gutil.noop())
})

gulp.task('images', () => {
  return gulp.src(images.src)
  .pipe(newer(images.build))
  .pipe(imagemin())
  .pipe(gulp.dest(images.build))
})

gulp.task('js', () => {
  return gulp.src(js.src)
  .pipe(deporder())
  .pipe(concat(js.filename))
  .pipe(stripdebug())
  .pipe(uglify())
  .pipe(gulp.dest(js.build))
  .pipe(browsersync ? browsersync.reload({ stream: true }) : gutil.noop())
})

gulp.task('watch', ['browsersync'], () => {
  gulp.watch(php.src, ['php'], browsersync.reload)
  gulp.watch(images.src, ['images'], browsersync.reload)
  gulp.watch(css.watch, ['css'], browsersync.reload)
  gulp.watch(js.src, ['js'], browsersync.reload)
})

gulp.task('build', ['php', 'css', 'js'])

gulp.task('default', ['build', 'watch'])