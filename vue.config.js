module.exports = {
    runtimeCompiler: true,
    productionSourceMap: false,
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:8000',
                ws: true,
                changeOrigin: true
            }
        }
    },

    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = "Rolling Nexus";
                return args;
            })
    },
    publicPath: process.env.NODE_ENV === 'production' ?
        '/' : '/'

}