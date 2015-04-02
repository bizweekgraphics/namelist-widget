var gulp = require('gulp');

module.exports = function() {
  gulp.task('static', function() {
    gulp.src(['./src/**/*'])
      .pipe(gulp.dest('./public/'))
  })
}
