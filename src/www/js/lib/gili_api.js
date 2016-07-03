// 文件名称: gli_api.js
// 创 建 人: nyh
// 创建日期: 2016/6/25
// 描    述: gili调用数据库api接口

var gili_data = {};

/**
 返回当前登录用户对象
 **/
gili_data.getCurrentUser = function () {
    var currentUser = AV.User.current();
    if (currentUser) {
        return currentUser;
    } else {
        return null;
    }
};

/** 根据class 表名和objectId 查询对应的对象数据
 * class_name 表名
 * objectId 对象id
 * cb_ok
 * cb_err
 **/
gili_data.getObjectById = function (class_name, objectId, cb_ok, cb_err) {
    var query = new AV.Query(class_name);
    query.equalTo("objectId", objectId);
    query.first({
        success: function (obj) {
            if (obj) {
                cb_ok(obj.toJSON());
            } else {
                cb_err("找不到对象");
            }
        },
        error: cb_err
    });
};
////////////////////////////////////////////////// 企划相关 /////////////////////////////////////////////////////////

/** 加入 关注企划
 * plan_id，企划id
 * status,1-关注，2-加入,999-取消关注
 **/
gili_data.planOpration = function (options, cb_ok, cb_err) {
    var plan_id = options.plan_id,
        status = options.status;

    if (!plan_id) {
        cb_err("企划id为空");
        return;
    }
    if (!this.getCurrentUser()) {
        cb_err("请先登录!");
        return;
    }

    var strCQL = " select * from plan_relation where plan_id='" + plan_id + "' and user_id='" + this.getCurrentUser().id + "' ";
    AV.Query.doCloudQuery(strCQL, {
        success: function (data) {
            if (data) {
                //如果存在则 update
                var obj = data.results[0];
                var his_status = obj.get("status") || 0;
                if (his_status == 1 && status == 2) {
                    obj.set("status", 3);
                } else if (his_status == 2 && status == 1) {
                    obj.set("status", 3);
                    obj.set("approved", 0);
                } else if (his_status == 3 && status == 999) {
                    obj.set("status", 2);
                } else if (his_status == 1 && status == 999) {
                    obj.set("status", 0);
                } else {
                    obj.set("status", status);
                }
                obj.save(null, {
                    success: cb_ok,
                    error: cb_err
                });
            } else {
                //如果不存在则进行数据新增
                insert();
            }
        },
        error: cb_err
    });
    var insert = function (obj) {
        var club_relation = AV.Object.extend("plan_relation");
        var obj = new club_relation();
        obj.set("plan_id", plan_id);
        obj.set("user", this.getCurrentUser());
        obj.set("user_id", this.getCurrentUser().id);
        obj.set("status", parseInt(opration_type));
        obj.save(null, {
            success: cb_ok,
            error: cb_err
        });
    }
};

gili_data.getPlan = function (options, cb_ok, cb_err) {
    var pageNumber = options.pageNumber || 0,
        pageSize = options.pageSize || 1000;

    var limit = pageSize;
    var skip = 0;

    if (pageNumber != 0) {
        skip = pageSize * pageNumber - pageSize;
    } else {
        skip = pageNumber;
    }
    var strCql = "";
    strCql = " select include author, * from plan ";
    //翻页
    if (skip >= 0 && limit > 0) {
        strCql += " order by createdAt desc limit " + skip + "," + limit;
    }
    AV.Query.doCloudQuery(strCql, {
        success: function (data) {
            cb_ok(data.results);
        }, error: cb_err
    }
    );
};

/** 根据plab_id查询plan对象
 * plan_id，企划id
 **/
gili_data.getPlanByPlanId = function (plan_id, cb_ok, cb_err) {
    var strCql = " select include user, * from plan where objectId='" + plan_id + "'";
    AV.Query.doCloudQuery(strCql, {
        success: function (data) {
            //TODO 由于只有一条的
            var obj = (data.results)[0];
            var _user = obj.get("user");
            _user = _user.toJSON();
            obj = obj.toJSON()
            obj.user = _user;
            cb_ok(obj);
        }, error: cb_err
    }
    );
};

/** 查询企划公告
 * skip,
 * limit,
 * cb_ok
 * cb_err
 **/
gili_data.getPlanNotice = function (options, cb_ok, cb_err) {
    var skip = options.skip || 0,
        limit = options.limit || 1000,
        plan_id = options.plan_id;
    var query = new AV.Query("notice");
    query.equalTo("plan_id", plan_id);
    query.skip(skip);
    query.limit(limit);
    query.descending("order");
    query.find({
        success: function (objs) {
            if (objs) {
                var data = [];
                for (var i = 0; i < objs.lenth; i++) {
                    data[i] = objs[i].toJSON();
                }
                cb_ok(data);
            } else {
                cb_err("找不到对象");
            }
        }, error: cb_err
    });
};

