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
    }

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

})(window);