// 文件名称: activity_blog_view.js
//
// 创 建 人: zhao
// 创建日期: 2016/7/16 10:00
// 描    述: 活动页面
define([
    'common/base/item_view',
    'text!module/activity/templates/activity_blog_view.html',
    'marionette',
    'module/activity/model/activityModel',
    'module/book/views/bookPreviewView',
    'msgbox'
],function(BaseView, tpl, mn, activityModel, BookPreviewView, MsgBox){
    var htmlTpl = '<div class="activity-blog-item" data-id="{id}" data-user-id="{userId}">' +
        '<div class="activity-blog-pic button" style="background: url({pic}) no-repeat center; background-size: 100%"></div>' +
        '<div class="activity-blog-name button nowrapTxt">{name}</div>' +
        '<div class="activity-blog-likeAndComment"><span class="likeSpan">{likeCnt}</span>次点赞/<span>{commentCnt}</span>人评论</div>' +
        '<div class="activity-blog-like-btn button {likeStyle}">{likeName}</div>' +
        '</div>'
    return BaseView.extend({
        className : "activityBlogView",
        template : _.template(tpl),
        maxPage : 0,
        paginationWidth : 380,
        tempSpanWidth : 70,
        // key : selector
        ui : {
            blogList : ".activity-blog-list",
            paginationDiv : ".activity-blog-pagination",
            btnFirstPage : ".blog-first-page",
            btnLastPage : ".blog-last-page",
            pageTotalTxt : ".blog-all-pages",
            pageInputTxt : ".blog-page-input",
            btnPageGo : ".blog-go-to-page",
            pageNoWrapper : ".blog-span-wrapper",
            pageNumber : ".blog-page-number"
        },
        //事件添加
        events : {
            "click @ui.blogList" : "onBlogListHandler",
            'click @ui.btnFirstPage' : "onPageNumClickHandler",
            'click @ui.pageNumber' : "onPageNumClickHandler",
            'click @ui.btnLastPage' : "onPageNumClickHandler",
            'click @ui.btnPageGo' : "onGoToPageClickHandler"
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
            var self = this;
            self.$el.show();
        },

        setActivityLabel : function(label){
            var self = this;
            self.activityLabel = label;
            self.currentPage = 0;
            self.getBlogDataByPage();
            self.getBlogCount();
        },

        getBlogCount : function(){
            var self = this;
            activityModel.queryBlogCountByLabel(self.activityLabel, function(data){
                if(data > 0){
                    self.maxPage = Math.ceil(data / activityModel.pageNum);
                    self.initPaginationView();
                    self.ui.paginationDiv.show();
                }else{
                    self.ui.paginationDiv.hide();
                }
            });
        },

        initPaginationView : function(){
            var self = this;
            var tempSpan = "";
            var spanSelected = "";
            var width = self.maxPage * self.tempSpanWidth;
            self.ui.pageNoWrapper.css({"width": width + "px" }); //动态设置 span 容器的宽度
            self.ui.pageNumber.css({"width": width + "px" });
            for(var i = 0; i < self.maxPage; i++){
                spanSelected =  i == 0 ? "blog-page-number-selected" : "";
                tempSpan += '<span class="button '+spanSelected+'" data-num="'+ (i + 1)+'">'+(i+1)+'</span>';
            }
            self.ui.pageNoWrapper.html(tempSpan);
            self.ui.btnLastPage.attr("data-num", self.maxPage);
            self.ui.pageTotalTxt.html("共"+self.maxPage+"页");
        },

        /**
         * 跳转页
         * @param e
         */
        onPageNumClickHandler : function(e){
            e.preventDefault();
            e.stopPropagation();
            var self = this;
            var target = e.target;
            var pageNum = target.getAttribute("data-num");
            if(pageNum){
                self.jumpPageOperation(pageNum);
            }

        },
        /**
         * 跳转页
         * @param e
         */
        onGoToPageClickHandler : function(e){
            e.preventDefault();
            e.stopPropagation();
            var self = this;
            var pageNum = self.ui.pageInputTxt.val();
            if(self.checkInputTex(pageNum)){
                self.jumpPageOperation(pageNum);
            }
        },
        /**
         * 检测输入框的值是否有效
         * @param val
         */
        checkInputTex : function(val){
            var self = this;
            var res = true;
            if(!val){
                MsgBox.toast("请输入有效的页码", false);
                self.ui.pageInputTxt.val(self.currentPage);
                res = false
            }else if ( val > self.maxPage){
                MsgBox.toast("页码超过总页数", false);
                self.ui.pageInputTxt.val(self.maxPage);
                res = false
            }else if ( val < 1){
                MsgBox.toast("页码不得少于一页", false);
                self.ui.pageInputTxt.val(1);
                res = false
            }
            return res;
        },
        /**
         * 跳转页的实现
         * @param pageNum
         */
        jumpPageOperation : function(pageNum){
            var self = this;
            pageNum = parseInt(pageNum);

            self.resetSpanSelected(pageNum);
            //todo 查询数据更改页面
            self.currentPage = pageNum - 1;
            self.getBlogDataByPage();
        },
        /**
         *
         * @param num
         */
        resetSpanSelected : function (num){
            var self = this;
            var spanArr = self.ui.pageNoWrapper.find("span");
            for(var i = 0; i < spanArr.length; i++){
                $(spanArr[i]).removeClass("blog-page-number-selected");
            }
            $(spanArr[num - 1]).addClass("blog-page-number-selected");
            //以下为移动5个点的距离
            var left = (num + 2)*self.tempSpanWidth;
            var containerWidth = self.ui.pageNumber.width();
            var temp = left - containerWidth ;
            self.ui.pageNumber.scrollLeft(temp);
        },

        getBlogDataByPage : function(){
            var self = this;
            activityModel.queryBlogByLabel(self.activityLabel, self.currentPage, function(data){
                self._data = data;
                self.initBlogList(data);
            });
        },

        initBlogList : function(data){
            var self = this, html = "", obj;
            for(var i=0; i<data.length; i++){
                obj = data[i];
                var pic = obj.pictures[0];
                var name = obj.user.user_nick || "";
                var userId = obj.user.objectId
                var likeInt = obj.like_int || 0;
                var commentInt = obj.comment_int || 0;
                var likeStyle = "";
                var likeName = gili_config.Tip.ACTIVITY_LIKE;
                if(utils.isLiked(obj.objectId)){
                    likeStyle = "onSelect";
                    likeName = gili_config.Tip.ACTIVITY_LIKED;
                }
                html += htmlTpl.replace("{id}", obj.objectId).replace("{pic}", pic).replace("{name}", name)
                    .replace("{likeCnt}", likeInt).replace("{commentCnt}", commentInt).replace("{likeStyle}", likeStyle)
                    .replace("{likeName}", likeName).replace("{userId}", userId);
            }
            self.ui.blogList.html(html);
        },


        onBlogListHandler : function(e){
            e.stopPropagation();
            e.preventDefault();
            var self = this;
            var target = e.target;
            var parent = $(target).parents(".activity-blog-item");
            if(!parent) return;
            var dataId = parent.attr("data-id");
            if(!dataId) return;
            if(target.className.indexOf("activity-blog-pic") >= 0){
                self.onPreview(dataId);
            }else if(target.className.indexOf("activity-blog-like-btn") >= 0){
                self.onLike(parent, dataId);
            }else if(target.className.indexOf("activity-blog-name") >= 0){
                var userId = parent.attr("data-user-id");
                if(!userId) return;
                app.navigate("#userCenter/"+userId, {replace: false, trigger: true});
            }
        },

        onPreview : function(id){
            var self = this;
            var pictures = self.getPicturesById(id);
            BookPreviewView.show(pictures);
        },

        onLike : function(parent, id){
            var self = this;
            if(!id) return;

            if(!gili_data.getCurrentUser()){
                MsgBox.alert(giliConfig.Tip.NOLOGIN);
                return;
            }

            if(self.isLoving) return;
            self.isLoving = true;
            var isLike = utils.isLiked(id);
            var type = 0;
            if(!isLike){
                type = 1;
            }
            utils.likeTopic(type, id, function(data){
                self.isLoving = false;
                self.setBtnLoveState(parent, type);
                self.setLoveNum(parent, type);
            })
        },

        setBtnLoveState : function(parent, type){
            if(!parent) return;
            var btn = parent.find(".activity-blog-like-btn");
            if(btn.get(0)){
                if(type == 1){
                    btn.addClass("onSelect");
                    btn.html(gili_config.Tip.ACTIVITY_LIKED);
                }else{
                    btn.removeClass("onSelect");
                    btn.html(gili_config.Tip.ACTIVITY_LIKE);
                }
            }
        },

        setLoveNum : function(parent, type){
            if(!parent) return;
            var span = parent.find(".likeSpan");
            if(span.get(0)){
                var val = parseInt(span.html());
                if(type == 1){
                    span.html(val+1);
                }else{
                    span.html(val-1);
                }
            }
        },

        getPicturesById : function(id){
            var self = this, obj;
            if(!self._data) return;
            for(var i=0; i<self._data.length; i++){
                obj = self._data[i];
                if(obj.objectId == id+""){
                    return obj.pictures;
                }
            }
            return null;
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            this.$el.hide();
            BookPreviewView.hide();
        },

        //当页面销毁时触发
        onDestroy : function(){
        }

    });
});