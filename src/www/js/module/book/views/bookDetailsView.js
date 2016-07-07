// 文件名称: bookView.js
//
// 创 建 人: zhao
// 创建日期: 2016/6/26 17:00
// 描    述: 同人本子
define([
    'common/base/base_view',
    'text!module/book/templates/bookDetailsView.html',
    'marionette',
    'common/region/switch_view_region',
    'common/views/loginBar',
    'module/book/views/bookDetailsPreview',
    'module/book/views/bookDetailsHot',
    'common/views/commentView',
    'config/TipConfig',
    'module/book/model/BookModel'
],function(BaseView, tpl, mn, SwitchViewRegion, LoginBarView, BDPreviewView, BDHotView, CommentView, Tip, BookModel){
    var labelTpl = "<div class=\"bd-label-item\" style='background-color: {0}'>{1}</div>"

    return BaseView.extend({
        id : "bookDetailsContainer",
        template : _.template(tpl),
        _data : null,
        // key : selector
        ui : {
            bookCover : ".bd-image",
            bookTitle : ".title",
            bookAuthor : ".bd-author-txt",
            bookOriginal: ".bd-original-txt",
            bookCP : ".bd-cp-txt",
            bookLang : ".bd-lang-txt",
            bookPage : ".bd-page-txt",
            bookSize : ".bd-size-txt",
            bookSaleDate : ".bd-data-txt",
            bookBrief : ".book-brief",
            bookLabelList : ".bd-label-list",
            //
            bookAuthorRight : ".bd-author-name",
            bookNum : ".bd-author-works-num",
            clubImage : ".bd-author-college-image",
            clubName : ".bd-author-college-name",
            attendBtn : ".bd-author-bn-attend"
        },

        //事件添加
        events : {
            "click @ui.attendBtn" : "onAttentionHandle"
        },

        regions : {
            LoginBarRegion: {
                el: ".bd-loginBar-reg",
                regionClass: SwitchViewRegion
            },
            PreviewViewRegion:{
                el: ".bd-book-preview-reg",
                regionClass: SwitchViewRegion
            },
            HotViewRegion:{
                el: ".bd-book-hot-reg",
                regionClass: SwitchViewRegion
            },
            MessageRegion:{
                el: ".bd-book-message-reg",
                regionClass: SwitchViewRegion
            }
        },

        /**初始化**/
        initialize : function(){
            var self = this;
            self._loginBarView = new LoginBarView();
            self._previewView = new BDPreviewView();
            self._hotView = new BDHotView();
            self._commentView = new CommentView();
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

            var book_id = self.getOption("bookId");
            if(!book_id) return;
            BookModel.getBookById(book_id, function(data){
                self.initData(data[0]);
            }, function(error){
                utils.log(error);
            });
            self.regionShow();
        },

        regionShow : function(){
            var self = this;
            self.LoginBarRegion.show(self._loginBarView);
            self.PreviewViewRegion.show(self._previewView);
            self._hotView.setParam(self.getOption("bookId"));
            self.HotViewRegion.show(self._hotView);
            self.MessageRegion.show(self._commentView);
        },

        initData : function(data){
            var self = this;
            self._data = data;
            var cover = data.cover || "";
            var bookName = data.name || "";
            var author = data.user.user_nick || "";
            var originalAuthor = data.original || "";
            var cp = data.cp || "";
            var lang = data.language || "";
            var page = data.page || "";
            var size = data.size || "";
            var saleDate = data.sale_date;
            var brief = data.brief || "";
            var labelArr = data.labels || [];
            self.ui.bookCover.css({"background":"url("+cover+") no-repeat center", "background-size": "100%"});
            self.ui.bookTitle.html(bookName);
            self.ui.bookAuthor.html(author);
            self.ui.bookOriginal.html(originalAuthor);
            self.ui.bookCP.html(cp);
            self.ui.bookLang.html(lang);
            self.ui.bookPage.html(page);
            self.ui.bookSize.html(size);
            self.ui.bookSaleDate.html(utils.formatTime(saleDate, "yyyy.MM"));
            self.ui.bookBrief.html(brief);
            var labelHtml = "", color;
            for(var i = 0; i<labelArr.length; i++){
                color = utils.getLabelRandomColor();
                labelHtml += labelTpl.replace("{0}", color).replace("{1}", labelArr[i]);
            }
            self.ui.bookLabelList.html(labelHtml);

            var bookNum = data.user.blog_count || 0;
            var clubImage = "";
            var clubName = "";
            if(data.club){
                bookNum = "作品："+bookNum+"部";
                clubImage = data.club.cover;
                clubName = data.club.name;
            }
            self.ui.bookAuthorRight.html(author);
            self.ui.bookNum.html(bookNum);
            self.ui.clubImage.css({"background":"url("+clubImage+") no-repeat center", "background-size": "100%"});
            self.ui.clubName.html(clubName);

            var imageList = data.preview;
            self._previewView.initData(imageList);

            self.setAttentionStyle(utils.isAttention(data.user.objectId));

            var obj = {};
            obj.comment_id = data.objectId;
            obj.comment_type = 2;
            self._commentView.setCommentTarget(obj)
        },

        onAttentionHandle : function(e){
            e.stopPropagation();
            e.preventDefault();

            var self = this;
            if(!self._data) return;

            var type = 0;
            if(self.ui.attendBtn.html() == Tip.ATTENTIONED){
                type = 1;
            }
            var userId = self._data.user.objectId;
            console.log(type);
            utils.attentionUser(type, userId, function(data){
                self.setAttentionStyle(type);
            }, function(err){
            });
        },

        setAttentionStyle : function(val){
            var self = this;
            if(val){
                self.ui.attendBtn.html(Tip.NOT_ATTENTION)
            }else{
                self.ui.attendBtn.html(Tip.ATTENTIONED);
            }
        },

        /**页面关闭时调用，此时不会销毁页面**/
        close : function(){
            var self = this;
            self._previewView.hideBookPreview();
        },

        //当页面销毁时触发
        onDestroy : function(){
        }
    });
});