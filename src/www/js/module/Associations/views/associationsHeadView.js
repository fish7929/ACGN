/**
 * Created by Administrator on 2016/7/10.
 */
/**
 * Created by GYY on 2016/6/3.
 */
define([
    'common/base/base_view',
    'module/Associations/model/associationsModel',
    'text!module/Associations/templates/associationsHead.html',
    'msgbox'
],function(BaseView,associationsModel,associationsHeadTpl,MsgBox){
    var associationsHeadView = BaseView.extend({
        tagName:"div",
        template: _.template(associationsHeadTpl),
        joinLock:false,  //加入按钮锁 无法重复点
        attentionsLock:false,//关注按钮锁 无法重复点
        _assoId:0, //当前社团ID
        initialize:function(){
            this.model = new associationsModel();
            this.model.on("change",this.render,this);
        },
        events:{
            'click #btnAdd':"_clickJoinHandler", //点击加入
            'click #btnAttention':"_clickAttentionsHandler" //点击关注
        },
        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        //点击加入
        _clickJoinHandler:function(e){
            var self = this;
            var target = $(e.target);
            if(!gili_data.getCurrentUser()){
                MsgBox.toast(gili_config.Tip.NOLOGIN,false);
                return;
            }
            if(self.joinLock)return;
            //加入
            if(!target.hasClass("btnAdd_ck")){
                self.joinLock = true;
               this.model.join(self._assoId, function(){
                   self.joinLock = false;
               });
            }
        },
        //点击关注
        _clickAttentionsHandler:function(e){
            var self = this;
            var target = $(e.target);
            if(!gili_data.getCurrentUser()){
                MsgBox.toast(gili_config.Tip.NOLOGIN,false);
                return;
            }
            if(self.attentionsLock)return;
            self.attentionsLock = true;
            if(target.hasClass("btnAttention_ck")){ //取消关注
                this.model.attentions(0,self._assoId,function(){
                    self.attentionsLock = false;
                })
            }else{  //关注
                this.model.attentions(1,self._assoId,function(){
                    self.attentionsLock = false;
                })
            }
        },
        //根据社团ID加载社团数据
        _loadData:function(id){
            this._assoId = id;
            this.model.getAssociationsById(id);
        },
        //销毁
        destroy:function(){
            this.model = null;
            app.off("common:works:attention",this.attentionChangeHandler,this);
        }
    });
    return associationsHeadView;
});