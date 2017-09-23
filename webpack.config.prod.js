import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MD5HashPlugin from 'md5-hash-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
    // debug: true, Deprecated in webpack 3
    devtool: 'source-map',
    devServer: {
        noInfo: false
    },
    entry: {
        vendor: path.resolve(__dirname, 'src/vendor'),
        main: path.resolve(__dirname, 'src/index')
    },
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].[chunkhash].js'
    },
    plugins: [
        // Generate an external css file with a hash in the filename.
        new ExtractTextPlugin('[name].[contenthash].css'),

        // Hash the files using MD5 so that their names change when the content changes. Webpack3-friendly
        new MD5HashPlugin(),

        // Use CommonChunkPlugin to create a separate bundle
        // of vendor libraries so that they're cached separately.
        // This needs to be in sync with the entry property.
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),

        // Create HTML file that includes reference to bundled JS
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            inject: true,

            // Properties you define here are available in index.html
            // using htmlWebpackPlugin.options.varName
            trackJSToken: 'f3523acad600468492943f9a9c0eb4d2'
        }),

        // Minify JS
        new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        rules: [
            {test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader']},
            {test: /\.css$/, use: ExtractTextPlugin.extract('css-loader?sourceMap')}
        ]
    }
}
