/**
 * Created by Administrator on 2016/6/29.
 */
define([
    'common/base/base_view',
    'module/userCenter/model/userCenterModel',
    'text!module/userCenter/templates/userCenterHead.html',
    'msgbox'
],function(BaseView,userCenterModel,UserCenterHeadTpl,MsgBox){
    var userCenterHeadView = BaseView.extend({
        id:"user_header_con_con",
        tagName:"div",
        template: _.template(UserCenterHeadTpl),
        currentUserId:"",       //当前打开用户
        currentUser:null,       //当前登录用户
        attLock:false,          //关注状态更新锁
        _type:0,                 // 0动态  1粉丝  2关注
        mouseLock:false,        //按钮锁
        initialize:function(){
            this.model = new userCenterModel();
            this.model.on("change",this.render,this);
            app.on("common:works:attention",this.attentionChangeHandler,this);
        },
        events:{
            'click .uc_btn':"_clickAttentionHandler", //点击关注
            'click #userCenterNav':"_clickNavHandler" //点击菜单
        },
        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        //用户关注列表发生变化时触发  全局
        attentionChangeHandler:function(arr){
            if(!arr || arr.length != 2){
                return;
            }
            var self = this,
                userId = arr[0],
                type = arr[1];
            if(self.currentUser && self.currentUser.id == self.currentUserId) {
                self.model.setOtherShow(true, self.currentUserId);
            }else{
                self.model.setOtherShow(false, self.currentUserId);
            }
        },
        //点击关注
        _clickAttentionHandler:function(e){
            var self = this;
            var target = $(e.target);
            if(!gili_data.getCurrentUser()){
                MsgBox.toast(gili_config.Tip.NOLOGIN,false);
                return;
            }
            if(self.mouseLock)return;
            self.mouseLock = true;
            setTimeout(function(){
                self.mouseLock = false;
            },1000);
            //点击取消关注
            if(target.hasClass("uc_btn_ck")){
                MsgBox.ask("确定取消关注吗?","",function(type){
                   if(type == MsgBox.YES){//确定
                       target.html("关注");
                       target.removeClass("uc_btn_ck");
                       utils.attentionUser(0,self.currentUserId,function(){},
                           function(err){
                               MsgBox.toast(err,false);
                               target.html("已关注");
                               target.addClass("uc_btn_ck");
                           });
                   }
                });
            }else{ //点击关注
                //默认关注成功
                target.html("已关注");
                target.addClass("uc_btn_ck");
                utils.attentionUser(1,self.currentUserId,function(){
                },function(err){
                    MsgBox.toast(err,false);
                    target.html("关注");
                    target.removeClass("uc_btn_ck");
                });
            }
        },
        _clickNavHandler:function(e){
            var self = this;
            var target = $(e.target);
            var index = target.data("liindex");
            if(this._type == index)return;
            this._type = index;
            if(index == 0){     //指向当前打开用户的动态
                app.navigate("#userCenter/"+self.currentUserId,{replace: false, trigger: true});
            }else if(index == 1){
                this.trigger("fansView:clickNav",[index]);
                app.navigate("#userCenterFans/1/"+self.currentUserId,{replace: false, trigger: true});
            }else if(index == 2){
                this.trigger("fansView:clickNav",[index]);
                app.navigate("#userCenterFans/2/"+self.currentUserId,{replace: false, trigger: true});
            }
        },
        /**
         * 根据type值选中对应页签
         * @param type 0动态  1粉丝  2关注
         */
        setSelected:function(type){
            this._type = type;
            this.model.setSelected(type);
        },
        //根据用户ID加载头部数据
        _loadData:function(userId){
            var self = this;
            self.currentUserId = userId;
            self.currentUser = gili_data.getCurrentUser();
            if(self.currentUser) {
                //查询当前登录用户已关注用户ID列表 已点赞话题(插画)ID列表
                utils.loadAttentionList(self.currentUser.id);
                utils.loadLikedTplList(self.currentUser.id);
            }
            //头像 昵称 简介 关注数 动态数 粉丝数
            if(self.currentUser && self.currentUser.id == userId) {
                self.model.setOtherShow(true,self.currentUserId);
                self.model.loadOtherUser(userId);
            }else{
                self.model.setOtherShow(false,self.currentUserId);
                self.model.loadOtherUser(userId);
            }
        },
        //销毁
        destroy:function(){
            this.model = null;
            app.off("common:works:attention",this.attentionChangeHandler,this);
        }
    });
    return userCenterHeadView;
});