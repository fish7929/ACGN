/**
 * Created by Administrator on 2016/6/29.
 */
define([
    'common/base/base_view',
    'text!module/Associations/templates/associations.html',
    'marionette',
    'common/views/loginBar'
],function(BaseView,AssociationsTpl,mn,LoginBarView){
    var associationsView = BaseView.extend({
        id:"AssociationsContainer",
        template: _.template(AssociationsTpl),
        initialize:function(){
            this._loginBarView = new LoginBarView();
        },
        regions : {
            "loginBar":"#associationsLogin"
        },
        onRender:function(){
            this.getRegion("loginBar").show(this._loginBarView);
        },
        show:function(){},
        pageIn:function(){},
        close:function(){}
    });
    return associationsView;
});
