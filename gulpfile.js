var gulp = require('gulp');
var sass = require('gulp-sass');

var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');


gulp.task('buildReact', function(){
	browserify('./public/js/src/app.jsx')
				.transform(reactify)
				.bundle()
				.pipe(source('app.js'))
				.pipe(gulp.dest('public/js/build/'));
});
gulp.task('watchReact', function() {
	gulp.watch("public/js/src/**/*.jsx", ["buildReact"]);
});


gulp.task('buildSass', function() {
    gulp.src('./public/stylesheets/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/stylesheets/css/'));
});
gulp.task('watchSass',function() {
    gulp.watch('./public/stylesheets/sass/**/*.scss',['buildSass']);
});



gulp.task('default', ['buildReact', 'watchReact', 'buildSass', 'watchSass']);