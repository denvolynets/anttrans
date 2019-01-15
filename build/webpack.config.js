const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const WebpackMessages = require('webpack-messages');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const yargs = require('yargs');
const argv = yargs.boolean('disable-compression-plugin').argv;
// Files
const utils = require('./utils');
// Configuration
let consoleStats = {
	all: false,
	modules: true,
	maxModules: 0,
	errors: true,
	warnings: true,
	moduleTrace: true,
	errorDetails: true
};
module.exports = env => {
	let prod = env.NODE_ENV === 'production';
	return {
		mode: prod ? 'production' : 'development',
		devtool: prod ? 'none' : 'inline-source-map',
		context: path.resolve(__dirname, '../src'),
		cache: true,
		entry: {
			app: './app.js'
		},
		output: {
			path: path.resolve(__dirname, '../dist'),
			publicPath: prod ? './' : '/',
			filename: 'assets/js/[name].bundle.js'
		},
		devServer: {
			contentBase: path.resolve(__dirname, '../src'),
			overlay: true,
			compress: true,
			port: 9000,
			disableHostCheck: true,
			historyApiFallback: true,
			stats: consoleStats
		},
		resolve: {
			// extensions: ['.js'],
			// alias: {
			// 	source: path.resolve(__dirname, '../src'),
			// 	images: path.resolve(__dirname, '../src/assets/images')
			// }
			// modules: ['bower_components', 'node_modules'],
			// alias: {
			// 	'Swiper': 'swiper/dist/js/swiper.js'
			// }
		},
		stats: consoleStats,
		performance: {
			hints: false
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					use: [
						{
							loader: 'babel-loader',
							// eslint-disable-next-line no-dupe-keys
							loader: 'eslint-loader',
							options: {
								cacheDirectory: true,
								presets: ['es2015']
							}
						}
					]
				},
				{
					test: /\.css$/,
					use: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: 'css-loader'
					})
				},
				{
					test: /\.(sass|scss)$/,
					use: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
								query: {
									importLoaders: 1,
									sourceMap: !prod
								}
							},
							'sass-loader?sourceMap'
						]
					})
				},
				{
					test: /\.pug$/,
					use: [{
						loader: 'pug-loader'
					}]
				},
				{
					test: /\.svg$/,
					include: [
						path.resolve(__dirname, '../src/assets/images/svg/')
					],
					loader: 'svg-sprite-loader',
					options: {
						extract: true,
						spriteFilename: 'assets/images/svg-sprite/sprite.svg'
					}
				},
				{
					test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
					loader: 'url-loader',
					exclude: [
						path.resolve(__dirname, '../src/assets/images/svg/'),
						path.resolve(__dirname, '../src/assets/fonts/'),
						path.resolve(__dirname, '../dist/assets/svg-sptire/')
					],
					options: {
						emitFile: false,
						limit: 3000,
						name: '../../[path][name].[ext]'
					}
				},
				{
					test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
					include: [
						path.resolve(__dirname, '../src/assets/fonts/')
					],
					loader: 'url-loader',
					options: {
						limit: 5000,
						publicPath: prod ? '../../' : '/',
						name: prod ? '[path][name].[ext]' : '../[path][name].[ext]'
					}
				},
				{
					test: /\.(mp4)(\?.*)?$/,
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: 'assets/videos/[name].[hash:7].[ext]'
					}
				},
				{
					test: /\.(sass|scss)$/,
					loader: 'import-glob-loader'
				}
			]
		},
		plugins: (function(argv) {
			let pluginsComplete = [
				new SpriteLoaderPlugin({
					plainSprite: true,
					spriteAttrs: {
						id: 'svg-sprite'
					}
				}),
				new CopyWebpackPlugin([
					{
						from: '../manifest.json',
						to: 'manifest.json'
					},
					{
						from: '../browserconfig.xml',
						to: 'browserconfig.xml'
					},
					{
						from: 'assets/images',
						to: 'assets/images'
					}
				]),
				new ExtractTextPlugin({
					filename: 'assets/css/[name].bundle.css',
					allChunks: true
				}),
				/*
				  Pages
				*/
				// Desktop page
				new HtmlWebpackPlugin({
					filename: 'index.html',
					template: 'template/index.pug',
					inject: true
				}),
				...utils.pages(env),
				new WebpackBuildNotifierPlugin({
					title: 'RedSoft',
					suppressSuccess: 'initial',
					activateTerminalOnError: true
				}),
				new WebpackMessages({
					name: 'client',
					logger: str => console.log(`\n${str}`)
				}),
				// new StyleLintPlugin(),
				// new ParallelUglifyPlugin({
				// 	cacheDir: path.join('node_modules', '.cache', 'parallel-uglify'),
				// 	sourceMap: !prod,
				// 	uglifyES: {
				// 	}
				// }),
				new webpack.ProvidePlugin({
					'window.jQuery': path.resolve(__dirname, '../node_modules/jquery/dist/jquery'),
					'window.$': path.resolve(__dirname, '../node_modules/jquery/dist/jquery'),
					'jQuery': path.resolve(__dirname, '../node_modules/jquery/dist/jquery'),
					'$': path.resolve(__dirname, '../node_modules/jquery/dist/jquery'),
					'Swiper': path.resolve(__dirname, '../node_modules/swiper/dist/js/swiper')
				}),
				// new HardSourceWebpackPlugin({
				// 	environmentHash: {
				// 		root: process.cwd(),
				// 		directories: ['assets/template', 'assets/fonts', 'assets/libs', 'assets/styles', 'assets/images/temp', 'assets/scripts']
				// 	}
				// })
			];

			if (argv.env.NODE_ENV === 'production') {
				pluginsComplete.push(
					new OptimizeCssAssetsPlugin({
						cssProcessor: require('cssnano'),
						cssProcessorPluginOptions: {
							preset: ['default', { discardComments: { removeAll: true } }]
						},
						canPrint: true
					}),
					new ImageminPlugin({
						pngquant: {
							quality: '70'
						},
						test: /\.(jpe?g|png|gif)$/i
					})
				);
			}
			return pluginsComplete;
		})(argv)
	};
};