/** 查询企划公告
 * skip,
 * limit,
 * cb_ok
 * cb_err
 **/
gili_data.getUser = function (options, cb_ok, cb_err) {
    var skip = options.skip || 0,
        limit = options.limit || 1000;
    var query = new AV.Query("_User");
    query.equalTo("objectId", objectId);
    query.skip(skip);
    query.limit(limit);
    query.descending("order");
    query.find({
        success: function (objs) {
            if (objs) {
                var data = [];
                for (var i = 0; i < objs.lenth; i++) {
                    data[i] = objs[i].toJSON();
                }
                cb_ok(data);
            } else {
                cb_err("找不到对象");
            }
        }, error: cb_err
    });
};
/** 企划id 获取已经报名该企划的用户列表
 * paln_id
 * skip
 * limit
 * cb_ok
 * cb_err
 **/
gili_data.getPlanUserByPlanId = function (options, cb_ok, cb_err) {
    var plan_id = options.plan_id,
        skip = options.skip || 0,
        limit = options.limit || 1000

    var getPlanUserList = function (planObj) {
        var query = new AV.Query("plan_relation");
        query.equalTo("plan", planObj);
        query.include("join");
        query.equalTo("status", 1);//状态为1的
        query.equalTo("approved", 1);//审核通过的
        query.skip(skip);
        query.limit(limit);
        query.descending("createdAt");
        query.find({
            success: function (data) {
                cb_ok(data);
            },
            error: cb_err
        })
    }
    var query = new AV.Query("plan");
    query.equalTo("objectId", plan_id);
    query.first({
        success: function (obj) {
            if (obj) {
                getPlanUserList(obj);
            } else {
                cb_err("找不到企划对象");
            }
        }, error: cb_err
    });
};

/** 获取加入该企划的用户的作品(最热，最新排序)
 * plan_id,
 * plan_name 企划名字
 * skip,
 * limit
 * orderBy
 * isDesc
 **/
gili_data.getPlanUserBlog = function (options, cb_ok, cb_err) {

    var plan_id = options.plan_id,
        plan_name = options.plan_name,
        skip = options.skip || 0,
        limit = options.limit || 1000,
        orderBy = options.orderBy || "createdAt",
        isDesc = options.isDesc;
    if (!plan_id) {
        cb_err("企划id不能为空！");
        return;
    }
    //获取关注该企划的用户列表，取出用户id 拼成CQL,去blog作品表查询 且标签=企划名字
    gili_data.getPlanUserByPlanId(plan_id, function (data) {
        if (data) {
            var strCQL = dataToCQL(data);
            gili_data.getBlog(strCQL, function (blogs) {
                cb_ok(blogs);
            }, cb_err);
        } else {
            cb_err("企划关注用户为空！");
            return;
        }
    }, cb_err);

    var dataToCQL = function (data) {
        var followeeList = "", CQL = "";
        var objlen = data.length > 135 ? 135 : obj.length;//按CQL只能存储4096个字节算，除去300其他CQL剩下135个24位的objectId字节长度，也就是说关注的用户不能超过135个人，否则用户不计算在关注内容查询范围内
        for (var i = 0; i < objlen; i++) {
            followeeList += "'" + obj[i].id + "',";
        }
        if (followeeList.length > 0) {
            CQL = " select * from blog where status !=2 and user_id in (" + followeeList.substring(0, followeeList.length - 1) + ") and labels in (" + plan_name + ") ";
        }
        if (orderBy.length > 0) {
            if (isDesc) {
                CQL += " order by " + orderBy + " desc ";
            } else {
                CQL += " order by " + orderBy + " asc ";
            }
        }
        CQL += " limit " + skip + "," + limit;
        return CQL;
    }
};
/** 根据用户id,企划id查看用户和企划的关系
 * user_id,
 *  plan_id,
 **/
gili_data.getUserPlanRelation = function (options, cb_ok, cb_err) {
    var user_id = options.user_id,
        plan_id = options.plan_id;

    var strCQL = " select * from plan_relation where user_id='" + user_id + "' and  plan_id='" + plan_id + "' ";
    AV.Query.doCloudQuery(strCQL, {
        success: function (data) {
            if (data.results) {
                cb_ok(data.results[0]);
            } else {
                cb_err();
            }
        },
        error: cb_err
    });
};

////////////////////////////////////////////////// 首页相关 /////////////////////////////////////////////////////////
/** 查询专题banner数据
 *
 **/
