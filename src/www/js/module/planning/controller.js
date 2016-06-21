// 文件名称: controllers.js
// 描    述: controllers.js
define([
    'module/planning/views/planning'
],function(planningView){
    return {
        planning : function(){
            utils.log("userLogin");
            app.page.show(planningView);
        }
    };
});