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
        userId:"",  //用户中心用
        assoId:"", //社团ID
        initialize:function(){
            var self = this;
            if(self.collection == null){
                self.collection = new WorkCollectionModel();
                self.collection.on("workListView:colModelChange",self._colModelChangeHandler,this);
            }
            app.on("workListView:delWork",self._delWorkHandler,self);
        },
        _colModelChangeHandler:function(type){
            var self = this;
            self.trigger("workListView:change",type);
        },
        //根据话题ID 删除话题
        _delWorkHandler:function(gid){
            var self = this;
            self.collection.delById(gid);
        },
        //用户中心调用  查询用户状态动态插画列表
        loadData:function(userId){
            var self = this;
            self.userId = userId;
            //初始加载时先清空，再次进入只需刷新加载，在请求成功后清空重置即可
            if(!self.collection.models || self.collection.models.length <= 0)
                self.collection.reset();//清空
            self.collection.load(userId,1);
        },
        //社团调用  查询社团动态
        loadAssociationsData:function(clubId){
            var self = this;
            self.assoId = clubId;
            //初始加载时先清空，再次进入只需刷新加载，在请求成功后清空重置即可
            if(!self.collection.models || self.collection.models.length <= 0)
                self.collection.reset();//清空
            self.collection.load(clubId,2);
        },
        scrollUpdate:function(){
            var self = this;
            self.collection.more();
        }
    });
    return workListView;
});