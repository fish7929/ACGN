// 文件名称: publishView.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/26 17:00
// 描    述: 发布页面
define([
    'common/base/base_view',
    'text!module/aboutUs/templates/about_us_view.html',
    'marionette',
    'common/region/switch_view_region',
    'common/views/loginBar',
],function(BaseView, tpl, mn, SwitchViewRegion, LoginBarView){
    return BaseView.extend({
        className : "aboutUsView",
        template : _.template(tpl),
        // key : selector
        ui : {
        },

        //事件添加
        events : {
        },

        regions : {
            LoginBarRegion: {
                el: ".about-us-loginBar-reg",
                regionClass: SwitchViewRegion
            }
        },

        /**初始化**/
        initialize : function(){
            var self = this;
            self._loginBarView = new LoginBarView();
        },

        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){
        },

        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
        },

        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
            var self = this;
            self.regionShow();
        },

        regionShow : function(){
            var self = this;
            self.LoginBarRegion.show(self._loginBarView);
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            var self = this;
            self.LoginBarRegion.hide(self._loginBarView);
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});