// 文件名称: controllers.js
// 描    述: controllers.js
define([
    'module/activity/views/activityView',
    'module/activity/views/activitySNQXView',
    'module/activity/views/activityVoteView'
],function(activityView, activitySNQXView, activityVoteView){
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

        activityVote : function(blogId){
            var opt = {};
            opt.blog_id = blogId;
            app.page.show(activityVoteView, opt);
        }
    };
});