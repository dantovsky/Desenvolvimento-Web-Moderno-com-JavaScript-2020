const { parallel } = require('gulp')
const gulp = require('gulp')
const sass = require('gulp-sass')
const uglifycss = require('gulp-uglifycss')
const concat = require('gulp-concat')

function transformacaoCSS() {
    return gulp.src('src/sass/index.scss')
        .pipe(sass().on('error', sass.logError)) // convert SCSS to CSS
        .pipe(uglifycss({ "uglifyComments": true })) // minify
        .pipe(concat('estilo.min.css')) // concat in one file
        .pipe(gulp.dest('build/css')) // save to this place
}

function copiarHTML() {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('build'))
}

exports.default = parallel(transformacaoCSS, copiarHTML)