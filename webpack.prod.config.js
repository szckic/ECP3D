var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var argv         = require('yargs').argv;
var sourceSrc    = argv.src || 'src';

var getEntry = function() {
  var entryPath = path.resolve(__dirname, sourceSrc);
  var dirs = fs.readdirSync(entryPath);
  var matchs = [], files = {}, filePath;
  dirs.forEach(function (item) {
    matchs = item.match(/(.+)\.html$/);
    if (matchs) {
        filePath = path.resolve(__dirname, sourceSrc + '/js', matchs[1]);
        if (fs.existsSync(filePath + '.jsx')) files[matchs[1]] = filePath;
    }
  });
  return files;
};

var config = {
    devtool: 'source-map',
    // context: path.join(__dirname, 'build', 'js'),

    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    stats: {
        colors: true
    },

    output: {
        path: path.join(__dirname, 'build', 'js'),
        publicPath: '/js/',
        filename: '[name].bundle.js'
    },

    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        })
    ],

    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel'
        }],
        noparse: ['react', 'react-dom']
    }
};

config.entry = getEntry();

module.exports = config;