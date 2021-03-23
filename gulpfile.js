const gulp = require ('gulp'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    cleanCss = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify');

const browserSync = require('browser-sync').create()

sass.compiler = require('node-sass');

const paths = {
    src: {
        scss: "./src/scss/**/*.scss",
        js: "./src/js/*.js",
        img: './src/img/**/*'
    },
    dist: {
        css: "./dist/css/",
        js: "./dist/js/",
        img: "./dist/img/",
        self: "./dist/"
    }
};

// /*** FUNCTIONS ***/

const distJS = () => (
    gulp.src(paths.src.js)
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.dist.js))
        .pipe(browserSync.stream())
);

const distCSS = () => (
    gulp.src(paths.src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 3 versions'] }))
        .pipe(cleanCss({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.dist.css))
        .pipe(browserSync.stream())
);

const distIMG = () => (
    gulp.src(paths.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dist.img))
        .pipe(browserSync.stream())
);

const cleanDist = () => (
    gulp.src(paths.dist.self, {allowEmpty: true})
        .pipe(clean())
);

const watcher = () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch(paths.src.scss, distCSS).on("change", browserSync.reload);
    gulp.watch(paths.src.js, distJS).on("change", browserSync.reload);
    gulp.watch(paths.src.img, distIMG).on("change", browserSync.reload);
};

const dist = gulp.series(
    distCSS,
    distJS,
);

// /*** TASKS ***/

gulp.task("clean", cleanDist);
gulp.task("buildCSS", distCSS);
gulp.task("buildJS", distJS);

gulp.task(
    "default",
    gulp.series(cleanDist, gulp.parallel(distIMG, dist), watcher)
);
