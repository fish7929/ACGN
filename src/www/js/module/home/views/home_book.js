// 文件名称: home_book.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/25 23:37
// 描    述: 首页--同人本子
define([
    'common/base/item_view',
    'text!module/home/templates/home_book.html',
    'marionette'
],function(ItemView, tpl, mn){
    var htmlTpl = '<div class="book-item button {3}" attr="{0}">' +
        '<div class="book-pic" style="background: url(\'{1}\') no-repeat center; background-size: 100%"></div>' +
        '<div class="book-name">{2}</div>' +
        '</div>';
    return ItemView.extend({
        className : "bookContainer",
        template : _.template(tpl),

        // key : selector
        ui : {
            bookList : ".book-container"
        },
        //事件添加
        events : {
            "click @ui.bookList" : "onClickHandle"
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

        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
            var self = this;
            var opt = {};
            opt.skip = 0;
            opt.limit = 5;
            gili_data.getBooks(opt, function(data){
                data = utils.convert_2_json(data);
                self.initList(data);
            })
            self.$el.show();
        },

        initList : function(data){
            var i;
            var self = this, html = "", lastItemClass;
            for(i = 0; i < data.length; i++){
                obj = data[i];
                lastItemClass = "";
                if(i == data.length - 1){
                    lastItemClass = "last-item"
                }
                html += htmlTpl.replace("{0}", obj.objectId).replace("{1}", obj.cover).replace("{2}", obj.name).replace("{3}", lastItemClass);
            }
            self.ui.bookList.html(html);
        },

        onClickHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.target);
            var parent = target.parents(".book-item");
            if(parent && parent.get(0)){
                var objectId = parent.attr("attr");
                if(objectId){
                    app.navigate("#book/"+objectId, {replace: false, trigger: true});
                }
            }
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