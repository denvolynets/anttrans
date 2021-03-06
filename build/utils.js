exports.pages = function(env) {
	const HtmlWebpackPlugin = require('html-webpack-plugin');
	const fs = require('fs');
	const path = require('path');
	const viewsFolder = path.resolve(__dirname, '../src/template/pages');

	var pages = [];

	fs.readdirSync(viewsFolder).forEach(view => {
		const viewName = view.split('.')[0];

		const options = {
			filename: `${viewName}.html`,
			template: `template/pages/${view}`,
			inject: true
		};
		console.log(env.NODE_ENV);
		if (env.NODE_ENV === 'development') {
			options.minify = {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
			};
		}

		pages.push(new HtmlWebpackPlugin(options));
	});

	return pages;
};
