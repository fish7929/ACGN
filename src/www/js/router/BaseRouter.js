// 文件名称: BaseRouter
//
// 创 建 人: chenshy
// 创建日期: 2015/1/28 10:07
// 描    述: BaseRouter
define([
    'backbone',
    'marionette'
],function(Backbone,mn){

    var BaseRouter = function(options){
        "use strict";
        mn.AppRouter.apply(this,[options]);
        this._bindLoginFilter();
        this._bindBackRoutes();
    };

    _.extend(BaseRouter.prototype,mn.AppRouter.prototype,{
        /**
         * 路由登陆过滤
         * key 路由地址
         * value 匹配后调用的方法,为空时调用defaultLoginMethod
         */
        loginFilters : {

        },

        defaultLoginMethod : function(){
            //MsgBox.alert("您尚未登陆！");
        },

        _bindLoginFilter : function(){
            if(!this.loginFilters) return;
            var filter,filters = _.keys(this.loginFilters);
            while((filter = filters.pop()) != null){
                this._filter(filter,this.loginFilters[filter]);
            }
        },

        _bindBackRoutes : function(){
            if(!this.backRoutes) return;

            var backRoute,backRoutes = _.keys(this.backRoutes);
            var arr;
            while((backRoute = backRoutes.pop()) != null){
                arr = backRoute.split(" ");
                while(arr.length > 0){
                    this._backRoute(arr.shift(),this.backRoutes[backRoute]);
                }
            }
        },

        _backRoute : function(backRoute,arr){
            if (!_.isRegExp(backRoute)) backRoute = this._routeToRegExp(backRoute);
            var reg;
            var arrReg = [];
            for(var i = 0;i < arr.length;i++){
                reg = this._routeToRegExp(arr[i]);
                arrReg[i] = reg;
            }

            Backbone.history.__backRoute(backRoute,arrReg);

            return this;
        },

        _filter : function(route,name,callback){
            if (!_.isRegExp(route)) route = this._routeToRegExp(route);
            var controllers = this.getOption("controller");
            if (!callback) callback = this[name] || controllers[name] || this.defaultLoginMethod;

            var handle = _.bind(function(fragment) {
                var args = this._extractParameters(route, fragment);
                callback && callback.apply(this, args);
            }, this);

            Backbone.history.__loginValidate._loginFilter(route,handle);

            return this;
        },

        navigate: function(fragment, options) {
            Backbone.history.navigate(fragment, options);
            return this;
        },

        goBack : function(option){
            Backbone.history.goBack(option);
        }
    });

    BaseRouter.extend = Backbone.Router.extend;

    return BaseRouter;
});