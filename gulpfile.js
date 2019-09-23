var gulp = require('gulp'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync');


sass.compiler = require('node-sass');


//Scss
function scss() {
    return gulp.src('./src/scss/main.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.reload({stream: true}))
}

//Pug
function gulpPug() {
    return gulp.src('./src/pug/pages/*.pug') //адресс
        .pipe(plumber()) //чтоб не крашилось
        .pipe(pug({
            locals: '', // туда часто передают json файлы. Нужна для бэкэнда.
            pretty: true //в одну строчку пишет. чтобы меньше был вес файл
        }))
        .pipe(gulp.dest('./build')) //куда скидывать
        .pipe(browserSync.reload({ stream: true })) //перезагружает страницу браузера
}

//Javascript
function js() {
    return gulp.src('./src/js/*.js')
        .pipe(concat('script.js'))
        .pipe(uglify({toplevel: true}))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.reload({stream: true}))
}

//clean
function clean() {
    return del(['./build/*'])
}

//Fonts
function fonts() {
    return gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./build/fonts'))
        .pipe(browserSync.reload({stream: true}))
}

//Images
function img() {
    return gulp.src('./src/img/*')
        .pipe(gulp.dest('./build/img'))
        .pipe(browserSync.reload({stream: true}))
}

//browser-sync
function watch() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
//Следить за SCSS файлами
    gulp.watch('./src/scss/**/*.scss', scss);
//Следить за JS файлами
    gulp.watch('./src/js/*.js', js);
//При изменении HTML запустить синхронизацию
    gulp.watch('./src/pug/**/*.pug', gulpPug).on('change', browserSync.reload);
}

gulp.task('scss', scss);
gulp.task('js', js);
gulp.task('pug', gulpPug); //создает задачу паг и связывает с функцией
gulp.task('fonts', fonts);
gulp.task('img', img);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean, gulp.parallel(scss, js, gulpPug, fonts, img)));
//Запуск dev проекта
gulp.task('dev', gulp.series('build', 'watch'));