'use strict';

var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
// var reload       = browserSync.reload;
var less         = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var cssnano      = require('gulp-cssnano');
var plumber      = require('gulp-plumber');
var clean        = require('gulp-clean');
var imagemin     = require('gulp-imagemin');
var htmlmin      = require('gulp-htmlmin');
var pngquant     = require('imagemin-pngquant');
var changed      = require('gulp-changed');
var changeInPlace= require('gulp-changed-in-place');
var replace      = require('gulp-replace');
var uglify       = require('gulp-uglify');
var sourcemaps   = require('gulp-sourcemaps');
var runSequence  = require('run-sequence');
var streamqueue  = require('streamqueue');
var concat       = require('gulp-concat');
var inline       = require('gulp-inline-txt');
var argv         = require('yargs').argv;
var rev          = require('ldl_rev');
var revCollector = require('ldl_rev_collector');
var cdn          = require('ldl_oss_cdn');
var cdnReplace   = require('ldl_cdn_replace');
var sourceSrc    = argv.src || 'src';

var gulpWebpack  = require('webpack-stream');
var webpack      = require('webpack');
var useReact     = argv.react;

var cdnDir       = argv.cdndir || '_'+ +new Date;

gulp.task('reactServer', ['build'], function() {
    var devConfig    = require('./webpack.dev.config.js');
    var compiler = webpack(devConfig);

    browserSync.init({
        notify: false,
        server: {
            baseDir: 'build',
            middleware: [
                require("webpack-dev-middleware")(compiler, {
                    publicPath: devConfig.output.publicPath,
                    stats: {
                        colors: true
                    }
                }),
                require("webpack-hot-middleware")(compiler)
            ]
        },
        files: [
            './build/**',
            '!./build/js/*.js'
        ]
    });

    gulp.watch(sourceSrc + "/css/**", ['css']);
    gulp.watch(sourceSrc + "/other/**", ['other']);
    gulp.watch(sourceSrc + "/images/**", ['img']);
    gulp.watch(sourceSrc + "/*.html", ['html']);
    gulp.watch(sourceSrc + "/js/lib/**", ['copyLib']);
    gulp.watch([sourceSrc + '/*', '!' + sourceSrc + '/*.html'], ['copyRootFiles']);

    gulp.watch(sourceSrc + "/tpl/**/*.{css, less}", ['css']);
    gulp.watch(sourceSrc + "/tpl/**/*.html", ['html']);
    gulp.watch(sourceSrc + "/tpl/**/*.js", ['copyLib']);
});

gulp.task('server', ['build'], function() {
    browserSync.init({
        notify: false,
        server: {
            baseDir: 'build',
        },
        open: true,
        logFileChanges: false,
        files: [
            './build/**',
            '!./build/*.html'
        ]
    });

    gulp.watch([sourceSrc + "/css/**",sourceSrc + "/tpl/**/*.{css, less}"] , ['css']);
    gulp.watch(sourceSrc + "/other/**", ['other']);
    gulp.watch([sourceSrc + '/*', '!' + sourceSrc + '/*.html'], ['copyRootFiles']);

    if (argv.es6) {
        gulp.watch(sourceSrc + "/js/*.js", ['es6']);
        gulp.watch(sourceSrc + "/js/lib/**/*.js", ['copyLib']);
    }

    if (['staging', 'prod'].indexOf(argv.process) > -1) {
        gulp.watch(sourceSrc + "/images/**", ['miniImg']);
        gulp.watch([sourceSrc + "/*.html", sourceSrc + "/tpl/**/*.html"], ['miniHtml']);
        !argv.es6 && gulp.watch([sourceSrc + "/js/**", sourceSrc + "/tpl/**/*.js"], ['miniJs']);
    } else {
        gulp.watch(sourceSrc + "/images/**", ['img']);
        gulp.watch([sourceSrc + "/*.html", sourceSrc + "/tpl/**/*.html"], ['html']);
        !argv.es6 && gulp.watch([sourceSrc + "/js/**", sourceSrc + "/tpl/**/*.js"], ['js']);
    }
});

