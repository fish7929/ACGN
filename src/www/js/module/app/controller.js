// 文件名称: controller.js
// 描    述: app总控制器，只能导入控制器
define([
    'module/home/controller',
    'module/login/controller'
],function(){
    var controllers = {
    };

    for(var i = 0;i < arguments.length; i++){
        _.extend(controllers,arguments[i]);
    }

    return controllers;
});