gili_data.getSubjectBanner = function (options, cb_ok, cb_err) {
    var strCQL = " select * from subject order by order_num desc ";
    AV.Query.doCloudQuery(strCQL, {
        success: function (objs) {
            var data = [];
            for (var i = 0; i < objs.lenth; i++) {
                data[i] = objs[i].toJSON();
            }
            cb_ok(data);
        },
        error: cb_err
    });
};
/** 按类型 获取用户总数
 * table_name
 * field 字段名
 * val 值 只支持数字和字符串
 **/
gili_data.getTableCountByField = function (options, cb_ok, cb_err) {
    var field = options.field,
         val = options.val,
        table_name = options.table_name;

    var strCQL = " select count(*) from  " + table_name;
    if (field.length > 0) {
        if (typeof val == "number") {
            strCQL += " where " + field + "=" + val;
        } else {
            strCQL += " where " + field + "='" + val + "' ";
        }
    }
    AV.Query.doCloudQuery(strCQL, {
        success: function (objs) {
            cb_ok(objs);
        },
        error: cb_err
    });
};

/** 查询用户 如果是随机 前端先查询总数，后根据随机页数取相应的数据
 * skip
 * limit
 **/
gili_data.getUsers = function (options, cb_ok, cb_err) {
    var skip = options.skip || 0,
        limit = options.limit || 100;

    var strCQL = " select * from _User limit " + skip + "," + limit;
    AV.Query.doCloudQuery(strCQL, {
        success: function (objs) {
            var data = [];
            for (var i = 0; i < objs.lenth; i++) {
                data[i] = objs[i].toJSON();
            }
            cb_ok(data);
        },
        error: cb_err
    });
};

/** 查询表随机data
 * table_name 表名 book,blog,_User,club
 * skip
 * limit
 **/
gili_data.getRandomDataByTable = function (options, cb_ok, cb_err) {
    var skip = options.skip || 0,
        limit = options.limit || 100,
        table_name = options.table_name;

    var strCQL = " select * from " + table_name + " limit " + skip + "," + limit;
    AV.Query.doCloudQuery(strCQL, {
        success: function (objs) {
            var data = [];
            for (var i = 0; i < objs.lenth; i++) {
                data[i] = objs[i].toJSON();
            }
            cb_ok(data);
        },
        error: cb_err
    });
};

////////////////////////////////////////////////// 话题 插画 相关 ///////////////////////
/** 获取blog
 * blog_type,1-话题，2-插画
 * topic,
 * pictures ，数组插画
 * labels，数组标签
 * cb_ok
 * cb_err
 * */
gili_data.addBlog = function (options, cb_ok, cb_err) {
    var pictures = options.pictures,
        topic = options.topic,
        labels = options.labels,
        blog_type = options.blog_type,
        status = options.status || 0;

    var blog = AV.Object.extend("blog");
    var obj = new blog();
    if (topic) {
        obj.set("topic", topic);
    }
    if (pictures) {
        obj.set("pictures", pictures);
    }
    //obj.set("club_id", club_id);
    if (labels) {
        obj.set("labels", labels);
    }
    obj.set("labels", labels);
    obj.set("user", this.getCurrentUser());
    obj.set("user_id", this.getCurrentUser().id);
    obj.set("type", parseInt(blog_type));
    obj.save(null, {
        success: cb_ok,
        error: cb_err
    });
}
/** 获取blog
 * CQL
 * cb_ok
 * cb_err
 * */
gili_data.getBlog = function (CQL, cb_ok, cb_err) {
    AV.Query.doCloudQuery(CQL, {
        success: function (data) {
            cb_ok(data.results);
        }, error: cb_err
    }
    );
}

/** 获取用户动态数据
 * user_id,用户id
 * skip
 * limit
 **/
