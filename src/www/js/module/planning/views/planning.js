// 文件名称: login
//
// 创建日期: 2015/01/08
// 描    述: 用户登录
define([
    'common/base/base_view',
    'text!module/planning/templates/planning.html',
    'marionette'
],function(BaseView, tpl, mn) {
    return BaseView.extend({
        id: "planning",
        template : _.template(tpl),
        _mouseLock : false,

        ui : {

        },

        //事件添加
        events : {

        },
        /**初始化**/
        initialize : function(){
            //console.error(1);
        },

        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){

        },
        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
        },

        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
        },

        onBackHandle : function(){
            app.goBack();
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});