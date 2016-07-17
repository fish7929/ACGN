// 文件名称: LoginBox
//
// 创 建 人: fishYu
// 创建日期: 2016/6/27 22:52
// 描    述: 登录弹出框
define([
    'text!common/templates/loginBoxUI.html',
    "showbox",
    "msgbox"
], function (tpl, ShowBox, MsgBox) {

    if (!ShowBox) {
        require(["showbox"], function (showbox) {
            ShowBox = showbox;
        });
    }

    var LoginBoxUI = function () {
        this._template = _.template(this._tpl || tpl);
        this.$el = $("<div>");
        this.el = this.$el.get(0);
        this.$el.html(this._template);

        this.loginContainerMask = this.el.querySelector(".login-container-mask");
        this.loginAccount = this.el.querySelector(".account-txt");
        this.loginPassword = this.el.querySelector(".password-txt");
        this.loginBtn = this.el.querySelector(".login-btn");
        this.forgotPassword = this.el.querySelector(".forgot-password");
        this.goSignUp = this.el.querySelector(".go-sign-up");
        this.microBlogLogin = this.el.querySelector(".micro-blog-login");
        this.qqLogin = this.el.querySelector(".qq-login");

        this._initView();
    };
    var p = LoginBoxUI.prototype;
    p._initView = function () {
        var self = this;
        self.addListener();
//        self._initMicroBlogBtn();
    };
    p._initMicroBlogBtn = function () {
        var self = this;
        console.log("anyWhere start");
        WB2.anyWhere(function (W) {
            console.log("anyWhere");
            W.widget.connectButton({
                id: "micro-blog-login",
                type: '3,2',
                callback: {
                    login: function(success){
                        gili_data.loginUtils(gili_data.packageMicroBlogResults(success));
                        WB2.logout(function () {
                            console.log("退出登录 WB2.logout");
                        });
                        self._hide();
                    }, //登录后的回调函数
                    logout: function(){
                        console.log("退出登录");
                    } //退出后的回调函数
                }
            });
        });
    },
        p.addListener = function () {
            var self = this;
            /**
             * 朦层点击
             */
            self._loginMaskHandle = self.loginMaskHandle.bind(self);
            self.loginContainerMask.addEventListener("click", self._loginMaskHandle, false);

            /**
             * 登录
             */
            self._bindLoginHandle = self.loginHandle.bind(self);
            self.loginBtn.addEventListener("click", self._bindLoginHandle, false);
            /**
             * 忘记密码
             */
            self._forgotPasswordHandle = self.forgotPasswordHandle.bind(self);
            self.forgotPassword.addEventListener("click", self._forgotPasswordHandle, false);
            /**
             * 去注册
             */
            self._goSignUpHandle = self.goSignUpHandle.bind(self);
            self.goSignUp.addEventListener("click", self._goSignUpHandle, false);
            /**
             * QQ登录
             */
            self._qqLoginHandle = self.qqLoginHandle.bind(self);
            self.qqLogin.addEventListener("click", self._qqLoginHandle, false);
            /**
             * 微博登录
             */
            self._microBlogLoginHandle = self.microBlogLoginHandle.bind(self);
            self.microBlogLogin.addEventListener("click", self._microBlogLoginHandle, false);
        };
    p.removeListener = function () {
        var self = this;
        /**
         * 朦层点击
         */
        self.loginContainerMask.removeEventListener("click", self._loginMaskHandle, false);
        self._loginMaskHandle = null;
        /**
         * 登录
         */
        self.loginBtn.removeEventListener("click", self._bindLoginHandle, false);
        self._bindLoginHandle = null;
        /**
         * 忘记密码
         */
        self.forgotPassword.removeEventListener("click", self._forgotPasswordHandle, false);
        self._forgotPasswordHandle = null;
        /**
         * 去注册
         */
        self.goSignUp.removeEventListener("click", self._goSignUpHandle, false);
        self._goSignUpHandle = null;
        /**
         * QQ登录
         */
        self.qqLogin.removeEventListener("click", self._qqLoginHandle, false);
        self._qqLoginHandle = null;
        /**
         * 微博登录
         */
        self.microBlogLogin.removeEventListener("click", self._microBlogLoginHandle, false);
        self._microBlogLoginHandle = null;
    };
    /**
     * 蒙层点击事件
     * @param e
     */
    p.loginMaskHandle = function (e) {
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        console.log(e, "loginMaskHandle");
        self._hide();
    }
    /**
     * 登录按钮点击事件
     * @param e
     */
    p.loginHandle = function (e) {
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        var account = self.loginAccount.value;
        var password = self.loginPassword.value;
        if (utils.checkPhoneNumber(account, MsgBox) && utils.checkPassword(password, MsgBox)) {
            gili_data.logIn(account, password, function (user) {
                //派发自定义事件
                self._hide();
//                console.log(user, 6666);
                app.triggerMethod("login:ok");
                //查询当前登录用户已关注用户ID列表 已点赞话题(插画)ID列表
                utils.loadAttentionList(user.id);
                utils.loadLikedTplList(user.id);
            }, function (error) {
                if (error.code == 211) {
                    MsgBox.toast("该用户未注册，去注册", false);
                }

                if (error.code == 210) {
                    MsgBox.toast("用户或密码错误!", false);
                }

                if (error.code < 0) {
                    MsgBox.toast("网络不好,请检查您的网络!".false);
                }
                if (error.code == 1) {
                    MsgBox.toast("帐号异常，请稍后再试!", false);
                }

            });
        }


    };
    /**
     * 忘记密码点击事件
     * @param e
     */
    p.forgotPasswordHandle = function (e) {
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        console.log(e, "forgotPasswordHandle");
    };
    /**
     * 去注册点击事件
     * @param e
     */
    p.goSignUpHandle = function (e) {
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        console.log(e, "goSignUpHandle");
        self._hide();
        ShowBox.register();
    };
    /**
     * 第三方登录--微博登录点击事件
     * @param e
     */
    p.microBlogLoginHandle = function (e) {
        e.stopPropagation();
        e.preventDefault();
        var self = this;
//        console.log(e, "microBlogLoginHandle");
        var _url = "https://api.weibo.com/oauth2/authorize?client_id=2720439896&client_secrect=49df09be0f1fc7e4ef082a23ac385e97&response_type=code&redirect_uri=http://www.gilieye.com/weibo.html?v="+ Math.random();
        location.href = _url;
    };
    /**
     *第三方登录--QQ登录点击事件
     * @param e
     */
    p.qqLoginHandle = function (e) {
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        self._hide();
        window.open('https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=101326661&redirect_uri='+ encodeURIComponent("http://www.gilieye.com/qq.html?platform=qq&v="+ Math.random()) +'', '_self')
    };
    p._hide = function () {
        var self = this;
        self.removeListener();
        ShowBox.remove(this);
        self.destroy();
    };

    p.destroy = function () {
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

    p.show = function () {
//        this._initMicroBlogBtn();
        ShowBox.add(this);
    };

    return LoginBoxUI;

});