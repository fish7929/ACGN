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
    'module/home/model/HomeModel',
    'module/book/views/bookPreviewView'
],function(BaseView, tpl, mn, SwitchViewRegion, LoginBarView, QHDCView, ActiveUserView, HomeBookView, HomeCollegeView,
           HomeBlogView, HomeLinkView, HomeFooterView, HomeModel, BookPreviewView) {
    var bannerHtmlTpl = "<div class='swiper-slide {2}' data-link='{1}' style=\"background: url('{0}') no-repeat center \"></div>";

    return BaseView.extend({
        id: "homeContainer",
        template : _.template(tpl),
        _mouseLock : false,
        //banner轮播
        bannerSwipe : null,
        ui : {
            bannerWrapper : ".swiper-wrapper",
            bnGoTop : ".home-go-Top"
        },

        //事件添加
        events : {
            "click @ui.bannerWrapper" : "onBannerHandler",
            "click @ui.bnGoTop" : "onGoTopHandler"
        },

        onGoTopHandler : function(e){
            e.stopPropagation();
            e.preventDefault();

            $(window).scrollTop(0);
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
            //查询当前登录用户已关注用户ID列表 已点赞话题(插画)ID列表 add by guYY 7/14 20:50
            var _user = gili_data.getCurrentUser();
            if(_user){
                utils.loadAttentionList(_user.id);
                utils.loadLikedTplList(_user.id);
            }
            HomeModel.queryBannerData(function(data){
                self.initBanner(data);
            }, function(err){

            })

            self.addOnScroll();
        },

        //滚动容器添加滚动事件
        addOnScroll:function(){
            var self = this;
            self.ui.bnGoTop.hide();
            $(window).scroll(function(e){
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                if(scrollTop >= window.innerHeight / 2){
                    self.ui.bnGoTop.show();
                }else{
                    self.ui.bnGoTop.hide();
                }
            });
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
                paginationClickable :true,
                onAutoplayStop : function(){
                    setTimeout(function(){
                        self.bannerSwipe.startAutoplay();
                    }, 2000);
                }
            });
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            var self = this;
            $(window).unbind('scroll');
            self.LoginBarRegion.hide(self._loginBarView);
            self.QHDCRegion.hide(self._qhdcView);
            self.ActiveUserRegion.hide(self._aUserView);
            self.BookRegion.hide(self._bookView);
            self.CollegeRegion.hide(self._collegeView);
            self.ExcellentBookRegion.hide(self._homeBlog);
            self.HomeLinkRegion.hide(self._homeLinkView);
            self.HomeFooterRegion.hide(self._homeFooterView);
            BookPreviewView.hide();
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});