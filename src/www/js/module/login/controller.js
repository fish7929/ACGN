// 文件名称: controllers.js
// 描    述: controllers.js
define([
    'module/login/views/login'
],function(loginView){
    return {
        userLogin : function(){
            utils.log("userLogin");
            app.page.show(loginView);
        }
    };
});