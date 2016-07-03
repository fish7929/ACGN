// 文件名称: upload_task
//
// 创 建 人: zhao
// 创建日期: 2016/7/2 21:16
// 描    述: 上传任务
define([
],function() {
    var UploadTask = function(data, cb, param){
        var self = this;
        self.isFinish = false;
        self._data = data;
        self.callback = cb;
        self._isUploadFail = false;
        self.param = param;

        self._tryCount = 3;
    };

    UploadTask.prototype.upload = function(){
        var self = this;
        var data = self._data;
        if(utils.isBase64(self._data)){
            data = data.substring(data.indexOf(",") + 1);
            utils.save_image('.jpg', data, function(file){
                self.isFinish = true;
                if(self.callback){
                    self.callback(self.param, file);
                    self.callback = null;
                }
            }, function(error){
                console.log(error);
                if(self._tryCount > 0){
                    self._tryCount --;
                    self.upload();
                }else{
                    self._tryCount = 3;
                    self._isUploadFail = true;
                }
            });
        }else{
            if(self.callback){
                self.callback(self.param, null);
                self.callback = null;
            }
            self.isFinish = true;
        }
    };

    return UploadTask;
});