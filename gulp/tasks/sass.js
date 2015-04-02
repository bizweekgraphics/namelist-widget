var gulp = require('gulp');
var sass = require('gulp-sass');
var reload = require('browser-sync').reload;

module.exports = function() {
  gulp.task('sass', function () {
    gulp.src('public/styles/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/styles'))
    .pipe(reload({stream: true}));
  });
}
