// 文件名称: utils.js
//
// 创 建 人: zhao
// 创建日期: 2016/06/21
// 描    述: 工具类
(function(window){
    var utils = {};
    window.utils = utils;


    /**
     * 测试log
     * @param str
     */
    utils.log = function(str){
        console.log(str)
    },
    /**
     * 格式化时间 为  2015.12.15 10：00
     * @param time
     */
    utils.formatCreatedTime = function(time){
        var t = new Date(time);
        return (t.getFullYear()) + "." + (t.getMonth() + 1) + "." + t.getDate() +"  " +  t.getHours() + ":" + t.getMinutes();
    };

})(window);