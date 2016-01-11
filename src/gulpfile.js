function creatPath(dist) {
    return {
        data: {
            'static': 'static',
            "version": (new Date()).getTime()
        },
        "css": {
            "src": "scss/*.scss",
            "dist": "./../static/css"
        },
        "js": {
            "src": "js/*.js",
            "dist": "./../static/js"
        },
        "json": {
            "src": "json/*.json",
            "dist": "./../static/json"
        },
        "img": {
            "src": "img/*.*",
            "dist": "./../static/img"
        },
        "jade": {
            "src": "jade/*.jade",
            "dist": "./../"
        },
        "watch": './../**/*',
        "port": 3001,
        "host": "127.0.0.1"
    }
}

var config = creatPath('dist')
var opn = require('opn')
var sass = require('gulp-sass')
var gulp = require('gulp')
var jade = require('gulp-jade')
var uglify = require('gulp-uglify')
var base64 = require('gulp-base64')
var connect = require('gulp-connect')
var plumber = require('gulp-plumber')
var changed = require('gulp-changed')
var replace = require('gulp-replace')
var imports = require('gulp-imports')
var imageisux = require('gulp-imageisux')
var browserify = require('gulp-browserify')


gulp.task('css', function() {
    gulp.src(config.css.src)
        .pipe(plumber())
        .pipe(replace('.jpg', '.jpg?__t=' + config.data.version))
        .pipe(replace('.png', '.png?__t=' + config.data.version))
        .pipe(sass({
            'outputStyle': 'compressed'
        }))
        .pipe(changed(config.css.dist))
        .pipe(gulp.dest(config.css.dist))
})

gulp.task('js', function() {
    gulp.src(config.js.src)
        .pipe(plumber())
        .pipe(replace('EB_GET', '//import'))
        .pipe(imports())
        .pipe(changed(config.js.dist))
        .pipe(gulp.dest(config.js.dist))

})


gulp.task('jade', function() {
    gulp.src(config.jade.src)
        .pipe(plumber())
        .pipe(jade({
            pretty: true,
            data: config.data
        }))
        .pipe(replace(/&lt;!--/g, "<!--"))
        .pipe(replace(/--&gt;/g, "-->"))
        .pipe(changed(config.jade.dist))
        .pipe(gulp.dest(config.jade.dist))

})

gulp.task('img', function() {
    gulp.src(config.img.src)
        .pipe(plumber())
        .pipe(changed(config.img.dist))
        .pipe(imageisux(config.img.dist, false))

})

gulp.task('json', function() {
    gulp.src(config.json.src)
        .pipe(plumber())
        .pipe(changed(config.json.dist))
        .pipe(gulp.dest(config.json.dist))

})

gulp.task('connect', function() {
    connect.server({
        root: config.jade.dist,
        livereload: true,
        port: config.port,
        host: config.host
    })
    opn('http://' + config.host + ':' + config.port)
})

gulp.task('watch', function() {
    gulp.watch(config.img.src, ['img'])
    gulp.watch(config.css.src, ['css'])
    gulp.watch(config.js.src, ['js'])
    gulp.watch(config.jade.src, ['jade'])
    gulp.watch(config.json.src, ['json'])
})


gulp.task('creat', function() {
    gulp.start(['img', 'css', 'js', 'jade', 'json', 'watch'])
})


gulp.task('default', ['creat'], function() {
    gulp.start('connect')
    gulp.watch(config.watch, function() {
        gulp.src(config.watch)
            .pipe(connect.reload())
    })
})


gulp.task('release', function(a, b, c) {
    var date = new Date()
    config = creatPath([date.getFullYear(), date.getMonth() + 1, date.getDate()].join(''))
    gulp.start('creat')
})
