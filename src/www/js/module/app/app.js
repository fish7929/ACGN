// 文件名称: app
// 描    述: app应用程序启动类
define([
    'marionette',
    'common/region/trans_page_region'
],function(mn, TransRegion){
    var app = new mn.Application();

    var regions = {
        page : {el : "#pageContent", regionClass : TransRegion}
    };

    app.navigate = function(url,obj){
        if(url == ""){
            app.router.navigate(url,obj);
        }else{
            url = url.indexOf("#") == 0 ? url : "#"+url;
            window.open(url);
        }
    };

    app.goBack = function(option){
        app.router.goBack(option);
    };

    app.addRegions(regions);

    return window.app = app;
});