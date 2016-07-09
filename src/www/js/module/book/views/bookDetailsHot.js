// 文件名称: bookDetailsHot.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/27 15:40
// 描    述: 同人本子--热门作品块
define([
    'common/base/item_view',
    'text!module/book/templates/bookDetailsHot.html',
    'marionette',
    'module/book/model/BookModel'
],function(ItemView, tpl, mn, BookModel){
    var htmlTpl = "<div class=\"hot-book-item\">" +
                        "<div class=\"item-image button\" data-id='{0}' style=\"background:url('{1}') no-repeat center; background-size:100%\"></div>" +
                        "<div class=\"item-info\">" +
                            "<div class=\"item-title nowrapTxt\">{2}</div>" +
                            "<div class=\"item-desc wrapTxt\">{3}</div>" +
                        "</div>" +
                    "</div>";
    return ItemView.extend({
        className : "bookDetailsHotContainer",
        template : _.template(tpl),

        // key : selector
        ui : {
            bookList : ".bd-hot-container"
        },
        ShowNum : 3,
        //事件添加
        events : {
            "click @ui.bookList" : "onBookListHandler"
        },

        /**初始化**/
        initialize : function(){
        },

        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){
        },

        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
        },

        onBookListHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = e.target;
            var bookId = target.getAttribute("data-id");
            if(bookId){
                app.navigate("#book/"+bookId, {replace: false, trigger: true});
            }
        },

        setParam : function(bookId){
            this._bookId = bookId;
            console.log(bookId)
        },

        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
            console.log(123);
            var self = this;
            BookModel.queryRandomBooks(self._bookId, self.ShowNum, function(data){
                self.initList(data);
            });
            self.$el.show();
        },

        initList : function(data){
            var self = this, i, html = "", obj;
            for(i = 0; i < data.length; i++){
                obj = data[i];
                html += htmlTpl.replace("{0}", obj.objectId).replace("{1}", obj.cover).replace("{2}", obj.name).replace("{3}", obj.brief);
            }
            self.ui.bookList.html(html);
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            this.$el.hide();
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});