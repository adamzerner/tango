var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var mocha = require('gulp-mocha');
var Server = require('karma').Server;

gulp.task('build-js', function() {
  gulp
    .src('client/src/**/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(concat('build.js'))
    .pipe(gulp.dest('client/src'))
  ;
});

gulp.task('build-css', function() {
  gulp
    .src('client/src/**/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('client/src/assets/css'))
    .pipe(livereload())
  ;
});

gulp.task('mocha', function() {
  gulp
    .src('server/api/**/*.spec.js', { read: false })
    .pipe(mocha())
    .once('error', function () {
        process.exit(1);
    })
    .once('end', function () {
        process.exit();
    })
  ;
});

gulp.task('karma', function(done) {
  new Server({
    configFile: __dirname + '/client/karma/karma.conf.js'
  }, done).start();
});

gulp.task('livereload', function() {
  livereload.listen();
  gulp.watch('client/src/**/*.scss', ['build-css']);
});
