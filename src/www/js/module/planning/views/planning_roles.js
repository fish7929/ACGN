/**
 *   功能：点击查看更多用户
 *   概述：更多用户显示
 *   时间：2016/7/9
 *   人物：fishYu
 */
define([
    'common/base/item_view',
    'text!module/planning/templates/planning_roles.html',
    "marionette",
    "module/planning/model/planning_model",
    "msgbox"
],function(ItemView,tpl, mn, PlanningModel,MsgBox) {
    /**
     * 活动类型
     */
    return ItemView.extend({
        id: 'planning-roles-layer',
        template: _.template(tpl),
        _isShow: false,
        parentView : null,  //父对象
        roleInitSkip : 1,       //从第六条开始 // 6  TODO 暂时测试更好为 roleInitSkip 1，limit 1后期替换为6 10
        limit : 1,     //10
        maxLength : 0,
        tempSpanWidth : 70,     //宽度 50 + marginRight 20
        planId : "",    //父容器的企划ID
        // key : selector
        ui: {
            planningRolesMask:'#planning-roles-mask',
            rolesLayerTitle : "#planning-roles-layer-title",
            rolesLayerContent : ".planning-roles-wrapper",
            rolesFirstPage: ".roles-first-page",    //起始页
            rolesPageNumber: ".roles-page-number",   //中间页序容器
            rolesLastPage : ".roles-last-page",     //最后一页
            rolesAllPage : ".roles-all-pages",      //所有页
            pageNumberTxt : "#page-number-txt",     //输入值
            rolesGoToPage : ".roles-go-to-page",     // 跳转页
            rolesSpanWrapper : ".roles-span-wrapper"    //需要动态计算宽度 self.maxLength* span.outterWidth
        },
        //事件添加
        events: {
            'click @ui.planningRolesMask' : "hidePlanningRolesHandler",
            'click @ui.rolesLayerContent' : "onRolesLayerClickHandler",
            'click @ui.rolesFirstPage' : "onPageNumClickHandler",
            'click @ui.rolesPageNumber' : "onPageNumClickHandler",
            'click @ui.rolesLastPage' : "onPageNumClickHandler",
            'click @ui.rolesGoToPage' : "onRolesGoToPageClickHandler"
        },
        /**初始化**/
        initialize: function () {
            this.parentView = this.getOption("parentView");
            this.planId = this.parentView.planId;
        },
        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender: function () {

        },
        //渲染完模板后执行,此时当前page没有添加到document
        onRender: function () {
            var self = this;
            //获取加入用户的总个数
            PlanningModel.getJoinRolesCount(this.parentView.planId, function(data){
                if(data){
                    var currentLength = data.count - self.roleInitSkip;
                    if(currentLength > 0){
                        console.log(currentLength);
                        self.maxLength = Math.ceil(currentLength / self.limit); //页码的总数 rolesSpanWrapper
                        //根据页总数初始化设置页序
                        self._initView();
                    }
                }
            },function(err){

            });
        },
        show : function(){
            var self = this;
            //查询跳过的首页信息
            self.loadRolesByPageNum(self.limit, self.roleInitSkip);
        },
        /**
         * 安装页去查询加入用户信息
         * @param limit
         * @param skip
         */
        loadRolesByPageNum : function(limit, skip){
            var self = this;
            //查询跳过的首页信息
            PlanningModel.getJoinUserById(self.planId, limit, skip, function(data){
                if(data){
                    self.resetRoleData(data);
                }
            }, function(err){});
        },
        /**
         * 初始公告内容层
         * @private
         */
        _initView : function(){
            var self = this;
            var tempSpan = "";
            var spanSelected = "";
            var width = self.maxLength * self.tempSpanWidth;
            self.ui.rolesSpanWrapper.css({"width": width + "px" }); //动态设置 span 容器的宽度
            for(var i = 0; i < self.maxLength; i++){
                spanSelected =  i == 0 ? "roles-page-number-selected" : "";
                tempSpan += '<span class="button '+spanSelected+'" data-num="'+ (i + 1)+'">'+(i+1)+'</span>';
            }
            self.ui.rolesSpanWrapper.html(tempSpan);
            self.ui.rolesLastPage.attr("data-num", self.maxLength);
            self.ui.rolesAllPage.html("共"+self.maxLength+"页");
        },
        /**
         * 根据页数据重置角色容器
         * @param data
         */
        resetRoleData : function(data){
            var self = this;
            self.ui.rolesLayerContent.html("");
            var roleTemp = '<div class="role-layer-item" role-id="roleId">'+
                '<img src="roleHeader" role-id="roleId" class="button">'+
                '<span class="role-layer-name-hint" role-id="roleId">roleName</span>'+
                '</div>';
            var roleHtml = "", roleTempRep = "";
            for(var i = 0; i < data.length; i++){
                var obj = data[i];
                var avatar = obj.get("user").get("avatar");
                var name = obj.get("user").get("user_nick");
                var userId = obj.get("user").id;
                roleTempRep = roleTemp.replace(/roleId/g, userId).replace(/roleHeader/g, avatar)
                    .replace(/roleName/g, name);
                roleHtml += roleTempRep;
            }
            self.ui.rolesLayerContent.html(roleHtml);
        },
        //页间动画已经完成，当前page已经加入到document
        pageIn: function () {
            if(this._isShow){
                return;
            }
            this._isShow = true;
            this._animate(false);
        },
        /**页面关闭时调用，此时不会销毁页面**/
        close: function () {
            this.hide();
        },
        //当页面销毁时触发
        onDestroy: function () {
            this.remove();
        },
        /**
         * 显示动画
         * @param reverse
         * @private
         */
        _animate: function (reverse) {
            var self = this;
            this._animating = true;
            if(reverse){
                if(!self._isShow){
                    self.$el.hide();
                    //隐藏之后重置图标
                    self.resetData();
                }
                self._animating = false;
            }else{
                self.$el.show();
                self._animating = false;
            }
        },
        /**
         *隐藏当前VIEW
         */
        hide: function () {
            if (!this._isShow) {
                return;
            }
            this._isShow = false;
            this._animate(true);
        },
        /**
         * 点击遮罩时候事件
         * @param e
         * @private
         */
        hidePlanningRolesHandler : function(e){
            e.preventDefault();
            e.stopPropagation();
            mn.triggerMethodOn(this, "hide:planning:roles:handler");

        },
        /**
         *
         * @param e
         */
        onRolesLayerClickHandler : function(e){
            e.preventDefault();
            e.stopPropagation();
            mn.triggerMethodOn(this, "hide:planning:roles:handler");
            var self = this;
            var target = e.target;
            var $target = $(target);
            var roleId = $target.attr("role-id");
            if(roleId){
                app.navigate("userCenter/" + roleId, {replace:false, trigger: true});
            }
        },
        /**
         * 跳转页
         * @param e
         */
        onPageNumClickHandler : function(e){
            e.preventDefault();
            e.stopPropagation();
            var self = this;
            var target = e.target;
            var pageNum = target.getAttribute("data-num");
            if(pageNum){
                self.jumpPageOperation(pageNum);
            }

        },
        /**
         * 跳转页
         * @param e
         */
        onRolesGoToPageClickHandler : function(e){
            e.preventDefault();
            e.stopPropagation();
            var self = this;
            var pageNum = self.ui.pageNumberTxt.val();
            if(self.checkInputTex(pageNum)){
                self.jumpPageOperation(pageNum);
            }
        },
        /**
         * 检测输入框的值是否有效
         * @param val
         */
        checkInputTex : function(val){
            var self = this;
            var res = true;
            if(!val){
                MsgBox.toast("请输入有效的页码", false);
                self.ui.pageNumberTxt.val("");
                res = false
            }else if ( val > self.maxLength){
                MsgBox.toast("页码超过总页数", false);
                self.ui.pageNumberTxt.val("");
                res = false
            }else if ( val < 1){
                MsgBox.toast("页码不得少于一页", false);
                self.ui.pageNumberTxt.val("");
                res = false
            }
            return res;
        },
        /**
         * 跳转页的实现
         * @param pageNum
         */
        jumpPageOperation : function(pageNum){
            var self = this;
            pageNum = parseInt(pageNum);
            var skip = self.roleInitSkip + self.limit * (pageNum - 1);
            self.resetSpanSelected(pageNum);
//            MsgBox.toast("点击了第"+pageNum+"页--"+ skip);
            //todo 查询数据更改页面
            self.loadRolesByPageNum(self.limit, skip);
        },
        /**
         *
         * @param num
         */
        resetSpanSelected : function (num){
            var self = this;
            var spanArr = self.ui.rolesPageNumber.find("span");
            for(var i = 0; i < spanArr.length; i++){
                $(spanArr[i]).removeClass("roles-page-number-selected");
            }
            $(spanArr[num - 1]).addClass("roles-page-number-selected");
            //以下为移动5个点的距离
            var left = (num + 2)*self.tempSpanWidth
            var containerWidth = self.ui.rolesPageNumber.width();
            var temp = left - containerWidth ;
            self.ui.rolesPageNumber.scrollLeft(temp);

        },
        /**
         * 重置属性和初始状态
         */
        resetData : function(){
            var self = this;
            self.roleSkip = 0;
            self.currentNotice = null;
        }
    });
});