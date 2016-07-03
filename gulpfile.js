var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require("del");
var gulpSequence = require('gulp-sequence');
var replace = require('gulp-replace');
var requirejsOptimize = require('gulp-requirejs-optimize');
var htmlmin = require('gulp-htmlmin');
var destDir = "dist";

gulp.task('default', ['css']);

gulp.task('css', function() {
    gulp.watch("src/scss/**/**", ['sass']);
});

gulp.task('sass', function(done) {
  gulp.src('./src/scss/base.scss')
    .pipe(sass()).on('error', sass.logError)
    .pipe(cleanCSS())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(minifyCss({
          keepSpecialComments: 0
    }))
    .pipe(gulp.dest('./src/www/css/'))
    .on('end', done);
});

gulp.task('release', gulpSequence('clean', ['_release:html','_release:css', '_release:js', '_copyFiles']));

gulp.task('clean', function (done) {
    del([destDir]).then(function () {
        done();
    });
});
gulp.task('_copyFiles', ['_copyImg', '_copyCss', '_copyJs'], function () {
});

gulp.task('_copyImg', function () {
    return gulp.src(["src/www/images?([1])/**"])
        .pipe(gulp.dest(destDir));
});
gulp.task('_copyCss', function () {
    return gulp.src(["src/www/css/**"])
        .pipe(gulp.dest(destDir + "/css/"));
});

gulp.task('_copyJs', function () {
    return gulp.src(["src/www/js/vendor/require.js", "src/www/js/vendor/av.js"], {base: 'src/www/js'})
        .pipe(gulp.dest(destDir + "/js"));
});

gulp.task('_release:html', function () {
    return gulp.src("src/www/index.html")
        .pipe(htmlmin({collapseWhitespace: true}))
//        .pipe(replace('<script src="js/debug.js"></script>', ''))
        .pipe(rename({basename: 'index'}))
        .pipe(gulp.dest(destDir))
});

gulp.task('_release:js', function () {
    return gulp.src("src/www/js/main.js")
        .pipe(requirejsOptimize({
            mainConfigFile: 'require-config.js'
        })).pipe(gulp.dest(destDir + "/js/"));
});

gulp.task('_release:css', function (done) {
    gulp.src('./src/scss/base.scss')
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest(destDir + '/css/'))
        .on('end', done);
});






