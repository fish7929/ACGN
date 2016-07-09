/**
 * Created by Administrator on 2016/6/29.
 */
define([
    'common/base/base_view',
    'text!module/Associations/templates/associations.html',
    'marionette',
    'common/region/switch_view_region',
    'common/views/loginBar',
    'module/Associations/model/associationsModel',
    'module/userCenter/views/workListView',
    'msgbox'
],function(BaseView,AssociationsTpl,mn,SwitchViewRegion,LoginBarView,AssociationsModel,WorkListView,MsgBox){
    var associationsView = BaseView.extend({
        id:"AssociationsContainer",
        template: _.template(AssociationsTpl),
        _associateId:"",
        _assoId:"", //当前社团ID
        initialize:function(){
            var self = this;
            self.model = new AssociationsModel();
            this._loginBarView = new LoginBarView();
            this._workListView = new WorkListView();
            this._workListView.on("workListView:change",self._workListChangeHandler,self);
        },
        regions : {
            LoginBarRegion: {
                el: "#associationsLogin",
                regionClass: SwitchViewRegion
            },
            "workList":"#main_left"
        },
        onRender:function(){
            var self = this;
            self.LoginBarRegion.show(self._loginBarView);
            this.getRegion("workList").show(this._workListView);
            //社团成员  关注用户
        },
        show:function(){
            var self = this;
            self._assoId = self.getOption("assoId");
            if(!self._assoId) {
                MsgBox.alert("无效路由");
                return;
            }
            debugger;
            //根据社团ID查询社团对象
            self.model.getAssociationsById(self._assoId);
            self._workListView.loadData("577a773d0a2b58393762f328");//guyy todo
//            self._workListView.loadData(self._associateId)
        },
        pageIn:function(){},
        //列表状态更新
        _workListChangeHandler:function(type){
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
//            self.ui.loadingContainer.find("img").show();
//            self.ui.loadMsg.html("你的大片正在加载...");
//            self.ui.zoneWorksNext.html("");
//            if(typeArr && typeArr.length > 0){
//                if(typeArr[0] == 0){   //加载出错时，有数据只文案提示  无数据显示缺省无网状态且文案提示
//                    var noNetHeight = utils.containerHeight - Math.floor(utils.containerWidth * utils.zoneHeiPro);
//                    //无网提示 点击重新加载
//                    if(self.ui.zoneWorks.find(".home-work-item").size() <= 0 && self.ui.zoneWorks.find(".home-work-item-2").size() <= 0 && self.ui.zoneWorks.find(".home-work-item-3").size() <= 0){
//                        self.ui.zoneWorks.html('<div id="noNetWork" style="height:'+noNetHeight+'px;"></div>');
//                        $("#noNetWork").on("click",function(){
//                            this.remove();
//                            self.loadData(self._userId,self.draftArr,self.scrollCon);
//                        });
//                    }
//                    self.ui.loadingContainer.find("img").hide();
//                    self.ui.loadMsg.html("网络不好,请重试");
//                }else if(typeArr[0] == 1){ //数据正常加载
//                    self.ui.loadingContainer.find("img").show();
//                    self.ui.loadMsg.html("你的大片正在加载");
//                }else if(typeArr[0] == 2){ //数据加载结束
//                    self.data_finish = true;
//                    self.ui.loadingContainer.find("img").hide();
//                    self.ui.loadMsg.html("没有更多了");
//                    self.ui.zoneWorks.remove("noWorkData");
//                    var noNetHeight = utils.containerHeight - Math.floor(utils.containerWidth * utils.zoneHeiPro) - 86;
//                    //我的空间无作品时 提示去创作
//                    if(self.ui.zoneWorks.find(".home-work-item").size() <= 0 && self.ui.zoneWorks.find(".home-work-item-2").size() <= 0 && self.ui.zoneWorks.find(".home-work-item-3").size() <= 0){
//                        self.ui.loadMsg.html("");
//                        if(self.currUser.id == self._userId) {
//                            self.ui.zoneWorksNext.html('<div id="noWorkData" style="height:' + noNetHeight + 'px;"><p class="p1">让生活充满情趣</p><p class="p2">去创作你的作品吧</p><p class="btnP3">去创作</p></div>');
//                            self.ui.zoneWorksNext.on("click",function(){
//                                app.navigate("#mz/module_sort",{replace:true,trigger:true});
//                            });
//                        }
//                        else
//                            self.ui.zoneWorksNext.html('<div id="noWorkData" style="height:'+noNetHeight+'px;"><p class="p1">TA很懒，没有自己的作品</p></div>');
//                    }
//                }
//            }
        },
        close:function(){}
    });
    return associationsView;
});
