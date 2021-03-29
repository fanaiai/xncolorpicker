const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    mode:'development',
    entry: {
        xncolorpicker:{
            import:'./src/xncolorpicker.js',
        }
    },
    devtool:'source-map',//追踪错误源码
    // devtool:'eval-source-map',//追踪错误源码
    devServer: {
        port:8082,
        contentBase: './dist',
    },
    plugins: [
        new CleanWebpackPlugin({cleanStaleWebpackAssets:false}),
        // new MiniCssExtractPlugin({
        //     filename: '[name].css',
        //     chunkFilename: '[id].css',
        // }),
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
        new UglifyJsPlugin()
    ],
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        environment: {//输出es5的语法，用于兼容ie
            // The environment supports arrow functions ('() => { ... }').
            arrowFunction: false,
            // The environment supports BigInt as literal (123n).
            bigIntLiteral: false,
            // The environment supports const and let for variable declarations.
            const: false,
            // The environment supports destructuring ('{ a, b } = obj').
            destructuring: false,
            // The environment supports an async import() function to import EcmaScript modules.
            dynamicImport: false,
            // The environment supports 'for of' iteration ('for (const x of array) { ... }').
            forOf: false,
            // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
            module: false,
        }
    },
    optimization: {
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            // `...`,
            // new CssMinimizerPlugin(),
        ],
        // moduleIds: 'deterministic',
        // runtimeChunk: 'single',
        // splitChunks: {
        //     cacheGroups: {
        //         vendor: {
        //             test: /[\\/]node_modules[\\/]/,
        //             name: 'vendors',
        //             chunks: 'all',
        //         },
        //     },
        // },
    },
    module: {
        rules: [
            // {
            //     test: /\.css$/,
            //     use: [MiniCssExtractPlugin.loader, 'css-loader'],
            // },
            {
                test: /\.js$/,
                loader: "babel-loader",
                options:{
                    presets:[
                        ['babel-preset-env', {
                        targets: {
                            browsers: ['> 1%']
                        },
                        debug:false
                    }]
                    ]
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            // {
            //     test: /\.(png|svg|jpg|jpeg|gif)$/i,
            //     type: 'asset/resource',
            //     generator: {
            //         filename: '[name][ext]'
            //     }
            // },
            {
                test: /\.(jpg|png|gif|svg)$/i,  //i表示忽略图片格式大小写，例如.PNG
                use: [{
                    loader: 'url-loader',  // url-loader依赖于file-loader所以这两个包都需要下载
                    options:{
                        limit: 10*1024, //如果图片小于10k，就使用base64处理，
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
};
