// 文件名称: controllers.js
// 描    述: controllers.js
define([
    'module/publish/views/publishOptionView'
],function(PublishOptionView){
    return {
        publish : function(){
            app.page.show(PublishOptionView);
        }
    };
});