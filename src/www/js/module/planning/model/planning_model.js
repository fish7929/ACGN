// 文件名称: planning_model
//
// 创 建 人: fishYu
// 创建日期: 2016/6/28 23:27
// 描    述: 企划详情页数据模型
define([
],function(){
    var PlanningModel = function(){}
    PlanningModel.typeDetails = [
        {
            title : "二次元：ACG领域所在的平面世界",
            content : "包括动画（Animation）、漫画（Comic）、\n游戏（Game）等一系列平面的视界产物，\n与之相对的三次元则是指现实世界。"
        },
        {
            title : "御宅族（おたく otaku）",
            content : "一般指对ACG具有超出一般人知识面、鉴赏、游玩能力的特殊群体，\n是究级ACG爱好者的代名词。"
        },
        {
            title : "人物设定",
            content : "负责设计登场角色的人物造型、身材比例、服装样式、不同的眼神以及表情，并标表示出角色的外貌特征、\n"+
            "个性特点等，通常需要绘制一人物的头部及、正、背、侧等多个不同角度的三面效果，有时还会包括线条封闭和人物发型，\n"+
            "身着不同款式的服装造型，与其他角色的身高对比，以及佩戴的小饰物等细节。如果动画的原作来自漫画，\n"+
            "则需要将漫画家笔下的人物重新绘制，以符合动画的要求。"
        },
        {
            title : "ACG",
            content : "英文Animation、Comic、Game的缩写，\n是动画、漫画、游戏（通常指电玩游戏或GalGame）的总称。"
        }
    ];     //类型详细内容
    var p = PlanningModel.prototype;

    p.getTypeDetails = function(cb_ok,cb_err){

    };

    p.getTypeDetailByIndex = function(index){
        return PlanningModel.typeDetails[index - 1];
    };

    var planningModel = new PlanningModel();
    return planningModel;
});