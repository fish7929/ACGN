/**
 * Created by Administrator on 2016/6/25.
 */
define([
    'common/base/base_view',
    'text!module/userCenter/templates/userCenterFans.html',
    'marionette',
    'common/region/switch_view_region',
    'common/views/loginBar',
    'module/userCenter/views/userCenterHeadView'
],function(BaseView,UserCenterFansTpl,mn,SwitchViewRegion,LoginBarView,UserCenterHeadView){
    var userCenterFansView = BaseView.extend({
        id:"userCenterFansContainer",
        template: _.template(UserCenterFansTpl),
        _userId:"",
        initialize:function(){
            this._loginBarView = new LoginBarView();
            this.userCenterHeadView = new UserCenterHeadView();
        },
        regions : {
            "loginBar":"#userCenterLogin",
            "headCon":"#userCenterFansHeaderCon"
        },
        onRender:function(){
            this.getRegion("loginBar").show(this._loginBarView);
            this.getRegion("headCon").show(this.userCenterHeadView);
            this.userCenterHeadView.setSelected(1);
        },
        show:function(){
            var self = this;
            var userId = self.getOption("userId");
            this.userCenterHeadView._loadData(userId);
        },
        pageIn:function(){

        }
    });
    return userCenterFansView;
});