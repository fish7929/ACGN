// 文件名称: ShowBox
//
// 创 建 人: fishYu
// 创建日期: 2016/6/27 22:02
// 描    述: ShowBox
define([
    'common/views/LoginBoxUI',
    'common/views/RegisterBoxUI',
    'common/views/SettingBoxUI'
],function(LoginBoxUI,RegisterBoxUI, SettingBoxUI) {
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
         * 设置弹窗
         * @return
         */
        setting : function(uiClass){
            uiClass = uiClass || SettingBoxUI;
            var showBox = new uiClass();
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

    ShowBox.init();

    return ShowBox;
});
