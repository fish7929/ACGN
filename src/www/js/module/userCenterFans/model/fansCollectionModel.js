/**
 * Created by GYY on 2016/7/7
 */
define([
    'module/userCenterFans/model/userModel'
],function(UserModel){
    var FansColModel = Backbone.Collection.extend({
        model:UserModel,
        worksArr:[],                //当前已读取粉丝列表
        pageSize:10,                //每页10条
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
//            gili_data.followerList(options,function(data){
//                self.loadOk(data);
//            },function(error){
//                self.loadErr(error);
//            });
            var options = {
                user_id:self._userId ,
                skip:0,
                limit:100,
                orderBy:"",
                isDesc:""
            };
            gili_data.followeeList(options,function(data){
                debugger;
                self.loadOk(data);
            },function(err){
                self.loadErr(err);
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
                return new UserModel(item);
            });
            self.add(res);
            //结果小于每页数据 表示加载完毕
            if(arr.length < self.pageSize){
                self.trigger("fansListView:colModelChange",[2]);
            }else
                self.trigger("fansListView:colModelChange",[1]);
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
            self.trigger("fansListView:colModelChange",[0]);
        }
    });
    return FansColModel;
});
