var gulp         = require('gulp');
var sass         = require('gulp-sass');
var source       = require('vinyl-source-stream');
var babelify     = require("babelify");
var browserify   = require('browserify');
var autoprefixer = require('gulp-autoprefixer');



gulp.task('buildReact', function(){
	browserify('./public/js/src/app.jsx')
		.transform(babelify, {presets: ["es2015", "react"]})
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
	    .pipe(autoprefixer())
	    .pipe(gulp.dest('./public/stylesheets/css/'));
});
gulp.task('watchSass',function() {
    gulp.watch('./public/stylesheets/sass/**/*.scss',['buildSass']);
});

gulp.task('default', ['buildReact', 'watchReact', 'buildSass', 'watchSass']);