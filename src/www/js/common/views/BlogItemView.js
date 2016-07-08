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
            blogMsgNum : ".blog-item-msg",
            blogLoveNum : ".blog-item-love",
            commentDiv : ".blog-comment-region"
        },

        ShowNum : 3,
        //事件添加
        events : {
        },

        /**初始化**/
        initialize : function(){
            // this._commentView = new CommentView();
            console.log("initialize");
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
            self._commentView.pageIn();
        },

        initData : function(data){
            var self = this;
            var url = './images/planning/trends/1.jpg';
            var image = new Image();
            image.onload = function(){
                self.ui.blogImage.css({height:image.height});
            };
            image.src = url;
            self.ui.blogImage.css({background:"url('"+url+"') no-repeat center"});
            self.ui.authorPic.css({background:"url('./images/planning/trends/role-1.png') no-repeat center"});
            self.ui.authorName.html("好像什么也咩有");
            self.ui.authorBrief.html(data.topic);
            self.ui.blogMsgNum.html("199");
            self.ui.blogLoveNum.html("200")
            var opt = {comment_id: "57790e112e958a005595e55e", comment_type: 2};
            self._commentView.setCommentTarget(opt);
        },


        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});