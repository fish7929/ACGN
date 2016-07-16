// 文件名称: activityView.js
//
// 创 建 人: zhao
// 创建日期: 2016/7/16 10:00
// 描    述: 活动页面
define([
    'common/base/base_view',
    'text!module/activity/templates/activityView.html',
    'marionette',
    'common/region/switch_view_region',
    'common/views/loginBar',
    'module/activity/views/activity_blog_view',
    'common/views/commentView',
    'module/activity/model/activityModel',
    'module/publish/views/publishView'
],function(BaseView, tpl, mn, SwitchViewRegion, LoginBarView, ActivityBlogView, CommentView, activityModel, PublishView){
    return BaseView.extend({
        className : "activityContainer",
        template : _.template(tpl),

        // key : selector
        ui : {
            iFrameDiv : ".activity-frame",
            commentDiv : ".activity-commit-container",
            blogTitle : ".activity-work-title",
            commentTitle : ".activity-comment-title"
        },
        //事件添加
        events : {
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
            }
        },

        /**初始化**/
        initialize : function(){
            var self = this;
            self._loginBarView = new LoginBarView();
            self._joinBlogView = new ActivityBlogView();
        },

        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){
        },

        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
            var self = this;
            self._commentView = new CommentView();
            self._commentView.setBlogClass("activityCommentView");

            window.changeIframeHeight = function(height){
                self.ui.iFrameDiv.css({"height":height+"px"});
            };

            window.joinActivity = function(){
                if(!self.activityLabel) return;

                var param = {};
                param.type = "ill";
                param.labels = [self.activityLabel];
                PublishView.show(param);
            };

            window.fastJump = function(type){
                if(type == "work"){
                    $("body").scrollTop(self.ui.blogTitle.offset().top - 100);
                }else if(type == "comment"){
                    $("body").scrollTop(self.ui.commentTitle.offset().top - 100);
                }
            };
        },

        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
            var self = this;
            var activityId = self.getOption("activityId");
            if(!activityId) return;

            //查询当前登录用户已关注用户ID列表 已点赞话题(插画)ID列表 add by guYY 7/14 20:50
            var _user = gili_data.getCurrentUser();
            if(_user){
                utils.loadLikedTplList(_user.id);
            }

            activityModel.queryActivityData(activityId, function(data){
                self.initActivityData(data);
            });
            // var obj = {};
            // obj.comment_id = "5785c9c07db2a200630487b5";
            // obj.comment_type = 2;
            // self._commentView.setCommentTarget(obj);
            // self._commentView.startLoadData();
            //
            self.regionShow();
        },

        initActivityData : function(data){
            var self = this;
            var link = data.link;
            // var link = "http://localhost:63342/workspace/ACGN/src/www/activity/swxf/index.html";
            self.ui.iFrameDiv.get(0).src = link;
            self.activityLabel = data.label;
            self._joinBlogView.setActivityLabel(self.activityLabel);

            var obj = {};
            obj.comment_id = data.objectId;
            obj.comment_type = 6;
            self._commentView.setCommentTarget(obj);
            self._commentView.startLoadData();
        },

        regionShow : function(){
            var self = this;
            self.LoginBarRegion.show(self._loginBarView);
            self.ActivityBlogRegion.show(self._joinBlogView);
            self.CommentBlogRegion.show(self._commentView);
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            var self = this;
            self.LoginBarRegion.hide(self._loginBarView);
            self.ActivityBlogRegion.hide(self._joinBlogView);
        },

        //当页面销毁时触发
        onDestroy : function(){
        }

    });
});