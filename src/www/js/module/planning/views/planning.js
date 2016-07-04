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
    "msgbox",
    "module/planning/model/planning_model",
    'common/region/control_view',
    "module/planning/views/planning_notice"
],function(BaseView, tpl, mn,SwitchViewRegion, LoginBarView, MsgBox, PlanningModel, ControlView,PlanningNoticeView) {
    return BaseView.extend({
        id: "gili-love-planning",
        template : _.template(tpl),
        _mouseLock : false,
        planId : "",            //企划ID
        currentUser : null,     //当前用户
        moderatorNick : "",     //版主昵称
        noticeObj : null,       //企划公告对象
        currentNotice : null,   //当前选中的通告对象
        ui : {
            planningBanner : "#planning-banner",        //企划banner
            planningAuthor : ".planning-author",          //企划用户信息
            planningDetailTitle : ".detail-title",         //企划信息标题
            planningDetailContent : ".detail-content",             //企划信息简介
            joinPlanning : "#join-planning",            //加入企划
            subscribePlanning : "#subscribe-planning",      //订阅企划
            planningNoticeContent : ".notice-content",             //企划公告内容
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
            "click @ui.joinPlanning" : "onJoinClickHandle",
            "click @ui.subscribePlanning" : "onSubscribeClickHandle",
            "click @ui.planningType" : "onTypeClickHandle",
            "click @ui.roleContent" : "onRoleClickHandle",
            "click @ui.hottestOpusContent" : "onOpusClickHandle",
            "click @ui.moreRole" : "onMoreRoleClickHandle",
            "click @ui.moreOpus" : "onMoreOpusClickHandle",
            'click @ui.planningNoticeContent' : "onShowNoticeLayerHandle"
        },
        /**初始化**/
        initialize : function(){
            var self = this;
            self._loginBarView = new LoginBarView();
            //浏览分享层
            this.planningControlView = new ControlView(this);
            this.planningNoticeView = new PlanningNoticeView({parentView: this});
        },
        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){

        },
        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
            var self = this;
            //获取参数
            self.planId = self.getOption("planId");
            self.currentUser = gili_data.getCurrentUser();
            //初始化企划基本信息
            PlanningModel.getPlanById(self.planId, function(data){
                self._initPlanInfoView(data);
            }, function(err){
                console.log(err);
            });
            //初始化企划公告基本信息
            PlanningModel.getNoticeById(self.planId, function(data){
                if(data){
                    self.noticeObj = data;
                    self._initNoticeInfoView(data);
                }
            }, function(err){});

            //初始化企划参与角色列表信息
//            PlanningModel.getJoinUserById(self.planId, function(data){
//                if(data){
//                    console.log(data, 99663);
//                }
//            }, function(err){});
//            //获取用户和企划的关系
//            PlanningModel.getUserPlanRelation(self.currentUser.id, self.planId, function(data){
//                console.log(data, 98);
//            }, function(err){
//                console.log(err, 100);
//                console.log(err)
//            });
        },
        show : function(){
            this.planningNoticeView.on("hide:planning:notice:handle", this.onPlanningNoticeViewHideHandle, this); //隐藏击事件
        },
        /**
         * 初始化企划信息
         * @param data
         * @private
         */
        _initPlanInfoView : function(data){
            var self = this;
            var authorTemp = '<div class="planning-cover" style="background: url(myPlanningCover) center no-repeat"></div>'+
                '<img class="planning-moderator" src="myPlanningModerator"/>'+
                '<span class="planning-moderator-nick">myPlanningModeratorNick</span>'+
                '<span class="planning-moderator-hint">企划主</span>';
            var bgImg = data.bg_img;
            var cover = data.cover;
            var name = data.name;
            var brief = data.brief;
            var author = data.user;
            var preview = data.preview;
            if(author){
                self.moderatorNick = author.user_nick;
            }
            authorTemp = authorTemp.replace("myPlanningCover", cover).replace("myPlanningModerator", author.avatar)
                .replace("myPlanningModeratorNick", author.user_nick);
            self.ui.planningBanner.css({"background": "url('"+bgImg+"') center no-repeat"});
            self.ui.planningAuthor.html(authorTemp);
            self.ui.planningDetailTitle.html(name);
            self.ui.planningDetailContent.html(brief);
            self._initPlanTypeView(preview.slice(0,4));     //这里只取前四条
        },
        /**
         * 初始化企划类型信息
         * @param data
         * @private
         */
        _initPlanTypeView : function(data){
            var self = this;
            var typeTemp = '<div class="planning-type-item" type-index="myTypeIndex">'+
                '<img  class="myPlanningTypeIsSelected button" src="myPlanningTypeSrc" type-index="myTypeIndex" />'+
                '<span class="xy-center" type-index="myTypeIndex">myPlanningTypeName</span>'+
            '</div>';
            var typeHtml = "", tempClassName , typeTempRep = '';
            for(var i = 0; i < data.length; i++){
                var obj = data[i];
                if(i == 0){
                    self.ui.typeDetailTitle.html(obj.description.title);
                    self.ui.typeDetailContent.html(obj.description.content.replace(/\n/g,"<br/>"));
                }
                tempClassName = i == 0 ? "planning-type-item-selected" : "";
                typeTempRep = typeTemp.replace(/myTypeIndex/g, i+1).replace(/myPlanningTypeIsSelected/g, tempClassName)
                    .replace(/myPlanningTypeSrc/g, obj.image).replace(/myPlanningTypeName/g, obj.type);
                typeHtml += typeTempRep;
            }
            self.ui.planningType.html(typeHtml);
        },
        /**
         * 初始化企划公告信息
         * @param data
         * @private
         */
        _initNoticeInfoView : function(data){
            var self = this;
            var noticeTemp = '<li notice-index="myNoticeIndex" class="button"><span notice-index="myNoticeIndex" >noticeCreateTime</span><span notice-index="myNoticeIndex" >noticeDescription</span></li>';
            var noticeLi = "",noticeRepTemp = "";
            for(var i = 0; i < data.length; i++){
                var obj = data[i];
                var time = utils.formatTime(obj.createdAt, "yyyy.MM.dd");
                noticeRepTemp = noticeTemp.replace(/myNoticeIndex/g, i+1).replace(/noticeCreateTime/g, time)
                    .replace(/noticeDescription/g, obj.description);
                noticeLi += noticeRepTemp;
            }
            self.ui.planningNoticeContent.html(noticeLi);
        },
        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
            var self = this;
            //显示登录条
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
//                MsgBox.alert("点击了企划类型"+typeIndex);
                self.changeTypeDetail(typeIndex);
            }
        },
        /**
         * 修改企划类型详细内容s
         * @param type
         */
        changeTypeDetail : function(type){
            var self = this;
            var currentDetails =  PlanningModel.getTypeDetailByIndex(self.planId, type);
            if(!currentDetails)return;
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
                MsgBox.alert("点击了参与角色"+roleIndex);
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
                MsgBox.alert("点击了作品"+opusIndex);
            }
        },
        /**
         * 加入企划点击事件
         * @param e
         */
        onJoinClickHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
