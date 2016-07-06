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
    "module/planning/views/planning_notice",
    'common/views/faceView'
],function(BaseView, tpl, mn,SwitchViewRegion, LoginBarView, MsgBox, PlanningModel, ControlView,PlanningNoticeView, FaceView) {
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
            moreOpus : "#more-opus",                           //更多作品
            dynamicContent : ".dynamic-content",                         //企划动态
            commonReplyTxt : ".common-reply-txt",               //评论回复框
            planningFaceBtn : ".planning-face-btn",             //颜表情按钮
            planningCommentsPublish : ".planning-comments-publish", //发布评论按钮
            planningFaceContainer : ".planning-face-container"      //颜表情容器
        },
        regions : {
            LoginBarRegion: {
                el: "#login-nav",
                regionClass: SwitchViewRegion
            }
        },
        //事件添加
        events : {
//            "click @ui.joinPlanning" : "onJoinClickHandle",
//            "click @ui.subscribePlanning" : "onSubscribeClickHandle",
            "click @ui.planningType" : "onTypeClickHandler",
            "click @ui.roleContent" : "onRoleClickHandler",
            "click @ui.hottestOpusContent" : "onOpusClickHandler",
            "click @ui.moreRole" : "onMoreRoleClickHandler",
            "click @ui.moreOpus" : "onMoreOpusClickHandler",
            'click @ui.planningNoticeContent' : "onShowNoticeLayerHandler"
//            'click @ui.planningFaceBtn' : "onFaceBtnClickHandler",
//            'click @ui.planningCommentsPublish' : "onPublishCommentsHandler"
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
            PlanningModel.getJoinUserById(self.planId, function(data){
                if(data ){
                    console.log(data);
                    self._initJoinUserView(data);
                }
            }, function(err){});

            //初始化评论发布框
            if(self.currentUser){
                self.resetUserPlanRelationStatus();
                self.resetCommentOperation();
                self._faceView = new FaceView(self.ui.planningFaceContainer);
            }
            app.on("login:ok", this.onLoginOkHandler, this);
            app.on("logOut:ok", this.onLogOutOkHandler, this);
        },
        /**
         * 监听用户登录成功事件
         */
        onLoginOkHandler : function(){
            var self = this;
            self.currentUser = gili_data.getCurrentUser();
            self.resetUserPlanRelationStatus();
            self.resetCommentOperation();
        },
        /**
         * 监听用户登出成功事件
         */
        onLogOutOkHandler : function(){

        },
        /**
         * 重置当前用户和企划的关系状态
         */
        resetUserPlanRelationStatus : function(){
            var self = this;
            //获取用户和企划的关系 --- 改变按钮的状态
            PlanningModel.getUserPlanRelation(self.currentUser.id, self.planId, function(data){
                if(data ){
                    //判断当前用户和企划的关系，更改状态按钮
                    if(data.get("status")  == 1){   //关注的用户
                        self.ui.subscribePlanning.html("已订阅");
                        self.ui.subscribePlanning.off("click").on("click", self.onCancelSubscribeClickHandler.bind(self));
                        //需要对应不同状态绑定不同事件
                        self.ui.joinPlanning.off("click").on("click", self.onJoinClickHandler.bind(self));
                    }else if(data.get("status") == 2){  //报名
                        if(data.get("approved") == 0){      //审核中
                            self.ui.joinPlanning.css({"background-image": "url(./images/common/btn-gray.png)"})
                                .html("审核中");
                            self.ui.joinPlanning.off("click").on("click", self.onJoinVerifyClickHandler.bind(self));
                            //订阅
                            self.ui.subscribePlanning.off("click").on("click", self.onSubscribeClickHandler.bind(self));
                        }else if(data.get("approved") == 1){    //审核通过
                            //订阅
                            self.ui.subscribePlanning.off("click").on("click", self.onSubscribeClickHandler.bind(self));
                            //加入
                            self.ui.joinPlanning.css({"background-image": "url(./images/common/btn-red.png)"})
                                .html("上传作品");
                            self.ui.joinPlanning.off("click").on("click", self.onUploadingClickHandler.bind(self));
                        }else if(data.get("approved") == 2){    //审核未通过
                            //订阅
                            self.ui.subscribePlanning.on("click", self.onSubscribeClickHandler.bind(self));
                            self.ui.joinPlanning.css({"background-image": "url(./images/common/btn-gray.png)"})
                                .html("审核不通过");
                            self.ui.joinPlanning.off("click").on("click", self.onJoinVerifyErrorClickHandler.bind(self));
                        }
                    }else if (data.get("status") == 3){     //报名并且关注的
                        self.ui.subscribePlanning.html("已订阅");
                        self.ui.subscribePlanning.off("click").on("click", self.onCancelSubscribeClickHandler.bind(self));
                        //加入
                        self.ui.joinPlanning.css({"background-image": "url(./images/common/btn-red.png)"})
                            .html("上传作品");
                        self.ui.joinPlanning.off("click").on("click", self.onUploadingClickHandler.bind(self));
                    }else if(data.get("status")  == 999){   //999-取消关注
                        self.ui.subscribePlanning.html("订阅企划");
                        self.ui.subscribePlanning.on("click", self.onSubscribeClickHandler.bind(self));
                        //需要对应不同状态绑定不同事件
                        self.ui.joinPlanning.off("click").on("click", self.onJoinClickHandler.bind(self));
                    }else{          //默认的情况下
                        self.ui.subscribePlanning.off("click").on("click", self.onSubscribeClickHandler.bind(self));
                        //需要对应不同状态绑定不同事件
                        self.ui.joinPlanning.off("click").on("click", self.onJoinClickHandler.bind(self));
                    }
                }
            }, function(err){
                console.log(err, 100);
            });
        },
        /**
         * 重置评论相关事件和UI
         */
        resetCommentOperation : function(){
            var self = this;
            self.ui.commonReplyTxt.attr("disabled", false);
            self.ui.commonReplyTxt.css({color: "#000"});
            self.ui.commonReplyTxt.attr("placeholder", "你有什么想分享的么");
            self.ui.planningFaceBtn.on("click",self.onFaceBtnClickHandler.bind(self));
            self.ui.planningCommentsPublish.on("click",self.onPublishCommentsHandler.bind(self));
        },
        show : function(){
            this.planningNoticeView.on("hide:planning:notice:handle", this.onPlanningNoticeViewHideHandler, this); //隐藏击事件
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
        /**
         * 初始化报名角色，及参与角色
         * @param data
         * @private
         */
        _initJoinUserView : function(data){
            var self = this;
            var joinUserTemp = '<div class="join-role-item" role-index="roleIndex">'+
                '<img  src="joinUserHeaderSrc" role-index="roleIndex" class="itemSelected button"/>'+
                '<span class="showName common-name-hint" role-index="roleIndex">roleName</span>'+
                '</div>';
            var joinUserHtml = "", joinUserRepTemp = "";
            for(var i = 0; i < data.length; i++){
                var obj = data[i];
                var avatar = obj.get("user").get("avatar");
                var name = obj.get("user").get("user_nick");
                var selectedTemp = i == 0 ? "join-role-item-selected" : "";
                var isShow = i == 0 ? "show" : "hide";
                joinUserRepTemp = joinUserTemp.replace(/roleIndex/g, i+1).replace(/itemSelected/g, selectedTemp)
                    .replace(/showName/g, isShow).replace(/joinUserHeaderSrc/g, avatar)
                    .replace(/roleName/g, name);
                joinUserHtml += joinUserRepTemp;
            }
            self.ui.roleContent.html(joinUserHtml);
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
        onTypeClickHandler : function(e){
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
        onRoleClickHandler : function(e){
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
        onOpusClickHandler : function(e){
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
        onJoinClickHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            PlanningModel.joinPlan(self.planId, function(data){
                //点击报名成功的时候处理UI
                if(data.get("approved") == 0){
                    self.ui.joinPlanning.css({"background-image": "url(./images/common/btn-gray.png)"})
                        .html("审核中");
                    self.ui.joinPlanning.off("click").on("click", self.onJoinVerifyClickHandler.bind(self));
                }
            }, function(err){
                console.log(err, 822);
            });
        },
        /**
         *报名审核中
         * @param e
         */
        onJoinVerifyClickHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.alert("报名正在审核中...");
        },
        /**
         *报名审核中
         * @param e
         */
        onJoinVerifyErrorClickHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.alert("报名审核失败");
        },
        /**
         * 订阅企划点击事件 -- 1
         * @param e
         */
        onSubscribeClickHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            PlanningModel.subscribePlan(self.planId, function(data){
                //点击报名成功的时候处理UI
                if(data){
                    self.ui.subscribePlanning.html("已订阅");
                    self.ui.subscribePlanning.off("click").on("click", self.onCancelSubscribeClickHandler.bind(self));
                    MsgBox.alert("订阅企划成功");
                }
            }, function(err){
                console.log(err);
            });
        },
        /**
         * 取消订阅点击事件 -- 999
         * @param e
         */
        onCancelSubscribeClickHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            PlanningModel.cancelSubscribePlan(self.planId, function(data){
                //点击报名成功的时候处理UI
                if(data){
                    self.ui.subscribePlanning.html("订阅企划");
                    self.ui.subscribePlanning.off("click").on("click", self.onSubscribeClickHandler.bind(self));
                    MsgBox.alert("取消订阅企划成功");
                }
            }, function(err){
                console.log(err);
            });
        },
        /**
         * 上传作品点击事件
         * @param e
         */
        onUploadingClickHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.alert("作品正在努力上传...");
        },
        /**
         * 更多用户点击事件
         * @param e
         */
        onMoreRoleClickHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.alert("更多用户点击");
        },
        /**
         * 更多作品点击事件
         * @param e
         */
        onMoreOpusClickHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.alert("更多作品点击");
        },
        /**
         * 显示公告点击的浮层
         * @param e
         */
        onShowNoticeLayerHandler : function(e){
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
        onPlanningNoticeViewHideHandler : function(){
            if(this.planningControlView && this.planningNoticeView){
                this.planningControlView.hide(this.planningNoticeView);
            }
        },
        /**
         * 颜表情按钮点击事件
         * @param e
         */
        onFaceBtnClickHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            if(self._faceView){
                self._faceView.show(self.onSelectedFaceHandler.bind(self));
            }
        },
        /**
         * 颜表情按钮选择回调
         * @param val
         */
        onSelectedFaceHandler : function(val){

        },
        /**
         * 发布按钮点击事件
         * @param e
         */
        onPublishCommentsHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.toast("请先登录", false);
        },
        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            var self = this;
            this.planningNoticeView.off("hide:planning:notice:handle", this.onPlanningNoticeViewHideHandler, this);
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