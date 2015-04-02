var gulp = require('gulp');
var browserSync = require('browser-sync');

module.exports = function() {
  gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        },
        notify: false,
        open: false
    });
  })
}