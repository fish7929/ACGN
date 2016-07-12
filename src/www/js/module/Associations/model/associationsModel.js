/**
 * Created by guyy on 2016/7/9.
 * 社团model
 */
define([
    'msgbox',
    'backbone'
],function(MsgBox){
    var associationsModel = Backbone.Model.extend({
        constructor:function(){
            Backbone.Model.apply(this,arguments);
        },
        initialize:function(){
            var self = this;
            self.set({"name":"","authorId":"","author":"无创建者","brief":"(社团简介)","cover":"images/temp/asso/defaultCover.jpg","bookNum":0,"joinNum":0,"attentionsNum":0,"blogNum":0});
            self.set({"joinTxt":"加入社团","joinClass":""});
            self.set({"attentionsTxt":"关注社团","attentionsClass":""});
            self.set("imgList",""); //成员列表view用
        },
        /**
         * 是否已经加入社团 回调status 1已加入  0未加入
         * @param userId 用户ID为空表示未登录 无法确定加入关系
         * @param clubId
         * @param cb_ok
         */
        isJoin:function(userId,clubId,cb_ok){
            var self = this;
            if(userId == "" || clubId == "")
            {
                self.set({"joinTxt":"加入社团","joinClass":""});
                return;
            }
            var options = {"user_id":userId,"club_id":clubId};
            gili_data.getUserClubRelation(options,function(data){
                if(data && data.get("approved") == 0){
                    self.set({"joinTxt":"审核中","joinClass":"btnAdd_ck"});
                }else if(data && data.get("approved") == 1){
                    self.set({"joinTxt":"已加入","joinClass":"btnAdd_ck"});
                }else if(data && data.get("approved") == 2){
//                    self.set({"joinTxt":"加入社团","joinClass":""});
                    self.set({"joinTxt":"审核不通过","joinClass":"btnAdd_ck"});
                }
            },function(err){
                console.log(err);
            })
            cb_ok &&cb_ok();
        },
        /**
         * 是否已关注社团 回调status 1已关注  0未关注
         * @param userId 用户ID为空表示未登录 无法确定加入关系
         * @param clubId
         * @param cb_ok
         */
        isAttentions:function(userId,clubId,cb_ok){
            var self = this;
            if(userId == "" || clubId == "")
            {
                self.set({"attentionsTxt":"关注社团","attentionsClass":""});
                return;
            }
            var options = {"user_id":userId,"club_id":clubId};
            gili_data.getUserFlloweeClubRelation(options,function(data){
                if(!data || data.get("status") == 1){
                    self.set({"attentionsTxt":"关注社团","attentionsClass":""});
                    return;
                }else
                    self.set({"attentionsTxt":"取消关注","attentionsClass":"btnAttention_ck"});
            },function(err){
                console.log(err);
            })
            cb_ok &&cb_ok();
        },
        //加入社团
        join:function(clubId,cb_ok){
            var self = this;
            var options = {"club_id":clubId};
            //默认成功
            self.set({"joinTxt":"审核中","joinClass":"btnAdd_ck"});
            gili_data.joinClub(options,function(data){
                cb_ok && cb_ok();
            },function(err){
                //失败 UI重置
                self.set({"joinTxt":"加入社团","joinClass":""});
                MsgBox.toast("加入失败,请稍后再试");
                cb_ok && cb_ok();
            })
        },
        /**
         * 关注/取消关注 社团
         * @param type  1关注社团   0取消关注
         * @param clubId  社团ID
         */
        attentions:function(type,clubId,cb_ok){
            var self = this;
            var options = {"club_id":clubId};
            if(type == 1){
                options.status = 1;
                //默认关注成功
                self.set({"attentionsTxt":"取消关注","attentionsClass":"btnAttention_ck"});
                gili_data.followeeClub(options,function(){
                    self.set("attentionsNum",self.get("attentionsNum") + 1);
                    console.log("关注成功");
                    cb_ok && cb_ok();
                },function(){
                    //失败 UI重置
                    self.set({"attentionsTxt":"关注社团","attentionsClass":""});
                    MsgBox.toast("关注失败,请稍后再试");
                    cb_ok && cb_ok();
                })
            }else{
                options.status = 999;
                //默认取消关注成功
                self.set({"attentionsTxt":"关注社团","attentionsClass":""});
                gili_data.followeeClub(options,function(){
                    console.log("取消关注成功");
                    self.set("attentionsNum",self.get("attentionsNum")>0?self.get("attentionsNum")-1:0);
                    cb_ok && cb_ok();
                },function(){
                    //失败 UI重置
                    self.set({"attentionsTxt":"取消关注","attentionsClass":"btnAttention_ck"});
                    MsgBox.toast("取消关注失败,请稍后再试");
                    cb_ok && cb_ok();
                })
            }
        },
        setId:function(id){
            var self = this;
            self.set("id",id);
        },
        //社团名称
        setName:function(name){
            if(!name)name = 0;
            this.set("name",name);
        },
        //社团本子数
        setBookInt:function(num){
            if(!num)num = 0;
            this.set("bookNum",num);
        },
         //社团关注数
        setAttentionsInt:function(num){
            if(!num)num = 0;
            this.set("attentionsNum",num);
        },
         //社团加入人数
        setJoinInt:function(num){
            if(!num)num = 0;
            this.set("joinNum",num);
        },
        //社团投稿数
        setBlogInt:function(num){
            if(!num)num = 0;
            this.set("BlogInt",num);
        },
        //社团简介
        setBrief:function(brief){
            if(!brief)brief = "(社团简介)";
            this.set("brief",brief);
        },
        //社团封面
        setCover:function(cover){
            if(!cover || cover == "")cover = "images/temp/asso/defaultCover.jpg";//默认封面
            this.set("cover",cover);
        },
        //设置社团创建者 user为对象
        setAuthor:function(user){
            if(!user){
                this.set("authorId","");
                this.set("author","无创建者")
            }
            this.set("authorId",user.id);
            this.set("author",user.get("user_nick"));
        },
        getAssociationsById:function(id){
            var self = this;
            var userId = "";
            var currUser = gili_data.getCurrentUser();
            if(currUser) userId = currUser.id;
            self.isJoin(userId,id,null);
            self.isAttentions(userId,id,null);
            //根据ID查询社团对象
            var options={club_id:id}
            gili_data.getClubById(options,function(data){
                var dataArr = data?data.results:[];
                if(dataArr.length <= 0)return;
                var obj = dataArr[0];
                self.setId(obj.id);
                self.setName(obj.get("name"));
                self.setBookInt(obj.get("book_int"));
                self.setAttentionsInt(obj.get("followee_int"));
                self.setJoinInt(obj.get("join_int"));
                self.setBrief(obj.get("brief"));
                self.setCover(obj.get("cover"));
                self.setBlogInt(obj.get("blog_int"));
                self.setAuthor(obj.get("user"));
            },function(err){
                MsgBox.toast("社团加载出错"+err);
                var obj = {};
                self.setId(obj.id);
                self.setName(obj.get("name"));
                self.setBookInt(obj.get("book_int"));
                self.setAttentionsInt(obj.get("followee_int"));
                self.setJoinInt(obj.get("join_int"));
                self.setBrief(obj.get("brief"));
                self.setCover(obj.get("cover"));
                self.setBlogInt(obj.get("blog_int"));
            });
        },
        //根据社团ID获取成员列表
        getAssociationsMembers:function(id,cb_ok){
            var self = this,
                options = {
                    club_id:id,
                    skip:0,
                    limit:12
                };
            gili_data.getClubJoinUser(options,function(data){
                cb_ok && cb_ok.call(null,data);
            },function(err){
                MsgBox.alert("查询错误,请稍后再试"+err);
            })
        },
        //根据社团ID获取粉丝列表
        getAssociationsFans:function(id,cb_ok){
            var self = this,
                options = {
                    club_id:id,
                    skip:0,
                    limit:12
                };
            gili_data.getClubFollweeUser(options,function(data){
                cb_ok && cb_ok.call(null,data);
            },function(err){
                MsgBox.alert("查询错误,请稍后再试"+err);
            })
        }

    });
    return associationsModel;
});
