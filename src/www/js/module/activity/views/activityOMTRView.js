// 文件名称: activityView.js
//
// 创 建 人: zhao
// 创建日期: 2016/7/16 10:00
// 描    述: 活动页面
define([
    'common/base/base_view',
    'text!module/activity/templates/activityOMTR.html',
    'marionette',
    'common/region/switch_view_region',
    'common/views/loginBar',
    'module/activity/views/activity_blog_view_new',
    'common/views/commentView',
    'module/activity/model/activityModel',
    'module/publish/views/publishView',
    'module/home/views/home_footer',
    'common/views/bottomLoginBar'
],function(BaseView, tpl, mn, SwitchViewRegion, LoginBarView, ActivityBlogView, CommentView, activityModel, PublishView, HomeFooter, BottomLoginView){
    return BaseView.extend({
        className : "activityOMTRContainer",
        template : _.template(tpl),

        // key : selector
        ui : {
            bnGoBtns : ".activity-go-btns",
            blogTitle : ".activity-work-title",
            commentTitle : ".activity-comment-title",
            bnJoin : ".btnJoin"
        },
        //事件添加
        events : {
            "click @ui.bnGoBtns" : "onGoBtnsClickHandler",
            "click @ui.bnJoin" : "onJoinActivity"
        },

        regions : {
            LoginBarRegion: {
                el: ".activity-head-reg",
                regionClass: SwitchViewRegion
            },

            ActivityBlogRegion: {
                el: ".activity-blog-reg",
                regionClass: SwitchViewRegion
            },

            CommentBlogRegion:{
                el: ".activity-comment-reg",
                regionClass: SwitchViewRegion
            },

            FooterRegion:{
                el: ".activity-footer-reg",
                regionClass: SwitchViewRegion
            },

            BottomLoginRegion:{
                el: ".activity-bottom-login-reg",
                regionClass: SwitchViewRegion
            }
        },

        /**初始化**/
        initialize : function(){
            var self = this;
            self._loginBarView = new LoginBarView();
            self._joinBlogView = new ActivityBlogView();
            // self._footerView = new HomeFooter();
            self._bottomLoginView = new BottomLoginView();
        },

        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){
        },

        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
            var self = this;
            self._commentView = new CommentView();
            self._commentView.setBlogClass("activityCommentView");
        },

        regionShow : function(){
            var self = this;
            self.LoginBarRegion.show(self._loginBarView);
            self.ActivityBlogRegion.show(self._joinBlogView);
            self.CommentBlogRegion.show(self._commentView);
            // self.FooterRegion.show(self._footerView);
            var _user = gili_data.getCurrentUser();
            if(!_user){
                self.BottomLoginRegion.show(self._bottomLoginView)
            }
        },

        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
            var self = this;
            var activityId = self.getOption("activityId");
            if(!activityId) return;

            self.activityPos = self.getOption("pos");

            //查询当前登录用户已关注用户ID列表 已点赞话题(插画)ID列表 add by guYY 7/14 20:50
            var _user = gili_data.getCurrentUser();
            if(_user){
                utils.loadLikedTplList(_user.id);
            }

            activityModel.queryActivityData(activityId, function(data){
                self.initActivityData(data);
            });
            self.regionShow();
            self.addOnScroll();

            //登录成功
            app.on("login:ok",self.onLoginOkHandle, self);
            //登出成功
            app.on("logOut:ok",self.onLoginOkHandle, self);
        },

        //滚动容器添加滚动事件
        addOnScroll:function(){
            var self = this;
            self.ui.bnGoBtns.hide();
            $(window).scroll(function(e){
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                if(scrollTop >= window.innerHeight / 2){
                    self.ui.bnGoBtns.show();
                }else{
                    self.ui.bnGoBtns.hide();
                }
            });
        },

        initActivityData : function(data){
            var self = this;
            self.activityLabel = data.label;
            self._joinBlogView.setActivityLabel(self.activityLabel);

            var obj = {};
            obj.comment_id = data.objectId;
            obj.comment_type = 6;
            self._commentView.setCommentTarget(obj);
            self._commentView.startLoadData();
        },

        onGoBtnsClickHandler: function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var target = e.target;
            var type = target.getAttribute("data-type");
            if(!type) return;
            switch (type){
                case "activity":
                    $(window).scrollTop(790);
                    break;
                case "work":
                    $(window).scrollTop(self.ui.blogTitle.offset().top - 100);
                    break;
                case "comment":
                    $(window).scrollTop(self.ui.commentTitle.offset().top - 100);
                    break;
                case "top":
                    $(window).scrollTop(0);
                    break
            }
        },

        onJoinActivity : function(){
            var self = this;
            if(!self.activityLabel) return;

            var param = {};
            param.type = "ill";
            param.labels = [self.activityLabel];
            PublishView.show(param);
        },

        onLoginOkHandle : function(){
            var self = this;
            var _user = gili_data.getCurrentUser();
            if(!_user){
                self.BottomLoginRegion.show(self._bottomLoginView)
            }else{
                self.BottomLoginRegion.hide(self._bottomLoginView)
            }
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            var self = this;
            $(window).unbind('scroll');
            self.LoginBarRegion.hide(self._loginBarView);
            self.ActivityBlogRegion.hide(self._joinBlogView);
            self.CommentBlogRegion.hide(self._commentView);
            // self.FooterRegion.hide(self._footerView);
            self.BottomLoginRegion.hide(self._bottomLoginView);

            //登录成功
            app.off("login:ok",this.onLoginOkHandle, this);
            //登出成功
            app.off("logOut:ok",this.onLoginOkHandle, this);
        },

        //当页面销毁时触发
        onDestroy : function(){
        }

    });
});