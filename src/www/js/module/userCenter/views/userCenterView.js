/**
 * Created by Administrator on 2016/6/25.
 */
define([
    'common/base/base_view',
    'text!module/userCenter/templates/userCenter.html',
    'marionette',
    'common/region/switch_view_region',
    'common/views/loginBar',
    'module/userCenter/views/userCenterHeadView',
    'module/userCenter/views/workListView',
    'msgbox'
],function(BaseView,UserCenterTpl,mn,SwitchViewRegion,LoginBarView,UserCenterHeadView,WorkListView,MsgBox){
    var userCenterView = BaseView.extend({
        id:"userCenterContainer",
        template: _.template(UserCenterTpl),
        data_finish:false,
        _userId:"",
        initialize:function(){
            var self = this;
            this._loginBarView = new LoginBarView();
            this.userCenterHeadView = new UserCenterHeadView();
            this._workListView = new WorkListView();
            this._workListView.on("workListView:change",self._workListChangeHandler,self);
        },
        regions : {
            LoginBarRegion: {
                el: "#userCenterLogin",
                regionClass: SwitchViewRegion
            },
            "headerCon":"#userCenterHeaderCon",
            "workCon":"#userCenterInfo"
        },
        ui:{
            "loadingContainer":".loading-gif",
            "loadMsg":"#mz-square-sk-text",
            "userCenterInfo":"#userCenterInfo"
        },
        onRender:function(){
            var self = this;
            this.getRegion("headerCon").show(this.userCenterHeadView);
            this.userCenterHeadView.setSelected(0);
            this.getRegion("workCon").show(this._workListView);
        },
        show:function(){
            var self = this;
            self.LoginBarRegion.show(self._loginBarView);
            self.loginUser = gili_data.getCurrentUser();
            self._userId = self.getOption("userId");
            if(!self._userId) {
                if(self.loginUser)
                    self._userId = self.loginUser.id;
                else{
                    MsgBox.alert("用户未登录");
                    return;
                }
            }
            if(!self._userId || self._userId == "")
            {
                MsgBox.alert("用户未登录");
                app.navigate("",{replace: false, trigger: true});
                return;
            }
            self.data_finish = false;
            self.updateMsg([1]);
            self.userCenterHeadView._loadData(self._userId);
            self.addOnScroll();
            self._workListView.loadData(self._userId);
        },
        pageIn:function(){
            var self = this;
            //点赞列表发生变化
            app.on("common:works:liked",self.likedChangeHandler,self);
            //登录登出刷新
            app.on("login:ok", this.onLoginOkHandler, this);
        },
        //列表状态更新
        _workListChangeHandler:function(type){
            var self = this;
            self.updateMsg(type);
        },
        //点赞插画列表发生变化触发  全局
        likedChangeHandler:function(arr){
            this._workListView.collection.reset(this._workListView.collection.models);
        },
        //登录，刷新页面
        onLoginOkHandler:function(){
            var self = this;
            self.show();
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
            self.ui.userCenterInfo.remove("#noContent");
            self.loginUser = gili_data.getCurrentUser();
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
                    if(self.ui.userCenterInfo.find(".uc_info_item").length <= 0){
                        self.ui.loadMsg.html("");
                        if(self.loginUser && self.loginUser.id == self._userId) {
                            self.ui.userCenterInfo.append("<div id='noContent'>您还没有发布动态消息</div>");
                        } else {
                            self.ui.userCenterInfo.append("<div id='noContent'>TA还没有发布动态消息</div>");
                        }
                    }
                }
            }
        },
        //滚动容器添加滚动事件
        addOnScroll:function(){
            var self = this;
            window.onscroll = function(e){
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                if(scrollTop + window.innerHeight > document.body.offsetHeight-600){
                    if(!self.data_finish)
                        self._workListView.scrollUpdate();
                }
            }
        },
        close:function(){
            var self = this;
            window.onscroll = null;
            app.off("common:works:liked",this.likedChangeHandler,this);
            self.LoginBarRegion.hide(self._loginBarView);
            app.off("login:ok", this.onLoginOkHandler, this);
        }
    });
    return userCenterView;
});