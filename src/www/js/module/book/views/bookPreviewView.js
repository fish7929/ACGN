// 文件名称: BookPreviewView.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/27 23:00
// 描    述: 同人本子--预览
define([
    'text!module/book/templates/bookPreviewView.html'
],function(tpl){
    var BookPreviewView = function(){
        var self = this;
        self._isShow = false;
        self.$el = $(tpl);
        self.el = self.$el.get(0);
        self._picArr = [];
        self._picIndex = 0;

        self._bookImage = self.$el.find(".previewImage");
        self._nextBtn = self.$el.find(".previewRightBtn");
        self._preBtn = self.$el.find(".previewLeftBtn");
    };

    /**
     * 显示要预览的书本
     * @param arr 图片数组
     */
    BookPreviewView.prototype.show = function(arr){
        var self = this;
        if(!arr || arr.length == 0) return;

        if(self._isShow) return;
        self._isShow = true;
        document.body.appendChild(self.el);
        self._picIndex = 0;
        self._picArr = arr;
        self.showPic();
        self.bindEvent();
    };

    BookPreviewView.prototype.showPic = function(){
        var self = this, url = self._picArr[self._picIndex];
        if(!url) return;

        var image = new Image();
        image.onload = function(){
            self.setImage(url, image.width, image.height);
            image = null;
        };
        image.onerror = function(){
            image = null;
        };
        image.src = url;

        self.setBtnVi();
    };

    BookPreviewView.prototype.showNextPic = function(){
        var self = this;
        self._picIndex++;
        self.showPic();
    };

    BookPreviewView.prototype.showPrePic = function(){
        var self = this;
        self._picIndex--;
        self.showPic();
    };

    BookPreviewView.prototype.setImage = function(url, imageWidth, imageHeight){
        var self = this;
        self._bookImage.css({"width": imageWidth+"px", "height":+imageHeight+"px", "background":"url('"+url+"') no-repeat center"});
        self.setPos();
    };

    BookPreviewView.prototype.setBtnVi = function(){
        var self = this;
        if(self._picIndex == 0){
            self._preBtn.hide();
        }else{
            self._preBtn.show();
        }

        if(self._picIndex == self._picArr.length - 1){
            self._nextBtn.hide();
        }else{
            self._nextBtn.show();
        }
    };

    BookPreviewView.prototype.setPos = function(imageWidth, imageHeight){
        var self = this;
        var cssObj = {};
        cssObj.height = imageHeight+"px";
        self._nextBtn.css(cssObj);
        self._preBtn.css(cssObj);
    };

    BookPreviewView.prototype.bindEvent = function(){
        var self = this;
        self._preBtn.bind("click", function(){
            self.showPrePic();
        });

        self._nextBtn.bind("click", function(){
            self.showNextPic();
        });
    };

    BookPreviewView.prototype.removeEvent = function(){
        var self = this;
        self._preBtn.unbind("click");
        self._nextBtn.unbind("click");
    };

    BookPreviewView.prototype.hide = function(){
        var self = this;
        if(!self._isShow){
            return;
        }
        this._isShow = false;
        self.removeEvent();
        self.$el.remove();
    };

    return new BookPreviewView();
});