/**
 * Created by Administrator on 2016/6/25.
 */
define([
    'module/Associations/views/associationsView'
],function(AssociationsView){
    return {
        Associations:function(assoId){
            app.page.show(AssociationsView,{assoId:assoId});
        }
    }
});