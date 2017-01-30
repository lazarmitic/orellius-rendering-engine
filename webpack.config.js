module.exports = {
	entry: './build/main.js',
	output: {
		filename: './webpack-build/orellius-bundle.js'
	},
	watch: true,
	watchOptions: {
		ignored: /node_modules/
	}
}