gili_data.getUserBlog = function (options, cb_ok, cb_err) {
    var skip = options.skip || 0,
        limit = options.limit || 100,
        user_id = options.user_id;

    var strCQL = "";

    //获取用户的关注用户，取用户id生产cql语句
    //获取用户关注列表
    var getUserF = function (userobj) {
        if (userobj) {
            var query = userobj.followeeQuery();
            query.include("followee");
            query.skip(0);
            query.limit(1000);
            query.find({
                success: function (obj) {
                    var followeeList = "";
                    if (obj) {
                        var objlen = obj.length > 135 ? 135 : obj.length;//按CQL只能存储4096个字节算，除去300其他CQL剩下135个24位的objectId字节长度，也就是说关注的用户不能超过135个人，否则用户不计算在关注内容查询范围内
                        for (var i = 0; i < objlen; i++) {
                            followeeList += "'" + obj[i].id + "',";
                        }
                        if (followeeList.length > 0) {
                            strCQL = " select  * from blog where status!=2 and  user_id in (" + followeeList.substring(0, followeeList.length - 1) + ")  ";
                            gili_data.getBlog(strCQL, function (objs) {
                                var data = [];
                                for (var i = 0; i < objs.lenth; i++) {
                                    data[i] = objs[i].toJSON();
                                }
                                cb_ok(data);
                            }, function (data, error) {
                                cb_err(error);
                            });
                        } else {
                            cb_ok("");
                        }
                    } else {
                        cb_ok("");
                    }
                },
                error: cb_err
            });
        } else {
            cb_ok("");
        }
    }

    var query = new AV.Query("_User");
    query.equalTo("objectId", user_id);
    query.first({
        success: function (userobj) {
            getUserF(userobj);
        },
        error: cb_err
    });
};

///////////////////////////////////////////////// 其他功能接口 //////////////////////////////////////
/** 根据标签类型type查询标签数据集
 labelsType，标签类型 如：pc_plate_label
 **/
gili_data.getLabelsByType = function (options, cb_ok, cb_err) {
    var plateLabels = options.labelsType;
    var strCQL = " select * from labels where type='" + labels_type + "' order by order desc limit 0,1000  ";
    AV.Query.doCloudQuery(strCQL, {
        success: cb_ok,
        error: cb_err
    });
};

/** 查询帮助中心内容
 helptype,帮助中心类别
 **/
gili_data.getHelpCenter = function (helptype, cb_ok, cb_err) {
    var query = new AV.Query("helpcenter");
    query.equalTo("approved", 1);
    query.descending("ordernum");
    if (helptype.length > 0) {
        query.equalTo("helptype", helptype);
    }
    query.find({
        success: cb_ok,
        error: cb_err
    });
};

/** 查询主题页banner
 bannerType，banner类型
 **/
gili_data.getBannerByType = function (bannerType, cb_ok, cb_err) {
    if (!bannerType) {
        cb_err("参数错误，banner类型为空!");
        return;
    }
    var query = new AV.Query("me_bannerconf");
    query.equalTo("bannertype", bannerType);
    query.descending("bannernumber");
    query.find({
        success: cb_ok,
        error: cb_err
    });
};

/** 发送短信
 phone，手机号码
 **/
gili_data.sendPhoneMsg = function (phone, cb_ok, cb_err) {
    if (!phone) {
        cb_err("手机号码为空!");
        return;
    }
    AV.Cloud.requestSmsCode(phone).then(
        cb_ok,
        cb_err//err.message=="Can't send sms code too frequently." --短信发送过于频繁
    );
}

/** 验证手机短信
 phone，手机号码
 **/
gili_data.verifyPhoneMsgCode = function (msgcode, cb_ok, cb_err) {
    if (!msgcode) {
        cb_err("验证码为空!");
        return;
    }
    AV.Cloud.verifySmsCode(msgcode).then(
        cb_ok,
        cb_err//err.code =1||err.code=603 --无效的短信验证码
    );
}

/////////////////////////////////////////// 社交模块 ////////////////////////////

/** 根据评论对象id查询评论数据
 *  comment_id,评论对象id
 *  comment_type,评论目标类型1-话题插画，2-本子，3-企划，4-留言，5-其他
 * skip, 从第几条开始
 * limit, 每页显示条数
 * orderBy, 排序字段
 * isDesc,是否降序
 **/
gili_data.getComment = function (options, cb_ok, cb_err) {
    var comment_type = options.comment_type,
        comment_id = options.comment_id,
        orderBy = options.orderby || "createdAt",
        isDesc = options.isdesc,
        skip = options.pageSize || 0,
        limit = options.pageNumber || 6;

    if (!comment_id) {
        cb_err("评论对象为空!");
        return;
    };
    if (!comment_type) {
        cb_err("评论对象类型为空!");
    };

    var strCQL = " select include user,* from comment where  status !=1 ";

    //排序
    if (orderBy.length > 0) {
        if (isDesc) {
            strCQL += " order by " + orderby + " desc ";
        } else {
            strCQL += " order by " + orderby + " asc ";
        }
    }
    //翻页
    if (skip >= 0 && limit > 0) {
        strCQL += " limit " + skip + "," + limit;
    }
    fmacloud.Query.doCloudQuery(strCQL, {
        success: cb_ok,
        error: cb_err
    });
};


/** 查询自己的粉丝
 follower,用户对象
 **/
