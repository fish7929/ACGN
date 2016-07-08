/**
 * Created by GYY on 2016/6/30
 */
define([],function(){
    var WorkModel = Backbone.Model.extend({
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
        },
        //查询评论数据
        searchComment:function(cb_ok,cb_err){
            debugger;
            var self = this;
            var tempCommentArr = [];
            if(self.commentList && self.commentList.length > 0){
                tempCommentArr = [
                    {comment_id: "0000006", user: {user_nick: "留言作者6", avatar: "images/temp/info_pic/head8.png"}, "content": "我爱大雄大雄大雄爱猪猪侠18888", comment_type: 1, status: 0},
                    {comment_id: "0000007", user: {user_nick: "留言作者7", avatar: "images/temp/info_pic/head9.png"}, "content": "我爱大雄大雄大雄爱猪猪侠99999", comment_type: 1, status: 0},
                ];
                self.commentList = self.commentList.concat(tempCommentArr);
            }else {
                tempCommentArr = [
                    {comment_id: "0000001", user: {user_nick: "留言作者1", avatar: "images/temp/info_pic/head3.png"}, "content": "我爱大雄大雄大雄爱猪猪侠1111", comment_type: 1, status: 0},
                    {comment_id: "0000002", user: {user_nick: "留言作者2", avatar: "images/temp/info_pic/head4.png"}, "content": "我爱大雄大雄大雄爱猪猪侠2222", comment_type: 1, status: 0},
                    {comment_id: "0000003", user: {user_nick: "留言作者3", avatar: "images/temp/info_pic/head5.png"}, "content": "我爱大雄大雄大雄爱猪猪侠33333", comment_type: 1, status: 0},
                    {comment_id: "0000004", user: {user_nick: "留言作者4", avatar: "images/temp/info_pic/head6.png"}, "content": "我爱大雄大雄大雄爱猪猪侠44444", comment_type: 1, status: 0},
                    {comment_id: "0000005", user: {user_nick: "留言作者5", avatar: "images/temp/info_pic/head7.png"}, "content": "我爱大雄大雄大雄爱猪猪侠55555", comment_type: 1, status: 0}
                ];
                self.commentList = tempCommentArr;
            }
            cb_ok && cb_ok();
        }
    });
    return WorkModel;
});
