// 文件名称: login.js
//
// 创 建 人: fishYu
// 创建日期: 2016/6/23 22:19
// 描    述: login.js
(function(){
    /**
     * 登录模版
     * @type {string}
     */
    var tpl =
        '<div class="login-container-mask x-center"></div>'+
        '<div class="login-container">' +
            '<div class="login-title">登录</div>'+
            '<div class="login-content">'+
                '<div class="login-common-div"><label>手机号码：</label><input type="text" class="account-txt"/></div>'+
                '<div class="login-common-div"><label>密码：</label><input type="password" class="password-txt"/></div>'+
                '<div class="login-btn">登录</div>'+
                '<div class="login-common-div"><span class="forgot-password">忘记密码？</span><span class="go-sign-up">去注册</span></div>'+
                '<div class="login-common-div"><span class="divide-line"></span><span class="third-party-login-hint">第三方登录</span><span class="divide-line"></span></div>'+
                '<div class="login-common-div"><span class="micro-blog-login">微博</span><span class="qq-login">QQ</span></div>'
            '</div>' +
        '</div>';

    var logining = null;

    var LoginView = function(){
        this.dom = LoginView.getDom();
        this.loginContainerMask = this.dom.querySelector(".login-container-mask");
        this.loginAccount = this.dom.querySelector(".account-txt");
        this.loginPassword = this.dom.querySelector(".password-txt");
        this.loginBtn = this.dom.querySelector(".login-btn");
        this.forgotPassword = this.dom.querySelector(".forgot-password");
        this.goSignUp = this.dom.querySelector(".go-sign-up");
        this.microBlogLogin = this.dom.querySelector(".micro-blog-login");
        this.qqLogin = this.dom.querySelector(".qq-login");
    };
    var p = LoginView.prototype;
    p.addListener = function(){
        /**
         * 朦层点击
         */
        this.loginContainerMask.addEventListener("click", this.loginMaskHandle, false);
        this._bindLoginHandle = this.loginHandle.bind(this);
        /**
         * 登录
         */
        this.loginBtn.addEventListener("click", this._bindLoginHandle, false);
        /**
         * 忘记密码
         */
        this.forgotPassword.addEventListener("click", this.forgotPasswordHandle, false);
        /**
         * 去注册
         */
        this.goSignUp.addEventListener("click",this.goSignUpHandle, false);
        /**
         * 微博登录
         */
        this.microBlogLogin.addEventListener("click",this.microBlogLoginHandle, false);
        /**
         * QQ登录
         */
        this.qqLogin.addEventListener("click", this.qqLoginHandle, false);
    };

    p.removeListener = function(){
        /**
         * 朦层点击
         */
        this.loginContainerMask.removeEventListener("click", this.loginMaskHandle, false);
        /**
         * 登录
         */
        this.loginBtn.removeEventListener("click", this._bindLoginHandle, false);
        this._bindLoginHandle = null;
        /**
         * 忘记密码
         */
        this.forgotPassword.removeEventListener("click", this.forgotPasswordHandle, false);
        /**
         * 去注册
         */
        this.goSignUp.removeEventListener("click",this.goSignUpHandle, false);
        /**
         * 微博登录
         */
        this.microBlogLogin.removeEventListener("click",this.microBlogLoginHandle, false);
        /**
         * QQ登录
         */
        this.qqLogin.removeEventListener("click", this.qqLoginHandle, false);

    };
    /**
     * 蒙层点击事件
     * @param e
     */
    p.loginMaskHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        console.log( e, "loginMaskHandle");
        LoginView.hide();
    }
    /**
     * 登录按钮点击事件
     * @param e
     */
    p.loginHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        var account = self.loginAccount.value;
        var password = self.loginPassword.value;
        console.log(self.loginAccount,self.loginPassword, e, "loginHandle", account, "----", password);
        LoginView.hide();
    };
    /**
     * 忘记密码点击事件
     * @param e
     */
    p.forgotPasswordHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        console.log(e, "forgotPasswordHandle");
    };
    /**
     * 去注册点击事件
     * @param e
     */
    p.goSignUpHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        console.log(e, "goSignUpHandle");
    };
    /**
     * 第三方登录--微博登录点击事件
     * @param e
     */
    p.microBlogLoginHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        console.log(e, "microBlogLoginHandle");
    };
    /**
     *第三方登录--QQ登录点击事件
     * @param e
     */
    p.qqLoginHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        console.log(e, "qqLoginHandle");
    };

    LoginView.paused = true;
    /**
     * 初始化显示方法
     * @returns {*}
     */
    LoginView.show = function(){
        if(!LoginView.paused){
            return logining;
        }
        LoginView.paused = false;
        if(!logining){
            logining = new LoginView();
        }
        if(!logining.dom.parentNode){
            document.body.appendChild(logining.dom);
        }
        logining.addListener();
        return logining;
    };
    /**
     * 登录隐藏的方法
     */
    LoginView.hide = function(){
        if(LoginView.paused){
            return;
        }
        LoginView.paused = true;
        if(logining){
            logining.removeListener();
            if(logining.dom.parentNode){
                logining.dom.parentNode.removeChild(logining.dom);
            }
        }
    };

    LoginView.getDom = function(){
        var dom = document.createElement("div");
        dom.className = "login-gili-love-container";
        dom.innerHTML = tpl;
        return dom;
    };

    var cssArr = [];
    cssArr.push(
            ".login-gili-love-container{" +
            "position: fixed; " +
            "top:0;left:0;z-index:9999;width:100%;height:100%" +
            "}"
    );
    cssArr.push(
        ".login-container-mask{" +
            "background: #000;opacity: 0.7;position: absolute;width:1280px;" +
            "height:calc(100% - 64px);height:-webkit-calc(100% - 64px);" +
            "height:-ms-calc(100% - 64px);height:-o-calc(100% - 64px);" +
            "height:-moz-calc(100% - 64px); top:64px;" +
        "}"
    );
    cssArr.push(
        ".login-container{" +
            "top:50%;left:50%;transform:translate(-50%,-50%);" +
            "width:412px; height:402px;background:#fff;"+
            "-webkit-transform:translate(-50%,-50%);" +
            "position:absolute; z-index:2; border-radius: 10px" +
        "}"
    );
    cssArr.push(
    );

    if(!document.getElementById("style-login-view")) {
        var styleNode = document.createElement("style");
        styleNode.type = "text/css";
        styleNode.id = "style-login-view";
        styleNode.innerHTML = cssArr.join("");
        document.head.appendChild(styleNode);
    }
    window.LoginView = LoginView;
})();