var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var argv         = require('yargs').argv;
var sourceSrc    = argv.src || 'src';

var getEntry = function() {
    var entryPath = path.resolve(__dirname, sourceSrc);
    var dirs = fs.readdirSync(entryPath);
    var matchs = [], files = {}, filePath;
    dirs.forEach(function(item) {
        matchs = item.match(/(.+)\.html$/);
        if (matchs) {
            filePath = path.resolve(__dirname, sourceSrc + '/js', matchs[1]);
            if (fs.existsSync(filePath + '.js')) files[matchs[1]] = filePath;
        }
    });
    return files;
};

var config = {
    devtool: '#eval-source-map',
    // context: path.join(__dirname, 'build', 'js'),

    resolve: {
        extensions: ['', '.js']
    },

    output: {
        path: path.join(__dirname, 'build', 'js'),
        publicPath: '/js/',
        filename: '[name].js'
    },

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin()
    ],

    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'stage-0']
            },
            babelrc: false
        }]
    }
}

config.entry = getEntry();

module.exports = config;