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
        mouseLock:false,//按钮锁
        events:{
            "click .fans-item-head-img":"clickHeaderHandler", //点击头像进入用户中心
            "click .btnAttention":"clickAttentionsHandler" //点击关注/取消关注
        },
        initialize:function(){
        },
        render:function(){
            Marionette.ItemView.prototype.render.call(this);
        },
        serializeData:function() {
            var self = this;
            data = Marionette.ItemView.prototype.serializeData.apply(this,arguments);
            //当前是否第偶数个粉丝/关注 对象
            if(utils.fansListTemp1) {
                data.itemClass = "fans-item-2";
            }else{
                data.itemClass = "";
            }
            utils.fansListTemp1 = !utils.fansListTemp1;
            data.id = self.model.id;
            data.name = self.model.userName;
            data.avatar = self.model.avatar || "images/login/common-user.jpg";
            data.address = self.model.userAddress;
            data.brief = self.model.userBrief
            data.attentionNum = self.model.attentionsNum || 0;
            data.fansNum = self.model.fansNum || 0;
            data.attentionClass = "";//未关注
            data.btnName = "关注";
            if(utils.isAttention(self.model.id)){
                data.btnName = "取消关注";
                data.attentionClass = "btnAttentionEd";
            }
            var loginUser = gili_data.getCurrentUser();
            //当前用户不可关注或取消关注，按钮隐藏
            if(loginUser && loginUser.id == self.model.id){
                data.attentionClass = "btnHide";
            }
            return data;
        },
        clickHeaderHandler:function(e){
            var self = this;
            var uId= self.model.id;
            app.navigate("userCenter/"+uId,{trigger:true,replace:false});
        },
        clickAttentionsHandler:function(e){
           var self = this;
            var target = $(e.target);
            if(!gili_data.getCurrentUser()){
                MsgBox.toast(gili_config.Tip.NOLOGIN,false);
                return;
            }
            if(self.mouseLock)return;
            self.mouseLock = true;
            //点击取消关注
            if(target.hasClass("btnAttentionEd")){
                MsgBox.ask("确定取消关注吗?","",function(type){
                    if(type == MsgBox.YES){//确定
                        utils.attentionUser(0,self.model.id,function(){
                                //如果是关注列表，取消关注后删除 列表需整体重新渲染
                                app.trigger("fansList:attentions:change",[self.model.id,0]);
                                self.mouseLock = false;
                            },
                            function(err){
                                MsgBox.toast(err,false);
                                self.mouseLock = false;
                            });
                    }else{
                        self.mouseLock = false;
                    }
                });
            }else{//点击关注
                //默认关注成功
                utils.attentionUser(1,self.model.id,function(){
                    //如果是关注列表，取消关注后删除 列表需整体重新渲染
                    app.trigger("fansList:attentions:change",[self.model.id,1]);
                    self.mouseLock = false;
                },function(err){
                    MsgBox.toast(err,false);
                    self.mouseLock = false;
                });
            }
        }
    });
    return FansItemView;
});
