var gulp = require('gulp');
var size = require('gulp-size');

module.exports = function() {
  gulp.task('static', function() {
    gulp.src(['./src/static/**/*'])
      .pipe(gulp.dest('./public/build/static/'))
      .pipe(size())
  })
}
