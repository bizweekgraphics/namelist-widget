var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

module.exports = function() {
  gulp.task('jshint', function() {
    gulp.src(['./src/**/*.js', '!./src/scripts/vendor/*.js','!./src/components/**/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter(stylish))
  });
}