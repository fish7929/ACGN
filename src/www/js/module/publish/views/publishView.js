// 文件名称: publishView.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/27 23:00
// 描    述: 发布消息

define([
    'text!module/publish/templates/publishView.html',
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
        //文本内容
        self.textArea = self.$el.find(".publishTextArea");
        //标签列表
        self.labelDiv = self.$el.find('.publish-labels');
        //添加标签
        self.inputLabel = self.$el.find(".publish-label-txt");
        //标签删除按钮
        self.labelDel = self.$el.find(".publish-label-del");
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
        self.reset();
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

    PublishView.prototype.reset = function(){
        var self = this;
        self.labelDiv.find("span").remove();
        self.textArea.val("");
        self.inputLabel.val("");
        self.checkInputLabel();
        self.checkDelLabelBtn();
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
        var txt = self.textArea.val(), labels = [];
        var allSpan = self.labelDiv.find("span");
        var size = allSpan.length;
        for(var i=0; i<size; i++){
            labels.push($(allSpan[i]).text());
        }
        console.log(txt);
        console.log(labels);


        self.hide();
    };

    PublishView.prototype.onCloseHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        self.hide();
    };

    PublishView.prototype.onInputKeyDownHandle = function(e){
        var self = this;
        var val = self.inputLabel.val();
        if( e.keyCode == 13 && val){
            self.addNewLabel(val);
        }
    };

    PublishView.prototype.onLabelDelHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        var lastLabel = self.labelDiv.find("span:last");
        if(lastLabel) lastLabel.remove();

        self.checkInputLabel();
        self.checkDelLabelBtn();
    };

    PublishView.prototype.addNewLabel = function(val){
        var self = this;
        var color = utils.getLabelRandomColor();
        var newSpan = $("<span style='background-color: "+color+"'></span>");
        newSpan.text(val);
        newSpan.insertBefore(self.inputLabel);
        self.inputLabel.val("");
        self.checkInputLabel();
        self.checkDelLabelBtn();
    };

    PublishView.prototype.checkInputLabel = function(){
        var self = this;
        var allSpan = self.labelDiv.find("span");
        var lastSpan = self.labelDiv.find("span:last");
        var maxWidth = self.labelDiv.width();
        if(allSpan.length > 0){
            var totalWidth = lastSpan.position().left + lastSpan.outerWidth() + self.inputLabel.outerWidth() + 30;
            console.log(totalWidth, maxWidth);
            if(totalWidth >= maxWidth){
                self.inputLabel.hide();
            }else{
                self.inputLabel.show();
            }
        }else{
            self.inputLabel.show();
        }
    };

    PublishView.prototype.checkDelLabelBtn = function(){
        var self = this;
        var val = self.labelDiv.find("span");
        if(val.length != 0){
            self.labelDel.show();
        }else{
            self.labelDel.hide();
        }
    };

    PublishView.prototype.bindEvent = function(){
        var self = this;
        self.bnClose.on("click", function(e){
            self.onCloseHandle(e);
        });
        self.bnPublish.on("click", function(e){
            self.onPublishHandle(e);
        });
        self.inputLabel.on("keydown", function(e){
            self.onInputKeyDownHandle(e);
        });
        self.labelDel.on("click", function(e){
            self.onLabelDelHandle(e);
        })
    };

    PublishView.prototype.removeEvent = function(){
        var self = this;
        self.bnClose.off("click");
        self.bnPublish.off("click");
        self.inputLabel.off("keydown");
    };

    return new PublishView();
});