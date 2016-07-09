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
            debugger;
            self.id = self.attributes.id;
            self.userName = self.attributes.attributes.user_nick;
            self.userAddress = self.attributes.attributes.address;
//            self.likeInt = self.attributes.like_int?self.attributes.like_int:0;
        }
    });
    return UserModel;
});
