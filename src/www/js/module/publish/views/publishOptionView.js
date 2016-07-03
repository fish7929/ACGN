// 文件名称: publishView.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/26 17:00
// 描    述: 发布页面
define([
    'common/base/base_view',
    'text!module/publish/templates/publishOptionView.html',
    'marionette',
    'common/region/switch_view_region',
    'common/views/loginBar',
    'module/publish/views/publishView'
],function(BaseView, tpl, mn, SwitchViewRegion, LoginBarView, PublishView){
    return BaseView.extend({
        id : "publishOptContainer",
        template : _.template(tpl),

        // key : selector
        ui : {
            bnTopic : ".btn-topic",
            bnIllustration : ".btn-illustration",
            bnPlanning : ".btn-planning",
            bnBook : ".btn-book"
        },

        //事件添加
        events : {
            "click @ui.bnTopic" : "onBnTopicHandle",
            "click @ui.bnIllustration" : "onBnIllustrationHandle",
            "click @ui.bnPlanning" : "onBnPlanningHandle",
            "click @ui.bnBook" : "onBnBookHandle"
        },

        regions : {
            LoginBarRegion: {
                el: ".publishOpt-loginBar-reg",
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

        onBnTopicHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var param = {};
            param.type = "topic";
            PublishView.show(param);
        },

        onBnIllustrationHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var param = {};
            param.type = "ill";
            PublishView.show(param);
        },

        onBnPlanningHandle : function(){

        },

        onBnBookHandle : function(){

        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});