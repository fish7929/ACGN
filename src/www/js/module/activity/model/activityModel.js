// 文件名称: activityModel
//
// 创 建 人: zhao
// 创建日期: 2016/7/16 22:30
// 描    述: 活动数据查询
define([

],function() {
    var ActivityModel = function(){
        this.pageNum = 8;
    };


    ActivityModel.prototype.queryActivityData = function(activityId , cb_ok, cb_err){
        gili_data.getObjectById("activity", activityId, function(data){
            cb_ok(data);
        }, cb_err)
    };

    /**
     * 根据标签查找作品
     * @param activityId
     * @param cb_ok
     * @param cb_err
     */
    ActivityModel.prototype.queryBlogByLabel = function(label, pageIndex, cb_ok, cb_err){
        var opt = {};
        opt.skip = pageIndex * this.pageNum;
        opt.limit = this.pageNum;
        opt.label = [label];
        opt.orderBy = "createdAt";
        opt.isDesc = true;
        gili_data.getBlogData(opt, function(data){
            data = utils.convert_2_json(data);
            cb_ok(data);
        }, cb_err);
    };

    ActivityModel.prototype.queryBlogCountByLabel = function(label, cb_ok, cb_err){
        var opt = {};
        opt.label = [label];
        gili_data.getBlogCount(opt, function(data){
            cb_ok(data.count)
        }, cb_err);
    };

    return new ActivityModel();
});