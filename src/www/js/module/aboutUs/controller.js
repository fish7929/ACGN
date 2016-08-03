// 文件名称: controllers.js
// 描    述: controllers.js
define([
    'module/aboutUs/views/about_us_view'
],function(aboutUsView){
    return {
        aboutUs : function(){
            app.page.show(aboutUsView);
        }
    };
});