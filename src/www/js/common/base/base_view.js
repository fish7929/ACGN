// 文件名称: base_view
//
// 创 建 人: chenshy
// 创建日期: 2015/7/23 11:42
// 描    述: base_view
define([
    'marionette'
],function(mn){
    var view = mn.LayoutView;
    var BaseView = function(options){
        "use strict";

        this.title = this.title || ""; //
        this.renderParams = {};
        view.apply(this,[options]);

        this.forever = this.forever === undefined ? false : this.forever;

        this._controlViews = [];

        this.setTitle(this.title);
    };

    _.extend(BaseView.prototype,view.prototype,{

        close : function(){
        },

        setTitle : function(title){
            this.title = title;
        },
        getTitle : function(){
            return this.title;
        },

        reShowTitle : function(){
            window.document.title = this.title;
        },

        addControlView : function(view){
            if(this._controlViews.indexOf(view) == -1){
                this._controlViews.push(view);
            }
        },
        removeControlView : function(view){
            if(this._controlViews.indexOf(view) >= 0){
                this._controlViews.splice(this._controlViews.indexOf(view),1);
            }
        }
    });

    BaseView.extend = view.extend;

    return BaseView;
});