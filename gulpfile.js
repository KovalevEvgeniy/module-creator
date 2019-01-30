var gulp = require('gulp');
var plumber = require('gulp-plumber');
var concat = require("gulp-concat");
var minify = require('gulp-uglify');
var rm = require( 'gulp-rm' )

gulp.task('minify', function () {
	gulp.src('src/jquery.modulecreator.js')
	.pipe(minify())
	.pipe(gulp.dest('dist'));
});

gulp.task('concat', function () {
	gulp.src([
		'src/description.js',
		'dist/jquery.modulecreator.js'
	])
	.pipe(concat('jquery.modulecreator.min.js'))
	.pipe(gulp.dest('dist'));

	gulp.src('dist/jquery.modulecreator.js')
	.pipe(rm());
});

gulp.task('default', ['minify', 'concat']);
