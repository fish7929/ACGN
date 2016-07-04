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
    var htmlTpl = "<div class=\"comment-list-item\">" +
            "<div class=\"comment-left-div\">" +
            "<div class=\"comment-head-pic\"></div>" +
            "<div class=\"comment-floor-txt\">{floor}</div>" +
            "</div>" +
            "<div class=\"comment-right-div\">" +
            "<div class=\"comment-user-name\">{name}</div>" +
            "<div class=\"comment-time\">{data}</div>" +
            "<div class=\"comment-reply\">回复</div>" +
            "<div class=\"clear wrapTxt comment-content\">{content}</div>" +
            "</div>" +
            "<div class=\"clear\"></div>" +
            "</div>";
    return ItemView.extend({
        className : "commentContainer",
        template : _.template(tpl),

        _faceView : null,
        _commentObj : null,
        // key : selector
        ui : {
            noLoginDiv : ".commentLogin",
            commentText : ".comment-textArea",
            bnFace : ".btn-face",
            bnCommit : ".btn-commit",
            faceContainer : ".comment-face-container",
            commentList : ".comment-list"
        },

        //事件添加
        events : {
            "click @ui.bnFace" : "onBnFaceHandle",
            "click @ui.bnCommit" : "onCommitHandle"
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
        },

        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
            var self = this;
            if(gili_data.getCurrentUser()){
                self.ui.noLoginDiv.hide();
                self.ui.commentText.show();
            }else{
                self.ui.noLoginDiv.show();
                self.ui.commentText.hide();
            }
            self.$el.show();
        },

        setCommentTarget : function(obj){
            this._commentObj = obj;
        },

        onCommitHandle : function(){
            var self = this;
            if(!self._commentObj || !self._commentObj.type || !self._commentObj.comment_id) return;
            var str = self.ui.commentText.val();
            if(str == ""){
                MsgBox.toast(Tip.COMMENT_ERROR);
                return;
            }
            var opt = {};
            opt.comment_id = self._commentObj.comment_id;
            opt.comment_type = self._commentObj.comment_type;
            opt.content = str;
            console.log(opt);
            gili_data.snsSaveComment(opt, function(data){
                console.log(123);
            }, function(err){
                console.log(456);
            })
        },

        onBnFaceHandle : function(){
            var self = this;
            self._faceView.show(self._onFaceSelect)
        },

        onFaceSelect : function(val){
            var self = this;
            var str = self.ui.commentText.val()+val;
            self.ui.commentText.val(str);
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