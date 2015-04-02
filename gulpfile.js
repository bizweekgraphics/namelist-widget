//For production, uncomment line 30 in gulp/tasks/browserify.js
//To include bower stylesheets add them to includePaths array in gulp/tasks/sass.js

var gulp = require('./gulp')([
  'browser-sync',
  'html',
  'watch',
  'browserify',
  'vendor',
  'sass',
  'jshint',
  'fonts',
  'images',
  'static'
])

gulp.task('default', ['static', 'sass', 'browser-sync', 'watch']);
