//js库配置
//加载所需的依赖包
require.config({
    //开发模式下给地址加动态参数
    //防止缓存
//    urlArgs: "bust=" + (new Date()).getTime(),
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
        },
        masonry :{
            deps : ['jquery'],
            exports : 'jquery'
        }
    },
    paths: {
        jquery: 'vendor/jquery-3.0.0.min',
        underscore: 'vendor/underscore',
        backbone: 'vendor/backbone/backbone',
        marionette : 'vendor/backbone/backbone.marionette',
        text : 'vendor/text',
        swiper : 'vendor/swiper',
        showbox : "common/views/ShowBox",
        giliApi : "lib/gili_api",
        msgbox : "common/views/MsgBox",
        masonry : 'vendor/jquery.masonry'
    },
    waitSeconds: 0
});
//应用程序入口
require([
    'jquery',
    'backbone',
    'router/Backbone.history',
    'module/app/app',
    'module/app/controller',
    'router/AppRouter',
    'text',
    'utils/utils',
    'swiper',
    'showbox',
    'giliApi',
    'msgbox',
    'masonry'
], function($,Backbone, BackboneHistory, app, Controller, AppRouter) {
    //实例化AV
    AV.initialize({appId:"oCjYs9w05WuNmCk6sDblt7hY-gzGzoHsz", appKey:"yaREoDyiyoy5iWV2iWAODk5X"});

    $(document).ready(readyHandle);
    function readyHandle (){
        app.router = new AppRouter({controller:Controller});
        BackboneHistory.start({pushState: false});
        app.history = BackboneHistory;
        app.start();
    }
});