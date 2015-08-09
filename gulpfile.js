var gulp = require('gulp'),
    uglify = require('gulp-uglify');

gulp.task('scripts', function() {
  gulp
    .src('client/src/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('client/dest'));
});
