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
    'module/home/views/home_college',
    'module/home/views/home_excellent_book',
    'module/home/views/home_link',
    'module/home/views/home_footer'
],function(BaseView, tpl, mn, SwitchViewRegion, LoginBarView, QHDCView, ActiveUserView, HomeBookView, HomeCollegeView,
           HomeExcellentBookView, HomeLinkView, HomeFooterView) {
    var bannerHtmlTpl = "<div class='swiper-slide' style=\"background: url('{0}') no-repeat center \"></div>";

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
            "click @ui.bannerWrapper" : "goToPlanningHandle"
        },
        //测试
        goToPlanningHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            app.navigate("#planning" , {replace: false, trigger: true});
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
            },
            ExcellentBookRegion : {
                el : ".home-excellent-book-reg",
                regionClass : SwitchViewRegion
            },
            HomeLinkRegion : {
                el : ".home-link-reg",
                regionClass : SwitchViewRegion
            },
            HomeFooterRegion : {
                el : ".home-footer-reg",
                regionClass : SwitchViewRegion
            }
        },

        /**初始化**/
        initialize : function(){
            var self = this;
            self._loginBarView = new LoginBarView();
            self._qhdcView = new QHDCView();
            self._aUserView = new ActiveUserView();
            self._bookView = new HomeBookView();
            self._collegeView = new HomeCollegeView();
            self._excellentBookView = new HomeExcellentBookView();
            self._homeLinkView = new HomeLinkView();
            self._homeFooterView = new HomeFooterView();
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
            utils.log("_loginBarView")
            self.LoginBarRegion.show(self._loginBarView);
            utils.log("_qhdcView")
            self.QHDCRegion.show(self._qhdcView);
            utils.log("_aUserView")
            self.ActiveUserRegion.show(self._aUserView);
            utils.log("_bookView")
            self.BookRegion.show(self._bookView);
            utils.log("_collegeView")
            self.CollegeRegion.show(self._collegeView);
            utils.log("_excellentBookView")
            self.ExcellentBookRegion.show(self._excellentBookView);
            utils.log("_homeLinkView")
            self.HomeLinkRegion.show(self._homeLinkView);
            utils.log("_homeFooterView")
            self.HomeFooterRegion.show(self._homeFooterView);
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
            utils.log("bannerSwipe")
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});