// 文件名称: blogItemView.js
//
// 创 建 人: zhao
// 创建日期: 2016/7/8 22:00
// 描    述: 作品
define([
    'common/base/item_view',
    'text!common/templates/blogItemView.html',
    'marionette',
    'common/views/commentView',
    'module/book/views/bookPreviewView'
],function(ItemView, tpl, mn, CommentView, BookPreviewView){
    return ItemView.extend({
        className : "blogItemView",
        template : _.template(tpl),

        // key : selector
        ui : {
            blogImageDiv : ".blog-item-image",
            authorPic : ".blog-item-author-pic",
            authorName : ".blog-item-author-name",
            authorBrief : ".blog-item-author-brief",
            blogMsgNum : ".blog-item-msg-num",
            blogLoveNum : ".blog-item-love-num",
            commentDiv : ".blog-comment-region",
            btnComment : ".blog-item-msg-btn",
            btnLove : ".blog-item-love-btn"
        },

        ShowNum : 3,
        //事件添加
        events : {
            "click @ui.blogImageDiv" : "onBlogImageHandle",
            "click @ui.btnComment" : "onBtnCommentHandle",
            "click @ui.btnLove" : "onBtnLoveHandle"
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
        },

        initData : function(data, commentType){
            var self = this;
            self.data = data;
            var id = data.objectId;
            var pic = data.pictures[0] || "";
            var userPic = data.user.avatar;
            var userName = data.user.user_nick;
            var brief = data.user.brief;
            var likeNum = data.like_int || 0;
            var comment_int = data.comment_int || 0;

            self.ui.blogImageDiv.find("img").remove();

            if(pic){
                var image = new Image();
                image.src = pic;
                $(image).addClass("button");
                self.ui.blogImageDiv.append(image)
            }
            self.ui.authorPic.css({background:"url('"+userPic+"') no-repeat center"});
            self.ui.authorName.html(userName);
            self.ui.authorBrief.html(brief);
            self.ui.blogMsgNum.html(comment_int);
            self.ui.blogLoveNum.html(likeNum);

            var opt = {comment_id: id, comment_type: commentType};
            opt.addCommentCallBack = function(){
                var val = self.ui.blogMsgNum.html();
                self.ui.blogMsgNum.html(parseInt(val) + 1);
            };
            self._commentView.setCommentTarget(opt);

            var isLike = utils.isLiked(id);
            if(isLike){
                self.setBtnLoveState(1);
            }else{
                self.setBtnLoveState(0);
            }
        },

        onBlogImageHandle : function(e){
            var self = this;
            if(self.data && self.data.pictures && self.data.pictures.length){
                BookPreviewView.show(self.data.pictures);
            }
        },

        onBtnCommentHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            if(self._commentView.isShow){
                self._commentView.close();
            }else{
                self._commentView.pageIn();
                self._commentView.loadOneData();
            }
            app.triggerMethod("update:masonry:list");
        },

        onBtnLoveHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var id = self.data.objectId;
            if(!id) return;

            var isLike = utils.isLiked(id);
            var type = 0;
            if(!isLike){
                type = 1;
            }
            utils.likeTopic(type, id, function(data){
                self.setBtnLoveState(type);
                self.setLoveNum(type);
            })
        },

        setLoveNum : function(type){
            var self = this;
            var value = parseInt(self.ui.blogLoveNum.html());
            if(type == 1){
                self.ui.blogLoveNum.html(value + 1)
            }else{
                self.ui.blogLoveNum.html(value - 1)
            }
        },

        setBtnLoveState : function(type){
            var self = this;
            if(type == 1){
                self.ui.btnLove.addClass("onSelect");
            }else{
                self.ui.btnLove.removeClass("onSelect");
            }
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});