// 文件名称: home_footer.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/26 15:55
// 描    述: 首页--尾部信息
define([
    'common/base/item_view',
    'text!module/home/templates/home_footer.html',
    'marionette'
],function(ItemView, tpl, mn){
    return ItemView.extend({
        className : "footerContainer",
        template : _.template(tpl),

        // key : selector
        ui : {
        },

        //事件添加
        events : {
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
            this.$el.show();
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            this.$el.hide();
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});