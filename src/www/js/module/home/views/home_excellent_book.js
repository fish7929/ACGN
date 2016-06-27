// 文件名称: home_excellent_book.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/22 15:22
// 描    述: 首页--优秀绘本
define([
    'common/base/item_view',
    'text!module/home/templates/home_excellent_book.html',
    'marionette'
],function(ItemView, tpl, mn){
    return ItemView.extend({
        className : "excellentBookContainer",
        template : _.template(tpl),

        _mouseLock : false,

        // key : selector
        ui : {
            wideImageDiv : ".excellent_book_wide_pic",
            highImageDiv : ".excellent_book_high_pic",
            smallImageList : ".excellent_book_small_pic_div"
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
            var arr = [], i;
            for(i=1; i<=4; i++){
                arr.push('./images/temp/excellent_book/small_'+i+'.jpg');
            }

            var data = {};
            data.widePic = './images/temp/excellent_book/wide.jpg';
            data.highPic = './images/temp/excellent_book/high.jpg';
            data.smallPicArr = arr;

            var self = this;
            self.ui.wideImageDiv.css({'background' : "url('"+data.widePic+"') no-repeat center", 'backgroundSize' : '100%'});
            self.ui.highImageDiv.css({'background' : "url('"+data.highPic+"') no-repeat center", 'backgroundSize' : '100%'});

            var smallPicData = data.smallPicArr || [];
            var imageList = self.ui.smallImageList.find('.excellent_book_small_pic'), len = imageList.length;
            for(var i = 0; i < len; i++){
                if(smallPicData[i]){
                    $(imageList[i]).css({'background' : "url('"+smallPicData[i]+"') no-repeat center", 'backgroundSize' : '100%'});
                }
            }
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