gulp.task('css', function() {
    return streamqueue({ objectMode: true },
            gulp.src(sourceSrc + '/css/**/*.css')
                .pipe(inline())
                .pipe(changeInPlace({firstPass: true}))
                .pipe(plumber()),

            gulp.src(sourceSrc + '/css/**/*.less')
                .pipe(inline())
                .pipe(changeInPlace({firstPass: true}))
                .pipe(plumber())
                .pipe(less()))
        .pipe(autoprefixer({
            browsers: ['last 3 versions', '> 1%']
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('./build/css'));
});

gulp.task('js', function() {
    var curEnv = argv.process || 'test';
    return streamqueue({ objectMode: true },
            gulp.src([sourceSrc + '/js/lib/common.js', sourceSrc + '/js/lib/env.js'])
            .pipe(replace('<%=curEnv%>', curEnv))
            .pipe(concat('./lib/common.js')),
            gulp.src([sourceSrc + '/js/**/*.js', '!' + sourceSrc + '/js/lib/env.js', '!' + sourceSrc + '/js/lib/common.js'])
        )
        .pipe(inline())
        .pipe(changeInPlace({firstPass: true}))
        // .pipe(changed('./build/js'))
        .pipe(gulp.dest('./build/js'));
});

gulp.task('img', function() {
    return gulp.src(sourceSrc + '/images/**/*.{png,jpg,gif,ico,webp,svg}')
        .pipe(changed('./build/images'))
        .pipe(gulp.dest('./build/images'));
});

gulp.task('html', function() {
    return gulp.src(sourceSrc + '/*.html')
        .pipe(inline())
        .pipe(changeInPlace({firstPass: true}))
        .pipe(gulp.dest('build'));
});

gulp.task('other', function() {
    return gulp.src(sourceSrc + '/other/**')
        .pipe(changed('build'))
        .pipe(gulp.dest('build/other'));
});

// 压缩压缩
gulp.task('miniJs', function() {
    var curEnv = argv.process || 'test';
    return streamqueue({ objectMode: true },
            gulp.src([sourceSrc + '/js/lib/common.js', sourceSrc + '/js/lib/env.js'])
            .pipe(replace('<%=curEnv%>', curEnv))
            .pipe(concat('./lib/common.js'))
            .pipe(inline())
            .pipe(plumber())
            .pipe(uglify()),

            gulp.src([sourceSrc + '/js/**/*.js', '!' + sourceSrc + '/js/lib/env.js', '!' + sourceSrc + '/js/lib/common.js', '!' + sourceSrc + '/js/**/*.min.js'])
            .pipe(inline())
            .pipe(plumber())
            .pipe(uglify()),

            // min文件不做inline
            gulp.src([sourceSrc + '/js/**/*.min.js'])
        )
        // .pipe(changed('./build/js'))
        .pipe(changeInPlace({firstPass: true}))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('map'))
        .pipe(gulp.dest('./build/js'));
});

gulp.task('miniImg', function() {
    return gulp.src(sourceSrc + '/images/**/*.{png,jpg,gif,ico，svg}')
        .pipe(changed('./build/images'))
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true,
            multipass: true,
            use: [pngquant()]
                // progressive: true,
                // use: [pngquant({quality: '65-80'})]
        }))
        .pipe(gulp.dest('./build/images'));
});

gulp.task('miniHtml', function() {
    return gulp.src(sourceSrc + '/*.html')
        .pipe(inline())
        // .pipe(changed('./build'))
        .pipe(changeInPlace({firstPass: true}))
        .pipe(plumber())
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            removeEmptyAttributes: true,
            minifyJS: true,
            minifyCSS: true
        }))
        .pipe(gulp.dest('build'));
});

