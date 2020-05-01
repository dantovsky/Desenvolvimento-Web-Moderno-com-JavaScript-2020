const gulp = require('gulp')
const webserver = require('gulp-webserver') // https://www.npmjs.com/package/gulp-webserver
const watch = require('gulp-watch')

function servidor() {
    return gulp.src('build')
        .pipe(webserver({
            port: 8080,
            open: true,
            livereload: true
        }))
}

// Funcao que monitora cada tipo de arquivo e gera um novo build somente para a task específica
function monitorarArquivos(cb) {
    watch('src/**/*.html', () => gulp.series('appHTML')())
    watch('src/**/*.scss', () => gulp.series('appCSS')())
    watch('src/**/*.js', () => gulp.series('appJS')())
    watch('src/assets/imgs/**/*.*', () => gulp.series('appIMG')())
    return cb()
}

module.exports = {
    monitorarArquivos,
    servidor
}