//            MsgBox.toast("加入企划点击", true);
            PlanningModel.joinPlan(self.planId, function(data){
                console.log(data, 866333);
            }, function(err){
                console.log(err, 822);
            });
        },
        /**
         * 订阅企划点击事件
         * @param e
         */
        onSubscribeClickHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.alert("订阅企划成功");
        },
        /**
         * 上传作品点击事件
         * @param e
         */
        onUploadingClickHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.alert("作品正在努力上传...");
        },
        /**
         * 更多用户点击事件
         * @param e
         */
        onMoreRoleClickHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.alert("更多用户点击");
        },
        /**
         * 更多作品点击事件
         * @param e
         */
        onMoreOpusClickHandle : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.alert("更多作品点击");
        },
        /**
         * 显示公告点击的浮层
         * @param e
         */
        onShowNoticeLayerHandle : function(e){
            var self = this;
            var target = e.target;
            var noticeIndex = $(target).attr("notice-index");
            //TODO 更换为新的弹出形式,数据加载完之后
            if(noticeIndex){
                noticeIndex = parseInt(noticeIndex);
                self.currentNotice = self.noticeObj[noticeIndex - 1];
                if(self.planningControlView && self.planningNoticeView){
                    self.planningControlView.show(self.planningNoticeView);
                }
            }
        },
        onPlanningNoticeViewHideHandle : function(){
            if(this.planningControlView && this.planningNoticeView){
                this.planningControlView.hide(this.planningNoticeView);
            }
        },
        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            var self = this;
            this.planningNoticeView.off("hide:planning:notice:handle", this.onPlanningNoticeViewHideHandle, this);
            if(this.planningControlView && this.planningNoticeView){
                this.planningControlView.empty(this.planningNoticeView);
            }
            self.planId = "";            //企划ID
            self.currentUser = null;    //当前用户
            self.moderatorNick = "";     //版主昵称
            self.noticeObj = null;      //企划公告对象
            self.currentNotice = null;   //当前选中的通告对象
        },

        //当页面销毁时触发
        onDestroy : function(){
            this.remove();
        }
    });
});