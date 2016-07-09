// 文件名称: blogItemView.js
//
// 创 建 人: zhao
// 创建日期: 2016/7/8 22:00
// 描    述: 作品
define([
    'common/base/item_view',
    'text!common/templates/blogItemView.html',
    'marionette',
    'common/views/commentView'
],function(ItemView, tpl, mn, CommentView){
    return ItemView.extend({
        className : "blogItemView",
        template : _.template(tpl),

        // key : selector
        ui : {
            blogImage : ".blog-item-image",
            authorPic : ".blog-item-author-pic",
            authorName : ".blog-item-author-name",
            authorBrief : ".blog-item-author-brief",
            blogMsgNum : ".blog-item-msg-num",
            blogLoveNum : ".blog-item-love-num",
            commentDiv : ".blog-comment-region",
            btnComment : ".blog-item-msg-btn",
            btnLove : ".blog-item-love-num"
        },

        ShowNum : 3,
        //事件添加
        events : {
            "click @ui.btnComment" : "onBtnCommentHandle"
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
            self._commentView = new CommentView();
            self._commentView.render();
            self.ui.commentDiv.append(self._commentView.$el);
            self._commentView.setBlogClass();
            self._commentView.close();
        },

        initData : function(data, commentType){
            var self = this;
            var id = data.objectId;
            var pic = data.pictures[0];
            var userPic = data.user.avatar;
            var userName = data.user.user_nick;
            var brief = data.user.brief;
            var likeNum = data.like_int || 0;
            var comment_int = data.comment_int || 0;
            var image = new Image();
            image.onload = function(){
                self.ui.blogImage.css({height:image.height});
                image = null;
            };
            image.src = pic;
            self.ui.blogImage.css({background:"url('"+pic+"') no-repeat center"});
            self.ui.authorPic.css({background:"url('"+userPic+"') no-repeat center"});
            self.ui.authorName.html(userName);
            self.ui.authorBrief.html(brief);
            self.ui.blogMsgNum.html(comment_int);
            self.ui.blogLoveNum.html(likeNum);

            var opt = {comment_id: id, comment_type: commentType};
            self._commentView.setCommentTarget(opt);
        },

        onBtnCommentHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            if(self._commentView.isShow){
                self._commentView.close();
            }else{
                self._commentView.pageIn();
            }
        },


        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});