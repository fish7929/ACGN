/**
 * Created by Administrator on 2016/6/25.
 */
define([
    'module/userCenter/views/userCenterView',
    'module/userCenter/views/userCenterFansView'
],function(UserCenterView,UserCenterFansView){
    return {
        userCenter:function(){
            app.page.show(UserCenterView);
        },
        userCenterFans:function(){
            app.page.show(UserCenterFansView);
        }
    }
});