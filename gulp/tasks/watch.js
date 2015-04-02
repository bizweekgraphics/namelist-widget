var gulp = require('gulp');

module.exports = function() {

  gulp.watch(['./public/**/*'], ['sass'])

  // gulp.watch('./public/styles/*.scss', ['sass']);

}
