// 文件名称: home_QHDCView.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/22 15:22
// 描    述: 首页奇画大触内容
define([
    'common/base/item_view',
    'text!module/home/templates/home_QHDC.html',
    'marionette'
],function(ItemView, tpl, mn){
    var htmlTpl = '<div class="qhdc-item">' +
        '<div class="qhdc-userPic" style="background: url(\'{0}\') no-repeat center; background-size: 100%"></div>' +
        '<div class="qhdc-userName">{1}</div>' +
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
            this.initList();
            this.$el.show();
        },

        initList : function(){
            var data = [];
            var obj = {};
            obj.userPic = 'images/temp/head/head_b1.png';
            obj.userName = "莫耀军是茶1";
            data.push(obj);
            var obj = {};
            obj.userPic = 'images/temp/head/head_b2.png';
            obj.userName = "莫耀军是茶水妹2";
            data.push(obj);
            var obj = {};
            obj.userPic = 'images/temp/head/head_b3.png';
            obj.userName = "莫耀军是茶水妹3";
            data.push(obj);
            var obj = {};
            obj.userPic = 'images/temp/head/head_b4.png';
            obj.userName = "莫耀军是茶水妹4";
            data.push(obj);
            var obj = {};
            obj.userPic = 'images/temp/head/head_b5.png';
            obj.userName = "莫耀军是茶水妹5";
            data.push(obj);

            var self = this, html = "";
            for(var i = 0; i<data.length; i++){
                obj = data[i];
                html += htmlTpl.replace("{0}", obj.userPic).replace("{1}", obj.userName);
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