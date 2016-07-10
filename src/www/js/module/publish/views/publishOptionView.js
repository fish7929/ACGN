// 文件名称: publishView.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/26 17:00
// 描    述: 发布页面
define([
    'common/base/item_view',
    'text!module/publish/templates/publishOptionView.html',
    'marionette',
    'msgbox',
    'module/publish/views/publishView'
],function(ItemView, tpl, mn, MsgBox, PublishView){
    return ItemView.extend({
        id : "publishOptContainer",
        template : _.template(tpl),
        isShow : false,
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


        /**初始化**/
        initialize : function(){
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
            self.isShow = true;
            self.$el.show();
        },

        onBnTopicHandle : function(e){
            e.stopPropagation();
            e.preventDefault();

            if(!gili_data.getCurrentUser()){
                MsgBox.toast(giliConfig.Tip.NOLOGIN, false);
                return
            }
            var param = {};
            param.type = "topic";
            PublishView.show(param);
            app.triggerMethod("hide:publishOptView")
        },

        onBnIllustrationHandle : function(e){
            e.stopPropagation();
            e.preventDefault();

            if(!gili_data.getCurrentUser()){
                MsgBox.toast(giliConfig.Tip.NOLOGIN, false);
                return
            }

            var param = {};
            param.type = "ill";
            PublishView.show(param);
            app.triggerMethod("hide:publishOptView")
        },

        onBnPlanningHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            MsgBox.toast(giliConfig.Tip.UNDEVELOPED, false);
            app.triggerMethod("hide:publishOptView")
        },

        onBnBookHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            MsgBox.toast(giliConfig.Tip.UNDEVELOPED, false);
            app.triggerMethod("hide:publishOptView")
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            var self = this;
            self.isShow = false;
            self.$el.hide();
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});