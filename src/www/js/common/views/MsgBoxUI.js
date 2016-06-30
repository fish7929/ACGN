// 文件名称: AppAlert
//
// 创 建 人: fishYu
// 创建日期: 2016/6/30 23:05
// 描    述: AppAlert
define([
    'text!common/templates/msg_box.html',
    "msgbox"
],function(tpl,MsgBox) {
//    console.log("app " + app.views.MsgBox);

    if(!MsgBox){
        require(["msgbox"],function(msgbox){
            MsgBox = msgbox;
        });
    }

    var MsgBoxUI = function(skinClassName,buttonType,bModal){
//        console.log(this._tpl);
        this._template = _.template(this._tpl || tpl);
        this.$el = $("<div class='"+skinClassName+"'>");
        this.el = this.$el.get(0);
        this.$el.html(this._template);

        /**确定按钮**/
        this.bnOk = this.$el.find(".app-msg-box-ok")[0];
        /**是按钮**/
        this.bnYes = this.$el.find(".app-msg-box-yes")[0];
        /**否按钮**/
        this.bnNo = this.$el.find(".app-msg-box-no")[0];
        /**提示内容**/
        this.txtContent = this.$el.find(".app-msg-box-content")[0];
        /**提示标题**/
        this.txtTitle = this.$el.find(".app-msg-box-title")[0];
        /**回调参数**/
        this._params = null;

        this._bModal = (bModal === undefined) ? true : bModal;

        this._buttonType = buttonType;
        this._callback = null;
        var self = this;
        this.$el.unbind("click").bind("click",function(e){
            self._clickHandle(e);
            e.stopPropagation();
            e.preventDefault();
        });

        this._initView();
    };

    MsgBoxUI.prototype._initView = function(){
        var self = this;
        this._displayButton(self.bnOk,'none');
        this._displayButton(self.bnYes,'none');
        this._displayButton(self.bnNo,'none');
        switch(this._buttonType)
        {
            case MsgBox.OK:
                this._displayButton(self.bnOk,'block');
                break;
            case MsgBox.YES | MsgBox.NO:
                this._displayButton(self.bnYes,'block');
                this._displayButton(self.bnNo,'block');
                break;
        }
    };

    MsgBoxUI.prototype._displayButton = function(button,b){
        button.style.display = b;
    };

    MsgBoxUI.prototype.setCallBack = function(callback,params){
        this._callback = callback;
        this._params = params;
    };

    MsgBoxUI.prototype.setText = function(strMsg,strTitle){
        this.txtContent.innerHTML = strMsg || " ";
        this.txtTitle.innerHTML = strTitle || "温馨提示";
    };

    MsgBoxUI.prototype._clickHandle = function(e){
        var self = this;
        e.preventDefault();
        e.stopPropagation();
        switch (e.target){
            case self.bnNo:
                self._hide(MsgBox.NO);
                break;
            case self.bnYes:
                self._hide(MsgBox.YES);
                break;
            case self.bnOk:
                self._hide(MsgBox.OK);
                break;
            case self.txtContent:
                break;
            default :
//                self._hide(MsgBox.NO);
                self._hide(MsgBox.ABORT, true);
                break;
        }
    };

    MsgBoxUI.prototype._hide = function(type, isNoHide){
        if(this._callback){
            this._callback.apply(null,[type,this._params]);
        }
        if(!isNoHide){
            this.$el.unbind("tap");
            MsgBox.remove(this);
            this.destroy();
        }
    };

    MsgBoxUI.prototype.destroy = function(){

        this._template = null;
        this.$el = null;
        this.el = null;

        this.bnOk = null;
        this.bnYes = null;
        this.bnNo = null;
        this.txtContent = null;
        this.txtTitle = null;
        this._params = null;

        this._callback = null;

    };

    MsgBoxUI.prototype.show = function(toCenter){
        MsgBox.add(this);
    };

    return MsgBoxUI;

});