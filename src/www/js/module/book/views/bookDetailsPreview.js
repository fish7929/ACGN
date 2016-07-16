// 文件名称: bookDetailsPreview.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/27 15:40
// 描    述: 同人本子--同人本子预览块
define([
    'common/base/item_view',
    'text!module/book/templates/bookDetailsPreview.html',
    'marionette',
    'module/book/views/bookPreviewView'
],function(ItemView, tpl, mn, BookPreviewView){
    var htmlTpl = "<div class='bd-preview-item' data-index='{1}'><div class='bd-preview-pic button' style='background: url(\"{0}\") no-repeat center; background-size: 100%'></div></div>";
    return ItemView.extend({
        className : "bookDetailsPreviewContainer",
        template : _.template(tpl),

        MaxImage : 5,

        _data : null,

        // key : selector
        ui : {
            list : ".bd-preview-container"
        },

        //事件添加
        events : {
            "click @ui.list" : "onClickHandle"
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
            this.$el.show();
        },

        initData : function(data){
            if(!data) return;
            var html = "", self = this;
            self._data = data;
            for(var i=0; i<data.length; i++){
                if(i >= self.MaxImage) break;
                html += htmlTpl.replace("{0}", data[i]).replace("{1}", i);
            }
            self.ui.list.html(html);
        },

        onClickHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var target = e.target;
            var parent = $(target).parents(".bd-preview-item");
            if(!parent) return;
            var index = parent.attr("data-index");
            if(self._data && self._data.length){
                BookPreviewView.show(self._data, index);
            }
        },

        hideBookPreview : function(){
            BookPreviewView.hide();
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