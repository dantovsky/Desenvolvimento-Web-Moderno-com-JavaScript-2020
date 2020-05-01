const { series } = require('gulp')
const gulp = require('gulp')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel') // transforma JS para um modo mais compativel

// Funcao que recebe uma callback e a chama ao final
function transformacaoJS(cb) {
    // Ao inves de retornar a callback, podemos retornar já a execucao do gulp
    return gulp.src('src/**/*.js')
        .pipe(babel({
            comments: false,
            presets: ["env"]
        }))
        .pipe(uglify())
        .on('error', err => console.log(err))
        .pipe(concat('codigo.min.js'))
        .pipe(gulp.dest('build'))
    // return cb()
}

function fim(cb) {
    console.log('Fim!!!')
    return cb()
}

exports.default = series(transformacaoJS, fim)