// 文件名称: controllers.js
// 描    述: controllers.js
define([
    'module/activity/views/activityView'
],function(activityView){
    return {
        activity : function(activityId){
            var opt = {};
            opt.activityId = activityId;
            app.page.show(activityView, opt);
        }
    };
});