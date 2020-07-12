# Gulp | Curso Web Moderno 2020

## Instruções

Rodar os comandos:
- npm install
- npm install -g gulp-cli

## Anotações

O Gulp é um framework baseado em funçẽs (tarefas - tasks) que automatizam os processos dentro de uma aplicação. Podem ser executados de forma serial ou paralelas.

Flag --series :: O gulp é centrado em tarefas e são todas executadas em paralelo, porém quando temos que dependências da tarefas (uma precisa terminar para outra começar) podemos usar a flag --series para que seja executado em série.

Flag --continue :: indica para continuar a executar as restantes tarefas caso uma dê problema ou deixe de executar.

:: Babel
Transforma um code JavaScript para uma forma mais compatível com todos os browsers.

### 273 - Fundamentos de Gulp - Copiando pastas e arquivos
- - - - - - - - - - - - - - - - - -

// --- basico/gulpfile.js

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

### 276 - Processando JavaScript com Gulp
- - - - - - - - - - - - - - - - - -

// --- javascript/gulpfile.js

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

### 278 - Processando TypeScript com Gulp
- - - - - - - - - - - - - - - - - -

// --- typescript/gulpfile.js

const { series } = require('gulp')
const gulp  = require('gulp')
const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json') // arquivo de config que o TypeScript vai usar

function transformacaoTS(cb) {    
    return tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest('build'))
}

exports.default = series(transformacaoTS)

### 280 - Processando SASS com Gulp
- - - - - - - - - - - - - - - - - -

// --- css/gulpfile.js

const { parallel } = require('gulp')
const gulp = require('gulp')
const sass = require('gulp-sass')
const uglifycss = require('gulp-uglifycss')
const concat = require('gulp-concat')

function transformacaoCSS(cb) {
    return gulp.src('src/sass/index.scss')
        .pipe(sass().on('error', sass.logError)) // convert SCSS to CSS
        .pipe(uglifycss({ "uglifyComments": true })) // minify
        .pipe(concat('estilo.min.css')) // concat in one file
        .pipe(gulp.dest('build/css')) // save to this place
}

function copiarHTML(cb) {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('build'))
}

exports.default = parallel(transformacaoCSS, copiarHTML)

### 282 - Projeto SPA
- - - - - - - - - - - - - - - - - -

#### Estrutura do projeto

// --- spa/package.json

{
  "name": "spa",
  "version": "1.0.0",
  "description": "",
  "main": "gulpfile.js",
  "scripts": {
    "start": "gulp",
    "build": "gulp --production"
  },
  "keywords": [],
  "author": "Cod3r",
  "license": "ISC",
  "devDependencies": {
    "babel-core": "6.26.3",
    "babel-preset-env": "1.6.1",
    "font-awesome": "4.7.0",
    "gulp": "4.0.2",
    "gulp-babel": "7.0.1",
    "gulp-concat": "2.6.1",
    "gulp-htmlmin": "4.0.0",
    "gulp-sass": "4.0.1",
    "gulp-uglify": "3.0.0",
    "gulp-uglifycss": "1.0.9",
    "gulp-watch": "5.0.1",
    "gulp-webserver": "0.9.1"
  }
}

#### Criando a estrutura do build

Em vez de concentrar todo o processo dentro do spa/gulpfile.js vamos dividir em vários arquivos dentro de spa/gulpTasks:

- app.js :: tasks relacionada ao código da app (JS, CSS, HTML)
- deps.js :: dependências externas que a nossa app possa ter (Bootstrap, frameworks, etc)
- servidor.js :: usado apenas para o dev

// --- spa/gulpTasks/deps.js

const gulp = require('gulp')
const uglifycss = require('gulp-uglifycss')
const concat = require('gulp-concat')

function depsCSS() {
    return gulp.src('node_modules/font-awesome/css/font-awesome.css')
        .pipe(uglifycss({ "uglyComments": false }))
        .pipe(concat('deps.min.css'))
        .pipe(gulp.dest('build/assets/css'))
}

function depsFonts() {
    return gulp.src('node_modules/font-awesome/fonts/*.*')
        .pipe(gulp.dest('build/assets/fonts'))
}

module.exports = {
    depsCSS,
    depsFonts
}

// --- spa/gulpTasks/app.js

const gulp = require('gulp')
const babel = require('gulp-babel') // transforma JS para um modo mais compativel
const uglify = require('gulp-uglify')
const sass = require('gulp-sass')
const uglifycss = require('gulp-uglifycss')
const concat = require('gulp-concat')
const htmlmin = require('gulp-htmlmin')

function appHTML() {
    return gulp.src('src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true}))
        .pipe(gulp.dest('build'))
}

function appCSS() {
    return gulp.src('src/assets/sass/index.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(uglifycss({ "uglyComments": true}))
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('build/assets/css'))
}

function appJS() {
    return gulp.src('src/assets/js/**/*.js')
        .pipe(babel({ presets: ['env'] }))
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('build/assets/js'))
}

function appIMG() {
    return gulp.src('src/assets/imgs/**/*.*')
        .pipe(gulp.dest('build/assets/imgs'))
}

// Registro de tasks para disponibilizar as funcoes para uso no gulp (em servidor.js)
gulp.task('appHTML', appHTML) 
gulp.task('appCSS', appCSS) 
gulp.task('appJS', appJS)
gulp.task('appIMG', appIMG)

module.exports = {
    appHTML,
    appCSS,
    appJS,
    appIMG
}

// --- spa/gulpTasks/servidor.js

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

// --- spa/gulpfile.js

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

## Forum

=> Pergunta

Gulp para adicionar apenas CSS utilizado
Dante · Aula 294

Olá professor,

Sabe dizer se existe alguma instrução para o gulp criar um novo arquivo de CSS com apenas os estilos que o HTML está usando? Seria útil, por exemplo, para quando usamos o Bootstrap e normalmente não usamos nem 10% das classes todas existentes no arquivo, deixando assim um monte de "lixo" sendo carregado nas páginas.

Exemplo de um arquivo CSS com 10 estilos:

.estilo1 { ... }

.estilo2 { ... }

.estilo3 { ... }

.estilo4 { ... }

...

.estilo10 { ... }

No HTML eu estaria apenas usando os estilos 1, 2 e 3. Então apenas estes 3 estilos deveriam estar no meu arquivo CSS final gerado com o Gulp.

Obrigado e um grande abraço!

=> Resposta

Jônatas

Olá, pessoal!

Fiquei curioso com a pergunta e fui pesquisar sobre, então me deparei com um artigo (link) que aponta as seguintes ferramentas:

https://github.com/FullHuman/purgecss

https://github.com/purifycss/purifycss

https://github.com/uncss/uncss

Eu só fiz alguns testes básicos online com HTML e CSS nessas ferramentas e funcionaram bem, mas o que achei mais curioso é que teoricamente removem desde CSS em frameworks até CSS injetado por JS (a PurifyCSS parece ser a mais promissora nesse sentido)! E inclusive podem ser implementadas com o Gulp.

Resolvi comentar para caso alguém tenha interesse em aprofundar no assunto e fazer testes com elas.

Espero que seja útil.

Abraços!
