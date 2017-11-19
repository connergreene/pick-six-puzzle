// All used modules.
var gulp = require('gulp');
var babel = require('gulp-babel');
var runSeq = require('run-sequence');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var minifyCSS = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var karma = require('karma').server;
var istanbul = require('gulp-istanbul');
var notify = require('gulp-notify');

// Development tasks
// --------------------------------------------------------------

// Live reload business.
gulp.task('reload', function () {
    livereload.reload();
});

gulp.task('reloadCSS', function () {
    return gulp.src('./browser/css/app.css').pipe(livereload());
});

gulp.task('buildCSS', function () {

    var sassCompilation = sass();
    sassCompilation.on('error', console.error.bind(console));

    return gulp.src('./browser/scss/app.scss')
        .pipe(plumber({
            errorHandler: notify.onError('SASS processing failed! Check your gulp process.')
        }))
        .pipe(sassCompilation)
        .pipe(rename('app.css'))
        .pipe(gulp.dest('./browser/css'));
});

// Composed tasks
// --------------------------------------------------------------

gulp.task('build', function () {

    runSeq(['buildCSS']);
});

gulp.task('default', function () {

    gulp.start('build');

    gulp.src('./browser/app.js')
    .pipe(babel())
    .pipe(gulp.dest('./public'))

    // Run when anything inside of browser/scss changes.
    gulp.watch('browser/scss/**', function () {
        runSeq('buildCSS', 'reloadCSS');
    });

    // Reload when a template (.html) file changes.
    gulp.watch(['browser/**/*.html'], ['reload']);

    livereload.listen();

});

 
