// 文件名称: SettingBoxUI
//
// 创 建 人: fishYu
// 创建日期: 2016/7/12 21:14
// 描    述: 设置页
define([
    'text!common/templates/settingBoxUI.html',
    "showbox",
    "msgbox"
],function(tpl,ShowBox, MsgBox) {

    if(!ShowBox){
        require(["showbox"],function(showbox){
            ShowBox = showbox;
        });
    }

    var SettingBoxUI = function(){
        this._template = _.template(this._tpl || tpl);
        this.$el = $("<div>");
        this.el = this.$el.get(0);
        this.$el.html(this._template);

        this.settingClose = this.el.querySelector(".setting-close");
        this.settingNickTxt = this.el.querySelector("#setting-nick-txt");    //昵称
        this.settingNickDel = this.el.querySelector("#setting-nick-del");    //昵称删除按钮
        this.settingSexTxt = this.el.querySelector("#setting-sex-txt");    //性别
        this.settingAddressTxt = this.el.querySelector("#setting-address-txt");    //用户地址
        this.settingPhoneTxt = this.el.querySelector("#setting-phone-txt");    //手机号码
        this.settingBriefTxt = this.el.querySelector("#setting-brief-txt");    //简介
        this.currentLength = this.el.querySelector("#current-length");    //简介当前长度
        this.avatarFile = this.el.querySelector("#avatar-file");    //头像文件
        this.settingAvatar = this.el.querySelector(".setting-avatar");    //头像文件容器
        this.saveBtn= this.el.querySelector("#save-btn");    //保存按钮
        this.currentUser = gili_data.getCurrentUser();      //当前用户对象
        this.changeAvatarUrl = "";      //需要替换的头像URL
        this.isNickOk = true;       //昵称是否可以保存
        this._initView();
    };
    var p = SettingBoxUI.prototype;
    p._initView = function(){
        var self = this;
        self.resetUserInfo();
        self.addListener();
    };
    p.resetUserInfo = function() {
        var self = this;
        var userNick = self.currentUser.get("user_nick") || "";
        if(userNick){
            self.settingNickDel.style.background = "url('./images/common/ok.png') center no-repeat";
            self.settingNickDel.style.display = "block";
            self.settingNickTxt.value = userNick;
        }
        var phone = self.currentUser.get("phone") || "";
        self.settingPhoneTxt.value = phone;
        var sex = self.currentUser.get("sex");
        if(sex){
            self.settingSexTxt.selectedIndex = sex - 1;
            self.settingSexTxt.value = sex;
        }
        var address = self.currentUser.get("address") || "";
        self.settingAddressTxt.value = address;
        var brief = self.currentUser.get("brief") || "";
        self.settingBriefTxt.value = brief;
        self.currentLength.innerHTML = brief.length;
        var avatar = self.currentUser.get("avatar") || "";
        self.settingAvatar.style.background ="url("+avatar+") center no-repeat";
        self.settingAvatar.style.backgroundSize = "auto 100%";
    };
    p.addListener = function(){
        /**
         * 朦层关闭点击
         */
        this._onCloseSettingHandler = this.onCloseSettingHandler.bind(this);
        this.settingClose.addEventListener("click", this._onCloseSettingHandler, false);
        /**
         * 点击删除昵称按钮
         */
//        this._onDelectSettingNickHandler = this.onDelectSettingNickHandler.bind(this);
//        this.settingNickDel.addEventListener("click", this._onDelectSettingNickHandler, false);

        /**
         * 简介改变事件
         */
        this._onChangeBriefHandler = this.onChangeBriefHandler.bind(this);
        this.settingBriefTxt.addEventListener("input", this._onChangeBriefHandler, false);
        /**
         * 头像改变事件
         */
        this._onChangeAvatarHandler = this.onChangeAvatarHandler.bind(this);
        this.avatarFile.addEventListener("change", this._onChangeAvatarHandler, false);
        /**
         * 保存按钮事件
         */
        this._onSaveUserInfoHandler = this.onSaveUserInfoHandler.bind(this);
        this.saveBtn.addEventListener("click", this._onSaveUserInfoHandler, false);

        /**
         * 判断昵称是否被使用
         */
        this._onCheckUserNickHandler = this.onCheckUserNickHandler.bind(this);
        this.settingNickTxt.addEventListener("blur", this._onCheckUserNickHandler, false);
    };
    p.removeListener = function() {
        /**
         * 朦层关闭点击
         */
        this.settingClose.removeEventListener("click", this._onCloseSettingHandler, false);
        this._onCloseSettingHandler = null;
        /**
         * 点击删除昵称按钮
         */
//        this.settingNickDel.removeEventListener("click", this._onDelectSettingNickHandler, false);
//        this._onDelectSettingNickHandler = null;

        /**
         * 简介改变事件
         */
        this.settingBriefTxt.removeEventListener("input", this._onChangeBriefHandler, false);
        this._onChangeBriefHandler = null;
        /**
         * 头像改变事件
         */
        this.avatarFile.removeEventListener("change", this._onChangeAvatarHandler, false);
        this._onChangeAvatarHandler = null;
        /**
         * 保存按钮事件
         */
        this.saveBtn.removeEventListener("click", this._onSaveUserInfoHandler, false);
        this._onSaveUserInfoHandler = null;

        /**
         * 判断昵称是否被使用
         */
        this.settingNickTxt.removeEventListener("blur", this._onCheckUserNickHandler, false);
        this._onCheckUserNickHandler = null;
    };
    /**
     * 蒙层点击事件
     * @param e
     */
    p.onCloseSettingHandler = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        self._hide();
    };
    /**
     * 判断昵称是否被应用
     */
    p.onCheckUserNickHandler = function(e) {
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        var nick = self.settingNickTxt.value;
        if(nick) {
            gili_data.checkUserNick(nick, function (data) {
                if (data) {
                    self.settingNickDel.style.background = "url('./images/common/del.png') center no-repeat";
                    self.settingNickDel.style.display = "block";
                    MsgBox.toast("该昵称已被占用", false);
                    self.isNickOk = false;
                } else {
                    self.settingNickDel.style.background = "url('./images/common/ok.png') center no-repeat";
                    self.settingNickDel.style.display = "block";
                    self.isNickOk = true;
                }
            }, function (err) {
                console.log(err);
            });
        }
    };
    /**
     * 点击删除昵称按钮
     * @param e
     */
    p.onDelectSettingNickHandler = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        self.settingNickTxt.value = "";
        self.settingNickTxt.focus();
    };

    /**
     * 简介输入事件
     * @param e
     */
    p.onChangeBriefHandler = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        var len = self.settingBriefTxt.value.length;
        self.currentLength.innerHTML = len;
    };
    p.onChangeAvatarHandler = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        var target = e.target;
        var fileSize = 0;
        var limitSize = 200;
        var file = target.files[0];
        fileSize = target.files[0].size;
        var size = fileSize / 1024;
        if(size>limitSize){
            MsgBox.toast("图片不能大于"+limitSize+"K", false);
            target.value="";
            return;
        }else{
            self.readFile(file, function(data){
                self.settingAvatar.style.background ="url("+data+") center no-repeat";
                self.settingAvatar.style.backgroundSize = "auto 100%";
                utils.save_image('.jpg', data, function(file){
                    self.changeAvatarUrl = file.url();
                },function(err){
                    console.log(err);
                });
            }, function(err){
                console.log(err);
            });
        }
    };
    /**
     * 读取文件为 base64
     */
    p.readFile = function(file, cb_ok, cb_err){
        //判断类型是不是图片
        if(!/image\/\w+/.test(file.type)){
            cb_err("请选择图像类型文件");
            return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
            cb_ok(e.target.result);
        };
        reader.onerror = function(e){
            cb_err(e);
        };
    },
    /**
     * 保存用户信息
     * @param e
     */
    p.onSaveUserInfoHandler = function(e){
        e.stopPropagation();
        e.preventDefault();
        var self = this;
        var nick = self.settingNickTxt.value;
        var sex = self.settingSexTxt.value;
        sex = parseInt(sex);
        var address = self.settingAddressTxt.value;
        var phone = self.settingPhoneTxt.value;
        var brief = self.settingBriefTxt.value;
        if(nick){
            if(!self.isNickOk){
                MsgBox.toast("请输入正确的昵称", false);
                return false;
            }
            self.currentUser.set("user_nick", nick);
        }
        self.currentUser.set("sex", sex);
        if(address){
            self.currentUser.set("address", address);
        }
        if(phone){
            self.currentUser.set("phone", phone);
        }
        if(brief){
            self.currentUser.set("brief", brief);
        }
        if(self.changeAvatarUrl){
            self.currentUser.set("avatar", self.changeAvatarUrl);
        }

        self.currentUser.save(null, {
            success: function(data){
                MsgBox.toast("修改用户信息成功!");
                self.changeAvatarUrl = "";
                //派发修改用户信息
                app.triggerMethod("login:ok");
                self._hide();
            },
            error: function(err){
                MsgBox.toast("修改用户信息失败!", false);
            }
        });
    };
    /**
     * 所有失去焦点事件
     */
    p.allBlur = function (){
        var self = this;
        self.settingNickTxt.blur();   //昵称
        self.settingAddressTxt.blur();   //用户地址
        self.settingPhoneTxt.blur();   //手机号码
        self.settingBriefTxt.blur();     //简介
    };
    p._hide = function(){
        var self = this;
        self.removeListener();
        self.allBlur();
        ShowBox.remove(this);
        self.destroy();
    };

    p.destroy = function(){
        var self = this;
        self._template = null;
        self.$el = null;
        self.el = null;
        self.settingClose =  null;
        self.settingNickTxt = null;   //昵称
        self.settingNickDel =  null;   //昵称删除按钮
        self.settingSexTxt =  null;    //性别
        self.settingAddressTxt =  null;   //用户地址
        self.settingPhoneTxt =  null;    //手机号码
        self.settingBriefTxt =  null;    //简介
        self.currentLength =  null;   //简介当前长度
        self.avatarFile =  null;    //头像文件
        self.settingAvatar =  null;    //头像文件容器
        self.saveBtn= null;    //保存按钮
        self.changeAvatarUrl = "";
        self.isNickOk = true;       //昵称是否可以保存

    };

    p.show = function(){
        ShowBox.add(this);
    };

    return SettingBoxUI;

});