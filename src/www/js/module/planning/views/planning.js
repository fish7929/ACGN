// 文件名称: login
//
// 创建日期: 2015/01/08
// 描    述: 用户登录
define([
    'common/base/base_view',
    'text!module/planning/templates/planning.html',
    'marionette',
    'common/region/switch_view_region',
    'common/views/loginBar',
    "showbox",
    "module/planning/model/planning_model"
],function(BaseView, tpl, mn,SwitchViewRegion, LoginBarView, ShowBox, PlanningModel) {
    return BaseView.extend({
        id: "gili-love-planning",
        template : _.template(tpl),
        _mouseLock : false,
        ui : {
            verifyPlanning : "#verify-planning",            //审核中
            subscribePlanning : "#subscribe-planning",      //订阅企划
            uploadingOpus : "#uploading-opus",                  //上传作品
            planningType : ".planning-type",                    //企划类型
            typeDetailTitle : ".type-detail-title",         //类型标题
            typeDetailContent : ".type-detail-content",     //类型内容
            roleContent : ".role-content",                  //参加角色
            moreRole : "#more-role",                            //更多角色
            hottestOpusContent : ".hottest-opus-content",        //最热作品
            moreOpus : "#more-opus"                             //更多作品
        },
        regions : {
            LoginBarRegion: {
                el: "#login-nav",
                regionClass: SwitchViewRegion
            }
        },
        //事件添加
        events : {
            "click @ui.verifyPlanning" : "onVerifyClickHandle",
            "click @ui.subscribePlanning" : "onSubscribeClickHandle",
            "click @ui.uploadingOpus" : "onUploadingClickHandle",
            "click @ui.planningType" : "onTypeClickHandle",
            "click @ui.roleContent" : "onRoleClickHandle",
            "click @ui.hottestOpusContent" : "onOpusClickHandle"
        },
        /**初始化**/
        initialize : function(){
            var self = this;
            self._loginBarView = new LoginBarView();
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
            console.log(this.ui.loginBtn);
            var self = this;
            self.LoginBarRegion.show(self._loginBarView);
        },
        /**
         * 企划类型点击事件
         * @param e
         */
        onTypeClickHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var target = e.target;
            var $target = $(target);
            var typeIndex = $target.attr("type-index");
            var currentImg;
            typeIndex = parseInt(typeIndex);
            if(typeIndex){
                //todo 先清除样式
                var typeImages = self.ui.planningType.find("img");
                for(var i = 0; i < typeImages.length; i++){
                    $(typeImages[i]).removeClass("planning-type-item-selected");
                }
                //需要找到父控件
                if(!$target.hasClass("planning-type-item")){
                    $target = $target.parent();
                }
                currentImg = $target.find("img");
                currentImg.addClass("planning-type-item-selected");
//                ShowBox.alert("点击了企划类型"+typeIndex);
                self.changeTypeDetail(typeIndex);
            }
        },
        /**
         * 修改企划类型详细内容s
         * @param type
         */
        changeTypeDetail : function(type){
            var self = this;
            var currentDetails =  PlanningModel.getTypeDetailByIndex(type);
            var detailContent = currentDetails.content.replace(/\n/g,"<br/>");	//把回车替换成<br />
            self.ui.typeDetailTitle.html(currentDetails.title);
            self.ui.typeDetailContent.html(detailContent);
        },
        /**
         * 参与角色点击事件
         * @param e
         */
        onRoleClickHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var target = e.target;
            var $target = $(target);
            var roleIndex = $target.attr("role-index");
            var currentImg , currentSpn;
            if(roleIndex){
                //todo 先清除样式
                var roleImages = self.ui.roleContent.find("img");
                var roleSpans = self.ui.roleContent.find("span");
                for(var i = 0; i < roleImages.length; i++){
                    $(roleImages[i]).removeClass("join-role-item-selected");
                    $(roleSpans[i]).removeClass("show").addClass("hide");
                }
                //需要找到父控件
                if(!$target.hasClass("join-role-item")){
                    $target = $target.parent();
                }
                currentImg = $target.find("img");
                currentImg.addClass("join-role-item-selected");
                currentSpn = $target.find("span");
                currentSpn.addClass("hide").addClass("show");
                ShowBox.alert("点击了参与角色"+roleIndex);
            }
        },
        /**
         * 热门作品点击事件
         * @param e
         */
        onOpusClickHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var target = e.target;
            var $target = $(target);
            var opusIndex = $target.attr("opus-index");
            var currentImg , currentSpn;
            if(opusIndex){
                //todo 先清除样式
                var opusImages = self.ui.hottestOpusContent.find("img");
                var opusSpans = self.ui.hottestOpusContent.find("span");
                for(var i = 0; i < opusImages.length; i++){
                    $(opusImages[i]).removeClass("hottest-opus-item-selected");
                    $(opusSpans[i]).removeClass("opus-hint-selected");
                }
                //需要找到父控件
                if(!$target.hasClass("hottest-opus-item")){
                    $target = $target.parent();
                }
                currentImg = $target.find("img");
                currentImg.addClass("hottest-opus-item-selected");
                currentSpn = $target.find("span");
                currentSpn.addClass("opus-hint-selected");
                ShowBox.alert("点击了作品"+opusIndex);
            }
        },
        /**
         * 审核中点击事件
         * @param e
         */
        onVerifyClickHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            ShowBox.alert("作品正在审核中");
        },
        /**
         * 订阅企划点击事件
         * @param e
         */
        onSubscribeClickHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            ShowBox.alert("订阅企划成功");
        },
        /**
         * 上传作品点击事件
         * @param e
         */
        onUploadingClickHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            ShowBox.alert("作品正在努力上传...");
        },
        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});