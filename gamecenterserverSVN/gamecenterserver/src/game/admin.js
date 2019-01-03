"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var app_1 = require("../app");
var gameapi = require("./gameapi");
var app = require("../app");
var qs = require('querystring');
var ws = require("nodejs-websocket");
var gamecenter = require("./gamecenter");
var fs = require("fs");
var e2j = require("xls-to-json");
var os = require("os");
exports.isbusy = false; //服务器忙，此时对于耗时的查询命令会直接返回忙
var ADMINREQBASE = (function () {
    function ADMINREQBASE() {
    }
    return ADMINREQBASE;
}());
//账号权限
var ADMINPRIORITY = (function () {
    function ADMINPRIORITY() {
    }
    return ADMINPRIORITY;
}());
function CheckUser(data, cb) {
    gameapi.conn.query("select id,appname from t_adminuser where loginid=? and pwd=?", [data.loginid, data.pwd], function (err, rows, fields) {
        if (err) {
            cb(err, null);
            return;
        }
        if (rows.length == 0) {
            cb(new Error("用户名或密码错误！"), null);
            return;
        }
        cb(null, { appname: rows[0]["appname"] });
    });
}
function CheckCPUser(data, cb) {
    gameapi.conn.query("select cpid from t_cpuser where loginid=? and pwd=?", [data.loginid, data.pwd], function (err, rows, fields) {
        if (err) {
            cb(err);
            return;
        }
        if (rows.length == 0) {
            cb(new Error("用户名或密码错误！"));
            return;
        }
        cb(null);
    });
}
function CheckSPUser(data, cb) {
    gameapi.conn.query("select spid from t_spuser where loginid=? and pwd=?", [data.loginid, data.pwd], function (err, rows, fields) {
        if (err) {
            cb(err);
            return;
        }
        if (rows.length == 0) {
            cb(new Error("用户名或密码错误！"));
            return;
        }
        cb(null);
    });
}
//传输数据表
var DATATABLE = (function () {
    function DATATABLE() {
    }
    return DATATABLE;
}());
function RowToDatatable(rows, fields) {
    var dat = new DATATABLE();
    dat.fields = [];
    for (var i = 0; i < fields.length; i++) {
        dat.fields[i] = fields[i].name;
    }
    dat.rows = [];
    for (var i = 0; i < rows.length; i++) {
        dat.rows[i] = rows[i];
        for (var j = 0; j < dat.fields.length; j++) {
            if (fields[j].type == 10) {
                dat.rows[i][dat.fields[j]] = rows[i][dat.fields[j]].getTime();
            }
        }
    }
    return dat;
}
exports.RowToDatatable = RowToDatatable;
function InitApi() {
    //登录
    app.AddSdkApi("adminlogin", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("select nickname 昵称 from t_adminuser where loginid=? and pwd=?", [para.loginid, para.pwd], function (err, rows, fields) {
                req.send({ data: rows[0]['昵称'] });
            });
        });
    });
    app.AddSdkApi("cplogin", function (req) {
        var para = req.param;
        CheckCPUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            req.send({});
        });
    });
    app.AddSdkApi("splogin", function (req) {
        var para = req.param;
        CheckSPUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            req.send({});
        });
    });
    //PK游戏列表
    var ADMINGETPKAPPLISTREQ = (function (_super) {
        __extends(ADMINGETPKAPPLISTREQ, _super);
        function ADMINGETPKAPPLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETPKAPPLISTREQ;
    }(ADMINREQBASE));
    var PKAPPINFO = (function (_super) {
        __extends(PKAPPINFO, _super);
        function PKAPPINFO() {
            _super.apply(this, arguments);
        }
        return PKAPPINFO;
    }(gamecenter.PKAPPINFO));
    var ADMINGETPKAPPLISTRESP = (function () {
        function ADMINGETPKAPPLISTRESP() {
        }
        return ADMINGETPKAPPLISTRESP;
    }());
    app.AddSdkApi("admingetpkapplist", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gamecenter.GetPkGameList(function (err, applist) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var ret = new ADMINGETPKAPPLISTRESP();
                ret.applist = applist;
                req.send(ret);
            });
        });
    });
    //修改PK游戏信息
    var ADMINSAVEPKAPPINFOREQ = (function (_super) {
        __extends(ADMINSAVEPKAPPINFOREQ, _super);
        function ADMINSAVEPKAPPINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVEPKAPPINFOREQ;
    }(ADMINREQBASE));
    var ADMINSAVEPKAPPINFORESP = (function () {
        function ADMINSAVEPKAPPINFORESP() {
        }
        return ADMINSAVEPKAPPINFORESP;
    }());
    app.AddSdkApi("adminsavepkappinfo", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (!para.id) {
                gameapi.conn.query("insert into t_gspkgame (name,url,detail,playcount,entrancegold,wingold,enablerobot,robotdelay,robotstartwait,robotscorespeed,robotplaytimemax,robotplaytimemin,robotwinrate,robotscoreinterval) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [para.name, para.url, para.detail, para.playcount, para.entrancegold, para.wingold, para.enablerobot, para.robotdelay, para.robotstartwait, para.robotscorespeed, para.robotplaytimemax, para.robotplaytimemin, para.robotwinrate, para.robotscoreinterval], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    var id = rows.insertId;
                    savefile();
                });
            }
            else {
                gameapi.conn.query("update t_gspkgame set name=?,url=?,detail=?,playcount=?,entrancegold=?,wingold=?,enablerobot=?,robotdelay=?,robotstartwait=?,robotscorespeed=?,robotplaytimemax=?,robotplaytimemin=?,robotwinrate=?,robotscoreinterval=? where id=?", [para.name, para.url, para.detail, para.playcount, para.entrancegold, para.wingold, para.enablerobot, para.robotdelay, para.robotstartwait, para.robotscorespeed, para.robotplaytimemax, para.robotplaytimemin, para.robotwinrate, para.robotscoreinterval, para.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    if (rows.affectedRows == 0) {
                        req.send(null, 1, "游戏不存在！");
                        return;
                    }
                    savefile();
                });
            }
        });
        function savefile() {
            var destico = app_1.GetAbsPath("../public/gamecenter/pkgame/ico/" + para.id + ".png");
            var destbg = app_1.GetAbsPath("../public/gamecenter/pkgame/bg/" + para.id + ".jpg");
            var havefile = false;
            if (req.files) {
                for (var i in req.files) {
                    havefile = true;
                    var src = req.files[i][0].path;
                    var dest;
                    if (i == "ico")
                        dest = destico;
                    else if (i == "bg")
                        dest = destbg;
                    gameapi.MoveFile(src, dest, function () {
                    });
                }
            }
            req.send({});
        }
    });
    //删除PK游戏
    var ADMINDELPKAPPREQ = (function (_super) {
        __extends(ADMINDELPKAPPREQ, _super);
        function ADMINDELPKAPPREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDELPKAPPREQ;
    }(ADMINREQBASE));
    var ADMINDELPKAPPRESP = (function () {
        function ADMINDELPKAPPRESP() {
        }
        return ADMINDELPKAPPRESP;
    }());
    app.AddSdkApi("admindelpkapp", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("update t_gspkgame set del=1 where id=? and del=0", [para.id], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                if (rows.affectedRows == 0) {
                    req.send(null, 1, "删除失败，游戏不存在或已删除！");
                    return;
                }
                req.send({});
            });
        });
    });
    //H5游戏列表
    var ADMINGETH5APPLISTREQ = (function (_super) {
        __extends(ADMINGETH5APPLISTREQ, _super);
        function ADMINGETH5APPLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETH5APPLISTREQ;
    }(ADMINREQBASE));
    var H5APPINFO = (function (_super) {
        __extends(H5APPINFO, _super);
        function H5APPINFO() {
            _super.apply(this, arguments);
        }
        return H5APPINFO;
    }(gamecenter.H5APPINFO));
    var ADMINGETH5APPLISTRESP = (function () {
        function ADMINGETH5APPLISTRESP() {
        }
        return ADMINGETH5APPLISTRESP;
    }());
    app.AddSdkApi("admingeth5applist", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gamecenter.GetH5AppList(function (err, applist) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var ret = new ADMINGETH5APPLISTRESP();
                ret.applist = applist;
                req.send(ret);
            });
        });
    });
    //修改H5游戏信息
    var ADMINSAVEH5APPINFOREQ = (function (_super) {
        __extends(ADMINSAVEH5APPINFOREQ, _super);
        function ADMINSAVEH5APPINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVEH5APPINFOREQ;
    }(ADMINREQBASE));
    var ADMINSAVEH5APPINFORESP = (function () {
        function ADMINSAVEH5APPINFORESP() {
        }
        return ADMINSAVEH5APPINFORESP;
    }());
    app.AddSdkApi("adminsaveh5appinfo", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (!para.id) {
                gameapi.conn.query("insert into t_gsh5game(name,url,detail,playcount,getgold,orderby,remark,ishot,isrec) values (?,?,?,?,?,?,?,?,?)", [para.name, para.url, para.detail, para.playcount, para.getgold, para.orderby, para.remark, para.ishot, para.isrec], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    var id = rows.insertId;
                    SaveFile("../public/gamecenter/h5game/ico/" + id + ".png", req);
                });
            }
            else {
                gameapi.conn.query("update t_gsh5game set name=?,url=?,detail=?,playcount=?,getgold=?,orderby=?,remark=?,ishot=?,isrec=? where id=?", [para.name, para.url, para.detail, para.playcount, para.getgold, para.orderby, para.remark, para.ishot, para.isrec, para.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    if (rows.affectedRows == 0) {
                        req.send(null, 1, "游戏不存在！");
                        return;
                    }
                    SaveFile("../public/gamecenter/h5game/ico/" + para.id + ".png", req);
                });
            }
        });
    });
    //删除H5游戏
    var ADMINDELH5APPREQ = (function (_super) {
        __extends(ADMINDELH5APPREQ, _super);
        function ADMINDELH5APPREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDELH5APPREQ;
    }(ADMINREQBASE));
    var ADMINDELH5APPRESP = (function () {
        function ADMINDELH5APPRESP() {
        }
        return ADMINDELH5APPRESP;
    }());
    app.AddSdkApi("admindelh5app", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("update t_gsh5game set del=1 where id=? and del=0", [para.id], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                if (rows.affectedRows == 0) {
                    req.send(null, 1, "删除失败，游戏不存在或已删除！");
                    return;
                }
                req.send({});
            });
        });
    });
    //取得商品列表
    var ADMINGETSHOPGOODSLISTREQ = (function (_super) {
        __extends(ADMINGETSHOPGOODSLISTREQ, _super);
        function ADMINGETSHOPGOODSLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETSHOPGOODSLISTREQ;
    }(ADMINREQBASE));
    var ADMINGETSHOPGOODSLISTRESP = (function () {
        function ADMINGETSHOPGOODSLISTRESP() {
        }
        return ADMINGETSHOPGOODSLISTRESP;
    }());
    app.AddSdkApi("admingetshopgoodslist", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gamecenter.GetShopGoodsList(null, function (err, goods) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var ret = new ADMINGETSHOPGOODSLISTRESP();
                ret.goodslist = goods;
                req.send(ret);
            });
        });
    });
    //保存商品设置
    var ADMINSAVEGOODSINFOREQ = (function (_super) {
        __extends(ADMINSAVEGOODSINFOREQ, _super);
        function ADMINSAVEGOODSINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVEGOODSINFOREQ;
    }(ADMINREQBASE));
    var ADMINSAVEGOODSINFORESP = (function () {
        function ADMINSAVEGOODSINFORESP() {
        }
        return ADMINSAVEGOODSINFORESP;
    }());
    app.AddSdkApi("adminsavegoodsinfo", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (!!para.id) {
                gameapi.conn.query("update t_gsshop set name=?,price=?,rmbprice=?,stock=?,detail=?,notice=? where id=?", [para.name, para.price, para.rmbprice, para.stock, para.detail, para.notice, para.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    if (rows.affectedRows == 0) {
                        req.send(null, 1, "保存失败，商品不存在！");
                        return;
                    }
                    SetIco(para.id);
                });
            }
            else {
                gameapi.conn.query("insert into t_gsshop (name,price,rmbprice,stock,detail,notice) values(?,?,?,?,?,?)", [para.name, para.price, para.rmbprice, para.stock, para.detail, para.notice], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    var id = rows.insertId;
                    SetIco(id);
                });
            }
            function SetIco(id) {
                var dest;
                var filecount = 0;
                var finishcount = 0;
                if (req.files) {
                    for (var i in req.files) {
                        filecount++;
                    }
                    for (var i in req.files) {
                        var src = req.files[i][0].path;
                        var fieldName = req.files[i][0].fieldName;
                        if (fieldName == "icofile") {
                            dest = app_1.GetAbsPath("../public/gamecenter/shop/ico/" + id + ".png");
                        }
                        else if (fieldName == "imgfile") {
                            dest = app_1.GetAbsPath("../public/gamecenter/shop/img/" + id + ".jpg");
                        }
                        else
                            continue;
                        gameapi.MoveFile(src, dest, function () {
                            finishcount++;
                            if (filecount == finishcount) {
                                req.send({});
                            }
                        });
                    }
                }
                else
                    req.send({});
            }
        });
    });
    //删除商品
    var ADMINDELGOODSREQ = (function (_super) {
        __extends(ADMINDELGOODSREQ, _super);
        function ADMINDELGOODSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDELGOODSREQ;
    }(ADMINREQBASE));
    var ADMINDELGOODSRESP = (function () {
        function ADMINDELGOODSRESP() {
        }
        return ADMINDELGOODSRESP;
    }());
    app.AddSdkApi("admindelgoods", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("update t_gsshop set del=1 where id=? and del=0", [para.id], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                if (rows.affectedRows == 0) {
                    req.send(null, 1, "删除失败，商品不存在或已删除！");
                    return;
                }
                req.send({});
            });
        });
    });
    //读取每周兑换商品
    var ADMINGETWEEKLYGOODSLISTREQ = (function (_super) {
        __extends(ADMINGETWEEKLYGOODSLISTREQ, _super);
        function ADMINGETWEEKLYGOODSLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETWEEKLYGOODSLISTREQ;
    }(ADMINREQBASE));
    var WEEKLYGOODINFO = (function () {
        function WEEKLYGOODINFO() {
        }
        return WEEKLYGOODINFO;
    }());
    var ADMINGETWEEKLYGOODSLISTRESP = (function () {
        function ADMINGETWEEKLYGOODSLISTRESP() {
        }
        return ADMINGETWEEKLYGOODSLISTRESP;
    }());
    app.AddSdkApi("admingetweeklygoodslist", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("select a.id,a.goodsid,a.timestart,a.timeend,\n" +
                "b.name,b.price,b.rmbprice,b.stock\n" +
                "from t_gsweeklygoods a\n" +
                "left join t_gsshop b on a.goodsid=b.id\n" +
                "where a.del=0 order by a.timestart desc", [], function (err, rows, fields) {
                if (err) {
                    throw (err);
                }
                var ret = new ADMINGETWEEKLYGOODSLISTRESP();
                ret.data = [];
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var wg = new WEEKLYGOODINFO;
                    wg.id = row["id"];
                    wg.goodsid = row["goodsid"];
                    wg.timestart = row["timestart"].getTime();
                    wg.timeend = row["timeend"].getTime();
                    wg.name = row["name"];
                    wg.price = row["price"];
                    wg.rmbprice = row["rmbprice"];
                    wg.stock = row["stock"];
                    wg.img = gameapi.GetServerUrl("gamecenter/shop/weekly/" + wg.id + ".jpg");
                    ret.data.push(wg);
                }
                req.send(ret);
            });
        });
    });
    //添加、保存每周兑换商品
    var ADMINSAVEWEEKLYGOODSINFOREQ = (function (_super) {
        __extends(ADMINSAVEWEEKLYGOODSINFOREQ, _super);
        function ADMINSAVEWEEKLYGOODSINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVEWEEKLYGOODSINFOREQ;
    }(ADMINREQBASE));
    var ADMINSAVEWEEKLYGOODSINFORESP = (function () {
        function ADMINSAVEWEEKLYGOODSINFORESP() {
        }
        return ADMINSAVEWEEKLYGOODSINFORESP;
    }());
    app.AddSdkApi("adminsaveweeklygoodsinfo", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("select id from t_gsshop where id=? and del=0", [para.goodsid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                if (rows.length == 0) {
                    req.send(null, 1, "要添加的商品不存在或已删除！");
                    return;
                }
                if (!!para.id) {
                    gameapi.conn.query("update t_gsweeklygoods set goodsid=?,timestart=?,timeend=? where id=?", [para.goodsid, para.timestart, para.timeend, para.id], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        if (rows.affectedRows == 0) {
                            req.send(null, 1, "每周兑换记录不存在!");
                            return;
                        }
                        gamecenter.CacheData.LoadWeeklyGoods();
                        SaveFile("../public/gamecenter/shop/weekly/" + para.id + ".jpg", req);
                    });
                }
                else {
                    gameapi.conn.query("insert into t_gsweeklygoods (goodsid,timestart,timeend) values (?,?,?)", [para.goodsid, new Date(para.timestart), new Date(para.timeend)], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        para.id = rows.insertId;
                        SaveFile("../public/gamecenter/shop/weekly/" + para.id + ".jpg", req);
                    });
                }
            });
        });
    });
    //删除每周兑换
    var ADMINDELWEEKLYGOODSREQ = (function (_super) {
        __extends(ADMINDELWEEKLYGOODSREQ, _super);
        function ADMINDELWEEKLYGOODSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDELWEEKLYGOODSREQ;
    }(ADMINREQBASE));
    var ADMINDELWEEKLYGOODSRESP = (function () {
        function ADMINDELWEEKLYGOODSRESP() {
        }
        return ADMINDELWEEKLYGOODSRESP;
    }());
    app.AddSdkApi("admindelweeklygoods", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("update t_gsweeklygoods set del=1 where id=?", [para.id], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                gamecenter.CacheData.RemoveWeeklyGoods(para.id);
                req.send({});
            });
        });
    });
    //取得商城广告列表
    var ADMINGETSHOPADLISTREQ = (function (_super) {
        __extends(ADMINGETSHOPADLISTREQ, _super);
        function ADMINGETSHOPADLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETSHOPADLISTREQ;
    }(ADMINREQBASE));
    var SHOPADINFO = (function () {
        function SHOPADINFO() {
        }
        return SHOPADINFO;
    }());
    var ADMINGETSHOPADLISTRESP = (function () {
        function ADMINGETSHOPADLISTRESP() {
        }
        return ADMINGETSHOPADLISTRESP;
    }());
    app.AddSdkApi("admingetshopadlist", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("select a.id,a.goodsid,b.name goodsname,b.price,b.rmbprice,b.stock from t_gsshopad a left join t_gsshop b on a.goodsid=b.id where a.del=0", [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var ret = new ADMINGETSHOPADLISTRESP();
                ret.data = [];
                for (var i = 0; i < rows.length; i++) {
                    var dat = rows[i];
                    dat.img = gameapi.GetServerUrl("gamecenter/shop/ad/" + dat.id + ".jpg");
                    ret.data.push(rows[i]);
                }
                req.send(ret);
            });
        });
    });
    //保存商城广告
    var ADMINSAVESHOPADREQ = (function (_super) {
        __extends(ADMINSAVESHOPADREQ, _super);
        function ADMINSAVESHOPADREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVESHOPADREQ;
    }(ADMINREQBASE));
    var ADMINSAVESHOPADRESP = (function () {
        function ADMINSAVESHOPADRESP() {
        }
        return ADMINSAVESHOPADRESP;
    }());
    app.AddSdkApi("adminsaveshopad", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("select id from t_gsshop where id=? and del=0", [para.goodsid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                if (rows.length == 0) {
                    req.send(null, 1, "商品不存在或已删除！");
                    return;
                }
                if (para.id) {
                    gameapi.conn.query("update t_gsshopad set goodsid=? where id=? and del=0", [para.goodsid, para.id], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        if (rows.affectedRows == 0) {
                            req.send(null, 1, "广告不存在或已删除！");
                            return;
                        }
                        var ad = new gamecenter.CacheData.SHOPAD();
                        ad.goodsid = para.goodsid;
                        ad.id = para.id;
                        ad.img = gameapi.GetServerUrl("gamecenter/shop/ad/" + ad.id + ".jpg");
                        gamecenter.CacheData.AddShopAD(ad);
                        SaveFile("../public/gamecenter/shop/ad/" + para.id + ".jpg", req);
                    });
                }
                else {
                    gameapi.conn.query("insert into t_gsshopad (goodsid) values(?)", [para.goodsid], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        var id = rows.insertId;
                        var ad = new gamecenter.CacheData.SHOPAD();
                        ad.goodsid = para.goodsid;
                        ad.id = para.id;
                        ad.img = gameapi.GetServerUrl("gamecenter/shop/ad/" + ad.id + ".jpg");
                        gamecenter.CacheData.AddShopAD(ad);
                        SaveFile("../public/gamecenter/shop/ad/" + id + ".jpg", req);
                    });
                }
            });
        });
    });
    //删除商城广告
    var ADMINDELSHOPADREQ = (function (_super) {
        __extends(ADMINDELSHOPADREQ, _super);
        function ADMINDELSHOPADREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDELSHOPADREQ;
    }(ADMINREQBASE));
    var ADMINDELSHOPADRESP = (function () {
        function ADMINDELSHOPADRESP() {
        }
        return ADMINDELSHOPADRESP;
    }());
    app.AddSdkApi("admindelshopad", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("update t_gsshopad set del=1 where id=?", [para.id], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                gamecenter.CacheData.RemoveShopAD(para.id);
                req.send({});
            });
        });
    });
    //精彩活动
    var ADMINGETACTIVITYLISTREQ = (function (_super) {
        __extends(ADMINGETACTIVITYLISTREQ, _super);
        function ADMINGETACTIVITYLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETACTIVITYLISTREQ;
    }(ADMINREQBASE));
    var ACTIVITYINFO = (function () {
        function ACTIVITYINFO() {
        }
        return ACTIVITYINFO;
    }());
    var ADMINGETACTIVITYLISTRESP = (function () {
        function ADMINGETACTIVITYLISTRESP() {
        }
        return ADMINGETACTIVITYLISTRESP;
    }());
    app.AddSdkApi("admingetactivitylist", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("select id,url,type,orderby from t_gsactivity where del=0 order by orderby desc", [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var ret = new ADMINGETACTIVITYLISTRESP();
                ret.data = [];
                for (var i = 0; i < rows.length; i++) {
                    var dat = rows[i];
                    dat.img = gameapi.GetServerUrl("gamecenter/activity/" + dat.id + ".jpg");
                    ret.data.push(dat);
                }
                req.send(ret);
            });
        });
    });
    //保存精彩活动
    var ADMINSAVEACTIVITYREQ = (function (_super) {
        __extends(ADMINSAVEACTIVITYREQ, _super);
        function ADMINSAVEACTIVITYREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVEACTIVITYREQ;
    }(ADMINREQBASE));
    var ADMINSAVEACTIVITYRESP = (function () {
        function ADMINSAVEACTIVITYRESP() {
        }
        return ADMINSAVEACTIVITYRESP;
    }());
    app.AddSdkApi("adminsaveactivity", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (para.id) {
                gameapi.conn.query("update t_gsactivity set type=?, url=?,orderby=? where id=?", [para.type, para.url, para.orderby, para.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    if (rows.affectedRows == 0) {
                        req.send(null, 1, "活动不存在！");
                        return;
                    }
                    SaveFile("../public/gamecenter/activity/" + para.id + ".jpg", req);
                    var ad = new gamecenter.CacheData.ACTIVITYAD();
                    ad.id = para.id;
                    ad.type = para.type;
                    ad.img = gameapi.GetServerUrl("gamecenter/activity/" + ad.id + ".jpg");
                    ad.url = para.url;
                    gamecenter.CacheData.AddActivityAd(ad);
                });
            }
            else {
                gameapi.conn.query("insert into t_gsactivity (url,type) values(?,?)", [para.url, para.type], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    var id = rows.insertId;
                    SaveFile("../public/gamecenter/activity/" + id + ".jpg", req);
                    var ad = new gamecenter.CacheData.ACTIVITYAD();
                    ad.id = id;
                    ad.type = para.type;
                    ad.img = gameapi.GetServerUrl("gamecenter/activity/" + ad.id + ".jpg");
                    ad.url = para.url;
                    gamecenter.CacheData.AddActivityAd(ad);
                });
            }
        });
    });
    //删除活动
    var ADMINDELACTIVITYREQ = (function (_super) {
        __extends(ADMINDELACTIVITYREQ, _super);
        function ADMINDELACTIVITYREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDELACTIVITYREQ;
    }(ADMINREQBASE));
    var ADMINDELACTIVITYRESP = (function () {
        function ADMINDELACTIVITYRESP() {
        }
        return ADMINDELACTIVITYRESP;
    }());
    app.AddSdkApi("admindelactivity", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("update t_gsactivity set del=1 where id=? and del=0", [para.id], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                if (rows.affectedRows == 0) {
                    req.send(null, 1, "活动不存在或已删除！");
                    return;
                }
                gamecenter.CacheData.RemoveActivityAd(para.id);
                req.send({});
            });
        });
    });
    //取得用户兑换记录
    var ADMINGETEXCHANGERECORDREQ = (function (_super) {
        __extends(ADMINGETEXCHANGERECORDREQ, _super);
        function ADMINGETEXCHANGERECORDREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETEXCHANGERECORDREQ;
    }(ADMINREQBASE));
    var ADMINGETEXCHANGERECORDRESP = (function () {
        function ADMINGETEXCHANGERECORDRESP() {
        }
        return ADMINGETEXCHANGERECORDRESP;
    }());
    app.AddSdkApi("admingetexchangerecord", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gamecenter.GetExchangeRecord(null, function (err, record) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw (err);
                }
                var ret = new ADMINGETEXCHANGERECORDRESP();
                ret.data = record;
                req.send(ret);
            });
        });
    });
    //修改兑换状态
    var ADMINSAVEEXCHANGERECORDREQ = (function (_super) {
        __extends(ADMINSAVEEXCHANGERECORDREQ, _super);
        function ADMINSAVEEXCHANGERECORDREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVEEXCHANGERECORDREQ;
    }(ADMINREQBASE));
    var ADMINSAVEEXCHANGERECORDRESP = (function () {
        function ADMINSAVEEXCHANGERECORDRESP() {
        }
        return ADMINSAVEEXCHANGERECORDRESP;
    }());
    app.AddSdkApi("adminsaveexchangerecord", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("update t_gsexchange set state=?,message=?,updatetime=now() where id=?", [para.state, para.message, para.id], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                req.send({});
            });
        });
    });
    //流量统计
    var ADMINGETFLOWSTATISTICSREQ = (function (_super) {
        __extends(ADMINGETFLOWSTATISTICSREQ, _super);
        function ADMINGETFLOWSTATISTICSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETFLOWSTATISTICSREQ;
    }(ADMINREQBASE));
    var FLOWSTATISTICSDATA = (function () {
        function FLOWSTATISTICSDATA() {
            this.opencount = 0; //数量
            this.regcount = 0; //注册用户
            this.payusercount = 0; //付费用户
            this.paymoney = 0; //付费金额
        }
        return FLOWSTATISTICSDATA;
    }());
    var ADMINGETFLOWSTATISTICSRESP = (function () {
        function ADMINGETFLOWSTATISTICSRESP() {
        }
        return ADMINGETFLOWSTATISTICSRESP;
    }());
    app.AddSdkApi("admingetflowstatistics", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var params = [];
            var ret = new ADMINGETFLOWSTATISTICSRESP();
            ret.data = [];
            var dict = {}; //dict[today+"_"+channel]=FLOWSTATISTICSDATA
            var sql = "select str_to_date(DATE_FORMAT(a.createtime,'%Y-%m-%d'),'%Y-%m-%d') today ,a.channel,count(1) opencount from t_gsuserurlpath a where\n";
            if (para.timestart != null) {
                var timestart = new Date(para.timestart);
                sql += "a.createtime>=?\n";
                params.push(timestart);
            }
            if (para.timestart != null && para.timeend != null) {
                var timeend = new Date(para.timeend);
                sql += "and a.createtime<=?\n";
                params.push(timeend);
            }
            else {
                var timeend = new Date(para.timeend);
                sql += "a.createtime<=?\n";
                params.push(timeend);
            }
            sql += "group by today,a.channel";
            //访问流量
            gameapi.conn.query(sql, params, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                for (var i = 0; i < rows.length; i++) {
                    var dat = new FLOWSTATISTICSDATA();
                    dat.today = rows[i]["today"].getTime();
                    dat.channel = rows[i]["channel"];
                    dat.opencount = rows[i]["opencount"];
                    var key = dat.today + "_" + (dat.channel == null ? "" : dat.channel);
                    var dat2 = dict[key];
                    if (dat2) {
                        dat2.opencount += dat.opencount;
                    }
                    else {
                        dict[key] = dat;
                    }
                }
                //注册用户
                gameapi.conn.query("select str_to_date(DATE_FORMAT(a.regtime,'%Y-%m-%d'),'%Y-%m-%d') today ,a.regchannel channel,count(1) regcount from t_gsuser a  where a.regtime>=? and a.regtime<=? group by today,a.regchannel ", [timestart, timeend], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    for (var i = 0; i < rows.length; i++) {
                        var dat = new FLOWSTATISTICSDATA();
                        dat.today = rows[i]["today"].getTime();
                        dat.channel = rows[i]["channel"];
                        dat.regcount = rows[i]["regcount"];
                        var key = dat.today + "_" + (dat.channel == null ? "" : dat.channel);
                        var dat2 = dict[key];
                        if (dat2) {
                            dat2.regcount += dat.regcount;
                        }
                        else {
                            dict[key] = dat;
                        }
                    }
                    //付费用户
                    gameapi.conn.query("select str_to_date(DATE_FORMAT(a.paytime,'%Y-%m-%d'),'%Y-%m-%d') today ,a.channel,sum(a.money) money,sum(a.payrmb) payrmb ,count(1) paycount,userid\n" +
                        " from t_gspay a where a.state=1 and a.paytime>=? and a.paytime<=? group by today,a.userid,a.channel", [timestart, timeend], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        for (var i = 0; i < rows.length; i++) {
                            var dat = new FLOWSTATISTICSDATA();
                            dat.today = rows[i]["today"].getTime();
                            dat.channel = rows[i]["channel"];
                            dat.paymoney = rows[i]["payrmb"];
                            dat.payusercount = rows[i]["paycount"];
                            var key = dat.today + "_" + (dat.channel == null ? "" : dat.channel);
                            var dat2 = dict[key];
                            if (dat2) {
                                dat2.paymoney += dat.paymoney;
                                dat2.payusercount += dat.payusercount;
                            }
                            else {
                                dict[key] = dat;
                            }
                        }
                        for (var j in dict) {
                            ret.data.push(dict[j]);
                        }
                        req.send(ret);
                    });
                });
            });
        });
    });
    //充值记录
    var ADMINGETRECHARGELISTREQ = (function (_super) {
        __extends(ADMINGETRECHARGELISTREQ, _super);
        function ADMINGETRECHARGELISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETRECHARGELISTREQ;
    }(ADMINREQBASE));
    var RECHARGEINFO = (function () {
        function RECHARGEINFO() {
        }
        return RECHARGEINFO;
    }());
    var ADMINGETRECHARGELISTRESP = (function () {
        function ADMINGETRECHARGELISTRESP() {
        }
        return ADMINGETRECHARGELISTRESP;
    }());
    app.AddSdkApi("admingetrechargelist", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var params = [];
            var sql = "select a.id,a.payid,a.userid,a.createtime,a.goodsname,a.money,a.payrmb,a.paytime,a.state,a.logid,a.paytype,a.channel,b.nickname,b.phone\n" +
                "from t_gspay a left join t_gsuser c on a.userid=c.userid\n" +
                "left join t_gameuser b on b.userid=c.sdkuserid\n" +
                "where a.state=1\n";
            if (para.timestart != null) {
                var timestart = new Date(para.timestart);
                sql += "and a.paytime>=?\n";
                params.push(timestart);
            }
            if (para.timeend != null) {
                var timeend = new Date(para.timeend);
                sql += "and a.paytime<=?\n";
                params.push(timeend);
            }
            gameapi.conn.query(sql, params, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var ret = new ADMINGETRECHARGELISTRESP();
                ret.data = [];
                for (var i = 0; i < rows.length; i++) {
                    var dat = rows[i];
                    dat.createtime = rows[i]["createtime"].getTime();
                    dat.paytime = rows[i]["paytime"].getTime();
                    ret.data.push(dat);
                }
                req.send(ret);
            });
        });
    });
    //------------CP相关信息管理----------------------
    //取得CP列表
    var CPINFO = (function () {
        function CPINFO() {
        }
        return CPINFO;
    }());
    var ADMINGETCPLISTREQ = (function (_super) {
        __extends(ADMINGETCPLISTREQ, _super);
        function ADMINGETCPLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCPLISTREQ;
    }(ADMINREQBASE));
    var ADMINGETCPLISTRESP = (function () {
        function ADMINGETCPLISTRESP() {
        }
        return ADMINGETCPLISTRESP;
    }());
    function GetCPList(cpid, loginid, cb) {
        var para = [];
        var sql = "select cpid,loginid,nickname,regtime,regip,lastlogintime,lastloginip from t_cpuser where del=0 ";
        if (!!cpid) {
            sql += "and cpid=?";
            para.push(cpid);
        }
        else if (!!loginid) {
            sql += "and loginid=?";
            para.push(loginid);
        }
        gameapi.conn.query(sql, para, function (err, rows, fields) {
            if (err) {
                cb(err, null);
                return;
            }
            var data = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                if (info.regtime)
                    info.regtime = rows[i]["regtime"].getTime();
                if (info.lastlogintime)
                    info.lastlogintime = rows[i]["lastlogintime"].getTime();
                data.push(info);
            }
            cb(null, data);
        });
    }
    app.AddSdkApi("admingetcplist", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            GetCPList(para.cpid, para.cploginid, function (err, data) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var ret = new ADMINGETCPLISTRESP();
                ret.data = data;
                req.send(ret);
            });
        });
    });
    //CP游戏列表
    var ADMINGETCPAPPLISTREQ = (function (_super) {
        __extends(ADMINGETCPAPPLISTREQ, _super);
        function ADMINGETCPAPPLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCPAPPLISTREQ;
    }(ADMINREQBASE));
    var CPAPPINFO = (function (_super) {
        __extends(CPAPPINFO, _super);
        function CPAPPINFO() {
            _super.apply(this, arguments);
        }
        return CPAPPINFO;
    }(ADMINREQBASE));
    var ADMINGETCPAPPLISTRESP = (function () {
        function ADMINGETCPAPPLISTRESP() {
        }
        return ADMINGETCPAPPLISTRESP;
    }());
    var ADMINCPAPPINFOREQ = (function (_super) {
        __extends(ADMINCPAPPINFOREQ, _super);
        function ADMINCPAPPINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINCPAPPINFOREQ;
    }(CPAPPINFO));
    var ADMINAPPINFO = (function (_super) {
        __extends(ADMINAPPINFO, _super);
        function ADMINAPPINFO() {
            _super.apply(this, arguments);
        }
        return ADMINAPPINFO;
    }(CPAPPINFO));
    var ADMINAPPINFOREQ = (function (_super) {
        __extends(ADMINAPPINFOREQ, _super);
        function ADMINAPPINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINAPPINFOREQ;
    }(ADMINAPPINFO));
    var ADMINNOPASSREQ = (function (_super) {
        __extends(ADMINNOPASSREQ, _super);
        function ADMINNOPASSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINNOPASSREQ;
    }(ADMINREQBASE));
    var ADMINDELREQ = (function (_super) {
        __extends(ADMINDELREQ, _super);
        function ADMINDELREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDELREQ;
    }(ADMINREQBASE));
    var ADMINDOWNREQ = (function (_super) {
        __extends(ADMINDOWNREQ, _super);
        function ADMINDOWNREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDOWNREQ;
    }(ADMINREQBASE));
    var ADMINGETCHECKAPPINFOREQ = (function (_super) {
        __extends(ADMINGETCHECKAPPINFOREQ, _super);
        function ADMINGETCHECKAPPINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHECKAPPINFOREQ;
    }(ADMINREQBASE));
    var SINGLEGAMEDETAILDATA = (function () {
        function SINGLEGAMEDETAILDATA() {
        }
        return SINGLEGAMEDETAILDATA;
    }());
    var ADMINDATACALRESP = (function () {
        function ADMINDATACALRESP() {
        }
        return ADMINDATACALRESP;
    }());
    //取得CP游戏列表
    app.AddSdkApi("admingetcpappslist", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "select appid,a.cpid,a.introduction,a.profit,a.downreason,c.orderby,a.lable,a.status,c.orderby,nickname,appsecret,appname,ico,a.url,intro,enabled,addtime,uptime,posturl,testurl,mode,gametype,extraofmonth,xl_level,lc_level,ff_level,zh_level,starts,status,jsmode,percent,playcount,getgold,c.createtime,ishot,c.Id,(SELECT COUNT(gameid) FROM t_gsuserh5log WHERE gameid=c.Id AND DATE_FORMAT(createtime,'%Y-%m-%d')=DATE_FORMAT(NOW(),'%Y-%m-%d')) AS opencount,isrec " +
                "from t_cpapp as a left join t_cpuser as b on a.cpid=b.cpid left join t_gsh5game as c on a.appname = c.`name` and c.del=0 " +
                "where a.del=0 and a.enabled=1\n";
            var params = [];
            if (!!para.appname) {
                sql += "and appname like '%" + para.appname + "%'\n";
            }
            if (!!para.time) {
                sql += "AND DATE_FORMAT(a.uptime,'%Y-%m-%d')=?";
                params.push(para.time);
            }
            if (para.status == '已通过') {
                if (para.sort == 0) {
                    sql += "and a.status = ?  ORDER BY c.createtime DESC";
                    params.push(para.status);
                }
                else {
                    sql += "and a.status = ?  ORDER BY c.orderby DESC";
                    params.push(para.status);
                }
            }
            if (para.status == '' || para.status == null) {
                sql += "a.status=?";
                params.push(para.status);
            }
            if (para.status == '已下架') {
                sql += "and a.status = ?";
                params.push(para.status);
            }
            if (!!para.cpid) {
                sql += "and a.cpid=?\n";
                params.push(para.cpid);
            }
            if (!!para.mode) {
                sql += "and mode=?";
                params.push(para.mode);
            }
            gameapi.conn.query(sql, params, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var ret = [];
                for (var i = 0; i < rows.length; i++) {
                    var path = app.GetAbsPath("../public/management/ad/" + rows[i]['appid'] + ".jpg");
                    var adminappinfo = rows[i];
                    if (fs.existsSync(path)) {
                        adminappinfo.isad = "有";
                    }
                    else {
                        adminappinfo.isad = "无";
                    }
                    if (rows[i]["createtime"] == null) {
                        adminappinfo.createtime = "";
                    }
                    else {
                        adminappinfo.createtime = rows[i]["createtime"].getTime();
                    }
                    adminappinfo.adimg = gameapi.GetServerUrl("management/ad/" + rows[i]['appid'] + ".jpg");
                    adminappinfo.backimg = gameapi.GetServerUrl("management/back/" + rows[i]['appid'] + ".jpg");
                    adminappinfo.bannerimg = gameapi.GetServerUrl("management/smallbanner/" + rows[i]['appid'] + ".jpg");
                    adminappinfo.ico = gameapi.GetServerUrl("management/icon/" + rows[i]['ico']);
                    adminappinfo.addtime = rows[i]["addtime"].getTime();
                    adminappinfo.cpname = rows[i]["nickname"];
                    adminappinfo.opencount = rows[i]["opencount"];
                    adminappinfo.playcount = rows[i]["playcount"];
                    adminappinfo.getgold = rows[i]["getgold"];
                    ret.push(adminappinfo);
                }
                req.send(ret);
            });
        });
    });
    //取得CP游戏列表
    app.AddSdkApi("admingetcpappslist_old", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "select appid,a.cpid,nickname,appsecret,appname,ico,a.url,intro,enabled,addtime,posturl,testurl,mode,gametype,extraofmonth,xl_level,lc_level,ff_level,zh_level,starts,status,jsmode,percent,opencount,playcount,getgold,c.createtime,ishot,isrec " +
                "from t_cpapp as a left join t_cpuser as b on a.cpid=b.cpid left join t_gsh5game as c on a.appname = c.`name` and c.del=0 " +
                "where a.del=0 and a.enabled=1\n";
            var params = [];
            if (!!para.appname) {
                sql += "and appname like '%" + para.appname + "%'\n";
            }
            if (!!para.cpid) {
                sql += "and a.cpid=?\n";
                params.push(para.cpid);
            }
            if (!!para.mode) {
                sql += "and mode=?";
                params.push(para.mode);
            }
            sql += " order by c.createtime desc";
            gameapi.conn.query(sql, params, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var ret = [];
                for (var i = 0; i < rows.length; i++) {
                    var path = app.GetAbsPath("../public/management/ad/" + rows[i]['appid'] + ".jpg");
                    var adminappinfo = rows[i];
                    if (fs.existsSync(path)) {
                        adminappinfo.isad = "有";
                    }
                    else {
                        adminappinfo.isad = "无";
                    }
                    if (rows[i]["createtime"] == null) {
                        adminappinfo.createtime = "";
                    }
                    else {
                        adminappinfo.createtime = rows[i]["createtime"].getTime();
                    }
                    adminappinfo.adimg = gameapi.GetServerUrl("management/ad/" + rows[i]['appid'] + ".jpg");
                    adminappinfo.ico = gameapi.GetServerUrl("management/icon/" + rows[i]['ico']);
                    adminappinfo.addtime = rows[i]["addtime"].getTime();
                    adminappinfo.cpname = rows[i]["nickname"];
                    adminappinfo.opencount = rows[i]["opencount"];
                    adminappinfo.playcount = rows[i]["playcount"];
                    adminappinfo.getgold = rows[i]["getgold"];
                    ret.push(adminappinfo);
                }
                req.send(ret);
            });
        });
    });
    app.AddSdkApi("adminsavecpappinfo", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            if (!para.appid) {
                gameapi.conn.query("insert into t_cpapp(enabled,appsecret,appname,url,intro,cpid,uptime,posturl,mode,gametype,status,lable,profit,introduction)  " +
                    "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [1, para.appsecret, para.appname, para.url, para.intro, para.cpid, new Date(), para.posturl, para.mode, para.gametype, "未审核", para.lable, para.profit, para.introduction], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var gameid = rows.insertId;
                    gameapi.conn.query("update t_cpapp set ico=? where appid=?", [gameid + para.ico, gameid], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            return;
                        }
                        SaveFile4("../public/management/icon/" + gameid, "../public/management/ad/" + gameid, "../public/management/back/" + gameid, "../public/management/smallbanner/" + gameid, req, "../sdkserver/public/app/ico/" + para.appid + ".png");
                        req.send({ "appid": gameid }, 0, null);
                    });
                });
            }
            else {
                gameapi.conn.query("update t_cpapp " +
                    "set appname=?,url=?,ico=?,intro=?,star=?,uptime=?,posturl=?,testurl=?,mode=?,gametype=?,extraofmonth=?,xl_level=?,lc_level=?,ff_level=?,zh_level=?,starts=?,status=?,jsmode=?,percent=? ,profit=?  " +
                    "where appid=?", [para.appname, para.url, para.ico, para.intro, para.starts.length, new Date(), para.posturl, para.testurl, para.mode, para.gametype, para.extraofmonth, para.xl_level, para.lc_level, para.ff_level, para.zh_level, para.starts, "未审核", para.jsmode, para.percent, para.profit, para.appid], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    SaveFile4("../public/management/icon/" + para.appid, "../public/management/ad/" + para.appid, "../public/management/back/" + para.appid, "../public/management/smallbanner/" + para.appid, req, "../sdkserver/public/app/ico/" + para.appid + ".png");
                });
            }
        });
    });
    app.AddSdkApi("admingetchecklist", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var ret = [];
            if (para.appnames.length == 0) {
                req.send(null, 1, "请勾选需要通过的数据");
                return;
            }
            for (var i = 0; i < para.appnames.length; i++) {
                gameapi.conn.query("select appid,cpid,appsecret,appname,ico,url,intro,enabled,addtime,posturl,testurl,mode,gametype,extraofmonth,xl_level,lc_level,ff_level,zh_level,starts,status,jsmode,percent,introduction " +
                    "from t_cpapp where del=0 " +
                    "and appname=?", [para.appnames[i]], function (err, rows, fields) {
                    var path = app.GetAbsPath("../public/management/ad/" + rows[0]['appid'] + ".jpg");
                    var cpappinfo = rows[0];
                    if (fs.existsSync(path)) {
                        cpappinfo.isad = "有";
                    }
                    else {
                        cpappinfo.isad = "无";
                    }
                    cpappinfo.ico = gameapi.GetServerUrl("management/icon/" + rows[0]['ico']);
                    cpappinfo.addtime = rows[0]["addtime"].getTime();
                    ret.push(cpappinfo);
                    if (ret.length == para.appnames.length) {
                        req.send(ret);
                        return;
                    }
                    ;
                });
            }
        });
    });
    //多选通过审核
    app.AddSdkApi("adminpassall", function (req) {
        var params = req.param;
        for (var i = 0; i < params.length; i++) {
            var para = params[i];
            (function (para) {
                gameapi.conn.query("insert into t_gsh5game(name,url,detail,remark,introduction) " +
                    "select ?,?,?,?,? from DUAL " +
                    "where not exists(select name from t_gsh5game where name=? and del=0)", [para.appname, para.url, para.intro, para.gametype, para.introduction, para.appname], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                    }
                    var gameid = rows.insertId;
                    var path = "public" + para.ico.substr(para.ico.indexOf("/management/icon/"));
                    var dest = app.GetAbsPath("../public/gamecenter/h5game/ico/" + gameid + ".png");
                    gameapi.MoveFile(path, dest, function () {
                    });
                });
                gameapi.conn.query("update t_cpapp set status=? where appid=? and appname=?", ["已通过", para.appid, para.appname], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                });
            }).call(this, para);
        }
        req.send({});
    });
    //多选下架游戏
    app.AddSdkApi("admindownall", function (req) {
        var params = req.param;
        for (var i = 0; i < params.length; i++) {
            var para = params[i];
            (function (para) {
                gameapi.conn.query("delete from t_gsh5game  where  name=?  ", [para.appname], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                    }
                    var gameid = rows.insertId;
                    var path = "public" + para.ico.substr(para.ico.indexOf("/management/icon/"));
                    var dest = app.GetAbsPath("../public/gamecenter/h5game/ico/" + gameid + ".png");
                    gameapi.MoveFile(path, dest, function () {
                    });
                });
                gameapi.conn.query("update t_cpapp set status=?,downreason=? where appid=? and appname=?", ["已下架", para.downreason, para.appid, para.appname], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                });
            }).call(this, para);
        }
        req.send({});
    });
    //多选删除游戏
    app.AddSdkApi("admindelall", function (req) {
        var params = req.param;
        for (var i = 0; i < params.length; i++) {
            var para = params[i];
            (function (para) {
                gameapi.conn.query("update t_cpapp set del=? where appid=? and appname=?", ["1", para.appid, para.appname], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                });
            }).call(this, para);
        }
        req.send({});
    });
    app.AddSdkApi("adminpasscpappinfo", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("select Id from t_gsh5game where name=? and del=0", [para.appname], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                if (rows.length > 0) {
                    req.send(null, 1, "该数据已存在");
                    return;
                }
                gameapi.conn.query("insert into t_gsh5game(name,url,detail,remark) values (?,?,?,?)", [para.appname, para.url, para.intro, para.gametype], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var gameid = rows.insertId;
                    var path = "public" + para.ico.substring(para.ico.indexOf("/management"));
                    var dest = app.GetAbsPath("../public/gamecenter/h5game/ico/" + gameid + ".png");
                    gameapi.MoveFile(path, dest, function () {
                    });
                    gameapi.conn.query("update t_cpapp set status=? where appid=? and appname=?", ["已通过", para.appid, para.appname], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            return;
                        }
                        req.send({});
                    });
                });
            });
        });
    });
    app.AddSdkApi("adminnopasscpappinfo", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("update t_cpapp " +
                "set status=? " +
                "where appid=? and appname=?", ["不通过", para.appid, para.appname], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                req.send({});
            });
        });
    });
    app.AddSdkApi("admindelappinfo", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("select Id from t_gsh5game where name=? and del=0", [para.appname], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                gameapi.conn.query("update t_gsh5game " +
                    "set del=1 " +
                    "where id=?", [rows[0]['Id']], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send({});
                });
            });
        });
    });
    app.AddSdkApi("admindowncpappinfo", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var sql = "select Id from t_gsh5game where name=? and del=0";
            gameapi.conn.query(sql, [para.appname], function (err, rows, fields) {
                var sqlparamsEntities = [];
                var entity0 = {
                    sql: "update t_gsgifttype set del=1 where gameid=? and del=0",
                    params: [rows[0]['Id']]
                };
                var entity1 = {
                    sql: "update t_gsh5game set del=1 where name=? and del=0",
                    params: [para.appname]
                };
                var entity2 = {
                    sql: "update t_cpapp set status=? where appid=? and appname=?",
                    params: ["已下架", para.appid, para.appname]
                };
                sqlparamsEntities.push(entity0);
                sqlparamsEntities.push(entity1);
                sqlparamsEntities.push(entity2);
                gameapi.conn.execTrans(sqlparamsEntities, function (err, data) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send({});
                });
            });
        });
    });
    app.AddSdkApi("adminsaveappinfo", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var sqlparamsEntities = [];
            var entity1 = {
                sql: "update t_cpapp " +
                    "set appname=?,url=?,ico=?,intro=?,star=?,uptime=?,posturl=?,testurl=?,mode=?,gametype=?,extraofmonth=?,xl_level=?,lc_level=?,ff_level=?,zh_level=?,starts=?,jsmode=?,percent=? " +
                    "where appid=?",
                params: [para.appname, para.url, para.ico, para.intro, para.starts.length, new Date(), para.posturl, para.testurl, para.mode, para.gametype, para.extraofmonth, para.xl_level, para.lc_level, para.ff_level, para.zh_level, para.starts, para.jsmode, para.percent, para.appid]
            };
            var entity2 = {
                sql: "update t_gsh5game set name=?,detail=?,remark=?,playcount=?,getgold=? " +
                    "where name=? and del=0",
                params: [para.appname, para.intro, para.gametype, para.playcount, para.getgold, para.appname]
            };
            sqlparamsEntities.push(entity1);
            sqlparamsEntities.push(entity2);
            gameapi.conn.execTrans(sqlparamsEntities, function (err, data) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
            });
            SaveFile2("../public/management/icon/" + para.appid, "../public/management/ad/" + para.appid, req);
        });
    });
    app.AddSdkApi("adminsaveappinfo_new", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var appname = '';
            gameapi.conn.query("select appname from t_cpapp where appid=?", [para.appid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                appname = rows[0]["appname"];
                var sqlparamsEntities = [];
                var entity1 = {
                    sql: "update t_cpapp " +
                        "set appname=?,lable=?,url=?,ico=?,intro=?,uptime=?,posturl=?,mode=?,gametype=?,profit=?,introduction = ?  " +
                        "where appid=?",
                    params: [para.appname, para.lable, para.url, para.ico, para.intro, new Date(), para.posturl, para.mode, para.gametype, para.profit, para.introduction, para.appid]
                };
                var entity2 = {
                    sql: "update t_gsh5game set name=?,detail=?,remark=? ,introduction=?" +
                        "where name=? and del=0",
                    params: [para.appname, para.intro, para.gametype, para.introduction, appname]
                };
                sqlparamsEntities.push(entity1);
                sqlparamsEntities.push(entity2);
                gameapi.conn.execTrans(sqlparamsEntities, function (err, data) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                });
            });
            SaveFile4("../public/management/icon/" + para.appid, "../public/management/ad/" + para.appid, "../public/management/back/" + para.appid, "../public/management/smallbanner/" + para.appid, req, "../sdkserver/public/app/ico/" + para.appid + ".png");
        });
    });
    //支付记录
    var ADMINPAYRECORDREQ = (function (_super) {
        __extends(ADMINPAYRECORDREQ, _super);
        function ADMINPAYRECORDREQ() {
            _super.apply(this, arguments);
        }
        return ADMINPAYRECORDREQ;
    }(ADMINREQBASE));
    var APPPAYRECORD = (function () {
        function APPPAYRECORD() {
        }
        return APPPAYRECORD;
    }());
    var ADMINGETAPPPAYRECORDRESP = (function () {
        function ADMINGETAPPPAYRECORDRESP() {
        }
        return ADMINGETAPPPAYRECORDRESP;
    }());
    app.AddSdkApi("getpayrecord", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("select a.id,a.payid,a.channelid,c.sdkname,a.userid,b.loginid,a.createtime,a.goodsname,a.orderid,a.money,a.goodsnum,a.payrmb,a.paytime,a.state " +
                "from t_userpay a left join t_gameuser b on a.userid=b.userid left join t_sdktype c on a.sdkid=c.Id " +
                "where a.state>=1 and a.appid=? and c.sdkname=null", [para.appid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var ret = [];
                for (var i = 0; i < rows.length; i++) {
                    var dat = rows[i];
                    dat.createtime = rows[i]["createtime"].getTime();
                    if (dat.paytime)
                        dat.paytime = rows[i]["paytime"].getTime();
                    ret.push(dat);
                }
                req.send(ret);
            });
        });
    });
    //统计相关
    // class ADMINGETCALUSERDATAFORDAYREQ extends ADMINREQBASE {
    //     appname: string;//游戏名
    //     nuserorder: string;//新用户排序
    //     incomeorder: string;//本月收入排序
    //     extraorder: string;//月结额排序
    // }
    //
    // class ADMINGETCALINCOMEDATAFORDAYREQ extends ADMINREQBASE {
    //     appname: string;//游戏名
    //     nuserorder: string;//新用户排序
    //     incomeorder: string;//本月收入排序
    //     extraorder: string;//月结额排序
    // }
    //
    // class ADMINGETCALINCOMEDATAFORMONTHREQ extends ADMINREQBASE {
    //     appname: string;//游戏名
    //     nuserorder: string;//新用户排序
    //     incomeorder: string;//本月收入排序
    //     extraorder: string;//月结额排序
    // }
    // class ADMINGETCALUSERDATAFORTOTALREQ extends ADMINREQBASE {
    //     appname: string;//游戏名
    //     nuserorder: string;//新用户排序
    //     incomeorder: string;//本月收入排序
    //     extraorder: string;//月结额排序
    // }
    // class ADMINGETCALINCOMEDATAFORTOTALREQ extends ADMINREQBASE {
    //     appname: string;//游戏名
    //     nuserorder: string;//新用户排序
    //     incomeorder: string;//本月收入排序
    //     extraorder: string;//月结额排序
    // }
    // class ADMINGETUSEROLDATAGROUPBYGAME extends ADMINREQBASE {
    //     appname: string;//游戏名
    //     nuserorder: string;//新用户排序
    //     incomeorder: string;//本月收入排序
    //     extraorder: string;//月结额排序
    // }
    // class ADMINGETDATASREQ extends ADMINREQBASE{
    //     appname: string;//游戏名
    //     nuserorder: string;//新用户排序
    //     incomeorder: string;//本月收入排序
    //     extraorder: string;//月结额排序
    // }
    var ADMINGETDATASREQ = (function (_super) {
        __extends(ADMINGETDATASREQ, _super);
        function ADMINGETDATASREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETDATASREQ;
    }(ADMINREQBASE));
    var ADMINGETDATACOUNTRESP = (function () {
        function ADMINGETDATACOUNTRESP() {
        }
        return ADMINGETDATACOUNTRESP;
    }());
    // class ADMINGETCALUSERFORDAYCOUNTRESP {
    //     data: DATATABLE;
    // }
    // class ADMINGETCALUSERFORTOTALCOUNTRESP {
    //     data: DATATABLE;
    // }
    // class ADMINGETCALINCOMEFORDAYCOUNTRESP {
    //     data: DATATABLE;
    // }
    // class ADMINGETCALINCOMEFORMONTHCOUNTRESP {
    //     data: DATATABLE;
    // }
    // class ADMINGETCALINCOMEFORTOTALCOUNTRESP {
    //     data: DATATABLE;
    // }
    app.AddSdkApi("admincaluserforday", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var param = [];
            var sql = "select a.appid 游戏ID,a.appname 游戏名称,count(1) 新用户,a.extraofmonth 月结金额,a.jsmode 结算模式 from (\n" +
                "select str_to_date(DATE_FORMAT(min(a.logtime),'%Y-%m-%d'),'%Y-%m-%d') regtime,a.appid,a.sdkid,c.appname,a.userid,c.jsmode,c.extraofmonth\n" +
                "from t_applog a left join t_cpapp c on c.appid=a.appid\n" +
                "where a.sdkid is not null and a.type=4 \n";
            if (!!para.appname) {
                sql += " and c.appname like ?";
                param.push("%" + para.appname + "%");
            }
            sql += " group by a.appid,a.userid,a.sdkid\n" +
                ") a\n" +
                "where a.regtime = CURRENT_DATE\n" +
                "group by a.appid order by a.appid asc";
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var dat = new DATATABLE();
                dat.fields = [];
                for (var i = 0; i < fields.length; i++) {
                    dat.fields[i] = fields[i].name;
                }
                dat.rows = [];
                for (var i = 0; i < rows.length; i++) {
                    dat.rows[i] = rows[i];
                }
                req.send({ data: dat });
            });
        });
    });
    app.AddSdkApi("admincaluserfortotal", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var param = [];
            var sql = "select a.appid 游戏ID,a.appname 游戏名称,count(1) 总用户,a.extraofmonth 月结金额,a.jsmode 结算模式 from (\n" +
                "select str_to_date(DATE_FORMAT(min(a.logtime),'%Y-%m-%d'),'%Y-%m-%d') regtime,a.appid,a.sdkid,c.appname,a.userid,c.jsmode,c.extraofmonth\n" +
                "from t_applog a left join t_cpapp c on c.appid=a.appid\n" +
                "where a.sdkid is not null and a.type=4 \n";
            if (!!para.appname) {
                sql += " and c.appname like ?";
                param.push("%" + para.appname + "%");
            }
            sql += " group by a.appid,a.userid,a.sdkid\n" +
                ") a\n" +
                "group by a.appid order by a.appid asc";
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var dat = new DATATABLE();
                dat.fields = [];
                for (var i = 0; i < fields.length; i++) {
                    dat.fields[i] = fields[i].name;
                }
                dat.rows = [];
                for (var i = 0; i < rows.length; i++) {
                    dat.rows[i] = rows[i];
                }
                req.send({ data: dat });
            });
        });
    });
    app.AddSdkApi("admincalincomeforday", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var param = [];
            var sql = "select c.appid 游戏ID,c.appname 游戏名称, sum(a.payrmb) 今日收入 ,c.extraofmonth 月结金额,c.jsmode 结算模式\n" +
                "from t_userpay a left join t_sdktype b on a.sdkid=b.id left join t_cpapp c on c.appid=a.appid\n" +
                "where a.state>=1 and a.sdkid is not null AND DATE_FORMAT(a.paytime, '%Y-%m-%d') = DATE_FORMAT(CURRENT_DATE,'%Y-%m-%d')\n";
            if (!!para.appname) {
                sql += "and c.appname like ?";
                param.push("%" + para.appname + "%");
            }
            sql += " group by c.appid order by c.appid asc";
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var dat = new DATATABLE();
                dat.fields = [];
                for (var i = 0; i < fields.length; i++) {
                    dat.fields[i] = fields[i].name;
                }
                dat.rows = [];
                for (var i = 0; i < rows.length; i++) {
                    dat.rows[i] = rows[i];
                }
                req.send({ data: dat });
            });
        });
    });
    app.AddSdkApi("admincalincomeformonth", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var param = [];
            var sql = "select c.appid 游戏ID,c.appname 游戏名称, sum(a.payrmb) 本月收入 ,c.extraofmonth 月结金额,c.jsmode 结算模式\n" +
                "from t_userpay a left join t_sdktype b on a.sdkid=b.id left join t_cpapp c on c.appid=a.appid\n" +
                "where a.state>=1 and a.sdkid is not null AND DATE_FORMAT(a.paytime, '%Y-%m') = DATE_FORMAT(CURRENT_DATE,'%Y-%m')\n";
            if (!!para.appname) {
                sql += "and c.appname like ?";
                param.push("%" + para.appname + "%");
            }
            sql += " group by c.appid order by c.appid asc";
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var dat = new DATATABLE();
                dat.fields = [];
                for (var i = 0; i < fields.length; i++) {
                    dat.fields[i] = fields[i].name;
                }
                dat.rows = [];
                for (var i = 0; i < rows.length; i++) {
                    dat.rows[i] = rows[i];
                }
                req.send({ data: dat });
            });
        });
    });
    app.AddSdkApi("admincalincomefortotal", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var param = [];
            var sql = "select a.appid 游戏ID,a.游戏名称,sum(a.充值金额) 总收入,count(1) 付费用户,a.extraofmonth 月结金额,a.jsmode 结算模式 from(\n" +
                "select a.appid,a.userid,c.appname 游戏名称, sum(a.payrmb) 充值金额 ,count(1) 充值次数,a.sdkid,b.sdkname 渠道,c.extraofmonth,c.jsmode\n" +
                "from t_userpay a left join t_sdktype b on a.sdkid=b.id left join t_cpapp c on c.appid=a.appid\n" +
                "where a.state>=1 and a.sdkid is not null\n";
            if (!!para.appname) {
                sql += " and c.appname like ?";
                param.push("%" + para.appname + "%");
            }
            sql += " group by sdkid,appid,userid,DATE_FORMAT(a.paytime,'%Y-%m-%d')) a\n" +
                "group by appid\n" +
                "order by appid asc";
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var dat = new DATATABLE();
                dat.fields = [];
                for (var i = 0; i < fields.length; i++) {
                    dat.fields[i] = fields[i].name;
                }
                dat.rows = [];
                for (var i = 0; i < rows.length; i++) {
                    dat.rows[i] = rows[i];
                }
                req.send({ data: dat });
            });
        });
    });
    app.AddSdkApi("admingetuseroldatagroupbygame", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            var param = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var sql = "select DATE_FORMAT(a.regtime, '%Y-%m-%d') 日期,count(1) 活跃用户,a.appid 游戏ID,a.appname 游戏名称,a.extraofmonth 月结金额,a.jsmode 结算模式 from (\n" +
                "select str_to_date(min(a.logtime),'%Y-%m-%d') regtime,a.appid,a.sdkid,c.appname,a.userid,c.jsmode,c.extraofmonth\n" +
                "from t_applog a left join t_cpapp c on c.appid=a.appid left join t_sdktype b on b.Id=a.sdkid\n" +
                "where a.sdkid is not null and (a.type=2 or a.type=4)\n";
            if (!!para.appname) {
                sql += " and a.appname like ?";
                param.push("%" + para.appname + "%");
            }
            sql += " group by userid,DATE_FORMAT(a.logtime, '%Y-%m-%d')\n" +
                ") a\n";
            sql += "GROUP BY a.appid order by a.appid asc";
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var dat = new DATATABLE();
                dat.fields = [];
                for (var i = 0; i < fields.length; i++) {
                    dat.fields[i] = fields[i].name;
                }
                dat.rows = [];
                for (var i = 0; i < rows.length; i++) {
                    dat.rows[i] = rows[i];
                }
                req.send({ data: dat });
            });
        });
    });
    //新后台数据统计
    var ADMINCALDATAREQ = (function (_super) {
        __extends(ADMINCALDATAREQ, _super);
        function ADMINCALDATAREQ() {
            _super.apply(this, arguments);
        }
        return ADMINCALDATAREQ;
    }(ADMINREQBASE));
    var ADMINCALDATARESP = (function () {
        function ADMINCALDATARESP() {
        }
        return ADMINCALDATARESP;
    }());
    app.AddSdkApi("admincaldata", function (req) {
        var para = req.param;
        if (exports.isbusy) {
            req.send(null, 1, "服务器忙，请稍候重试");
            return;
        }
        exports.isbusy = true;
        CheckUser(para, function (err, pri) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                exports.isbusy = false;
                return;
            }
            if (para.appname) {
                para.appname = "%" + para.appname + "%";
            }
            if (pri.appname)
                para.appname = pri.appname;
            var sql = "select a.appid 游戏ID, a.appname 游戏名称,ifnull(b.newuser,0)新用户,ifnull(c.totaluser,0)总用户,ifnull(d.incometoday,0)今日收入,ifnull(e.incomemonth,0)本月收入,ifnull(f.incometotal,0)总收入,\n" +
                "ifnull(ifnull(f.incometotal,0)/ifnull(c.totaluser,0),0) ARPU, ifnull(ifnull(f.incometotal,0)/ifnull(g.payuser,0),0)ARPPU from t_cpapp a\n" +
                "left join(\n" +
                "    select appid, count(1) newuser from t_applog  where type=4 and logtime>=curdate() and logtime<date_add(curdate(),interval 1 day) group by appid) b\n" +
                "on b.appid=a.appid\n" +
                "left join(\n" +
                "    select appid, count(1) totaluser from t_applog  where type=4 group by appid) c\n" +
                "on c.appid=a.appid\n" +
                "left join(\n" +
                "    select appid,sum(payrmb) incometoday from t_userpay where state>=1 and paytime>=curdate() and paytime<date_add(curdate(),interval 1 day) group by appid) d\n" +
                "on d.appid=a.appid\n" +
                "left join(\n" +
                "    select appid,sum(payrmb) incomemonth from t_userpay where state>=1 and paytime>=DATE_ADD(curdate(),interval -day(curdate())+1 day) and paytime<date_add(last_day(curdate()),interval 1 day) group by appid) e\n" +
                "on e.appid=a.appid\n" +
                "left join(\n" +
                "    select appid,sum(payrmb) incometotal from t_userpay where state>=1  group by appid) f\n" +
                "on f.appid=a.appid\n" +
                "left join(\n" +
                "    select a.appid,sum(a.payuser) payuser from (select appid,sdkid,count(1) payuser from t_userpay where state>=1 group by appid,sdkid)a group by a.appid) g\n" +
                "on g.appid=a.appid";
            var sqlpara = [];
            if (para.appname) {
                sql += " where a.appname like ?";
                sqlpara.push(para.appname);
            }
            if (para.incomeorder || para.nuserorder) {
                sql += " order by ";
                if (para.nuserorder) {
                    sql += " 新用户";
                    if (para.nuserorder == "nuserdown")
                        sql += " desc ";
                    if (para.incomeorder)
                        sql += ",";
                }
                if (para.incomeorder) {
                    sql += " 本月收入";
                    if (para.incomeorder == "incomedown")
                        sql += " desc";
                }
            }
            else {
                sql += " order by 总收入 desc";
            }
            gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    exports.isbusy = false;
                    throw err;
                }
                exports.isbusy = false;
                var dat = new DATATABLE();
                dat.fields = [];
                for (var i = 0; i < fields.length; i++) {
                    dat.fields[i] = fields[i].name;
                }
                dat.rows = [];
                for (var i = 0; i < rows.length; i++) {
                    dat.rows[i] = rows[i];
                }
                req.send({ data: dat });
            });
        });
    });
    //datadetail页相关
    //获取已接入的SDK列表
    var ADMINGETSDKTYPELISTREQ = (function () {
        function ADMINGETSDKTYPELISTREQ() {
        }
        return ADMINGETSDKTYPELISTREQ;
    }());
    var ADMINSDKTYPEINFO = (function () {
        function ADMINSDKTYPEINFO() {
        }
        return ADMINSDKTYPEINFO;
    }());
    var ADMINGETSDKTYPELISTRESP = (function () {
        function ADMINGETSDKTYPELISTRESP() {
        }
        return ADMINGETSDKTYPELISTRESP;
    }());
    app.AddSdkApi("admingetsdktypelist", function (req) {
        var para = req.param;
        gameapi.conn.query("select a.id,a.sdkname,a.payurl,a.remarkappid,a.remarkappsecret,a.needproductid,b.sdkappid demoappid ,b.sdkappsecret demoappsecret\n" +
            "from t_sdktype a\n" +
            "left join ( select sdkid,min(id) minid  from t_sdkapp group by sdkid ) c on c.sdkid=a.id\n" +
            "left join t_sdkapp b on  b.id=c.minid", [], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            var ret = new ADMINGETSDKTYPELISTRESP();
            ret.data = [];
            for (var i = 0; i < rows.length; i++) {
                ret.data[i] = rows[i];
                ret.data[i].payurl = "http://" + gameapi.g_myServerDomain2 + ":" + gameapi.g_serverport2 + ret.data[i].payurl;
            }
            req.send(ret);
        });
    });
    var ADMINGETDATADETAILREQ = (function (_super) {
        __extends(ADMINGETDATADETAILREQ, _super);
        function ADMINGETDATADETAILREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETDATADETAILREQ;
    }(ADMINREQBASE));
    var ADMINGETDATADETAILRESP = (function () {
        function ADMINGETDATADETAILRESP() {
        }
        return ADMINGETDATADETAILRESP;
    }());
    var ADMINGETCALUSEROFDETAILRESP = (function () {
        function ADMINGETCALUSEROFDETAILRESP() {
        }
        return ADMINGETCALUSEROFDETAILRESP;
    }());
    var ADMINGETCALUSEROFOLRESP = (function () {
        function ADMINGETCALUSEROFOLRESP() {
        }
        return ADMINGETCALUSEROFOLRESP;
    }());
    var ADMINGETCALINCOMEOFDETAILRESP = (function () {
        function ADMINGETCALINCOMEOFDETAILRESP() {
        }
        return ADMINGETCALINCOMEOFDETAILRESP;
    }());
    var ADMINGETCALUSEROFCLRESP = (function () {
        function ADMINGETCALUSEROFCLRESP() {
        }
        return ADMINGETCALUSEROFCLRESP;
    }());
    app.AddSdkApi("admingetgamedatadetail", function (req) {
        var para = req.param;
        if (exports.isbusy) {
            req.send(null, 1, "服务器忙，请稍候重试");
            return;
        }
        exports.isbusy = true;
        CheckUser(para, function (err) {
            var params = [];
            if (err) {
                exports.isbusy = false;
                req.send(null, 1, err.message);
                return;
            }
            var ret = new ADMINGETDATADETAILRESP();
            gameapi.conn.query("select id,sdkname from t_sdktype", [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    exports.isbusy = false;
                    throw err;
                }
                ret.sdktypes = [];
                for (var i = 0; i < rows.length; i++) {
                    ret.sdktypes[i] = rows[i];
                }
                var sql;
                var sqlpara;
                sql = "select appid, sdkid,logdate today,newuser from t_sdkappdaylog where appid=? and  logdate>=? and logdate<=? {1}  order by today";
                if (para.sdkid > 0) {
                    sql = sql.replace("{1}", " and sdkid=? ");
                    sqlpara = [para.appid, para.timestart, para.timeend, para.sdkid];
                }
                else {
                    if (para.sdkid === null)
                        sql = sql.replace("{1}", "");
                    else
                        sql = sql.replace("{1}", " and sdkid=0 ");
                    sqlpara = [para.appid, para.timestart, para.timeend];
                }
                gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        exports.isbusy = false;
                        throw err;
                    }
                    ret.newusers = [];
                    for (var i = 0; i < rows.length; i++) {
                        ret.newusers[i] = rows[i];
                        ret.newusers[i].today = rows[i]["today"].getTime();
                    }
                    //sql = "select appid,ifnull(sdkid,0) sdkid, count(1) totaluser from t_applog  where appid=? and type=4 and logtime<? {1} group by sdkid";
                    sql = "select appid,sdkid,count(1)totaluser from t_sdkgameuser where appid=? and  regtime<? {1} group by sdkid";
                    if (para.sdkid > 0) {
                        sql = sql.replace("{1}", " and sdkid=? ");
                        sqlpara = [para.appid, para.timestart, para.sdkid];
                    }
                    else {
                        if (para.sdkid === null)
                            sql = sql.replace("{1}", "");
                        else
                            sql = sql.replace("{1}", " and sdkid is null ");
                        sqlpara = [para.appid, para.timestart];
                    }
                    gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            exports.isbusy = false;
                            throw err;
                        }
                        ret.totalusers = [];
                        for (var i = 0; i < rows.length; i++) {
                            ret.totalusers[i] = rows[i];
                        }
                        sql = "select a.appid,ifnull(a.sdkid,0)sdkid,a.today ,count(1) activeuser from(\n" +
                            "select appid,sdkid,userid,logdate today  from t_userdaylog  where appid=?  and logdate>=? and logdate<=? {1} \n" +
                            ")a group by sdkid,today order by today";
                        if (para.sdkid > 0) {
                            sql = sql.replace("{1}", " and sdkid=? ");
                            sqlpara = [para.appid, para.timestart, para.timeend, para.sdkid];
                        }
                        else {
                            if (para.sdkid === null)
                                sql = sql.replace("{1}", "");
                            else
                                sql = sql.replace("{1}", " and sdkid =0 ");
                            sqlpara = [para.appid, para.timestart, para.timeend];
                        }
                        gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                exports.isbusy = false;
                                throw err;
                            }
                            ret.activeusers = [];
                            for (var i = 0; i < rows.length; i++) {
                                ret.activeusers[i] = rows[i];
                                ret.activeusers[i].today = rows[i]["today"].getTime();
                            }
                            sql = "select a.appid,a.sdkid,a.today,count(a.userid) newpayuser,sum(a.payrmb) newpaymoney from(\n" +
                                "select a.appid,ifnull(a.sdkid,0) sdkid,a.userid, sum(a.payrmb) payrmb,date(a.paytime) today from t_userpay a\n" +
                                "inner join t_sdkgameuser b on b.appid=a.appid and b.sdkid=ifnull(a.sdkid,0) and b.userid=a.userid and date(b.regtime)=date(a.paytime)\n" +
                                "where a.appid=? and a.paytime>=? and a.paytime<=? {1}\n" +
                                "group by appid,sdkid,userid,today\n" +
                                ") a group by appid,sdkid,today";
                            if (para.sdkid > 0) {
                                sql = sql.replace("{1}", " and a.sdkid=? ");
                                sqlpara = [para.appid, para.timestart, para.timeend, para.sdkid];
                            }
                            else {
                                if (para.sdkid === null)
                                    sql = sql.replace("{1}", "");
                                else
                                    sql = sql.replace("{1}", " and a.sdkid is null ");
                                sqlpara = [para.appid, para.timestart, para.timeend];
                            }
                            gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    exports.isbusy = false;
                                    throw err;
                                }
                                ret.newpays = [];
                                for (var i = 0; i < rows.length; i++) {
                                    ret.newpays[i] = rows[i];
                                    ret.newpays[i].today = rows[i]["today"].getTime();
                                }
                                sql = "select appid,ifnull(sdkid,0) sdkid,sum(payrmb) incometoday ,date(paytime) today from t_userpay where appid=? and state>=1 and paytime>=? and paytime<=? {1} group by sdkid,today order by today";
                                if (para.sdkid > 0) {
                                    sql = sql.replace("{1}", " and sdkid=? ");
                                    sqlpara = [para.appid, para.timestart, para.timeend, para.sdkid];
                                }
                                else {
                                    if (para.sdkid === null)
                                        sql = sql.replace("{1}", "");
                                    else
                                        sql = sql.replace("{1}", " and sdkid is null ");
                                    sqlpara = [para.appid, para.timestart, para.timeend];
                                }
                                gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                                    if (err) {
                                        req.send(null, 1, err.message);
                                        exports.isbusy = false;
                                        throw err;
                                    }
                                    ret.incometodays = [];
                                    for (var i = 0; i < rows.length; i++) {
                                        ret.incometodays[i] = rows[i];
                                        ret.incometodays[i].today = rows[i]["today"].getTime();
                                    }
                                    sql = "select appid,ifnull(sdkid,0) sdkid,sum(payrmb) incometotal from t_userpay where appid=? and state>=1 and paytime<? {1} group by sdkid";
                                    if (para.sdkid > 0) {
                                        sql = sql.replace("{1}", " and sdkid=? ");
                                        sqlpara = [para.appid, para.timestart, para.sdkid];
                                    }
                                    else {
                                        if (para.sdkid === null)
                                            sql = sql.replace("{1}", "");
                                        else
                                            sql = sql.replace("{1}", " and sdkid is null ");
                                        sqlpara = [para.appid, para.timestart];
                                    }
                                    gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                                        if (err) {
                                            req.send(null, 1, err.message);
                                            exports.isbusy = false;
                                            throw err;
                                        }
                                        ret.incometotals = [];
                                        for (var i = 0; i < rows.length; i++) {
                                            ret.incometotals[i] = rows[i];
                                        }
                                        sql = "select a.appid,a.sdkid,a.today,count(1) payuser from (\n" +
                                            "select appid,ifnull(sdkid,0) sdkid,date(paytime) today\n" +
                                            "from t_userpay where appid=? and state>=1 and paytime>=? and paytime<=? {1}\n" +
                                            "group by sdkid,userid,today\n" +
                                            ")a group by sdkid,today order by today";
                                        if (para.sdkid > 0) {
                                            sql = sql.replace("{1}", " and sdkid=? ");
                                            sqlpara = [para.appid, para.timestart, para.timeend, para.sdkid];
                                        }
                                        else {
                                            if (para.sdkid === null)
                                                sql = sql.replace("{1}", "");
                                            else
                                                sql = sql.replace("{1}", " and sdkid is null ");
                                            sqlpara = [para.appid, para.timestart, para.timeend];
                                        }
                                        gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                                            if (err) {
                                                req.send(null, 1, err.message);
                                                exports.isbusy = false;
                                                throw err;
                                            }
                                            ret.payusers = [];
                                            for (var i = 0; i < rows.length; i++) {
                                                ret.payusers[i] = rows[i];
                                                ret.payusers[i].today = rows[i]["today"].getTime();
                                            }
                                            sql = "select appid,ifnull(sdkid,0) sdkid,count(1) payuserstotal from t_userpay where appid=? and state>=1 and paytime<? {1} group by sdkid";
                                            if (para.sdkid > 0) {
                                                sql = sql.replace("{1}", " and sdkid=? ");
                                                sqlpara = [para.appid, para.timestart, para.sdkid];
                                            }
                                            else {
                                                if (para.sdkid === null)
                                                    sql = sql.replace("{1}", "");
                                                else
                                                    sql = sql.replace("{1}", " and sdkid is null ");
                                                sqlpara = [para.appid, para.timestart];
                                            }
                                            gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                                                if (err) {
                                                    req.send(null, 1, err.message);
                                                    exports.isbusy = false;
                                                    throw err;
                                                }
                                                ret.payuserstotals = [];
                                                for (var i = 0; i < rows.length; i++) {
                                                    ret.payuserstotals[i] = rows[i];
                                                }
                                                sql = "select a.appid,a.sdkid,date(a.regtime) today,\n" +
                                                    "sum(case when b.logdate is null then 0 else 1 end) keeps1,\n" +
                                                    "sum(case when c.logdate is null then 0 else 1 end) keeps2,\n" +
                                                    "sum(case when d.logdate is null then 0 else 1 end) keeps3,\n" +
                                                    "sum(case when e.logdate is null then 0 else 1 end) keeps4,\n" +
                                                    "sum(case when f.logdate is null then 0 else 1 end) keeps5,\n" +
                                                    "sum(case when g.logdate is null then 0 else 1 end) keeps6,\n" +
                                                    "sum(case when h.logdate is null then 0 else 1 end) keeps7,\n" +
                                                    "sum(case when i.logdate is null then 0 else 1 end) keeps14,\n" +
                                                    "sum(case when j.logdate is null then 0 else 1 end) keeps21,\n" +
                                                    "sum(case when k.logdate is null then 0 else 1 end) keeps30\n" +
                                                    "from t_sdkgameuser a\n" +
                                                    "left join t_userdaylog b on b.logdate=date_add(date(a.regtime), interval 1 day) and b.appid=a.appid and b.sdkid=a.sdkid and b.userid=a.userid\n" +
                                                    "left join t_userdaylog c on c.logdate=date_add(date(a.regtime), interval 2 day) and c.appid=a.appid and c.sdkid=a.sdkid and c.userid=a.userid\n" +
                                                    "left join t_userdaylog d on d.logdate=date_add(date(a.regtime), interval 3 day) and d.appid=a.appid and d.sdkid=a.sdkid and d.userid=a.userid\n" +
                                                    "left join t_userdaylog e on e.logdate=date_add(date(a.regtime), interval 4 day) and e.appid=a.appid and e.sdkid=a.sdkid and e.userid=a.userid\n" +
                                                    "left join t_userdaylog f on f.logdate=date_add(date(a.regtime), interval 5 day) and f.appid=a.appid and f.sdkid=a.sdkid and f.userid=a.userid\n" +
                                                    "left join t_userdaylog g on g.logdate=date_add(date(a.regtime), interval 6 day) and g.appid=a.appid and g.sdkid=a.sdkid and g.userid=a.userid\n" +
                                                    "left join t_userdaylog h on h.logdate=date_add(date(a.regtime), interval 7 day) and h.appid=a.appid and h.sdkid=a.sdkid and h.userid=a.userid\n" +
                                                    "left join t_userdaylog i on i.logdate=date_add(date(a.regtime), interval 14 day) and i.appid=a.appid and i.sdkid=a.sdkid and i.userid=a.userid\n" +
                                                    "left join t_userdaylog j on j.logdate=date_add(date(a.regtime), interval 21 day) and j.appid=a.appid and j.sdkid=a.sdkid and j.userid=a.userid\n" +
                                                    "left join t_userdaylog k on k.logdate=date_add(date(a.regtime), interval 30 day) and k.appid=a.appid and k.sdkid=a.sdkid and k.userid=a.userid\n" +
                                                    "where a.appid=? and a.regtime>=? and a.regtime<=? {1} group by appid,sdkid,today order by today";
                                                if (para.sdkid > 0) {
                                                    sql = sql.replace("{1}", " and a.sdkid=? ");
                                                    sqlpara = [para.appid, para.timestart, para.timeend, para.sdkid];
                                                }
                                                else {
                                                    if (para.sdkid === null)
                                                        sql = sql.replace("{1}", "");
                                                    else
                                                        sql = sql.replace("{1}", " and a.sdkid=0 ");
                                                    sqlpara = [para.appid, para.timestart, para.timeend];
                                                }
                                                gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                                                    if (err) {
                                                        req.send(null, 1, err.message);
                                                        exports.isbusy = false;
                                                        throw err;
                                                    }
                                                    ret.keeps = [];
                                                    for (var i_1 = 0; i_1 < rows.length; i_1++) {
                                                        ret.keeps[i_1] = rows[i_1];
                                                        ret.keeps[i_1].today = rows[i_1]["today"].getTime();
                                                    }
                                                    fun1();
                                                });
                                                function fun1() {
                                                    //总计
                                                    if (para.sdkid === null || para.sdkid === 0) {
                                                        if (para.sdkid === null)
                                                            sql = "select 1,ifnull(a.newuser,0) newuser,ifnull(b.totaluser,0) totaluser,ifnull(c.activeuser,0) activeuser,ifnull(d.income,0) income,ifnull(e.payuser,0)payuser,ifnull(e.payuser/c.activeuser,0) payrate,ifnull(d.income/c.activeuser,0) arpu,ifnull(d.income/e.payuser,0) arppu from (select 1) x left join(\n" +
                                                                "select a.appid,sum(a.newuser) newuser from(select appid,sdkid, count(1) newuser from t_sdkgameuser where appid=? and  regtime>=? and regtime<=? group by sdkid)a)a on 1=1\n" +
                                                                "left join(\n" +
                                                                "select appid, count(1) totaluser from t_sdkgameuser  where appid=?)b on 1=1\n" +
                                                                "left join(\n" +
                                                                "select a.appid,count(1)activeuser from(select appid,sdkid ,logdate,userid from t_userdaylog  where appid=? and logdate>=? and logdate<=? group by appid,sdkid,userid)a )c on 1=1\n" +
                                                                "left join(\n" +
                                                                "select appid,sum(payrmb) income from t_userpay where appid=? and state>=1 and paytime>=? and paytime<=?) d on 1=1\n" +
                                                                "left join(\n" +
                                                                "select a.appid,sum(a.payuser)payuser from( select a.appid,a.sdkid,count(1) payuser from(select appid,sdkid,userid from t_userpay where appid=? and state>=1 and paytime>=? and paytime<=?  group by sdkid,userid) a group by sdkid)a)e on 1=1\n" +
                                                                "left join(\n" +
                                                                "select appid,sum(payrmb) incometotal from t_userpay where appid=? and state>=1) f on 1=1";
                                                        else
                                                            sql = "select 1,ifnull(a.newuser,0) newuser,ifnull(b.totaluser,0) totaluser,ifnull(c.activeuser,0) activeuser,ifnull(d.income,0) income,ifnull(e.payuser,0)payuser,ifnull(e.payuser/c.activeuser,0) payrate,ifnull(d.income/c.activeuser,0) arpu,ifnull(d.income/e.payuser,0) arppu from (select 1) x left join(\n" +
                                                                "select a.appid,sum(a.newuser) newuser from(select appid,sdkid, count(1) newuser from t_sdkgameuser where appid=? and  regtime>=? and regtime<=? and sdkid=0)a)a on 1=1\n" +
                                                                "left join(\n" +
                                                                "select appid, count(1) totaluser from t_sdkgameuser  where appid=? and sdkid=0)b on 1=1\n" +
                                                                "left join(\n" +
                                                                "select a.appid,count(1)activeuser from(select appid,sdkid ,logdate,userid from t_userdaylog  where appid=? and logdate>=? and logdate<=? and sdkid=0 group by appid,sdkid,userid)a )c on 1=1\n" +
                                                                "left join(\n" +
                                                                "select appid,sum(payrmb) income from t_userpay where appid=? and state>=1 and paytime>=? and paytime<=? and sdkid is null) d on 1=1\n" +
                                                                "left join(\n" +
                                                                "select a.appid,sum(a.payuser)payuser from( select a.appid,a.sdkid,count(1) payuser from(select appid,sdkid,userid from t_userpay where appid=? and state>=1 and paytime>=? and paytime<=? and sdkid is null group by sdkid,userid) a group by sdkid)a)e on 1=1\n" +
                                                                "left join(\n" +
                                                                "select appid,sum(payrmb) incometotal from t_userpay where appid=? and state>=1 and sdkid is null) f on 1=1";
                                                        sqlpara = [para.appid, para.timestart, para.timeend,
                                                            para.appid,
                                                            para.appid, para.timestart, para.timeend,
                                                            para.appid, para.timestart, para.timeend,
                                                            para.appid, para.timestart, para.timeend,
                                                            para.appid];
                                                    }
                                                    else {
                                                        sql = "select 1,ifnull(a.newuser,0) newuser,ifnull(b.totaluser,0) totaluser,ifnull(c.activeuser,0) activeuser,ifnull(d.income,0) income,ifnull(e.payuser,0)payuser,ifnull(e.payuser/c.activeuser,0) payrate,ifnull(d.income/c.activeuser,0) arpu,ifnull(d.income/e.payuser,0) arppu from (select 1) x left join(\n" +
                                                            "select a.appid,sum(a.newuser) newuser from(select appid,sdkid, count(1) newuser from t_sdkgameuser where appid=? and regtime>=? and regtime<=? and sdkid=? group by sdkid)a)a on 1=1\n" +
                                                            "left join(\n" +
                                                            "select appid, count(1) totaluser from t_sdkgameuser  where appid=? and sdkid=?)b on 1=1\n" +
                                                            "left join(\n" +
                                                            "select a.appid,count(1)activeuser from(select appid,sdkid ,logdate,userid from t_userdaylog  where appid=? and logdate>=? and logdate<=? and sdkid=? group by appid,sdkid,userid)a )c on 1=1\n" +
                                                            "left join(\n" +
                                                            "select appid,sum(payrmb) income from t_userpay where appid=? and state>=1 and paytime>=? and paytime<=? and sdkid=?) d on 1=1\n" +
                                                            "left join(\n" +
                                                            "select a.appid,sum(a.payuser)payuser from( select a.appid,a.sdkid,count(1) payuser from(select appid,sdkid,userid from t_userpay where appid=? and state>=1 and paytime>=? and paytime<=? and sdkid=? group by sdkid,userid) a group by sdkid)a)e on 1=1\n" +
                                                            "left join(\n" +
                                                            "select appid,sum(payrmb) incometotal from t_userpay where appid=? and state>=1 and sdkid=?) f on 1=1";
                                                        sqlpara = [para.appid, para.timestart, para.timeend, para.sdkid,
                                                            para.appid, para.sdkid,
                                                            para.appid, para.timestart, para.timeend, para.sdkid,
                                                            para.appid, para.timestart, para.timeend, para.sdkid,
                                                            para.appid, para.timestart, para.timeend, para.sdkid,
                                                            para.appid, para.sdkid];
                                                    }
                                                    gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                                                        if (err) {
                                                            req.send(null, 1, err.message);
                                                            exports.isbusy = false;
                                                            throw err;
                                                        }
                                                        ret.totaluser = rows[0]["totaluser"];
                                                        ret.newuser = rows[0]["newuser"];
                                                        ret.payuser = rows[0]["payuser"];
                                                        ret.activeuser = rows[0]["activeuser"];
                                                        ret.payrate = rows[0]["payrate"];
                                                        ret.income = rows[0]["income"];
                                                        ret.arpu = rows[0]["arpu"];
                                                        ret.arppu = rows[0]["arppu"];
                                                        exports.isbusy = false;
                                                        req.send(ret);
                                                    });
                                                }
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
            /*
             var param: any[] = [];
             var sql = "select a.regtime 日期,count(1) 新用户,a.appid, a.sdkid, a.sdkname 渠道 from (\n" +
             "select str_to_date(DATE_FORMAT(min(a.logtime),'%Y-%m-%d'),'%Y-%m-%d') regtime,a.appid,a.sdkid,b.sdkname,a.userid\n" +
             "from t_applog a left join t_cpapp c on c.appid=a.appid left join t_sdktype b on b.Id=a.sdkid\n" +
             "where a.sdkid is not null and a.type=4\n";
             if (!!para.sdkid) {
             sql += " and a.sdkid=?";
             param.push(para.sdkid);
             }
             if (!!para.appid) {
             sql += " and a.appid=?";
             param.push(para.appid);
             }
             sql += " group by a.appid,a.userid,a.sdkid\n" +
             ") a\n" +
             "where DATE_FORMAT(a.regtime, '%Y-%m-%d')>=? and DATE_FORMAT(a.regtime, '%Y-%m-%d')<=?\n" +
             "group by a.appid,a.sdkid,DATE_FORMAT(a.regtime,'%Y-%m-%d') order by DATE_FORMAT(a.regtime,'%Y-%m-%d') desc";
             param.push(para.timestart);
             param.push(para.timeend);
             gameapi.conn.query(sql, param, (err, rows, fields) => {
             if (err) {
             req.send(null, 1, err.message);
             throw err;
             }
             var dat = new DATATABLE();
             dat.fields = [];
             for (var i = 0; i < fields.length; i++) {
             dat.fields[i] = fields[i].name;
             }
             dat.rows = [];
             for (var i = 0; i < rows.length; i++) {
             dat.rows[i] = rows[i];
             dat.rows[i].日期 = rows[i]["日期"].getTime();
             }
             req.send({data: dat});
             });
             */
        });
    });
    app.AddSdkApi("admingetuseroldata", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            var param = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var sql = "select str_to_date(DATE_FORMAT(a.regtime, '%Y-%m-%d'),'%Y-%m-%d') 日期,count(1) 活跃用户,a.appid, a.sdkid, a.sdkname 渠道 from (\n" +
                "select str_to_date(min(a.logtime),'%Y-%m-%d') regtime,a.appid,a.sdkid,b.sdkname,a.userid\n" +
                "from t_applog a left join t_cpapp c on c.appid=a.appid left join t_sdktype b on b.Id=a.sdkid\n" +
                "where a.sdkid is not null and (a.type=2 or a.type=4)\n";
            if (!!para.sdkid) {
                sql += " and a.sdkid=?";
                param.push(para.sdkid);
            }
            if (!!para.appid) {
                sql += " and a.appid=?";
                param.push(para.appid);
            }
            sql += " group by userid,DATE_FORMAT(a.logtime, '%Y-%m-%d')\n" +
                ") a\n" +
                "where DATE_FORMAT(a.regtime, '%Y-%m-%d')>=? and DATE_FORMAT(a.regtime, '%Y-%m-%d')<=?\n" +
                "group by a.appid,a.sdkid,DATE_FORMAT(a.regtime,'%Y-%m-%d') order by DATE_FORMAT(a.regtime,'%Y-%m-%d') desc";
            param.push(para.timestart);
            param.push(para.timeend);
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var dat = new DATATABLE();
                dat.fields = [];
                for (var i = 0; i < fields.length; i++) {
                    dat.fields[i] = fields[i].name;
                }
                dat.rows = [];
                for (var i = 0; i < rows.length; i++) {
                    dat.rows[i] = rows[i];
                    dat.rows[i].日期 = rows[i]["日期"].getTime();
                }
                req.send({ data: dat });
            });
        });
    });
    //SDK统计每日充值
    app.AddSdkApi("admingetsdkpaydaily", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var param = [];
            var sql = "select a.`日期`,a.appid,sum(a.充值金额) 收入,count(1) 付费用户,a.sdkid,a.渠道 from(\n" +
                "select str_to_date(DATE_FORMAT(a.paytime,'%Y-%m-%d'),'%Y-%m-%d') 日期,a.appid,a.userid,c.appname 游戏, sum(a.payrmb) 充值金额 ,count(1) 充值次数,a.sdkid,b.sdkname 渠道\n" +
                "from t_userpay a left join t_sdktype b on a.sdkid=b.id left join t_cpapp c on c.appid=a.appid\n" +
                "where a.state>=1 and a.sdkid is not null and DATE_FORMAT(a.paytime,'%Y-%m-%d')>=? and DATE_FORMAT(a.paytime,'%Y-%m-%d')<=?\n";
            param.push(para.timestart);
            param.push(para.timeend);
            if (para.sdkid) {
                sql += " and a.sdkid=?";
                param.push(para.sdkid);
            }
            if (para.appid) {
                sql += " and a.appid=?";
                param.push(para.appid);
            }
            sql += "  group by sdkid,appid,userid,DATE_FORMAT(a.paytime,'%Y-%m-%d')) a\n" +
                "group by appid,sdkid,日期\n" +
                "order by 日期 desc";
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var dat = new DATATABLE();
                dat.fields = [];
                for (var i = 0; i < fields.length; i++) {
                    dat.fields[i] = fields[i].name;
                }
                dat.rows = [];
                for (var i = 0; i < rows.length; i++) {
                    dat.rows[i] = rows[i];
                    dat.rows[i].日期 = rows[i]["日期"].getTime();
                }
                req.send({ data: dat });
            });
        });
    });
    //计算次留
    app.AddSdkApi("admingetuserolforcldata", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            var param = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var sql = "select a.regtime 日期,count(1) 次留,a.appid, a.sdkid, a.sdkname 渠道 from (" +
                "SELECT str_to_date(min(a.logtime), '%Y-%m-%d') regtime,a.appid,a.sdkid,b.sdkname,a.userid FROM " +
                "t_applog a LEFT JOIN t_cpapp c ON c.appid = a.appid LEFT JOIN t_sdktype b ON b.Id = a.sdkid WHERE a.sdkid IS NOT NULL AND (a.type = 2) and a.userid in (" +
                "SELECT userid FROM t_applog WHERE type = 4 AND DATE_FORMAT(logtime, '%Y-%m-%d') >= DATE_SUB(?, INTERVAL 1 DAY) AND DATE_FORMAT(logtime, '%Y-%m-%d') <= DATE_SUB(?, INTERVAL 1 DAY))\n";
            param.push(para.timestart);
            param.push(para.timeend);
            if (!!para.sdkid) {
                sql += " and a.sdkid=?";
                param.push(para.sdkid);
            }
            if (!!para.appid) {
                sql += " and a.appid=?";
                param.push(para.appid);
            }
            sql += "GROUP BY userid,DATE_FORMAT(a.logtime, '%Y-%m-%d')) a " +
                "WHERE DATE_FORMAT(a.regtime, '%Y-%m-%d') >= ? AND DATE_FORMAT(a.regtime, '%Y-%m-%d') <= ? " +
                "GROUP BY a.appid,a.sdkid,DATE_FORMAT(a.regtime, '%Y-%m-%d') ORDER BY DATE_FORMAT(a.regtime, '%Y-%m-%d') DESC ";
            param.push(para.timestart);
            param.push(para.timeend);
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var dat = new DATATABLE();
                dat.fields = [];
                for (var i = 0; i < fields.length; i++) {
                    dat.fields[i] = fields[i].name;
                }
                dat.rows = [];
                for (var i = 0; i < rows.length; i++) {
                    dat.rows[i] = rows[i];
                    dat.rows[i].日期 = rows[i]["日期"].getTime();
                }
                req.send({ data: dat });
            });
        });
    });
    var ADMINGETH5GAMELISTREQ = (function (_super) {
        __extends(ADMINGETH5GAMELISTREQ, _super);
        function ADMINGETH5GAMELISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETH5GAMELISTREQ;
    }(ADMINREQBASE));
    app.AddSdkApi("admingeth5gamelist", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var param = [];
            var sql = "SELECT a.id,a.name,a.url,a.detail,a.opencount,a.playcount,a.createtime,a.getgold,a.remark,a.ishot,a.isrec,a.rank,a.orderby,a.newsort  " +
                "FROM t_gsh5game a LEFT JOIN t_cpapp b ON a.`name` = b.appname AND a.del=0 AND b.del=0 AND b.enabled=1 WHERE a.del=0";
            if (!!para.appname) {
                sql += " AND a.`name` LIKE ? ";
                param.push("%" + para.appname + "%");
            }
            if (!!para.starts) {
                sql += " ORDER BY newsort DESC";
            }
            else {
                sql += " ORDER BY orderby DESC";
            }
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var applist = [];
                for (var i = 0; i < rows.length; i++) {
                    var info = rows[i];
                    info.createtime = rows[i]["createtime"].getTime();
                    info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + info.id + ".png");
                    applist[i] = info;
                }
                var ret = new ADMINGETH5APPLISTRESP();
                ret.applist = applist;
                req.send(ret);
            });
        });
    });
    var ADMINSORTINSERTREQ = (function (_super) {
        __extends(ADMINSORTINSERTREQ, _super);
        function ADMINSORTINSERTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSORTINSERTREQ;
    }(ADMINREQBASE));
    app.AddSdkApi("adminsortinsert", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("update t_gsh5game set orderby=? where Id=? and del=0", [para.sortnum, para.id], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                req.send({});
            });
        });
    });
    app.AddSdkApi("adminsortinsert_allgame", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var allgame = para.all_id.length;
            for (var i = allgame; i > 0; i--) {
                var j = allgame - i + 1;
                gameapi.conn.query("update t_gsh5game set orderby=? where Id=? and del=0", [i, para.all_id[j]], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send({});
                });
            }
        });
    });
    app.AddSdkApi("adminsortinsert_newgame", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var newgame = para.all_id.length;
            for (var i = newgame; i > 0; i--) {
                var j = newgame - i + 1;
                gameapi.conn.query("update t_gsh5game set newsort=? where Id=? and del=0", [i, para.all_id[j]], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send({});
                });
            }
        });
    });
    var ADMINSORTCLICKREQ = (function (_super) {
        __extends(ADMINSORTCLICKREQ, _super);
        function ADMINSORTCLICKREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSORTCLICKREQ;
    }(ADMINREQBASE));
    app.AddSdkApi("adminsortclick", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (!!para.ishot && para.ishot == 1) {
                switch (para.flags) {
                    case 1:
                        gameapi.conn.query("select id,orderby from t_gsh5game where ((orderby > ? and del=0 and ishot=1) or orderby=(select MAX(orderby) from t_gsh5game where del=0 and ishot=1)) and del=0 and ishot=1 order by orderby asc limit 1", [para.orderby], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                return;
                            }
                            commitUpdate(rows[0]['id'], para.id, rows[0]['orderby'], para.orderby, req);
                            req.send({});
                        });
                        break;
                    case 2:
                        gameapi.conn.query("select id,orderby from t_gsh5game where ((orderby < ? and del=0 and ishot=1) or orderby=(select min(orderby) from t_gsh5game where del=0 and ishot=1)) and del=0 and ishot=1  order by orderby desc limit 1", [para.orderby], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                return;
                            }
                            commitUpdate(rows[0]['id'], para.id, rows[0]['orderby'], para.orderby, req);
                            req.send({});
                        });
                        break;
                    case 3:
                        gameapi.conn.query("select id,orderby from t_gsh5game where orderby=(select MAX(orderby) from t_gsh5game where del=0 and ishot=1) order by orderby desc limit 1", [para.orderby], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                return;
                            }
                            gameapi.conn.query("update t_gsh5game set orderby=? where id=? and del=0", [rows[0]['orderby'] + 1, para.id], function (err, rows, fields) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    return;
                                }
                                req.send({});
                            });
                        });
                        break;
                    case 4:
                        gameapi.conn.query("select id,orderby from t_gsh5game where orderby=(select MIN(orderby) from t_gsh5game where del=0 and ishot=1) order by orderby asc limit 1", [para.orderby], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                return;
                            }
                            gameapi.conn.query("update t_gsh5game set orderby=? where id=? and del=0", [rows[0]['orderby'] - 1, para.id], function (err, rows, fields) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    return;
                                }
                                req.send({});
                            });
                        });
                        break;
                }
            }
            if (!!para.isrec && para.isrec == 1) {
                switch (para.flags) {
                    case 1:
                        gameapi.conn.query("select id,orderby from t_gsh5game where ((orderby > ? and del=0 and isrec=1) or orderby=(select MAX(orderby) from t_gsh5game where del=0 and isrec=1)) and del=0 and isrec=1 order by orderby asc limit 1", [para.orderby], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                return;
                            }
                            commitUpdate(rows[0]['id'], para.id, rows[0]['orderby'], para.orderby, req);
                            req.send({});
                        });
                        break;
                    case 2:
                        gameapi.conn.query("select id,orderby from t_gsh5game where ((orderby < ? and del=0 and isrec=1) or orderby=(select min(orderby) from t_gsh5game where del=0 and isrec=1)) and del=0 and isrec=1 order by orderby desc limit 1", [para.orderby], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                return;
                            }
                            commitUpdate(rows[0]['id'], para.id, rows[0]['orderby'], para.orderby, req);
                            req.send({});
                        });
                        break;
                    case 3:
                        gameapi.conn.query("select id,orderby from t_gsh5game where orderby=(select MAX(orderby) from t_gsh5game where del=0 and isrec=1) order by orderby desc limit 1", [para.orderby], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                return;
                            }
                            gameapi.conn.query("update t_gsh5game set orderby=? where id=? and del=0", [rows[0]['orderby'] + 1, para.id], function (err, rows, fields) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    return;
                                }
                                req.send({});
                            });
                        });
                        break;
                    case 4:
                        gameapi.conn.query("select id,orderby from t_gsh5game where orderby=(select MIN(orderby) from t_gsh5game where del=0 and isrec=1) order by orderby asc limit 1", [para.orderby], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                return;
                            }
                            gameapi.conn.query("update t_gsh5game set orderby=? where id=? and del=0", [rows[0]['orderby'] - 1, para.id], function (err, rows, fields) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    return;
                                }
                                req.send({});
                            });
                        });
                        break;
                }
            }
        });
    });
    var ADMINACTIVITYINFO = (function (_super) {
        __extends(ADMINACTIVITYINFO, _super);
        function ADMINACTIVITYINFO() {
            _super.apply(this, arguments);
        }
        return ADMINACTIVITYINFO;
    }(ACTIVITYINFO));
    var ADMINGETACTIVITYINFOSREQ = (function (_super) {
        __extends(ADMINGETACTIVITYINFOSREQ, _super);
        function ADMINGETACTIVITYINFOSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETACTIVITYINFOSREQ;
    }(ADMINREQBASE));
    var ADMINGETACTIVITYINFORESP = (function (_super) {
        __extends(ADMINGETACTIVITYINFORESP, _super);
        function ADMINGETACTIVITYINFORESP() {
            _super.apply(this, arguments);
        }
        return ADMINGETACTIVITYINFORESP;
    }(ADMINACTIVITYINFO));
    app.AddSdkApi("admingetactivityinfos", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            gameapi.conn.query("select a.id,a.gameid,b.name gamename,a.url,type,a.orderby,a.createtime from t_gsactivity a " +
                "left join t_gsh5game b on a.gameid=b.id and b.del=0 where a.del=0 order by orderby desc", [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var ret = new ADMINGETACTIVITYINFORESP();
                ret.data = [];
                for (var i = 0; i < rows.length; i++) {
                    var dat = rows[i];
                    dat.img = gameapi.GetServerUrl("gamecenter/activity/" + dat.id + ".jpg");
                    ret.data.push(dat);
                }
                req.send(ret);
            });
        });
    });
    app.AddSdkApi("admingethotgame", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            gameapi.conn.query("SELECT a.id, a.gameid, b.appname gamename, a.url, a.type, a.orderby, a.createtime " +
                " FROM t_gshotgame a LEFT JOIN t_cpapp b ON a.gameid = b.appid AND b.del = 0 AND b.`status` = '已通过' WHERE a.del = 0 " +
                " ORDER BY orderby DESC ", [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var ret = new ADMINGETACTIVITYINFORESP();
                ret.data = [];
                for (var i = 0; i < rows.length; i++) {
                    var dat = rows[i];
                    dat.img = gameapi.GetServerUrl("management/smallbanner/" + rows[i]["gameid"] + ".jpg");
                    ret.data.push(dat);
                }
                req.send(ret);
            });
        });
    });
    var ADMINGETACTIVITYINFOIMGREQ = (function (_super) {
        __extends(ADMINGETACTIVITYINFOIMGREQ, _super);
        function ADMINGETACTIVITYINFOIMGREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETACTIVITYINFOIMGREQ;
    }(ADMINREQBASE));
    app.AddSdkApi("admingetadimg", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (!para.gamename) {
                req.send(null, 1, "图片获取失败");
                return;
            }
            gameapi.conn.query("select appid from t_cpapp where del=0 and enabled=1 and appname=?", [para.gamename], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var path = app.GetAbsPath("../public/management/ad/" + rows[0]['appid'] + ".jpg");
                if (fs.existsSync(path)) {
                    req.send({ data: gameapi.GetServerUrl("management/ad/" + rows[0]['appid'] + ".jpg") });
                }
                else {
                    req.send(null, 1, "图片获取失败");
                    return;
                }
            });
        });
    });
    app.AddSdkApi("admingethotgameimg", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (!para.gamename) {
                req.send(null, 1, "图片获取失败");
                return;
            }
            gameapi.conn.query("select appid from t_cpapp where del=0 and enabled=1 and appname=?", [para.gamename], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var path = app.GetAbsPath("../public/management/smallbanner/" + rows[0]['appid'] + ".jpg");
                if (fs.existsSync(path)) {
                    req.send({ data: gameapi.GetServerUrl("management/smallbanner/" + rows[0]['appid'] + ".jpg") });
                }
                else {
                    req.send(null, 1, "图片获取失败");
                    return;
                }
            });
        });
    });
    var ADMINSAVEACTIVITYINFOREQ = (function (_super) {
        __extends(ADMINSAVEACTIVITYINFOREQ, _super);
        function ADMINSAVEACTIVITYINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVEACTIVITYINFOREQ;
    }(ADMINREQBASE));
    app.AddSdkApi("adminsaveadinfo", function (req) {
        var para = req.param;
        var imgurl = para.imgurl;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            gameapi.conn.query("select id from t_gsh5game where name=? and del=0", [para.gamaname], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var gameid = rows[0]['id'];
                var path = "public" + imgurl.substring(imgurl.indexOf("/", imgurl.indexOf("/") + 2), imgurl.lastIndexOf("?"));
                var dest = app.GetAbsPath("../public/gamecenter/activity/" + para.id + ".jpg");
                gameapi.MoveFile(path, dest, function () {
                });
                gameapi.conn.query("update t_gsactivity set gameid=?,url=?,orderby=?,isrec=? where id=? and del=0", [gameid, gameid, para.orderby, para.flags, para.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    // if (path.search("gamecenter") == -1) {//是否是通过获取获得的图片
                    req.send({});
                    // } else {
                    //     req.send({});
                    // }
                });
            });
        });
    });
    app.AddSdkApi("adminsavehotgameinfo", function (req) {
        var para = req.param;
        var imgurl = para.imgurl;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            gameapi.conn.query("select appid from t_cpapp where appname= ? and del=0 and status = '已通过'", [para.gamaname], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var gameid = rows[0]['appid'];
                var path = "public" + imgurl.substring(imgurl.indexOf("/", imgurl.indexOf("/") + 2), imgurl.lastIndexOf("?"));
                var dest = app.GetAbsPath("../public/manangement/smallbanner/" + gameid + ".jpg");
                gameapi.conn.query("update t_gshotgame set gameid=?,url=?,orderby=? where id=? and del=0", [gameid, gameid, para.orderby, para.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    // if (path.search("gamecenter") == -1) {//是否是通过获取获得的图片
                    gameapi.MoveFile(path, dest, function () {
                    });
                    req.send({});
                    // } else {
                    //     req.send(null,1,dest);
                    // }
                });
            });
        });
    });
    app.AddSdkApi("admininsertadinfo", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            gameapi.conn.query("select appid from t_cpapp where del=0 and enabled=1 and appname=?", [para.gamename], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var filepath = app.GetAbsPath("../public/management/ad/" + rows[0]['appid'] + ".jpg");
                gameapi.MoveFile(req.files['imgfile'][0].path, filepath, function () {
                    gameapi.conn.query("insert into t_gsactivity (gameid,url,type,orderby) values(?,?,?,?)", [para.url, para.url, para.type, para.orderby], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        var id = rows.insertId;
                        SaveFile("../public/gamecenter/activity/" + id + ".jpg", req);
                        var ad = new gamecenter.CacheData.ACTIVITYAD();
                        ad.id = id;
                        ad.type = para.type;
                        ad.img = gameapi.GetServerUrl("gamecenter/activity/" + ad.id + ".jpg");
                        ad.url = para.url;
                        gamecenter.CacheData.AddActivityAd(ad);
                    });
                });
            });
        });
    });
    app.AddSdkApi("adminsortinsertforad", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("update t_gsactivity set orderby=? where Id=? and del=0", [para.sortnum, para.id], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                req.send({});
            });
        });
    });
    var ADMINGETCPAPPJSREQ = (function (_super) {
        __extends(ADMINGETCPAPPJSREQ, _super);
        function ADMINGETCPAPPJSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCPAPPJSREQ;
    }(ADMINREQBASE));
    var ADMINGETCPAPPJSINFO = (function () {
        function ADMINGETCPAPPJSINFO() {
        }
        return ADMINGETCPAPPJSINFO;
    }());
    var ADMINGETCPAPPJSINFORESP = (function () {
        function ADMINGETCPAPPJSINFORESP() {
        }
        return ADMINGETCPAPPJSINFORESP;
    }());
    app.AddSdkApi("admingetcpgamebalance", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var param = [];
            var sql = "insert into t_balance(typeid,type,month,income,status,user) select x.a,x.b,x.`日期`,x.`总收入`,x.c,x.d from(select " + para.gameid + " a,0 b,DATE_FORMAT(a.paytime,'%Y-%m') 日期,sum(a.payrmb) 总收入,'未付款' c,'" + para.user + "' d\n" +
                "from t_userpay a left join t_cpapp b on a.appid=b.appid\n" +
                "where a.state>=1 and a.sdkid is not null";
            if (!!para.gameid) {
                sql += " and a.appid = ?";
                param.push(para.gameid);
            }
            sql += " GROUP BY DATE_FORMAT(a.paytime,'%Y-%m') ORDER BY a.paytime) x WHERE NOT EXISTS (SELECT * FROM t_balance k WHERE k.income = x.`总收入` AND k. MONTH = x.`日期` AND k.typeid = x.a)";
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                gameapi.conn.query("select x.id,x.`month` 时间,MAX(x.income) 总收入,x.payrmb,x.balance,x.`status`,x.`user` from (SELECT * from t_balance where typeId=? and type=0 ORDER BY income desc) x group by x.`month`", [para.gameid], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    var dat = new ADMINGETCPAPPJSINFORESP();
                    dat.data = [];
                    for (var i = 0; i < rows.length; i++) {
                        var data = new ADMINGETCPAPPJSINFO();
                        data.id = rows[i]['id'];
                        data.date = rows[i]['时间'];
                        data.totalIncome = rows[i]['总收入'];
                        data.status = rows[i]['status'];
                        data.payrmb = rows[i]['payrmb'];
                        data.balance = rows[i]['balance'];
                        data.user = rows[i]['user'];
                        dat.data.push(data);
                    }
                    req.send(dat);
                });
            });
        });
    });
    var ADMINGETCPAPPPERCENTREQ = (function (_super) {
        __extends(ADMINGETCPAPPPERCENTREQ, _super);
        function ADMINGETCPAPPPERCENTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCPAPPPERCENTREQ;
    }(ADMINREQBASE));
    app.AddSdkApi("admingetcpappinfoforpercent", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("select percent from t_cpapp where del=0 and enabled=1 and appid=?", [para.gameid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                req.send({ data: rows[0]['percent'] });
            });
        });
    });
    var ADMINCHANGEBALANCESTATUSREQ = (function (_super) {
        __extends(ADMINCHANGEBALANCESTATUSREQ, _super);
        function ADMINCHANGEBALANCESTATUSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINCHANGEBALANCESTATUSREQ;
    }(ADMINREQBASE));
    app.AddSdkApi("adminchangebalancestatus", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query("update t_balance set `status`=?,`user`=? where id=?", [para.status, para.user, para.id], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                req.send({});
            });
        });
    });
    var ADMINGETCPAPPJSINFOREQ = (function (_super) {
        __extends(ADMINGETCPAPPJSINFOREQ, _super);
        function ADMINGETCPAPPJSINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCPAPPJSINFOREQ;
    }(ADMINREQBASE));
    app.AddSdkApi("adminjs", function (req) {
        var _this = this;
        var param = req.param;
        CheckUser(param, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            for (var i = 0; i < param.data.length; i++) {
                var jsinfo = param.data[i];
                (function (mdata) {
                    var balance = 0;
                    if (i == 0) {
                        balance = 0;
                    }
                    else {
                        ;
                        balance = param.data[i - 1].balance;
                    }
                    var jsGold = (mdata.totalIncome - mdata.totalIncome * 0.05) * param.percent + balance;
                    if (mdata.status == "已结算") {
                        gameapi.conn.query("update t_balance set balance=0, where id=?", [mdata.id], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                return;
                            }
                        });
                        gameapi.conn.query("update t_balance set status='已结算' where STR_TO_DATE(`month`, '%Y-%m') IN (SELECT x.d from (SELECT STR_TO_DATE(`month`, '%Y-%m') d from t_balance " +
                            "WHERE STR_TO_DATE(?, '%Y-%m')>STR_TO_DATE(`month`, '%Y-%m') " +
                            "AND typeId=?) x)", [mdata.date, param.gameid], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                return;
                            }
                        });
                        req.send({});
                    }
                    else {
                        gameapi.conn.query("update t_balance set balance=? where id=?", [jsGold, mdata.id], function (err, rows, fields) {
                        });
                    }
                }).call(_this, jsinfo);
            }
            req.send({});
        });
    });
    app.AddSdkApi("adminnotjs", function (req) {
        var _this = this;
        var param = req.param;
        CheckUser(param, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            for (var i = 0; i < param.data.length; i++) {
                var jsinfo = param.data[i];
                (function (mdata) {
                    var balance = 0;
                    if (i == 0) {
                        balance = 0;
                    }
                    else {
                        balance = param.data[i - 1].balance;
                    }
                    var jsGold = (mdata.totalIncome - mdata.totalIncome * 0.05) * param.percent + balance;
                    if (mdata.status != "已结算") {
                        gameapi.conn.query("update t_balance set balance=? where id=?", [jsGold, mdata.id], function (err, rows, fields) {
                        });
                    }
                }).call(_this, jsinfo);
            }
            req.send({});
        });
    });
    var ADMINPUSHTOREQ = (function (_super) {
        __extends(ADMINPUSHTOREQ, _super);
        function ADMINPUSHTOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINPUSHTOREQ;
    }(ADMINREQBASE));
    app.AddSdkApi("adminpushto", function (req) {
        var param = req.param;
        CheckUser(param, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (param.pushto == "none") {
                gameapi.conn.query("update t_gsh5game set isrec=0,ishot=0 where name=? and del=0", [param.appname], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send({});
                });
            }
            else if (param.pushto == "all") {
                gameapi.conn.query("update t_gsh5game set isrec=1,ishot=1 where name=? and del=0", [param.appname], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send({});
                });
            }
            else if (param.pushto == "hot") {
                gameapi.conn.query("update t_gsh5game set isrec=0,ishot=1 where name=? and del=0", [param.appname], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send({});
                });
            }
            else if (param.pushto == "rec") {
                gameapi.conn.query("update t_gsh5game set isrec=1,ishot=0 where name=? and del=0", [param.appname], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send({});
                });
            }
        });
    });
    var ADMINREMOVEHOTORREC = (function (_super) {
        __extends(ADMINREMOVEHOTORREC, _super);
        function ADMINREMOVEHOTORREC() {
            _super.apply(this, arguments);
        }
        return ADMINREMOVEHOTORREC;
    }(ADMINREQBASE));
    app.AddSdkApi("adminremovehotorrec", function (req) {
        var param = req.param;
        CheckUser(param, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (param.flags == "hot") {
                gameapi.conn.query("update t_gsh5game set ishot=0 where del=0 and id=?", [param.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send({});
                });
            }
            else if (param.flags == "rec") {
                gameapi.conn.query("update t_gsh5game set isrec=0 where del=0 and id=?", [param.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send({});
                });
            }
        });
    });
    var ADMINGETGAMECOUNTREQ = (function (_super) {
        __extends(ADMINGETGAMECOUNTREQ, _super);
        function ADMINGETGAMECOUNTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETGAMECOUNTREQ;
    }(ADMINREQBASE));
    var ADMINGETGAMEUSERREQ = (function (_super) {
        __extends(ADMINGETGAMEUSERREQ, _super);
        function ADMINGETGAMEUSERREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETGAMEUSERREQ;
    }(ADMINREQBASE));
    var ADMINGETGAMEINCOMEREQ = (function (_super) {
        __extends(ADMINGETGAMEINCOMEREQ, _super);
        function ADMINGETGAMEINCOMEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETGAMEINCOMEREQ;
    }(ADMINREQBASE));
    var ADMINGETCHANNELCOUNTREQ = (function (_super) {
        __extends(ADMINGETCHANNELCOUNTREQ, _super);
        function ADMINGETCHANNELCOUNTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHANNELCOUNTREQ;
    }(ADMINREQBASE));
    app.AddSdkApi("admingetchannelcount", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send({ channelcount: null });
                return;
            }
            var sql = "SELECT count(distinct sdkname) 渠道数目 FROM t_sdktype\n";
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                var count = rows[0]["渠道数目"];
                if (count != null) {
                    req.send({ channelcount: count });
                }
                else {
                    req.send({ channelcount: 0 });
                }
            });
        });
    });
    app.AddSdkApi("admingetgamecount", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send({ gamecount: null });
                return;
            }
            var sql = "SELECT SUM(1) 游戏数目 FROM t_cpapp WHERE del=0\n";
            if (para.flags == "WEEK") {
                sql += "and YEARWEEK(date_format(addtime,'%Y-%m-%d')) = YEARWEEK(now())";
            }
            if (para.flags == "OL") {
                sql += "and YEARWEEK(date_format(uptime,'%Y-%m-%d')) = YEARWEEK(now()) and status='已通过'";
            }
            if (para.flags == "WAIT") {
                sql += "and  status='未审核'";
            }
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                var count = rows[0]["游戏数目"];
                if (count != null) {
                    req.send({ gamecount: count });
                }
                else {
                    req.send({ gamecount: 0 });
                }
            });
        });
    });
    app.AddSdkApi("admingetgameuser", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send({ usercount: null });
                return;
            }
            var sql = "";
            if (para.flags == "isChannel") {
                sql = "SELECT COUNT(1) 累计用户 from t_sdkuser";
            }
            else {
                sql = "SELECT COUNT(1) 累计用户 from t_gameuser";
            }
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                var count = rows[0]["累计用户"];
                if (count != null) {
                    req.send({ usercount: count });
                }
                else {
                    req.send({ usercount: 0 });
                }
            });
        });
    });
    app.AddSdkApi("admingetgameincome", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send({ income: null });
                return;
            }
            var sql = "SELECT sum(a.流水) 累计流水 FROM(SELECT sum(a.payrmb) 流水\n" +
                "FROM t_userpay a LEFT JOIN t_cpapp c ON c.appid = a.appid WHERE a.state >= 1\n";
            if (para.flags == "isChannel") {
                sql += "and a.sdkid is not null\n";
            }
            sql += "GROUP BY sdkid,a.appid,userid) a";
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                var count = rows[0]["累计流水"];
                if (count != null) {
                    req.send({ income: count });
                }
                else {
                    req.send({ income: 0 });
                }
            });
        });
    });
    var ADMINADDGIFTTYPREQ = (function (_super) {
        __extends(ADMINADDGIFTTYPREQ, _super);
        function ADMINADDGIFTTYPREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDGIFTTYPREQ;
    }(ADMINREQBASE));
    //礼包相关
    app.AddSdkApi("adminaddgifttype", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (!!para.id) {
                var sql = "select Id from t_gsh5game where del=0 and name=?";
                gameapi.conn.query(sql, [para.gamename], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var sql = "update t_gsgifttype set giftname=?,instruction=?,useway=?,gifttype=?,giftvalue=?,endtime=?,groupqq=? where id=?";
                    gameapi.conn.query(sql, [para.giftname, para.instruction, para.useway, para.gametype, para.giftvalue, para.endtime, para.groupqq, para.id], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            return;
                        }
                        req.send({});
                    });
                    /*else {
                     var sql = "update t_gsgamegifttype set giftname=?,instruction=?,price=? where id=?";
                     gameapi.conn.query(sql, [para.giftname, para.instruction, para.giftvalue, para.id], (err, rows, fields) => {
                     if (err) {
                     req.send(null, 1, err.message);
                     return;
                     }
                     req.send({});
                     });
                     }*/
                });
            }
            else {
                var sql = "select Id from t_gsh5game where del=0 ";
                gameapi.conn.query(sql, [], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var sql = "insert into t_gsgifttype(gameid,giftname,instruction,useway,gifttype,giftvalue,giftnum,endtime,groupqq) values((select Id from t_gsh5game where name=? and del=0 ),?,?,?,?,?,?,?,?)";
                    gameapi.conn.query(sql, [para.gamename, para.giftname, para.instruction, para.useway, para.gametype, para.giftvalue, para.giftnum, para.endtime, para.groupqq], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            return;
                        }
                        //req.send({});
                        gameapi.conn.query("update t_gsh5game set hasgift=? where name=? and del=0", ['1', para.gamename], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                return;
                            }
                            req.send({});
                        });
                    });
                });
            }
        });
    });
    var ADMINDELETEGIFTTYPREQ = (function (_super) {
        __extends(ADMINDELETEGIFTTYPREQ, _super);
        function ADMINDELETEGIFTTYPREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDELETEGIFTTYPREQ;
    }(ADMINREQBASE));
    app.AddSdkApi("admindeletegifttype", function (req) {
        var para = req.param;
        var sql = "update t_gsgifttype set del=1 where id=?";
        gameapi.conn.query(sql, [para.id], function (err, rows, fileds) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var sql = "select Id from t_gsh5game where del=0 and name=?";
            gameapi.conn.query(sql, [para.gamename], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var sql = "update t_gsh5game set hasgift=0 where id=? and del=0";
                gameapi.conn.query(sql, [rows[0]['Id']], function (err, rows, fileds) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send({});
                });
            });
        });
    });
    var ADMINGETALLGIFTREQ = (function (_super) {
        __extends(ADMINGETALLGIFTREQ, _super);
        function ADMINGETALLGIFTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLGIFTREQ;
    }(ADMINREQBASE));
    var ADMINGETALLGIFTINFO = (function () {
        function ADMINGETALLGIFTINFO() {
        }
        return ADMINGETALLGIFTINFO;
    }());
    var ADMINGETALLGIFTRESP = (function () {
        function ADMINGETALLGIFTRESP() {
        }
        return ADMINGETALLGIFTRESP;
    }());
    var ADMINDELGIFTBAG = (function (_super) {
        __extends(ADMINDELGIFTBAG, _super);
        function ADMINDELGIFTBAG() {
            _super.apply(this, arguments);
        }
        return ADMINDELGIFTBAG;
    }(ADMINGETALLGIFTINFO));
    var ADMINGETCHECKGIFTBAGREQ = (function (_super) {
        __extends(ADMINGETCHECKGIFTBAGREQ, _super);
        function ADMINGETCHECKGIFTBAGREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHECKGIFTBAGREQ;
    }(ADMINREQBASE));
    app.AddSdkApi("admingetcheckbaglist", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var ret = [];
            if (para.giftname.length == 0) {
                req.send(null, 1, "请勾选需要通过的数据");
                return;
            }
            for (var i = 0; i < para.giftname.length; i++) {
                gameapi.conn.query("SELECT a.id, b.`name`, b.Id AS gameid, a.gifttype, giftname, giftvalue, instruction, useway, total, remainder, a.createtime FROM t_gsgifttype a LEFT JOIN t_gsh5game b ON a.gameid = b.id WHERE a.del = 0 AND giftname =? ", [para.giftname[i]], function (err, rows, fields) {
                    var giftinfo = rows[0];
                    ret.push(giftinfo);
                    if (ret.length == para.giftname.length) {
                        req.send(ret);
                        return;
                    }
                    ;
                });
            }
        });
    });
    app.AddSdkApi("admingetcheckbaglist_vip", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var ret = [];
            if (para.giftname.length == 0) {
                req.send(null, 1, "请勾选需要通过的数据");
                return;
            }
            for (var i = 0; i < para.giftname.length; i++) {
                gameapi.conn.query("SELECT a.id, a.giftnum, b.`name` AS appname, b.id AS gameid, a.type AS gifttype, giftname, price AS giftvalue, instruction, total, remainder, a.createtime FROM t_gsgamegifttype a LEFT JOIN t_gsh5game b ON b.Id = a.gameid WHERE a.del = 0  " +
                    "and giftname=?", [para.giftname[i]], function (err, rows, fields) {
                    var giftinfo = rows[0];
                    ret.push(giftinfo);
                    if (ret.length == para.giftname.length) {
                        req.send(ret);
                        return;
                    }
                    ;
                });
            }
        });
    });
    //多选删除礼包
    app.AddSdkApi("admindelbag", function (req) {
        var params = req.param;
        for (var i = 0; i < params.length; i++) {
            var para = params[i];
            (function (para) {
                gameapi.conn.query("update t_gsgifttype set del=? where giftname=?", ["1", para.giftname], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                });
                gameapi.conn.query("select * from t_gsgifttype where gameid=? and del=0", [para.gameid], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    if (rows.length == 0) {
                        gameapi.conn.query("update t_gsh5game set hasgift=? where Id=? and del=0", ['0', para.gameid], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                return;
                            }
                        });
                    }
                });
            }).call(this, para);
        }
        req.send({});
    });
    //多选删除高级福利礼包
    app.AddSdkApi("admindelbag_vip", function (req) {
        var params = req.param;
        for (var i = 0; i < params.length; i++) {
            var para = params[i];
            (function (para) {
                gameapi.conn.query("update t_gsgamegifttype set del=? where giftname=?", ["1", para.giftname], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                });
            }).call(this, para);
        }
        req.send({});
    });
    app.AddSdkApi("admingetallgift", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var sql = "select Id from t_gsh5game where del=0 and name=?";
            gameapi.conn.query(sql, [para.gamename], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var sql = "select id,giftname,instruction,useway,total,remainder,createtime from t_gsgifttype where del=0\n" +
                    "and gameid=" + rows[0]['Id'] + " order by createtime desc";
                gameapi.conn.query(sql, [], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var giftlist = [];
                    for (var i = 0; i < rows.length; i++) {
                        var info = rows[i];
                        info.createtime = rows[i]["createtime"].getTime();
                        if (rows[i]["total"] == null) {
                            info.total = 0;
                        }
                        if (rows[i]["remainder"] == null) {
                            info.remainder = 0;
                        }
                        giftlist[i] = info;
                    }
                    var ret = new ADMINGETALLGIFTRESP();
                    ret.giftlist = giftlist;
                    req.send(ret);
                });
            });
        });
    });
    app.AddSdkApi("admingetallgift_new", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "select Id from t_gsh5game where del=0 ";
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                if (para.flag == '0') {
                    var sql = "SELECT a.id,a.giftnum, b.`name` as appname,b.id as gameid, a.gifttype,a.endtime,a.groupqq, giftname, giftvalue, instruction, useway, total, remainder, a.createtime FROM t_gsgifttype a LEFT JOIN t_gsh5game b ON b.Id=a.gameid WHERE a.del = 0 ";
                    var params = [];
                }
                else {
                    if (para.flag == '1') {
                        var sql = "SELECT a.id, a.giftnum, b.`name` AS appname, b.id AS gameid, a.type AS gifttype, giftname, price AS giftvalue, instruction, total, remainder, a.createtime FROM t_gsgamegifttype a LEFT JOIN t_gsh5game b ON b.Id = a.gameid WHERE a.del = 0 ";
                        var params = [];
                    }
                }
                if (!!para.time) {
                    sql += " AND DATE_FORMAT(a.createtime,'%Y-%m-%d')=?";
                    params.push(para.time);
                }
                if (!!para.giftname) {
                    sql += "AND giftname like '%" + para.giftname + "%' ";
                }
                sql += " ORDER BY createtime DESC ";
                gameapi.conn.query(sql, params, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var giftlist = [];
                    for (var i = 0; i < rows.length; i++) {
                        var info = rows[i];
                        info.createtime = rows[i]["createtime"].getTime();
                        if (rows[i]["total"] == null) {
                            info.total = 0;
                        }
                        if (rows[i]["remainder"] == null) {
                            info.remainder = 0;
                        }
                        giftlist[i] = info;
                    }
                    var ret = new ADMINGETALLGIFTRESP();
                    ret.giftlist = giftlist;
                    req.send(ret);
                });
            });
        });
    });
    var ADMINUPLOADFILE = (function (_super) {
        __extends(ADMINUPLOADFILE, _super);
        function ADMINUPLOADFILE() {
            _super.apply(this, arguments);
        }
        return ADMINUPLOADFILE;
    }(ADMINREQBASE));
    app.AddSdkApi("adminuploadfile", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var path = req.files['codefile'][0].path;
            var ext = path.substring(path.indexOf("."));
            if (ext.search(/.xls|.txt/i)) {
                req.send(null, 1, "文件类型错误");
                return;
            }
            if (".xls" == ext || ".xlsx" == ext) {
                var filepath = app.GetAbsPath("../public/management/code/" + para.typeid + "_" + para.gameid + "_" + para.giftname + ".xlsx");
                gameapi.MoveFile(path, filepath, function () {
                    e2j({
                        input: filepath,
                        output: "output.json" // output json
                    }, function (err, result) {
                        if (err) {
                            req.send(1, null, err);
                            return;
                        }
                        else {
                            var sql = "select Id from t_gsh5game where del=0 and name=?";
                            gameapi.conn.query(sql, [para.gamename], function (err, rows, fields) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    return;
                                }
                                var sqlparamsEntities = [];
                                var entity1 = {};
                                if (result.length == 1) {
                                    entity1.sql = "update t_gsgifttype set total=1,one=1 where id=?";
                                    entity1.params = [para.typeid];
                                }
                                else {
                                    entity1.sql = "update t_gsgifttype set total=total+? where id=?";
                                    entity1.params = [result.length, para.typeid];
                                }
                                sqlparamsEntities.push(entity1);
                                for (var i = 0; i < result.length; i++) {
                                    var entity2 = {
                                        sql: "insert into t_gsgift(typeid,code) values(?,?)",
                                        params: [para.typeid, result[i]]
                                    };
                                    sqlparamsEntities.push(entity2);
                                }
                                var entity3 = {
                                    sql: "update t_gsh5game set hasgift=1 where id=? and del=0",
                                    params: [rows[0]['Id']]
                                };
                                sqlparamsEntities.push(entity3);
                                gameapi.conn.execTrans(sqlparamsEntities, function (err, data) {
                                    if (err) {
                                        req.send(null, 1, "重复数据");
                                        return;
                                    }
                                    req.send({});
                                });
                            });
                        }
                    });
                });
            }
            else if (".txt" == ext) {
                var filepath = app.GetAbsPath("../public/management/code/" + para.typeid + "_" + para.gameid + "_" + para.giftname + ".txt");
                gameapi.MoveFile(path, filepath, function () {
                    var contentText = fs.readFileSync(filepath, 'utf-8');
                    var codes = contentText.split("\r\n");
                    var sql = "select Id from t_gsh5game where del=0 and name=?";
                    gameapi.conn.query(sql, [para.gamename], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            return;
                        }
                        var sqlparamsEntities = [];
                        var entity1 = {};
                        if (codes.length == 1) {
                            entity1.sql = "update t_gsgifttype set total=1,one=1 where id=?";
                            entity1.params = [para.typeid];
                        }
                        else {
                            entity1.sql = "update t_gsgifttype set total=total+? where id=?";
                            entity1.params = [codes.length, para.typeid];
                        }
                        sqlparamsEntities.push(entity1);
                        for (var i = 0; i < codes.length; i++) {
                            var entity2 = {
                                sql: "insert into t_gsgift(typeid,code) values(?,?)",
                                params: [para.typeid, codes[i]]
                            };
                            sqlparamsEntities.push(entity2);
                        }
                        var entity3 = {
                            sql: "update t_gsh5game set hasgift=1 where id=? and del=0",
                            params: [rows[0]['Id']]
                        };
                        sqlparamsEntities.push(entity3);
                        gameapi.conn.execTrans(sqlparamsEntities, function (err, data) {
                            if (err) {
                                req.send(null, 1, "重复数据");
                                return;
                            }
                            req.send({});
                        });
                    });
                });
            }
        });
    });
    app.AddSdkApi("adminuploadfile_vip", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var path = req.files['codefile'][0].path;
            var ext = path.substring(path.indexOf("."));
            if (ext.search(/.xls|.txt/i)) {
                req.send(null, 1, "文件类型错误");
                return;
            }
            if (".xls" == ext || ".xlsx" == ext) {
                var filepath = app.GetAbsPath("../public/management/code/" + para.typeid + "_" + para.gameid + "_" + para.giftname + ".xlsx");
                gameapi.MoveFile(path, filepath, function () {
                    e2j({
                        input: filepath,
                        output: "output.json" // output json
                    }, function (err, result) {
                        if (err) {
                            req.send(1, null, err);
                            return;
                        }
                        else {
                            var sql = "select Id from t_gsh5game where del=0 and name=?";
                            gameapi.conn.query(sql, [para.gamename], function (err, rows, fields) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    return;
                                }
                                var sqlparamsEntities = [];
                                var entity1 = {};
                                if (result.length == 1) {
                                    entity1.sql = "update t_gsgamegifttype set total=1,one=1 where id=?";
                                    entity1.params = [para.typeid];
                                }
                                else {
                                    entity1.sql = "update t_gsgamegifttype set total=total+? where id=?";
                                    entity1.params = [result.length, para.typeid];
                                }
                                sqlparamsEntities.push(entity1);
                                for (var i = 0; i < result.length; i++) {
                                    var entity2 = {
                                        sql: "insert into t_gsgamegift(typeid,code) values(?,?)",
                                        params: [para.typeid, result[i]]
                                    };
                                    sqlparamsEntities.push(entity2);
                                }
                                var entity3 = {
                                    sql: "update t_gsh5game set hasgift=1 where id=? and del=0",
                                    params: [rows[0]['Id']]
                                };
                                sqlparamsEntities.push(entity3);
                                gameapi.conn.execTrans(sqlparamsEntities, function (err, data) {
                                    if (err) {
                                        req.send(null, 1, "重复数据");
                                        return;
                                    }
                                    req.send({});
                                });
                            });
                        }
                    });
                });
            }
            else if (".txt" == ext) {
                var filepath = app.GetAbsPath("../public/management/code/" + para.typeid + "_" + para.gameid + "_" + para.giftname + ".txt");
                gameapi.MoveFile(path, filepath, function () {
                    var contentText = fs.readFileSync(filepath, 'utf-8');
                    var codes = contentText.split("\r\n");
                    var sql = "select Id from t_gsh5game where del=0 and name=?";
                    gameapi.conn.query(sql, [para.gamename], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            return;
                        }
                        var sqlparamsEntities = [];
                        var entity1 = {};
                        if (codes.length == 1) {
                            entity1.sql = "update t_gsgamegifttype set total=1,one=1 where id=?";
                            entity1.params = [para.typeid];
                        }
                        else {
                            entity1.sql = "update t_gsgamegifttype set total=total+? where id=?";
                            entity1.params = [codes.length, para.typeid];
                        }
                        sqlparamsEntities.push(entity1);
                        for (var i = 0; i < codes.length; i++) {
                            var entity2 = {
                                sql: "insert into t_gsgamegift(typeid,code) values(?,?)",
                                params: [para.typeid, codes[i]]
                            };
                            sqlparamsEntities.push(entity2);
                        }
                        var entity3 = {
                            sql: "update t_gsh5game set hasgift=1 where id=? and del=0",
                            params: [rows[0]['Id']]
                        };
                        sqlparamsEntities.push(entity3);
                        gameapi.conn.execTrans(sqlparamsEntities, function (err, data) {
                            if (err) {
                                req.send(null, 1, "重复数据");
                                return;
                            }
                            req.send({});
                        });
                    });
                });
            }
        });
    });
    var ADMINCHARGERANKREQ = (function (_super) {
        __extends(ADMINCHARGERANKREQ, _super);
        function ADMINCHARGERANKREQ() {
            _super.apply(this, arguments);
        }
        return ADMINCHARGERANKREQ;
    }(ADMINREQBASE));
    var ADMINCHARGERANK = (function () {
        function ADMINCHARGERANK() {
        }
        return ADMINCHARGERANK;
    }());
    app.AddSdkApi("adminchargerankdata", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "SELECT a.userid 用户,b.sdkid 渠道,SUM(a.payrmb) 累计充值,MIN(a.paytime) 首次充值时间,MAX(a.paytime) 最后充值时间,b.logtime 注册时间\n" +
                "FROM t_userpay a LEFT JOIN t_applog b ON b.appid = a.appid AND b.userid = a.userid AND (b.type = 4) WHERE a.state = 1\n";
            var sqlpara = [];
            switch (para.flags) {
                case 0:
                    sql += "AND DATE_FORMAT(a.paytime,'%Y-%m-%d')=?";
                    sqlpara.push(para.searchTime);
                    break;
                case 1:
                    sql += "AND YEARWEEK(date_format(a.paytime,'%Y-%m-%d')) = YEARWEEK(now())";
                    break;
                case 2:
                    sql += "AND date_format(a.paytime,'%Y-%m') = date_format(now(),'%Y-%m')";
                    break;
                case 3:
                    sql += "AND DATE_FORMAT(a.paytime,'%Y-%m-%d')<=?";
                    sqlpara.push(para.searchTime);
                    break;
            }
            sql += " GROUP BY a.userid ORDER BY 累计充值 DESC";
            gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var dat = new DATATABLE();
                dat.fields = [];
                for (var i = 0; i < fields.length; i++) {
                    dat.fields[i] = fields[i].name;
                }
                dat.rows = [];
                for (var i = 0; i < rows.length; i++) {
                    dat.rows[i] = rows[i];
                    if (rows[i]["首次充值时间"] != null && rows[i]["最后充值时间"] != null && rows[i]["注册时间"] != null) {
                        dat.rows[i].首次充值时间 = rows[i]["首次充值时间"].getTime();
                        dat.rows[i].最后充值时间 = rows[i]["最后充值时间"].getTime();
                        dat.rows[i].注册时间 = rows[i]["注册时间"].getTime();
                    }
                }
                req.send({ data: dat });
            });
        });
    });
    // app.AddSdkApi("adminchargerankdata", function (req) {
    //     var para: ADMINCHARGERANKREQ = req.param;
    //     CheckUser(para, err => {
    //         var params = [];
    //         if (err) {
    //             req.send(null, 1, err.message);
    //             return;
    //         }
    //         var sql="SELECT x.userid 用户,x.sdkid 渠道,x.sum 累计充值,x.min 首次充值时间,x.max 最后充值时间,x.regtime 注册时间,y.lastlogintime 最后活跃时间 FROM" +
    //             "(SELECT a.userid,b.sdkid,SUM(a.payrmb) sum,MIN(a.paytime) min,MAX(a.paytime) max,b.logtime regtime\n" +
    //             "FROM t_userpay a LEFT JOIN t_applog b ON b.appid = a.appid AND b.userid = a.userid AND (b.type = 4) WHERE a.state = 1\n";
    //         var sqlpara: any[] = [];
    //         switch (para.flags){
    //             case 0:
    //                 sql += "AND DATE_FORMAT(a.paytime,'%Y-%m-%d')=?";
    //                 sqlpara.push(para.searchTime);
    //                 break;
    //             case 1:
    //                 sql +="AND YEARWEEK(date_format(a.paytime,'%Y-%m-%d')) = YEARWEEK(now())"
    //                 break;
    //             case 2:
    //                 sql +="AND date_format(a.paytime,'%Y-%m') = date_format(now(),'%Y-%m')";
    //                 break;
    //             case 3:
    //                 sql += "AND DATE_FORMAT(a.paytime,'%Y-%m-%d')<=?";
    //                 sqlpara.push(para.searchTime);
    //                 break;
    //         }
    //         sql+=" GROUP BY userid) x LEFT JOIN (SELECT userid,MAX(logtime) lastlogintime FROM t_applog " +
    //             "WHERE (type = 2 OR type = 4) GROUP BY userid) y ON x.userid = y.userid ORDER BY x.sum DESC";
    //         gameapi.conn.query(sql, sqlpara, (err, rows, fields) => {
    //             if (err) {
    //                 req.send(null, 1, err.message);
    //                 throw err;
    //             }
    //             var dat = new DATATABLE();
    //             dat.fields = [];
    //             for (var i = 0; i < fields.length; i++) {
    //                 dat.fields[i] = fields[i].name;
    //             }
    //             dat.rows = [];
    //             for (var i = 0; i < rows.length; i++) {
    //                 dat.rows[i] = rows[i];
    //                 if(rows[i]["首次充值时间"]!=null&&rows[i]["最后充值时间"]!=null&&rows[i]["注册时间"]!=null&&rows[i]["最后活跃时间"]!=null){
    //                     dat.rows[i].首次充值时间 = rows[i]["首次充值时间"].getTime();
    //                     dat.rows[i].最后充值时间 = rows[i]["最后充值时间"].getTime();
    //                     dat.rows[i].注册时间 = rows[i]["注册时间"].getTime();
    //                     dat.rows[i].最后活跃时间 = rows[i]["最后活跃时间"].getTime();
    //                 }
    //             }
    //             req.send({data: dat});
    //         });
    //     });
    // });
    //单个玩家注册时间、充值详情等
    var USERPAYRECORD = (function () {
        function USERPAYRECORD() {
        }
        return USERPAYRECORD;
    }());
    var USERTIMEINFO //玩家注册、最后登录时间等时间信息
     = (function () {
        function USERTIMEINFO //玩家注册、最后登录时间等时间信息
            () {
        }
        return USERTIMEINFO //玩家注册、最后登录时间等时间信息
        ;
    }());
    var ADMINGETUSERDETAILREQ = (function (_super) {
        __extends(ADMINGETUSERDETAILREQ, _super);
        function ADMINGETUSERDETAILREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETUSERDETAILREQ;
    }(ADMINREQBASE));
    var ADMINGETUSERDETAILRESP = (function () {
        function ADMINGETUSERDETAILRESP() {
        }
        return ADMINGETUSERDETAILRESP;
    }());
    app.AddSdkApi("admingetuserdetail", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            //取得USERTIMEINFO
            var sql;
            var sqlpara;
            if (!para.is5wanuser) {
                sql = "select a.appid,a.sdkid,a.regtime ,b.lastlogintime, c.appname, d.sdkname, ifnull(e.paytotal,0) paytotal from(select 1) x\n" +
                    "left join(select appid,sdkid, logtime regtime from t_applog   where userid=? and type=4) a on 1=1\n" +
                    "left join (select appid,sdkid,max(logtime) lastlogintime from t_applog where userid=? and (type=2 or type=4) group by appid,sdkid) b\n" +
                    "on b.appid=a.appid  and b.sdkid=a.sdkid \n" +
                    "left join t_cpapp c on c.appid=a.appid\n" +
                    "left join t_sdktype d on d.id=a.sdkid\n" +
                    "left join (select a.appid,a.sdkid,sum(a.payrmb) paytotal from t_userpay a where a.userid=? and a.state>=1 group by appid,sdkid) e\n" +
                    "on e.appid=a.appid and e.sdkid=a.sdkid\n" +
                    "where a.sdkid is not null";
                sqlpara = [para.userid, para.userid, para.userid];
            }
            else {
                sql = "select a.appid, null sdkid,a.regtime ,b.lastlogintime, c.appname, '5玩'  sdkname, ifnull(e.paytotal,0) paytotal from(select 1) x\n" +
                    "left join(select appid, logtime regtime from t_applog   where userid=? and type=4 and sdkid is null) a on 1=1\n" +
                    "left join (select appid,max(logtime) lastlogintime from t_applog where userid=? and (type=2 or type=4) and sdkid is null group by appid ) b\n" +
                    "on b.appid=a.appid\n" +
                    "left join t_cpapp c on c.appid=a.appid\n" +
                    "left join (select a.appid,sum(a.payrmb) paytotal from t_userpay a where a.userid=? and a.state>=1 and sdkid is null group by appid) e\n" +
                    "on e.appid=a.appid ";
                sqlpara = [para.userid, para.userid, para.userid];
            }
            gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var ret = new ADMINGETUSERDETAILRESP();
                ret.timeinfo = [];
                for (var i = 0; i < rows.length; i++) {
                    ret.timeinfo[i] = rows[i];
                    if (ret.timeinfo[i].regtime)
                        ret.timeinfo[i].regtime = rows[i]["regtime"].getTime();
                    if (ret.timeinfo[i].lastlogintime)
                        ret.timeinfo[i].lastlogintime = rows[i]["lastlogintime"].getTime();
                }
                //取得USERPAYRECORD
                gameapi.conn.query("select a.payid,a.createtime,a.paytime,a.state,a.goodsname,a.goodsnum,a.money,a.payrmb,a.appid,a.sdkid,b.appname,\n" +
                    "case when c.sdkname is null then '5玩' else c.sdkname end sdkname from t_userpay a\n" +
                    "left join t_cpapp b on b.appid=a.appid\n" +
                    "left join t_sdktype c on c.id=a.sdkid\n" +
                    "where a.userid=? and  a.state>=1 order by a.paytime desc", [para.userid], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    ret.payrecord = [];
                    for (var i = 0; i < rows.length; i++) {
                        ret.payrecord[i] = rows[i];
                        if (ret.payrecord[i].createtime)
                            ret.payrecord[i].createtime = rows[i]["createtime"].getTime();
                        if (ret.payrecord[i].paytime)
                            ret.payrecord[i].paytime = rows[i]["paytime"].getTime();
                    }
                    req.send(ret);
                });
            });
        });
    });
    var ADMINGETYSHCPDETAILREQ = (function (_super) {
        __extends(ADMINGETYSHCPDETAILREQ, _super);
        function ADMINGETYSHCPDETAILREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETYSHCPDETAILREQ;
    }(ADMINREQBASE));
    var ADMINGETYSHCPDETAILINFO = (function () {
        function ADMINGETYSHCPDETAILINFO() {
        }
        return ADMINGETYSHCPDETAILINFO;
    }());
    var ADMINGETYSHCPDETAILRESP = (function () {
        function ADMINGETYSHCPDETAILRESP() {
        }
        return ADMINGETYSHCPDETAILRESP;
    }());
    app.AddSdkApi("admingetyshcpdetail", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            gameapi.conn.query("SELECT a.nickname,a.cextraofmonth,a.cmode,IFNULL(b.`总收入`, 0) totalIncome,IFNULL(c.`本月收入`, 0) monthIncome,IFNULL(d.`游戏数目`, 0) gamecount " +
                "FROM(SELECT cpid, cmode, cextraofmonth, nickname FROM t_cpuser WHERE del = 0 AND passstatus='已通过') a LEFT JOIN(SELECT c.cpid, c.nickname, SUM(payrmb) 总收入 FROM t_userpay a LEFT JOIN t_cpapp b ON a.appid = b.appid " +
                "LEFT JOIN t_cpuser c ON b.cpid = c.cpid GROUP BY c.cpid) b ON b.cpid = a.cpid " +
                "LEFT JOIN(SELECT c.cpid, c.nickname, SUM(payrmb) 本月收入 FROM t_userpay a LEFT JOIN t_cpapp b ON a.appid = b.appid LEFT JOIN t_cpuser c ON b.cpid = c.cpid WHERE date_format(a.paytime, '%Y-%m') = date_format(now(), '%Y-%m') GROUP BY c.cpid) c ON c.cpid = a.cpid " +
                "LEFT JOIN(SELECT b.cpid, b.nickname, COUNT(1) 游戏数目 FROM t_cpapp a LEFT JOIN t_cpuser b ON a.cpid = b.cpid GROUP BY b.cpid) d ON d.cpid = a.cpid", [], function (err, rows, fields) {
                var dataList = [];
                for (var i = 0; i < rows.length; i++) {
                    var data = rows[i];
                    dataList.push(rows[i]);
                }
                var ret = new ADMINGETYSHCPDETAILRESP();
                ret.data = dataList;
                req.send(ret);
            });
        });
    });
    //---------------------新版后台------------------------------
    //---------------------游戏数据------------------------------
    var ADMINGETPLAMFORMDATAREQ = (function (_super) {
        __extends(ADMINGETPLAMFORMDATAREQ, _super);
        function ADMINGETPLAMFORMDATAREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETPLAMFORMDATAREQ;
    }(ADMINREQBASE));
    var ADMINGETPLAMEFORMDATARESP = (function () {
        function ADMINGETPLAMEFORMDATARESP() {
        }
        return ADMINGETPLAMEFORMDATARESP;
    }());
    app.AddSdkApi("admingetplameformdata", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                var datares = new ADMINGETPLAMEFORMDATARESP();
                datares.todayUser = "没有权限";
                datares.weekUser = "没有权限";
                datares.monthUser = "没有权限";
                datares.totalUser = "没有权限";
                datares.todayIncome = "没有权限";
                datares.weekIncome = "没有权限";
                datares.monthIncome = "没有权限";
                datares.totalIncome = "没有权限";
                req.send(datares);
                return;
            }
            var sql1 = "SELECT ifnull(COUNT(1),0) AS todayUser FROM t_applog WHERE type = 4 AND logtime >= curdate() AND logtime < date_add(curdate(), INTERVAL 1 DAY) AND sdkid='0' ";
            gameapi.conn.query(sql1, [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var datares = new ADMINGETPLAMEFORMDATARESP();
                datares.todayUser = rows[0].todayUser;
                var sql2 = "SELECT ifnull(COUNT(1),0) AS weekUser FROM t_applog WHERE type = 4 AND YEARWEEK(date_format(logtime, '%Y-%m-%d')) = YEARWEEK(now()) AND sdkid='0' ";
                gameapi.conn.query(sql2, [], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    datares.weekUser = rows[0].weekUser;
                    var sql3 = "SELECT ifnull(COUNT(1),0) AS monthUser FROM t_applog WHERE type = 4 AND logtime >= DATE_ADD(curdate(), INTERVAL -DAY(curdate()) + 1 DAY) AND logtime < date_add(last_day(curdate()), INTERVAL 1 DAY) AND sdkid='0' ";
                    gameapi.conn.query(sql3, [], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        datares.monthUser = rows[0].monthUser;
                        var sql4 = "SELECT ifnull(COUNT(1),0) AS totalUser FROM t_applog WHERE type = 4 AND sdkid = 0 ";
                        gameapi.conn.query(sql4, [], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                throw err;
                            }
                            datares.totalUser = rows[0].totalUser;
                            var sql5 = "SELECT ifnull(SUM(payrmb),0) AS todayIncome FROM t_userpay WHERE state >= 1 AND paytime >= curdate() AND paytime < date_add(curdate(), INTERVAL 1 DAY) AND sdkid='0' ";
                            gameapi.conn.query(sql5, [], function (err, rows, fields) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    throw err;
                                }
                                datares.todayIncome = rows[0].todayIncome;
                                var sql6 = "SELECT ifnull(SUM(payrmb),0) AS weekIncome FROM t_userpay WHERE state >= 1 AND YEARWEEK(date_format(paytime, '%Y-%m-%d')) = YEARWEEK(now()) AND sdkid='0' ";
                                gameapi.conn.query(sql6, [], function (err, rows, fields) {
                                    if (err) {
                                        req.send(null, 1, err.message);
                                        throw err;
                                    }
                                    datares.weekIncome = rows[0].weekIncome;
                                    var sql7 = "SELECT ifnull(SUM(payrmb),0) AS monthIncome FROM t_userpay WHERE state >= 1 AND paytime >= DATE_ADD(curdate(), INTERVAL -DAY(curdate()) + 1 DAY) AND paytime < date_add(last_day(curdate()), INTERVAL 1 DAY) AND sdkid='0' ";
                                    gameapi.conn.query(sql7, [], function (err, rows, fields) {
                                        if (err) {
                                            req.send(null, 1, err.message);
                                            throw err;
                                        }
                                        datares.monthIncome = rows[0].monthIncome;
                                        var sql8 = "SELECT ifnull(SUM(payrmb),0) AS totalIncome FROM t_userpay WHERE state >= 1 AND sdkid='0' ";
                                        gameapi.conn.query(sql8, [], function (err, rows, fields) {
                                            if (err) {
                                                req.send(null, 1, err.message);
                                                throw err;
                                            }
                                            datares.totalIncome = rows[0].totalIncome;
                                            req.send(datares);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    var ADMINGAMECHARGEDATASEARCHREQ = (function (_super) {
        __extends(ADMINGAMECHARGEDATASEARCHREQ, _super);
        function ADMINGAMECHARGEDATASEARCHREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGAMECHARGEDATASEARCHREQ;
    }(ADMINREQBASE));
    var ADMINGAMECHARGEDATASEARCHRESP = (function () {
        function ADMINGAMECHARGEDATASEARCHRESP() {
        }
        return ADMINGAMECHARGEDATASEARCHRESP;
    }());
    app.AddSdkApi("admingcds", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var ret = new ADMINGAMECHARGEDATASEARCHRESP();
            //充值
            var param = [];
            var sql = "select a.appid,a.appname,sum(a.paysum) paysum,count(1) paycount from(\n" +
                "select a.appid,a.userid,b.appname, sum(a.payrmb) paysum ,count(1) paycount\n" +
                "from t_userpay a left join t_cpapp b on b.appid=a.appid and b.del=0\n" +
                "where a.state>=1 and a.paytime>=? and a.paytime<=?\n";
            param.push(para.timestart);
            param.push(para.timeend);
            if (pri.appname) {
                para.appname = pri.appname;
            }
            if (!!para.appname) {
                sql += " and b.appname like ?";
                param.push("%" + para.appname + "%");
            }
            sql += "  group by appid,userid) a\n" +
                "group by appid\n" +
                "order by paysum desc";
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                ret.paydata = RowToDatatable(rows, fields);
                //点击
                param = [];
                sql = "select a.appid,a.newuser,b.appname,createroleuser from ( \n" +
                    "select appid,sum(newuser)newuser,sum(createroleuser)createroleuser  from t_sdkappdaylog where logdate>=? and logdate<=? group by appid\n" +
                    ")a left join t_cpapp b on b.appid=a.appid and b.del=0";
                param.push(para.timestart);
                param.push(para.timeend);
                if (!!para.appname) {
                    sql = sql + " where b.appname like ?";
                    param.push("%" + para.appname + "%");
                }
                gameapi.conn.query(sql, param, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    ret.regdata = RowToDatatable(rows, fields);
                    param = [];
                    sql = "SELECT a.appid, b.appname, count(1) activeuser FROM " +
                        "( SELECT appid, logdate, userid FROM t_userdaylog WHERE logdate >= ? AND logdate <= ?  ) a " +
                        "LEFT JOIN t_cpapp b ON b.appid = a.appid and b.del=0";
                    param.push(para.timestart);
                    param.push(para.timeend);
                    if (!!para.appname) {
                        sql = sql + " where b.appname like ?";
                        param.push("%" + para.appname + "%");
                    }
                    sql += " GROUP BY a.appid";
                    gameapi.conn.query(sql, param, function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        ret.acdata = RowToDatatable(rows, fields);
                        param = [];
                        sql = "SELECT a.appid, b.appname, COUNT(a.userid) AS newpayuser, SUM(a.payrmb) AS newpaymoney FROM " +
                            "(SELECT a.appid, ifnull(a.sdkid, 0) AS sdkid, a.userid, SUM(a.payrmb) AS payrmb, date(a.paytime) AS today " +
                            "FROM t_userpay a INNER JOIN t_sdkgameuser b ON b.appid = a.appid AND b.sdkid = ifnull(a.sdkid, 0) AND b.userid = a.userid AND date(b.regtime) = date(a.paytime) " +
                            "WHERE a.paytime >= ? AND a.paytime <= ? GROUP BY appid, sdkid, userid, today ) a " +
                            "LEFT JOIN t_cpapp b ON b.appid = a.appid AND b.del = 0";
                        param.push(para.timestart);
                        param.push(para.timeend);
                        if (!!para.appname) {
                            sql = sql + " WHERE b.appname like ?";
                            param.push("%" + para.appname + "%");
                        }
                        sql += " GROUP BY appid";
                        gameapi.conn.query(sql, param, function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                exports.isbusy = false;
                                throw err;
                            }
                            ret.newpays = RowToDatatable(rows, fields);
                            req.send(ret);
                        });
                    });
                });
            });
        });
    });
    app.AddSdkApi("adminchanneldetail", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var ret = new ADMINGAMECHARGEDATASEARCHRESP();
            //充值
            var param = [];
            var sql = "SELECT a.*, b.profit FROM( SELECT a.appid, a.sdkid,a.sdkname, a.appname, sum(a.paysum) paysum, count(1) paycount FROM (\n" +
                "SELECT a.appid, a.sdkid, a.userid, b.sdkname, c.appname, sum(a.payrmb) paysum, count(1) paycount FROM t_userpay a LEFT JOIN t_sdktype b ON b.id = a.sdkid LEFT JOIN t_cpapp c ON c.appid = a.appid WHERE a.state >= 1 AND a.paytime>=? and a.paytime<=? AND sdkid =? GROUP BY appid, userid ) a GROUP BY appid )\n" +
                "a LEFT JOIN t_sdkapp b ON b.sdkid=a.sdkid GROUP BY appid ORDER BY paysum DESC\n";
            param.push(para.timestart);
            param.push(para.timeend);
            param.push(para.sdkid);
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                ret.paydata = RowToDatatable(rows, fields);
                param = [];
                sql = "SELECT a.appid,a.profit,a.appname,b.sdkname,a.cpprofit, count(1) activeuser FROM ( \n" +
                    "SELECT a.appid, a.sdkid, a.logdate, a.userid,c.profit,b.profit AS cpprofit,b.appname FROM t_userdaylog a  LEFT JOIN t_cpapp b ON b.appid = a.appid  LEFT JOIN t_sdkapp c ON c.sdkid = a.sdkid  AND a.appid=c.appid    WHERE a.logdate>=? and a.logdate<=? AND a.sdkid = ? GROUP BY a.appid, a.userid )\n" +
                    "a LEFT JOIN t_sdktype b ON b.id = a.sdkid GROUP BY a.appid  ORDER BY COUNT(1) DESC";
                param.push(para.timestart);
                param.push(para.timeend);
                param.push(para.sdkid);
                gameapi.conn.query(sql, param, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    ret.acdata = RowToDatatable(rows, fields);
                    param = [];
                    sql = "SELECT a.appid, a.sdkid, a.newuser, a.appname, createroleuser FROM (  " +
                        "  SELECT a.appid, a.sdkid, b.appname, sum(newuser) newuser, sum(createroleuser) createroleuser FROM t_sdkappdaylog a LEFT JOIN t_cpapp b ON b.appid = a.appid WHERE a.logdate>=? and a.logdate<=? AND a.sdkid = ? GROUP BY a.appid " +
                        "  ) a LEFT JOIN t_sdktype b ON b.id = a.sdkid ORDER BY a.newuser DESC  ";
                    param.push(para.timestart);
                    param.push(para.timeend);
                    param.push(para.sdkid);
                    gameapi.conn.query(sql, param, function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            exports.isbusy = false;
                            throw err;
                        }
                        ret.newpays = RowToDatatable(rows, fields);
                        req.send(ret);
                    });
                });
            });
        });
    });
    var ADMINCHANNELCHARGEDATASEARCHREQ = (function (_super) {
        __extends(ADMINCHANNELCHARGEDATASEARCHREQ, _super);
        function ADMINCHANNELCHARGEDATASEARCHREQ() {
            _super.apply(this, arguments);
        }
        return ADMINCHANNELCHARGEDATASEARCHREQ;
    }(ADMINREQBASE));
    var ADMINCHANNELCHARGEDATASEARCHRESP = (function () {
        function ADMINCHANNELCHARGEDATASEARCHRESP() {
        }
        return ADMINCHANNELCHARGEDATASEARCHRESP;
    }());
    app.AddSdkApi("adminccds", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send(null, 1, "没有权限");
                return;
            }
            var ret = new ADMINCHANNELCHARGEDATASEARCHRESP();
            //充值
            var param = [];
            var sql = "select a.sdkid,ifnull(a.sdkname,'5玩') sdkname,sum(a.paysum) paysum,count(1) paycount from(\n" +
                "select a.sdkid,a.userid,b.sdkname, sum(a.payrmb) paysum ,count(1) paycount\n" +
                "from t_userpay a left join t_sdktype b on b.id=a.sdkid\n" +
                "where a.state>=1 and a.paytime>=? and a.paytime<=?\n";
            param.push(para.timestart);
            param.push(para.timeend);
            if (!!para.sdkname) {
                sql += " and b.sdkname like ?";
                param.push("%" + para.sdkname + "%");
            }
            sql += "  group by sdkid,userid) a\n" +
                "group by sdkid\n" +
                "order by paysum desc";
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                ret.paydata = RowToDatatable(rows, fields);
                //点击
                param = [];
                sql = "select a.sdkid,a.newuser,ifnull(b.sdkname,'5玩') sdkname,createroleuser from ( \n" +
                    "select sdkid,sum(newuser)newuser,sum(createroleuser)createroleuser  from t_sdkappdaylog where logdate>=? and logdate<=? group by sdkid\n" +
                    ")a left join t_sdktype b on b.id=a.sdkid";
                param.push(para.timestart);
                param.push(para.timeend);
                if (!!para.sdkname) {
                    sql = sql + " where b.sdkname like ?";
                    param.push("%" + para.sdkname + "%");
                }
                gameapi.conn.query(sql, param, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    ret.regdata = RowToDatatable(rows, fields);
                    param = [];
                    sql = "SELECT a.sdkid, ifnull(b.sdkname,'5玩') sdkname, count(1) activeuser FROM " +
                        "(SELECT sdkid, logdate, userid FROM t_userdaylog WHERE logdate >= ? AND logdate <= ? GROUP BY sdkid, userid ) a " +
                        "LEFT JOIN t_sdktype b on b.id=a.sdkid";
                    param.push(para.timestart);
                    param.push(para.timeend);
                    if (!!para.sdkname) {
                        sql = sql + " where b.sdkname like ?";
                        param.push("%" + para.sdkname + "%");
                    }
                    sql += " GROUP BY a.sdkid";
                    gameapi.conn.query(sql, param, function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        ret.acdata = RowToDatatable(rows, fields);
                        req.send(ret);
                    });
                });
            });
        });
    });
    var ADMINUSERCHARGEDATASEARCHREQ = (function (_super) {
        __extends(ADMINUSERCHARGEDATASEARCHREQ, _super);
        function ADMINUSERCHARGEDATASEARCHREQ() {
            _super.apply(this, arguments);
        }
        return ADMINUSERCHARGEDATASEARCHREQ;
    }(ADMINREQBASE));
    var ADMINUSERCHARGEDATASEARCHRESP = (function () {
        function ADMINUSERCHARGEDATASEARCHRESP() {
        }
        return ADMINUSERCHARGEDATASEARCHRESP;
    }());
    app.AddSdkApi("adminucds", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var param = [];
            var sql = "select a.payid 订单ID,a.appid,c.appname 游戏,case when  b.sdkname is null then a.userid else d.sdkuserid end 用户ID,a.goodsname 商品名称,a.payrmb 支付金额,a.paytime 支付时间,case a.state when 1 then '支付成功' else '已支付但通知CP失败' end 状态 ,a.trade_no 渠道交易单号,a.sdkid 渠道ID,ifnull(b.sdkname,'5玩') 渠道\n" +
                "from t_userpay a left join t_sdktype b on b.id=a.sdkid\n" +
                "left join t_cpapp c on c.appid=a.appid\n" +
                "left join t_sdkuser d on d.userid=a.userid " +
                "where a.state>0 and a.paytime>=? and a.paytime<=?";
            param.push(para.timestart);
            param.push(para.timeend);
            if (!!para.sdkid) {
                if (para.sdkid == -1) {
                    sql += " and a.sdkid is null ";
                }
                else {
                    sql += " and a.sdkid=?";
                    param.push(para.sdkid);
                }
            }
            if (pri.appname) {
                para.appname = pri.appname;
            }
            if (!!para.appname) {
                sql += " and c.appname like ?";
                param.push("%" + para.appname + "%");
            }
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var ret = new ADMINUSERCHARGEDATASEARCHRESP();
                ret.data = RowToDatatable(rows, fields);
                req.send(ret);
            });
        });
    });
    var ADMINGAMEDATADETAILREQ = (function (_super) {
        __extends(ADMINGAMEDATADETAILREQ, _super);
        function ADMINGAMEDATADETAILREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGAMEDATADETAILREQ;
    }(ADMINREQBASE));
    var ADMINGAMEDATADETAILRESP = (function () {
        function ADMINGAMEDATADETAILRESP() {
        }
        return ADMINGAMEDATADETAILRESP;
    }());
    app.AddSdkApi("admingdds", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            var params = [];
            if (err) {
                exports.isbusy = false;
                req.send(null, 1, err.message);
                return;
            }
            /*if (pri.appname && (pri.appname != "%")) {
             req.send(null, 1, "没有权限");
             return;
             }*/
            var ret = new ADMINGETDATADETAILRESP();
            gameapi.conn.query("select id,sdkname from t_sdktype", [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    exports.isbusy = false;
                    throw err;
                }
                ret.sdktypes = [];
                for (var i = 0; i < rows.length; i++) {
                    ret.sdktypes[i] = rows[i];
                }
                var sql;
                var sqlpara;
                sql = "select appid, sdkid,logdate today,newuser from t_sdkappdaylog where appid=? and  logdate>=? and logdate<=? {1}  order by today";
                if (para.sdkid > 0) {
                    sql = sql.replace("{1}", " and sdkid=? ");
                    sqlpara = [para.appid, para.timestart, para.timeend, para.sdkid];
                }
                else {
                    if (para.sdkid === null)
                        sql = sql.replace("{1}", "");
                    else
                        sql = sql.replace("{1}", " and sdkid=0 ");
                    sqlpara = [para.appid, para.timestart, para.timeend];
                }
                gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        exports.isbusy = false;
                        throw err;
                    }
                    ret.newusers = [];
                    for (var i = 0; i < rows.length; i++) {
                        ret.newusers[i] = rows[i];
                        ret.newusers[i].today = rows[i]["today"].getTime();
                    }
                    //sql = "select appid,ifnull(sdkid,0) sdkid, count(1) totaluser from t_applog  where appid=? and type=4 and logtime<? {1} group by sdkid";
                    sql = "select appid,sdkid,count(1)totaluser from t_sdkgameuser where appid=? and  regtime<? {1} group by sdkid";
                    if (para.sdkid > 0) {
                        sql = sql.replace("{1}", " and sdkid=? ");
                        sqlpara = [para.appid, para.timestart, para.sdkid];
                    }
                    else {
                        if (para.sdkid === null)
                            sql = sql.replace("{1}", "");
                        else
                            sql = sql.replace("{1}", " and sdkid is null ");
                        sqlpara = [para.appid, para.timestart];
                    }
                    gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            exports.isbusy = false;
                            throw err;
                        }
                        ret.totalusers = [];
                        for (var i = 0; i < rows.length; i++) {
                            ret.totalusers[i] = rows[i];
                        }
                        sql = "select a.appid,ifnull(a.sdkid,0)sdkid,a.today ,count(1) activeuser from(\n" +
                            "select appid,sdkid,userid,logdate today  from t_userdaylog  where appid=?  and logdate>=? and logdate<=? {1} \n" +
                            ")a group by sdkid,today order by today";
                        if (para.sdkid > 0) {
                            sql = sql.replace("{1}", " and sdkid=? ");
                            sqlpara = [para.appid, para.timestart, para.timeend, para.sdkid];
                        }
                        else {
                            if (para.sdkid === null)
                                sql = sql.replace("{1}", "");
                            else
                                sql = sql.replace("{1}", " and sdkid =0 ");
                            sqlpara = [para.appid, para.timestart, para.timeend];
                        }
                        gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                exports.isbusy = false;
                                throw err;
                            }
                            ret.activeusers = [];
                            for (var i = 0; i < rows.length; i++) {
                                ret.activeusers[i] = rows[i];
                                ret.activeusers[i].today = rows[i]["today"].getTime();
                            }
                            sql = "select a.appid,a.sdkid,a.today,count(a.userid) newpayuser,sum(a.payrmb) newpaymoney from(\n" +
                                "select a.appid,ifnull(a.sdkid,0) sdkid,a.userid, sum(a.payrmb) payrmb,date(a.paytime) today from t_userpay a\n" +
                                "inner join t_sdkgameuser b on b.appid=a.appid and b.sdkid=ifnull(a.sdkid,0) and b.userid=a.userid and date(b.regtime)=date(a.paytime)\n" +
                                "where a.appid=? and a.paytime>=? and a.paytime<=? {1}\n" +
                                "group by appid,sdkid,userid,today\n" +
                                ") a group by appid,sdkid,today";
                            if (para.sdkid > 0) {
                                sql = sql.replace("{1}", " and a.sdkid=? ");
                                sqlpara = [para.appid, para.timestart, para.timeend, para.sdkid];
                            }
                            else {
                                if (para.sdkid === null)
                                    sql = sql.replace("{1}", "");
                                else
                                    sql = sql.replace("{1}", " and a.sdkid is null ");
                                sqlpara = [para.appid, para.timestart, para.timeend];
                            }
                            gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    exports.isbusy = false;
                                    throw err;
                                }
                                ret.newpays = [];
                                for (var i = 0; i < rows.length; i++) {
                                    ret.newpays[i] = rows[i];
                                    ret.newpays[i].today = rows[i]["today"].getTime();
                                }
                                sql = "select appid,ifnull(sdkid,0) sdkid,sum(payrmb) incometoday ,date(paytime) today from t_userpay where appid=? and state>=1 and paytime>=? and paytime<=? {1} group by sdkid,today order by today";
                                if (para.sdkid > 0) {
                                    sql = sql.replace("{1}", " and sdkid=? ");
                                    sqlpara = [para.appid, para.timestart, para.timeend, para.sdkid];
                                }
                                else {
                                    if (para.sdkid === null)
                                        sql = sql.replace("{1}", "");
                                    else
                                        sql = sql.replace("{1}", " and sdkid is null ");
                                    sqlpara = [para.appid, para.timestart, para.timeend];
                                }
                                gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                                    if (err) {
                                        req.send(null, 1, err.message);
                                        exports.isbusy = false;
                                        throw err;
                                    }
                                    ret.incometodays = [];
                                    for (var i = 0; i < rows.length; i++) {
                                        ret.incometodays[i] = rows[i];
                                        ret.incometodays[i].today = rows[i]["today"].getTime();
                                    }
                                    sql = "select appid,ifnull(sdkid,0) sdkid,sum(payrmb) incometotal from t_userpay where appid=? and state>=1 and paytime<? {1} group by sdkid";
                                    if (para.sdkid > 0) {
                                        sql = sql.replace("{1}", " and sdkid=? ");
                                        sqlpara = [para.appid, para.timestart, para.sdkid];
                                    }
                                    else {
                                        if (para.sdkid === null)
                                            sql = sql.replace("{1}", "");
                                        else
                                            sql = sql.replace("{1}", " and sdkid is null ");
                                        sqlpara = [para.appid, para.timestart];
                                    }
                                    gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                                        if (err) {
                                            req.send(null, 1, err.message);
                                            exports.isbusy = false;
                                            throw err;
                                        }
                                        ret.incometotals = [];
                                        for (var i = 0; i < rows.length; i++) {
                                            ret.incometotals[i] = rows[i];
                                        }
                                        sql = "select a.appid,a.sdkid,a.today,count(1) payuser from (\n" +
                                            "select appid,ifnull(sdkid,0) sdkid,date(paytime) today\n" +
                                            "from t_userpay where appid=? and state>=1 and paytime>=? and paytime<=? {1}\n" +
                                            "group by sdkid,userid,today\n" +
                                            ")a group by sdkid,today order by today";
                                        if (para.sdkid > 0) {
                                            sql = sql.replace("{1}", " and sdkid=? ");
                                            sqlpara = [para.appid, para.timestart, para.timeend, para.sdkid];
                                        }
                                        else {
                                            if (para.sdkid === null)
                                                sql = sql.replace("{1}", "");
                                            else
                                                sql = sql.replace("{1}", " and sdkid is null ");
                                            sqlpara = [para.appid, para.timestart, para.timeend];
                                        }
                                        gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                                            if (err) {
                                                req.send(null, 1, err.message);
                                                exports.isbusy = false;
                                                throw err;
                                            }
                                            ret.payusers = [];
                                            for (var i = 0; i < rows.length; i++) {
                                                ret.payusers[i] = rows[i];
                                                ret.payusers[i].today = rows[i]["today"].getTime();
                                            }
                                            sql = "select appid,ifnull(sdkid,0) sdkid,count(1) payuserstotal from t_userpay where appid=? and state>=1 and paytime<? {1} group by sdkid";
                                            if (para.sdkid > 0) {
                                                sql = sql.replace("{1}", " and sdkid=? ");
                                                sqlpara = [para.appid, para.timestart, para.sdkid];
                                            }
                                            else {
                                                if (para.sdkid === null)
                                                    sql = sql.replace("{1}", "");
                                                else
                                                    sql = sql.replace("{1}", " and sdkid is null ");
                                                sqlpara = [para.appid, para.timestart];
                                            }
                                            gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                                                if (err) {
                                                    req.send(null, 1, err.message);
                                                    exports.isbusy = false;
                                                    throw err;
                                                }
                                                ret.payuserstotals = [];
                                                for (var i = 0; i < rows.length; i++) {
                                                    ret.payuserstotals[i] = rows[i];
                                                }
                                                fun1();
                                            });
                                            function fun1() {
                                                //总计
                                                if (para.sdkid === null || para.sdkid === 0) {
                                                    if (para.sdkid === null)
                                                        sql = "select 1,ifnull(a.newuser,0) newuser,ifnull(b.totaluser,0) totaluser,ifnull(c.activeuser,0) activeuser,ifnull(d.income,0) income,ifnull(e.payuser,0)payuser,ifnull(e.payuser/c.activeuser,0) payrate,ifnull(d.income/c.activeuser,0) arpu,ifnull(d.income/e.payuser,0) arppu from (select 1) x left join(\n" +
                                                            "select a.appid,sum(a.newuser) newuser from(select appid,sdkid, count(1) newuser from t_sdkgameuser where appid=? and  regtime>=? and regtime<=? group by sdkid)a)a on 1=1\n" +
                                                            "left join(\n" +
                                                            "select appid, count(1) totaluser from t_sdkgameuser  where appid=?)b on 1=1\n" +
                                                            "left join(\n" +
                                                            "select a.appid,count(1)activeuser from(select appid,sdkid ,logdate,userid from t_userdaylog  where appid=? and logdate>=? and logdate<=? group by appid,sdkid,userid)a )c on 1=1\n" +
                                                            "left join(\n" +
                                                            "select appid,sum(payrmb) income from t_userpay where appid=? and state>=1 and paytime>=? and paytime<=?) d on 1=1\n" +
                                                            "left join(\n" +
                                                            "select a.appid,sum(a.payuser)payuser from( select a.appid,a.sdkid,count(1) payuser from(select appid,sdkid,userid from t_userpay where appid=? and state>=1 and paytime>=? and paytime<=?  group by sdkid,userid) a group by sdkid)a)e on 1=1\n" +
                                                            "left join(\n" +
                                                            "select appid,sum(payrmb) incometotal from t_userpay where appid=? and state>=1) f on 1=1";
                                                    else
                                                        sql = "select 1,ifnull(a.newuser,0) newuser,ifnull(b.totaluser,0) totaluser,ifnull(c.activeuser,0) activeuser,ifnull(d.income,0) income,ifnull(e.payuser,0)payuser,ifnull(e.payuser/c.activeuser,0) payrate,ifnull(d.income/c.activeuser,0) arpu,ifnull(d.income/e.payuser,0) arppu from (select 1) x left join(\n" +
                                                            "select a.appid,sum(a.newuser) newuser from(select appid,sdkid, count(1) newuser from t_sdknewuser where appid=? and regtime>=? and regtime<=? and sdkid=0)a)a on 1=1\n" +
                                                            "left join(\n" +
                                                            "select appid, count(1) totaluser from t_sdkgameuser  where appid=? and sdkid=0)b on 1=1\n" +
                                                            "left join(\n" +
                                                            "select a.appid,count(1)activeuser from(select appid,sdkid ,logdate,userid from t_userdaylog  where appid=? and logdate>=? and logdate<=? and sdkid=0 group by appid,sdkid,userid)a )c on 1=1\n" +
                                                            "left join(\n" +
                                                            "select appid,sum(payrmb) income from t_userpay where appid=? and state>=1 and paytime>=? and paytime<=? and sdkid is null) d on 1=1\n" +
                                                            "left join(\n" +
                                                            "select a.appid,sum(a.payuser)payuser from( select a.appid,a.sdkid,count(1) payuser from(select appid,sdkid,userid from t_userpay where appid=? and state>=1 and paytime>=? and paytime<=? and sdkid is null group by sdkid,userid) a group by sdkid)a)e on 1=1\n" +
                                                            "left join(\n" +
                                                            "select appid,sum(payrmb) incometotal from t_userpay where appid=? and state>=1 and sdkid is null) f on 1=1";
                                                    sqlpara = [para.appid, para.timestart, para.timeend,
                                                        para.appid,
                                                        para.appid, para.timestart, para.timeend,
                                                        para.appid, para.timestart, para.timeend,
                                                        para.appid, para.timestart, para.timeend,
                                                        para.appid];
                                                }
                                                else {
                                                    sql = "select 1,ifnull(a.newuser,0) newuser,ifnull(b.totaluser,0) totaluser,ifnull(c.activeuser,0) activeuser,ifnull(d.income,0) income,ifnull(e.payuser,0)payuser,ifnull(e.payuser/c.activeuser,0) payrate,ifnull(d.income/c.activeuser,0) arpu,ifnull(d.income/e.payuser,0) arppu from (select 1) x left join(\n" +
                                                        "select a.appid,sum(a.newuser) newuser from(select appid,sdkid, count(1) newuser from t_sdkgameuser where appid=? and regtime>=? and regtime<=? and sdkid=? group by sdkid)a)a on 1=1\n" +
                                                        "left join(\n" +
                                                        "select appid, count(1) totaluser from t_sdkgameuser  where appid=? and sdkid=?)b on 1=1\n" +
                                                        "left join(\n" +
                                                        "select a.appid,count(1)activeuser from(select appid,sdkid ,logdate,userid from t_userdaylog  where appid=? and logdate>=? and logdate<=? and sdkid=? group by appid,sdkid,userid)a )c on 1=1\n" +
                                                        "left join(\n" +
                                                        "select appid,sum(payrmb) income from t_userpay where appid=? and state>=1 and paytime>=? and paytime<=? and sdkid=?) d on 1=1\n" +
                                                        "left join(\n" +
                                                        "select a.appid,sum(a.payuser)payuser from( select a.appid,a.sdkid,count(1) payuser from(select appid,sdkid,userid from t_userpay where appid=? and state>=1 and paytime>=? and paytime<=? and sdkid=? group by sdkid,userid) a group by sdkid)a)e on 1=1\n" +
                                                        "left join(\n" +
                                                        "select appid,sum(payrmb) incometotal from t_userpay where appid=? and state>=1 and sdkid=?) f on 1=1";
                                                    sqlpara = [para.appid, para.timestart, para.timeend, para.sdkid,
                                                        para.appid, para.sdkid,
                                                        para.appid, para.timestart, para.timeend, para.sdkid,
                                                        para.appid, para.timestart, para.timeend, para.sdkid,
                                                        para.appid, para.timestart, para.timeend, para.sdkid,
                                                        para.appid, para.sdkid];
                                                }
                                                gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                                                    if (err) {
                                                        req.send(null, 1, err.message);
                                                        exports.isbusy = false;
                                                        throw err;
                                                    }
                                                    ret.totaluser = rows[0]["totaluser"];
                                                    ret.newuser = rows[0]["newuser"];
                                                    ret.payuser = rows[0]["payuser"];
                                                    ret.activeuser = rows[0]["activeuser"];
                                                    ret.payrate = rows[0]["payrate"];
                                                    ret.income = rows[0]["income"];
                                                    ret.arpu = rows[0]["arpu"];
                                                    ret.arppu = rows[0]["arppu"];
                                                    exports.isbusy = false;
                                                    req.send(ret);
                                                });
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    var ADMINGAMEKEEPDATADETAILREQ = (function (_super) {
        __extends(ADMINGAMEKEEPDATADETAILREQ, _super);
        function ADMINGAMEKEEPDATADETAILREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGAMEKEEPDATADETAILREQ;
    }(ADMINREQBASE));
    var ADMINGAMEKEEPDATADETAILRESP = (function () {
        function ADMINGAMEKEEPDATADETAILRESP() {
        }
        return ADMINGAMEKEEPDATADETAILRESP;
    }());
    app.AddSdkApi("admingkds", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            var params = [];
            if (err) {
                exports.isbusy = false;
                req.send(null, 1, err.message);
                return;
            }
            /*if (pri.appname && (pri.appname != "%")) {
             req.send(null, 1, "没有权限");
             return;
             }*/
            var ret = new ADMINGAMEKEEPDATADETAILRESP();
            gameapi.conn.query("select id,sdkname from t_sdktype", [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    exports.isbusy = false;
                    throw err;
                }
                ret.sdktypes = [];
                for (var i = 0; i < rows.length; i++) {
                    ret.sdktypes[i] = rows[i];
                }
                var sql;
                var sqlpara;
                sql = "select a.appid,ifnull(a.sdkid,0)sdkid,a.today ,count(1) activeuser from(\n" +
                    "select appid,sdkid,userid,logdate today  from t_userdaylog  where appid=?  and logdate>=? and logdate<=? {1} \n" +
                    ")a group by sdkid,today order by today";
                if (para.sdkid > 0) {
                    sql = sql.replace("{1}", " and sdkid=? ");
                    sqlpara = [para.appid, para.timestart, para.timeend, para.sdkid];
                }
                else {
                    if (para.sdkid === null)
                        sql = sql.replace("{1}", "");
                    else
                        sql = sql.replace("{1}", " and sdkid = 0 ");
                    sqlpara = [para.appid, para.timestart, para.timeend];
                }
                gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        exports.isbusy = false;
                        throw err;
                    }
                    ret.activeusers = [];
                    for (var i = 0; i < rows.length; i++) {
                        ret.activeusers[i] = rows[i];
                        ret.activeusers[i].today = rows[i]["today"].getTime();
                    }
                    sql = "select appid, sdkid,logdate today,newuser from t_sdkappdaylog where appid=? and  logdate>=? and logdate<=? {1}  order by today";
                    if (para.sdkid > 0) {
                        sql = sql.replace("{1}", " and sdkid=? ");
                        sqlpara = [para.appid, para.timestart, para.timeend, para.sdkid];
                    }
                    else {
                        if (para.sdkid === null)
                            sql = sql.replace("{1}", "");
                        else
                            sql = sql.replace("{1}", " and sdkid=0 ");
                        sqlpara = [para.appid, para.timestart, para.timeend];
                    }
                    gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            exports.isbusy = false;
                            throw err;
                        }
                        ret.newusers = [];
                        for (var i = 0; i < rows.length; i++) {
                            ret.newusers[i] = rows[i];
                            ret.newusers[i].today = rows[i]["today"].getTime();
                        }
                        sql = "select a.appid,a.sdkid,date(a.regtime) today,\n" +
                            "sum(case when b.logdate is null then 0 else 1 end) keeps1,\n" +
                            "sum(case when c.logdate is null then 0 else 1 end) keeps2,\n" +
                            "sum(case when d.logdate is null then 0 else 1 end) keeps3,\n" +
                            "sum(case when e.logdate is null then 0 else 1 end) keeps4,\n" +
                            "sum(case when f.logdate is null then 0 else 1 end) keeps5,\n" +
                            "sum(case when g.logdate is null then 0 else 1 end) keeps6,\n" +
                            "sum(case when h.logdate is null then 0 else 1 end) keeps7,\n" +
                            "sum(case when i.logdate is null then 0 else 1 end) keeps14,\n" +
                            "sum(case when j.logdate is null then 0 else 1 end) keeps21,\n" +
                            "sum(case when k.logdate is null then 0 else 1 end) keeps30\n" +
                            "from t_sdkgameuser a\n" +
                            "left join t_userdaylog b on b.logdate=date_add(date(a.regtime), interval 1 day) and b.appid=a.appid and b.sdkid=a.sdkid and b.userid=a.userid\n" +
                            "left join t_userdaylog c on c.logdate=date_add(date(a.regtime), interval 2 day) and c.appid=a.appid and c.sdkid=a.sdkid and c.userid=a.userid\n" +
                            "left join t_userdaylog d on d.logdate=date_add(date(a.regtime), interval 3 day) and d.appid=a.appid and d.sdkid=a.sdkid and d.userid=a.userid\n" +
                            "left join t_userdaylog e on e.logdate=date_add(date(a.regtime), interval 4 day) and e.appid=a.appid and e.sdkid=a.sdkid and e.userid=a.userid\n" +
                            "left join t_userdaylog f on f.logdate=date_add(date(a.regtime), interval 5 day) and f.appid=a.appid and f.sdkid=a.sdkid and f.userid=a.userid\n" +
                            "left join t_userdaylog g on g.logdate=date_add(date(a.regtime), interval 6 day) and g.appid=a.appid and g.sdkid=a.sdkid and g.userid=a.userid\n" +
                            "left join t_userdaylog h on h.logdate=date_add(date(a.regtime), interval 7 day) and h.appid=a.appid and h.sdkid=a.sdkid and h.userid=a.userid\n" +
                            "left join t_userdaylog i on i.logdate=date_add(date(a.regtime), interval 14 day) and i.appid=a.appid and i.sdkid=a.sdkid and i.userid=a.userid\n" +
                            "left join t_userdaylog j on j.logdate=date_add(date(a.regtime), interval 21 day) and j.appid=a.appid and j.sdkid=a.sdkid and j.userid=a.userid\n" +
                            "left join t_userdaylog k on k.logdate=date_add(date(a.regtime), interval 30 day) and k.appid=a.appid and k.sdkid=a.sdkid and k.userid=a.userid\n" +
                            "where a.appid=? and a.regtime>=? and a.regtime<=? {1} group by appid,sdkid,today order by today";
                        if (para.sdkid > 0) {
                            sql = sql.replace("{1}", " and a.sdkid=? ");
                            sqlpara = [para.appid, para.timestart, para.timeend, para.sdkid];
                        }
                        else {
                            if (para.sdkid === null)
                                sql = sql.replace("{1}", "");
                            else
                                sql = sql.replace("{1}", " and a.sdkid=0 ");
                            sqlpara = [para.appid, para.timestart, para.timeend];
                        }
                        gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                exports.isbusy = false;
                                throw err;
                            }
                            ret.keeps = [];
                            for (var i_2 = 0; i_2 < rows.length; i_2++) {
                                ret.keeps[i_2] = rows[i_2];
                                ret.keeps[i_2].today = rows[i_2]["today"].getTime();
                            }
                            req.send(ret);
                        });
                    });
                });
            });
        });
    });
    //开服表
    var ADMINGETALLOPENTABLEREQ = (function (_super) {
        __extends(ADMINGETALLOPENTABLEREQ, _super);
        function ADMINGETALLOPENTABLEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLOPENTABLEREQ;
    }(ADMINREQBASE));
    var ADMINGETALLOPENTABLEINFO = (function () {
        function ADMINGETALLOPENTABLEINFO() {
        }
        return ADMINGETALLOPENTABLEINFO;
    }());
    var ADMINGETALLTABLERESP = (function () {
        function ADMINGETALLTABLERESP() {
        }
        return ADMINGETALLTABLERESP;
    }());
    var ADMINDELOPENTABLE = (function (_super) {
        __extends(ADMINDELOPENTABLE, _super);
        function ADMINDELOPENTABLE() {
            _super.apply(this, arguments);
        }
        return ADMINDELOPENTABLE;
    }(ADMINGETALLOPENTABLEINFO));
    var ADMINGETCHECKGIFTTABLEREQ = (function (_super) {
        __extends(ADMINGETCHECKGIFTTABLEREQ, _super);
        function ADMINGETCHECKGIFTTABLEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHECKGIFTTABLEREQ;
    }(ADMINREQBASE));
    var ADMINADDOPENTABLEREQ = (function (_super) {
        __extends(ADMINADDOPENTABLEREQ, _super);
        function ADMINADDOPENTABLEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDOPENTABLEREQ;
    }(ADMINREQBASE));
    //获取开服列表
    app.AddSdkApi("admingetalltable", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "select Id from t_gsserver where del=0 ";
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var sql = "SELECT id,b.appname,a.serverName,openTime,updatetime,createtime as createTime  FROM t_gsserver a LEFT JOIN t_cpapp b ON a.gameid = b.appid WHERE a.del = 0   ";
                var params = [];
                if (!!para.time) {
                    sql += " AND DATE_FORMAT(a.openTime,'%Y-%m-%d')=?";
                    params.push(para.time);
                }
                if (!!para.tablename) {
                    sql += "and appname like '%" + para.tablename + "%' ";
                }
                sql += " ORDER BY appname,createtime DESC ";
                gameapi.conn.query(sql, params, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var opentablelist = [];
                    for (var i = 0; i < rows.length; i++) {
                        var info = rows[i];
                        opentablelist[i] = info;
                    }
                    var ret = new ADMINGETALLTABLERESP();
                    ret.tablelist = opentablelist;
                    req.send(ret);
                });
            });
        });
    });
    //首页banner统计
    var LISTCOUNTBANNERREQ = (function (_super) {
        __extends(LISTCOUNTBANNERREQ, _super);
        function LISTCOUNTBANNERREQ() {
            _super.apply(this, arguments);
        }
        return LISTCOUNTBANNERREQ;
    }(ADMINREQBASE));
    var LISTCOUNTBANNERINFO = (function () {
        function LISTCOUNTBANNERINFO() {
        }
        return LISTCOUNTBANNERINFO;
    }());
    app.AddSdkApi("getcountbanner", function (req) {
        var para = req.param;
        var sql = "SELECT type, COUNT(1) count FROM t_gsaddrcount WHERE del = 0  ";
        var params = [];
        if (!!para.time) {
            sql += " AND DATE_FORMAT(createtime,'%Y-%m-%d')=?";
            params.push(para.time);
        }
        sql += "  GROUP BY type ORDER BY type DESC ";
        gameapi.conn.query(sql, params, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var opentablelist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                opentablelist[i] = info;
            }
            req.send(opentablelist);
        });
    });
    //开服表相关
    app.AddSdkApi("adminaddtable", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            if (!!para.id) {
                var sql = "update t_gsserver set serverName=?,openTime=? where id=?";
                gameapi.conn.query(sql, [para.serverName, para.openTime, para.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send({});
                });
            }
            else {
                var sql = "INSERT INTO t_gsserver (gameid,serverName,openTime) VALUES ((SELECT appid FROM t_cpapp WHERE appname =? and del = 0 and status = '已通过'),?,?)";
                gameapi.conn.query(sql, [para.gamename, para.serverName, para.openTime], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send({});
                });
            }
        });
    });
    //获取开服表多选列表
    app.AddSdkApi("admingetchecktablelist", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var ret = [];
            if (para.tablename.length == 0) {
                req.send(null, 1, "请勾选需要通过的数据");
                return;
            }
            for (var i = 0; i < para.tablename.length; i++) {
                gameapi.conn.query("SELECT id,b.appname,a.serverName,openTime,updatetime,createtime FROM t_gsserver a LEFT JOIN t_cpapp b ON a.gameid = b.appid WHERE a.del = 0  " +
                    " and serverName=?", [para.tablename[i]], function (err, rows, fields) {
                    var giftinfo = rows[0];
                    ret.push(giftinfo);
                    if (ret.length == para.tablename.length) {
                        req.send(ret);
                        return;
                    }
                    ;
                });
            }
        });
    });
    //多选删除开服表
    app.AddSdkApi("admindeltable", function (req) {
        var params = req.param;
        for (var i = 0; i < params.length; i++) {
            var para = params[i];
            (function (para) {
                gameapi.conn.query("update t_gsserver set del=? where serverName=?", ["1", para.serverName], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                });
            }).call(this, para);
        }
        req.send({});
    });
    //获取用户信息
    var ADMINGETALLLISTUSERREQ = (function (_super) {
        __extends(ADMINGETALLLISTUSERREQ, _super);
        function ADMINGETALLLISTUSERREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLLISTUSERREQ;
    }(ADMINREQBASE));
    var ADMINGETALLLISTUSERINFO = (function () {
        function ADMINGETALLLISTUSERINFO() {
        }
        return ADMINGETALLLISTUSERINFO;
    }());
    var ADMINGETALLLISTUSERRESP = (function () {
        function ADMINGETALLLISTUSERRESP() {
        }
        return ADMINGETALLLISTUSERRESP;
    }());
    app.AddSdkApi("admingetalluser", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "SELECT  userid,nickname,phone,regtime,regip FROM t_gameuser WHERE pwd IS NOT NULL    ";
            var params = [];
            if (!!para.time) {
                sql += " AND regtime >= ?";
                params.push(para.time);
            }
            if (!!para.tablename) {
                sql += "and userid like '%" + para.tablename + "%' ";
            }
            sql += " ORDER BY regtime DESC ";
            gameapi.conn.query(sql, params, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var userlist = [];
                for (var i = 0; i < rows.length; i++) {
                    var info = rows[i];
                    userlist[i] = info;
                }
                var ret = new ADMINGETALLLISTUSERRESP();
                ret.userlist = userlist;
                req.send(ret);
            });
        });
    });
    //获取平台VIP用户信息
    app.AddSdkApi("admingetallvipuser", function (req) {
        var para = req.param;
        CheckUser(para, function (err) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var sql = "SELECT c.* FROM ( SELECT a.*, SUM(b.payrmb) AS pay FROM ( SELECT userid, nickname, phone, email FROM t_gameuser a WHERE pwd IS NOT NULL ) a LEFT JOIN t_userpay b ON b.userid = a.userid WHERE b.payrmb > 0 AND b.sdkid = 0 GROUP BY b.userid ORDER BY pay DESC ) c WHERE (1)    ";
            var params = [];
            if (!!para.time) {
                if (para.time == "VIP1") {
                    sql += " AND c.pay >= 6 and c.pay < 50";
                }
                if (para.time == "VIP2") {
                    sql += " AND c.pay >= 50 and c.pay < 100";
                }
                if (para.time == "VIP3") {
                    sql += " AND c.pay >= 100 and c.pay < 200";
                }
                if (para.time == "VIP4") {
                    sql += "  AND c.pay >= 200 and c.pay < 500";
                }
                if (para.time == "VIP5") {
                    sql += " AND c.pay >= 500 and c.pay < 2000 ";
                }
                if (para.time == "VIP6") {
                    sql += " AND c.pay >= 2000 and c.pay < 5000 ";
                }
                if (para.time == "VIP7") {
                    sql += "AND c.pay >= 5000 and c.pay < 10000  ";
                }
                if (para.time == "VIP8") {
                    sql += " AND c.pay >= 10000 and c.pay < 30000 ";
                }
                if (para.time == "VIP9") {
                    sql += "  AND c.pay >= 30000 and c.pay < 50000 ";
                }
                if (para.time == "VIP10") {
                    sql += "AND c.pay >= 50000 and c.pay < 100000 ";
                }
                if (para.time == "VIP11") {
                    sql += "AND c.pay >= 100000 and c.pay < 200000  ";
                }
                if (para.time == "VIP12") {
                    sql += " AND c.pay >= 200000 and c.pay < 360000 ";
                }
                if (para.time == "VIP13") {
                    sql += " AND c.pay >= 360000 and c.pay < 700000 ";
                }
                if (para.time == "VIP14") {
                    sql += "AND c.pay >= 700000 and c.pay < 1200000  ";
                }
                if (para.time == "VIP15") {
                    sql += " AND c.pay >= 1200000 ";
                }
            }
            if (!!para.tablename) {
                sql += "and c.userid like '%" + para.tablename + "%' ";
            }
            gameapi.conn.query(sql, params, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var userlist = [];
                for (var i = 0; i < rows.length; i++) {
                    var info = rows[i];
                    userlist[i] = info;
                }
                var ret = new ADMINGETALLLISTUSERRESP();
                ret.userlist = userlist;
                req.send(ret);
            });
        });
    });
    //获取用户进入游戏具体信息
    var ADMINGETALLLISTUSERGAMEREQ = (function (_super) {
        __extends(ADMINGETALLLISTUSERGAMEREQ, _super);
        function ADMINGETALLLISTUSERGAMEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLLISTUSERGAMEREQ;
    }(ADMINREQBASE));
    var ADMINGETALLLISTUSERGAMEINFO = (function () {
        function ADMINGETALLLISTUSERGAMEINFO() {
        }
        return ADMINGETALLLISTUSERGAMEINFO;
    }());
    var ADMINGETALLLISTUSERGAMERESP = (function () {
        function ADMINGETALLLISTUSERGAMERESP() {
        }
        return ADMINGETALLLISTUSERGAMERESP;
    }());
    app.AddSdkApi("admingetallusergame", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "SELECT  c.sdkuserid,b.`name`,c.regip,a.createtime  FROM t_gsuserh5log a  LEFT JOIN t_gsh5game b ON a.gameid = b.Id  LEFT JOIN t_gsuser c ON a.userid = c.userid  WHERE c.sdkuserid =?     ";
            var params = [];
            params.push(para.userid);
            if (!!para.time) {
                sql += " AND DATE_FORMAT(regtime,'%Y-%m-%d')=?";
                params.push(para.time);
            }
            if (!!para.tablename) {
                sql += "and name like '%" + para.tablename + "%' ";
            }
            sql += " ORDER BY regtime DESC ";
            gameapi.conn.query(sql, params, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var usergamelist = [];
                for (var i = 0; i < rows.length; i++) {
                    var info = rows[i];
                    usergamelist[i] = info;
                }
                var ret = new ADMINGETALLLISTUSERGAMERESP();
                ret.usergamelist = usergamelist;
                req.send(ret);
            });
        });
    });
    //VIPQQ
    var ADMINGETALLVIPQQREQ = (function (_super) {
        __extends(ADMINGETALLVIPQQREQ, _super);
        function ADMINGETALLVIPQQREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLVIPQQREQ;
    }(ADMINREQBASE));
    var ADMINGETALLVIPQQINFO = (function () {
        function ADMINGETALLVIPQQINFO() {
        }
        return ADMINGETALLVIPQQINFO;
    }());
    var ADMINGETALLVIPQQRESP = (function () {
        function ADMINGETALLVIPQQRESP() {
        }
        return ADMINGETALLVIPQQRESP;
    }());
    var ADMINADDVIPQQREQ = (function (_super) {
        __extends(ADMINADDVIPQQREQ, _super);
        function ADMINADDVIPQQREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDVIPQQREQ;
    }(ADMINREQBASE));
    //获取VIPQQ列表
    app.AddSdkApi("admingetallvipqq", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "SELECT id,qqname,qqnum,createtime FROM t_gsvipqq WHERE del=0  ";
            var params = [];
            gameapi.conn.query(sql, params, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var opentablelist = [];
                for (var i = 0; i < rows.length; i++) {
                    var info = rows[i];
                    opentablelist[i] = info;
                }
                var ret = new ADMINGETALLVIPQQRESP();
                ret.vipqqlist = opentablelist;
                req.send(ret);
            });
        });
    });
    //更新VIPQQ
    app.AddSdkApi("adminupdatevipqq", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "update t_gsvipqq set qqnum=? where id=?";
            gameapi.conn.query(sql, [para.qqnum, para.id], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                req.send({});
            });
        });
    });
    var INDEXTITLEINFO = (function () {
        function INDEXTITLEINFO() {
        }
        return INDEXTITLEINFO;
    }());
    var INDEXGAMEREQ = (function () {
        function INDEXGAMEREQ() {
        }
        return INDEXGAMEREQ;
    }());
    //获取首页分类title
    app.AddSdkApi("getindextitle", function (req) {
        var sql = "SELECT id,title FROM t_gsindextitle WHERE del = 0  ";
        gameapi.conn.query(sql, [], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var opentablelist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                opentablelist[i] = info;
            }
            req.send(opentablelist);
        });
    });
    //更新首页title
    app.AddSdkApi("saveindextitle", function (req) {
        var para = req.param;
        var sql = "update t_gsindextitle set title=? where id=?";
        gameapi.conn.query(sql, [para, para.id], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            req.send({});
        });
    });
    app.AddSdkApi("getindextitlegame", function (req) {
        var sql = "SELECT Id,`name`,type FROM t_gsh5game WHERE del = 0 AND type BETWEEN 1 AND 5   ";
        gameapi.conn.query(sql, [], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var opentablelist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                opentablelist[i] = info;
            }
            req.send(opentablelist);
        });
    });
    app.AddSdkApi("saveindexgame", function (req) {
        var para = req.param;
        var sql = "UPDATE t_gsh5game SET type = ? WHERE `name` = ? AND del = 0";
        gameapi.conn.query("UPDATE t_gsh5game SET type = 0 WHERE type = ?", [para.type], function (err, rows, fields) {
            for (var i = 0; i < para.appname.length; i++) {
                gameapi.conn.query(sql, [para.type, para.appname[i]], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                });
            }
            req.send({});
        });
    });
    app.AddSdkApi("getsearchgamelist", function (req) {
        var sql = "SELECT id as Id,appname as name  FROM t_gssearch WHERE del = 0  ";
        gameapi.conn.query(sql, [], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var opentablelist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                opentablelist[i] = info;
            }
            req.send(opentablelist);
        });
    });
    var ADBANNERINFO = (function () {
        function ADBANNERINFO() {
        }
        return ADBANNERINFO;
    }());
    app.AddSdkApi("getadbannerlist", function (req) {
        var sql = "SELECT * FROM t_gsadbanner WHERE del = 0  ";
        gameapi.conn.query(sql, [], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var opentablelist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.banner = gameapi.GetServerUrl("gamecenter/indexbanner/" + rows[i]["id"] + ".png");
                opentablelist[i] = info;
            }
            req.send(opentablelist);
        });
    });
    app.AddSdkApi("savesearchgame", function (req) {
        var para = req.param;
        var sql = "UPDATE t_gssearch SET appname = ? WHERE id = ?";
        for (var i = 0; i < para.appname.length; i++) {
            gameapi.conn.query(sql, [para.appname[i], i + 1], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
            });
        }
        req.send({});
    });
    //活动相关数据
    var ADMINGETALLACTIVITYREQ = (function (_super) {
        __extends(ADMINGETALLACTIVITYREQ, _super);
        function ADMINGETALLACTIVITYREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLACTIVITYREQ;
    }(ADMINREQBASE));
    var ADMINGETALLACTIVITYINFO = (function () {
        function ADMINGETALLACTIVITYINFO() {
        }
        return ADMINGETALLACTIVITYINFO;
    }());
    var ADMINGETALLACTIVITYDETAILINFO = (function () {
        function ADMINGETALLACTIVITYDETAILINFO() {
        }
        return ADMINGETALLACTIVITYDETAILINFO;
    }());
    var ADMINGETALLACTIVITYRESP = (function () {
        function ADMINGETALLACTIVITYRESP() {
        }
        return ADMINGETALLACTIVITYRESP;
    }());
    var ADMINGETALLACTIVITYRDETAILESP = (function () {
        function ADMINGETALLACTIVITYRDETAILESP() {
        }
        return ADMINGETALLACTIVITYRDETAILESP;
    }());
    var ADMINDELACTIVITY = (function (_super) {
        __extends(ADMINDELACTIVITY, _super);
        function ADMINDELACTIVITY() {
            _super.apply(this, arguments);
        }
        return ADMINDELACTIVITY;
    }(ADMINGETALLACTIVITYINFO));
    var ADMINGETCHECKACTIVITYREQ = (function (_super) {
        __extends(ADMINGETCHECKACTIVITYREQ, _super);
        function ADMINGETCHECKACTIVITYREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHECKACTIVITYREQ;
    }(ADMINREQBASE));
    var ADMINADDACTIVITYREQ = (function (_super) {
        __extends(ADMINADDACTIVITYREQ, _super);
        function ADMINADDACTIVITYREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDACTIVITYREQ;
    }(ADMINREQBASE));
    //获取活动列表
    app.AddSdkApi("admingetallactivity", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "select Id from t_gsgameactivity where del=0 ";
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var sql = "SELECT a.id,a.title,a.lable,a.ishot,a.prise,a.rule,a.typename,a.atype,a.createtime,a.`server`,(SELECT COUNT(*) AS counts FROM t_gsentergameac WHERE activityid = a.id ) AS count,a.starttime,a.endtime,a.gameid,b.appname FROM t_gsgameactivity a LEFT JOIN t_cpapp b ON a.gameid = b.appid AND b.del = 0 WHERE a.del = 0 ";
                var params = [];
                if (!!para.time) {
                    sql += " AND DATE_FORMAT(a.createtime,'%Y-%m-%d')=?";
                    params.push(para.time);
                }
                if (!!para.title) {
                    sql += "and title like '%" + para.title + "%' ";
                }
                sql += " ORDER BY createtime DESC ";
                gameapi.conn.query(sql, params, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var activitylist = [];
                    for (var i = 0; i < rows.length; i++) {
                        var info = rows[i];
                        info.createtime = rows[i]["createtime"].getTime();
                        activitylist[i] = info;
                    }
                    var ret = new ADMINGETALLACTIVITYRESP();
                    ret.activitylist = activitylist;
                    req.send(ret);
                });
            });
        });
    });
    //获取活动列表
    app.AddSdkApi("admingetoneactivity", function (req) {
        var para = req.param;
        var sql = "SELECT a.*,b.appname FROM( SELECT id, gameid, title, prise, `server`, rule, detail, starttime, " +
            " endtime, typename, atype, createtime, lable, ishot FROM t_gsgameactivity WHERE id = ? )a " +
            "  LEFT JOIN t_cpapp b ON b.appid = a.gameid";
        var params = [para.activityid];
        gameapi.conn.query(sql, params, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var activitylist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.createtime = rows[i]["createtime"].getTime();
                info.banner = gameapi.GetServerUrl("gamecenter/actbanner/" + info.id + ".png");
                activitylist[i] = info;
            }
            req.send(activitylist);
        });
    });
    //活动列表相关
    app.AddSdkApi("adminaddactivity", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            if (!!para.id) {
                var sql = "select Id from t_gsgameactivity where del=0 and title=?";
                gameapi.conn.query(sql, [para.title], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var sql = "update t_gsgameactivity set title=?,prise=?,server=?,rule=?,detail=?,starttime=?,endtime=?,lable=?,ishot=?,atype=? where id=?";
                    gameapi.conn.query(sql, [para.title, para.prise, para.server, para.rule, para.detail, para.starttime, para.endtime, para.typename, para.ishot, para.atype, para.id], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            return;
                        }
                        var relatePath = "../public/gamecenter/actbanner/" + para.id + ".png";
                        SaveFile(relatePath, req);
                    });
                });
            }
            else {
                var sql = "select Id from t_gsgameactivity where del=0 ";
                gameapi.conn.query(sql, [], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var sql = "INSERT INTO t_gsgameactivity (gameid,title,prise,server,rule,detail,starttime,endtime,lable,atype,ishot) VALUES ((SELECT appid FROM t_cpapp WHERE appname =? and del=0),?,?,?,?,?,?,?,?,?,?)";
                    gameapi.conn.query(sql, [para.appname, para.title, para.prise, para.server, para.rule, para.detail, para.starttime, para.endtime, para.typename, para.atype, para.ishot], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            return;
                        }
                        var gameid = rows.insertId;
                        var relatePath = "../public/gamecenter/actbanner/" + gameid + ".png";
                        SaveFile(relatePath, req);
                    });
                });
            }
        });
    });
    //活动列表相关
    app.AddSdkApi("addindexfirstbanner", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "select Id from t_gsgameactivity where del=0 ";
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var sql = "UPDATE t_gsadbanner SET appname = ?, gameid = ( SELECT Id AS gameid FROM t_gsh5game WHERE NAME = ? AND del = 0 ),del = 0 WHERE id = ? ";
                gameapi.conn.query(sql, [para.appname, para.appname, para.count], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var relatePath = "../public/gamecenter/indexbanner/" + para.count + ".png";
                    SaveFile(relatePath, req);
                });
            });
        });
    });
    //获取活动多选列表
    app.AddSdkApi("admingetcheckactivitylist", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var ret = [];
            if (para.title.length == 0) {
                req.send(null, 1, "请勾选需要通过的数据");
                return;
            }
            for (var i = 0; i < para.title.length; i++) {
                gameapi.conn.query("SELECT a.id,a.title,a.detail,a.prise,a.rule,a.typename,a.atype,a.createtime,a.`server`,(SELECT COUNT(*) AS counts FROM t_gsentergameac WHERE activityid = a.id ) AS count,a.starttime,a.endtime,a.gameid,b.appname FROM t_gsgameactivity a LEFT JOIN t_cpapp b ON a.gameid = b.appid AND b.del = 0 WHERE a.del = 0   " +
                    " and title=?", [para.title[i]], function (err, rows, fields) {
                    var giftinfo = rows[0];
                    ret.push(giftinfo);
                    if (ret.length == para.title.length) {
                        req.send(ret);
                        return;
                    }
                    ;
                });
            }
        });
    });
    //多选删除活动
    app.AddSdkApi("admindelallactivity", function (req) {
        var params = req.param;
        for (var i = 0; i < params.length; i++) {
            var para = params[i];
            (function (para) {
                gameapi.conn.query("update t_gsgameactivity set del=? where id=?", ["1", para.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                });
            }).call(this, para);
        }
        req.send({});
    });
    //获取具体活动列表
    app.AddSdkApi("admingetallactivitydetail", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "select Id from t_gsgameactivity where del=0 ";
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var sql = "SELECT	a.*, sum(b.payrmb) paymoney FROM(	SELECT	a.*, b.userid	FROM	(	SELECT	a.*,b.appname	FROM	(SELECT a.id,	a.loginid,a.playname,a.areaname,a.createtime,b.gameid,b.title,b.prise,	b.`server`,b.rule,b.atype,b.detail,	b.starttime,b.endtime	FROM	t_gsentergameac a	LEFT JOIN t_gsgameactivity b ON a.activityid = b.Id	WHERE		b.id IS NOT NULL	AND b.atype = 3	) a LEFT JOIN t_cpapp b ON a.gameid = b.appid) a LEFT JOIN t_gameuser b ON a.loginid = b.loginid) a LEFT JOIN t_userpay b ON a.userid = b.userid AND a.gameid = b.appid AND (	b.paytime >= a.starttime	AND b.paytime <= a.endtime) GROUP BY userid, gameid   ";
                var params = [];
                if (!!para.time) {
                    sql = " SELECT	a.*, sum(b.payrmb) paymoney FROM(	SELECT	a.*, b.userid	FROM	(	SELECT	a.*,b.appname	FROM	(SELECT a.id,	a.loginid,a.playname,a.areaname,a.createtime,b.gameid,b.title,b.prise,	b.`server`,b.rule,b.atype,b.detail,	b.starttime,b.endtime	FROM	t_gsentergameac a	LEFT JOIN t_gsgameactivity b ON a.activityid = b.Id	WHERE		b.id IS NOT NULL	AND b.atype = 3   AND DATE_FORMAT(a.createtime,'%Y-%m-%d')=?	) a LEFT JOIN t_cpapp b ON a.gameid = b.appid) a LEFT JOIN t_gameuser b ON a.loginid = b.loginid) a LEFT JOIN t_userpay b ON a.userid = b.userid AND a.gameid = b.appid AND (	b.paytime >= a.starttime	AND b.paytime <= a.endtime) GROUP BY userid, gameid  ";
                    params.push(para.time);
                }
                if (!!para.title) {
                    sql = "SELECT	a.*, sum(b.payrmb) paymoney FROM(	SELECT	a.*, b.userid	FROM	(	SELECT	a.*,b.appname	FROM	(SELECT a.id,	a.loginid,a.playname,a.areaname,a.createtime,b.gameid,b.title,b.prise,	b.`server`,b.rule,b.atype,b.detail,	b.starttime,b.endtime	FROM	t_gsentergameac a	LEFT JOIN t_gsgameactivity b ON a.activityid = b.Id	WHERE		b.id IS NOT NULL	AND b.atype = 3    and loginid like '%" + para.title + "%'	) a LEFT JOIN t_cpapp b ON a.gameid = b.appid) a LEFT JOIN t_gameuser b ON a.loginid = b.loginid) a LEFT JOIN t_userpay b ON a.userid = b.userid AND a.gameid = b.appid AND (	b.paytime >= a.starttime	AND b.paytime <= a.endtime) GROUP BY userid, gameid    ";
                }
                sql += " ORDER BY createtime DESC ";
                gameapi.conn.query(sql, params, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var activitylist = [];
                    for (var i = 0; i < rows.length; i++) {
                        var info = rows[i];
                        info.createtime = rows[i]["createtime"].getTime();
                        activitylist[i] = info;
                    }
                    var ret = new ADMINGETALLACTIVITYRDETAILESP();
                    ret.detaillist = activitylist;
                    req.send(ret);
                });
            });
        });
    });
    //获取具体活动列表
    app.AddSdkApi("admingetallactivitydetail2", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "select Id from t_gsgameactivity where del=0 ";
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var sql = "SELECT	a.*, sum(b.payrmb) paymoney FROM(	SELECT	a.*, b.userid	FROM	(	SELECT	a.*,b.appname	FROM	(SELECT a.id,	a.loginid,a.playname,a.areaname,a.createtime,b.gameid,b.title,b.prise,	b.`server`,b.rule,b.atype,b.detail,	b.starttime,b.endtime	FROM	t_gsentergameac a	LEFT JOIN t_gsgameactivity b ON a.activityid = b.Id	WHERE		b.id IS NOT NULL	AND b.atype = 2	) a LEFT JOIN t_cpapp b ON a.gameid = b.appid) a LEFT JOIN t_gameuser b ON a.loginid = b.loginid) a LEFT JOIN t_userpay b ON a.userid = b.userid AND a.gameid = b.appid AND (	b.paytime >= a.starttime	AND b.paytime <= a.endtime) GROUP BY userid, gameid   ";
                var params = [];
                if (!!para.time) {
                    sql = " SELECT	a.*, sum(b.payrmb) paymoney FROM(	SELECT	a.*, b.userid	FROM	(	SELECT	a.*,b.appname	FROM	(SELECT a.id,	a.loginid,a.playname,a.areaname,a.createtime,b.gameid,b.title,b.prise,	b.`server`,b.rule,b.atype,b.detail,	b.starttime,b.endtime	FROM	t_gsentergameac a	LEFT JOIN t_gsgameactivity b ON a.activityid = b.Id	WHERE		b.id IS NOT NULL	AND b.atype = 2   AND DATE_FORMAT(a.createtime,'%Y-%m-%d')=?	) a LEFT JOIN t_cpapp b ON a.gameid = b.appid) a LEFT JOIN t_gameuser b ON a.loginid = b.loginid) a LEFT JOIN t_userpay b ON a.userid = b.userid AND a.gameid = b.appid AND (	b.paytime >= a.starttime	AND b.paytime <= a.endtime) GROUP BY userid, gameid  ";
                    params.push(para.time);
                }
                if (!!para.title) {
                    sql = "SELECT	a.*, sum(b.payrmb) paymoney FROM(	SELECT	a.*, b.userid	FROM	(	SELECT	a.*,b.appname	FROM	(SELECT a.id,	a.loginid,a.playname,a.areaname,a.createtime,b.gameid,b.title,b.prise,	b.`server`,b.rule,b.atype,b.detail,	b.starttime,b.endtime	FROM	t_gsentergameac a	LEFT JOIN t_gsgameactivity b ON a.activityid = b.Id	WHERE		b.id IS NOT NULL	AND b.atype = 2   and loginid like '%" + para.title + "%'	) a LEFT JOIN t_cpapp b ON a.gameid = b.appid) a LEFT JOIN t_gameuser b ON a.loginid = b.loginid) a LEFT JOIN t_userpay b ON a.userid = b.userid AND a.gameid = b.appid AND (	b.paytime >= a.starttime	AND b.paytime <= a.endtime) GROUP BY userid, gameid    ";
                }
                sql += " ORDER BY createtime DESC ";
                gameapi.conn.query(sql, params, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var activitylist = [];
                    for (var i = 0; i < rows.length; i++) {
                        var info = rows[i];
                        info.createtime = rows[i]["createtime"].getTime();
                        activitylist[i] = info;
                    }
                    var ret = new ADMINGETALLACTIVITYRDETAILESP();
                    ret.detaillist = activitylist;
                    req.send(ret);
                });
            });
        });
    });
    //消息相关数据
    var ADMINGETALLMESSAGEREQ = (function (_super) {
        __extends(ADMINGETALLMESSAGEREQ, _super);
        function ADMINGETALLMESSAGEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLMESSAGEREQ;
    }(ADMINREQBASE));
    var ADMINGETALLMESSAGEINFO = (function () {
        function ADMINGETALLMESSAGEINFO() {
        }
        return ADMINGETALLMESSAGEINFO;
    }());
    var ADMINGETALLMESSAGEDETAILINFO = (function () {
        function ADMINGETALLMESSAGEDETAILINFO() {
        }
        return ADMINGETALLMESSAGEDETAILINFO;
    }());
    var ADMINGETALLMESSAGERESP = (function () {
        function ADMINGETALLMESSAGERESP() {
        }
        return ADMINGETALLMESSAGERESP;
    }());
    var ADMINGETALLMESSAGEDETAILESP = (function () {
        function ADMINGETALLMESSAGEDETAILESP() {
        }
        return ADMINGETALLMESSAGEDETAILESP;
    }());
    var ADMINDELMESSAGE = (function (_super) {
        __extends(ADMINDELMESSAGE, _super);
        function ADMINDELMESSAGE() {
            _super.apply(this, arguments);
        }
        return ADMINDELMESSAGE;
    }(ADMINGETALLMESSAGEINFO));
    var ADMINGETCHECKMESSAGEREQ = (function (_super) {
        __extends(ADMINGETCHECKMESSAGEREQ, _super);
        function ADMINGETCHECKMESSAGEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHECKMESSAGEREQ;
    }(ADMINREQBASE));
    var ADMINADDMESSAGEREQ = (function (_super) {
        __extends(ADMINADDMESSAGEREQ, _super);
        function ADMINADDMESSAGEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDMESSAGEREQ;
    }(ADMINREQBASE));
    //获取消息列表
    app.AddSdkApi("admingetallmessage", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "select Id from t_gsmessage where del=0 ";
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var sql = " SELECT a.id,a.title,a.detail,a.sender,b.loginid,a.createtime,a.updatetime FROM t_gsmessage a LEFT JOIN t_gsmessagelog b on b.msgid=a.id WHERE a.del = 0 and b.del=0  ";
                var params = [];
                if (!!para.time) {
                    sql += " AND DATE_FORMAT(a.createtime,'%Y-%m-%d')=?";
                    params.push(para.time);
                }
                if (!!para.messagename) {
                    sql += "and title like '%" + para.messagename + "%' ";
                }
                sql += " ORDER BY createtime DESC ";
                gameapi.conn.query(sql, params, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var messagelist = [];
                    for (var i = 0; i < rows.length; i++) {
                        var info = rows[i];
                        info.createtime = rows[i]["createtime"].getTime();
                        info.loginname = rows[i].loginid;
                        messagelist[i] = info;
                    }
                    req.send(messagelist);
                });
            });
        });
    });
    //保存消息
    app.AddSdkApi("adminaddmessage", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "select Id from t_gsmessage where del=0 ";
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var sql = "INSERT INTO t_gsmessage (title,detail,sender) VALUES (?,?,?)";
                gameapi.conn.query(sql, [para.title, para.detail, para.sender], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send({});
                });
                if (!!para.loginname) {
                    var sql = "INSERT INTO t_gsmessagelog (msgid,loginid) VALUES ((select id from t_gsmessage where title=? ORDER BY createtime DESC LIMIT 1),?)";
                    gameapi.conn.query(sql, [para.title, para.loginname], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            return;
                        }
                        req.send({});
                    });
                }
                else {
                    if (!para.loginname) {
                        var sql = "INSERT INTO t_gsmessagelog (msgid,loginid) VALUES ((select id from t_gsmessage where title=? ORDER BY createtime DESC LIMIT 1),?)";
                        gameapi.conn.query(sql, [para.title, null], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                return;
                            }
                            req.send({});
                        });
                    }
                }
            });
        });
    });
    //获取消息多选列表
    app.AddSdkApi("admingetcheckmessagelist", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var ret = [];
            if (para.messagename.length == 0) {
                req.send(null, 1, "请勾选需要通过的数据");
                return;
            }
            for (var i = 0; i < para.messagename.length; i++) {
                gameapi.conn.query("SELECT a.id,a.title,a.detail,a.sender,b.loginid,a.createtime,a.updatetime FROM t_gsmessage a LEFT JOIN t_gsmessagelog b on b.msgid=a.id WHERE a.del = 0 and b.del=0   " +
                    " and title=?", [para.messagename[i]], function (err, rows, fields) {
                    var messageinfo = rows[0];
                    ret.push(messageinfo);
                    if (ret.length == para.messagename.length) {
                        req.send(ret);
                        return;
                    }
                    ;
                });
            }
        });
    });
    //多选删除消息
    app.AddSdkApi("admindelallmessage", function (req) {
        var params = req.param;
        for (var i = 0; i < params.length; i++) {
            var para = params[i];
            (function (para) {
                gameapi.conn.query("UPDATE t_gsmessagelog a LEFT JOIN t_gsmessage b on a.msgid=b.id SET a.del =?,b.del=? WHERE msgid =?", ["1", "1", para.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                });
            }).call(this, para);
        }
        req.send({});
    });
    //用户反馈信息相关数据
    var ADMINGETALLFEEDBACKREQ = (function (_super) {
        __extends(ADMINGETALLFEEDBACKREQ, _super);
        function ADMINGETALLFEEDBACKREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLFEEDBACKREQ;
    }(ADMINREQBASE));
    var ADMINGETALFEEDBACKINFO = (function () {
        function ADMINGETALFEEDBACKINFO() {
        }
        return ADMINGETALFEEDBACKINFO;
    }());
    var ADMINGETALLFEEDBACKINFO = (function () {
        function ADMINGETALLFEEDBACKINFO() {
        }
        return ADMINGETALLFEEDBACKINFO;
    }());
    var ADMINGETALLFEEDBACKRESP = (function () {
        function ADMINGETALLFEEDBACKRESP() {
        }
        return ADMINGETALLFEEDBACKRESP;
    }());
    var ADMINGETALLFEEDBACKESP = (function () {
        function ADMINGETALLFEEDBACKESP() {
        }
        return ADMINGETALLFEEDBACKESP;
    }());
    var ADMINDELFEEDBACK = (function (_super) {
        __extends(ADMINDELFEEDBACK, _super);
        function ADMINDELFEEDBACK() {
            _super.apply(this, arguments);
        }
        return ADMINDELFEEDBACK;
    }(ADMINGETALLFEEDBACKINFO));
    var ADMINGETCHECKFEEDBACKREQ = (function (_super) {
        __extends(ADMINGETCHECKFEEDBACKREQ, _super);
        function ADMINGETCHECKFEEDBACKREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHECKFEEDBACKREQ;
    }(ADMINREQBASE));
    var ADMINADDFEEDBACKREQ = (function (_super) {
        __extends(ADMINADDFEEDBACKREQ, _super);
        function ADMINADDFEEDBACKREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDFEEDBACKREQ;
    }(ADMINREQBASE));
    //获取用户反馈信息列表
    app.AddSdkApi("admingetallfeedback", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "select Id from t_gsproblem where del=0 ";
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var sql = " SELECT  a.id,a.userid,b.nickname,a.gname,a.title,a.detail,a.`server`,a.ptype,a.`status`,a.createtime,a.updatetime FROM t_gsproblem a LEFT JOIN t_gameuser b on b.userid=a.userid  WHERE a.del = 0   ";
                var params = [];
                if (!!para.time) {
                    sql += " AND DATE_FORMAT(a.createtime,'%Y-%m-%d')=?";
                    params.push(para.time);
                }
                if (!!para.backname) {
                    sql += "and title like '%" + para.backname + "%' ";
                }
                sql += " ORDER BY createtime DESC ";
                gameapi.conn.query(sql, params, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var feedbacklist = [];
                    for (var i = 0; i < rows.length; i++) {
                        var info = rows[i];
                        info.createtime = rows[i]["createtime"].getTime();
                        feedbacklist[i] = info;
                    }
                    var ret = new ADMINGETALLFEEDBACKRESP();
                    ret.feedbacklist = feedbacklist;
                    req.send(ret);
                });
            });
        });
    });
    //获取反馈消息多选列表
    app.AddSdkApi("admingetcheckfeedbacklist", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var ret = [];
            if (para.feedbackname.length == 0) {
                req.send(null, 1, "请勾选需要通过的数据");
                return;
            }
            for (var i = 0; i < para.feedbackname.length; i++) {
                gameapi.conn.query("SELECT  a.id,a.userid,b.nickname,a.gname,a.title,a.detail,a.`server`,a.ptype,a.`status`,a.createtime,a.updatetime FROM t_gsproblem a LEFT JOIN t_gameuser b on b.userid=a.userid  WHERE a.del = 0   " +
                    " and id=?", [para.feedbackname[i]], function (err, rows, fields) {
                    var feedbackinfo = rows[0];
                    ret.push(feedbackinfo);
                    if (ret.length == para.feedbackname.length) {
                        req.send(ret);
                        return;
                    }
                    ;
                });
            }
        });
    });
    //多选删除反馈消息
    app.AddSdkApi("admindelallfeedback", function (req) {
        var params = req.param;
        for (var i = 0; i < params.length; i++) {
            var para = params[i];
            (function (para) {
                gameapi.conn.query("UPDATE t_gsproblem  SET del =? WHERE id =?", ["1", para.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                });
            }).call(this, para);
        }
        req.send({});
    });
    //处理反馈问题
    app.AddSdkApi("adminadddealproblem", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "select Id from t_gsmessage where del=0 ";
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var sql = "INSERT INTO t_gsmessage (title,detail,sender) VALUES (?,?,?)";
                gameapi.conn.query(sql, [para.title, para.detail, para.sender], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send({});
                });
                var sql = "INSERT INTO t_gsmessagelog (msgid,loginid) VALUES ((select id from t_gsmessage where title=? ORDER BY createtime DESC LIMIT 1),(SELECT loginid FROM t_gameuser WHERE userid=?))";
                gameapi.conn.query(sql, [para.title, para.loginname], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send({});
                });
                var sql = "UPDATE t_gsproblem set `status`=? WHERE id=?";
                gameapi.conn.query(sql, ['已处理', para.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send({});
                });
            });
        });
    });
    var ADMINGETALLGAMENAMEINFO = (function () {
        function ADMINGETALLGAMENAMEINFO() {
        }
        return ADMINGETALLGAMENAMEINFO;
    }());
    var ADMINGETALLGAMENAMERESP = (function () {
        function ADMINGETALLGAMENAMERESP() {
        }
        return ADMINGETALLGAMENAMERESP;
    }());
    app.AddSdkApi("admingetchannelcountnew", function (req) {
        CheckUser(req.param, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send({});
                return;
            }
            var sql = " SELECT  appname from t_cpapp where del=0 and status='未审核'   ";
            var params = [];
            gameapi.conn.query(sql, params, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var feedbacklist = [];
                for (var i = 0; i < rows.length; i++) {
                    var info = rows[i];
                    feedbacklist[i] = info;
                }
                var ret = new ADMINGETALLGAMENAMERESP();
                ret.gamename = feedbacklist;
                req.send(ret);
            });
        });
    });
    app.AddSdkApi("admingetallgamenamenew", function (req) {
        CheckUser(req.param, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send({});
                return;
            }
            var sql = " SELECT  appname from t_cpapp where del=0    ";
            var params = [];
            gameapi.conn.query(sql, params, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var feedbacklist = [];
                for (var i = 0; i < rows.length; i++) {
                    var info = rows[i];
                    feedbacklist[i] = info;
                }
                var ret = new ADMINGETALLGAMENAMERESP();
                ret.gamename = feedbacklist;
                req.send(ret);
            });
        });
    });
    app.AddSdkApi("admingetnewgamenamenew", function (req) {
        CheckUser(req.param, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send({});
                return;
            }
            var sql = "SELECT appname FROM t_cpapp  WHERE del=0 and YEARWEEK(date_format(addtime,'%Y-%m-%d')) = YEARWEEK(now())   ";
            var params = [];
            gameapi.conn.query(sql, params, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var feedbacklist = [];
                for (var i = 0; i < rows.length; i++) {
                    var info = rows[i];
                    feedbacklist[i] = info;
                }
                var ret = new ADMINGETALLGAMENAMERESP();
                ret.gamename = feedbacklist;
                req.send(ret);
            });
        });
    });
    app.AddSdkApi("admingetnewgamenameupnew", function (req) {
        CheckUser(req.param, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send({});
                return;
            }
            var sql = "SELECT appname FROM t_cpapp  WHERE del=0 and status='已通过' and YEARWEEK(date_format(addtime,'%Y-%m-%d')) = YEARWEEK(now())   ";
            var params = [];
            gameapi.conn.query(sql, params, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var feedbacklist = [];
                for (var i = 0; i < rows.length; i++) {
                    var info = rows[i];
                    feedbacklist[i] = info;
                }
                var ret = new ADMINGETALLGAMENAMERESP();
                ret.gamename = feedbacklist;
                req.send(ret);
            });
        });
    });
    app.AddSdkApi("admingetallsdknew", function (req) {
        CheckUser(req.param, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send({});
                return;
            }
            var sql = "SELECT sdkname FROM t_sdktype ";
            var params = [];
            gameapi.conn.query(sql, params, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var feedbacklist = [];
                for (var i = 0; i < rows.length; i++) {
                    var info = rows[i];
                    feedbacklist[i] = info;
                }
                var ret = new ADMINGETALLGAMENAMERESP();
                ret.gamename = feedbacklist;
                req.send(ret);
            });
        });
    });
    //高级福利相关数据
    var ADMINGETALLACCOUNTTYPEREQ = (function (_super) {
        __extends(ADMINGETALLACCOUNTTYPEREQ, _super);
        function ADMINGETALLACCOUNTTYPEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLACCOUNTTYPEREQ;
    }(ADMINREQBASE));
    var ADMINGETALLACCOUNTTYPEINFO = (function () {
        function ADMINGETALLACCOUNTTYPEINFO() {
        }
        return ADMINGETALLACCOUNTTYPEINFO;
    }());
    var ADMINGETALLACCOUNTTYPERESP = (function () {
        function ADMINGETALLACCOUNTTYPERESP() {
        }
        return ADMINGETALLACCOUNTTYPERESP;
    }());
    var ADMINDELACCOUNTTYPE = (function (_super) {
        __extends(ADMINDELACCOUNTTYPE, _super);
        function ADMINDELACCOUNTTYPE() {
            _super.apply(this, arguments);
        }
        return ADMINDELACCOUNTTYPE;
    }(ADMINGETALLACCOUNTTYPEINFO));
    var ADMINGETCHECKACCOUNTTYPEREQ = (function (_super) {
        __extends(ADMINGETCHECKACCOUNTTYPEREQ, _super);
        function ADMINGETCHECKACCOUNTTYPEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHECKACCOUNTTYPEREQ;
    }(ADMINREQBASE));
    var ADMINADDACCOUNTTYPEREQ = (function (_super) {
        __extends(ADMINADDACCOUNTTYPEREQ, _super);
        function ADMINADDACCOUNTTYPEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDACCOUNTTYPEREQ;
    }(ADMINREQBASE));
    var ADMINADDACCOUNTREQ = (function (_super) {
        __extends(ADMINADDACCOUNTREQ, _super);
        function ADMINADDACCOUNTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDACCOUNTREQ;
    }(ADMINREQBASE));
    //获取高级福利列表
    app.AddSdkApi("admingetallaccounttype", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "select Id from t_gsgameaccounttype where del=0 ";
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var sql = " SELECT a.id,a.gameid,d.name as appname,a.title,a.`condition`,a.pricelow,a.pricehigh,a.createtime,a.updatetime  FROM    t_gsgameaccounttype a   LEFT JOIN t_gsh5game d ON d.id=a.gameid WHERE   a.del=0   ";
                var params = [];
                if (!!para.time) {
                    sql += " AND DATE_FORMAT(a.createtime,'%Y-%m-%d')=?";
                    params.push(para.time);
                }
                if (!!para.accountname) {
                    sql += "and title like '%" + para.accountname + "%' ";
                }
                sql += " ORDER BY createtime DESC ";
                gameapi.conn.query(sql, params, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var accounttypelist = [];
                    for (var i = 0; i < rows.length; i++) {
                        var info = rows[i];
                        info.createtime = rows[i]["createtime"].getTime();
                        accounttypelist[i] = info;
                    }
                    var ret = new ADMINGETALLACCOUNTTYPERESP();
                    ret.accounttypelist = accounttypelist;
                    req.send(ret);
                });
            });
        });
    });
    //获取高级福利管理多选列表
    app.AddSdkApi("admingetcheckaccounttypelist", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var ret = [];
            if (para.accounttypename.length == 0) {
                req.send(null, 1, "请勾选需要通过的数据");
                return;
            }
            for (var i = 0; i < para.accounttypename.length; i++) {
                gameapi.conn.query("SELECT a.id,a.gameid,d.appname,a.title,a.`condition`,a.pricelow,a.pricehigh,a.createtime,a.updatetime   FROM    t_gsgameaccounttype a   LEFT JOIN t_cpapp d ON d.appid=a.gameid WHERE   a.del=0   " +
                    " and id=?", [para.accounttypename[i]], function (err, rows, fields) {
                    var accounttype = rows[0];
                    ret.push(accounttype);
                    if (ret.length == para.accounttypename.length) {
                        req.send(ret);
                        return;
                    }
                    ;
                });
            }
        });
    });
    //多选删除高级福利管理列表
    app.AddSdkApi("admindelallaccounttype", function (req) {
        var params = req.param;
        for (var i = 0; i < params.length; i++) {
            var para = params[i];
            (function (para) {
                gameapi.conn.query("DELETE from t_gsgameaccounttype  WHERE id =?", [para.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                });
                gameapi.conn.query("DELETE from t_gsgameaccount  WHERE gattid =?", [para.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                });
            }).call(this, para);
        }
        req.send({});
    });
    //保存高级福利
    app.AddSdkApi("adminaddaccount", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "select Id from t_gsgameaccounttype where del=0 ";
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var sql = "INSERT INTO t_gsgameaccounttype (gameid,title,`condition`,pricelow,pricehigh,type) VALUES ((SELECT id FROM t_gsh5game WHERE name=? and del=0),?,?,?,?,?)";
                gameapi.conn.query(sql, [para.appname, para.title, para.condition, para.pricelow, para.pricehigh, '1'], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var acid = rows.insertId;
                    req.send({});
                    for (var i = 0; i < para.accounttitle.length; i++) {
                        var sql = "INSERT INTO t_gsgameaccount (gattid,title,`condition`,price,surplu) VALUES (?,?,?,?,?)";
                        gameapi.conn.query(sql, [acid, para.accounttitle[i], para.accountcondition[i], para.accountprice[i], para.accountsurplu[i]], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                return;
                            }
                            req.send({});
                        });
                    }
                });
            });
        });
    });
    //审核高级福利相关数据
    var ADMINGETALLREVIEWACCOUNTREQ = (function (_super) {
        __extends(ADMINGETALLREVIEWACCOUNTREQ, _super);
        function ADMINGETALLREVIEWACCOUNTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLREVIEWACCOUNTREQ;
    }(ADMINREQBASE));
    var ADMINGETALLREVIEWACCOUNTINFO = (function () {
        function ADMINGETALLREVIEWACCOUNTINFO() {
        }
        return ADMINGETALLREVIEWACCOUNTINFO;
    }());
    var ADMINGETALLREVIEWACCOUNTRESP = (function () {
        function ADMINGETALLREVIEWACCOUNTRESP() {
        }
        return ADMINGETALLREVIEWACCOUNTRESP;
    }());
    var ADMINDELREVIEWACCOUNT = (function (_super) {
        __extends(ADMINDELREVIEWACCOUNT, _super);
        function ADMINDELREVIEWACCOUNT() {
            _super.apply(this, arguments);
        }
        return ADMINDELREVIEWACCOUNT;
    }(ADMINGETALLREVIEWACCOUNTINFO));
    var ADMINGETCHECKREVIEWACCOUNTREQ = (function (_super) {
        __extends(ADMINGETCHECKREVIEWACCOUNTREQ, _super);
        function ADMINGETCHECKREVIEWACCOUNTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHECKREVIEWACCOUNTREQ;
    }(ADMINREQBASE));
    var ADMINADDREVIEWACCOUNTREQ = (function (_super) {
        __extends(ADMINADDREVIEWACCOUNTREQ, _super);
        function ADMINADDREVIEWACCOUNTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDREVIEWACCOUNTREQ;
    }(ADMINREQBASE));
    //审核高级福利列表
    app.AddSdkApi("admingetallreviewaccount", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "select Id from t_gsapplyaccountlog where del=0 ";
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var sql = " SELECT a.id,a.loginid,a.gname,a.detail,a.`server`,a.rolename,a.createtime,a.updatetime,a.remark FROM t_gsapplyaccountlog a WHERE a.del=0   ";
                var params = [];
                if (!!para.time) {
                    sql += " AND DATE_FORMAT(a.createtime,'%Y-%m-%d')=?";
                    params.push(para.time);
                }
                if (!!para.reviewname) {
                    sql += "and loginid like '%" + para.reviewname + "%' ";
                }
                sql += " ORDER BY createtime DESC ";
                gameapi.conn.query(sql, params, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var reviewlist = [];
                    for (var i = 0; i < rows.length; i++) {
                        var info = rows[i];
                        info.createtime = rows[i]["createtime"].getTime();
                        reviewlist[i] = info;
                    }
                    var ret = new ADMINGETALLREVIEWACCOUNTRESP();
                    ret.reviewlist = reviewlist;
                    req.send(ret);
                });
            });
        });
    });
    //获取高级福利审核多选列表
    app.AddSdkApi("admingetcheckreviewaccountlist", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var ret = [];
            if (para.reviewname.length == 0) {
                req.send(null, 1, "请勾选需要通过的数据");
                return;
            }
            for (var i = 0; i < para.reviewname.length; i++) {
                gameapi.conn.query("SELECT a.id,a.loginid,a.gname,a.detail,a.`server`,a.rolename,a.createtime,a.updatetime,a.remark FROM t_gsapplyaccountlog a WHERE a.del=0   " +
                    " and id=?", [para.reviewname[i]], function (err, rows, fields) {
                    var reviewinfo = rows[0];
                    ret.push(reviewinfo);
                    if (ret.length == para.reviewname.length) {
                        req.send(ret);
                        return;
                    }
                    ;
                });
            }
        });
    });
    //多选通过高级福利审核
    app.AddSdkApi("adminpassallreviewaccount", function (req) {
        var params = req.param;
        for (var i = 0; i < params.length; i++) {
            var para = params[i];
            (function (para) {
                gameapi.conn.query("UPDATE t_gsapplyaccountlog  SET remark =? WHERE id =?", ["1", para.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                });
            }).call(this, para);
        }
        req.send({});
    });
    //多选不通过高级福利审核
    app.AddSdkApi("adminnotpassreviewaccount", function (req) {
        var params = req.param;
        for (var i = 0; i < params.length; i++) {
            var para = params[i];
            (function (para) {
                gameapi.conn.query("UPDATE t_gsapplyaccountlog  SET remark =? WHERE id =?", ["2", para.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                });
            }).call(this, para);
        }
        req.send({});
    });
    app.AddSdkApi("getpointreward", function (req) {
        var now = new Date(); //当前日期
        var nowDayOfWeek = now.getDay(); //今天本周的第几天
        var nowDay = now.getDate(); //当前日
        var nowMonth = now.getMonth(); //当前月
        var nowYear = now.getFullYear(); //当前年
        nowYear += (nowYear < 2000) ? 1900 : 0; //
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (5 - nowDayOfWeek));
        console.log((new Date().toLocaleDateString()));
        console.log(formatDate(weekEndDate));
        if (new Date().toLocaleDateString() == formatDate(weekEndDate)) {
            var sql = "SELECT userid, loginid, nickname, headico, point FROM t_gameuser WHERE (1) ORDER BY point DESC LIMIT 0, 20 ";
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                for (var i = 0; i < rows.length; i++) {
                    if (i < 6) {
                        var sql2 = "update t_gameuser set point = point + (600 - 100 * (" + i + " - 0)) where userid = ?";
                    }
                    else {
                        if (i > 5 && i < 10) {
                            var sql2 = "update t_gameuser set point = point + (90 - 10 * (" + i + " - 6)) where userid = ?";
                        }
                        else {
                            var sql2 = "update t_gameuser set point = point + (50 - 5 * (" + i + " - 10)) where userid = ?";
                        }
                    }
                    gameapi.conn.query(sql2, [rows[i]["userid"]], function (err, rows2, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            return;
                        }
                    });
                }
                req.send(null, 1, "奖励更新发放成功！");
            });
        }
        else {
            req.send(null, 1, "请在每周五进行奖励发放和更新");
        }
    });
    app.AddSdkApi("getrechagereward", function (req) {
        var now = new Date(); //当前日期
        var nowDayOfWeek = now.getDay(); //今天本周的第几天
        var nowDay = now.getDate(); //当前日
        var nowMonth = now.getMonth(); //当前月
        var nowYear = now.getFullYear(); //当前年
        nowYear += (nowYear < 2000) ? 1900 : 0; //
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (5 - nowDayOfWeek));
        if (new Date().toLocaleDateString() == formatDate(weekEndDate)) {
            var sql = "SELECT a.*, b.nickname,b.point, b.headico FROM ( SELECT id, userid, sum(payrmb) paysum FROM t_userpay WHERE state >= 1 " +
                "  AND sdkid = '0' AND YEARWEEK( date_format(paytime, '%Y-%m-%d') ) = YEARWEEK(now()) GROUP BY userid ) a " +
                "  LEFT JOIN t_gameuser b ON b.userid = a.userid WHERE a.paysum BETWEEN 100 AND 100000000000 UNION ALL SELECT id,userid," +
                "  paysum,nickname,point,headico FROM t_gsrechage ORDER BY paysum DESC LIMIT 0, 20";
            gameapi.conn.query(sql, [], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                for (var i = 0; i < rows.length; i++) {
                    if (i > 9) {
                        if (rows[i]["userid"].indexOf("_") > 0) {
                            var sql2 = "update t_gsrechage set point = point + (100 - 10 * (" + i + " - 10)) where userid = ?";
                        }
                        else {
                            var sql2 = "update t_gameuser set point = point + (100 - 10 * (" + i + " - 10)) where userid = ?";
                        }
                    }
                    if (i < 10) {
                        if (rows[i]["userid"].indexOf("_") > 0) {
                            var sql2 = "update t_gsrechage set point = point + (2000 - 200 * (" + i + " - 0)) where userid = ?";
                        }
                        else {
                            var sql2 = "update t_gameuser set point = point + (2000 - 200 * (" + i + " - 0)) where userid = ?";
                        }
                    }
                    gameapi.conn.query(sql2, [rows[i]["userid"]], function (err, rows2, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            return;
                        }
                    });
                }
                req.send(null, 1, "奖励更新发放成功！");
            });
        }
        else {
            req.send(null, 1, "请在每周五进行奖励发放和更新");
        }
    });
    function formatDate(date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        if (mymonth < 10) {
            mymonth = mymonth;
        }
        if (myweekday < 10) {
            myweekday = myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday);
    }
    var RECHAGEROBOTINFO = (function () {
        function RECHAGEROBOTINFO() {
        }
        return RECHAGEROBOTINFO;
    }());
    var RECHAGEROBOTREQ = (function () {
        function RECHAGEROBOTREQ() {
        }
        return RECHAGEROBOTREQ;
    }());
    app.AddSdkApi("getrechagerobot", function (req) {
        var para = req.param;
        var sql = " SELECT id, userid, paysum, nickname, point, headico FROM t_gsrechage ORDER BY paysum DESC  ";
        var params = [];
        gameapi.conn.query(sql, params, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var messagelist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                messagelist[i] = info;
            }
            req.send(messagelist);
        });
    });
    app.AddSdkApi("saverechagerobot", function (req) {
        var para = req.param;
        var sql = " update t_gsrechage set nickname = ? ,headico = ?,paysum = ? where id = ? ";
        var params = [para.nickname, para.headico, para.paysum, para.id];
        gameapi.conn.query(sql, params, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            req.send({});
        });
    });
    //--------------------平台数据----------------------
    var ADMINPLAFORMCDSREQ = (function (_super) {
        __extends(ADMINPLAFORMCDSREQ, _super);
        function ADMINPLAFORMCDSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINPLAFORMCDSREQ;
    }(ADMINREQBASE));
    var ADMINPLAFORMCDSRESP = (function () {
        function ADMINPLAFORMCDSRESP() {
        }
        return ADMINPLAFORMCDSRESP;
    }());
    app.AddSdkApi("adminpcds", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send(null, 1, "没有权限");
                return;
            }
            var param = [];
            var sql = "select str_to_date(DATE_FORMAT(a.paytime,'%Y-%m-%d'),'%Y-%m-%d') 时间  ,count(1) 付费用户,sum(a.payrmb) 付费金额\n" +
                "from t_userpay a where a.state>=1 and a.paytime>=? and a.paytime<=? and a.sdkid is null";
            sql += "  group by 时间 order by 时间";
            param.push(para.timestart);
            param.push(para.timeend);
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var dat = new DATATABLE();
                dat.fields = [];
                for (var i = 0; i < fields.length; i++) {
                    dat.fields[i] = fields[i].name;
                }
                dat.rows = [];
                for (var i = 0; i < rows.length; i++) {
                    dat.rows[i] = rows[i];
                    dat.rows[i].时间 = rows[i]["时间"].getTime();
                }
                req.send({ data: dat });
            });
        });
    });
    var ADMINPLAFORMPUDSREQ = (function (_super) {
        __extends(ADMINPLAFORMPUDSREQ, _super);
        function ADMINPLAFORMPUDSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINPLAFORMPUDSREQ;
    }(ADMINREQBASE));
    var ADMINPLAFORMPUDSRESP = (function () {
        function ADMINPLAFORMPUDSRESP() {
        }
        return ADMINPLAFORMPUDSRESP;
    }());
    app.AddSdkApi("adminpuds", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send(null, 1, "没有权限");
                return;
            }
            var param = [];
            var sql = "select sum(a.newuser) addcount,str_to_date(DATE_FORMAT(a.logdate,'%Y-%m-%d'),'%Y-%m-%d') logdate\n" +
                "from t_sdkappdaylog a where a.logdate>=? and a.logdate<=? and a.sdkid=0 group by a.logdate order by a.logdate";
            param.push(para.timestart);
            param.push(para.timeend);
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var dat = RowToDatatable(rows, fields);
                var ret = new ADMINPLAFORMPUDSRESP();
                ret.data = dat;
                req.send(ret);
            });
        });
    });
    var ADMINPLAFORMPVDSREQ = (function (_super) {
        __extends(ADMINPLAFORMPVDSREQ, _super);
        function ADMINPLAFORMPVDSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINPLAFORMPVDSREQ;
    }(ADMINREQBASE));
    var ADMINPLAFORMPVDSRESP = (function () {
        function ADMINPLAFORMPVDSRESP() {
        }
        return ADMINPLAFORMPVDSRESP;
    }());
    app.AddSdkApi("adminpvds", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send(null, 1, "没有权限");
                return;
            }
            var param = [para.timestart, para.timeend];
            var sql = "select count(1) pvdata,str_to_date(DATE_FORMAT(a.createtime,'%Y-%m-%d'),'%Y-%m-%d') createtime " +
                "from t_gsuserurlpath a where a.createtime>=? and a.createtime<=? group by str_to_date(DATE_FORMAT(a.createtime, '%Y-%m-%d'),'%Y-%m-%d') order by createtime";
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var dat = RowToDatatable(rows, fields);
                var ret = new ADMINPLAFORMPVDSRESP();
                ret.data = dat;
                req.send(ret);
            });
        });
    });
    var ADMINPLAFORMGAMECHARGESEARCHREQ = (function (_super) {
        __extends(ADMINPLAFORMGAMECHARGESEARCHREQ, _super);
        function ADMINPLAFORMGAMECHARGESEARCHREQ() {
            _super.apply(this, arguments);
        }
        return ADMINPLAFORMGAMECHARGESEARCHREQ;
    }(ADMINREQBASE));
    var ADMINPLAFORMGAMECHARGESEARCHRESP = (function () {
        function ADMINPLAFORMGAMECHARGESEARCHRESP() {
        }
        return ADMINPLAFORMGAMECHARGESEARCHRESP;
    }());
    app.AddSdkApi("adminpgcds", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send(null, 1, "没有权限");
                return;
            }
            var ret = new ADMINPLAFORMGAMECHARGESEARCHRESP();
            //充值
            var param = [];
            var sql = "select a.appid,a.appname,sum(a.paymoney) paysum from(\n" +
                "select a.appid,a.userid,c.appname, sum(a.payrmb) paymoney\n" +
                "from t_userpay a left join t_cpapp c on c.appid=a.appid\n" +
                "where a.state>=1 and a.paytime>=? and a.paytime<=? and a.sdkid = 0 \n";
            param.push(para.timestart);
            param.push(para.timeend);
            if (!!para.appname) {
                sql += " and c.appname like ?";
                param.push("%" + para.appname + "%");
            }
            sql += " group by appid,userid) a\n" +
                "group by appid\n" +
                "order by paymoney desc";
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                ret.paydata = RowToDatatable(rows, fields);
                //点击
                param = [];
                sql = "select a.appid,b.appname,createroleuser from ( \n" +
                    "select appid,sum(logincount)createroleuser from t_sdkappdaylog where logdate>=? and logdate<=? and sdkid=0 group by appid\n" +
                    ")a left join t_cpapp b on b.appid=a.appid ";
                param.push(para.timestart);
                param.push(para.timeend);
                if (!!para.appname) {
                    sql = sql + " where b.appname like ?";
                    param.push("%" + para.appname + "%");
                }
                gameapi.conn.query(sql, param, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    ret.flowdata = RowToDatatable(rows, fields);
                    param = [];
                    sql = "SELECT b.appid,a.`name` appname,COUNT(a.gameid) opencount FROM(SELECT a.gameid,b.`name` from t_gsuserh5log a LEFT JOIN t_gsh5game b ON a.gameid=b.Id and b.del=0 WHERE a.createtime>=? AND a.createtime<=?) a LEFT JOIN t_cpapp b on a.name=b.appname AND b.del=0";
                    param.push(para.timestart);
                    param.push(para.timeend);
                    if (!!para.appname) {
                        sql = sql + " AND b.appname like ?";
                        param.push("%" + para.appname + "%");
                    }
                    sql += " GROUP BY b.appid";
                    gameapi.conn.query(sql, param, function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        ret.clickdata = RowToDatatable(rows, fields);
                        req.send(ret);
                    });
                });
            });
        });
    });
    var ADMINPLAFORMUSERCHARGEREQ = (function (_super) {
        __extends(ADMINPLAFORMUSERCHARGEREQ, _super);
        function ADMINPLAFORMUSERCHARGEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINPLAFORMUSERCHARGEREQ;
    }(ADMINREQBASE));
    var ADMINPLAFORMUSERCHARGEINFO = (function () {
        function ADMINPLAFORMUSERCHARGEINFO() {
        }
        return ADMINPLAFORMUSERCHARGEINFO;
    }());
    app.AddSdkApi("adminpucds", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "SELECT a.userid, b.appname, SUM(a.payrmb) AS paytotal, MIN(a.paytime) AS minpaytime , MAX(a.paytime) AS maxpaytime " +
                "FROM t_userpay a LEFT JOIN t_cpapp b ON b.appid = a.appid LEFT JOIN t_sdktype c ON c.id = a.sdkid " +
                "LEFT JOIN t_applog d ON d.appid = a.appid AND d.userid = a.userid AND d.type = 4 WHERE a.state = 1 AND a.paytime >= ? AND a.paytime <= ? AND a.sdkid = 0 GROUP BY userid, appname ORDER BY paytotal DESC";
            var params = [];
            params.push(para.timestart);
            params.push(para.timeend);
            if (!!para.appname) {
                sql = sql.replace("{1}", " and appname like ?");
                params.push("%" + para.appname + "%");
            }
            else {
                sql = sql.replace("{1}", " ");
            }
            gameapi.conn.query(sql, params, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var aList = [];
                for (var i = 0; i < rows.length; i++) {
                    var aInfo = rows[i];
                    aInfo.minpaytime = rows[i]['minpaytime'].getTime();
                    aInfo.maxpaytime = rows[i]['maxpaytime'].getTime();
                    aList[i] = aInfo;
                }
                req.send(aList);
            });
        });
    });
    //-----------------用户管理------------------
    var ADMINPLAFORMUSERCHARGEREQ2 = (function (_super) {
        __extends(ADMINPLAFORMUSERCHARGEREQ2, _super);
        function ADMINPLAFORMUSERCHARGEREQ2() {
            _super.apply(this, arguments);
        }
        return ADMINPLAFORMUSERCHARGEREQ2;
    }(ADMINREQBASE));
    app.AddSdkApi("adminchargerankdatanew", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname && (pri.appname != "%")) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "SELECT * FROM(SELECT a.userid 用户,c.appname 充值游戏,b.sdkid 渠道,a.serverid 区服,SUM(a.payrmb) 累计充值,MIN(a.paytime) 首次充值时间,MAX(a.paytime) 最后充值时间,b.logtime 注册时间\n" +
                "FROM t_userpay a LEFT JOIN t_applog b ON b.appid = a.appid AND b.userid = a.userid AND (b.type = 4) LEFT JOIN t_cpapp c on c.appid=a.appid WHERE a.state = 1\n";
            var sqlpara = [];
            switch (para.flags) {
                case 0:
                    sql += "AND DATE_FORMAT(a.paytime,'%Y-%m-%d')=CURRENT_DATE";
                    break;
                case 1:
                    sql += "AND YEARWEEK(date_format(a.paytime,'%Y-%m-%d')) = YEARWEEK(now())";
                    break;
                case 2:
                    sql += "AND date_format(a.paytime,'%Y-%m') = date_format(now(),'%Y-%m')";
                    break;
                case 3:
                    sql += "AND DATE_FORMAT(a.paytime,'%Y-%m-%d')<=CURRENT_DATE";
                    break;
                case 4:
                    sql += "AND (a.paytime>=? AND a.paytime<=?)";
                    sqlpara.push(para.timestart);
                    sqlpara.push(para.timeend);
                    break;
            }
            sql += " GROUP BY a.userid,a.serverid,a.appid) a";
            if (!!para.moneyrang) {
                var money = para.moneyrang.split('-');
                sql += " WHERE(a.累计充值>=? AND a.累计充值<=?)";
                sqlpara.push(money[0]);
                sqlpara.push(money[1]);
                if (!!para.userId) {
                    sql += " AND a.充值游戏  like ?";
                    sqlpara.push("%" + para.userId + "%");
                }
            }
            else {
                if (!!para.userId) {
                    sql += " WHERE a.充值游戏 like ?";
                    sqlpara.push("%" + para.userId + "%");
                }
            }
            sql += " ORDER BY 累计充值 DESC,注册时间 DESC";
            gameapi.conn.query(sql, sqlpara, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var dat = new DATATABLE();
                dat.fields = [];
                for (var i = 0; i < fields.length; i++) {
                    dat.fields[i] = fields[i].name;
                }
                dat.rows = [];
                for (var i = 0; i < rows.length; i++) {
                    dat.rows[i] = rows[i];
                    if (rows[i]["首次充值时间"] != null && rows[i]["最后充值时间"] != null && rows[i]["注册时间"] != null) {
                        dat.rows[i].首次充值时间 = rows[i]["首次充值时间"].getTime();
                        dat.rows[i].最后充值时间 = rows[i]["最后充值时间"].getTime();
                        dat.rows[i].注册时间 = rows[i]["注册时间"].getTime();
                    }
                }
                req.send({ data: dat });
            });
        });
    });
    //-------------------SDK接入--------------------------
    //取得接入发行SDK的游戏列表
    var ADMINGETSDKAPPLISTREQ = (function (_super) {
        __extends(ADMINGETSDKAPPLISTREQ, _super);
        function ADMINGETSDKAPPLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETSDKAPPLISTREQ;
    }(ADMINREQBASE));
    var SDKAPPINFO = (function () {
        function SDKAPPINFO() {
        }
        return SDKAPPINFO;
    }());
    var ADMINGETSDKAPPLISTRESP = (function () {
        function ADMINGETSDKAPPLISTRESP() {
        }
        return ADMINGETSDKAPPLISTRESP;
    }());
    app.AddSdkApi("admingetsdkapplist", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "select a.appid,a.appname,b.profit,a.appsecret,a.url,a.posturl,c.needproductid,\n" +
                "b.id,b.sdkid,c.sdkname,c.payurl,c.remarkappid,c.remarkappsecret, b.sdkappid,b.sdkappsecret,b.qqgroup,b.kefuqq,b.addtime\n" +
                "from t_sdkapp b\n" +
                "left join t_cpapp a on a.appid=b.appid\n" +
                "left join t_sdktype c on c.id=b.sdkid where 1=1 \n";
            if (para.sdkid) {
                sql += " and sdkid=?";
                params.push(para.sdkid);
            }
            if (para.appname) {
                sql += " and appname like ?";
                params.push("%" + para.appname + "%");
            }
            if (para.addtime) {
                sql += " and DATE_FORMAT(b.addtime,'%Y-%m-%d')=?";
                params.push(para.addtime);
            }
            if (para.id) {
                sql += " and b.id=?";
                params.push(para.id);
            }
            sql += " order by id";
            gameapi.conn.query(sql, params, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var ret = new ADMINGETSDKAPPLISTRESP();
                ret.data = [];
                for (var i = 0; i < rows.length; i++) {
                    ret.data[i] = rows[i];
                    if (rows[i]["url"].indexOf("https://") == 0) {
                        ret.data[i].gameurl = gameapi.GetAppUrlHttps(ret.data[i].id);
                        ret.data[i].payurl = "https://" + gameapi.g_myServerDomain2 + ":" + gameapi.g_serverporthttps + ret.data[i].payurl;
                    }
                    else {
                        ret.data[i].gameurl = gameapi.GetAppUrl(ret.data[i].id);
                        ret.data[i].payurl = "http://" + gameapi.g_myServerDomain2 + ":" + gameapi.g_serverport2 + ret.data[i].payurl;
                    }
                    ret.data[i].addtime = rows[i]["addtime"].getTime();
                }
                req.send(ret);
            });
        });
    });
    //取得游戏充值档
    var ADMINGETAPPPRODUCTSREQ = (function () {
        function ADMINGETAPPPRODUCTSREQ() {
        }
        return ADMINGETAPPPRODUCTSREQ;
    }());
    var APPPRODUCTINFO = (function () {
        function APPPRODUCTINFO() {
        }
        return APPPRODUCTINFO;
    }());
    var ADMINGETAPPPRODUCTSRESP = (function () {
        function ADMINGETAPPPRODUCTSRESP() {
        }
        return ADMINGETAPPPRODUCTSRESP;
    }());
    app.AddSdkApi("admingetappproducts", function (req) {
        var para = req.param;
        gameapi.conn.query("select appid,sdkid,goodsname,price,productid from t_sdkgoods where appid=? and sdkid=? order by goodsname,price", [para.appid, para.sdkid], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            var ret = new ADMINGETAPPPRODUCTSRESP();
            ret.data = [];
            for (var i = 0; i < rows.length; i++) {
                ret.data[i] = rows[i];
            }
            req.send(ret);
        });
    });
    //添加SDK游戏时取得可选择的游戏列表
    var ADMINGETSELSDKAPPLISTREQ = (function () {
        function ADMINGETSELSDKAPPLISTREQ() {
        }
        return ADMINGETSELSDKAPPLISTREQ;
    }());
    var ADMINGETSELSDKAPPINFO = (function () {
        function ADMINGETSELSDKAPPINFO() {
        }
        return ADMINGETSELSDKAPPINFO;
    }());
    var ADMINGETSELSDKAPPLISTRESP = (function () {
        function ADMINGETSELSDKAPPLISTRESP() {
        }
        return ADMINGETSELSDKAPPLISTRESP;
    }());
    app.AddSdkApi("admingetselsdkapplist", function (req) {
        var para = req.param;
        gameapi.conn.query("select appid,appname from t_cpapp where del=0 and enabled=1 order by appname", [], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            var dat = new ADMINGETSELSDKAPPLISTRESP();
            dat.data = [];
            for (var i = 0; i < rows.length; i++) {
                dat.data[i] = rows[i];
            }
            req.send(dat);
        });
    });
    //保存SDK游戏信息
    var ADMINSAVESDKAPPINFOREQ = (function (_super) {
        __extends(ADMINSAVESDKAPPINFOREQ, _super);
        function ADMINSAVESDKAPPINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVESDKAPPINFOREQ;
    }(ADMINREQBASE));
    var ADMINSAVESDKAPPINFORESP = (function () {
        function ADMINSAVESDKAPPINFORESP() {
        }
        return ADMINSAVESDKAPPINFORESP;
    }());
    app.AddSdkApi("adminsavesdkappinfo", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            var params = [];
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            if (!para.id) {
                gameapi.conn.query("insert into t_sdkapp (appid,sdkid,sdkappid,sdkappsecret,qqgroup,kefuqq,profit) values (?,?,?,?,?,?,?)", [para.appid, para.sdkid, para.sdkappid, para.sdkappsecret, para.qqgroup, para.kefuqq, para.profit], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    saveproducts(rows.insertId, null, null);
                });
            }
            else {
                //取得修改前的sdkid/appid
                gameapi.conn.query("select appid,sdkid from t_sdkapp where id=?", [para.id], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    if (rows.length == 0) {
                        req.send(null, 1, "更新失败，数据不存在！");
                        return;
                    }
                    var oldappid = rows[0]["appid"];
                    var oldsdkid = rows[0]["sdkid"];
                    gameapi.conn.query("update t_sdkapp set appid=?,sdkid=?,sdkappid=?,sdkappsecret=?,qqgroup=?,kefuqq=?,profit=? where id=?", [para.appid, para.sdkid, para.sdkappid, para.sdkappsecret, para.qqgroup, para.kefuqq, para.profit, para.id], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        if (rows.affectedRows < 1) {
                            req.send("更新失败，数据不存在！");
                            return;
                        }
                        saveproducts(para.id, oldappid, oldsdkid);
                    });
                });
            }
            function saveproducts(id, oldappid, oldsdkid) {
                if (para.products) {
                    gameapi.conn.GetConn(function (err, conn) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        conn.beginTransaction(function (err) {
                            if (err) {
                                conn.release();
                                req.send(null, 1, err.message);
                                throw err;
                            }
                            var param = [para.appid, para.sdkid];
                            var sql = "delete from t_sdkgoods where (appid=? and sdkid=?)";
                            if (!!oldappid && !!oldsdkid) {
                                sql += " or (appid=? and sdkid=?) ";
                                param.push(oldappid);
                                param.push(oldsdkid);
                            }
                            conn.query(sql, param, function (err, rows, fields) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    conn.rollback(function (err) {
                                        conn.release();
                                    });
                                    throw err;
                                }
                                var insertcount = 0;
                                if (para.products.length == 0) {
                                    conn.commit(function (err) {
                                        if (err) {
                                            req.send(null, 1, err.message);
                                            conn.rollback(function (err) {
                                                conn.release();
                                            });
                                            throw err;
                                        }
                                        conn.release();
                                        fun();
                                    });
                                }
                                else {
                                    for (var i = 0; i < para.products.length; i++) {
                                        conn.query("insert into t_sdkgoods (appid,sdkid,goodsname,price,productid) values (?,?,?,?,?)", [para.appid, para.sdkid, para.products[i].goodsname, para.products[i].price, para.products[i].productid], function (err, rows, fields) {
                                            if (err) {
                                                req.send(null, 1, err.message);
                                                conn.rollback(function (err) {
                                                    conn.release();
                                                });
                                                throw err;
                                            }
                                            insertcount++;
                                            if (insertcount == para.products.length) {
                                                conn.commit(function (err) {
                                                    if (err) {
                                                        req.send(null, 1, err.message);
                                                        conn.rollback(function (err) {
                                                            conn.release();
                                                        });
                                                        throw err;
                                                    }
                                                    conn.release();
                                                    fun();
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        });
                    });
                }
                else {
                    fun();
                }
                function fun() {
                    var ret = new ADMINSAVESDKAPPINFORESP();
                    ret.id = id;
                    ret.gameurl = gameapi.GetAppUrl(ret.id);
                    req.send(ret);
                }
            }
        });
    });
    var ADMINSORTCHANGEREQ = (function (_super) {
        __extends(ADMINSORTCHANGEREQ, _super);
        function ADMINSORTCHANGEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSORTCHANGEREQ;
    }(ADMINREQBASE));
    app.AddSdkApi("adminsortchange", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            gameapi.conn.query("SELECT a.id,b.orderby FROM(SELECT id FROM t_gsactivity WHERE orderby=? AND del=0) a,(SELECT orderby FROM t_gsactivity WHERE id=? AND del=0) b", [para.sortnum, para.id], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                commitUpdate2(rows[0]['id'], para.id, rows[0]['orderby'], para.sortnum, req);
                req.send({});
            });
        });
    });
    app.AddSdkApi("adminsorthotgame", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            gameapi.conn.query("SELECT a.id,b.orderby FROM(SELECT id FROM t_gshotgame WHERE orderby=? AND del=0) a,(SELECT orderby FROM t_gshotgame WHERE id=? AND del=0) b", [para.sortnum, para.id], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                commitUpdate_hotgame(rows[0]['id'], para.id, rows[0]['orderby'], para.sortnum, req);
                req.send({});
            });
        });
    });
    var ADMINGETALLCPAPPLISTREQ = (function (_super) {
        __extends(ADMINGETALLCPAPPLISTREQ, _super);
        function ADMINGETALLCPAPPLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLCPAPPLISTREQ;
    }(ADMINREQBASE));
    var ADMINGETALLCPAPPINFO = (function () {
        function ADMINGETALLCPAPPINFO() {
        }
        return ADMINGETALLCPAPPINFO;
    }());
    app.AddSdkApi("getallcpapplist", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var sql = "SELECT appid,appname,addtime FROM t_cpapp WHERE del=0 AND enabled=1 and status='已通过'  ";
            var params = [];
            if (!!para.appname) {
                sql += " AND appname like ?";
                params.push("%" + para.appname + "%");
            }
            sql += " ORDER BY addtime DESC";
            gameapi.conn.query(sql, params, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var ret = [];
                for (var i = 0; i < rows.length; i++) {
                    var adminappinfo = rows[i];
                    adminappinfo.addtime = rows[i]["addtime"].getTime();
                    ret.push(adminappinfo);
                }
                req.send(ret);
            });
        });
    });
    var ADMINGETBLANCEREQ = (function (_super) {
        __extends(ADMINGETBLANCEREQ, _super);
        function ADMINGETBLANCEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETBLANCEREQ;
    }(ADMINREQBASE));
    var ADMINBLANCEINFO = (function () {
        function ADMINBLANCEINFO() {
        }
        return ADMINBLANCEINFO;
    }());
    app.AddSdkApi("admingetblance", function (req) {
        var para = req.param;
        if (para.games.length == 0) {
            req.send(null, 1, "请勾选需要导出的游戏");
            return;
        }
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var k = 0;
            var ret = [];
            for (var i = 0; i < para.games.length; i++) {
                var sql = "SELECT a.appid, b.appname, DATE_FORMAT(a.paytime, '%Y-%m') AS bdate, SUM(a.payrmb) AS income FROM t_userpay a LEFT JOIN t_cpapp b ON a.appid = b.appid " +
                    "WHERE a.state >= 1 AND a.sdkid IS NOT NULL AND DATE_FORMAT(a.paytime, '%Y-%m') >= ? AND DATE_FORMAT(a.paytime, '%Y-%m') <= ?";
                var params = [];
                params.push(para.timestart);
                params.push(para.timeend);
                if (!!para.games[i]) {
                    sql += " AND b.appname = ?";
                    params.push(para.games[i]);
                }
                sql += " GROUP BY a.appid, DATE_FORMAT(a.paytime, '%Y-%m') ORDER BY a.appid, a.paytime";
                gameapi.conn.query(sql, params, function (err, rows, fields) {
                    k++;
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    for (var j = 0; j < rows.length; j++) {
                        var binfo = rows[j];
                        binfo.hzimg = gameapi.GetServerUrl("management/blance/" + para.appid + "_" + para.timestart + "_" + "hz.png");
                        binfo.smimg = gameapi.GetServerUrl("management/blance/" + para.appid + "_" + para.timestart + "_" + "sm.png");
                        ret.push(binfo);
                    }
                    if (k == i) {
                        req.send(ret);
                    }
                    else {
                        return;
                    }
                });
            }
        });
    });
    app.AddSdkApi("admingetblancedetail", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var ret = [];
            var sql = "SELECT a.appid, DATE_FORMAT(a.paytime, '%Y-%m-%d') AS bdate, SUM(a.payrmb) AS income FROM t_userpay a" +
                " WHERE a.state >= 1 AND a.sdkid IS NOT NULL";
            var params = [];
            if (!!para.timestart) {
                sql += " AND DATE_FORMAT(a.paytime, '%Y-%m') = ?";
                params.push(para.timestart);
            }
            else {
                sql += " AND DATE_FORMAT(a.paytime, '%Y-%m') = DATE_FORMAT(now(), '%Y-%m')";
            }
            if (!!para.appid) {
                sql += " AND a.appid = ?";
                params.push(para.appid);
            }
            sql += " GROUP BY bdate ORDER BY bdate";
            gameapi.conn.query(sql, params, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err.message;
                }
                for (var j = 0; j < rows.length; j++) {
                    var binfo = rows[j];
                    binfo.hzimg = gameapi.GetServerUrl("management/blance/" + para.appid + "_" + para.timestart + "_" + "hz.png");
                    binfo.smimg = gameapi.GetServerUrl("management/blance/" + para.appid + "_" + para.timestart + "_" + "sm.png");
                    ret.push(binfo);
                }
                req.send(ret);
            });
        });
    });
    var ADMINUPLOADBLANCEFILEREQ = (function (_super) {
        __extends(ADMINUPLOADBLANCEFILEREQ, _super);
        function ADMINUPLOADBLANCEFILEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINUPLOADBLANCEFILEREQ;
    }(ADMINREQBASE));
    app.AddSdkApi("adminuploadblancefile", function (req) {
        var para = req.param;
        CheckUser(para, function (err, pri) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (pri.appname) {
                req.send(null, 1, "没有权限");
                return;
            }
            var relatePath = "../public/management/blance/" + para.gameid + "_" + para.addtime + "_" + para.flags + ".png";
            SaveFile(relatePath, req);
        });
    });
}
exports.InitApi = InitApi;
function SaveFile(relatePath, req) {
    var dest = app_1.GetAbsPath(relatePath);
    var havefile = false;
    if (req.files) {
        for (var i in req.files) {
            havefile = true;
            var src = req.files[i][0].path;
            gameapi.MoveFile(src, dest, function () {
                req.send({});
            });
            break;
        }
    }
    else
        req.send({});
}
function SaveFile2(relatePath1, relatePath2, req) {
    var dest1 = app_1.GetAbsPath(relatePath1);
    var dest2 = app_1.GetAbsPath(relatePath2);
    var havefile = false;
    if (req.files) {
        for (var i in req.files) {
            havefile = true;
            var src = req.files[i][0].path;
            var ex = src.substring(src.indexOf("."));
            var dest;
            if (i == "icoimg")
                dest = dest1 + ex;
            else if (i == "adimg")
                dest = dest2 + ex;
            gameapi.MoveFile(src, dest, function () {
            });
        }
        req.send({});
    }
    else
        req.send({});
}
function SaveFile3(relatePath1, relatePath2, relatePath3, req, relatePath4) {
    var dest1 = app_1.GetAbsPath(relatePath1);
    var dest2 = app_1.GetAbsPath(relatePath2);
    var dest3 = app_1.GetAbsPath(relatePath3);
    var havefile = false;
    if (req.files) {
        for (var i in req.files) {
            havefile = true;
            var src = req.files[i][0].path;
            var ex = src.substring(src.indexOf("."));
            var dest;
            if (i == "icoimg") {
                dest = dest1 + ex;
                if (!!relatePath4) {
                    gameapi.MoveFile(src, relatePath4, function () {
                    });
                }
            }
            else {
                if (i == "adimg")
                    dest = dest2 + ex;
                else if (i == "backimg")
                    dest = dest3 + ex;
            }
            gameapi.MoveFile(src, dest, function () {
            });
        }
        req.send({});
    }
    else
        req.send({});
}
function SaveFile4(relatePath1, relatePath2, relatePath3, relatePath5, req, relatePath4) {
    var dest1 = app_1.GetAbsPath(relatePath1);
    var dest2 = app_1.GetAbsPath(relatePath2);
    var dest3 = app_1.GetAbsPath(relatePath3);
    var dest4 = app_1.GetAbsPath(relatePath5);
    var havefile = false;
    if (req.files) {
        for (var i in req.files) {
            havefile = true;
            var src = req.files[i][0].path;
            var ex = src.substring(src.indexOf("."));
            var dest;
            if (i == "icoimg") {
                dest = dest1 + ex;
                if (!!relatePath4) {
                    gameapi.MoveFile(src, relatePath4, function () {
                    });
                }
            }
            else {
                if (i == "adimg")
                    dest = dest2 + ex;
                else if (i == "backimg")
                    dest = dest3 + ex;
                else if (i == "bannerimg")
                    dest = dest4 + ex;
            }
            gameapi.MoveFile(src, dest, function () {
            });
        }
        req.send({});
    }
    else
        req.send({});
}
function commitUpdate(id1, id2, orderby1, orderby2, req) {
    var sqlparamsEntities = [];
    var entity1 = {
        sql: "update t_gsh5game set orderby=? where id=? and del=0",
        params: [orderby1, id2]
    };
    var entity2 = {
        sql: "update t_gsh5game set orderby=? where id=? and del=0",
        params: [orderby2, id1]
    };
    sqlparamsEntities.push(entity1);
    sqlparamsEntities.push(entity2);
    gameapi.conn.execTrans(sqlparamsEntities, function (err, data) {
        if (err) {
            req.send(null, 1, err.message);
            return;
        }
    });
}
function commitUpdate2(id1, id2, orderby1, orderby2, req) {
    var sqlparamsEntities = [];
    var entity1 = {
        sql: "update t_gsactivity set orderby=? where Id=? and del=0",
        params: [orderby1, id1]
    };
    var entity2 = {
        sql: "update t_gsactivity set orderby=? where Id=? and del=0",
        params: [orderby2, id2]
    };
    sqlparamsEntities.push(entity1);
    sqlparamsEntities.push(entity2);
    gameapi.conn.execTrans(sqlparamsEntities, function (err, data) {
        if (err) {
            req.send(null, 1, err.message);
            return;
        }
    });
}
function commitUpdate_hotgame(id1, id2, orderby1, orderby2, req) {
    var sqlparamsEntities = [];
    var entity1 = {
        sql: "update t_gshotgame set orderby=? where Id=? and del=0",
        params: [orderby1, id1]
    };
    var entity2 = {
        sql: "update t_gshotgame set orderby=? where Id=? and del=0",
        params: [orderby2, id2]
    };
    sqlparamsEntities.push(entity1);
    sqlparamsEntities.push(entity2);
    gameapi.conn.execTrans(sqlparamsEntities, function (err, data) {
        if (err) {
            req.send(null, 1, err.message);
            return;
        }
    });
}
//# sourceMappingURL=admin.js.map