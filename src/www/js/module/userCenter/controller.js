/**
 * Created by Administrator on 2016/6/25.
 */
define([
    'module/userCenter/views/userCenterView',
    '../userCenterFans/views/userCenterFansView'
],function(UserCenterView,UserCenterFansView){
    return {
        userCenter:function(userId){
            app.page.show(UserCenterView,{userId:userId});
        },
        userCenterFans:function(type,userId){
            app.page.show(UserCenterFansView,{type:type,userId:userId});
        }
    }
});