// 文件名称: BookPreviewView.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/27 23:00
// 描    述: 同人本子--预览
define([
    'text!module/book/templates/bookPreviewView.html'
],function(tpl){
    var BookPreviewView = function(){
        this._isShow = false;
        this.$el = $(tpl);
        this.el = this.$el.get(0);
    };

    BookPreviewView.prototype.show = function(){
        var self = this;
        if(self._isShow){
            return;
        }
        self._isShow = true;
        if(self.el.parentNode){
            document.body.appendChild(self.el);
        }
    };

    BookPreviewView.prototype.hide = function(){
        var self = this;
        if(!self._isShow){
            return;
        }
        this._isShow = false;
        if(!self.el.parentNode){
            self.el.remove();
        }
    };

    return new BookPreviewView();
});