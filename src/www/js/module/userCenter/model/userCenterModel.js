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
            self.set({"userHeaderImg":"","userNick":"","userBrief":"一句话介绍一下自己吧，让别人更了解你","fansNum":0,"attentionNum":0});
            self.set({"otherShow":"","btnText":"关注","attEdClass":""});
            self.set({"firstLiShow":"","secondLiShow":"","thirdLiShow":""});
        },
        setName:function(name){
            if(name && name != ""){
                this.set({"userNick":name});
            }else{
                this.set({"userNick":""});
            }
        },
        //简介
        setBrief:function(userBrief){
            if(userBrief && userBrief != ""){
                this.set({"userBrief":userBrief});
            }else{
                this.set({"userBrief":"一句话介绍一下自己吧，让别人更了解你"});
            }
        },
        setHeadImg:function(headImg){
            if(headImg && headImg != ""){
                this.set({"userHeaderImg":headImg});
            }else{
                this.set({"userHeaderImg":"images/login/common-user.jpg"});
            }
        },
        setFansNum:function(fansNum){
            if(fansNum && fansNum != ""){
                this.set("fansNum",fansNum);
            }else{
                this.set("fansNum",0);
            }
        },
        setAttentionNum:function(attentionNum){
            if(attentionNum && attentionNum != ""){
                this.set("attentionNum",attentionNum);
            }else{
                this.set("attentionNum",0);
            }
        },
        //获取他人用户信息
        loadOtherUser:function(otherUID){
            var self = this;
            var loginUser = gili_data.getCurrentUser();
            gili_data.getObjectById("_User",otherUID,function(data){
                var userImg = data.avatar;
                var userName = data.user_nick;
                var userBrief = data.brief;
                self.setBrief(userBrief);
                self.setName(userName);
                self.setHeadImg(userImg);
                self.setFansNum(data.follower_count);
                self.setAttentionNum(data.followee_count);
                //判断如果是当前登录用户，重置其缓存数据
                if(loginUser && loginUser.id == otherUID) {
                    //缓存用户对象重置
                    loginUser.set("user_nick", userName);
                    loginUser.set("brief", userBrief);
                    loginUser.set("avatar", userImg);
                    loginUser.set("follower_count", data.follower_count);
                    loginUser.set("followee_count", data.followee_count);
                }
            },function(){});
        },
        //是否当前登录用户
        setOtherShow:function(isLoginUser,id){
            if(isLoginUser){
                this.set({"otherShow":"style='display:none'","btnText":"","attEdClass":""});
            }else{
                if(utils.isAttention(id)) {
                    this.set({"otherShow": "", "btnText": "取消关注", "attEdClass": "uc_btn_ck"});
                }else{
                    this.set({"otherShow": "", "btnText": "关注", "attEdClass": ""});
                }
            }
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