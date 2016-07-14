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
            blogList : ".home-blog-list",
            bnBlogMore : ".home-blog-bnMore"
        },

        //事件添加
        events : {
            "click @ui.bnBlogMore" : "onClickHandle"
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
                self.initList(data);
            });
            self.$el.show();
            self.addEvent();

        },

        initMasonry : function(){
            var self = this;
            if(self._initMasonry) return;
            self._initMasonry = true;
            $('.home-blog-list').masonry({
                itemSelector: '.blogItemView',
                gutterWidth: 20 //每两列之间的间隙为5像素
            });
        },

        initList : function(data){
            var self = this;
            self.clearItemList();
            self.ui.blogList.html("");
            for(var i = 0; i < data.length; i++){
                var item = new BlogItemView();
                item.render();
                item.initData(data[i], 1);
                self.itemList.push(item);
                self.ui.blogList.append(item.$el);
            }
            self.ui.blogList.append($("<div class='clear'></div>"));
            self.masonryRefresh(true);
        },

        clearItemList : function(){
            var self = this;
            for(var i=0; i<self.itemList.length; i++){
                self.itemList[i].onDestroy();
                self.itemList[i] = null;
            }
            self.itemList.length = 0;
            self.ui.blogList.html("");
        },

        masonryRefresh : function(needLoad){
            var self = this;

            if(needLoad){
                self.ui.blogList.imagesLoaded(function(){
                    self.initMasonry();
                    $('.home-blog-list').masonry('reload');
                });
            }else{
                $('.home-blog-list').masonry('reload');
            }
        },

        onClickHandle : function(e){
            e.stopPropagation();
            e.preventDefault();

            app.navigate("#blogMore", {replace: false, trigger: true});
        },

        addEvent : function(){
            var self = this;
            app.on("update:masonry:list", self.masonryRefresh, self);
        },

        removeEvent : function(){
            var self = this;
            app.off("update:masonry:list", self.masonryRefresh, self);
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            this.$el.hide();
            this.removeEvent();
            this.clearItemList();
        },

        //当页面销毁时触发
        onDestroy : function(){
        }

    });
});