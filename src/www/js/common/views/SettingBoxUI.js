// 文件名称: SettingBoxUI
//
// 创 建 人: fishYu
// 创建日期: 2016/7/12 21:14
// 描    述: 设置页
define([
    'text!common/templates/settingBoxUI.html',
    "showbox",
    "msgbox"
],function(tpl,ShowBox, MsgBox) {

    if(!ShowBox){
        require(["showbox"],function(showbox){
            ShowBox = showbox;
        });
    }

    var SettingBoxUI = function(){
        this._template = _.template(this._tpl || tpl);
        this.$el = $("<div>");
        this.el = this.$el.get(0);
        this.$el.html(this._template);

//        this.registerMask = this.el.querySelector("#register-mask");

        this._initView();
    };
    var p = SettingBoxUI.prototype;
    p._initView = function(){
        var self = this;
        self.addListener();
    };
    p.addListener = function(){
        /**
         * 朦层点击
         */
//        this._registerMaskHandle = this.registerMaskHandle.bind(this);
//        this.registerMask.addEventListener("click", this._registerMaskHandle, false);
    };
    p.removeListener = function() {
        /**
         * 朦层点击
         */
//        this.registerMask.removeEventListener("click", this._registerMaskHandle, false);
//        this._registerMaskHandle = null;
    };
    /**
     * 蒙层点击事件
     * @param e
     */
    p.registerMaskHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
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
    };
    /**
     * 注册按钮点击事件
     * @param e
     */
    p.registerHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
    };
    p.registerAccount = function(nick, account, password){
        var self = this;
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

    };

    p.show = function(){
        ShowBox.add(this);
    };

    return SettingBoxUI;

});