// 文件名称: planning_model
//
// 创 建 人: fishYu
// 创建日期: 2016/6/28 23:27
// 描    述: 企划详情页数据模型
define([
],function(){
    var PlanningModel = function(){}

    /**
     * 模拟企划数据
     */
    var plan = {
        cover : "./images/planning/cover.jpg",
        bg_img: "./images/planning/banner.jpg",
        name: "我的妹妹真是可爱到不行不行",
        author:{
            user_nick: "道道好厉害",
            avatar : "./images/planning/moderator.png"
        },
        brief : "这里是啥都想不出来的介绍，介绍，介绍。。。。这里是啥都想不出来的介绍，介绍，介绍。。。。 这里是啥都想不出来的介绍，介绍，介绍。。。。这里是啥都想不出来的介绍，介绍，介绍。。。。 这里是啥都想不出来的介绍，介绍，介绍。。。。",
        preview: [
            {
                image : "./images/planning/1.jpg",
                type: "世界观",
                description : {
                    title : "二次元：ACG领域所在的平面世界",
                    content : "包括动画（Animation）、漫画（Comic）、\n游戏（Game）等一系列平面的视界产物，\n与之相对的三次元则是指现实世界。"
                }
            },
            {
                image : "./images/planning/2.jpg",
                type: "人设",
                description : {
                    title : "御宅族（おたく otaku）",
                    content : "一般指对ACG具有超出一般人知识面、鉴赏、游玩能力的特殊群体，\n是究级ACG爱好者的代名词。"
                }
            },
            {
                image : "./images/planning/3.jpg",
                type: "主线",
                description : {
                    title : "人物设定",
                    content : "负责设计登场角色的人物造型、身材比例、服装样式、不同的眼神以及表情，并标表示出角色的外貌特征、\n"+
                        "个性特点等，通常需要绘制一人物的头部及、正、背、侧等多个不同角度的三面效果，有时还会包括线条封闭和人物发型，\n"+
                        "身着不同款式的服装造型，与其他角色的身高对比，以及佩戴的小饰物等细节。如果动画的原作来自漫画，\n"+
                        "则需要将漫画家笔下的人物重新绘制，以符合动画的要求。"
                }
            },
            {
                image : "./images/planning/4.jpg",
                type: "日常",
                description : {
                    title : "ACG",
                    content : "英文Animation、Comic、Game的缩写，\n是动画、漫画、游戏（通常指电玩游戏或GalGame）的总称。"
                }
            }
        ]
    };
    var _plan = [];

    /**
     * 模拟企划公告数据
     */
    PlanningModel.Notice = [
        {
            content : "这是企划说明，这是企划说明。这是企划说明，这是企划说明。" +
            "这是企划说明，这是企划说明。这是企划说明，这是企划说明。" +
            "这是企划说明，这是企划说明。这是企划说明，这是企划说明。" +
            "这是企划说明，这是企划说明。这是企划说明，这是企划说明。",
            type : "企划",
            description : "企划说明",
            createdAt : "2016.7.1"
        },
        {
            content : "这是人物设定，这是人物设定。这是人物设定，这是人物设定。" +
                "这是人物设定，这是人物设定。这是人物设定，这是人物设定。" +
                "这是人物设定，这是人物设定。这是人物设定，这是人物设定。" +
                "这是人物设定，这是人物设定。这是人物设定，这是人物设定。",
            type : "人物设定",
            description : "人物设定说明",
            createdAt : "2016.6.29"
        },
        {
            content : "这是人设纸更新，这是人设纸更新。这是人设纸更新，这是人设纸更新。" +
                "这是人设纸更新，这是人设纸更新。这是人设纸更新，这是人设纸更新。" +
                "这是人设纸更新，这是人设纸更新。这是人设纸更新，这是人设纸更新。" +
                "这是人设纸更新，这是人设纸更新。这是人设纸更新，这是人设纸更新。",
            type : "人设纸",
            description : "人设纸更新",
            createdAt : "2016.7.2"
        }

    ];
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
        if(true){
            cb_ok&&cb_ok(PlanningModel.Notice);
        }else{
            cb_err&&cb_err();
        }
    };
    var planningModel = new PlanningModel();
    return planningModel;
});