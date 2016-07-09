/**
 *   功能：点击查看更多用户
 *   概述：更多用户显示
 *   时间：2016/7/9
 *   人物：fishYu
 */
define([
    'common/base/item_view',
    'text!module/planning/templates/planning_roles.html',
    "marionette"
],function(ItemView,tpl, mn) {
    /**
     * 活动类型
     */
    return ItemView.extend({
        id: 'planning-roles-layer',
        template: _.template(tpl),
        _isShow: false,
        parentView : null,  //父对象
        roleSkip : 6,       //从第六条开始
        limit : 10,
        // key : selector
        ui: {
            planningRolesMask:'#planning-roles-mask',
            rolesLayerTitle : "#planning-roles-layer-title",
            rolesLayerContent : ".planning-roles-wrapper"
        },
        //事件添加
        events: {
            'click @ui.planningRolesMask' : "hidePlanningRolesHandler",
            'click @ui.rolesLayerContent' : "onRolesLayerClickHandler"
        },
        /**初始化**/
        initialize: function () {
            this.parentView = this.getOption("parentView");
        },
        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender: function () {

        },
        //渲染完模板后执行,此时当前page没有添加到document
        onRender: function () {

        },
        show : function(){
            var self = this;
            self._initView();
        },
        /**
         * 初始公告内容层
         * @private
         */
        _initView : function(){
            var self = this;
        },
        //页间动画已经完成，当前page已经加入到document
        pageIn: function () {
            if(this._isShow){
                return;
            }
            this._isShow = true;
            this._animate(false);
            $ (window).unbind ('scroll');
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
            $ (window).on ('scroll');
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
         * 重置属性和初始状态
         */
        resetData : function(){
            var self = this;
            self.roleSkip = 0;
            self.currentNotice = null;
        }
    });
});