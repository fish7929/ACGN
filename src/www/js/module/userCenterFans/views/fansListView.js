/**
 * Created by guYY on 2016/7/7 0:12
 */
define([
    'module/userCenterFans/model/fansCollectionModel',
    'module/userCenterFans/views/fansItemView',
    'marionette'
],function(FansCollectionModel,FansItemView,mn){
    var fansListView = Marionette.CollectionView.extend({
        childView: FansItemView,
        model: FansCollectionModel,
        tagName:"div",
        userId:"",
        initialize:function(){
            var self = this;
            if(self.collection == null){
                self.collection = new FansCollectionModel();
                self.collection.on("fansListView:colModelChange",self._colModelChangeHandler,this);
            }
        },
        _colModelChangeHandler:function(type){
            var self = this;
            self.trigger("fansListView:change",type);
        },
        /**
         * 根据参数获取用户数据
         * @param userId  用户ID
         * @param type 1粉丝数据  2关注数据
         */
        loadData:function(userId,type){
            var self = this;
            self.userId = userId;
            //初始加载时先清空，再次进入只需刷新加载，在请求成功后清空重置即可
            if(!self.collection.models || self.collection.models.length <= 0)
                self.collection.reset();//清空
            self.collection.load(userId,type);
        },
        scrollUpdate:function(){
            var self = this;
            self.collection.more();
        }
    });
    return fansListView;
});