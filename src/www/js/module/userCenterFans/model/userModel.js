/**
 * Created by Administrator on 2016/7/7.
 */
define([],function(){
    var UserModel = Backbone.Model.extend({
        constructor:function(){
            Backbone.Model.apply(this,arguments);
        },
        initialize:function(){
            var self = this;
            self.id = self.attributes.id;
            self.userName = self.attributes.attributes.user_nick;
            self.userAddress = self.attributes.attributes.address;
            self.userBrief = self.attributes.attributes.brief;
            self.avatar = self.attributes.attributes.avatar;
            self.attentionsNum = self.attributes.attributes.followee_count;
            self.fansNum = self.attributes.attributes.follower_count;
        }
    });
    return UserModel;
});
