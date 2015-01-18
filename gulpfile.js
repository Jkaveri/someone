var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify = require('gulp-uglify');

var paths = {
  sass: ['./scss/**/*.scss'],
  scripts : [
  './www/js/core.js',
  //serivces
  './www/js/services/*.js',
  './www/js/services.js',
  //controllers
  './www/js/controllers/*.js',
  './www/js/controllers.js',
  //app
  './www/js/app.js'
  ],
  ionicons_fonts:[
    './www/lib/ionicons/fonts/*'
  ],
  ionicons_scss:[
    './www/lib/ionicons/scss/*.scss'
  ]
};

gulp.task('default', ['upgrade-ionicons','sass','scripts']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.scripts,['scripts']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});


gulp.task('scripts', function(){


  gulp.src(paths.scripts)
  .pipe(concat('app.js'))
//  .pipe(uglify())
  .pipe(gulp.dest('./www/dist/'));

});


gulp.task('upgrade-ionicons',function(){
  //copy fonts into ionic fonts.
  gulp.src(paths.ionicons_fonts)
  .pipe(gulp.dest('./www/lib/ionic/fonts/'));

  //copy scss
  gulp.src(paths.ionicons_scss)
  .pipe(gulp.dest('./www/lib/ionic/scss/ionicons/'));
});
