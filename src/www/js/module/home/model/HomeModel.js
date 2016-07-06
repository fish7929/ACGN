// 文件名称: HomeModel
//
// 创 建 人: zhao
// 创建日期: 2016/7/6 21:30
// 描    述: 首页数据接口
define([

],function() {
    var HomeModel = function(){
    };

    HomeModel.prototype.queryBannerData = function(cb_ok, cb_err){
        gili_data.getSubjectBanner(function(data){
            data = utils.convert_2_json(data);
            cb_ok(data);
        }, cb_err)
    };

    var homeModel = new HomeModel();
    return homeModel;
});