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
            "planning" : "planning", //企划路由
            "planning/:planId" : "planning", //企划路由
            "userCenter" : "userCenter", //用户中心 add by guYY
            "userCenter/:userId" : "userCenter", //用户中心 add by guYY
            "userCenterFans" : "userCenterFans", //用户中心-粉丝 add by guYY
            "userCenterFans/:type/:userId" : "userCenterFans", //用户中心-type=1粉丝列表  type-2关注列表 add by guYY
            "associations" : "Associations", //社团 add by guYY
            "associations/:assoId" : "Associations", //社团 add by guYY
            //同人本详情
            "book/:bookId" : "book",
            //发布页面
            "publish" : "publish",
            //更多优秀插画
            "blogMore" : "blogMore"
        },
        /**当前路由，如果调用返回，返回到指定路由**/
        backRoutes: {

        }
    });
});