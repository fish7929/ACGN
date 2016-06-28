// 文件名称: ShowBox
//
// 创 建 人: fishYu
// 创建日期: 2016/6/27 22:02
// 描    述: ShowBox
define([
    'common/views/LoginBoxUI',
    'common/views/RegisterBoxUI',
    'common/views/MsgBoxUI'
],function(LoginBoxUI,RegisterBoxUI, MsgBoxUI) {
    var className = "login-container-mask x-center";
    var ShowBox = {
        init : function(){
            this._container = $("<div class='login-gili-love-container'>");
            $(document.body).append(this._container.get(0));
            this._container.hide();
            this._arrBox = [];
        },
        /**
         * 登录弹出窗口
         * @return
         */
        login : function(uiClass){
            uiClass = uiClass || LoginBoxUI;
            var showBox = new uiClass();
            showBox.show(true);
            return showBox;
        },
        /**
         * 注册弹窗
         * @return
         */
        register : function(uiClass){
            uiClass = uiClass || RegisterBoxUI;
            var showBox = new uiClass();
            showBox.show(true);
            return showBox;
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
            var showBox = new uiClass(skinClassName, ShowBox.OK);
            showBox.setCallBack(_callBack,params);
            showBox.setText(strMsg, strTitle);
            showBox.show(true);
            return showBox;
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
            var showBox = new uiClass(skinClassName, ShowBox.YES | ShowBox.NO);
            showBox.setCallBack(_callBack,params);
            showBox.setText(strMsg, strTitle);

            showBox.show(true);
            return showBox;
        },
        add : function(showBox){
            this._arrBox.push(showBox);
            this._container.show();
            this._container.append(showBox.el);
        },

        remove : function(showBox){
            for(var i = 0;i < this._arrBox.length;i++){
                if(this._arrBox[i] == showBox){
                    this._arrBox.splice(i,1);
                    break;
                }
            }
            showBox.$el.remove();

            if(this._arrBox.length == 0){
                this._container.hide();
            }
        },

        clear : function(){
            this._container.html("");
        }
    };
    /**
     * "否"按钮及其返回值
     */
    ShowBox.NO = 0;

    /**
     * "是"按钮及其返回值
     */
    ShowBox.YES = 2;

    /**
     * "确定"按钮及其返回值
     */
    ShowBox.OK = 4;

    /**
     * "取消"按钮及其返回值
     */
    ShowBox.CANCEL = 8;

    ShowBox.init();

    return ShowBox;
});
