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
        return currentUser.toJSON();
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
gili_data.getObjectById = function (class_name,objectId, cb_ok, cb_err) {
    var query = new AV.Query(class_name);
    query.equalTo("objectId", objectId);
    query.first({
        success: function(obj){
                if(obj){
                    cb_ok(obj.toJSON());
                }else{
                    cb_err("找不到对象");
                }
        },
        error: cb_err
    });
};
//////////////////////////////////////////////////企划 相关 /////////////////////////////////////////////////////////
gili_data.getPlan=function(options,cb_ok,cb_err) {
    gili_data.getalert();
    var pageNumber=options.pageNumber||0,
         pageSize=options.pageSize||1000;

    $("#dg").datagrid("loading", "数据加载中……");
    var limit = pageSize;
    var skip = 0;

    if (pageNumber != 0) {
        skip = pageSize * pageNumber - pageSize;
    } else {
        skip = pageNumber;
    }
    var rows = [];
    $("#dg").datagrid("loading", "数据加载中……");
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
/** 查询企划公告
 * skip,
 * limit,
 * cb_ok
 * cb_err
 **/
gili_data.getPlanNotice= function (options,cb_ok, cb_err) {
    var skip=options.skip||0,
        limit=options.limit||1000;
    var query = new AV.Query("notice");
    query.equalTo("objectId", objectId);
    query.skip(skip);
    query.limit(limit);
    query.descending("order");
    query.find({
        success: function(objs){
            if(objs){
                var data=[];
                for(var i=0;i<objs.lenth;i++){
                    data[i]=objs[i].toJSON();
                }
                cb_ok(data);
            }else{
                cb_err("找不到对象");
            }
        },error: cb_err
    });
};

/** 查询企划公告
 * skip,
 * limit,
 * cb_ok
 * cb_err
 **/
gili_data.getUser= function (options,cb_ok, cb_err) {
    var skip=options.skip||0,
        limit=options.limit||1000;
    var query = new AV.Query("_User");
    query.equalTo("objectId", objectId);
    query.skip(skip);
    query.limit(limit);
    query.descending("order");
    query.find({
        success: function(objs){
            if(objs){
                var data=[];
                for(var i=0;i<objs.lenth;i++){
                    data[i]=objs[i].toJSON();
                }
                cb_ok(data);
            }else{
                cb_err("找不到对象");
            }
        },error: cb_err
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
    var plan_id=options.plan_id,
        skip=options.skip||0,
        limit=options.limit||1000

    var getPlanUserList=function(planObj){
        var query = new AV.Query("plan_relation");
        query.equalTo("plan",planObj);
        query.include("join");
        query.equalTo("status",1);//状态为1的
        query.equalTo("approved",1);//审核通过的
        query.skip(skip);
        query.limit(limit);
        query.descending("createdAt");
        query.find({
            success: function (data) {
                cb_ok(data);
            },
            error:cb_err
        })
    }
    var query = new AV.Query("plan");
    query.equalTo("objectId", plan_id);
    query.first({
        success: function(obj){
            if(obj){
                getPlanUserList(obj);
            }else{
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
gili_data.getPlanUserBlog = function (options, cb_ok, cb_err){

    var plan_id=options.plan_id,
        plan_name=options.plan_name,
        skip=options.skip||0,
        limit=options.limit||1000,
        orderBy=options.orderBy||"createdAt",
        isDesc=options.isDesc;
    if(!plan_id){
        cb_err("企划id不能为空！");
        return;
    }
    //获取关注该企划的用户列表，取出用户id 拼成CQL,去blog作品表查询 且标签=企划名字
    gili_data.getPlanUserByPlanId(plan_id,function(data){
        if(data){
            var strCQL= dataToCQL(data);
            gili_data.getBlog(strCQL,function(blogs){
                cb_ok(blogs);
            },cb_err);
        }else{
            cb_err("企划关注用户为空！");
            return;
        }
    },cb_err);

    var dataToCQL=function(data){
        var followeeList="",CQL="";
        var objlen = data.length > 135 ? 135 : obj.length;//按CQL只能存储4096个字节算，除去300其他CQL剩下135个24位的objectId字节长度，也就是说关注的用户不能超过135个人，否则用户不计算在关注内容查询范围内
        for (var i = 0; i < objlen; i++) {
            followeeList += "'" + obj[i].id + "',";
        }
        if (followeeList.length > 0) {
            CQL=" select * from gili_blog where status !=1 and author_id in ("+followeeList.substring(0, followeeList.length - 1)+") and labels in ("+plan_name+") ";
        }
        if(orderBy.length>0){
            if(isDesc){
                CQL+=" order by "+orderBy+" desc ";
            }else{
                CQL+=" order by "+orderBy+" asc ";
            }
        }
        CQL+=" limit "+skip+","+limit;
        return CQL;
    }
};
/** 根据用户id,企划id查看用户和企划的关系
* user_id,
 *  plan_id,
 **/
gili_data.getUserPlanRelation = function (options, cb_ok, cb_err) {
    var user_id = options.user_id,
        plan_id=options.plan_id;

    var strCQL = " select * from plan_relation where user_id='" + user_id + "' and  plan_id='"+plan_id+"' ";
    AV.Query.doCloudQuery(strCQL, {
        success: function(data){
            if(data.results){
                cb_ok(data.results[0]);
            }else{
               cb_ok([]);
            }
        },
        error: cb_err
    });
};

/////////////////////////////////////
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
/** 获取blog
 * CQL
 * cb_ok
 * cb_err
 * */
gili_data.getBlog=function(CQL,cb_ok,cb_err){
    AV.Query.doCloudQuery(CQL, {
            success: function (data) {
                cb_ok(data.results);
            }, error: cb_err
        }
    );
}
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
 *  comment_type,评论目标类型0-微杂志作品，1-众创页评论，
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
    if (orderBy.length>0) {
        if(isDesc){
            strCQL += " order by " + orderby + " desc ";
        }else{
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

window.gili_data = gili_data;