/**
 * Created by LaBestia on 31.05.2017.
 */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var browserSync = require("browser-sync");
reload = browserSync.reload;

var config = {
    server: { baseDir: "./build" },
    //tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "LaBestia"
};

gulp.task('build:js', function()
{
    gulp.src('src/js/**/*.js')
        //.pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe(reload({stream: true}));
});

gulp.task('build:html', function()
{
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('build'))
        .pipe(reload({stream: true}));
});

gulp.task('build:json', function()
{
    gulp.src('src/**/*.json')
        .pipe(gulp.dest('build'))
        .pipe(reload({stream:true}));
});

gulp.task('build:resources', function()
{
    gulp.src('src/resources/**/*.*')
        .pipe(gulp.dest('build/resources'))
        .pipe(reload({stream:true}));
});

gulp.task('build', ['build:html', 'build:js', 'build:json', 'build:resources']);

gulp.task('watch', function()
{
    watch('src/**/*.html', function ()
    {
        gulp.start('build:html');
    });
    watch('src/js/**/*.js', function ()
    {
        gulp.start('build:js');
    });
    watch('src/**/*.json', function ()
    {
        gulp.start('build:json');
    });
});

gulp.task('webserver', function ()
{
    browserSync(config);
});

gulp.task('default', ['build', 'webserver', 'watch']);