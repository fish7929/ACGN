// 文件名称: utils.js
//
// 创 建 人: zhao
// 创建日期: 2016/06/21
// 描    述: 工具类
(function(window){
    var utils = {};
    window.utils = utils;

    /**
     * 检测手机号码
     * @param val
     */
    utils.checkPhoneNumber = function(val, msgbox){
        var  myreg = /^1\d{10}$/  //验证手机格式
        if (val.length == 0) {
            msgbox.toast("手机号码不能为空", false);
            return false;
        }
        if (!myreg.test(val)) {
            msgbox.toast.alert("手机号格式不正确", false);
            return false;
        }
        return true;
    };
    /**
     * 检测验证码号码
     * @param val
     */
    utils.checkVerifyNumber = function(val, msgbox){
        var  myreg = new RegExp(/^\d{6}$/);  //验证验证码格式
        if (val.length == 0) {
            msgbox.toast("验证码不能为空", false);
            return false;
        }
        if (!myreg.test(val)) {
            msgbox.toast("验证码格式不正确", false);
            return false;
        }
        return true;
    };
    /**
     * 检测手机号码
     * @param val
     */
    utils.checkNickIsEmpty = function(val, msgbox){
        if (val.length == 0) {
            msgbox.toast("昵称不能为空", false);
            return false;
        }
        return true;
    };
    /**
     * 检测验证码号码
     * @param val
     */
    utils.checkPassword = function(val, msgbox){
        var  myreg = new RegExp(/^\d{6}$/);  //验证验证码格式
        if (val.length == 0) {
            msgbox.toast("密码不能为空", false);
            return false;
        }
        if (val.length < 6) {
            msgbox.toast("密码不能少于6位", false);
            return false;
        }
        return true;
    };
    /**
     * 测试log
     * @param str
     */
    utils.log = function(str){
        console.log(str)
    },
    /**
     * 格式化时间 为  2015.12.15 10：00
     * @param time
     */
    utils.formatCreatedTime = function(time){
        var t = new Date(time);
        return (t.getFullYear()) + "." + (t.getMonth() + 1) + "." + t.getDate() +"  " +  t.getHours() + ":" + t.getMinutes();
    };

    /**
     * 获取随机头像
     * @param str
     */
    utils.getRandomHeader = function(){
//        var tempHeaders = [{"avatar_url":"http://ac-hf3jpeco.clouddn.com/4494f3b81bed10e35b39"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/17f70e4a66645ae60eff"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/98bf089b3ea0ab1ecc1e"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/078c97f54b59e00ca1e2"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/abeadb11f699080240b4"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/4b21557757cddf9901e5"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/1af1bd60a6a906b71a7c"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/6377818c0d8550caf684"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/7d3845039bbdac32d454"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/4b680573de29ad1d8d94"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/f17367c470a5a172a9f9"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/2e7ff3d3837476ecc592"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/bb126c87bf7979d9e5eb"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/d83025fdbc3007136ff0"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/bb03412408eb28e67948"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/c700ad29d45ddd99482a"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/e6723750e3c6124b9ce4"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/771a656409bcb2ad1703"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/09bb6c942245b5856693"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/c6c014b30d986d026699"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/4fa713426846f760a7ef"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/c35280b647f0ac89aca8"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/7062239a87175fad8f80"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/d80aacf85dff4d28310c"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/80c6b21ee051b9ce683a"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/36e26bbe4ebda0dacf55"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/60d361fc1cebc9ef26a6"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/d6556ddddded480f4d80"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/1cc1574c52913852b5f3"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/8c665e1f11f2fbe1c59d"},
//            {"avatar_url":"http://ac-hf3jpeco.clouddn.com/ca8442b0ff5793ba9c2b"}];
        var tempHeaders = [{"avatar_url":"http://www.gilieye.com/common-user.jpg"}];
        var index = Math.floor(Math.random() * tempHeaders.length);
        return tempHeaders[index].avatar_url;
    };

    utils.getLabelRandomColor = function(){
        var tempColors = ["#0000ff", "#00ff00", "#00b7ee", "#22ac38", "#ff0000", "#ff00ff"];
        var index = Math.floor(Math.random() * tempColors.length);
        return tempColors[index];
    }

    /**
     * 加载已点赞作品列表数据
     * add by guYY 2016/7/2 20:00
     */
    utils.loadLikedTplList = function(){
        if(!window.likedWorkList || window.likedWorkList.length <= 0)
        {
//            sns_data.getSnsLikeByUidLocalFun(function (arr) {
//                var workIdArr = [];
//                window.likedWorkList = workIdArr;
//                if(workIdArr.length > 0)
//                    app.triggerMethod("common:works:liked",[workIdArr.join(','),1]);
//            }, function (err) {
//                console.log(err);
//            });
        }
    }
    /**
     * 判断是否已点赞作品tplId
     * @param tplId
     * add by guYY 2016/7/2 20:00
     */
    utils.isLiked = function(workId){
        if(!window.likedWorkList)window.likedWorkList=[];
        return window.likedWorkList.indexOf(workId+"") >= 0;
    };
    /**
     * 点赞或取消点赞作品
     * @param tplId
     * @param like  1点赞   0取消点赞
     *  add by guYY 2016/7/2 20:11
     */
    utils.addLikeTpl = function(workId,like){
        if(!window.likedWorkList)window.likedWorkList=[];
        // 添加点赞
        if(like == 1) {
            if (window.likedWorkList.indexOf(workId + "") < 0)
                window.likedWorkList.push(workId + "");
        }else{ //取消点赞
            if (window.likedWorkList.indexOf(workId + "") >= 0)
                window.likedWorkList.splice(window.likedWorkList.indexOf(workId + ""),1);
        }
    };
    /**
     * 加载userObj已关注用户列表数据
     * add by guYY 2016/7/2 20:11
     */
    utils.loadAttentionList = function(userObj){
        if(!window.attentionUserList || window.attentionUserList.length <= 0)
        {
//            sns_data.getFolloweeAllList({"followee":"followee","pageSize":0,"pageNumber":1000},function(arr){
//                var attList = [];
//                for(var i = 0; i < arr.length; i++)
//                {
//                    attList.push(arr[i]["id"]);
//                }
//                window.attentionUserList = attList;
//                if(attList.length > 0) {
//                    app.triggerMethod("common:works:attention",[attList.join(','),1]);
//                }
//            },function(err){
//                console.log(err);
//            });
        }
    }
    /**
     * 判断是否已关注用户
     * @param userId
     * add by guYY 2016/7/2 20:11
     */
    utils.isAttention = function(userId){
        if(!window.attentionUserList)window.attentionUserList=[];
        return window.attentionUserList.indexOf(userId+"") >= 0;
    };
    /**
     * 关注或取消关注作品
     * @param userId   用户id
     * @param attention  1关注   0取消关注
     *  add by guYY 2016/7/2 20:11
     */
    utils.addAttention = function(userId,attention){
        if(!window.attentionUserList)window.likedTplList=[];
        //添加关注
        if(attention == 1) {
            if (window.attentionUserList.indexOf(userId + "") < 0)
                window.attentionUserList.push(userId + "");
        }else{ //取消关注
            if (window.attentionUserList.indexOf(userId + "") >= 0)
                window.attentionUserList.splice(window.attentionUserList.indexOf(userId + ""),1);
        }
    };

    //判断是否是base64图片
    utils.isBase64 = function(image){
        if(!image) return false;
        if(image.indexOf("data:") != -1) return true;
        return false;
    };

    utils.createEvent = function(type) {
        var customEvent;
        try {
            customEvent = document.createEvent('CustomEvent');
            customEvent.initCustomEvent(type, false, false);
        } catch (e) {
            customEvent = document.createEvent("HTMLEvents");
            customEvent.initEvent(type, false, false);
        }
        return customEvent;
    }
    
    utils.save_image = function(fileType, base64, cb_ok, cb_err) {
        if (null != base64 && "" != base64) {
            var file = new AV.File(utils.create_uid() + fileType, {
                base64:base64
            });
            file.save().then(function() {
                cb_ok(file);
            }, function(err) {
                cb_err(err.message);
            });
        } else cb_err("没有图像数据。");
    };

    utils.create_uid = function(a) {
        var b = new Date().getTime().toString(16), b = b + Math.floor((1 + Math.random()) * Math.pow(16, 16 - b.length)).toString(16).substr(1);
        return (a || "") + b;
    };


})(window);