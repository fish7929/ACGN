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
        initialize:function(){
            this.model = new userCenterModel();
            this.model.on("change",this.render,this);
        },
        events:{
            'click .uc_btn':"_clickAttentionHandler", //点击关注
            'click #userCenterNav':"_clickNavHandler" //点击菜单
        },
        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        //点击关注
        _clickAttentionHandler:function(e){
            var self = this;
            var target = $(e.target);
            //点击取消关注
            if(target.hasClass("uc_btn_ck")){
                MsgBox.ask("确定取消关注吗?","",function(type){
                   if(type == MsgBox.YES){//确定
                       target.html("关注");
                       utils.addAttention(self.currentUserId,0);
                       target.removeClass("uc_btn_ck");
                       utils.attentionUser(0,self.currentUserId,function(){},
                           function(err){
                               MsgBox.toast(err,false);
                               target.html("已关注");
                               utils.addAttention(self.currentUserId,1);
                               target.addClass("uc_btn_ck");
                           });
                   }
                });
            }else{ //点击关注
                //默认关注成功
                target.html("已关注");
                utils.addAttention(self.currentUserId,1);
                target.addClass("uc_btn_ck");
                utils.attentionUser(1,self.currentUserId,function(){
                },function(err){
                    MsgBox.toast(err,false);
                    target.html("关注");
                    utils.addAttention(self.currentUserId,0);
                    target.removeClass("uc_btn_ck");
                });
            }
        },
        _clickNavHandler:function(e){
            var self = this;
            var target = $(e.target);
            var index = target.data("liindex");
            if(this._type == index)return;
            if(index == 0){     //指向当前打开用户的动态
                app.navigate("#userCenter/"+self.currentUserId,{replace: false, trigger: true});
            }else if(index == 1){ //指向当前打开用户的粉丝列表
                app.navigate("#userCenterFans/"+self.currentUserId,{replace: false, trigger: true});
            }else if(index == 2){//指向当前打开用户的关注列表

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
            //头像 昵称 简介 关注数 动态数 粉丝数
            if(self.currentUser && self.currentUser.id == userId) {
                this.model.setOtherShow(true);
                this.model.setName(this.currentUser.get("user_nick"));
                this.model.setBrief(this.currentUser.get("brief"));
                this.model.setHeadImg(this.currentUser.get("avatar"));
                this.model.setFansNum(this.currentUser.get("follower_count"));
                this.model.setAttentionNum(this.currentUser.get("followee_count"));
            }else{
                this.model.setOtherShow(false);
                this.model.loadOtherUser(userId);
            }
        },
//        /**
//         * 关注或取消关注
//         * @param type  1加关注   2取消关注
//         * @private
//         */
//        _clickAttentionHandler:function(type){
//            var self = this;
//            //当前是否关注锁定状态
//            if(self.attLock) {
//                console.log("锁定中");
//                return;
//            }
//            self.attLock = true;
//            var isAtten = utils.isAttention(self.currentUserId);
//            if(type == 1 && !isAtten){ //加关注
//                LoadingCircle && LoadingCircle.start();
//                utils.addAttention(self.currentUserId, 1);
//                app.trigger("home:works:attention",[self.currentUserId,1]);
//                sns_data.meFollow(self.currentUserId, function(data) {
//                    msgBox.toast("关注成功",true);
//                    self.attLock = false;
//                    utils.addZanMsg(self.currentUserId, function() {});//推送消息
//                    worksListModel.operateRecord(4,null,null,msgBox);
//                    LoadingCircle && LoadingCircle.end();
//                    self.renderAttention();
//                }, function(error) {
//                    msgBox.toast("关注失败",false);
//                    self.attLock = false;
//                    utils.addAttention(self.currentUserId, 0);
//                    app.trigger("home:works:attention",[self.currentUserId,0]);
//                    LoadingCircle && LoadingCircle.end();
//                });
//                if (NewShareView.isShareLayerShow)
//                    NewShareView.shareMenuList();
//            }else if(type == 2 && isAtten){ //取消关注
//                msgBox.ask("确认取消关注?", "温馨提示", function (type) {
//                    if (type == 2) {
//                        LoadingCircle && LoadingCircle.start();
//                        utils.addAttention(self.currentUserId, 0);
//                        app.trigger("home:works:attention", [self.currentUserId, 0]);
//                        sns_data.meUnfollow(self.currentUserId, function (data) {
//                            msgBox.toast("已取消关注", true);
//                            self.attLock = false;
//                            LoadingCircle && LoadingCircle.end();
//                            self.renderAttention();
//                        }, function (error) {
//                            msgBox.toast("取消关注失败", false);
//                            self.attLock = false;
//                            utils.addAttention(self.currentUserId, 1);
//                            app.trigger("home:works:attention", [self.currentUserId, 1]);
//                            LoadingCircle && LoadingCircle.end();
//                        });
//                    } else {
//                        self.attLock = false;
//                    }
//                    if (NewShareView.isShareLayerShow)
//                        NewShareView.shareMenuList();
//                });
//            }else{
//                self.attLock = false;
//                self.renderAttention();
//                if (NewShareView.isShareLayerShow)
//                    NewShareView.shareMenuList();
//            }
//        },
        //销毁
        destroy:function(){
            this.model = null;
        }
    });
    return userCenterHeadView;
});