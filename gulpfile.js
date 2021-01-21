var gulp = require('gulp');
var concat = require('gulp-concat'); //合并文件
var rename = require('gulp-rename'); //文件重命名
var uglify = require('gulp-uglify'); //js压缩
var minifycss = require('gulp-minify-css'); //css压缩

/**
 * 压缩js(css压缩原理类同)
 * 解压文件路径： ['./js/index.js'] js多个文件进行压缩
 * 解出文件路径： ./js
 */
gulp.task('minifyjs', function() {
    return gulp.src(['./dist/xncolorpicker.js']) //压缩多个文件
        // .pipe(concat('index.js')) //合并js
        .pipe(gulp.dest('./dist')) //输出
        .pipe(rename({ suffix: '.min' })) //重命名
        .pipe(uglify()) //压缩
        .pipe(gulp.dest('./dist')); //输出
});
