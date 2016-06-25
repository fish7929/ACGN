// 文件名称: home
//
// 创建日期: 2015/01/08
// 描    述: 用户登录
define([
    'common/base/base_view',
    'text!module/home/templates/home.html',
    'marionette',
    'common/region/switch_view_region',
    'common/views/loginBar',
    'module/home/views/home_QHDCView',
    'module/home/views/home_user_view',
    'module/home/views/home_book',
    'module/home/views/home_college'
],function(BaseView, tpl, mn, SwitchViewRegion, LoginBarView, QHDCView, ActiveUserView, HomeBookView, HomeCollegeView) {
    var bannerHtmlTpl = "<div class='swiper-slide' style=\"background: url('{0}') center no-repeat\"></div>";

    return BaseView.extend({
        id: "homeContainer",
        template : _.template(tpl),
        _mouseLock : false,
        //banner轮播
        bannerSwipe : null,
        ui : {
            bannerWrapper : ".swiper-wrapper"
        },

        //事件添加
        events : {
        },

        regions : {
            LoginBarRegion : {
                el : ".home-loginBar",
                regionClass : SwitchViewRegion
            },

            QHDCRegion : {
                el : ".home-qhdc-reg",
                regionClass : SwitchViewRegion
            },
            ActiveUserRegion : {
                el : ".home-user-reg",
                regionClass : SwitchViewRegion
            },
            BookRegion : {
                el : ".home-book-reg",
                regionClass : SwitchViewRegion
            },
            CollegeRegion : {
                el : ".home-college-reg",
                regionClass : SwitchViewRegion
            }
        },

        /**初始化**/
        initialize : function(){
            this._loginBarView = new LoginBarView();
            this._qhdcView = new QHDCView();
            this._aUserView = new ActiveUserView();
            this._bookView = new HomeBookView();
            this._collegeView = new HomeCollegeView();
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
            self.initBanner();
        },

        regionShow : function(){
            var self = this;
            self.LoginBarRegion.show(self._loginBarView);
            self.QHDCRegion.show(self._qhdcView);
            self.ActiveUserRegion.show(self._aUserView);
            self.BookRegion.show(self._bookView);
            self.CollegeRegion.show(self._collegeView);
        },

        initBanner : function(){
            var self = this;
            var html = "", bannerData = ['images/temp/banner/banner.jpg', 'images/temp/banner/banner1.jpg', 'images/temp/banner/banner2.jpg', 'images/temp/banner/banner3.jpg'];
            for(var i = 0; i < bannerData.length; i++){
                html += bannerHtmlTpl.replace("{0}", bannerData[i])
            }
            self.ui.bannerWrapper.html(html);

            if(self.bannerSwipe) self.bannerSwipe.destroy();

            self.bannerSwipe = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                autoplay : 2000,
                speed : 1000,
                loop : true,
                onAutoplayStop : function(){
                    setTimeout(function(){
                        self.bannerSwipe.startAutoplay();
                    }, 2000);
                }
            });
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});