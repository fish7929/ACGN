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
            self.likeInt = self.attributes.like_int;
            self.commentInt = self.attributes.comment_int;
            var time = self.attributes.createdAt ? new Date(self.attributes.createdAt) : new Date();
            self.timeStr = utils.formatCreatedTime(time);
            self.commentShow = false;//默认不显示
        }
    });
    return WorkModel;
});
