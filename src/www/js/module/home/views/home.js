// 文件名称: home
//
// 创建日期: 2015/01/08
// 描    述: 用户登录
define([
    'common/base/base_view',
    'text!module/home/templates/home.html',
    'marionette',
    'common/views/loginBar'
],function(BaseView, tpl, mn, LoginBarView) {
    var bannerHtmlTpl = "<li><div style=\"background: url('{0}')\"></div></li>";

    return BaseView.extend({
        id: "homeContainer",
        template : _.template(tpl),
        _mouseLock : false,
        //banner轮播
        bannerSlide : null,
        ui : {
            bannerUL : ".home-banners-ul"
        },

        //事件添加
        events : {
        },
        /**初始化**/
        initialize : function(){
            //console.error(1);
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

            self.initBanner();
        },

        initBanner : function(){
            var self = this;
            var html = "", bannerData = ['http://ac-syrskc2g.clouddn.com/95f2df33032a1574f0b7', 'http://ac-syrskc2g.clouddn.com/c246bc514640e34f5945', 'http://ac-syrskc2g.clouddn.com/1ab3c8b1a334770f5194', 'http://ac-syrskc2g.clouddn.com/eb662a92777f1e48d3d0', 'http://ac-syrskc2g.clouddn.com/ijMtip15X15EAeNHgQ9wub78L3EwImB2C8e08M7s.jpg'];
            for(var i = 0; i < bannerData.length; i++){
                html += bannerHtmlTpl.replace("{0}", bannerData[i])
            }
            self.ui.bannerUL.html(html);

            if(self.bannerSlide) self.bannerSlide.destory();
            self.bannerSlide = TouchSlide({
                slideCell:"#home-banners",
                titCell:"#home-banners-nav ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell:".home-banners-ul",
                effect:"left",
                autoPlay:true,//自动播放
                autoPage:true, //自动分页
                interTime:6000,
                delayTime:500,
                switchLoad:"_src" //切换加载，真实图片路径为"_src"
            });
        },

        onLoginHandle : function(e){
            app.navigate("login", {
                replace: false,
                trigger: true
            });
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            utils.log("home close");
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});