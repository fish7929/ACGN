// 文件名称: AppToast
//
// 创 建 人: fishYu
// 创建日期: 2016/6/30 22:50
// 描    述: AppToast
define([
    'text!common/templates/toast_box.html',
    "msgbox"
],function(tpl,MsgBox) {
    if(!MsgBox){
        require(["msgbox"],function(msgbox){
            MsgBox = msgbox;
        });
    }

    var ToastBoxUI = function(skinClassName,isSuccess){
        this._template = _.template(this._tpl || tpl);
        this.$el = $("<div class='"+skinClassName+"'>");
        this.el = this.$el.get(0);
        this.$el.html(this._template);
        /*显示toast DIV*/
        this.toastBox = this.$el.find(".toast-msg-box");
        /**显示的logo**/
        this.toastLogo = this.$el.find("img");
        /**显示的消息内容**/
        this.toastContent = this.$el.find("p")[0];
        /*默认不需要填写，默认值为true成功*/
        this._isSuccess = (isSuccess === undefined) ? true : isSuccess;
        this._initView();
    };

    ToastBoxUI.prototype._initView = function(){
        if(this._isSuccess){
            this.toastLogo.attr("src", "images/common/success.png");
        }else{
            this.toastLogo.attr("src", "images/common/error.png");
        }
    };

    ToastBoxUI.prototype.setText = function(strMsg){
        this.toastContent.innerHTML = strMsg || "加载中...";
    };

    ToastBoxUI.prototype._toastAnimation = function(){
        var self = this;
        this.toastBox.fadeIn().delay(800).fadeOut("normal",function(){
            MsgBox.remove(self);
            self.destroy();
        });
    };

    ToastBoxUI.prototype.destroy = function(){
        this._template = null;
        this.$el = null;
        this.el = null;
        this.toastLogo.attr("src", "images/common/success.png");
        this.toastLogo = null;
        this.toastContent = null;
        this.toastBox = null;

    };

    ToastBoxUI.prototype.show = function(toCenter){
        MsgBox.add(this);
        this._toastAnimation();
    };

    return ToastBoxUI;

});