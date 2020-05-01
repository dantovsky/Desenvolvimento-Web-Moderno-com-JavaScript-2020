const gulp = require('gulp')
const { series, parallel } = require('gulp')
// const series = gulp.series

const antes1 = cb => {
    console.log('Tarefa antes1!')
    return cb()
}

const antes2 = cb => {
    console.log('Tarefa antes2!')
    return cb()
}

const fim = cb => {
    console.log('Tarefa fim!')
    return cb()
}

// Funcao que recebe uma callback, que será chamada ao finalizar a funcao
function copiar(cb) {
    // Definir arquivos para um workflow
    // .pipe() aplica transformacoes nos arquivos que definimos como arquivos de entrada para o workflow
    // gulp.src(['pastaA/arquivo1.txt', 'pastaA/arquivo2.txt']) // opcao incluindo arquivo um a um
    gulp.src('pastaA/**/*.txt') // busca todos os arquivos txt dentro de pastaA
    // Exemplos hipoteticos:
    // .pipe(imagePelaMetade())
    // .pipe(imageEmPretoEBranco())
    // .pipe(transformacaoA())
    // .pipe(transformacaoB())
    // .pipe(transformacaoC())
    .pipe(gulp.dest('pastaB'))
    return cb()
}

module.exports.default = series(
    parallel(antes1, antes2),
    copiar,
    fim
)
