/**
 * Created by Administrator on 2016/6/25.
 */
define([
    'module/Associations/views/associationsView'
],function(AssociationsView){
    return {
        Associations:function(){
            app.page.show(AssociationsView);
        }
    }
});