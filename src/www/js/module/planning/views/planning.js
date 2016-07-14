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
    "module/planning/views/planning_roles",
    "module/publish/views/publishView",
    "module/book/views/bookPreviewView",
    'common/views/BlogItemView',
    'module/home/views/home_footer'
], function (BaseView, tpl, mn, SwitchViewRegion, LoginBarView, MsgBox, PlanningModel, ControlView, PlanningNoticeView,
             PlanningRolesView, PublishView, BookPreviewView, BlogItemView, HomeFooterView) {
    return BaseView.extend({
        id: "gili-love-planning",
        template: _.template(tpl),
        _mouseLock: false,
        planId: "",            //企划ID
        currentUser: null,     //当前用户
        moderatorNick: "",     //版主昵称
        noticeObj: null,       //企划公告对象
        currentNotice: null,   //当前选中的通告对象
        planName: "",      // 企划名称
        planId: "",    //企划ID
        limit: 6,      //最少查询6条
        skip: 0,        //跳过多少条
        itemList: [],       //清除已经加载的itemView
        dataFinish: false, //数据请求结束
        dataLoading: false, //数据正在请求中
        FIRST: 1,
        SECOND: 2,
        THIRD: 3,
        ui: {
            planningBanner: "#planning-banner",        //企划banner
            planningAuthor: ".planning-author",          //企划用户信息
            planningDetailTitle: ".detail-title",         //企划信息标题
            planningDetailContent: ".detail-content",             //企划信息简介
            joinPlanning: "#join-planning",            //加入企划
            subscribePlanning: "#subscribe-planning",      //订阅企划
            planningNoticeContent: ".notice-content",             //企划公告内容
            planningType: ".planning-type",                    //企划类型
            typeDetailTitle: ".type-detail-title",         //类型标题
            typeDetailContent: ".type-detail-content",     //类型内容
            roleContent: ".role-content",                  //参加角色
            moreRole: "#more-role",                            //更多角色
            hottestOpusContent: ".hottest-opus-content",        //最热作品
            dynamicContent: ".dynamic-content",                         //企划动态
            loadingContainer: "#planning-loading-gif",
            loadMsg: "#planning-sk-text"
        },
        regions: {
            LoginBarRegion: {
                el: "#login-nav",
                regionClass: SwitchViewRegion
            },
            PlanningFooterRegion : {
                el : ".planning-footer-container",
                regionClass : SwitchViewRegion
            }
        },
        //事件添加
        events: {
            "click @ui.planningAuthor": "onAuthorClickHandler",
            "click @ui.planningType": "onTypeClickHandler",
            "click @ui.roleContent": "onRoleClickHandler",
            "click @ui.hottestOpusContent": "onOpusClickHandler",
            "click @ui.moreRole": "onMoreRoleClickHandler",
            'click @ui.planningNoticeContent': "onShowNoticeLayerHandler"
        },
        /**初始化**/
        initialize: function () {
            var self = this;
            self.planId = self.getOption("planId");
            self._loginBarView = new LoginBarView();
            //浏览分享层
            this.planningControlView = new ControlView(this);
            this.planningNoticeView = new PlanningNoticeView({parentView: this});
            //更多用户的显示层
            this.planningRolesView = new PlanningRolesView({parentView: this});
            self._planningFooterView = new HomeFooterView();
        },
        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender: function () {

        },
        //渲染完模板后执行,此时当前page没有添加到document
        onRender: function () {
            var self = this;
            //获取参数
//            self.planId = self.getOption("planId");
            self.currentUser = gili_data.getCurrentUser();
            //初始化企划基本信息
            PlanningModel.getPlanById(self.planId, function (data) {
                self._initPlanInfoView(data);
            }, function (err) {
                console.log(err);
            });
            //初始化企划公告基本信息
            PlanningModel.getNoticeById(self.planId, function (data) {
                if (data.length == 0) {
                    self.ui.planningNoticeContent.text("该企划还未发布公告");
                }else{
                    self.noticeObj = data;
                    self._initNoticeInfoView(data);
                    self.ui.planningNoticeContent.text("");
                }
            }, function (err) {
                console.log(err,"公告");
            });

            //初始化企划参与角色列表信息
            PlanningModel.getJoinUserById(self.planId, self.limit, 0, function (data) {
                if(data.length == 0){
                    self.ui.roleContent.text("该企划还在招募小伙伴中");
                }else{
                    self.ui.roleContent.text("");
                    self.ui.moreRole.show();
                    self._initJoinUserView(data);
                }
            }, function (err) {
                console.log(err, "角色");
            });
            //初始化评论发布框
            if (self.currentUser) {
                self.resetUserPlanRelationStatus();
            }

            //需要对应不同状态绑定不同事件,初始化加入和订阅事件
            self.ui.joinPlanning.off("click").on("click", self.onJoinClickHandler.bind(self));
            self.ui.subscribePlanning.off("click").on("click", self.onSubscribeClickHandler.bind(self));
        },
        /**
         * 版主头像点击事件
         * @param e
         */
        onAuthorClickHandler: function (e) {
            e.preventDefault();
            e.stopPropagation();
            var self = this;
            var target = e.target;
            var moderatorId = target.getAttribute("moderator-id");
            if (moderatorId) {
                app.navigate("userCenter/" + moderatorId, {replace: false, trigger: true});
            }
        },
        /**
         * 监听用户登录成功事件
         */
        onLoginOkHandler: function () {
            var self = this;
            self.currentUser = gili_data.getCurrentUser();
            self.resetUserPlanRelationStatus();
        },
        /**
         * 监听用户登出成功事件
         */
        onLogOutOkHandler: function () {
            var self = this;
            self.currentUser = null;
            //报名
            self.ui.joinPlanning.css({"background-image": "url(./images/common/btn-red.png)"})
                .html("报名企划");
            self.ui.joinPlanning.off("click").on("click", self.onJoinClickHandler.bind(self));
            //订阅
            self.ui.subscribePlanning.css({"background-image": "url(./images/common/btn-yellow.png)"})
                .html("订阅企划");
            self.ui.subscribePlanning.on("click", self.onSubscribeClickHandler.bind(self));
        },
        /**
         * 重置当前用户和企划的关系状态
         */
        resetUserPlanRelationStatus: function () {
            var self = this;
//            debugger;
            //获取用户和企划的报名关系 --- 改变按钮的状态
            PlanningModel.getUserPlanRelation(self.currentUser.id, self.planId, function (data) {
                if (data) {
                    //判断当前用户和企划的关系，更改状态按钮
                    if (data.get("approved") == 0) {   //关注的用户
                        self.ui.joinPlanning.css({"background-image": "url(./images/common/btn-gray.png)"})
                            .html("审核中");
                        self.ui.joinPlanning.off("click").on("click", self.onJoinVerifyClickHandler.bind(self));
                    } else if (data.get("approved") == 1) {  //报名
                        //加入
                        self.ui.joinPlanning.css({"background-image": "url(./images/common/btn-red.png)"})
                            .html("上传作品");
                        self.ui.joinPlanning.off("click").on("click", self.onUploadingClickHandler.bind(self));
                    } else if (data.get("approved") == 2) {    //审核未通过
                        self.ui.joinPlanning.css({"background-image": "url(./images/common/btn-gray.png)"})
                            .html("审核不通过");
                        self.ui.joinPlanning.off("click").on("click", self.onJoinVerifyErrorClickHandler.bind(self));
                    }
                } else {
                    //需要对应不同状态绑定不同事件
                    self.ui.joinPlanning.off("click").on("click", self.onJoinClickHandler.bind(self));
                }
            }, function (err) {
                console.log(err, 100);
            });

            //获取用户和企划的关注关系 --- 改变按钮的状态
            PlanningModel.getUserFlloweePlanRelation(self.currentUser.id, self.planId, function (data) {
                if (data) {
                    //判断当前用户和企划的关系，更改状态按钮
                    if (data.get("status") == 1) {   //关注的用户
                        self.ui.subscribePlanning.css({"background-image": "url(./images/common/btn-yellow.png)"})
                            .html("订阅企划");
                        self.ui.subscribePlanning.on("click", self.onSubscribeClickHandler.bind(self));
                    } else if (data.get("status") == 0) {  //取消关注的用户
                        self.ui.subscribePlanning.css({"background-image": "url(./images/common/btn-gray.png)"})
                            .html("已订阅");
                        self.ui.subscribePlanning.off("click").on("click", self.onCancelSubscribeClickHandler.bind(self));
                    }
                } else {
                    self.ui.subscribePlanning.off("click").on("click", self.onSubscribeClickHandler.bind(self));
                }
            }, function (err) {
                console.log(err, 100);
            });
        },
        show: function () {
            var self = this;
            self.updateMsg(self.SECOND);
            self.dataFinish = false;
        },
        /**
         * 初始化企划信息
         * @param data
         * @private
         */
        _initPlanInfoView: function (data) {
            var self = this;
            var authorTemp = '<div class="planning-cover" style="background: url(myPlanningCover) center no-repeat"></div>' +
                '<img class="planning-moderator button" src="myPlanningModerator" moderator-id="moderatorId" />' +
                '<span class="planning-moderator-nick">myPlanningModeratorNick</span>' +
                '<span class="planning-moderator-hint">企划主</span>';
            var bgImg = data.bg_img;
            var cover = data.cover;
            self.planName = data.name;
            var brief = data.brief;
            var author = data.user;
            var preview = data.preview;
            if (author) {
                self.moderatorNick = author.user_nick;
            }
            authorTemp = authorTemp.replace("myPlanningCover", cover).replace("myPlanningModerator", author.avatar)
                .replace("myPlanningModeratorNick", author.user_nick).replace("moderatorId", author.objectId);
            self.ui.planningBanner.css({"background": "url('" + bgImg + "') center no-repeat"});
            self.ui.planningAuthor.html(authorTemp);
            self.ui.planningDetailTitle.html(self.planName);
            self.ui.planningDetailContent.html(brief);
            self._initPlanTypeView(preview.slice(0, 4));     //这里只取前四条
            //查询热门作品
            PlanningModel.queryHottestOpus(self.planId, self.planName, function (data) {
                if (data && data.length > 0) {
                    self.ui.hottestOpusContent.text("");
                    self._initHottestOpusView(data);
                }
            }, function (err) {
                if(err == "企划关注用户为空！"){
                    self.ui.hottestOpusContent.text("该企划还未有热门作品");
                }
                console.log(err, "热门");
            });
            if (self.planId && self.planName) {
                self.loadDynamicOpus(self.limit, self.skip);
            }
        },
        loadDynamicOpus: function (limit, skip) {
            var self = this;
            //如果正在加载新页的过程中，则忽略请求，不予处理
            if (!!self.dataLoading) {
                return;
            }
            //如果数据已全部加载完成，则不予处理
            if (!!self.dataFinish) {
                return;
            }
            self.dataLoading = true;

            //查询动态作品
            PlanningModel.queryDynamicOpus(self.planId, self.planName, limit, skip, function (data) {
                if (data.length < self.limit) {
                    self.dataFinish = true;
                    self.updateMsg(self.THIRD);
                } else {
                    self.dataFinish = false;
                    self.updateMsg(self.SECOND);
                }
                if (data && data.length > 0) {
                    self.ui.dynamicContent.text("");
                    self.appendDynamicItemView(data);
                    self.skip += data.length;
                }
                self.dataLoading = false;

            }, function (err) {
                self.dataLoading = false;
                if(err == "企划关注用户为空！"){
                    self.ui.dynamicContent.text("该企划还未发布动态");
                    self.ui.dynamicContent.css("height", "auto");
                    self.ui.loadingContainer.hide();
                }else{
                    self.updateMsg(self.FIRST);
                }
                console.log(err, "动态")
            });
        },
        /**
         * 初始化企划类型信息
         * @param data
         * @private
         */
        _initPlanTypeView: function (data) {
            var self = this;
            var typeTemp = '<div class="planning-type-item" type-index="myTypeIndex">' +
                '<img  class="myPlanningTypeIsSelected button" src="myPlanningTypeSrc" type-index="myTypeIndex" />' +
                '<span class="xy-center" type-index="myTypeIndex">myPlanningTypeName</span>' +
                '</div>';
            var typeHtml = "", tempClassName , typeTempRep = '';
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                if (i == 0) {
                    self.ui.typeDetailTitle.html(obj.description.title);
                    self.ui.typeDetailContent.html(obj.description.content.replace(/\n/g, "<br/>"));
                }
                tempClassName = i == 0 ? "planning-type-item-selected" : "";
                typeTempRep = typeTemp.replace(/myTypeIndex/g, i + 1).replace(/myPlanningTypeIsSelected/g, tempClassName)
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
        _initNoticeInfoView: function (data) {
            var self = this;
            var noticeTemp = '<li notice-index="myNoticeIndex" class="button"><span notice-index="myNoticeIndex" >noticeCreateTime</span><span notice-index="myNoticeIndex" >noticeDescription</span></li>';
            var noticeLi = "", noticeRepTemp = "";
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                var time = utils.formatTime(obj.createdAt, "yyyy.MM.dd");
                noticeRepTemp = noticeTemp.replace(/myNoticeIndex/g, i + 1).replace(/noticeCreateTime/g, time)
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
        _initJoinUserView: function (data) {
            var self = this;
            var joinUserTemp = '<div class="join-role-item" role-id="roleId">' +
                '<img  src="joinUserHeaderSrc" role-id="roleId" class="itemSelected button"/>' +
                '<span class="showName common-name-hint" role-id="roleId">roleName</span>' +
                '</div>';
            var joinUserHtml = "", joinUserRepTemp = "";
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                var avatar = obj.get("user").get("avatar");
                var name = obj.get("user").get("user_nick");
                var userId = obj.get("user").id;
                var selectedTemp = i == 0 ? "join-role-item-selected" : "";
                var isShow = i == 0 ? "show" : "hide";
                joinUserRepTemp = joinUserTemp.replace(/roleId/g, userId).replace(/itemSelected/g, selectedTemp)
                    .replace(/showName/g, isShow).replace(/joinUserHeaderSrc/g, avatar)
                    .replace(/roleName/g, name);
                joinUserHtml += joinUserRepTemp;
            }
            self.ui.roleContent.html(joinUserHtml);
        },
        /**
         *
         * @param data
         * @private
         */
        _initHottestOpusView: function (data) {
            var self = this;
            var hottestOpusTemp = '<div class="hottest-opus-item" opus-index="opusIndex">' +
                '<img  src="opusFirstImg" opus-index="opusIndex" class="button itemSelected" />' +
                '<span class="common-opus-hint hintSelectedClass" opus-index="opusIndex">opusBreif</span>' +
                '</div>';
            var hottestOpusHtml = "", hottestOpusRepTemp = "";
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                var pictures = obj.get("pictures")[0];
                //changed by zhao
                // var topic = obj.get("topic");
                var topic = obj.get("user").get("user_nick");
                var selectedTemp = i == 0 ? "hottest-opus-item-selected " : "";
                var hintSelectedClass = i == 0 ? "opus-hint-selected" : "";
                hottestOpusRepTemp = hottestOpusTemp.replace(/opusIndex/g, i + 1).replace(/itemSelected/g, selectedTemp)
                    .replace(/hintSelectedClass/g, hintSelectedClass).replace(/opusFirstImg/g, pictures)
                    .replace(/opusBreif/g, topic);
                hottestOpusHtml += hottestOpusRepTemp;
            }
            self.ui.hottestOpusContent.html(hottestOpusHtml);
        },
        /**
         * 追加动态作品
         * @param data
         */
        appendDynamicItemView: function (data) {
            var self = this;
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                obj = utils.convert_2_json(obj);    //需要JSON数据
                var item = new BlogItemView();
                item.render();
                item.initData(obj, self.THIRD);
                self.itemList.push(item);
                self.ui.dynamicContent.append(item.$el);
            }
            self.masonryRefresh(true);
        },
        /**
         * 刷新数据
         * @param needLoad
         */
        masonryRefresh: function (needLoad) {
            var self = this;
            if (needLoad) {
                self.ui.dynamicContent.imagesLoaded(function () {
                    $('.dynamic-content').masonry('reload');
                });
            } else {
                $('.dynamic-content').masonry('reload');
            }
        },
        /**
         * 清除创建的动态itemview
         */
        clearItemList: function () {
            var self = this;
            for (var i = 0; i < self.itemList.length; i++) {
                self.itemList[i].onDestroy();
                self.itemList[i] = null;
            }
            self.itemList.length = 0;
            self.ui.dynamicContent.html("");
        },
        //页间动画已经完成，当前page已经加入到document
        pageIn: function () {
            var self = this;
            //显示登录条
            self.LoginBarRegion.show(self._loginBarView);
            self.PlanningFooterRegion.show(self._planningFooterView);
            $('.dynamic-content').masonry({
                itemSelector: '.blogItemView',
                gutterWidth: 20 //每两列之间的间隙为5像素
            });
            self.addEvent();
        },
        addEvent: function () {
            var self = this;
            this.planningNoticeView.on("hide:planning:notice:handle", this.onPlanningNoticeViewHideHandler, this); //隐藏击事件
            this.planningRolesView.on("hide:planning:roles:handler", this.onPlanningRolesViewHideHandler, this); //隐藏击事件
            app.on("update:masonry:list", self.masonryRefresh, self);
            app.on("login:ok", this.onLoginOkHandler, this);
            app.on("logOut:ok", this.onLogOutOkHandler, this);
            window.onscroll = null;
            window.onscroll = function (e) {
                //TODO 获取加载的信息的高度
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                if (scrollTop + window.innerHeight > document.body.offsetHeight - 400) {
                    //实现滚动加载
                    if (!self.dataFinish) {
                        if (self.planId && self.planName) {
                            self.loadDynamicOpus(self.limit, self.skip);
                        }
                    }
                }
            };
        },

        removeEvent: function () {
            var self = this;
            app.off("update:masonry:list", self.masonryRefresh, self);
            app.off("login:ok", this.onLoginOkHandler, this);
            app.off("logOut:ok", this.onLogOutOkHandler, this);
            this.planningNoticeView.off("hide:planning:notice:handle", this.onPlanningNoticeViewHideHandler, this);
            this.planningRolesView.off("hide:planning:roles:handler", this.onPlanningRolesViewHideHandler, this); //隐藏击事件
            window.onscroll = null;
        },
        /**
         * 企划类型点击事件
         * @param e
         */
        onTypeClickHandler: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var target = e.target;
            var $target = $(target);
            var typeIndex = $target.attr("type-index");
            var currentImg;
            typeIndex = parseInt(typeIndex);
            if (typeIndex) {
                //todo 先清除样式
                var typeImages = self.ui.planningType.find("img");
                for (var i = 0; i < typeImages.length; i++) {
                    $(typeImages[i]).removeClass("planning-type-item-selected");
                }
                //需要找到父控件
                if (!$target.hasClass("planning-type-item")) {
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
        changeTypeDetail: function (type) {
            var self = this;
            var currentDetails = PlanningModel.getTypeDetailByIndex(self.planId, type);
            if (!currentDetails)return;
            var detailContent = currentDetails.content.replace(/\n/g, "<br/>");	//把回车替换成<br />
            self.ui.typeDetailTitle.html(currentDetails.title);
            self.ui.typeDetailContent.html(detailContent);
        },
        /**
         * 参与角色点击事件
         * @param e
         */
        onRoleClickHandler: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var target = e.target;
            var $target = $(target);
            var roleId = $target.attr("role-id");
            var currentImg , currentSpn;
            if (roleId) {
                //todo 先清除样式
                var roleImages = self.ui.roleContent.find("img");
                var roleSpans = self.ui.roleContent.find("span");
                for (var i = 0; i < roleImages.length; i++) {
                    $(roleImages[i]).removeClass("join-role-item-selected");
                    $(roleSpans[i]).removeClass("show").addClass("hide");
                }
                //需要找到父控件
                if (!$target.hasClass("join-role-item")) {
                    $target = $target.parent();
                }
                currentImg = $target.find("img");
                currentImg.addClass("join-role-item-selected");
                currentSpn = $target.find("span");
                currentSpn.addClass("hide").addClass("show");
                app.navigate("userCenter/" + roleId, {replace: false, trigger: true});
            }
        },
        /**
         * 热门作品点击事件
         * @param e
         */
        onOpusClickHandler: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var target = e.target;
            var $target = $(target);
            var opusIndex = $target.attr("opus-index");
            var currentImg , currentSpn;
            if (opusIndex) {
                opusIndex = parseInt(opusIndex);
                //todo 先清除样式
                var opusImages = self.ui.hottestOpusContent.find("img");
                var opusSpans = self.ui.hottestOpusContent.find("span");
                for (var i = 0; i < opusImages.length; i++) {
                    $(opusImages[i]).removeClass("hottest-opus-item-selected");
                    $(opusSpans[i]).removeClass("opus-hint-selected");
                }
                //需要找到父控件
                if (!$target.hasClass("hottest-opus-item")) {
                    $target = $target.parent();
                }
                currentImg = $target.find("img");
                currentImg.addClass("hottest-opus-item-selected");
                currentSpn = $target.find("span");
                currentSpn.addClass("opus-hint-selected");
//                MsgBox.alert("点击了作品"+opusIndex);
                var picturesArr = PlanningModel.getHottestOpusPicturesByIndex(self.planId, opusIndex);
                if (picturesArr) {
                    BookPreviewView.show(picturesArr);
                }
            }
        },
        /**
         * 加入企划点击事件
         * @param e
         */
        onJoinClickHandler: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            if (!self.currentUser) {
                MsgBox.toast("亲，请先登录！", false);
                return;
            }
            PlanningModel.joinPlan(self.planId, function (data) {
                //点击报名成功的时候处理UI
                if (data.get("approved") == 0) {
                    self.ui.joinPlanning.css({"background-image": "url(./images/common/btn-gray.png)"})
                        .html("审核中");
                    self.ui.joinPlanning.off("click").on("click", self.onJoinVerifyClickHandler.bind(self));
                }
            }, function (err) {
                console.log(err, 822);
            });
        },
        /**
         *报名审核中
         * @param e
         */
        onJoinVerifyClickHandler: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.alert("报名正在审核中...");
        },
        /**
         *报名审核中
         * @param e
         */
        onJoinVerifyErrorClickHandler: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            MsgBox.alert("报名审核失败");
        },
        /**
         * 订阅企划点击事件 -- 1
         * @param e
         */
        onSubscribeClickHandler: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            if (!self.currentUser) {
                MsgBox.toast("亲，请先登录！", false);
                return;
            }
            PlanningModel.subscribePlan(self.planId, function (data) {
                //点击报名成功的时候处理UI
                if (data) {
                    self.ui.subscribePlanning.css({"background-image": "url(./images/common/btn-gray.png)"})
                        .html("已订阅");
                    self.ui.subscribePlanning.off("click").on("click", self.onCancelSubscribeClickHandler.bind(self));
                    MsgBox.toast("订阅企划成功");
                }
            }, function (err) {
                console.log(err);
            });
        },
        /**
         * 取消订阅点击事件 -- 999
         * @param e
         */
        onCancelSubscribeClickHandler: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            PlanningModel.cancelSubscribePlan(self.planId, function (data) {
                //点击报名成功的时候处理UI
                if (data) {
                    self.ui.subscribePlanning.css({"background-image": "url(./images/common/btn-yellow.png)"})
                        .html("订阅企划");
                    self.ui.subscribePlanning.off("click").on("click", self.onSubscribeClickHandler.bind(self));
                    MsgBox.toast("取消订阅企划成功");
                }
            }, function (err) {
                console.log(err);
            });
        },
        /**
         * 上传作品点击事件
         * @param e
         */
        onUploadingClickHandler: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var param = {};
            param.type = "ill";
            param.labels = [self.planName];
            PublishView.show(param);
        },
        /**
         * 更多用户点击事件
         * @param e
         */
        onMoreRoleClickHandler: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            if (self.planningControlView && self.planningRolesView) {
                self.planningControlView.show(self.planningRolesView);
            }
        },
        /**
         * 显示公告点击的浮层
         * @param e
         */
        onShowNoticeLayerHandler: function (e) {
            var self = this;
            var target = e.target;
            var noticeIndex = $(target).attr("notice-index");
            //TODO 更换为新的弹出形式,数据加载完之后
            if (noticeIndex) {
                noticeIndex = parseInt(noticeIndex);
                self.currentNotice = self.noticeObj[noticeIndex - 1];
                if (self.planningControlView && self.planningNoticeView) {
                    self.planningControlView.show(self.planningNoticeView);
                }
            }
        },
        onPlanningNoticeViewHideHandler: function () {
            if (this.planningControlView && this.planningNoticeView) {
                this.planningControlView.hide(this.planningNoticeView);
            }
        },
        onPlanningRolesViewHideHandler: function () {
            if (this.planningControlView && this.planningRolesView) {
                this.planningControlView.hide(this.planningRolesView);
            }
        },
        /**
         * 更新状态
         * @param type
         *         索引0： 1:加载出错  2:数据正常加载  3:数据加载结束
         */
        updateMsg: function (type) {
            var self = this;
            self.ui.loadingContainer.find("img").show();
            self.ui.loadMsg.html("你的大片正在加载...");
            if (type == self.FIRST) {   //加载出错时，有数据只文案提示  无数据显示缺省无网状态且文案提示
                self.ui.loadingContainer.find("img").hide();
                self.ui.loadMsg.html("网络不好,请重试");
            } else if (type == self.SECOND) { //数据正常加载
                self.ui.loadingContainer.find("img").show();
                self.ui.loadMsg.html("正在加载");
            } else if (type == self.THIRD) { //数据加载结束
                self.ui.loadingContainer.find("img").hide();
                self.ui.loadMsg.html("没有更多了");
            }
        },
        /**页面关闭时调用，此时不会销毁页面**/
        close: function () {
            var self = this;
            self.removeEvent();
            self.clearItemList();
            if (this.planningControlView && this.planningNoticeView) {
                this.planningControlView.empty(this.planningNoticeView);
                this.planningControlView.empty(this.planningRolesView);
            }
            self.planId = "";            //企划ID
            self.currentUser = null;    //当前用户
            self.moderatorNick = "";     //版主昵称
            self.noticeObj = null;      //企划公告对象
            self.currentNotice = null;   //当前选中的通告对象
            self.planName = "";      // 企划名称
            self.planId = "";   //企划ID
            self.limit = 6;
            self.skip = 0;
            PublishView.hide();
            BookPreviewView.hide();
            self.LoginBarRegion.hide(self._loginBarView);
            self.PlanningFooterRegion.hide(self._planningFooterView);
        },

        //当页面销毁时触发
        onDestroy: function () {
            this.remove();
        }
    });
});