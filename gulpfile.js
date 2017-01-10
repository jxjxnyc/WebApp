var gulp         = require('gulp');
var uglify       = require('gulp-uglify');
var browserSync  = require('browser-sync');
var plumber      = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var sass         = require('gulp-sass');
var jade         = require('gulp-jade');
var imagemin     = require('gulp-imagemin');
var del          = require('del');
var cache        = require('gulp-cache');
var cleanCSS     = require('gulp-clean-css');
var sourcemaps   = require('gulp-sourcemaps');
// sudo npm install gulp-uglify browser-sync gulp-plumber gulp-autoprefixer gulp-sass gulp-jade gulp-imagemin del gulp-cache gulp-clean-css gulp-sourcemaps --save-dev
gulp.task('styles', function(){
  gulp.src('styles/*.scss')
  .pipe(plumber({
      errorHandler: function (err) {
        console.log(err);
        this.emit('end');
      }}))
  .pipe(sourcemaps.init())
  .pipe(sass({indentedSyntax: true}))
  .pipe(autoprefixer({
    browsers: ['last 5 versions'],
    cascade: false}))
  .pipe(cleanCSS())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('build/css'));
});

gulp.task('templates', function(){
  gulp.src('templates/*.jade')
  .pipe(plumber({
      errorHandler: function (err) {
        console.log(err);
        this.emit('end');
      }}))
  .pipe(jade())
  .pipe(gulp.dest('build/'));
});

gulp.task('scripts', function(){
  gulp.src('js/*.js')
  .pipe(plumber({
      errorHandler: function (err) {
        console.log(err);
        this.emit('end');
      }}))
  .pipe(uglify())
  .pipe(gulp.dest('build/js'));
});

gulp.task('images', function(){
  gulp.src('img/**/*')
  .pipe(cache(imagemin({
    optimizationLevel: 3,
    progressive: true,
    interlaced: true})))
  .pipe(gulp.dest('build/img/'));
});

gulp.task('cleanup', function() {
  del(['build/css', 'build/js', 'build/img']);
});

gulp.task('default', ['cleanup'], function() {
  gulp.start('styles', 'templates', 'scripts', 'images');
});

gulp.task('watch', function(){
  gulp.watch('styles/**/*',   ['styles']);
  gulp.watch('templates/*.jade', ['templates']);
  gulp.watch('js/*.js',     ['scripts']);
  gulp.watch('img/**/*',    ['images']);

// init server
  browserSync.init({
    server: {
      proxy: "local.build",
      baseDir: "build/"
    }
  });

  gulp.watch(['build/**'], browserSync.reload);
});
