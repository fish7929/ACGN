/**
 * Created by GYY on 2016/6/30
 */
define([
    'module/userCenter/model/WorkModel'
],function(WorkModel){
    var WorkColModel = Backbone.Collection.extend({
        model:WorkModel,
        worksArr:[],                //当前已读取作品列表
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

            var obj = [{"gb_id":"00000001","pictures":[],"topic":"我是话题内容话题内容话题内容话题内容11是话题内容话题内容话题内容话题内容11是话题内容话题内容话题内容话题内容1111111","author":"我是作者1","type":1,"status":0,"like_int":112,"comment_int":113},
                {"gb_id":"00000002","pictures":["images/temp/info_pic/a006.png","images/temp/info_pic/a002.jpeg","images/temp/info_pic/a003.jpeg","images/temp/info_pic/a004.jpeg"],"topic":"我是话题内容话题内容话题内容话题内容2222222222","author":"我是作者2","type":2,"status":0,"like_int":222,"comment_int":223},
                {"gb_id":"00000003","pictures":["images/temp/info_pic/a004.jpeg","images/temp/info_pic/a003.jpeg","images/temp/info_pic/a002.jpeg","images/temp/info_pic/a001.jpeg"],"topic":"","author":"我是作者3","type":2,"status":0,"like_int":332,"comment_int":333}];
            self.loadOk(obj);
            //查询动态列表
//            var options = {
//                "tplLabel": "",
//                "search": "",
//                "pageSize": self.worksArr.length, //跳过数
//                "pageNumber": self.pageSize,     //每页数
//                "userid": self._userId,         //查询条件  暂不需要
//                "like_show_num": 12,            //点赞对象显示最大个数
//                "page_len": 3,                   //作品页缩略图最大个数
//                "orderby": "reupdate_date",   //排序方式
//                "isdesc": true,                 //是否降序,
//                "draftArr": self.draftIdList   //需过滤的草稿列表
//            };
//            sns_data.getDiscoverPageByLocalFun(options, function (data) {
//                self.loadOk(data);
//            }, function (error) {
//                self.loadErr(error);
//            });
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
        }
    });
    return WorkColModel;
});
