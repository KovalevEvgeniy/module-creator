const gulp = require('gulp');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const concat = require("gulp-concat");
const minify = require('gulp-uglify');
const rename = require('gulp-rename');
const mocha = require('gulp-mocha');
const log = require('gulplog');
const description = 'src/description.js'

const tmp = function (done) {
	return gulp.src('src/jquery.modulecreator.js')
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(gulp.dest('tmp'))
		.pipe(minify())
		.pipe(rename('jquery.modulecreator.min.js'))
		.pipe(gulp.dest('tmp'));

	done();
};

const dist = function (done) {
	gulp.src([description, 'tmp/jquery.modulecreator.js'])
		.pipe(concat('jquery.modulecreator.js'))
		.pipe(gulp.dest('dist'));

	gulp.src([description, 'tmp/jquery.modulecreator.min.js'])
		.pipe(concat('jquery.modulecreator.min.js'))
		.pipe(gulp.dest('dist'));

	done();
};

const watch = function (done) {
	gulp.watch(['./src/*.*'], gulp.series(tmp, dist));
};

gulp.task('default', gulp.series(tmp, dist, watch));
