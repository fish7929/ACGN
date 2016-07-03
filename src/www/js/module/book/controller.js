// 文件名称: controllers.js
// 描    述: controllers.js
define([
    'module/book/views/bookDetailsView'
],function(bookDetailsView){
    return {
        book : function(bookId){
            var obj = {};
            obj.bookId = bookId;
            app.page.show(bookDetailsView, obj);
        }
    };
});