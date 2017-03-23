module.exports = {
	entry: './src/main.ts',
	output: {
		filename: './webpack-build/orellius-bundle.js'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	module: {
		rules: [{
			test: /\.tsx?$/,
			loader: 'ts-loader',
			exclude: /node_modules/
		},{
			enforce: 'pre',
			test: /\.js$/,
			loader: "source-map-loader"
		},{
			enforce: 'pre',
			test: /\.tsx?$/,
			use: "source-map-loader"
		}]
		
	},
	watch: true,
	watchOptions: {
		ignored: /node_modules/
	},

	devtool: 'inline-source-map'
}
