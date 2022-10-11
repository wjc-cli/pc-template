const ProxyUrl = 'http://0.0.0:8081'  // 代理地址
module.exports = {
    publicPath: './',
    lintOnSave: false,
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "~@/packages/theme-style/same.scss";`
            },
        }
    },
    devServer: {
        disableHostCheck: true,
        proxy: {
            '/test':  {
                target: ProxyUrl
            },
        },
        port: 9004,
        https: true
    },
    productionSourceMap: false
}
