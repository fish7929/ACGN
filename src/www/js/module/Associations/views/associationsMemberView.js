/**
 * Created by guyy on 2016/7/10.
 * 社团成员
 */
define([
    'common/base/base_view',
    'module/Associations/model/associationsModel',
    'msgbox'
],function(BaseView,associationsModel,MsgBox){
    var associationsMemberView = BaseView.extend({
        tagName:"div",
        template : _.template('<p>社团成员</p><%=imgList %>'),
        _assoId:0,  //社团ID
        initialize:function(){
            var self = this;
            self.model = new associationsModel();
            self.model.on("change",this.render,this);
        },
        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        events:{
            "click .memberImgItem":"_clickMemberHeadHandler"
        },
        //根据社团ID查询社团成员
        _loadData:function(clubId){
            var self = this;
            self._assoId = clubId;
            self.model.getAssociationsMembers(self._assoId,function(data){
                if(data && data.length > 0){
                    var imgListHtml = [];
                    for(var i = 0; i < data.length; i ++){
                        var user = data[i].get("user");
                        if(!user)continue;
                        imgListHtml.push('<img data-userId="'+user.id+'" src="'+user.get("avatar")+'" class="memberImgItem"/>');
                    }
                    if(imgListHtml.length > 0){
                       self.model.set("imgList",imgListHtml.join(' '));
                    }else{
                        //列表置空
                        self.noMemberRender();
                    }
                }else{
                    //列表置空
                    self.noMemberRender();
                }
                console.log(data);
            },function(){
                self.noMemberRender();
            })
        },
        //无成员提示
        noMemberRender:function(){
            var self = this;
            self.model.set("imgList","<div class='noDataDiv'>该社团还在招募小伙伴中</div>");
        },
        //点击头像打开用户中心
        _clickMemberHeadHandler:function(e){
            var target = $(e.target);
            var uId = target.data("userid");
            app.navigate("userCenter/"+uId,{trigger:true,replace:false});
        }
    });
    return associationsMemberView;
});
