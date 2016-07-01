/**
 * Created by GYY on 2016/6/30
 */
define([
    'module/userCenter/model/workModel',
    'text!module/userCenter/templates/workItem.html',
    'marionette'
],function(workModel,workItemTpl,mn){
    var WorkItemView = Marionette.ItemView.extend({
        template: _.template(workItemTpl),
        model:workModel,
        pageSize:10, //每页10冬条
        events:{
            "click .info-detail-comment":"_clickCommentHandler",
            "click .info-detail-zan":"_clickZanHandler"
        },
        initialize:function(){
        },
        render:function(){
            Marionette.ItemView.prototype.render.call(this);
        },
        serializeData:function() {
            var self = this;
            data = Marionette.ItemView.prototype.serializeData.apply(this,arguments);
            data.likeInt = self.model.likeInt;
            data.commentInt = self.model.commentInt;
            data.timeStr = self.model.timeStr;
            //话题类型 1文字话题   2插画话题（文字可有可无，图片最多10张）
            data.type = self.model.get("type");
            if(data.type == 1) {
                data.articleHtml = self.getArticle();
                data.picHtml = "";
                data.descHtml = "";
            }else{
                data.articleHtml = "";
                data.picHtml = self.getPic();
                data.descHtml = self.getDesc();
            }
            if(self.model.commentShow){
                data.commentShow = "style='display:block;'";
            }else{
                data.commentShow = "style='display:none;'";
            }
            data.commentHtml = self.getComment();
            return data;
        },
        //获取类型为1的话题 内容
        getArticle:function(){
            var articleHtml = "";
            console.log("1111");
            var topic = this.model.get("topic");
            console.log(topic);
            articleHtml = this.topicTpl({topicStr:topic});
            return articleHtml;
        },
        //获取类型2的话题  插画显示第一张 并显示共几张
        getPic:function(){
            var picHtml = "";
            var picLen = this.model.get("pictures").length;
            if(picLen > 0) {
                var firstUrl = this.model.get("pictures")[0];
                picHtml = this.picTpl({firstImg: firstUrl});
            }
            return picHtml;
        },
        //获得类型2的话题 附带的话题（可能无）
        getDesc:function(){
            var descHtml = "";
            var topic = this.model.get("topic");
            if(topic && topic != ""){
                descHtml = this.topic2Tpl({topicStr:topic});
            }
            return descHtml;
        },
        topicTpl: _.template('<div class="info-article"><%=topicStr%></div>'),
        picTpl: _.template('<img class="uc-info-pic" src="<%=firstImg %>" alt="" style="display: block; margin:23px auto 0 auto; max-width: 600px; "/>'),
        topic2Tpl: _.template('<div class="info-article"><%=topicStr%></div>'),
        //获取评论列表
        getComment:function(){
            var commentHtml = '<div class="commentListCon">';
            var commentArr = this.model.get("commentList");
            if(!commentArr || commentArr.length <= 0)return commentHtml;
            for(var i = 0; i < commentArr.length; i++){
                var comment = commentArr[i];
                var commentTime = comment.createdAt ? new Date(comment.createdAt):new Date();
                var commentTimeStr = utils.formatCreatedTime(commentTime);
                commentHtml += this.commentTpl.template({headUrl:comment.user.avatar,
                    commentName:comment.user.username,commentTime:commentTimeStr,commentTxt:comment.content});
            }
            commentHtml += '</div><div class="commentMore"></div>';
            return commentHtml;
        },
        commentTpl: _.template('<div class="commentItem"><div class="commentHead" style="background:url(\'<%=headUrl%>\') no-repeat #f7f7f7 center; background-size:cover;"></div><div class="commentData">'+
            '<div class="commentName"><%=commentName %>&nbsp;<span class="sp_time"><%=commentTime %></span><span class="sp_reply">回复</span></div>'+
            '<div class="commentContext"><%=commentTxt %></div></div></div>'),
        //点击评论图片，显示评论列表或隐藏
        _clickCommentHandler:function(e){
            this.model.commentShow = !this.model.commentShow;
            this.render();
        },
        //点赞/取消点赞
        _clickZanHandler:function(e){

        }
    });
    return WorkItemView;
});
