// 文件名称: AppAlert
//
// 创 建 人: chenshy
// 创建日期: 2015/1/24 14:05
// 描    述: AppAlert
define([
    'text!common/templates/registerBoxUI.html',
    "showbox"
],function(tpl,ShowBox) {

    if(!ShowBox){
        require(["showbox"],function(showbox){
            ShowBox = showbox;
        });
    }

    var RegisterBoxUI = function(){
        this._template = _.template(this._tpl || tpl);
        this.$el = $("<div>");
        this.el = this.$el.get(0);
        this.$el.html(this._template);

        this.registerMask = this.el.querySelector("#register-mask");
        this.nickTxt = this.el.querySelector("#register-nick-txt");
        this.accountTxt = this.el.querySelector("#register-account-txt");   //手机号码
        this.passwordTxt = this.el.querySelector("#register-password-txt");
        this.verifyTxt = this.el.querySelector("#register-verify-txt");
        this.verifyBtn = this.el.querySelector("#verify-hint");
        this.registerBtn = this.el.querySelector("#register-btn");

        this._initView();
    };
    var p = RegisterBoxUI.prototype;
    p._initView = function(){
        var self = this;
        self.addListener();
    };
    p.addListener = function(){
        /**
         * 朦层点击
         */
        this._registerMaskHandle = this.registerMaskHandle.bind(this);
        this.registerMask.addEventListener("click", this._registerMaskHandle, false);
        /**
         * 验证消息处理事件
         */
        this._verifyHandle = this.verifyHandle.bind(this);
        this.verifyBtn.addEventListener("click", this._verifyHandle, false);
        /**
         * 注册处理事件
         */
        this._registerHandle = this.registerHandle.bind(this);
        this.registerBtn.addEventListener("click", this._registerHandle, false);
    };
    p.removeListener = function(){
        /**
         * 朦层点击
         */
        this.registerMask.removeEventListener("click", this._registerMaskHandle, false);
        this._registerMaskHandle = null;
        /**
         * 验证消息处理事件
         */
        this.verifyBtn.removeEventListener("click", this._verifyHandle, false);
        this._verifyHandle = null;
        /**
         * 注册处理事件
         */
        this.registerBtn.removeEventListener("click", this._registerHandle, false);
        this._registerHandle = null;
    };
    /**
     * 蒙层点击事件
     * @param e
     */
    p.registerMaskHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        console.log( e, "loginMaskHandle");
        self._hide();
    };
    /**
     * 验证按钮点击事件
     * @param e
     */
    p.verifyHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        var nick = self.nickTxt.value;
        var account = self.accountTxt.value;  //手机号码
        var password = self.passwordTxt.value;
        var verify = self.verifyTxt.value;
        console.log( e, "verifyHandle", account, "----", password, nick, verify);
        self._hide();
    };
    /**
     * 注册按钮点击事件
     * @param e
     */
    p.registerHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        var nick = self.nickTxt.value;
        var account = self.accountTxt.value;  //手机号码
        var password = self.passwordTxt.value;
        var verify = self.verifyTxt.value;
        console.log( e, "registerHandle", account, "----", password, nick, verify);
        self._hide();
    };
    p._hide = function(){
        var self = this;
        self.removeListener();
        ShowBox.remove(this);
        self.destroy();
    };

    p.destroy = function(){
        var self = this;
        self._template = null;
        self.$el = null;
        self.el = null;

        self.loginContainerMask = null;
        self.loginAccount = null;
        self.loginPassword = null;
        self.loginBtn = null;
        self.forgotPassword = null;
        self.goSignUp = null;
        self.microBlogLogin = null;
        self.qqLogin = null;
    };

    p.show = function(){
        ShowBox.add(this);
    };

    return RegisterBoxUI;

});