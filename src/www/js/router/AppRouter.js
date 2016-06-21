// 文件名称: AppRouter
//
// 创 建 人: chenshy
// 创建日期: 2015/7/22 17:32
// 描    述: AppRouter
define([
    'marionette',
    'router/BaseRouter'
], function (mn, BaseRouter) {
    return BaseRouter.extend({
        initialize: function () {
        },

        /**配置路由**/
        appRoutes: {
            "" : "home",
            "login" : "userLogin",
            "planning" : "planning" //企划路由

        },
        /**当前路由，如果调用返回，返回到指定路由**/
        backRoutes: {

        }
    });
});