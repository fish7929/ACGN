var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./src/scss/base.scss')
    .pipe(sass())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(minifyCss({
          keepSpecialComments: 0
    }))
    .pipe(gulp.dest('./src/www/css/'))
    .on('end', done);
});




