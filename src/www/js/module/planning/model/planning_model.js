// 文件名称: planning_model
//
// 创 建 人: fishYu
// 创建日期: 2016/6/28 23:27
// 描    述: 企划详情页数据模型
define([
],function(){
    var PlanningModel = function(){}

    /**
     * 企划数据缓存
     */
    var _plan = [];
    /**
     * 企划公告数据缓存
     */
    var _notice= [];
    var p = PlanningModel.prototype;
    /**
     * 根据planId查询企划数据
     * @param objectId
     * @param cb_ok
     * @param cb_err
     */
    p.getPlanById = function(planId, cb_ok,cb_err){
        if(_plan[planId]){
            cb_ok&&cb_ok(_plan[planId]);
            return;
        }
        gili_data.getPlanByPlanId(planId, function(data){
            _plan[planId] = data;
            cb_ok&&cb_ok(data);
        }, function(err){
            console.log(err);
            cb_err&&cb_err(err);
        });
    };
    /**
     * 根据企划ID和类型序号获取对应的简介
     * @param planId
     * @param index
     * @returns {*}
     */
    p.getTypeDetailByIndex = function(planId, index){
        if(_plan[planId]){
            var typeDetails = _plan[planId].preview[index - 1];
            return typeDetails.description;
        }
        return null;
    };

    /**
     * 根据planId查询企划公告数据
     * @param id
     * @param cb_ok
     * @param cb_err
     */
    p.getNoticeById = function(id, cb_ok,cb_err){
        if(_notice[id]){
            cb_ok&&cb_ok(_notice[id]);
            return;
        }
        var option = {};
        option.limit = 5;
        option.plan_id = id;
        gili_data.getPlanNotice(option, function(data){
            _notice[id] = data;
            cb_ok&&cb_ok(data);
        }, function(err){
            cb_err&&cb_err(err);
        });
    };
    var planningModel = new PlanningModel();
    return planningModel;
});