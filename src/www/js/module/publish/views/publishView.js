// 文件名称: publishView.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/27 23:00
// 描    述: 发布消息
define([
    'text!module/publish/templates/publishView.html'
],function(tpl){
    var PublishView = function(){
        var self = this;
        self._isShow = false;
        self.$el = $(tpl);
        self.el = self.$el.get(0);
        //发布标题
        self.titleTxt = self.$el.find(".publishTitle");
        //
        self.imageContent = self.$el.find(".publishImagesContent");
        self.imageEmptyDiv = self.$el.find(".publishImageEmpty");
        self.imageListDiv = self.$el.find(".publishImageList");
        self.bnClose = self.$el.find(".bn-cancel");
        self.bnPublish = self.$el.find(".bn-publish");
    };


    PublishView.prototype.show = function(param){
        var self = this;
        //发布话题
        if(!param || !param.type) return;
        switch (param.type){
            case "topic":
                self.initTopic();
                break;
            case "ill":
                self.initIll();
                break;
            default:
                return;
        }

        if(self._isShow) return;
        self._isShow = true;
        document.body.appendChild(self.el);
        self.bindEvent();
    };

    PublishView.prototype.initTopic = function(){
        var self = this;
        self.setTitle("发布话题");
        self.imageContent.hide();
    };

    PublishView.prototype.initIll = function(){
        var self = this;
        self.setTitle("发布插画");
        self.imageContent.show();
        self.clearImageContent();

    };

    PublishView.prototype.clearImageContent = function(){
        var self = this;
        self.imageEmptyDiv.show();
        self.imageListDiv.hide();
    };

    PublishView.prototype.setTitle = function(val){
        this.titleTxt.html(val);
    };

    PublishView.prototype.hide = function(){
        var self = this;
        if(!self._isShow){
            return;
        }
        this._isShow = false;
        self.removeEvent();
        self.$el.remove();
    };

    PublishView.prototype.onPublishHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        self.hide();
    };

    PublishView.prototype.onCloseHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        self.hide();
    };

    PublishView.prototype.bindEvent = function(){
        var self = this;
        self.bnClose.on("click", function(e){
            self.onCloseHandle(e);
        });
        console.log("bindEvent");
        self.bnPublish.on("click", function(e){
            console.log("click");
            self.onPublishHandle(e)
        });
    };

    PublishView.prototype.removeEvent = function(){
        var self = this;
        self.bnClose.off("click");
        self.bnPublish.off("click");
    };

    return new PublishView();
});