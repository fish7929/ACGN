// 文件名称: loginBar.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/22 15:22
// 描    述: 登陆通用栏
define([
    'common/base/base_view',
    'text!common/templates/loginBar.html',
    'marionette',
    'common/region/switch_view_region',
    'showbox',
    "msgbox",
    'module/publish/views/publishOptionView',
    "module/publish/views/publishView"
],function(BaseView, tpl, mn, SwitchViewRegion, ShowBox, MsgBox, PublishOptView, PublishView){
    return BaseView.extend({
        className : "loginBarContainer",
        template : _.template(tpl),
        _mouseLock : false,
        currentUser : null, //当前用户
        isShowUserOperationLayer : false,   //默认不显示用户操作界面
        UserHeaderWidth : 42,
        InfoLayerWithTemp : 202,    //角色宽度+margin + 名称margin+ 发布按钮宽度 + right 42 +10 +20+ 90 + 40
        // key : selector
        ui : {
            userPic : ".loginBar-headPic",
            userName: ".loginBar-username",
            bnPublish : ".loginBar-bnPublish",
            btnLogin : ".loginBar-bnLogin",
            btnRegister : ".loginBar-bnRegister",
            userInfoLayer : ".loginBar-UserInfo",
            loginBtnsLayer : ".loginBar-Btns",
            userOperationLayer : "#loginBar-user-operation-layer",
            loginSetting : "#login-setting",
            loginOut : "#login-out",
            logoBtn : ".loginBar-Logo"
        },
        //事件添加
        events : {
            "click @ui.logoBtn" : "onGoToHomeHandle",
            "click @ui.bnPublish" : "onPublishHandle",
            "click @ui.btnLogin" : "onLoginHandle",
            "click @ui.btnRegister" : "onRegisterHandle",
            "click @ui.userPic" : "onGoToUserCenterHandle",
            "mouseover @ui.userPic" : "onOpenUserOperationLayerHandle",
            "mouseout @ui.userPic" : "onCloseUserOperationLayerHandle",
            "mouseover @ui.userOperationLayer" : "onOpenUserOperationLayerHandle",
            "mouseout @ui.userOperationLayer" : "onCloseUserOperationLayerHandle",
            "click @ui.loginSetting" : "onLoginSettingHandle",
            "click @ui.loginOut" : "onLoginOutHandle"
        },

        regions : {
            PublishOptRegion: {
                el: ".loginBar-publish-div",
                regionClass: SwitchViewRegion
            }
        },

        /**初始化**/
        initialize : function(){
            this._publishOptView = new PublishOptView();
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

            app.on("hide:publishOptView", this.onHidePublish, this);
        },

        init : function(){
            var self = this;
            self.currentUser = gili_data.getCurrentUserJSON();
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
                var headUrl = self.currentUser.avatar;
                var userName = self.currentUser.user_nick;
                var userId = self.currentUser.objectId;
//                console.log(self.ui.userPic, self.ui.userName, self.ui.userInfoLayer, self.ui.loginBtnsLayer, "第二次变成字符串");
                self.ui.userPic.css({"background" : "url('"+headUrl+"') repeat center", "background-size" : "100%"});
                self.ui.userPic.attr("user-id", userId);
                self.ui.userName.html(userName);
                self.ui.userInfoLayer.show();
                self.ui.loginBtnsLayer.hide();
            }else{
                self.ui.userInfoLayer.hide&&self.ui.userInfoLayer.hide();
                self.ui.loginBtnsLayer.show&&self.ui.loginBtnsLayer.show();
            }
            self.hideUserOperationLayer();
        },
        onPublishHandle : function(e){
            e.stopPropagation();
            e.preventDefault();

            var self = this;
            if(self._publishOptView.isShow){
                self.PublishOptRegion.hide(self._publishOptView);
            }else{
                self.PublishOptRegion.show(self._publishOptView);
            }
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
            self.currentUser = gili_data.getCurrentUserJSON();      //TODO 重新获取用户信息
            self._initView();
        },
        onGoToUserCenterHandle : function(event){
            event.stopPropagation();
            event.preventDefault();
            var self = this;
            var $target = $(event.target);
            var userId = $target.attr("user-id");
            if(userId){
                app.navigate("userCenter/"+userId,{replace : false, trigger : true});
            }
        },
        onOpenUserOperationLayerHandle : function(event){
            event.stopPropagation();
            event.preventDefault();
            var self = this;
            var tempX = self.InfoLayerWithTemp + self.ui.userName.get(0).clientWidth;  //用户信息层宽度
            tempX = tempX - self.UserHeaderWidth / 2;
            self.showUserOperationLayer(tempX);
        },
        onCloseUserOperationLayerHandle : function(event){
            event.stopPropagation();
            event.preventDefault();
            var self = this;
            self.hideUserOperationLayer();
        },
        showUserOperationLayer : function(tempX){
            var self = this;
            self.isShowUserOperationLayer = true;
            var marginRight = tempX - self.ui.userOperationLayer.width() / 2;
            self.ui.userOperationLayer.css({"margin-right":  marginRight+"px"});
            self.ui.userOperationLayer.show&&self.ui.userOperationLayer.show();
        },
        hideUserOperationLayer : function(){
            var self = this;
            self.isShowUserOperationLayer = false;
            self.ui.userOperationLayer.hide&&self.ui.userOperationLayer.hide();
        },
        onLoginOutHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.ask("亲,确定要退出吗？","温馨提示",function(type) {
                if (type == MsgBox.YES) {
                    gili_data.logOut();
                    app.triggerMethod("logOut:ok");
                    utils.loginOut();
                    app.navigate("",{replace : true, trigger : true});
                }
            });
        },
        onGoToHomeHandle : function(e) {
            e.stopPropagation();
            e.preventDefault();
            app.navigate("",{replace : true, trigger : true});
        },
        onLoginSettingHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.toast("点击用户设置按钮");
//            ShowBox.setting();
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

        onHidePublish : function(){
            this.PublishOptRegion.hide(this._publishOptView);
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            this.$el.hide();
            PublishView.hide();
            app.off("hide:publishOptView", this.onHidePublish, this);
        },

        //当页面销毁时触发
        onDestroy : function(){

        }
    });
});