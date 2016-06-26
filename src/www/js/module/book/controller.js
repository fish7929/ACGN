// 文件名称: controllers.js
// 描    述: controllers.js
define([
    'module/book/views/bookDetailsView'
],function(bookDetailsView){
    return {
        book : function(){
            app.page.show(bookDetailsView);
        }
    };
});