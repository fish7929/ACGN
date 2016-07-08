/**
 * Created by GYY on 2016/7/7
 */
define([
    'module/userCenterFans/model/userModel',
    'text!module/userCenterFans/templates/fansItem.html',
    'marionette',
    'msgbox'
],function(userModel,fansItemTpl,mn,MsgBox){
    var FansItemView = Marionette.ItemView.extend({
        template: _.template(fansItemTpl),
        model:userModel,
        events:{
        },
        initialize:function(){
        },
        render:function(){
            Marionette.ItemView.prototype.render.call(this);
        },
        serializeData:function() {
            var self = this;
            data = Marionette.ItemView.prototype.serializeData.apply(this,arguments);
            data.name = "我就是我";
            data.avatar = "images/temp/info_pic/head1.png";
            data.address = "住址";
            data.brief = "我是简介";
            data.attentionNum = self.model.followee_count || 0;
            data.fansNum = self.model.follower_count || 0;
            data.attentionClass = "";//未关注
            data.btnName = "关注";
            if(utils.isAttention(self.model.id)){
                data.btnName = "已关注";
                data.attentionClass = "btnAttentionEd";
            }
            return data;
        }

    });
    return FansItemView;
});
