/**
 * Created by Administrator on 2016/6/25.
 */
define([
    'common/base/base_view',
    'text!module/userCenter/templates/userCenter.html',
    'marionette',
    'common/region/switch_view_region',
    'common/views/login',
    'common/views/loginBar'
],function(BaseView,UserCenterTpl,mn,SwitchViewRegion,login,LoginBarView){
    var userCenterView = BaseView.extend({
        id:"userCenterContainer",
        template: _.template(UserCenterTpl),
        initialize:function(){
            console.log("initialize userCenterView");
            this._loginBarView = new LoginBarView();
        },
        regions : {
            "loginBar":"#userCenterLogin"
        },
        onRender:function(){
            this.getRegion("loginBar").show(this._loginBarView);
        },
        show:function(){

        },
        pageIn:function(){

        }
    });
    return userCenterView;
});