/**
 *   功能：点击公告
 *   概述：公告详情显示
 *   时间：2016/7/2
 *   人物：fishYu
 */
define([
    'common/base/item_view',
    'text!module/planning/templates/planning_notice.html',
    "marionette"
],function(ItemView,tpl, mn) {
    /**
     * 活动类型
     */
    return ItemView.extend({
        id: 'planning-notice-layer',
        template: _.template(tpl),
        _isShow: false,
        parentView : null,  //父对象
        authorNick : "",
        currentNotice : null,
        // key : selector
        ui: {
            planningNoticeMask:'#planning-notice-mask',
            noticeLayerTitle : ".planning-notice-layer-title",
            noticeLayerContent : ".planning-notice-layer-content"
        },
        //事件添加
        events: {
            'click @ui.planningNoticeMask' : "hidePlanningNoticeHandle"
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
            self.authorNick = self.parentView.moderatorNick;
            self.currentNotice = self.parentView.currentNotice;
            self._initView();
        },
        /**
         * 初始公告内容层
         * @private
         */
        _initView : function(){
            var self = this;
            if(self.currentNotice){
                var time = utils.formatTime(self.currentNotice.createdAt, "yyyy.MM.dd HH:mm");
                var titleTemp = '<div class="planning-notice-layer-type">' +
                    self.currentNotice.description + '</div>'+
                    '<div class="planning-notice-layer-author"><span>' +self.authorNick +
                    '</span><span>' + time+'</span></div>';
                self.ui.noticeLayerTitle.html(titleTemp);
                self.ui.noticeLayerContent.html(self.currentNotice.content);
            }
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
        hidePlanningNoticeHandle : function(e){
            e.preventDefault();
            e.stopPropagation();
            mn.triggerMethodOn(this, "hide:planning:notice:handle");

        },
        /**
         * 重置属性和初始状态
         */
        resetData : function(){
            self.authorNick = null;
            self.currentNotice = null;
        }
    });
});