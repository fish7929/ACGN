/**
 * Created by Administrator on 2016/6/29.
 */
define([
    'backbone'
],function(){
    var userCenterModel = Backbone.Model.extend({
        constructor:function(){
            Backbone.Model.apply(this,arguments);
        },
        initialize:function(){
            var self = this;
            self.set({"firstLiShow":"","secondLiShow":"","thirdLiShow":""});
        },
        /**
         * 根据type值选中对应页签
         * @param type 0动态  1粉丝  2关注
         */
        setSelected:function(type){
            var self = this;
            self.set({"firstLiShow":"","secondLiShow":"","thirdLiShow":""});
            if(type == 0){
                self.set({"firstLiShow":"li_ck"});
            }else if(type == 1){
                self.set({"secondLiShow":"li_ck"});
            }else if(type == 2){
                self.set({"thirdLiShow":"li_ck"});
            }
        }
    });
    return userCenterModel;
});