var gulp = require('gulp');
var sass = require('gulp-sass');

module.exports = function() {
  gulp.task('sass', function () {
    gulp.src('src/styles/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/styles'));
  });
}