gili_data.meFollowerList = function (options, cb_ok, cb_err) {
    if (!this.getCurrentUser()) {
        cb_err("请先登录!");
        return;
    }
    var follower = options.follower,
     orderby = options.orderby || "createdAt",
     isdesc = options.isdesc,
     pageSize = options.pageSize || 0,
     pageNumber = options.pageNumber || 6,
     userid = options.userid;

    var userCurrent;
    var queryUserObj = function () {
        var skip = 0;
        var limit = pageNumber;
        //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
        if (pageSize != 0) {
            skip = pageSize * pageNumber;
        }
        //var query = userCurrent.followerQuery();
        //query.include(follower);
        var _Follower = fmacloud.Object.extend("_Follower");
        var query = new AV.Query(_Follower);
        query.equalTo("user", userCurrent);
        query.include(follower);
        query.skip(skip);
        query.limit(limit);
        //排序
        if (orderby.length > 0) {
            if (isdesc) {
                query.descending(orderby);
            } else {
                query.ascending(orderby);
            };
        }
        query.find({
            success: cb_ok,
            error: cb_err
        });
    }

    var getUserObj = function () {
        var query = new AV.Query("_User");
        query.equalTo("objectId", userid);
        query.first({
            success: function (userobj) {
                if (userobj) {
                    userCurrent = userobj;
                    queryUserObj();
                } else {
                    cb_err();
                }
            },
            error: cb_err
        });
    }
    if (userid) {
        getUserObj();
    } else {
        userCurrent = fmacloud.User.current();
        queryUserObj();
    }
};

/** 查询自己关注的用户列表
 followee,用户对象
 **/
gili_data.meFolloweeList = function (options, cb_ok, cb_err) {
    if (!this.getCurrentUser()) {
        cb_err("请先登录!");
        return;
    }
    var followee = options.followee,
        orderby = options.orderby || "createdAt",
        isdesc = options.isdesc,
        pageSize = options.pageSize || 0,
        pageNumber = options.pageNumber || 100,
        userid = options.userid || "";

    var userCurrent;
    var queryUserObj = function () {
        var skip = 0;
        var limit = pageNumber;
        //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
        if (pageSize != 0) {
            skip = pageSize * pageNumber;
        }
        var _Followee = AV.Object.extend("_Followee");
        var query = new AV.Query(_Followee);
        query.equalTo("user", userCurrent);
        query.include(followee);
        query.skip(skip);
        query.limit(limit);
        //排序
        if (orderby.length > 0) {
            if (isdesc) {
                query.descending(orderby);
            } else {
                query.ascending(orderby);
            };
        }
        query.find({
            success: cb_ok,
            error: cb_err
        });
    }
    var getUserObj = function () {
        var query = new AV.Query("_User");
        query.equalTo("objectId", userid);
        query.first({
            success: function (userobj) {
                if (userobj) {
                    userCurrent = userobj;
                    queryUserObj();
                } else {
                    cb_err();
                }
            },
            error: cb_err
        });
    }
    if (userid) {
        getUserObj();
    } else {
        userCurrent = AV.User.current();
        queryUserObj();
    }
};

/** 取消关注某个用户
 userid,用户id
 **/
gili_data.meUnfollow = function (userid, cb_ok, cb_err) {
    if (!this.getCurrentUser()) {
        cb_err("请先登录!");
        return;
    }
    AV.User.current().unfollow(userid).then(
        cb_ok,
        cb_err
    );
};

/** 关注某个用户
 userid,用户id
 **/
gili_data.meFollow = function (userid, cb_ok, cb_err) {
    if (!userid || !this.getCurrentUser()) {
        cb_err("请先登录!");
        return;
    }
    AV.User.current().follow(userid).then(
        cb_ok,
        cb_err
    );
};

/** 根据当前登录用户对象的所有赞
 * like_type,赞类型1-话题插画，2-本子，3-企划
 **/
gili_data.getAllLikeList = function (cb_ok, cb_err) {
    var like_type = options.like_type;

    var currentLUser = this.getCurrentUser();
    if (!currentLUser) {
        cb_err("未登录用户!");
        return;
    }
    var like = new AV.Query("like");
    like.equalTo("user_id", currentLUser.id);
    like.notEqualTo("status", 1);
    if (like_type) {
        like.equalTo("like_type", like_type);
    }
    like.limit(1000);
    like.find({
        success: function (obj) {
            if (obj) {
                var like_arr = [];
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i])
                        like_arr[i] = obj[i].toJSON();
                }
                cb_ok(like_arr);
            } else {
                cb_ok("");
            }
        },
        error: cb_err
    });
};

/** 查询用户关注的所有用户集合
 **/
