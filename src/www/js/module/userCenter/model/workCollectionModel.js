/**
 * Created by GYY on 2016/6/30
 */
define([
    'module/userCenter/model/workModel'
],function(WorkModel){
    var WorkColModel = Backbone.Collection.extend({
        model:WorkModel,
        worksArr:[],                //当前已读取作品列表
        pageSize:4,                //每页10条
        _userId:"",                  //用户ID
        _loading:false,
        initialize:function(){
            var self = this;
            self._loading = false;
            self.worksArr.length = 0;
            self.worksArr = [];
        },
        //根据用户ID读取作品列表
        load:function(userId){
            var self = this;
            self._userId = userId;
            self._loading = false;
            self.worksArr.length = 0;//清空数组
            self.worksArr = [];
            self._load();
        },
        _load:function(){
            var self = this;
            if(self._loading == true) return;
            self._loading = true;
            var options = {
                skip:self.worksArr.length,
                limit:self.pageSize
            };
            var loginUser = gili_data.getCurrentUser();
            //当前登录用户用户中心 不需要传user_id参数
            if(!loginUser || loginUser.id != self._userId){
                options.user_id = self._userId;
            }
            gili_data.getUserBlog(options,function(data){
                self.loadOk(data);
            },function(error){
                self.loadErr(error);
            });
        },
        //加载更多
        more:function(){
            var self = this;
            self._load();
        },
        _loadNetData:function(arr){
            var self = this;
            var res = _.map(arr,function(item){
                return new WorkModel(item);
            });
            self.add(res);
            //结果小于每页数据 表示加载完毕
            if(arr.length < self.pageSize){
                self.trigger("workListView:colModelChange",[2]);
            }else
                self.trigger("workListView:colModelChange",[1]);
        },
        //加载数据列表正确回调
        loadOk:function(data){
            var self = this;
            self._loading = false;
            //刷新加载 请求成功后再清空
            if(self.worksArr.length <= 0)
                self.reset();
            self.worksArr = self.worksArr.concat(data);
            self._loadNetData(data);
        },
        //加载数据列表错误回调
        loadErr:function(err){
            var self = this;
            self._loading = false;
            self.trigger("workListView:colModelChange",[0]);
        },
        //根据ID删除话题对象
        removeToWorkArr:function(gid){
            var self = this;
            //根据作品id判断是否存在，存在则删除
            for(var i = 0; i < self.worksArr.length; i++){
                debugger;
                var tempWork = self.worksArr[i];
                if(tempWork.objectId == gid){
                    self.worksArr.splice(i,1);
                    break;
                }
            }
        },
        delById:function(gid){
            var self = this;
            for(var j = 0; j < self.models.length; j++){
                var tempModel = self.models[j];
                if(tempModel && tempModel.get("objectId") == gid){
                    self.remove(tempModel);
                }
            }
            self.removeToWorkArr(gid);
            self.reset(self.models);
            //删除最后一个作品时,需添加无作品提示层
            if(self.models.length <= 0){
                self.trigger("workListView:colModelChange",[2]);
            }
        }
    });
    return WorkColModel;
});
