// 文件名称: faceView.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/27 23:00
// 描    述: 颜表情

define([
    'text!common/templates/faceView.html'
],function(tpl){
    var FaceTpl = "<div class='face-item button nowrapTxt'>{0}</div>";
    var FaceView = function(parent){
        var self = this;
        self._isShow = false;
        self.$el = $(tpl);
        self.el = self.$el.get(0);
        self.faceMask = self.$el.find(".face-mask");
        self.faceContent = self.$el.find(".fac-list-div");
        self.$el.appendTo(parent);
        self.initList();
        self.$el.hide();
    };

    /**
     * 显示发布页面
     * @param param.type 1：话题  2：插画
     */
    FaceView.prototype.show = function(cb_ok){
        var self = this;
        if(self._isShow) return;
        self._isShow = true;
        self.$el.show();
        self.callBack = cb_ok;
        self.bindEvent();
    };

    FaceView.prototype.initList = function(){
        var html = "", self = this;
        var list = giliConfig.FaceList;
        for(var i = 0; i<list.length; i++){
            html += FaceTpl.replace("{0}", list[i]);
        }
        self.faceContent.html(html);
    };

    FaceView.prototype.hide = function(){
        var self = this;
        if(!self._isShow) return;
        self._isShow = false;

        self.$el.hide();
        self.removeEvent();
        self.callBack = null;
    };

    FaceView.prototype.onMaskClickHandle = function(e){
        var self = this;
        e.stopPropagation();
        e.preventDefault();
        self.hide();
    };

    FaceView.prototype.onFaceItemClickHandle = function(e){
        var self = this;
        e.stopPropagation();
        e.preventDefault();

        var target = e.target;
        if(target.className.indexOf("face-item") >= 0){
            var val = $(target).html();
            if(self.callBack){
                self.callBack(val);
            }
        }
        self.hide();
    };

    /**
     * 绑定事件
     */
    FaceView.prototype.bindEvent = function(){
        var self = this;
        self.faceMask.on("click", function(e){
            self.onMaskClickHandle(e);
        });
        self.faceContent.on("click", function(e){
            self.onFaceItemClickHandle(e);
        });
    };

    /**
     * 移除事件
     */
    FaceView.prototype.removeEvent = function(){
        var self = this;
        self.faceMask.off("click");
        self.faceContent.off("click");
    };

    FaceView.prototype.destroy = function(){

    };

    return FaceView;
});