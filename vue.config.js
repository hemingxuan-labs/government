// const { defineConfig } = require('@vue/cli-service')
// require('babel-polyfill')
// module.exports = defineConfig({
//     transpileDependencies: ['element-ui']
//     // chainWebpack: (config) => {
//     //     config.entry.app = ['babel-polyfill', './src/main.js']
//     // },
//     // proxy: {
//     //     '/api': {
//     //         target: 'http://192.168.0.8:10888/', // 代理目标的基础路径
//     //         changeOrigin: true,
//     //         pathRewrite: { '^/api': '' },
//     //     },
//     // },
// })
module.exports = {
    // 在exports中添加，这里很关键，不配置不行
    transpileDependencies: ['element-ui', 'axios']
    // chainWebpack: (config) => {
    //     config.entry.app = ['babel-polyfill', './src/main.js']
    // },
    // devServer: {},
}
