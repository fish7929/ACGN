// 文件名称: HomeModel
//
// 创 建 人: zhao
// 创建日期: 2016/7/6 21:30
// 描    述: 首页数据接口
define([

],function() {
    var HomeModel = function(){
    };

    //首页--banner图
    HomeModel.prototype.queryBannerData = function(cb_ok, cb_err){
        gili_data.getSubjectBanner(function(data){
            data = utils.convert_2_json(data);
            cb_ok(data);
        }, cb_err)
    };

    //首页--优秀社团
    HomeModel.prototype.queryClubData = function(cb_ok, cb_err){
        var opt = {};
        opt.limit = 6;
        opt.isRandom = true;
        gili_data.getClubs(opt, function(data){
            data = utils.convert_2_json(data);
            cb_ok(data);
        }, cb_err)
    };

    //首页--奇画大触
    HomeModel.prototype.queryQHDCData = function(cb_ok, cb_err){
        var opt = {};
        opt.limit = 5;
        opt.userType = 1;
        opt.isRandom = true;
        gili_data.getUsers(opt, function(data){
            data = utils.convert_2_json(data);
            cb_ok(data);
        }, cb_err)
    };

    //活跃用户
    HomeModel.prototype.queryActiveUserData = function(cb_ok, cb_err){
        var opt = {};
        opt.limit = 12;
        opt.userType = 0;
        opt.isRandom = true;
        gili_data.getUsers(opt, function(data){
            data = utils.convert_2_json(data);
            cb_ok(data);
        }, cb_err)
    };

    //优秀绘本
    HomeModel.prototype.queryBlog = function(cb_ok, cb_err){
        var opt = {};
        opt.skip = 0;
        opt.limit = 6;
        opt.orderBy = "createdAt";
        opt.isDesc = true;
        gili_data.getBlogData(opt, function(data){
            console.log(data);
        }, cb_err)
    };

    var homeModel = new HomeModel();
    return homeModel;
});