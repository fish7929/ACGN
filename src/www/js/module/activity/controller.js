// 文件名称: controllers.js
// 描    述: controllers.js
define([
    'module/activity/views/activityView',
    'module/activity/views/activitySNQXView',
    'module/activity/views/activityVoteView',
    'module/activity/views/activityOMTRView',
    'module/activity/views/gActivityView'
],function(activityView, activitySNQXView, activityVoteView, activityOMTRView, gActivityView){
    return {
        activity : function(activityId, pos){
            var opt = {};
            opt.activityId = activityId;
            opt.pos = pos;
            app.page.show(activityView, opt);
        },

        activitySNQX : function(activityId, pos){
            var opt = {};
            opt.activityId = activityId;
            opt.pos = pos;
            app.page.show(activitySNQXView, opt);
        },

        activityOMTR : function(activityId, pos){
            var opt = {};
            opt.activityId = activityId;
            opt.pos = pos;
            app.page.show(activityOMTRView, opt);
        },

        activityVote : function(blogId){
            var opt = {};
            opt.blog_id = blogId;
            app.page.show(activityVoteView, opt);
        },

        gActivity : function(activityId, pos){
            console.log(activityId);
            var opt = {};
            opt.activityId = activityId;
            opt.pos = pos;
            app.page.show(gActivityView, opt);
        }
    };
});