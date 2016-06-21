// 文件名称: home
//
// 创建日期: 2015/01/08
// 描    述: 用户登录
define([
    'common/base/base_view',
    'text!module/home/templates/home.html',
    'marionette'
],function(BaseView, tpl, mn) {
    return BaseView.extend({
        id: "homeContent",
        template : _.template(tpl),
        _mouseLock : false,

        ui : {
            bnLogin : ".bnLogin"
        },

        //事件添加
        events : {
            'click @ui.bnLogin' : "onLoginHandle"
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

        onLoginHandle : function(e){
            app.navigate("login", {
                replace: false,
                trigger: true
            });
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            utils.log("home close");
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});