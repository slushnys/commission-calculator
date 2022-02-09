/* eslint-disable @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-return */
const { version } = require('./package.json')

const slsWebpack = require('serverless-webpack')
const webpack = require('webpack')

const path = require('path')

module.exports = {
    entry: slsWebpack.lib.entries,
    target: 'node',
    mode: slsWebpack.lib.webpack.isLocal ? 'development' : 'production',
    optimization: {
        minimize: false,
    },
    performance: {
        hints: false,
    },
    devtool: slsWebpack.lib.webpack.isLocal ? 'eval-source-map' : 'source-map',
    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            configFile: 'tsconfig.json',
                        },
                    },
                ],
            },
        ],
    },
    externals: ({ request }, callback) => {
        if (/^(\.).*/.test(request)) {
            return callback()
        }
        return callback(null, `commonjs ${request}`)
    },
    output: {
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
        sourceMapFilename: '[file].map',
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
    },
    plugins: [
        new webpack.BannerPlugin({ banner: `// ${version}` }),
        new webpack.BannerPlugin({
            banner: "require('source-map-support').install();\n",
            raw: true,
        }),
    ],
}
