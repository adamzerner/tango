var gulp = require('gulp'),
    uglify = require('gulp-uglify');

gulp.task('scripts', function() {
  gulp
    .src('**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});
