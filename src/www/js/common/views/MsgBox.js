// 文件名称: MsgBox
//
// 创 建 人: fishYu
// 创建日期: 2016/6/30 22:47
// 描    述: MsgBox
define([
    'common/views/MsgBoxUI',
    'common/views/ToastBoxUI',
],function(MsgBoxUI, ToastBoxUI) {

    var className = "app-msg-box";

    var MsgBox = {
        init : function(){
            this._container = $("<div class='app-msg-box-container'>");
            $(document.body).append(this._container.get(0));
            this._container.hide();
            this._arrBox = [];
        },
        /**
         * 弹出窗口,包含一个"确定"按钮
         * @param	strMsg          需要显示的信息
         * @param	strTitle			信息提示的title
         * @param	skinClassName   自定义的外观，传null或者空字符串使用默认外观
         * @param	_callBack  点击“是”或者点击“否”按钮后的回调函数，
         * @param	params  要在回调时事件中传递的参数集合
         * @return
         */
        alert : function(strMsg,strTitle,_callBack,params,skinClassName,uiClass){
            uiClass = uiClass || MsgBoxUI;
            skinClassName = skinClassName || className;
            var msgBox = new uiClass(skinClassName, MsgBox.OK);
            msgBox.setCallBack(_callBack,params);
            msgBox.setText(strMsg, strTitle);
            msgBox.show(true);
            return msgBox;
        },
        /**
         * 消息显示框，以toast形式显示  2016-3-7 11:03
         * @param strMsg        需要显示的信息
         * @param isSuccess     成功或者失败的，对应显示不同的logo，成功true, 失败false
         * @param skinClassName 自定义的外观，传null或者空字符串使用默认外观
         * @returns {ToastBoxUI}
         */
        toast : function(strMsg, isSuccess, skinClassName){
            skinClassName = skinClassName || "app-toast-box";
            var msgBox = new ToastBoxUI(skinClassName, isSuccess);
            msgBox.setText(strMsg);
            msgBox.show(true);
            return msgBox;
        },
        /**
         * 弹出询问窗口,包含一个"是"和一个"否"按钮
         * @param	strMsg          需要显示的信息
         * @param	strTitle			信息提示的title
         * @param	skinClassName   自定义的外观，传null或者空字符串使用默认外观
         * @param	_callBack  回调函数
         * @param	params  要在回调时事件中传递的参数集合
         * @return
         */
        ask : function(strMsg,strTitle,_callBack,params,skinClassName,uiClass){
            uiClass = uiClass || MsgBoxUI;
            skinClassName = skinClassName || className;
            var msgBox = new uiClass(skinClassName, MsgBox.YES | MsgBox.NO);
            msgBox.setCallBack(_callBack,params);
            msgBox.setText(strMsg, strTitle);

            msgBox.show(true);
            return msgBox;
        },
        add : function(msgBox){
            this._arrBox.push(msgBox);
            this._container.show();
            this._container.append(msgBox.el);
        },

        remove : function(msgBox){
            for(var i = 0;i < this._arrBox.length;i++){
                if(this._arrBox[i] == msgBox){
                    this._arrBox.splice(i,1);
                    break;
                }
            }
            msgBox.$el.remove();

            if(this._arrBox.length == 0){
                this._container.hide();
            }
        },
        //显示的情况下就清除
        clear : function(){
            this._container.html("");
            this._container.hide();
            this._arrBox.length = 0;
        },
        //判断是否显示alert框
        isShow : function(){
            if(this._arrBox.length > 0){
                return true;
            }
            return false;
        }
    };

    /**
     * "否"按钮及其返回值
     */
    MsgBox.NO = 0;

    /**
     * "是"按钮及其返回值
     */
    MsgBox.YES = 2;

    /**
     * "确定"按钮及其返回值
     */
    MsgBox.OK = 4;

    /**
     * "取消"按钮及其返回值
     */
    MsgBox.CANCEL = 8;

    /**
     * 空白处点击其返回值
     */
    MsgBox.ABORT = 10;



    MsgBox.init();

//    app.views.MsgBox = MsgBox;

    return MsgBox;
});
