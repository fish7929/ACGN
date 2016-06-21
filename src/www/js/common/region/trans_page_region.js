// 文件名称: animate_region
//
// 创 建 人: chenshy
// 创建日期: 2015/7/22 18:29
// 描    述: 负责页间转场动画
define([
    'marionette',
    'common/base/ViewManager'
], function (Marionette, viewManager) {

    return Marionette.Region.extend({
        show: function (viewClass, options) {
            var self = this;
            if (!self._ensureElement()) {
                return;
            }

            var view = viewManager.getViewInstance(viewClass, options);

            self._isReverse = false;

            self._ensureViewIsIntact(view);

            var _isSameView = view === self.currentView;

            //删除现有的视图
            if(!_isSameView && self.currentView){

                self.closeView(self.currentView);

                delete self.currentView._parent;
                if (self.currentView.close) {
                    self.currentView.close();
                }

                var forever = self.currentView.getOption("forever");
                if (forever === false) {
                    viewManager.destroyView(self.currentView);
                }
                self.currentView = null;
                delete self.currentView;
            }
            if (!view.isRendered) {
                view.render();
                view.isRendered = true;
            }
            if(!view.el.parentNode) {
                self.openView(view);
            }
            view._parent = self;
            if(view.show) {
                view.show();
            }
            if(view.pageIn) {
                view.pageIn();
            }
            self.currentView = view;
            return self;
        },

        /**
         * 关闭视图
         * @param view
         */
        closeView: function (view) {
            view.el.remove();
        },

        /**
         * 打开视图
         * @param view
         */
        openView: function (view) {
            this.el.appendChild(view.el);
        },

        __empty: function () {
            this.empty();
        }
    });
});