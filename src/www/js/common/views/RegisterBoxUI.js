// 文件名称: AppAlert
//
// 创 建 人: chenshy
// 创建日期: 2015/1/24 14:05
// 描    述: AppAlert
define([
    'text!common/templates/registerBoxUI.html',
    "showbox",
    "msgbox"
],function(tpl,ShowBox, MsgBox) {

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
//        var nick = self.nickTxt.value;
        var account = self.accountTxt.value;  //手机号码
//        var password = self.passwordTxt.value;
//        var verify = self.verifyTxt.value;
        if(utils.checkPhoneNumber(account, MsgBox)){
            gili_data.sendPhoneMsg(account, function(data){
                MsgBox.toast("成功发送验证码,请查收");
            }, function(err){
                if(err.message=="Can't send sms code too frequently."){
                    MsgBox.toast("已经默认发送验证码,请稍等", false);
                }else if(err.message == "发送短信过于频繁。"){
                    MsgBox.toast("已经默认发送验证码,请稍等", false);
                }else if(err.message == "发送验证类短信已经超过一天五条的限制。"){
                    MsgBox.toast("短信已经超过一天五条的限制", false);
                }else{
                    MsgBox.toast(err.message, false); //发送失败
                }
            });
        }
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
        if(utils.checkPhoneNumber(account, MsgBox) && utils.checkVerifyNumber(verify, MsgBox)
            && utils.checkNickIsEmpty(nick, MsgBox)&& utils.checkPassword(password, MsgBox)){
            //todo 此处直接注册
//            self.registerAccount(nick, account, password);
            gili_data.verifyPhoneMsgCode(verify, account, function(){
                self.registerAccount(nick, account, password);
            },function(err){
                if (err.code == 1 || err.code == 603) {
                    MsgBox.toast("无效的短信验证码", false);
                    return;
                }
                if(err.error == "验证码不匹配!"){
                    MsgBox.toast("验证码不匹配!", false);
                }else{
                    MsgBox.toast("注册帐号失败", false);
                }
            });
        }
    };
    p.registerAccount = function(nick, account, password){
        var self = this;
        var user = new AV.User();
        user.set("user_nick", nick);    //昵称
        user.set("avatar", utils.getRandomHeader());   //头像, 获取随机头像
//        user.set("author", "");   //pointer类型
        user.set("username", account);
        user.set("password", password);
        user.set("brief", "什么都没有");
        user.set("user_type", 1);   //用户类型 1 画师， 2 社团主  。3
        user.set("phone", account);   //手机号码
        gili_data.signUp(user, function (user) {
//                app.triggerMethod("login:ok");
            gili_data.logIn(account, password, function (user) {
                app.triggerMethod("login:ok");
            },function(err){console.log(err)});
            MsgBox.toast("注册成功");
            self._hide();
        }, function (user, error) {
            if (error.code != 202) {
                MsgBox.toast("注册帐号失败", false);
            }
        });
    }
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