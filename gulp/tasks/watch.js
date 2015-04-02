var gulp = require('gulp');

module.exports = function() {

  gulp.watch(['./src/**/*'], ['static'])

  gulp.watch('./src/styles/*.scss', ['sass']);

}