// md5
gulp.task('verCss', function() {
    return gulp.src('build/css/**')
        .pipe(rev())
        .pipe(gulp.dest('build/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('build/ver/css'));
});
gulp.task('verJs', function() {
    return gulp.src('build/js/**')
        .pipe(rev())
        .pipe(gulp.dest('build/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('build/ver/js'));
});
gulp.task('verImg', function() {
    return gulp.src('build/images/**')
        .pipe(rev())
        .pipe(gulp.dest('build/images'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('build/ver/images'));
});
gulp.task('revHtml', function() {
    return gulp.src(['build/ver/**/*.json', 'build/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('build'));
});
gulp.task('revCss', function() {
    return gulp.src(['build/ver/**/*.json', 'build/css/**/*.css'])
        .pipe(revCollector())
        .pipe(gulp.dest('build/css'));
});

gulp.task('build', ['clean'], function(done) {
    var steps;
    if (['staging', 'prod'].indexOf(argv.process) > -1) {
        steps = ['css', 'miniJs', 'miniHtml', 'miniImg', 'other', 'copyRootFiles'];
        if (argv.noimg) steps.splice(3, 1, 'img');

        if (argv.es6) steps.splice(1, 1, 'es6', 'copyLib');
        else if (useReact) steps.splice(1, 0, 'react');

        argv.norev ?
            runSequence(steps, done) :
            runSequence(steps, ['verJs', 'verCss', 'verImg'], ['revHtml', 'revCss'], ['cleanVer'],
                done);
    } else {
        steps = ['css', 'js', 'html', 'img', 'other', 'copyRootFiles'];
        if (argv.es6) steps.splice(1, 1, 'es6', 'copyLib');
        else if (useReact) steps.splice(1, 0, 'react');
        runSequence(steps, done);
    }
});

gulp.task('copyLib', function() {
    var curEnv = argv.process || 'test';
    return streamqueue({ objectMode: true },
            gulp.src([sourceSrc + '/js/lib/common.js', sourceSrc + '/js/lib/env.js'])
            .pipe(replace('<%=curEnv%>', curEnv))
            .pipe(concat('common.js')),

            gulp.src([sourceSrc + '/js/lib/**/*.js', '!' + sourceSrc + '/js/lib/env.js', '!' + sourceSrc + '/js/lib/common.js']))
        .pipe(inline())
        .pipe(changeInPlace({firstPass: true}))
        // .pipe(changed('./build/js/lib'))
        .pipe(gulp.dest('./build/js/lib'));
});

gulp.task('copyRootFiles', function() {
    return gulp.src([sourceSrc + '/*', '!' + sourceSrc + '/*.html'])
        .pipe(inline())
        .pipe(changeInPlace({firstPass: true}))
        .pipe(gulp.dest('./build'));
});

gulp.task('es6', function() {
    var config = require('./webpack.es6.config.js');
    if (['staging', 'prod'].indexOf(argv.process) > -1) {
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                }
            })
        );
        config.devtool = 'source-map';
    }
    return gulp.src(sourceSrc + '/js/index.js')
        .pipe(plumber())
        .pipe(gulpWebpack(config))
        .pipe(gulp.dest('./build/js'));
});

gulp.task('react', function() {
    var prodConfig   = require('./webpack.prod.config.js');
    return gulp.src(sourceSrc + '/js/index.jsx')
        .pipe(plumber())
        .pipe(gulpWebpack(prodConfig))
        .pipe(gulp.dest('./build/js'));
});

gulp.task('clean', function() {
    return gulp.src(['build/*', '!build/sftp-config.json'], {
            read: false
        })
        .pipe(clean({
            force: true
        }));
});

gulp.task('cleanVer', function() {
    return gulp.src('build/ver/**', {
            read: false
        })
        .pipe(clean({
            force: true
        }));
});

//部署
//默认部署到测试环境
gulp.task('deploy', function() {
    var sftp = require('gulp-sftp');
    var config;
    switch (argv.process) {
        case 'staging':
            config = {
                host: '',
                remotePath: '',
                user: '',
                pass: ''
            };
            break;
        case 'prod':
            config = {
                host: '',
                remotePath: '',
                user: '',
                pass: ''
            };
            break;
        default:
            config = {
                host: '',
                remotePath: '',
                user: '',
                pass: ''
            };
    }

    return gulp
        .src(['./build/**', '!./build/sftp-config.json'])
        .pipe(sftp(config));
});

gulp.task('cdnDeploy', function() {
    var cdnBucket = argv.bucket || 'ldlpic';
    return gulp
        .src(['./build/**', '!./build/sftp-config.json', '!./build/*.html'])
        .pipe(cdn({
            dir: cdnDir,
            bucket: cdnBucket,
            region: 'oss-cn-hangzhou',
            accessKeyId: 'tfhzlKOBNY86Aoff',
            accessKeySecret: 'KQBbsLm6KQUfTYwdsnYGTeynmbiCsm'
        }))
});

gulp.task('cdnReplace', function() {
    var cdn = argv.cdn || '//ldlpic.oss-cn-hangzhou.aliyuncs.com/';

    return gulp.src(['./build/*.html', './build/**/*.css'])
        .pipe(cdnReplace({
            dir: cdnDir,
            root: {
                js: cdn,
                image: cdn,
                css: cdn
            }
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('cdnClean', function() {
    return gulp.src(['./build/*', '!./build/*.html', '!./build/sftp-config.json'], {
            read: false
        })
        .pipe(clean({
            force: true
        }))
});

gulp.task('buildCdn', function(done) {
    runSequence(['build'], ['cdnDeploy'], ['cdnReplace'], ['cdnClean'], done);
});