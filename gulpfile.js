let gulp = require('gulp');
let htmlPartial = require('gulp-html-partial');
let sass = require('gulp-sass');
let ts = require('gulp-typescript');

const dest = 'dist';

gulp.task('build:css', () => {
    return gulp.src('src/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(dest));
});

gulp.task('build:html', () => {
    return gulp.src('src/**/*.html')
        .pipe(htmlPartial({basePath: 'src/views/partials/'}))
        .pipe(gulp.dest(dest));
});

gulp.task('build:typescript', () => {
    let tsProject = ts.createProject('tsconfig.json');
    return gulp.src('src/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest(dest));
});

gulp.task('build:re')

gulp.task('build', ['build:css', 'build:html', 'build:typescript']);
