// 文件名称: bookModel
//
// 创 建 人: zhao
// 创建日期: 2016/7/6 21:30
// 描    述: 同人本子数据对象
define([

],function() {
    var BookModel = function(){
    };

    /**
     * 根据bookId 查询本子详细信息
     */
    BookModel.prototype.getBookById = function(book_id, cb_ok, cb_err){
        var opt = {};
        opt.book_id = book_id;
        gili_data.getBookById(opt, function(data){
            if(data && data.length){
                data = utils.convert_2_json(data);
            }else{
                data = [];
            }
            cb_ok(data);
        }, cb_err);
    };

    /**
     * 查询最热的本子列表 最多5个
     * @param cb_ok
     * @param cb_err
     */
    BookModel.prototype.queryHotBooks = function(cb_ok, cb_err){
        var opt = {};
        opt.skip = 0;
        opt.limit = 5;
        gili_data.getBooks(opt, function(data){
            if(data && data.length){
                data = utils.convert_2_json(data);
            }else{
                data = [];
            }
            cb_ok(data);
        }, cb_err);
    };

    /**
     * 查询除指定之外的随机本子
     * @param bookId
     * @param cb_ok
     * @param cb_err
     */
    BookModel.prototype.queryRandomBooks = function(bookId, num, cb_ok, cb_err){
        var opt = {};
        opt.limit = num;
        opt.book_id = bookId;
        gili_data.getRandomBooks(opt, function(data){
            data = utils.convert_2_json(data);
            cb_ok(data);
        }, cb_err)
    };

    var bookModel = new BookModel();
    return bookModel;
});