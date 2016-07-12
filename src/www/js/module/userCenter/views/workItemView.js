/**
 * Created by GYY on 2016/6/30
 */
define([
    'module/userCenter/model/workModel',
    'text!module/userCenter/templates/workItem.html',
    'marionette',
    'msgbox',
    'module/book/views/bookPreviewView'
],function(workModel,workItemTpl,mn,MsgBox,BookPreviewView){
    var WorkItemView = Marionette.ItemView.extend({
        template: _.template(workItemTpl),
        model:workModel,
        pageSize:10, //每页10冬条
        isReply:false,    //当前是否给留言回复
        replyUserId:"",   //当前回复评论 评论者昵称
        replyUserName:"", //当前回复评论对象
        replyCId:"",      //当前回复评论ID
        replyKey:"",      //格式 ："回复@张三:"
        ui:{
            "commentTxt":"#commentTxt",
            "faceCon":".faceCon"
        },
        events:{
            "click .info-detail-comment":"_clickCommentHandler",//点击打开评论
            "click .commentMore":"_clickCommentMoreHandler", //查看该作品更多评论
            "click .uc-info-pic":"_clickPicHandler", //点击查看大图
            "click .info-detail-zan":"_clickZanHandler",
            "click .info-del":"_clickDelHandler",      //用户只能删除自己的动态话题等
            "click .btnFace":"_clickFaceHandler",       //点击颜表情
            "click .face-mask":"_clickFaceMaskHandler", //点击颜表情 mask 取消颜表情
            "click .sp_reply":"_clickReplyHandler",    //点击回复
            "click .btnSend":"_clickSendHandler",       //点击发布
            "click .reply_userName":"_clickReplyUser",  //点击评论内容里的用户
            "click .face-item":"_clickFaceItemHandler",  //点击颜表情项
            "blur #commentTxt":"_blurCommentHandler"
//            "mouseover .uc_info_item":"_overItemHandler", //鼠标移入 显示“删除”按钮
//            "mouseout .uc_info_item":"_outItemHandler" //鼠标移出 隐藏“删除”按钮
        },
        initialize:function(){

        },
        render:function(){
            Marionette.ItemView.prototype.render.call(this);
        },
        serializeData:function() {
            var self = this;
            data = Marionette.ItemView.prototype.serializeData.apply(this,arguments);
            var loginUser = gili_data.getCurrentUser();
            data.likeInt = self.model.likeInt?self.model.likeInt:0;
            data.commentInt = self.model.commentInt?self.model.commentInt:0;
            data.timeStr = self.model.timeStr;
            //话题类型 1文字话题   2插画话题（文字可有可无，图片最多10张）
            data.type = self.model.get("type");
            data.commentTxt = self.model.commentTxt;//评论文本框 默认为空
            if(data.type == 1) {
                data.articleHtml = self.getArticle();
                data.picHtml = "";
                data.descHtml = "";
            }else{
                data.articleHtml = "";
                data.picHtml = self.getPic();
                data.descHtml = self.getDesc();
            }
            if(utils.isLiked(self.model.get("objectId"))){
                data.zanName = "praise_ck";
            }else{
                data.zanName = "praise";
            }
            if(self.model.commentShow){
                data.commentShow = "style='display:block;'";
            }else{
                data.commentShow = "style='display:none;'";
            }
            if(loginUser && loginUser.id == self.model.get("user_id")){
                data.delShow = "";
            }else{
                data.delShow = "display:none";
            }
            data.commentHtml = self.getComment();
            if(self.model.faceOpen){
                data.faceTxtHtml = self.getFace();
            }else{
                data.faceTxtHtml = "";
            }
            return data;
        },
        //获取类型为1的话题 内容
        getArticle:function(){
            var articleHtml = "";
            var topic = this.model.get("topic");
            articleHtml = this.topicTpl({topicStr:topic});
            return articleHtml;
        },
        //获取类型2的话题  插画显示第一张 并显示共几张
        getPic:function(){
            var picHtml = "";
            var picLen = this.model.get("pictures").length;
            if(picLen > 0) {
                var firstUrl = this.model.get("pictures")[0];
                if(picLen > 1)
                    picHtml = this.picTpl({firstImg: firstUrl,picNum:"<span class='picLenSpan'>"+picLen+"p</span>"});
                else
                    picHtml = this.picTpl({firstImg: firstUrl,picNum:""});
            }
            return picHtml;
        },
        //获得类型2的话题 附带的话题（可能无）
        getDesc:function(){
            var descHtml = "";
            var topic = this.model.get("topic");
            if(topic && topic != ""){
                descHtml = this.topic2Tpl({topicStr:topic});
            }
            return descHtml;
        },
        topicTpl: _.template('<div class="info-article"><%=topicStr%></div>'),
        picTpl: _.template('<div><%=picNum%><img class="uc-info-pic" src="<%=firstImg %>" alt="" style="display: block; margin:23px auto 0 auto; max-width: 600px; "/></div>'),
        topic2Tpl: _.template('<div class="info-article"><%=topicStr%></div>'),
        //获取评论列表
        getComment:function(){
            var commentHtml = '<div class="commentListCon">';
            var commentArr = this.model.commentList;
            if(!commentArr || commentArr.length <= 0)return commentHtml;
            for(var i = 0; i < commentArr.length; i++){
                var comment = commentArr[i];
                var commentType = comment.comment_type;
                var commentTime = comment.createdAt ? new Date(comment.createdAt):new Date();
                var commentTimeStr = utils.formatCreatedTime(commentTime);
                var cId = comment.id;//评论ID
                var content = comment.content;
                var contentStr = "";
                if(commentType == 5){
                    content = JSON.parse(content);
                    contentStr = "回复@<span data-userid='"+content.uid+"' class='reply_userName'>"+content.uname+"</span>:"+content.content||"";
                }else{
                    contentStr = content;
                }
                commentHtml += this.commentTpl({headUrl:comment.user.avatar,
                    commentName:comment.user.user_nick,commentTime:commentTimeStr,commentTxt:contentStr,commentUserId:comment.user.userId,commentUserName:comment.user.user_nick,cId:cId});
            }
            commentHtml += '</div>';
            return commentHtml;
        },
        commentTpl: _.template('<div class="commentItem"><div class="commentHead" style="background:url(\'<%=headUrl%>\') no-repeat #f7f7f7 center; background-size:cover;"></div><div class="commentData">'+
            '<div class="commentName"><%=commentName %>&nbsp;<span class="sp_time"><%=commentTime %></span><span data-cId="<%=cId %>" data-userId="<%=commentUserId %>" data-userName="<%=commentUserName %>" class="sp_reply">回复</span></div>'+
            '<div class="commentContext"><%=commentTxt %></div></div></div>'),
        //填充颜表情窗口
        getFace:function(){
            var html = "", self = this;
            var list = giliConfig.FaceList;
            for(var i = 0; i<list.length; i++){
                html += self.faceTpl({faceTxt:list[i]});
            }
            return self.faceConTpl({faceConTxt:html});
        },
        //颜表情项
        faceTpl: _.template('<div class="face-item button nowrapTxt"><%=faceTxt %></div>'),
        //颜表情容器
        faceConTpl: _.template('<div><div class="face-mask"></div><div class="face-container"><div class="fac-list-div"><%=faceConTxt %></div></div></div>'),
        //点击评论图片，显示评论列表或隐藏
        _clickCommentHandler:function(e){
            var self = this;
            //如果评论列表显示，点击隐藏即可
            if(self.model.commentShow){
                self.model.commentShow = false;
                self.render();
                return;
            }
            //如果评论列表隐藏，点击图标时判断列表是否存在数据，存在直接显示即可，不存在需查询该动态的评论数据
            this.model.commentShow = true;
            this.model.commentTxt = "";
            var commentArr = self.model.commentList;
            if(commentArr && commentArr.length > 0){
                self.render();
            }else{
                self.model.searchComment(function(){
                    self.render();
                },function(){
                    self.render();
                });
            }
        },
        //点击查看大图列表
        _clickPicHandler:function(e){
            if(this.model.get("pictures"))
            BookPreviewView.show(this.model.get("pictures"));
        },
        //点击该动态更多评论
        _clickCommentMoreHandler:function(e){
            var self = this;
            self.model.searchComment(function(){
                self.render();
            },function(){
                self.render();
            });
        },
        //点赞/取消点赞
        _clickZanHandler:function(e){
            var self = this;
            var target = $(e.target);
            if(!gili_data.getCurrentUser()){
                MsgBox.toast(gili_config.Tip.NOLOGIN,false);
                return;
            }
            var gId = self.model.get("objectId");
            if(target.data("zan") == "praise" && !utils.isLiked(gId)){ //点赞
                utils.likeTopic(1,gId,function(){
                    self.model.likeInt++;
                    self.render();
                },function(){
                    console.log("点赞失败");
                });

            }else if(target.data("zan") == "praise_ck" && utils.isLiked(gId)) { //取消点赞
                utils.likeTopic(0,gId,function(){
                    self.model.likeInt--;
                    self.render();
                },function(){
                    console.log("取消点赞失败");
                });
            }
        },
        //点击打开颜表情
        _clickFaceHandler:function(e){
            var self = this;
            self.model.faceOpen = !self.model.faceOpen;
            self.render();
        },
        //点击取消颜表情
        _clickFaceMaskHandler:function(e){
            var self = this;
            self.model.faceOpen = !self.model.faceOpen;
            self.render();
        },
        //删除
        _clickDelHandler:function(e){
            var gid = this.model.get("objectId");
            //guyy todo 确定删除？
            gili_data.deleteBlog(gid,function(){
                MsgBox.toast("删除成功");
                app.trigger("workListView:delWork",[gid]); //触发删除某话题
            },function(err){
                MsgBox.alert("删除失败");
            })
        },
        //取消当前回复对象
        removeReply:function(){
            var self = this;
            self.isReply = false;
            self.replyCId = "";
            self.replyUserId = "";
            self.replyUserName = "";
            self.replyKey = "";
            self.ui.commentTxt.val("");
        },
        //设置当前回复对象
        addReply:function(cId,userName,userId){
            var self = this;
            self.isReply = true;
            self.replyCId = cId;
            self.replyUserId = userId;
            self.replyUserName = userName;
            var key = "回复@"+userName+":";
            self.replyKey = key;
            self.ui.commentTxt.val(key);
        },
        //点击回复
        _clickReplyHandler:function(e){
            var self = this;
            var target = $(e.target);
            var cId = target.data("cid");
            var userName = target.data("username");
            var userId = target.data("userid");
            self.addReply(cId,userName,userId);
        },
        //点击发送
        _clickSendHandler:function(e){
            var self = this;
            if(!gili_data.getCurrentUser()){
                MsgBox.toast(gili_config.Tip.NOLOGIN,false);
                return;
            }
            self.isReply = false;
            //如果是给话题留言  belongId话题ID  commentId话题ID content回复内容
            //如果给话题留言回复 belongId话题ID  commentId被回复留言ID content {"content":"回复信息","uname":“补充回复人昵称”,"uid":“被回复人ID”}
            var belongId = self.model.get("objectId");  //话题
            var commentType = 1;
            var commentId = belongId; //如果回复的话，回复评论ID 否则为0  对象ID
            var txt = self.ui.commentTxt.val();
            var content = txt;
            if(self.replyKey != "" && txt.indexOf(self.replyKey) == 0){
                self.isReply = true;
            }
            if(self.isReply){
                commentId = self.replyCId;
                var contentObj = {};
                txt = txt.substring(txt.indexOf(":")+1);
                contentObj.content = txt;
                contentObj.uname = self.replyUserName;
                contentObj.uid = self.replyUserId;
                commentType = 5; //给评论回复 类型为5
                content = JSON.stringify(contentObj);
            }
            if(txt.trim() == ""){
                MsgBox.alert("评论内容不能为空");
                return;
            }
            var options = {
                belong_id:belongId,
                comment_id:commentId,
                comment_type:commentType,
                content:content
            };
            gili_data.snsSaveComment(options,function(data){
                self.model.addComment(data);
                self.removeReply();
                self.model.commentInt++;
                self.render();
                MsgBox.toast(gili_config.Tip.COMMENT_SUCCESS);
            },function(err){
                MsgBox.toast(gili_config.Tip.COMMENT_FAIL,false);
            });
        },
        //点击回复对象用户ID 指向用户中心
        _clickReplyUser:function(e){
            var target = $(e.target);
            var userId = target.data("userid");
            app.navigate("userCenter/"+userId,{trigger:true,replace:true});
        },
        //点击颜表情项
        _clickFaceItemHandler:function(e){
            var self = this;
            var target = $(e.target);
            var txt = target.html();
            self.model.faceOpen = false;
            self.model.commentTxt = self.ui.commentTxt.val()+""+txt;
            self.render();
        },
        _blurCommentHandler:function(e){
            var self = this;
            self.model.commentTxt = self.ui.commentTxt.val();
        },
        close:function(){
            BookPreviewView.hide();
        }
    });
    return WorkItemView;
});

