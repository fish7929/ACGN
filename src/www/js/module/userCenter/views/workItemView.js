/**
 * Created by GYY on 2016/6/30
 */
define([
    'module/userCenter/model/workModel',
    'text!module/userCenter/templates/workItem.html',
    'marionette'
],function(workModel,workItemTpl,mn){
    var WorkItemView = Marionette.ItemView.extend({
        template: _.template(workItemTpl),
        model:workModel,
        events:{
        },
        initialize:function(){
        },
        render:function(){
            Marionette.ItemView.prototype.render.call(this);
        },
        serializeData:function() {
            var self = this;
            data = Marionette.ItemView.prototype.serializeData.apply(this,arguments);
            data.name = self.model.name;
            return data;
        }
    });
    return WorkItemView;
});
