// 文件名称: loginBar.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/22 15:22
// 描    述: 登陆通用栏
define([
    'common/base/item_view',
    'text!common/templates/loginBar.html',
    'marionette',
    'showbox',
    "msgbox"
],function(ItemView, tpl, mn, ShowBox, MsgBox){
    return ItemView.extend({
        className : "loginBarContainer",
        template : _.template(tpl),

        _mouseLock : false,
        currentUser : null, //当前用户
        isShowUserOperationLayer : false,   //默认不显示用户操作界面
        // key : selector
        ui : {
            userPic : ".loginBar-headPic",
            userName: ".loginBar-username",
            bnPublish : ".loginBar-bnPublish",
            btnLogin : ".loginBar-bnLogin",
            btnRegister : ".loginBar-bnRegister",
            userInfoLayer : ".loginBar-UserInfo",
            loginBtnsLayer : ".loginBar-Btns",
            userOperationLayer : ".loginBar-user-operation",
            loginSetting : "#login-setting",
            loginOut : "#login-out"
        },
        //事件添加
        events : {
            "click @ui.bnPublish" : "onPublishHandle",
            "click @ui.btnLogin" : "onLoginHandle",
            "click @ui.btnRegister" : "onRegisterHandle",
            "click @ui.userPic" : "onSwitchUserOperationLayerHandle",
            "click @ui.loginSetting" : "onLoginSettingHandle",
            "click @ui.loginOut" : "onLoginOutHandle"

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
            self.init();
            self._initView();
            self.$el.show();
            //登录成功
            app.on("login:ok",this.onLoginOkHandle, this);
            //登出成功
            app.on("logOut:ok",this.onLoginOkHandle, this);
        },

        init : function(){
            var self = this;
            self.currentUser = gili_data.getCurrentUser();
            var headUrl = "./images/login/common-user.jpg";
            var userName = "道道好劲道";
            if(self.currentUser){
                headUrl = self.currentUser.avatar;
                userName = self.currentUser.user_nick;
            }
            self.ui.userPic.css({"background" : "url('"+headUrl+"') repeat center", "background-size" : "100%"});
            self.ui.userName.html(userName);
        },
        _initView : function(){
            var self = this;
            if(self.currentUser){
                self.ui.userInfoLayer.show();
                self.ui.loginBtnsLayer.hide();
            }else{
                self.ui.userInfoLayer.hide();
                self.ui.loginBtnsLayer.show();
            }
            self.hideUserOperationLayer();
        },
        onPublishHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            app.navigate("#publish" , {replace: false, trigger: true});
        },

        onLoginHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            ShowBox.login();
        },

        onRegisterHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            ShowBox.register();
        },
        onLoginOkHandle : function(){
            var self = this;
            self.currentUser = gili_data.getCurrentUser();      //TODO 重新获取用户信息
            self._initView();
        },
        onSwitchUserOperationLayerHandle : function(event){
            event.stopPropagation();
            event.preventDefault();
            var self = this;
            var e = event || window.event;
            var x = e.screenX;
            var tempX = (self.ui.userInfoLayer.parent()).width() - x;
            if(!self.isShowUserOperationLayer){
                self.showUserOperationLayer(tempX);
            }else{
                self.hideUserOperationLayer();
            }
        },
        showUserOperationLayer : function(tempX){
            var self = this;
            self.isShowUserOperationLayer = true;
            var marginRight = tempX - self.ui.userOperationLayer.width();
            self.ui.userOperationLayer.css({"margin-right":  marginRight+"px"});
            self.ui.userOperationLayer.show();
        },
        hideUserOperationLayer : function(){
            var self = this;
            self.isShowUserOperationLayer = false;
            self.ui.userOperationLayer.hide();
        },
        onLoginOutHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.ask("亲,确定要退出吗？","温馨提示",function(type) {
                if (type == MsgBox.YES) {
                    gili_data.logOut();
                    app.triggerMethod("logOut:ok");
                }
            });
        },
        onLoginSettingHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.alert("点击用户设置按钮");
        },
        /*点击事件不可以重复点*/
        _checkMouseLock : function () {
            var self = this;
            if (self._mouseLock) return true;
            self._mouseLock = true;
            setTimeout(function () {
                self._mouseLock = false;
            }, 200);
            return false;
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