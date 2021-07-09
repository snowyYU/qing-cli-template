'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9529 npm run dev OR npm run dev --port = 9529
const port = process.env.port || process.env.npm_config_port || 9529 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/student_health_monitor/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/dev-api': {
        target: 'http://healthdev.com:19000/gw/',
        pathRewrite: { '^/dev-api': '' },
        changeOrigin: true
      },
      '/tmp-api': {
        target: 'http://healthdev.com:19000/gw/shm/',
        pathRewrite: { '^/tmp-api': '' },
        changeOrigin: true
      },
      '/gw': {
        target: 'http://healthdev.com:19000/',
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}
