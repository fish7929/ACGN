// 文件名称: publishView.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/26 17:00
// 描    述: 发布页面
define([
    'common/base/base_view',
    'text!module/blog/templates/blog_more_view.html',
    'marionette',
    'common/region/switch_view_region',
    'common/views/loginBar',
    'msgbox',
    'common/views/BlogItemView',
    'module/home/views/home_footer'
],function(BaseView, tpl, mn, SwitchViewRegion, LoginBarView, MsgBox, BlogItemView, HomeFooter){
    return BaseView.extend({
        className : "blogMoreContainer",
        template : _.template(tpl),
        ListName : ".blog-more-item-list",
        data_finish : false,
        PageNum : 6,
        // key : selector
        ui : {
            blogList : ".blog-more-item-list",
            loadingContainer : ".loading-gif",
            loadMsg : ".loadMsg-text",
            bnGoTop : ".blog-go-top"
        },

        //事件添加
        events : {
            "click @ui.bnGoTop" : "onGoTopHandler"
        },

        regions : {
            LoginBarRegion: {
                el: ".blog-more-loginBar-reg",
                regionClass: SwitchViewRegion
            },
            FooterRegion:{
                el : ".blog-footer-reg",
                regionClass: SwitchViewRegion
            }
        },

        /**初始化**/
        initialize : function(){
            var self = this;
            self._loginBarView = new LoginBarView();
            self._footerView = new HomeFooter();
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
            self.regionShow();

            self.ui.blogList.html("");
            //查询当前登录用户已关注用户ID列表 已点赞话题(插画)ID列表 add by guYY 7/14 20:50
            var _user = gili_data.getCurrentUser();
            if(_user){
                utils.loadLikedTplList(_user.id);
            }
            self.loadData();
            self.addOnScroll();
            self.addEvent();
        },

        onGoTopHandler : function(e){
            e.stopPropagation();
            e.preventDefault();

            $(window).scrollTop(0);
        },

        regionShow : function(){
            var self = this;
            self.LoginBarRegion.show(self._loginBarView);
        },

        loadData : function(){
            var self = this;
            if(self._loading == true) return;
            self._loading = true;
            var len = self.ui.blogList.find(".blogItemView").length;
            var opts = {
                skip : len,
                limit : self.PageNum,
                orderBy : "createdAt",
                isDesc : true
            };

            self.updateMsg(1);
            gili_data.getBlogData(opts,function(data){
                self._loading = false;
                data = utils.convert_2_json(data);
                if(data.length < self.PageNum){
                    self.data_finish = true;
                    self.updateMsg(2);
                }else{
                    self.updateMsg();
                }
                self.appendList(data);
            },function(error){
                self._loading = false;
                self.updateMsg(0)
            });
        },

        appendList : function(data){
            if(data.length == 0) return;
            var self = this;
            for(var i = 0; i < data.length; i++){
                var item = new BlogItemView();
                item.render();
                item.initData(data[i], 1);
                self.ui.blogList.append(item.$el);
            }
            self.masonryRefresh(true);
        },

        masonryRefresh : function(needLoad){
            var self = this;

            if(needLoad){
                self.ui.blogList.imagesLoaded(function(){
                    self.initMasonry();
                    $(self.ListName).masonry('reload');
                });
            }else{
                $(self.ListName).masonry('reload');
            }
        },

        initMasonry : function(){
            var self = this;
            if(self._initMasonry) return;
            self._initMasonry = true;
            $(self.ListName).masonry({
                itemSelector: '.blogItemView',
                gutterWidth: 20 //每两列之间的间隙为5像素
            });
        },

        /**
         * 更新状态
         * @param type
         *  0:加载出错  1:数据正常加载  2:数据加载结束
         */
        updateMsg:function(type){
            var self = this;
            self.ui.loadingContainer.find("img").hide();
            self.ui.loadMsg.html("滚动加载更多...");
            if(type == 0){   //加载出错时，有数据只文案提示  无数据显示缺省无网状态且文案提示
                self.ui.loadingContainer.find("img").hide();
                self.ui.loadMsg.html("网络不好,请重试");
            }else if(type == 1){ //数据正常加载
                self.ui.loadingContainer.find("img").show();
                self.ui.loadMsg.html("正在加载");
            }else if(type == 2){ //数据加载结束
                self.ui.loadingContainer.find("img").hide();
                self.ui.loadMsg.html("没有更多了");
                self.FooterRegion.show(self._footerView);
            }
        },

        //滚动容器添加滚动事件
        addOnScroll:function(){
            var self = this;

            self.ui.bnGoTop.hide();
            $(window).scroll(function(e){
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                if(scrollTop + window.innerHeight > document.body.offsetHeight-400){
                    if(!self.data_finish){
                        self.loadData();
                    }
                }

                if(scrollTop >= window.innerHeight / 2){
                    self.ui.bnGoTop.show();
                }else{
                    self.ui.bnGoTop.hide();
                }
            });
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
            var self = this;
            $(window).unbind('scroll');
            self.LoginBarRegion.hide(self._loginBarView);
            self.FooterRegion.hide(self._footerView);
            self.removeEvent();
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});