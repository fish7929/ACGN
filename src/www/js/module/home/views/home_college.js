// 文件名称: home_college.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/25 23:50
// 描    述: 首页--优秀社团
define([
    'common/base/item_view',
    'text!module/home/templates/home_college.html',
    'marionette'
],function(ItemView, tpl, mn){
    var htmlTpl = '<div class="college-item" attr="{0}">' +
        '<div class="college-pic" style="background: url(\'{1}\') no-repeat center; background-size: 100%"></div>' +
        '<div class="college-name">{2}</div>' +
        '</div>';
    return ItemView.extend({
        className : "collegeContainer",
        template : _.template(tpl),

        _mouseLock : false,

        // key : selector
        ui : {
            collegeList : ".college-container"
        },
        //事件添加
        events : {
        },
        /**初始化**/
        initialize : function(){
        },

        //在开始渲染模板前执行，此时当前page没有添加到document
        onBeforeRender : function(){
        },

        //渲染完模板后执行,此时当前page没有添加到document
        onRender : function(){
        },

        //页间动画已经完成，当前page已经加入到document
        pageIn : function(){
            this.initList();
            this.$el.show();
        },

        initList : function(){
            var data = [], i;
            for(i = 1; i <= 6; i++){
                var obj = {};
                obj.collegeId = i;
                obj.collegePic = 'images/temp/college/college'+i+'.jpg';
                obj.collegeName = "社团"+i;
                data.push(obj);
            }

            var self = this, html = "";
            for(i = 0; i<data.length; i++){
                obj = data[i];
                html += htmlTpl.replace("{0}", obj.collegeId).replace("{1}", obj.collegePic).replace("{2}", obj.collegeName);
            }
            self.ui.collegeList.html(html);
        },

        /*点击事件不可以重复点*/
        _checkMouseLock : function () {
            var self = this;
            if (self._mouseLock) return true;
            self._mouseLock = true;
            setTimeout(function () {
                self._mouseLock = false;
            }, 200);
            return false;
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            this.$el.hide();
        },

        //当页面销毁时触发
        onDestroy : function(){
        }

    });
});