gili_data.getFolloweeAllList = function (options, cb_ok, cb_err) {
    if (!this.getCurrentUser()) {
        cb_err("请先登录!");
        return;
    }
    var userCurrent = this.getCurrentUser();
    var query = userCurrent.followeeQuery();
    query.include('followee');
    query.limit(1000);
    query.find().then(function (datas) {
        if (datas) {
            var arr = [];
            for (var i = 0; i < datas.length; i++) {
                if (datas[i])
                    arr[i] = datas[i].toJSON();
            }
            cb_ok(arr);
        } else {
            cb_ok("");
        }
    });
};

/** 查询自己关注的用户列表
 user_id, 别人用户中心的用户id，如果是查自己的个人中心不需要传
 skip
 limit
 orderBy
 isDesc
 **/
gili_data.followeeList = function (options, cb_ok, cb_err) {
    if (!this.getCurrentUser()) {
        cb_err("请先登录!");
        return;
    }
    var orderBy = options.orderBy || "createdAt",
        isDesc = options.isDesc,
        skip = options.skip || 0,
        limit = options.limit || 100,
        user_id = options.user_id;

    var userCurrent;
    var queryFollowee = function () {
        var query = userCurrent.followeeQuery();
        query.include("followee");
        query.skip(skip);
        query.limit(limit);
        //排序
        if (orderBy.length > 0) {
            if (isDesc) {
                query.descending(orderBy);
            } else {
                query.ascending(orderBy);
            };
        }
        query.find({
            success: cb_ok,
            error: cb_err
        });
    }
    var getUserObj = function () {
        var query = new AV.Query("_User");
        query.equalTo("objectId", user_id);
        query.first({
            success: function (userobj) {
                if (userobj) {
                    userCurrent = userobj;
                    queryFollowee();
                } else {
                    cb_err();
                }
            },
            error: cb_err
        });
    }
    if (userid) {
        getUserObj();
    } else {
        userCurrent = AV.User.current();
        queryFollowee();
    }
};

/** 查询自己的粉丝
 user_id, 别人用户中心的用户id，如果是查自己的个人中心不需要传
 skip
 limit
 orderBy
 isDesc
 **/
gili_data.followerList = function (options, cb_ok, cb_err) {
    if (!this.getCurrentUser()) {
        cb_err("请先登录!");
        return;
    }
    var orderBy = options.orderBy || "createdAt",
        isDesc = options.isDesc,
        skip = options.skip || 0,
        limit = options.limit || 100,
        user_id = options.user_id;

    var userCurrent;
    var queryFollower = function () {
        var query = userCurrent.followerQuery();
        query.include('follower');
        query.skip(skip);
        query.limit(limit);
        //排序
        if (orderBy.length > 0) {
            if (isDesc) {
                query.descending(orderBy);
            } else {
                query.ascending(orderBy);
            };
        }
        query.find({
            success: cb_ok,
            error: cb_err
        });
    }
    var getUserObj = function () {
        var query = new AV.Query("_User");
        query.equalTo("objectId", user_id);
        query.first({
            success: function (userobj) {
                if (userobj) {
                    userCurrent = userobj;
                    queryFollower();
                } else {
                    cb_err("用户为空！");
                }
            },
            error: cb_err
        });
    }
    if (user_id) {
        getUserObj();
    } else {
        userCurrent = this.getCurrentUser();
        queryFollower();
    }
};

/** 点赞提交信息
 like_opration, 赞类型 like 点赞，cancerlike 取消赞
 like_type,1-话题插画，2-其他拓展
 like_id,点赞对象id
 **/
