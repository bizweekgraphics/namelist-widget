var gulp = require('gulp');

module.exports = function() {
  gulp.task('fonts', function() {
    return gulp.src(['./src/components/font-awesome/fonts/fontawesome-webfont.*', './src/styles/fonts/*'])
      .pipe(gulp.dest('./public/build/fonts/'));
  });
}