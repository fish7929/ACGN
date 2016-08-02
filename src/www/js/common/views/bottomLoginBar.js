// 文件名称: publishView.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/26 17:00
// 描    述: 发布页面
define([
    'common/base/base_view',
    'text!common/templates/bottomLoginBar.html',
    'showbox'
],function(BaseView, tpl, ShowBox){
    return BaseView.extend({
        className : "bottomLoginBar",
        template : _.template(tpl),
        // key : selector
        ui : {
            btnLogin : ".login-button",
            btnRegister : ".register-button",
            btnLoginQQ : ".login-qq",
            btnLoginWB : ".login-wb"
        },

        //事件添加
        events : {
            "click @ui.btnLogin" : "onLoginHandler",
            "click @ui.btnRegister" : "onRegisterHandler",
            "click @ui.btnLoginQQ" : "onLoginQQHandler",
            "click @ui.btnLoginWB" : "onLoginWBHandler"
        },

        /**初始化**/
        initialize : function(){
            var self = this;
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
            self.$el.show();
        },

        onLoginHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            ShowBox.login();
        },

        onRegisterHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            ShowBox.register();
        },

        onLoginQQHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            window.open("https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=101326661&redirect_uri="+encodeURIComponent("http://www.gilieye.com/qq.html?platform=qq&url="+ window.location.href +"&v="+ Math.random()), "_self")
        },

        onLoginWBHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var _url = "https://api.weibo.com/oauth2/authorize?client_id=2720439896&client_secrect=49df09be0f1fc7e4ef082a23ac385e97&response_type=code&redirect_uri=http://www.gilieye.com/weibo.html?url="+encodeURIComponent(window.location.href)+"&v="+ Math.random();
            location.href = _url;
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            var self = this;
            self.$el.hide();
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});