gili_data.snsSaveLike = function (options, cb_ok, cb_err) {
    var currentuser = this.getCurrentUser();
    var like_opration = options.like_opration,
        like_type = options.like_type,
        like_id = options.like_id;

    if (!currentuser) {
        cb_err("用户对象为空，没有登录！");
        return;
    }
    if (!like_id) {
        cb_err("参数错误，赞对象id为空！");
        return;
    }
    var user_id = currentuser.id;
    var save_like = function () {
        var query = new AV.Query("like");
        query.equalTo("user_id", user_id);
        query.equalTo("like_id", like_id);
        query.first({
            success: function (data) {
                if (data) {//如果已经存在该数据说明为0状态
                    if (like_opration == "like") {
                        data.set("status", 0);
                        data.save(null, {
                            success: cb_ok,
                            error: cb_err
                        });
                    } else if (like_opration == "cancerlike") {
                        data.set("status", 1);
                        data.save(null, {
                            success: cb_ok,
                            error: cb_err
                        });
                    }
                } else {//如果不存在新增
                    var like = AV.Object.extend("like");
                    var obj = new like();
                    obj.set("user_id", user_id);
                    obj.set("like_id", like_id);
                    obj.set("like_type", like_type);
                    obj.set("status", 0);
                    obj.set("user", currentuser);
                    obj.save(null, {
                        success: function (obj) {
                            cb_ok(obj);
                        },
                        error: cb_err
                    });
                }
            },
            error: cb_err
        });
    }
    //话题插画赞总计
    var update_blog_count = function () {
        var query = new AV.Query("blog");
        query.equalTo("objectId", like_id);
        query.first({
            success: function (data) {
                if (data) {
                    var like_int = data.get("like_int") || 0;
                    if (like_opration == "like") {
                        data.increment("like_int", 1);
                    } else if (like_opration == "cancerlike") {
                        if (like_int > 0) {
                            data.increment("like_int", -1);
                        }
                    }
                    data.save(null, {
                        success: function (obj) {
                            save_like();
                        },
                        error: cb_err
                    });
                } else {
                    save_like();
                }
            },
            error: cb_err
        });
    }
    update_blog_count();
};

/** 评论
 comment_id,评论对象id
 comment_type,1-话题插画，2-评论
 content,评论内容，blog评论内容：XXXXX ,如果为评论的评论进行回复的评论则为：{"content":"回复信息","uname":“刘德华”,"uid":“用户id”}，显示为：用户头像名字 + 回复@张三+ 回复内容
 belong_blog_id,所属那个话题插画
 **/
gili_data.snsSaveComment = function (options, cb_ok, cb_err) {;
    var comment_id = options.comment_id,
        content = options.content,
        comment_type = options.comment_type,
        belong_blog_id = options.belong_blog_id || "";//便于查询评论列表

    if (!comment_id || !this.getCurrentUser()) {
        cb_err("参数错误，或者没有登录！");
        return;
    }
    if (belong_blog_id.length == 0 && comment_type == 1) {
        belong_blog_id = comment_id;
    }
    var current_user = this.getCurrentUser();

    if (current_user) {
        var save_comment = function () {
            var comment = AV.Object.extend("comment");
            var obj = new comment();
            obj.set("comment_id", comment_id);
            obj.set("comment_type", parseInt(comment_type));
            obj.set("user_id", user_id);
            obj.set("status", 0);
            obj.set("content", content);//comment_content为JSON格式的字符串数据
            obj.set("user", current_user);
            obj.set("belong_blog_id", belong_blog_id);
            obj.save(null, {
                success: cb_ok,
                error: cb_err
            });
        }

        //保存tplobj评论计总数
        var save_blog_count = function () {
            var query = new AV.Query("blog");
            query.equalTo("objectId", belong_blog_id);
            query.first({
                success: function (data) {
                    if (data) {
                        var comment_int = data.get("comment_int") || 0;
                        data.increment("comment_int", 1);
                        data.save(null, {
                            success: function (cbobj) {
                                save_comment();
                            }, error: cb_err
                        });
                    } else {
                        save_comment();
                    }
                },
                error: cb_err
            });
        }

        save_blog_count();

    }
};


/////////////////////////////////////////////////  社团相关 //////////////////////////////////////

/** 查询社团s
 * club_id，社团id
 **/
gili_data.getClubById = function (options, cb_ok, cb_err) {
    var club_id = options.club_id;
    if (!club_id) {
        cb_err("社团id为空");
        return;
    }
    var strCQL = " select include user, * from club where objectId='" + club_id + "' ";
    AV.Query.doCloudQuery(strCQL, {
        success: function (data) {
            cb_ok(data);
        },
        error: cb_err
    });
};

/** 加入,关注社团操作
 * club_id，社团id
 * status,1-关注，2-加入,999-取消关注
 *
 **/
gili_data.clubOpration = function (options, cb_ok, cb_err) {
    var club_id = options.club_id,
        status = options.status;

    if (!club_id) {
        cb_err("社团id为空");
        return;
    }
    if (!this.getCurrentUser()) {
        cb_err("请先登录!");
        return;
    }

    var strCQL = " select * from club_relation where club_id='" + club_id + "' and user_id='" + this.getCurrentUser().id + "' ";
    AV.Query.doCloudQuery(strCQL, {
        success: function (data) {
            if (data) {
                //如果存在则 update
                var obj = data.results[0];
                var his_status = obj.get("status") || 0;
                if (his_status == 1 && status == 2) {
                    obj.set("status", 3);
                } else if (his_status == 2 && status == 1) {
                    obj.set("status", 3);
                    obj.set("approved", 0);
                } else if (his_status == 3 && status == 999) {
                    obj.set("status", 2);
                } else if (his_status == 1 && status == 999) {
                    obj.set("status", 0);
                } else {
                    obj.set("status", status);
                }
                obj.save(null, {
                    success: cb_ok,
                    error: cb_err
                });
            } else {
                //如果不存在则进行数据新增
                insertClub();
            }
        },
        error: cb_err
    });
    var insertClub = function (obj) {
        var club_relation = AV.Object.extend("club_relation");
        var obj = new club_relation();
        obj.set("club_id", club_id);
        obj.set("user", this.getCurrentUser());
        obj.set("user_id", this.getCurrentUser().id);
        obj.set("status", parseInt(opration_type));
        obj.save(null, {
            success: cb_ok,
            error: cb_err
        });
    }
};

