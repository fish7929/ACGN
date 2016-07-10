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
     * 企划公告数据缓存
     */
    var _notice= [];
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
    /**
     * 根据用户Id和企划ID查询用户和企划报名的关系
     * @param userId
     * @param planId
     * @param cb_ok
     * @param cb_err
     */
    p.getUserPlanRelation = function(userId, planId, cb_ok, cb_err){
        var option = {};
        option.user_id = userId;
        option.plan_id = planId;
        gili_data.getUserPlanRelation(option, function(data){
            if(data){
                cb_ok&&cb_ok(data);
            }else{
                cb_ok&&cb_ok(null);
            }
        }, function(err){
            cb_err&&cb_err(err);
        });
    };
    /**
     * 根据用户Id和企划ID查询用户和企划，订阅的关系
     * @param userId
     * @param planId
     * @param cb_ok
     * @param cb_err
     */
    p.getUserFlloweePlanRelation  = function(userId, planId, cb_ok, cb_err){
        var option = {};
        option.user_id = userId;
        option.plan_id = planId;
        gili_data.getUserFlloweePlanRelation (option, function(data){
            if(data){
                cb_ok&&cb_ok(data);
            }else{
                cb_ok&&cb_ok(null);
            }
        }, function(err){
            cb_err&&cb_err(err);
        });
    };
    /**
     * 根据企划id查询已经报名该企划的用户列表
     * @param id
     * @param limit
     * @param skip
     * @param cb_ok
     * @param cb_err
     */
    p.getJoinUserById = function(id,limit, skip, cb_ok, cb_err){
        var option = {};
        option.limit = limit;
        option.skip = skip;
        option.plan_id = id;
        gili_data.getPlanUserByPlanId(option, function(data){
            cb_ok&&cb_ok(data);
        }, function(err){
            cb_err&&cb_err(err);
        });
    };
    /**
     * 加入企划
     * @param id
     * @param cb_ok
     * @param cb_err
     */
    p.joinPlan = function(id, cb_ok, cb_err){
        var option = {};
        option.plan_id = id;
        gili_data.joinPlan(option, function(data){
            cb_ok&&cb_ok(data);
        }, function(err){
            cb_err&&cb_err(err);
        });
    };
    /**
     * 订阅期刊
     * @param id
     * @param cb_ok
     * @param cb_err
     */
    p.subscribePlan = function(id, cb_ok, cb_err){
        var option = {};
        option.plan_id = id;
        option.status = 1;
        gili_data.followeePlan(option, function(data){
            cb_ok&&cb_ok(data);
        }, function(err){
            cb_err&&cb_err(err);
        });
    };
    /**
     * 取消订阅
     * @param id
     * @param cb_ok
     * @param cb_err
     */
    p.cancelSubscribePlan = function(id, cb_ok, cb_err){
        var option = {};
        option.plan_id = id;
        option.status = 999;
        gili_data.followeePlan(option, function(data){
            cb_ok&&cb_ok(data);
        }, function(err){
            cb_err&&cb_err(err);
        });
    };
    var _hottestOpus = [];
    /**
     * 查询最热作品
     * @param id
     * @param name
     * @param cb_ok
     * @param cb_err
     */
    p.queryHottestOpus = function(id, name, cb_ok, cb_err){
        if(_hottestOpus[id]){
            cb_ok&&cb_ok(_hottestOpus[id]);
            return;
        }
        var option = {};
        option.plan_id = id;
        option.plan_name = name;
        option.limit = 6;
        option.isDesc = true;
        option.orderBy = "like_int";
        gili_data.getPlanUserBlog(option, function(data){
            if(data&&data.length > 0){
                _hottestOpus[id] = data;
                cb_ok&&cb_ok(data);
            }
        },function(err){
            cb_err&&cb_err(err);
        });
    };
    /**
     * 根据企划ID和类型序号获取对应的热门作品图片
     * @param planId
     * @param index
     * @returns {*}
     */
    p.getHottestOpusPicturesByIndex = function(planId, index){
        if(_hottestOpus[planId]){
            var pictures = ((_hottestOpus[planId])[index-1]).get("pictures");
            return pictures;
        }
        return null;
    };

    /**
     * 查询动态作品
     * @param id
     * @param name
     * @param limit
     * @param skip
     * @param cb_ok
     * @param cb_err
     */
    p.queryDynamicOpus = function(id, name,limit, skip, cb_ok, cb_err){
        var option = {};
        option.plan_id = id;
        option.plan_name = name;
        option.limit = limit;
        option.skip = skip;
        option.isDesc = true;
        option.orderBy = "createdAt";
        gili_data.getPlanUserBlog(option, function(data){
            cb_ok&&cb_ok(data);
        },function(err){
            cb_err&&cb_err(err);
        });
    };
    /**
     * 获取加入企划用户的总数
     * @param id
     * @param cb_ok
     * @param cb_err
     */
    p.getJoinRolesCount = function(id, cb_ok, cb_err){
        var option = {};
        option.plan_id = id;
        gili_data.getPlanUserCountByPlanId(option, function(data){
            if(data){
                cb_ok&&cb_ok(data);
            }
        },function(err){
            cb_err&&cb_err(err);
        });
    };
    var planningModel = new PlanningModel();
    return planningModel;
});