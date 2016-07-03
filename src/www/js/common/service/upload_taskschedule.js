// 文件名称: upload_taskschedule
//
// 创 建 人: chenshy
// 创建日期: 2015/1/21 15:14
// 描    述: 上传的任务调度器
define([
    'common/services/task/upload_task'
],function(UploadTask) {
    var uploadTaskSchedule = {
        tasks : [],
        failTask : [],
        isFinish : true,
        _timer : null,
        currentTask : null,
        _count : 0,
        addTask : function(task){
            var self = this;
            self.tasks.push(task);
            if(self.isFinish){
                self.currentTask = self.tasks.shift();
                task.upload();
                self._count = 0;
                self.isFinish = false;
                self._timer = window.setInterval(self.__timerHandle,1000);
            }
        },

        addUploadTask : function(uploadData, cb, param){
            var task = new UploadTask(uploadData,cb,param);
            this.addTask(task);
        },

        hasTask : function(uploadData){
            var self = this;
            if(self.currentTask && self.currentTask._data == uploadData) return true;
            var i, tk, len;
            len = self.tasks.length;
            for(i=0; i<len; i++){
                tk = self.tasks[i];
                if(tk._data == uploadData){
                    return true;
                }
            }
            len = self.failTask.length;
            for(i=0; i<len; i++){
                tk = self.failTask[i];
                if(tk._data == uploadData){
                    return true;
                }
            }
            return false;
        },

        _timerHandle : function(){
            if((this.currentTask && this.currentTask.isFinish) || (this.currentTask._isUploadFail) || this._count >= 360){
                if(this.currentTask._isUploadFail){
                    this.currentTask._isUploadFail = false;
                    this.failTask.push(this.currentTask);
                }

                if(this.tasks.length == 0){
                    this.isFinish = true;
                    window.clearInterval(this._timer);
                    this._timer = null;
                    this._count = 0;
                    this.currentTask = null;
                    topEvent.trigger("upload_taskschedule_finished");
                }else{
                    this.currentTask = this.tasks.shift();
                    this._count = 0;
                    this.currentTask.upload();
                }
            }
            this._count++;
        },

        isUploadSuccess : function(){
            return this.tasks.length == 0 && this.failTask.length == 0;
        },

        uploadFailTask : function(){
            while(this.failTask.length > 0){
                this.addTask(this.failTask.pop());
            }
        },

        clear : function(){
            this.isFinish = true;
            this._count = 0;
            this.tasks.length = 0;
            this.failTask.length = 0;
            if(this._timer){
                window.clearInterval(this._timer);
                this._timer = null;
                this.currentTask = null;
            }
        },

        __timerHandle : null,

        init : function(){
            this.__timerHandle = this._timerHandle.bind(this)
        }
    };

    uploadTaskSchedule.init();

    return uploadTaskSchedule;
});