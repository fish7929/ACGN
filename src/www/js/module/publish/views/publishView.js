// 文件名称: publishView.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/27 23:00
// 描    述: 发布消息

define([
    'text!module/publish/templates/publishView.html',
    'common/views/faceView',
    'common/service/upload_taskschedule',
    'msgbox',
    'config/TipConfig'
],function(tpl, FaceView, uploadTaskSchedule, MsgBox, Tip){
    var ImageTpl = "<div class=\"publishImageItem\" style='background: url(\"{0}\") no-repeat center; background-size: 100% {1}'> " +
        "<div class=\"publishImageItem-del button\"></div>" +
        "</div>";
    var PublishView = function(){
        var self = this;
        self._isShow = false;
        self.$el = $(tpl);
        self.el = self.$el.get(0);
        //发布标题
        self.titleTxt = self.$el.find(".publishTitle");
        //
        self.imageContent = self.$el.find(".publishImagesContent");

        self.imageListDiv = self.$el.find(".publishImageList");
        //单个图片增加
        self.btnImageAddSingle = self.$el.find(".btn-image-single");
        //新增图片按钮
        self.btnImageAdd = self.$el.find(".publishImageAddItem");
        self.imageEmptyDiv = self.$el.find(".publishImageEmpty");
        //选择图片按钮
        self.btnEmptyImage = self.$el.find(".publishImageEmptyImage");
        //input image
        self.inputImage = self.$el.find(".publishImageInput");
        //颜表情按钮
        self.bnFace = self.$el.find(".btn-face");
        //取消按钮
        self.bnClose = self.$el.find(".bn-cancel");
        //发布按钮
        self.bnPublish = self.$el.find(".bn-publish");
        //文本内容
        self.textArea = self.$el.find(".publishTextArea");
        //标签列表
        self.labelDiv = self.$el.find('.publish-labels');
        //添加标签
        self.inputLabel = self.$el.find(".publish-label-txt");
        //标签删除按钮
        self.labelDel = self.$el.find(".publish-label-del");

        self.faceContainer = self.$el.find(".publish-face-container");

        self.MAXIMAGENUM = 10;
        //发布类型
        self.publishType = 1;

        self._faceView = new FaceView(self.faceContainer);

        //
        self._topicImage = "";
    };

    /**
     * 显示发布页面
     * @param param.type 1：话题  2：插画
     */
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

    /**
     * 初始化话题
     */
    PublishView.prototype.initTopic = function(){
        var self = this;
        self.setTitle(Tip.PUBLISHTOPICTITLE);
        self.publishType = 1;
        self.imageContent.hide();
        self.btnImageAddSingle.show();
    };

    /**
     * 初始化插画
     */
    PublishView.prototype.initIll = function(){
        var self = this;
        self.setTitle(Tip.PUBLISHILLTITLE);
        self.publishType = 2;
        self.btnImageAddSingle.hide();
        self.imageContent.show();
        self.clearImageContent();
    };

    /**
     * 重置内容
     */
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
        self.imageListDiv.find(".publishImageItem").remove();
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

    /**
     * 发布按钮事件
     * @param e
     */
    PublishView.prototype.onPublishHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        if(self.publishType == 1 && self.textArea.val() == ""){
            //提示返回
            MsgBox.alert(Tip.PUBLISH_ERROR_1);
            return;
        }else if(self.publishType == 2 && self.imageListDiv.find(".publishImageItem").length ==0){
            //提示返回
            MsgBox.alert(Tip.PUBLISH_ERROR_2);
            return;
        }

        if(uploadTaskSchedule.isFinish == false) {
            app.off("upload_taskschedule_finished").on("upload_taskschedule_finished", function () {
                self.onUploadTaskComplete();
                app.off("upload_taskschedule_finished");
            });
        }
        else{
            self.onUploadTaskComplete();
        }
    };

    PublishView.prototype.onUploadTaskComplete = function(e){
        var self = this;
        var data = self.getPublishData();
        gili_data.addBlog(data, function(){
            MsgBox.toast(Tip.PUBLISH_SUCCESS, true);
            self.hide();
        }, function(err){
            MsgBox.alert(Tip.PUBLISH_FAIL+err);
        })

    };

    /**
     * 颜表情点击事件
     * @param e
     */
    PublishView.prototype.onFaceHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        this._faceView.show();
    };

    /**
     * 获取发布数据
     * @returns {{}}
     */
    PublishView.prototype.getPublishData = function(){
        var self = this, result = {}, i;
        var topic = self.textArea.val(), labels = [], pictures = [];
        var allSpan = self.labelDiv.find("span");
        var size = allSpan.length;
        for(i=0; i<size; i++){
            labels.push($(allSpan[i]).text());
        }

        result.topic = topic;
        result.labels = labels;
        result.blog_type = self.publishType;
        if(self.publishType == 1){
            if(self._topicImage != "") pictures = [self._topicImage];
        }else if(self.publishType == 2){
            var allPics = self.imageListDiv.find(".publishImageItem");
            for(i=0; i<allPics.length; i++){
                if(i>=self.MAXIMAGENUM) break;
                var url = $(allPics[i]).attr("data-url");
                pictures.push(url);
            }
        }
        result.pictures = pictures;
        return result;
    };

    /**
     * 取消按钮事件
     * @param e
     */
    PublishView.prototype.onCloseHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        self.hide();
    };

    /**
     * 键盘回车增加标签事件
     * @param e
     */
    PublishView.prototype.onInputKeyDownHandle = function(e){
        var self = this;
        var val = self.inputLabel.val();
        if( e.keyCode == 13 && val){
            self.addNewLabel(val);
        }
    };

    /**
     * 删除标签事件
     * @param e
     */
    PublishView.prototype.onLabelDelHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        var lastLabel = self.labelDiv.find("span:last");
        if(lastLabel) lastLabel.remove();

        self.checkInputLabel();
        self.checkDelLabelBtn();
    };

    /**
     * 添加新标签
     * @param val
     */
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

    /**
     * 检查输入标签框是否显示
     */
    PublishView.prototype.checkInputLabel = function(){
        var self = this;
        var allSpan = self.labelDiv.find("span");
        var lastSpan = self.labelDiv.find("span:last");
        var maxWidth = self.labelDiv.width();
        if(allSpan.length > 0){
            var totalWidth = lastSpan.position().left + lastSpan.outerWidth() + self.inputLabel.outerWidth() + 30;
            if(totalWidth >= maxWidth){
                self.inputLabel.hide();
            }else{
                self.inputLabel.show();
            }
        }else{
            self.inputLabel.show();
        }
    };

    /**
     * 检测是否显示删除按钮
     */
    PublishView.prototype.checkDelLabelBtn = function(){
        var self = this;
        var val = self.labelDiv.find("span");
        if(val.length != 0){
            self.labelDel.show();
        }else{
            self.labelDel.hide();
        }
    };

    //图片选择
    /**
     * 点击按钮选择图片
     */
    PublishView.prototype.onImageListDivClick = function(e){
        e.stopPropagation();
        e.preventDefault();
        var target = e.target;
        if(target.className.indexOf("publishImageItem-del")>=0){
            $(target).parents(".publishImageItem:first").remove();
        }
    };

    PublishView.prototype.onAddImageHandle = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        var event = utils.createEvent("click");
        self.inputImage.get(0).dispatchEvent(event);
    };

    PublishView.prototype.onInputImageChange = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        var files = e.target.files;
        var filesArr = [];
        var len = self.imageListDiv.find(".publishImageItem").length;
        for(var i=0; i + len < self.MAXIMAGENUM; i++){
            if(i >= files.length) break;
            filesArr.push(files[i]);
        }
        
        self.readFileList(filesArr, [], function(result){
            if(self.publishType == 1){
                self.addTopicImages(result);
            }else{
                self.addIllImages(result);
            }
        }, function(err){
            console.log(err);
        })
    };

    PublishView.prototype.addIllImages = function(list){
        var self = this, newImage;
        var len = self.imageListDiv.find(".publishImageItem").length;
        for(var i = 0; i<list.length; i++){
            var style = ""
            if((len+i+1)%5 == 0){
                style += ";margin-right:0";
            }

            if((len+i+1) > 4){
                style += ";margin-top:8px";
            }
            newImage = $(ImageTpl.replace("{0}", list[i]).replace("{1}", style));
            newImage.insertBefore(self.btnImageAdd);

            uploadTaskSchedule.addUploadTask(list[i], function(obj, file){
                var $obj = $(obj);
                $obj.attr("data-url", file.url());
            }, newImage);
        }
        self.checkImageEmptyDiv();
        self.checkImageButtonAdd();
    };

    PublishView.prototype.addTopicImages = function(list){
        var self = this;
        uploadTaskSchedule.addUploadTask(list[0], function(obj, file){
            self._topicImage = file.url();
        });
    };

    PublishView.prototype.checkImageEmptyDiv = function(){
        var self = this;
        var len = self.imageListDiv.find(".publishImageItem").length;
        if(len > 0){
            self.imageListDiv.show();
            self.imageEmptyDiv.hide();
        }else{
            self.imageListDiv.hide();
            self.imageEmptyDiv.show();
        }
    };

    PublishView.prototype.checkImageButtonAdd = function(){
        var self = this;
        var len = self.imageListDiv.find(".publishImageItem").length;
        if(len >= self.MAXIMAGENUM){
            self.btnImageAdd.hide();
        }else{
            self.btnImageAdd.show();
        }
    };

    PublishView.prototype.onSelectFaceHandle = function(val){
        var self = this;
        if(val){
            var str = self.textArea.val()+val;
            self.textArea.val(str);
        }
    };


    /**
     * 读取base64图片
     * @param fileList
     * @param result
     * @param cb_ok
     * @param cb_err
     */
    PublishView.prototype.readFileList = function(fileList, result, cb_ok, cb_err){
        var self = this;
        var readFile = function(file, cb_ok, cb_err){
            //判断类型是不是图片
            if(!/image\/\w+/.test(file.type)){
                cb_err("请选择图像类型文件");
                return;
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e){
                cb_ok(e.target.result);
            };
            reader.onerror = function(e){
                cb_err(e);
            };
        };
        if(fileList.length == 0){
            cb_ok(result);
            return;
        }

        var file = fileList.shift();
        readFile(file, function(data){
            result.push(data);
            self.readFileList(fileList, result, cb_ok, cb_err);
        }, function(e){
            cb_err(e);
        })
    };

    /**
     * 绑定事件
     */
    PublishView.prototype.bindEvent = function(){
        var self = this;
        self.bnClose.on("click", function(e){
            self.onCloseHandle(e);
        });
        self.bnPublish.on("click", function(e){
            self.onPublishHandle(e);
        });
        self.bnFace.on("click", function(e){
            self.onFaceHandle(e);
        });
        self.inputLabel.on("keydown", function(e){
            self.onInputKeyDownHandle(e);
        });
        self.labelDel.on("click", function(e){
            self.onLabelDelHandle(e);
        });
        self.btnEmptyImage.on("click", function(e){
            self.onAddImageHandle(e);
        });
        self.btnImageAdd.on("click", function(e){
            self.onAddImageHandle(e);
        });
        self.btnImageAddSingle.on("click", function(e){
            self.onAddImageHandle(e);
        });
        self.inputImage.on("change", function(e){
            self.onInputImageChange(e);
        });
        self.imageListDiv.on("click", function(e){
            self.onImageListDivClick(e);
        });
        app.on("on:face:select", self.onSelectFaceHandle, self);
    };

    /**
     * 移除事件
     */
    PublishView.prototype.removeEvent = function(){
        var self = this;
        self.bnClose.off("click");
        self.bnPublish.off("click");
        self.bnFace.off("click");
        self.inputLabel.off("keydown");
        self.labelDel.off("click");
        self.btnEmptyImage.off("click");
        self.btnImageAdd.off("click");
        self.inputImage.off("change");
        self.imageListDiv.off("click");
        app.off("on:face:select", self.onSelectFaceHandle, self);
    };

    return new PublishView();
});