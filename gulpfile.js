var gulp = require('gulp');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var concat = require("gulp-concat");
var minify = require('gulp-uglify');
var rename = require('gulp-rename');
var description = 'src/description.js'

var tmp = function (done) {
	return gulp.src('src/jquery.modulecreator.js')
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(gulp.dest('tmp'))
		.pipe(minify())
		.pipe(rename('jquery.modulecreator.min.js'))
		.pipe(gulp.dest('tmp'));

	done()
}
var finish = function (done) {
	gulp.src([description, 'tmp/jquery.modulecreator.js'])
		.pipe(concat('jquery.modulecreator.js'))
		.pipe(gulp.dest('dist'));

	gulp.src([description, 'tmp/jquery.modulecreator.min.js'])
		.pipe(concat('jquery.modulecreator.min.js'))
		.pipe(gulp.dest('dist'));

	done()
}

gulp.task('default', gulp.series(tmp, finish));
