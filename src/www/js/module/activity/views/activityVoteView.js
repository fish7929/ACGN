// 文件名称: publishView.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/26 17:00
// 描    述: 发布页面
define([
    'common/base/base_view',
    'text!module/activity/templates/activityVoteView.html',
    'marionette',
    'common/region/switch_view_region',
    'common/views/loginBar',
    'msgbox',
    'module/activity/model/activityModel'
],function(BaseView, tpl, mn, SwitchViewRegion, LoginBarView, MsgBox, activityModel){
    return BaseView.extend({
        className : "activity-vote-view",
        template : _.template(tpl),
        // key : selector
        ui : {
            headPic : ".activity-vote-work-head",
            blogBrief : ".activity-vote-work-brief",
            blogDate : ".activity-vote-work-data",
            blogVote : ".activity-vote-work-vote",
            blogPic : ".activity-vote-work-pic",
            bnVote : ".activity-vote-btn-vote",
            bnShareQQ : ".activity-vote-btn-qq",
            bnShareWB : ".activity-vote-btn-wb"
        },

        //事件添加
        events : {
            "click @ui.headPic" : "onHeadPicHandler",
            "click @ui.bnVote" : "onVoteHandler",
            "click @ui.bnShareQQ" : "onShareQQHandler",
            "click @ui.bnShareWB" : "onShareWBHandler"
        },

        regions : {
            LoginBarRegion: {
                el: ".activity-vote-loginBar-reg",
                regionClass: SwitchViewRegion
            }
        },

        /**初始化**/
        initialize : function(){
            var self = this;
            self._loginBarView = new LoginBarView();
        },

        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){
        },

        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
        },

        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
            var self = this;

            self.blogId = self.getOption("blog_id");
            if(!self.blogId) return;
            activityModel.getBlogById(self.blogId, function(data){
                self.initData(data);
            });
            self.regionShow();
            self.addEvent();
        },

        initData : function(data){
            var self = this;
            self.author = data.user.user_nick;
            var brief = "<span>" + data.user.user_nick + "：</span>" + data.user.brief;
            var createdAt = data.createdAt || Date.now();
            var voteInt = '<span>'+(data.votes || 0)+'</span>人投票';
            var pic = data.pictures[0] || "";
            self.ui.headPic.css({background : 'url("' + data.user.avatar + '") no-repeat center', backgroundSize : '100%'})
            self.ui.blogBrief.html(brief);
            self.ui.blogDate.html(utils.formatTime(createdAt, "yyyy.MM.dd HH:mm"));
            self.ui.blogVote.html(voteInt);
            self.ui.blogPic.attr("src", pic);
        },

        regionShow : function(){
            var self = this;
            self.LoginBarRegion.show(self._loginBarView);
        },

        onHeadPicHandler : function(e){

        },

        onVoteHandler : function(e){
            var self = this;
            if(!gili_data.getCurrentUser()){
                MsgBox.alert(giliConfig.Tip.NOLOGIN);
                return;
            }
            activityModel.voteWork(self.blogId, 1, function(){
                MsgBox.alert("投票成功!");
            }, function(err){
                MsgBox.alert(err.data);
            });
        },

        onShareQQHandler : function(e){
            utils.shareVoteViewToQQ(self.blogId, self.author);
            activityModel.voteWork(self.blogId, 2);
        },

        onShareWBHandler : function(e){
            utils.shareVoteViewToWB(self.blogId, self.author);
            activityModel.voteWork(self.blogId, 2);
        },

        addEvent : function(){
            var self = this;
        },

        removeEvent : function(){
            var self = this;
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            var self = this;
            self.LoginBarRegion.hide(self._loginBarView);
            self.removeEvent();
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});