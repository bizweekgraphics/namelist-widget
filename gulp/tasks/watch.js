var gulp = require('gulp');

module.exports = function() {

  gulp.watch(['./public/**/*'], ['browser-sync'])

  gulp.watch('./public/styles/*.scss', ['sass']);

}
