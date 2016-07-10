// 文件名称: controllers.js
// 描    述: controllers.js
define([
    'module/blog/views/blog_more_view'
],function(blogMoreView){
    return {
        blogMore : function(){
            app.page.show(blogMoreView);
        }
    };
});