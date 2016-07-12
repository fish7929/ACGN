/**
 * Created by GYY on 2016/6/30
 */
define([],function(){
    var WorkModel = Backbone.Model.extend({
        faceOpen:false,//是否打开颜表情窗口
        commentTxt:"",//默认评论内容为空
        hasMoreComment:false, //是否还有更多评论  默认没有
        commentPageSize :5,//评论每页只5条数据
        constructor:function(){
            Backbone.Model.apply(this,arguments);
        },
        initialize:function(){
            var self = this;
            self.likeInt = self.attributes.like_int?self.attributes.like_int:0;
            self.commentInt = self.attributes.comment_int?self.attributes.comment_int:0;
            var time = self.attributes.createdAt ? new Date(self.attributes.createdAt) : new Date();
            self.timeStr = utils.formatCreatedTime(time);
            self.commentShow = false;//默认不显示
            self.commentList = [];//默认评论列表置空
        },
        //查询评论数据
        searchComment:function(cb_ok,cb_err){
            var self = this;
            self.hasMoreComment = false;
            var options = {
                comment_id:self.get("objectId"),
                comment_type:1,
                skip:self.commentList.length,
                limit:self.commentPageSize,
                isdesc:true
            };
            gili_data.getComment(options,function(data){
                if(data.results.length >= self.commentPageSize)
                {
                    self.hasMoreComment = true;
                }
                var tempCommentArr = [];
                for(var i = 0; i < data.results.length; i++){
                    var temp = {};
                    temp.id = data.results[i].id;
                    temp.belong_id = data.results[i].get("belong_id");//话题ID
                    temp.comment_id = data.results[i].get("comment_id");      //话题ID或被回复评论ID
                    temp.content = data.results[i].get("content");
                    temp.comment_type = data.results[i].get("comment_type");
                    temp.user = {};
                    temp.user.userId = data.results[i].get("user").id;
                    temp.user.user_nick = data.results[i].get("user").get("user_nick");
                    temp.user.avatar = data.results[i].get("user").get("avatar");
                    tempCommentArr.push(temp);
                }
                self.commentList = self.commentList.concat(tempCommentArr);
                cb_ok && cb_ok();
            },cb_err)
        },
        //添加评论对象到列表
        addComment:function(data){
            var self = this;
            var temp = {};
            temp.id = data.id;
            temp.belong_id = data.get("belong_id");//话题ID
            temp.comment_id = data.get("comment_id");      //话题ID或被回复评论ID
            temp.content = data.get("content");
            temp.comment_type = data.get("comment_type");
            temp.user ={};
            temp.user.userId = data.get("user").id;
            temp.user.user_nick = data.get("user").get("user_nick");
            temp.user.avatar = data.get("user").get("avatar");
            self.commentList.unshift(temp);
        }
    });
    return WorkModel;
});
