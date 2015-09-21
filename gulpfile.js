var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel');

gulp.task('default', ['compile'], function() {
    gulp.watch('src/*.js', ['compile']);
});

gulp.task('compile', function () {
    return gulp.src('src/canvasSequence.js')
        .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dist'));
});