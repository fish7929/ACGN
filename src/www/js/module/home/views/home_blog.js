// 文件名称: home_blog.js
//
// 创 建 人: zhao
// 创建日期: 2016/7/8 15:22
// 描    述: 首页--优秀绘本
define([
    'common/base/item_view',
    'text!module/home/templates/home_blog.html',
    'marionette',
    'common/views/BlogItemView',
    'module/home/model/HomeModel'
],function(ItemView, tpl, mn, BlogItemView, HomeModel){
    return ItemView.extend({
        className : "homeBlogContainer",
        template : _.template(tpl),
        itemList : [],
        // key : selector
        ui : {
            blogList : ".home-blog-list"
        },

        //事件添加
        events : {
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
            HomeModel.queryBlog(function(data){
                console.log(data);
                self.initList(data);
            });
            self.$el.show();
        },

        initList : function(data){
            var self = this;
            self.clearItem();
            for(var i = 0; i < data.length; i++){
                var item = new BlogItemView();
                item.render();
                item.initData(data[i]);
                self.ui.blogList.append(item.$el);
            }
            self.ui.blogList.append($("<div class='clear'></div>"))
        },

        clearItem : function(){
            var self = this;
            for(var i = 0; i < self.itemList.length; i++){
                self.itemList[i].onDestroy();
                self.itemList[i] = null;
            }
            self.itemList = [];
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