/** 获取社团成员,或者关注用户
 * club_id，社团id
 * status 1-查询关注社团用户，2-查询加入社团用户
 * skip
 * limit
 **/
gili_data.getClubUser = function (options, cb_ok, cb_err) {
    var club_id = options.club_id,
        status = options.status,
        skip = options.skip || 0,
        limit = options.limit || 1000;

    if (!club_id) {
        cb_err("社团id为空");
        return;
    }
    var strWhere = "";
    if (status == 1) {
        strWhere = " and status in (1,3)";
    } else if (status == 2) {
        strWhere = " and status in (2,3)";
    }
    var strCQL = " select include user, * from club where club_id='" + club_id + "' " + strWhere + " limit " + skip + "," + limit;
    AV.Query.doCloudQuery(strCQL, {
        success: function (data) {
            cb_ok(data.results);
        },
        error: cb_err
    });
};

/** 获取社团成员,或者关注用户
 * club_id，社团id
 * status 1-查询关注社团用户，2-查询加入社团用户
 **/
gili_data.getClubUserCount = function (options, cb_ok, cb_err) {
    var club_id = options.club_id,
        status = options.status;
    if (!club_id) {
        cb_err("社团id为空");
        return;
    }
    var strWhere = "";
    if (status == 1) {
        strWhere = " and status in (1,3)";
    } else if (status == 2) {
        strWhere = " and status in (2,3)";
    }
    var strCQL = " select count(*) from club where club_id='" + club_id + "' " + strWhere;
    AV.Query.doCloudQuery(strCQL, {
        success: function (data) {
            cb_ok(data);
        },
        error: cb_err
    });
};

/////////////////////////////////////////////本子相关接口////////////////////////////////////////////////////////////

/** 查询本子对象
 * book_id，本子id
 **/
gili_data.getBookById = function (options, cb_ok, cb_err) {
    var book_id = options.book_id;
    if (!book_id) {
        cb_err("本子id为空");
        return;
    }
    var strCQL = " select include user,include club, * from club where objectId='" + book_id + "' ";
    AV.Query.doCloudQuery(strCQL, {
        success: function (data) {
            cb_ok(data);
        },
        error: cb_err
    });
};

/** 最热本子，查询本子list
 * skip
 * limit
 **/
gili_data.getBooks = function (options, cb_ok, cb_err) {
    var skip = options.skip || 0,
        limit = options.limit || 100;

    var strCQL = " select  * from book where approved !=2 limit " + skip + "," + limit;
    AV.Query.doCloudQuery(strCQL, {
        success: function (data) {
            cb_ok(data.results);
        },
        error: cb_err
    });
};

/** 查询本子总数
 **/
gili_data.getBooksCount = function (options, cb_ok, cb_err) {
    var strCQL = " select  count(*) from book where approved !=2 ";
    AV.Query.doCloudQuery(strCQL, {
        success: function (data) {
            cb_ok(data);
        },
        error: cb_err
    });
};
/////////////////////////////其他 接口/////////////////////////
/** 查询本子总数
 * name ,文件名称 如：XXXX.jpg 一定要带后缀
 * file,文件file对象
 **/
gili_data.fileUpload = function (options, cb_ok, cb_err) {
    var name = options.name,
        file = options.file;

    var avFile = new AV.File(name, file);
    avFile.save().then(function (obj) {
        cb_ok(obj);
    }, cb_err);
};

/**
  * 用户登录
  * @param username
  * @param password
  * @param cb_ok
  * @param cb_err
  */
gili_data.logIn = function (username, password, cb_ok, cb_err) {
    AV.User.logIn(username, password).then(function (user) {
        cb_ok && cb_ok(user);
    }, function (err) {
        cb_err && cb_err(err);
    });
};
/**
 * 用户注销
 **/
gili_data.logOut = function () {
    AV.User.logOut();
};

window.gili_data = gili_data;