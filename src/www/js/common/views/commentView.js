// 文件名称: commentView.js
//
// 创 建 人: zhao
// 创建日期: 2016/7/1 20:50
// 描    述: 评论
define([
    'common/base/item_view',
    'text!common/templates/commentView.html',
    'marionette',
    'common/views/faceView',
    'msgbox'
],function(ItemView, tpl, mn, FaceView, MsgBox){
    var htmlTpl = "<div class=\"comment-list-item\" data-id='{dataId}' user-name='{userName}' user-id='{userId}'>" +
            "<div class=\"comment-left-div\">" +
            "<div class=\"comment-head-pic button\" style='background: url(\"{pic}\") no-repeat center; background-size: 100%'></div>" +
            "<div class=\"comment-floor-txt\">{floor}</div>" +
            "</div>" +
            "<div class=\"comment-right-div\">" +
            "<div class=\"comment-user-name\">{name}</div>" +
            "<div class=\"comment-time\">{data}</div>" +
            "<div class=\"comment-reply button\">回复</div>" +
            "<div class=\"clear wrapTxt comment-content\">{content}</div>" +
            "</div>" +
            "<div class=\"clear\"></div>" +
            "</div>";

    var htmlTpl2 = "<div class=\"comment-list-item\" data-id='{dataId}' user-name='{userName}' user-id='{userId}'>" +
            "<div class=\"comment-left-div\">" +
            "<div class=\"comment-head-pic button\" style='background: url(\"{pic}\") no-repeat center; background-size: 100%'></div>" +
            "<div class=\"comment-floor-txt\">{floor}</div>" +
            "</div>" +
            "<div class=\"comment-right-div\">" +
            "<div class=\"comment-user-name\">{name}</div>" +
            "<div class=\"wrapTxt comment-content\">{content}</div>" +
            "<div class=\"comment-reply button\">回复</div>" +
            "<div class=\"clear comment-time\">{data}</div>" +
            "</div>" +
            "<div class=\"clear\"></div>" +
            "</div>";
    var ReplyTitle = "回复@{name}：";
    return ItemView.extend({
        className : "commentContainer",
        template : _.template(tpl),

        _faceView : null,
        _commentObj : null,
        PageMaxNum : 5,
        currentPage : 0,
        _isLoaded : false,
        isShow : false,
        // key : selector
        ui : {
            noLoginDiv : ".commentLogin",
            commentText : ".comment-textArea",
            bnFace : ".btn-face",
            bnCommit : ".btn-commit",
            faceContainer : ".comment-face-container",
            commentList : ".comment-list",
            bnViewMore : ".comment-view-more-btn"
        },

        //事件添加
        events : {
            "click @ui.bnFace" : "onBnFaceHandle",
            "click @ui.bnCommit" : "onCommitHandle",
            "click @ui.bnViewMore" : "onViewMoreHandle",
            "click @ui.commentList" : "onCommentListHandle"
        },

        /**初始化**/
        initialize : function(){
        },

        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){
        },

        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
            var self = this;
            self._faceView = new FaceView(self.ui.faceContainer);
            self._onFaceSelect = self.onFaceSelect.bind(self);
            self.$el.hide();
        },

        setBlogClass : function(className){
            this.$el.get(0).className = className || "commentContainerBlog";
        },

        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
            var self = this;
            if(self.isShow) return;
            self.isShow = true;
            self.checkLogin();
            self.$el.show();
            self.bindEvent();
            self.ui.commentText.val("");
        },

        startLoadData : function(){
            var self = this;
            self.reset();
            self.addNextPage();
        },

        loadOneData : function(){
            var self = this;
            if(self._isLoaded) return;
            self.startLoadData();
        },

        onCommentListHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var target = e.target;
            var parent = $(target).parents(".comment-list-item");
            if(!parent) return;
            var commentId = parent.attr("data-id");
            var commentUserName = parent.attr("user-name");
            var commentUserId = parent.attr("user-id");
            if(!commentId) return;
            if(target.className.indexOf("comment-reply") >= 0){
                self.ui.commentText.focus();
                self.setReplyObj(commentId, commentUserId, commentUserName);
                var str = ReplyTitle.replace("{name}", commentUserName);
                self.ui.commentText.val(str);
            }else if(target.className.indexOf("comment-head-pic") >= 0){
                app.navigate("#userCenter/"+commentUserId, {replace: false, trigger: true});
            }
        },

        setReplyObj : function(c_id, c_user_id, c_user_name){
            this.replyObj = {};
            this.replyObj.comment_id = c_id;
            this.replyObj.user_id = c_user_id;
            this.replyObj.user_name = c_user_name;
        },

        onViewMoreHandle : function(e){
            e.stopPropagation();
            e.preventDefault();

            var self = this;
            self.currentPage++;
            self.addNextPage();
        },

        checkLogin : function(){
            var self = this;
            if(gili_data.getCurrentUser()){
                self.ui.noLoginDiv.hide();
                self.ui.commentText.show();
            }else{
                self.ui.noLoginDiv.show();
                self.ui.commentText.hide();
            }
        },

        reset : function(){
            var self = this;
            self.ui.commentList.find(".comment-list-item").remove();
            self.currentPage = 0;
        },

        addNextPage : function(){
            var self = this;
            if(!self._commentObj || !self._commentObj.comment_type || !self._commentObj.comment_id) return;
            var opt = {};
            opt.comment_id = self._commentObj.comment_id;
            opt.comment_type = self._commentObj.comment_type;
            opt.isdesc = true;
            opt.skip = self.currentPage * self.PageMaxNum;
            opt.limit = self.PageMaxNum;
            gili_data.getComment(opt, function(data){
                if(data && data.results){
                    var len = data.results.length;
                    if(len < self.PageMaxNum){
                        self.ui.bnViewMore.hide();
                    }else{
                        self.ui.bnViewMore.show();
                    }

                    if(len > 0){
                        data = utils.convert_2_json(data.results);
                        self.addCommentItem(data);
                    }
                }else{
                    self.ui.bnViewMore.hide();
                }
            }, function(err){
                console.log(err);
            })
        },

        addCommentItem : function(data){
            if(!data || data.length==0) return;
            var self = this, html = "";
            for(var i = 0; i < data.length; i++){
                html += self.getCommentHtml(data[i]);
            }
            self.ui.commentList.append(html);
            app.triggerMethod("update:masonry:list");
        },

        getCommentHtml : function(obj){
            var self = this;
            var id, user_nick, name, user_pic, content, createdAt, floor, userId, html = "";
            id = obj.objectId;
            if(self.ui.commentList.find(".comment-list-item[data-id="+id+"]").get(0)){
                return html;
            }
            floor = "";
            userId = obj.user.objectId || "";
            name = user_nick = obj.user.user_nick || "";
            user_pic = obj.user.avatar || "";
            content = obj.content || "";
            createdAt = obj.createdAt || Date.now();

            if(obj.comment_type == 5){
                try {
                    var contentObj = JSON.parse(content);
                    content = ReplyTitle.replace("{name}", contentObj.uname) + contentObj.content;
                }catch(e) {
                    content = "";
                }
            }
            var tpl = htmlTpl;
            if(self.$el.get(0).className == "commentContainerBlog"){
                content = "<span>"+user_nick+"：</span>"+content;
                tpl = htmlTpl2;
                name = "";
            }
            html = tpl.replace("{dataId}", id).replace("{userName}", user_nick).replace("{userId}", userId).replace("{floor}", floor).replace("{name}", name).replace("{pic}", user_pic)
                .replace("{content}", content).replace("{data}", utils.formatTime(createdAt, "yyyy.MM.dd HH.mm"));
            return html;
        },

        insertComment : function(data){
            var self = this;
            self.ui.commentList.prepend(self.getCommentHtml(data));
            app.triggerMethod("update:masonry:list");
            if(self.addCommentCallBack){
                self.addCommentCallBack();
            }
        },

        /**
         *
         * @param obj{}
         * obj.comment_id
         * obj.comment_type
         */
        setCommentTarget : function(obj){
            var self = this;
            self._commentObj = obj;
            self.addCommentCallBack = obj.addCommentCallBack;
        },

        onCommitHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;

            if(!gili_data.getCurrentUser()){
                MsgBox.alert(giliConfig.Tip.NOLOGIN);
                return;
            }

            if(!self._commentObj || !self._commentObj.comment_type || !self._commentObj.comment_id) return;
            var str = self.ui.commentText.val();
            if(str == ""){
                MsgBox.toast(giliConfig.Tip.COMMENT_ERROR);
                return;
            }
            var opt = {};
            opt.belong_id = self._commentObj.comment_id;
            opt.comment_id = opt.belong_id;
            opt.comment_type = self._commentObj.comment_type;
            opt.content = str;
            //content,评论内容，blog评论内容：XXXXX ,如果为评论的评论进行回复的评论则为：{"content":"回复信息","uname":“刘德华”,"uid":“用户id”}，显示为：用户头像名字 + 回复@张三+ 回复内容
            if(self.replyObj){
                var replyStr = ReplyTitle.replace("{name}", self.replyObj.user_name);
                if(str.indexOf(replyStr) == 0){
                    opt.comment_type = 5;
                    opt.comment_id = self.replyObj.comment_id;
                    var strJson = {};
                    strJson.content = str.replace(replyStr, "");
                    strJson.uname = self.replyObj.user_name;
                    strJson.uid = self.replyObj.user_id;
                    opt.content = JSON.stringify(strJson);
                }
            }
            gili_data.snsSaveComment(opt, function(data){
                data = utils.convert_2_json(data);
                self.insertComment(data);
                self.ui.commentText.val("");
                self.replyObj = null;
                MsgBox.toast(giliConfig.Tip.COMMENT_SUCCESS, true);
            }, function(err){
                MsgBox.toast(giliConfig.Tip.COMMENT_FAIL+err, false);
            })
        },

        onBnFaceHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            if(!gili_data.getCurrentUser()){
                MsgBox.alert(giliConfig.Tip.NOLOGIN);
                return;
            }

            self._faceView.show(self._onFaceSelect)
        },

        onFaceSelect : function(val){
            var self = this;
            var str = self.ui.commentText.val()+val;
            self.ui.commentText.val(str);
        },

        bindEvent : function(){
            var self = this;
            app.on("login:ok", self.checkLogin, self);
            app.on("logOut:ok", self.checkLogin, self);
        },

        removeEvent : function(){
            app.off("login:ok", self.checkLogin, self);
            app.off("logOut:ok", self.checkLogin, self);
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            var self = this;
            if(!self.isShow) return;
            self.isShow = false;
            self.removeEvent();
            self.$el.hide();
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});