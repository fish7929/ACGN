// 文件名称: switch_view_region
//
// 创 建 人: chenshy
// 创建日期: 2015/7/27 10:12
// 描    述: 负责切换view,view需要手动去destroy
define([
    'marionette'
],function(mn){

    return mn.Region.extend({

        show: function(view, options) {
            if (!this._ensureElement()) {
                return;
            }

            this._ensureViewIsIntact(view);

            var showOptions     = options || {};
            //是否是不同的view
            var isDifferentView = view !== this.currentView;
            //是否防止view销毁
            var preventDestroy  = !!showOptions.preventDestroy;
            var forceShow       = !!showOptions.forceShow;

            //是否有当前view
            var isChangingView = !!this.currentView;

            //如果是不同的view或者强制显示下一个view,才显示下一个view
            var _shouldShowView = isDifferentView || forceShow;
            this.showingView = view;
            if (_shouldShowView) {
                //view.once('destroy', this.empty, this);
                if(!view.isRendered){
                    view.render();
                    view.isRendered = true;
                }

                view._parent = this;
                this.openView(view);

                //动画
                var self = this;

                _.delay(function(){
                    if(view.onShow){
                        view.onShow();
                    }
                    self._switchPage();
                },0);

                return this;
            }

            return this;
        },

        hide : function(view){
            var isDifferentView = view !== this.currentView;
            if(isDifferentView) return;
            if(view.close){
                view.close();
            }
            this.currentView = null;
        },


        /**
         * 打开视图
         * @param view
         */
        openView : function(view){
            this.el.appendChild(view.el);
        },

        _switchPage : function(){
            if(this.currentView){
                delete this.currentView._parent;

                if(this.currentView.close){
                    this.currentView.close();
                }

                this.currentView = null;
                delete this.currentView;
            }

            this.currentView = this.showingView;
            if(this.showingView.pageIn){
                this.showingView.pageIn();
            }

            this.showingView = null;
            delete this.showingView;
        },
        empty: function(view) {
            view = view || this.currentView;

            if (!view) { return; }

            view.off('destroy', this.empty, this);
            this._destroyView(view);

            delete this.currentView;

            return this;
        },

        _destroyView: function(view) {
            if (view.destroy && !view.isDestroyed) {
                view.destroy();
            } else if (view.remove) {
                view.remove();
                view.isDestroyed = true;
            }
        }
    });
});