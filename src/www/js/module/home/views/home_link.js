// 文件名称: home_link.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/26 15:00
// 描    述: 首页--友情链接
define([
    'common/base/item_view',
    'text!module/home/templates/home_link.html',
    'marionette'
],function(ItemView, tpl, mn){
    var htmlTpl = "<a href='{0}' target='_blank'><div class='link-item' style='background: url(\"{1}\") no-repeat center; background-size:100% auto'></div></a>"
    return ItemView.extend({
        className : "linkContainer",
        template : _.template(tpl),

        _mouseLock : false,

        // key : selector
        ui : {
            linkList : ".link-container"
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
            var list = giliConfig.Link;
            var self = this, html = "", i, obj;
            for(i = 0; i<list.length; i++){
                obj = list[i];
                html += htmlTpl.replace("{0}", obj.link).replace("{1}", obj.src);
            }
            self.ui.linkList.html(html);
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