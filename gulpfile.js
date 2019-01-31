var gulp = require('gulp');
var plumber = require('gulp-plumber');
var concat = require("gulp-concat");
var minify = require('gulp-uglify');
var rm = require( 'gulp-rm' )

gulp.task('default', function () {
	gulp.src('src/jquery.modulecreator.js')
		.pipe(minify())
		.pipe(gulp.dest('tmp'));

	gulp.src([
			'src/description.js',
			'tmp/jquery.modulecreator.js'
		])
		.pipe(concat('jquery.modulecreator.min.js'))
		.pipe(gulp.dest('dist'));

	gulp.src([
			'src/description.js',
			'src/jquery.modulecreator.js'
		])
		.pipe(concat('jquery.modulecreator.js'))
		.pipe(gulp.dest('dist'));
});
