let gulp = require('gulp');
let htmlPartial = require('gulp-html-partial');
let runElectron = require('gulp-run-electron');
let sass = require('gulp-sass');
let ts = require('gulp-typescript');
let tsNameOf = require('ts-nameof');

const dest = 'dist';

// BUILD TASKS /////////////////////////////////////////////////////////////
gulp.task('build:sass', () => {
    return gulp.src('src/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(dest));
});

gulp.task('build:html', () => {
    return gulp.src('src/**/*.html')
        .pipe(htmlPartial({basePath: 'src/views/partials/'}))
        .pipe(gulp.dest(dest));
});

let tsProject = ts.createProject('tsconfig.json');
gulp.task('build:typescript', () => {
    return gulp.src('src/**/*.ts')
        .pipe(tsNameOf.stream())
        .pipe(tsProject())
        .pipe(gulp.dest(dest));
});

// WATCH TASKS /////////////////////////////////////////////////////////////
gulp.task('watch:sass', () => {
   gulp.watch('src/**/*.scss', ['build:sass'])
});

gulp.task('watch:html', () => {
    gulp.watch('src/**/*.html', ['build:html'])
});

gulp.task('watch:typescript', () => {
    gulp.watch('src/**/*.ts', ['build:typescript'])
});

// MSC TASKS ///////////////////////////////////////////////////////////////
gulp.task('run', () => {
    return gulp.src("dist")
        .pipe(runElectron([], {cwd: "path"}));
});

// COMPOUND TASKS //////////////////////////////////////////////////////////
gulp.task('build', ['build:sass', 'build:html', 'build:typescript']);
gulp.task('watch', ['watch:sass', 'watch:html', 'watch:typescript']);
