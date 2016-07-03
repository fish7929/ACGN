/**
 * Created by Administrator on 2016/6/30.
 */
define([
    'module/userCenter/model/workCollectionModel',
    'module/userCenter/views/workItemView',
    'marionette'
],function(WorkCollectionModel,WorkItemView,mn){
    var workListView = Marionette.CollectionView.extend({
        childView: WorkItemView,
        model: WorkCollectionModel,
        tagName:"div",
        userId:"",
        initialize:function(){
            var self = this;
            if(self.collection == null){
                self.collection = new WorkCollectionModel();
                self.collection.on("workListView:colModelChange",self._colModelChangeHandler,this);
            }
        },
        _colModelChangeHandler:function(){
            var self = this;
            self.trigger("workListView:change");
        },
        loadData:function(userId){
            var self = this;
            self.userId = userId;
            //初始加载时先清空，再次进入只需刷新加载，在请求成功后清空重置即可
            if(!self.collection.models || self.collection.models.length <= 0)
                self.collection.reset();//清空
            self.collection.load(userId);
        },
        scrollUpdate:function(){
            var self = this;
            self.collection.more();
        }
    });
    return workListView;
});