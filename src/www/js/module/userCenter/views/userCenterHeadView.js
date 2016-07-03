/**
 * Created by Administrator on 2016/6/29.
 */
define([
    'common/base/base_view',
    'module/userCenter/model/userCenterModel',
    'text!module/userCenter/templates/userCenterHead.html'
],function(BaseView,userCenterModel,UserCenterHeadTpl){
    var userCenterHeadView = BaseView.extend({
        id:"user_header_con_con",
        tagName:"div",
        template: _.template(UserCenterHeadTpl),
        currentUserId:"",       //当前打开用户
        currentUser:null,       //当前登录用户
        attLock:false,          //关注状态更新锁
        initialize:function(){
            this.model = new userCenterModel();
            this.model.on("change",this.render,this);
        },
        events:{
        },
        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        /**
         * 根据type值选中对应页签
         * @param type 0动态  1粉丝  2关注
         */
        setSelected:function(type){
            this.model.setSelected(type);
        },
        //根据用户ID加载头部数据
        _loadData:function(userId){
            var self = this;
            self.currentUserId = userId;
//            self.currentUser = sns_data.getCurrentUser();
            //头像 昵称 简介 关注数 动态数 粉丝数 todo
//            if(this.currentUser.id == userId) {
//                this.model.setName(this.currentUser.get("user_nick"));
//                this.model.setSign(this.currentUser.get("user_sign"));
//                this.model.setHeadImg(this.currentUser.get("user_pic"));
//                this.model.setZoneBgImg(this.currentUser.get("zonebg"));
//                this.model.setZoneShowType(this.currentUser.get("zoneshowtype"));
//            }else{
//                this.model.loadOtherUser(userId);
//            }
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