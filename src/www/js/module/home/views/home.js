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
    'module/home/views/home_blog',
    'module/home/views/home_link',
    'module/home/views/home_footer',
    'module/home/model/HomeModel'
],function(BaseView, tpl, mn, SwitchViewRegion, LoginBarView, QHDCView, ActiveUserView, HomeBookView, HomeCollegeView,
           HomeBlogView, HomeLinkView, HomeFooterView, HomeModel) {
    var bannerHtmlTpl = "<div class='swiper-slide {2}' data-link='{1}' style=\"background: url('{0}') no-repeat center \"></div>";

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
            "click @ui.bannerWrapper" : "onBannerHandler"
        },


        onBannerHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var target = e.target;
            var link = target.getAttribute("data-link");
            if(link){
                app.navigate(link, {replace: false, trigger: true});
            }
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
            self._homeBlog = new HomeBlogView();
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

            HomeModel.queryBannerData(function(data){
                self.initBanner(data);
            }, function(err){

            })
        },

        regionShow : function(){
            var self = this;
            self.LoginBarRegion.show(self._loginBarView);
            self.QHDCRegion.show(self._qhdcView);
            self.ActiveUserRegion.show(self._aUserView);
            self.BookRegion.show(self._bookView);
            self.CollegeRegion.show(self._collegeView);
            self.ExcellentBookRegion.show(self._homeBlog);
            self.HomeLinkRegion.show(self._homeLinkView);
            self.HomeFooterRegion.show(self._homeFooterView);
        },

        initBanner : function(data){
            var self = this;
            var html = "", obj, link, btnClass;
            for(var i = 0; i < data.length; i++){
                obj = data[i];
                btnClass = "";
                link = obj.link || "";
                if(link) btnClass = "button";
                html += bannerHtmlTpl.replace("{0}", obj.img).replace("{1}", link).replace("{2}", btnClass)
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
            // var self = this;
            // self._loginBarView.onDestroy();
            // self._loginBarView = null;
            // self._qhdcView.onDestroy();
            // self._qhdcView = null;
            // self._aUserView.onDestroy();
            // self._aUserView = null;
            // self._bookView.onDestroy();
            // self._bookView = null;
            // self._collegeView.onDestroy();
            // self._collegeView = null;
            // self._homeBlog.onDestroy();
            // self._homeBlog = null;
            // self._homeLinkView.onDestroy();
            // self._homeLinkView = null;
            // self._homeFooterView.onDestroy();
            // self._homeFooterView = null;

            // self.LoginBarRegion.empty(self._loginBarView);
            // self.QHDCRegion.empty(self._qhdcView);
            // self.ActiveUserRegion.empty(self._aUserView);
            // self.BookRegion.empty(self._bookView);
            // self.CollegeRegion.empty(self._collegeView);
            // self.ExcellentBookRegion.empty(self._homeBlog);
            // self.HomeLinkRegion.empty(self._homeLinkView);
            // self.HomeFooterRegion.empty(self._homeFooterView);
            //
            // self.LoginBarRegion.destroy();
            // self.QHDCRegion.destroy();
            // self.ActiveUserRegion.destroy();
            // self.BookRegion.destroy();
            // self.CollegeRegion.destroy();
            // self.ExcellentBookRegion.destroy();
            // self.HomeLinkRegion.destroy();
            // self.HomeFooterRegion.destroy();
            //
            // self.LoginBarRegion = null;
            // self.QHDCRegion = null;
            // self.ActiveUserRegion = null;
            // self.BookRegion = null;
            // self.CollegeRegion = null;
            // self.ExcellentBookRegion = null;
            // self.HomeLinkRegion = null;
            // self.HomeFooterRegion = null;
        }
    });
});