// 文件名称: controllers.js
// 描    述: controllers.js
define([
    'module/home/views/home'
],function(homeView){
    return {
        home : function(){
            utils.log("homeView");
            app.page.show(homeView);
        }
    };
});