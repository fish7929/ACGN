// 文件名称: login.js
//
// 创 建 人: fishYu
// 创建日期: 2016/6/23 22:19
// 描    述: login.js
(function(){

    var tpl =
        '<div class="loading-wave-me-container">' +
        '</div>';

    var logining = null;

    var LoginView = function(){
        this.dom = LoginView.getDom();
        this.meContainer = this.dom.querySelector(".loading-wave-me-container");
        this.type = LoadingWave.RANDOM_LOADING;
        this.meLogo = this.dom.querySelector(".loading-wave-melogo");
        this.meLogo.style.opacity = 0;
        this.wave1 = this.dom.querySelector(".loading-wave");
        this.wave2 = this.dom.querySelector(".loading-wave2");
        this.wave3 = this.dom.querySelector(".loading-wave3");
        this.percentEl = this.dom.querySelector(".loading-wave-percent");
        this._timer = null;
        this._showPercent = true;
        this.percentEl.style.display = "block";
        //console.log(this.wave1);
    };

    var core_rnotwhite = /\S+/g;
    var rclass = /[\t\r\n]/g;
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    var core_trim = "X".trim;
    var addClass = function(elem, value) {
//            var className = element.className;
//            var blank = (className != '') ? ' ' : '';
//            if (!Css.hasClass(element, newClassName))
//                element.className = className + blank + newClassName;
        var classes, cur, clazz, j,
            proceed = typeof value === "string" && value;

        if ( proceed ) {
            // The disjunction here is for better compressibility (see removeClass)
            classes = ( value || "" ).match( core_rnotwhite ) || [];

            cur = elem.nodeType === 1 && ( elem.className ?
                        ( " " + elem.className + " " ).replace( rclass, " " ) :
                        " "
                );

            if ( cur ) {
                j = 0;
                while ( (clazz = classes[j++]) ) {
                    if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
                        cur += clazz + " ";
                    }
                }
                elem.className = trim( cur );

            }

        }

    };

    var trim = core_trim && !core_trim.call("\uFEFF\xA0") ?
        function( text ) {
            return text == null ?
                "" :
                core_trim.call( text );
        } :

        // Otherwise use our own trimming functionality
        function( text ) {
            return text == null ?
                "" :
                ( text + "" ).replace( rtrim, "" );
        };

    var removeClass = function(elem, value) {
//            if (this.hasClass(element,cls)) {
//                var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
//                element.className = element.className.replace(reg,'');
//            }
        var classes, cur, clazz, j,
            proceed = arguments.length === 0 || typeof value === "string" && value;

        if ( proceed ) {
            classes = ( value || "" ).match( core_rnotwhite ) || [];


            // This expression is here for better compressibility (see addClass)
            cur = elem.nodeType === 1 && ( elem.className ?
                        ( " " + elem.className + " " ).replace( rclass, " " ) :
                        ""
                );

            if ( cur ) {
                j = 0;
                while ( (clazz = classes[j++]) ) {
                    // Remove *all* instances
                    while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
                        cur = cur.replace( " " + clazz + " ", " " );
                    }
                }
                elem.className = value ? trim( cur ) : "";
            }
        }
    };

    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame || window.cancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame;

    LoadingWave.RANDOM_LOADING = 1;
    LoadingWave.PROGRESS_LOADING = 2;
    var maskContainer = null;
    var clipContainer = null;
    var clipButton = null;

    LoadingWave.prototype.begin = function(){
        this.pos1 = -15;
        this.pos2 = -10;
        this.pos3 = 0;
        this._percent = 0;
        this._end = false;
        this._tempPercent = 0;
        this.wave1.style.backgroundSize = "100px -15px";
        this.wave2.style.backgroundSize = "100px -10px";
        this.wave3.style.backgroundSize = "100px 0px";
        this._backCallback = null;
        this._callback = null;
        this.meLogo.style.opacity = 0;
        this.meContainer.style.opacity = 1;

        var percent = 0;
        var self = this;
        var max = Math.floor(Math.random() * 20) + 50;

        //var max = 68;
        var waveIndex = 0;
        function update(){
            if(self.type == LoadingWave.RANDOM_LOADING) {
                percent++;
                if (percent < max && !self._end) {
                    self.setProgress(percent);
                }
            }

            self.playAnimation(waveIndex);
            waveIndex++;
            self._timer = requestAnimationFrame(update);
        }

        update();
        //}
    };

    Object.defineProperty(LoadingWave.prototype,"backCallback",{
        set : function(fn){
            this._backCallback = fn;
        }
    });

    LoadingWave.prototype.end = function(cb){
        this._callback = cb;
        //var timer;
        var percent = this._percent;
        var self = this;
        var waveIndex  = 0;
        if(this._backCallback){
            this._backCallback = null;
        }
        function end(){
            percent += 5;
            if(percent < 100){
                self.setProgress(percent);
                //self._end = true;
                self._timer = requestAnimationFrame(end);
            } else if(percent >= 100) {
                percent = 100;
                self.setProgress(percent);

                self._end = true;

                //addClass(clipContainer,"slideOutFade_loading");
                addClass(self.percentEl,"me-wave-fade-out");
                setTimeout(function(){
                    addClass(self.meLogo,"me-wave-fade-in");
//                maskContainer.removeEventListener("webkitAnimationEnd",fn);
//                var fn = function(){
//
//                    //alert("df");
//
//                    maskContainer.removeEventListener("webkitAnimationEnd",fn);
//                };

                    //maskContainer.addEventListener("webkitAnimationEnd",fn);

                    setTimeout(function(){
                        //if(maskContainer.parentNode){
                        //    maskContainer.parentNode.removeChild(maskContainer);
                        //}

                        addClass(clipContainer,"slideOutFade_loading");
                        setTimeout(function(){
                            if(self._callback){
                                self._callback();
                                //console.log("cal");
                                self._callback = null;
                                //self.destroy();
                            }
                            removeClass(self.percentEl,"me-wave-fade-out");
                            removeClass(self.meLogo,"me-wave-fade-in");
                        },500);

                        //removeClass(clipContainer,"slideOutFade_loading");
                    },300);
                },300);
            }

            self.playAnimation(waveIndex);
            waveIndex++;
        }

        end();
    };

    //LoadingWave.prototype.destroy = function(){
    //    //if(maskContainer.parentNode){
    //    //    maskContainer.parentNode.removeChild(maskContainer);
    //    //}
    //    if(this._callback){
    //        this._callback = null;
    //    }
    //
    //    removeClass(clipContainer,"slideOutFade_loading");
    //};

    var maxWave1 = 175;
    var maxWave2 = 180;
    var maxWave3 = 175;

    Object.defineProperty(LoadingWave.prototype,"showPercent",{
        set : function(value){
            this._showPercent = value;
            if(value){
                this.percentEl.style.display = "block";
            }else{
                this.percentEl.style.display = "none";
            }
        }
    });

    LoadingWave.prototype.setProgress = function(percent){
        if(this._end){
            return;
        }
        //this._percent = percent;
        var t = percent;
        //if(percent < 95 && percent > 70){
        //    t = 70;
        //}
        if(this._showPercent){
            this.percentEl.innerHTML = percent + "%";
        }
        var dis = t - this._tempPercent;
        this._tempPercent = t;
        this._percent = percent;
        var u1 = dis / 100 * maxWave1;
        var u2 = dis / 100 * maxWave2;
        var u3 = dis / 100 * maxWave3;

        u1 *= 0.7;
        u2 *= 0.7;
        u3 *= 0.7;
        this.pos1 += u1;
        this.pos2 += u2;
        this.pos3 += u3;



        this.wave1.style.backgroundSize = "100px "+toInt(this.pos1)+"px";
        this.wave2.style.backgroundSize = "100px "+toInt(this.pos2)+"px";
        this.wave3.style.backgroundSize = "100px "+toInt(this.pos3)+"px";

        if(this.type === LoadingWave.PROGRESS_LOADING && percent >= 100){
            //console.log("dffd");
            LoadingWave.end();
        }
    };

    function toInt(num){
        return num;
        //return fix2(~~num);
    }

    function fix2(num){
        //num = num % 2 !== 0 ? num + 1 : num;
        return num;
    }

    LoadingWave.prototype.playAnimation = function(n){
        var per1 = fix2(Math.floor(n % 100 / 100 * 100));

        var per2 = fix2(Math.floor(n % 120 / 120 * 100));
        var per3 = fix2(Math.floor(n % 140 / 140 * 100));

        this.wave1.style.backgroundPosition = (per1) + "px bottom";
        this.wave2.style.backgroundPosition = (per2) + "px bottom";
        this.wave3.style.backgroundPosition = (per3) + "px bottom";
    };

    LoadingWave.paused = true;

    LoadingWave.start = function(type){
        if(!LoadingWave.paused){
            return loading;
        }

        type = type || LoadingWave.RANDOM_LOADING;

        //TODO
        if(maskContainer && maskContainer.parentNode){
            maskContainer.parentNode.removeChild(maskContainer);
            removeClass(clipContainer,"slideOutFade_loading");
        }

        LoadingWave.paused = false;
        if(!loading){
            loading = new LoadingWave();
            maskContainer = document.createElement("div");
            clipContainer = document.createElement("div");
            clipButton = document.createElement("div");

            var meDiv = document.createElement("div");
            meDiv.className = "loading-wave-me-make";
            meDiv.innerHTML = "使用ME制作";

            clipContainer.className = "container-clip-mask";
            maskContainer.className = "loading-wave-mask";
            clipButton.className = "container-clip-button";
            maskContainer.appendChild(clipButton);
            maskContainer.appendChild(clipContainer);
            maskContainer.appendChild(loading.dom);
            maskContainer.appendChild(meDiv);
        }
        if(!maskContainer.parentNode){
            document.body.appendChild(maskContainer);
        }
        clipContainer.style.height = "100%";
        clipContainer.style.top = "0px";

        loading.type = type;

        loading.begin();
        return loading;
    };

    LoadingWave.setBackFunction = function(height, fn){
        loading.backCallback = fn;
        if(fn){
            clipContainer.style.top = height + "px";
            clipContainer.style.height = "-webkit-calc(100% - "+height+"px)";
            clipContainer.style.height = "calc(100% - "+height+"px)";
            clipButton.onclick = function(e){
                if(LoadingWave.paused){
                    return;
                }
                if(maskContainer.parentNode){
                    maskContainer.parentNode.removeChild(maskContainer);
                }
                LoadingWave.paused = true;
                if(loading._timer){
                    cancelAnimationFrame(loading._timer);
                    loading._timer = null;
                }
                loading.showPercent = false;
                removeClass(clipContainer,"slideOutFade_loading");
                clipButton.onclick = null;
                fn(e);
            };
        }else{
            clipContainer.style.top = "0px";
        }
    };

    LoadingWave.end = function(cb){
        if(LoadingWave.paused){
            return;
        }

        LoadingWave.paused = true;
        if(loading){

            loading.end(function(){
                if(loading._timer){
                    cancelAnimationFrame(loading._timer);
                    loading._timer = null;
                }
//                loading.showPercent = false;
                if(maskContainer.parentNode){
                    maskContainer.parentNode.removeChild(maskContainer);
                }
                removeClass(clipContainer,"slideOutFade_loading");
                clipButton.onclick = null;
                if(cb){
                    cb();
                }
            });
        }
    };

    LoadingWave.setProgress = function(val){
        if(loading){
            loading.setProgress(val);
        }
    };

    LoadingWave.getDom = function(){
        var dom = document.createElement("div");
        dom.className = "loading-wave-size loading-wave-container";
        dom.innerHTML = tpl;
        return dom;
    };

    var cssArr = [];
    //var img_ffffff = "data:image/png;base64,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";
    var img_ffffff = "data:image/png;base64,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";
    var img_mask = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABgCAYAAACZvLX0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjBDNDZFNzM5MUQwMTFFNTgxQTJENzZERUM1OUNDNDMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjBDNDZFNzQ5MUQwMTFFNTgxQTJENzZERUM1OUNDNDMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMEM0NkU3MTkxRDAxMUU1ODFBMkQ3NkRFQzU5Q0M0MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCMEM0NkU3MjkxRDAxMUU1ODFBMkQ3NkRFQzU5Q0M0MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi3bb/4AAAVVSURBVHja7J1PaBxlGMZ3dpPNTtZs0ojxECkWUvBi6sVLvcQI9Sa5RBEU60GPQk/Rk9CLESk9eBA92Z4kKFTtxSBVpPRSaKHSIm39k1pasSabbZrMJpOd+DzpbtgOs23+zGS/mXleeJlN2P3me3/77ft98+3s81pra2sZU8227VHXdcfw8CD6ud/zvBL/n81m71qWdQ0Pz3V2dp5yHOeMqTFYJgIuFAqHAPZj9G0P3MO/9sEr8F7fU28D9Aq8DNAT1Wp12rhgCNgU7+npeQawfoHfYNe26DW87irbMCkmIzoxODj4eC6X+xwf/cVtgH3A0cYS2vqUbaYe8Pj4eB4f7SMYeXcB59ZO4TYcgH8E6Fm2zXOkEnBXV9crAHsbQJywwPod7V8H6Os8V2oAF4vFAwj6MgBUowIbAHoOo/pnnjuxgAcGBp5EoF8jYHe3wPp8Fm/sAkB/wb4kBvDIyEgBgU0C7nKbwPr9JtfRHR0d77NvsQaMSeYwwC4aAtbvf6JvM/l8/tXYAcaFwovo/O+Ggm32BU60SBtnu7u7nzcecH9//1Po7E/o+GoM4Db730gb8+j7ScZgHODh4eEictpxjAY3ZmD9q43L8Api+ZAxmQA4izz7JpdBcQbr8wri+Q0j+hZjY4xtAWzb9gvoxAV0aD5BcJudG0k3kDbOM9ZdA9zb27sPJ53Cyf9FJxYTCrfZ72AglRkzY48M8NDQUAm5abK+FzuTArD+/DxTXz9PkkVogKempnLIRe/iBLM40VzawAaAvslPL5i8QzY7Aoz17Eto7Ar8TtrBBoD+B/4rGW0ZcKlU2o8XT8MX0Ng9AW3p98CI6+dvyWxTgDH03+blLdwxJIhyDEZzGfm5QnYPBcxvFdq425WEtFHGJDgRCBjvwJeCFArkpXw+/9oGYH5TC7jHcFwRoNAgO409DdpbghK+I92eIOAOjN7nPM/LyMK1Wq32BvLxVzk8nqjf2CEL+aYe3pxk8RIQQ3mveIRm3PzqWyd8/yLNqgJwl7hEMIQta9mqJ2VZhHlCgAVYgGUCLMACLBNgARZgmQALsEyABViAZQIswAIsE2ABFmBhEGABlgmwAAuwTIAFWIBlAizAMgEWYAGWCbAAx902fvAiwBrBCQVMPUfP8x4TivCNbAn4EgA/KxzhGxUFszieF4oIUoNlXaNqTKavr+9p/F3L6BfyoToVUNbZ8if3IP1dXQdNcEKSaGzIGWyIelITLBNTzRwDR+/8hiBHQ/qEMiggL4WpEOA+ICnTLOBDQR88geJzFcHaFty5lqJIzbJeTNAGyXrFRgzpkbJeAcJ0EkraXAWaC5sWpvNLK6KB3V5dlGM0sc4/qkbHVsVBNQneTwfLSKNHdywO2kLedikTYfUWw8GuYn37Tajyti0Emk+nDDLz7NlIBZpbSIyzaN5ygsGuUpULefbldovk8yowaXLjXHYdaZtIfkCZh48MKqezowkMKfAzU8o8BBUq+T6O62fWAEHffzCyUInfWbZmfbM5m/0r5PVxVHn2SixK7fidhZg4ScAvmbi/US+2ejj25c5YWoy7TKaI7TMdsARb7Mud+Qv2sVgevwhEkLPtWnZxjkhUwb6gkpMsalqvf/THLoFdYZnLRJecDCqaiqCvRr2xw+pamAteT23ZX0D+IBNN5QOO2k9SW/bXv7+BkXYR7oWxIQM/rcLVAY7Vxii/kd3m/obL15pWet1qlCIwyQqFwiHXdY/jYcnzvCKOe1rc3HERh704/of17HvVanXauBtQTATcMNu2RwF6DJDH8OcT6Guhfs8XS65xJ+8cwJ5yHOeMqTH8L8AAuUvnMqNkUAcAAAAASUVORK5CYII=";
    var img_logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAABgCAYAAACHdYVHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4Njk4NjUxNS05MzY0LWRiNDItOTc3ZC1kOWZmNzg0OTgxZTIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjdCNzI0RUI5MURCMTFFNUFDMzRDNEMzMTMzMDQyMjAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjdCNzI0RUE5MURCMTFFNUFDMzRDNEMzMTMzMDQyMjAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODY5ODY1MTUtOTM2NC1kYjQyLTk3N2QtZDlmZjc4NDk4MWUyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg2OTg2NTE1LTkzNjQtZGI0Mi05NzdkLWQ5ZmY3ODQ5ODFlMiIv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";
    //波浪动画
    //cssArr.push(
    //    "@-webkit-keyframes  loading-wave-animation {" +
    //    "0% {" +
    //    "    background-position: 0px bottom;" +
    //    "}" +
    //    "100% {" +
    //    "    background-position: 100px bottom;" +
    //    "}" +
    //    "}"
    //);
    //
    ////loading动画
    //cssArr.push(
    //    "@-webkit-keyframes  loading-loading-animation {" +
    //    "0% {" +
    //    "background-size: 100px 0px;" +
    //    "}" +
    //    "100% {" +
    //    "background-size: 100px 150px;" +
    //    "}" +
    //    "}"
    //);

    cssArr.push(
        ".loading-wave { " +
        "background-image: url('" + img_ffffff + "');" +
            //"-webkit-animation: loading-wave-animation 1.6s infinite linear;" +
            "background-size: 100px 0px;" +
            "background-repeat: repeat-x;" +
            "-webkit-mask-image: url('" + img_mask + "');" +
            "opacity: 1;" +
        "}"
    );

    cssArr.push(
        ".loading-wave2 { "+
        "background-image: url('" + img_ffffff + "'); " +
            //"-webkit-animation: loading-wave-animation 1.8s infinite linear; " +
            "background-size: 100px 0px; " +
            "background-repeat: repeat-x; " +
            "-webkit-mask-image: url('" + img_mask + "'); " +
            "opacity: 0.6; " +
        "}"
    );

    cssArr.push(
        ".loading-wave3 { " +
        "background-image: url('" + img_ffffff + "'); " +
            //"-webkit-animation: loading-wave-animation 1.9s infinite linear; " +
            "background-size: 100px 0px; " +
            "background-repeat: repeat-x; " +
            "-webkit-mask-image: url('" + img_mask + "'); " +
            "opacity: 0.6; " +
        "}"
    );

    cssArr.push(
        ".loading-wave-container > div{ " +
        "position: absolute; " +
        "}"
    );

    cssArr.push(".loading-wave-container{" +
        "top:50%;left:50%;transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);position:absolute" +
        "}");

    cssArr.push(
        ".loading-wave-size{ " +
        "width: 88px;height: 96px; " +
        "}"
    );

    cssArr.push(
        ".loading-wave-melogo{ " +
        "background-image: url('" + img_logo + "'); " +
        "position: relative; " +
            //"background-color:#ffffff;"+
        "}"
    );

    cssArr.push(
        ".loading-wave-mask{ " +

        "position: absolute; " +
        "top:0;left:0;z-index:9999;width:100%;height:100%" +
        "}"
    );

    cssArr.push(
        ".container-clip-mask{ " +
        "background:#000;" +
        "opacity:0.7;position:absolute;width:100%;height:100%;" +
        "}"
    );

    cssArr.push(
        ".container-clip-button{ " +
        "position:absolute;" +
            //"background:#000;" +
        "width:200px;height:88px" +
        "}"
    );

    cssArr.push(
        ".slideOutFade_loading { " +
        "-webkit-animation-name: slideOutFade_loading; " +
        "animation-name: slideOutFade_loading; " +
        "-webkit-animation-duration: 0.5s; " +
        "animation-duration: 0.5s; " +
        "-webkit-animation-fill-mode: both; " +
        "animation-fill-mode: both; } " +
        "@-webkit-keyframes slideOutFade_loading { " +
        "0% { " +
        "opacity: 0.7; } " +
        "100% { " +
        "opacity: 0; } }"
    );

    cssArr.push(
        ".me-wave-fade-in { " +
        "-webkit-animation-name: me-wave-fade-in; " +
        "animation-name: me-wave-fade-in; " +
        "-webkit-animation-duration: 0.3s; " +
        "animation-duration: 0.3s; " +
        "-webkit-animation-fill-mode: forwards; " +
        "animation-fill-mode: forwards; } " +
        "@-webkit-keyframes me-wave-fade-in { " +
        "0% { " +
        "opacity: 0; } " +
            //"50%{opacity:0;}"+
        "100% { " +
        "opacity: 1; } }"
    );

    cssArr.push(
        ".me-wave-fade-out { " +
        "-webkit-animation-name: me-wave-fade-out; " +
        "animation-name: me-wave-fade-out; " +
        "-webkit-animation-duration: 0.3s; " +
        "animation-duration: 0.3s; " +
        "-webkit-animation-fill-mode: forwards; " +
        "animation-fill-mode: forwards; } " +
        "@-webkit-keyframes me-wave-fade-out { " +
        "0% { " +
        "opacity: 1; } " +
        "100% { " +
        "opacity: 0; } }"
    );

    cssArr.push(
        ".loading-wave-me-make{" +
        "position:absolute;bottom:16px;" +
        "font-size:26px;color:#ffffff;opacity:0.4;width:100%;text-align:center;" +
        "}"
    );

    cssArr.push(".loading-wave-me-container > div{" +
            "position:absolute" +
        "}");

    if(!document.getElementById("style-loading-wave-animation")) {
        var styleNode = document.createElement("style");
        styleNode.type = "text/css";
        styleNode.id = "style-loading-wave-animation";
        styleNode.innerHTML = cssArr.join("");
        document.head.appendChild(styleNode);
    }

    window.LoadingWave = LoadingWave;
})();