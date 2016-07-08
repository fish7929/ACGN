/**
 * Created by guyy on 2016/7/9.
 * 社团model
 */
define([
    'backbone'
],function(){
    var associationsModel = Backbone.Model.extend({
        constructor:function(){
            Backbone.Model.apply(this,arguments);
        },
        initialize:function(){
            var self = this;
            self.set({"userHeaderImg":"","userNick":"匿名用户","userBrief":"(个人简介)","fansNum":0,"attentionNum":0});
            self.set({"otherShow":"","btnText":"关注","attEdClass":""});
            self.set({"firstLiShow":"","secondLiShow":"","thirdLiShow":""});
        }

    });
    return associationsModel;
});