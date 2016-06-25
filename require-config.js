// 文件名称: require-config.js
//
// 创 建 人: fishYu
// 创建日期: 2016/6/22 22:17
// 描    述: require-config
var requirejs={
    baseUrl: "src/www/js",
    shim: {
        underscore: {
            exports : '_'
        },
        backbone: {
            deps : [
                'underscore',
                'jquery'
            ],
            exports : 'Backbone'
        },
        marionette: {
            exports: 'Backbone.Marionette',
            deps: ['jquery','backbone']
        }
	},
	paths: {
        jquery: 'vendor/jquery-3.0.0.min',
        underscore: 'vendor/underscore',
        backbone: 'vendor/backbone/backbone',
        marionette : 'vendor/backbone/backbone.marionette',
        text : 'vendor/text',
        swiper : 'vendor/swiper'
	}
}