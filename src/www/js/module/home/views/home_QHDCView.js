// 文件名称: home_QHDCView.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/22 15:22
// 描    述: 首页奇画大触内容
define([
    'common/base/item_view',
    'text!module/home/templates/home_QHDC.html',
    'marionette',
    'module/home/model/HomeModel'
],function(ItemView, tpl, mn, HomeModel){
    var htmlTpl = '<div class="qhdc-item {3}" >' +
        '<div class="qhdc-userPic button" data-id="{0}" style="background: url(\'{1}\') no-repeat center; background-size: 100%"></div>' +
        '<div class="qhdc-userName">{2}</div>' +
        '</div>';
    return ItemView.extend({
        className : "QHDCContainer",
        template : _.template(tpl),

        _mouseLock : false,

        // key : selector
        ui : {
            qhdcContainer : ".qhdc-container"
        },
        //事件添加
        events : {
            "click @ui.qhdcContainer" : "onClickHandler"
        },
        /**初始化**/
        initialize : function(){
        },

        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){
        },

        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
        },

        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
            var self = this;
            HomeModel.queryQHDCData(function(data){
                self.initList(data);
            });
            self.$el.show();
        },

        onClickHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = e.target;
            var userId = target.getAttribute("data-id");
            if(userId){
                app.navigate("#userCenter/"+userId, {replace: false, trigger: true});
            }
        },

        initList : function(data){
            var self = this, html = "", lastItemClass, i, obj;
            for(i = 0; i < data.length; i++){
                obj = data[i];
                lastItemClass = "";
                if(i == data.length - 1){
                    lastItemClass = "last-item";
                }
                html += htmlTpl.replace("{0}", obj.objectId).replace("{1}", obj.avatar).replace("{2}", obj.user_nick).replace("{3}", lastItemClass);
            }
            self.ui.qhdcContainer.html(html);
        },

        /*点击事件不可以重复点*/
        _checkMouseLock : function () {
            var self = this;
            if (self._mouseLock) return true;
            self._mouseLock = true;
            setTimeout(function () {
                self._mouseLock = false;
            }, 200);
            return false;
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            this.$el.hide();
        },

        //当页面销毁时触发
        onDestroy : function(){
        }

    });
});