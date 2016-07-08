/**
 * Created by Administrator on 2016/6/25.
 */
define([
    '../../../common/base/base_view',
    'text!module/userCenterFans/templates/userCenterFans.html',
    'marionette',
    'common/region/switch_view_region',
    'common/views/loginBar',
    'module/userCenter/views/userCenterHeadView',
    'module/userCenterFans/views/fansListView'
],function(BaseView,UserCenterFansTpl,mn,SwitchViewRegion,LoginBarView,UserCenterHeadView,FansListView){
    var userCenterFansView = BaseView.extend({
        id:"userCenterFansContainer",
        template: _.template(UserCenterFansTpl),
        _userId:"",
        data_finish:false,
        initialize:function(){
            var self = this;
            self._loginBarView = new LoginBarView();
            self.userCenterHeadView = new UserCenterHeadView();
            self.fansListView = new FansListView();
            self.fansListView.on("fansListView:change",self._fansListChangeHandler,self);
        },
        regions : {
            "loginBar":"#userCenterLogin",
            "headCon":"#userCenterFansHeaderCon",
            "fansCon":"#userCenterFansInfo"
        },
        ui:{
            "loadingContainer":".loading-gif",
            "loadMsg":"#mz-square-sk-text"
        },
        onRender:function(){
            this.getRegion("loginBar").show(this._loginBarView);
            this.getRegion("headCon").show(this.userCenterHeadView);
            this.getRegion("fansCon").show(this.fansListView);
            this.userCenterHeadView.setSelected(1);
        },
        show:function(){
            var self = this;
            var userId = self.getOption("userId");
            self.updateMsg([1]);
            self.data_finish = false;
            self.addOnScroll();
            self.userCenterHeadView._loadData(userId);
            self.fansListView.loadData(userId);
        },
        pageIn:function(){

        },
        _fansListChangeHandler:function(type){
            var self = this;
            self.updateMsg(type);
        },
        /**
         * 更新状态
         * @param typeArr 数组
         *         索引0： 0:加载出错  1:数据正常加载  2:数据加载结束
         */
        updateMsg:function(typeArr){
            var self = this;
            self.ui.loadingContainer.find("img").show();
            self.ui.loadMsg.html("你的大片正在加载...");
            if(typeArr && typeArr.length > 0){
                if(typeArr[0] == 0){   //加载出错时，有数据只文案提示  无数据显示缺省无网状态且文案提示
                    self.ui.loadingContainer.find("img").hide();
                    self.ui.loadMsg.html("网络不好,请重试");
                }else if(typeArr[0] == 1){ //数据正常加载
                    self.ui.loadingContainer.find("img").show();
                    self.ui.loadMsg.html("正在加载");
                }else if(typeArr[0] == 2){ //数据加载结束
                    self.data_finish = true;
                    self.ui.loadingContainer.find("img").hide();
                    self.ui.loadMsg.html("没有更多了");
                }
            }
        },
        //滚动容器添加滚动事件
        addOnScroll:function(){
            var self = this;
            $(window).scroll(function(e){
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                if(scrollTop + window.innerHeight > document.body.offsetHeight-400){
                    if(!self.data_finish)
                        self.fansListView.scrollUpdate();
                }
            });
        },
        destroy:function(){
            this._loginBarView = null;
            this._workListView = null;
            app.off("common:works:liked",this.likedChangeHandler,this);
        }
    });
    return userCenterFansView;
});