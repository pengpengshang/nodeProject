"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var gameapi = require("./gameapi");
var userapi = require("./userapi");
var app = require("../app");
var alipay = require("./alipay");
var wxpay = require("./wxpay");
var https = require('https');
var url = require('url');
var fs = require('fs');
var xml2js = require('xml2js');
var gameapi_1 = require("./gameapi");
var qs = require('querystring');
var shieldname = require('./shieldname');
var ws = require("nodejs-websocket");
//缓存数据
var CacheData;
(function (CacheData) {
    CacheData.discount = 10; //折扣
    function LoadDiscount() {
        gameapi.conn.query("select value from t_gsconfig where name='discount'", [], function (err, rows, fields) {
            if (err) {
                throw (err);
            }
            CacheData.discount = parseFloat(rows[0]["value"]);
        });
        gameapi.conn.query("select value from t_gsconfig where name='discountText'", [], function (err, rows, fields) {
            if (err) {
                throw (err);
            }
            CacheData.discountText = rows[0]["value"];
        });
    }
    CacheData.LoadDiscount = LoadDiscount;
    //当前在线奖池累计
    var TOTALAWARDPOOL = (function () {
        function TOTALAWARDPOOL() {
            this.value = 0; //当前数值
            this.intervalMax = 10; //随机几秒增加一次（最大秒数）
            this.intervalMin = 30; //随机几秒增加一次（最小秒数）
            this.addMax = 5; //每次增加数值（最大）
            this.addMin = 30; //每次增加（最小）
        }
        return TOTALAWARDPOOL;
    }());
    CacheData.TOTALAWARDPOOL = TOTALAWARDPOOL;
    CacheData.totalAwardPool = new TOTALAWARDPOOL();
    //精彩活动下xxx VS yyy 多少K币
    var VSINFO = (function () {
        function VSINFO() {
        }
        return VSINFO;
    }());
    CacheData.VSINFO = VSINFO;
    CacheData.vsInfo = new VSINFO();
    //兑换记录
    var EXCHANGEINFO = (function () {
        function EXCHANGEINFO() {
        }
        return EXCHANGEINFO;
    }());
    CacheData.EXCHANGEINFO = EXCHANGEINFO;
    CacheData.exchangeInfo = [];
    function AppendExchangeInfo(info) {
        CacheData.exchangeInfo.push(info);
        if (CacheData.exchangeInfo.length > 15) {
            CacheData.exchangeInfo.splice(0, CacheData.exchangeInfo.length - 10);
        }
    }
    CacheData.AppendExchangeInfo = AppendExchangeInfo;
    var WEEKLYGOODS //每周兑换广告
     = (function () {
        function WEEKLYGOODS //每周兑换广告
            () {
        }
        return WEEKLYGOODS //每周兑换广告
        ;
    }());
    CacheData.WEEKLYGOODS //每周兑换广告
     = WEEKLYGOODS //每周兑换广告
    ;
    var weeklyGoods = []; //保存结束时间>当前时间的所有广告，已结束的广告会删除
    function AppendWeeklyGoods(info) {
        weeklyGoods.push(info);
    }
    CacheData.AppendWeeklyGoods = AppendWeeklyGoods;
    function RemoveWeeklyGoods(id) {
        for (var i = 0; i < weeklyGoods.length; i++) {
            if (weeklyGoods[i].id == id) {
                weeklyGoods.splice(i, 1);
                return;
            }
        }
    }
    CacheData.RemoveWeeklyGoods = RemoveWeeklyGoods;
    function GetWeeklyGoods() {
        var len = weeklyGoods.length;
        if (len > 0) {
            var now = new Date().getTime();
            for (var i = 0; i < len; i++) {
                if (weeklyGoods[i].timeend > now) {
                    if (i > 0) {
                        weeklyGoods.splice(0, i);
                        if (weeklyGoods[0].timestart <= now)
                            return weeklyGoods[0];
                        break;
                    }
                }
            }
        }
        if (weeklyGoods.length < 1)
            return null;
        return weeklyGoods[0];
    }
    CacheData.GetWeeklyGoods = GetWeeklyGoods;
    //兑换商城上的广告
    var SHOPAD = (function () {
        function SHOPAD() {
        }
        return SHOPAD;
    }());
    CacheData.SHOPAD = SHOPAD;
    CacheData.shopAD = [];
    function AddShopAD(ad) {
        for (var i = 0; i < CacheData.shopAD.length; i++) {
            if (CacheData.shopAD[i].id == ad.id) {
                CacheData.shopAD[i] = ad;
                return;
            }
        }
        CacheData.shopAD.push(ad);
    }
    CacheData.AddShopAD = AddShopAD;
    function RemoveShopAD(id) {
        for (var i = 0; i < CacheData.shopAD.length; i++) {
            if (CacheData.shopAD[i].id == id) {
                CacheData.shopAD.splice(i, 1);
                break;
            }
        }
    }
    CacheData.RemoveShopAD = RemoveShopAD;
    //PK记录,XXX VS YYY 1000K币
    var PKRECORD = (function () {
        function PKRECORD() {
        }
        return PKRECORD;
    }());
    CacheData.PKRECORD = PKRECORD;
    CacheData.pkRecord = [];
    function AddPkRecord(user1, user2, gold) {
        var rec = new PKRECORD();
        rec.user1 = user1.nickname;
        rec.user2 = user2.nickname;
        rec.gold = gold;
        CacheData.pkRecord.push(rec);
        if (CacheData.pkRecord.length > 15) {
            CacheData.pkRecord.splice(0, CacheData.pkRecord.length - 10);
        }
    }
    CacheData.AddPkRecord = AddPkRecord;
    //精彩活动广告
    var ACTIVITYAD = (function () {
        function ACTIVITYAD() {
        }
        return ACTIVITYAD;
    }());
    CacheData.ACTIVITYAD = ACTIVITYAD;
    CacheData.activityAd = [];
    function LoadActivityAd() {
        gameapi.conn.query("select id,url,isrec from t_gsactivity where del=0 order by orderby desc", [], function (err, rows, fields) {
            if (err) {
                throw (err);
            }
            CacheData.activityAd.splice(0);
            for (var i = 0; i < rows.length; i++) {
                var ad = rows[i];
                ad.img = gameapi.GetServerUrl("gamecenter/activity/" + ad.id + ".jpg");
                CacheData.activityAd.push(ad);
            }
        });
    }
    CacheData.LoadActivityAd = LoadActivityAd;
    function AddActivityAd(ad) {
        for (var i = 0; i < CacheData.activityAd.length; i++) {
            if (CacheData.activityAd[i].id == ad.id) {
                CacheData.activityAd[i] = ad;
                return;
            }
        }
        CacheData.activityAd.push(ad);
    }
    CacheData.AddActivityAd = AddActivityAd;
    function RemoveActivityAd(id) {
        for (var i = 0; i < CacheData.activityAd.length; i++) {
            if (CacheData.activityAd[i].id == id) {
                CacheData.activityAd.splice(i, 1);
                return;
            }
        }
    }
    CacheData.RemoveActivityAd = RemoveActivityAd;
    function GetConfig(name, cb) {
        gameapi.conn.query("select value from t_gsconfig where name=?", [name], function (err, rows, fields) {
            if (err) {
                throw (err);
            }
            if (rows.length > 0)
                cb(rows[0]["value"]);
            else
                cb(null);
        });
    }
    CacheData.GetConfig = GetConfig;
    var totalAwardTimer;
    function LoadTotalAwardPool() {
        GetConfig("totalAwardPool", function (val) {
            if (val != null)
                CacheData.totalAwardPool.value = parseInt(val);
        });
        GetConfig("totalAwardPoolInterval", function (val) {
            if (val) {
                var str = val.split(",");
                CacheData.totalAwardPool.intervalMin = parseInt(str[0]);
                CacheData.totalAwardPool.intervalMax = parseInt(str[1]);
            }
        });
        GetConfig("totalAwardPoolAdd", function (val) {
            if (val) {
                var str = val.split(",");
                CacheData.totalAwardPool.addMin = parseInt(str[0]);
                CacheData.totalAwardPool.addMax = parseInt(str[1]);
            }
        });
        if (!totalAwardTimer) {
            setTimeout(function () {
                totalAwardTimer = setTimeout(onTotalAwardTimer, (Math.floor(Math.random() * (CacheData.totalAwardPool.intervalMax - CacheData.totalAwardPool.intervalMin) * 1000 + CacheData.totalAwardPool.intervalMin * 1000)));
            }, 1000);
        }
    }
    CacheData.LoadTotalAwardPool = LoadTotalAwardPool;
    function onTotalAwardTimer() {
        CacheData.totalAwardPool.value += Math.floor(Math.random() * (CacheData.totalAwardPool.addMax - CacheData.totalAwardPool.addMin) + CacheData.totalAwardPool.addMin);
        gameapi.conn.query("update t_gsconfig set value=? where name='totalAwardPool'", [CacheData.totalAwardPool.value], function (err, rows, fields) {
            if (err) {
                throw (err);
            }
        });
        totalAwardTimer = setTimeout(onTotalAwardTimer, (Math.floor(Math.random() * (CacheData.totalAwardPool.intervalMax - CacheData.totalAwardPool.intervalMin) * 1000 + CacheData.totalAwardPool.intervalMin * 1000)));
    }
    function LoadExchangeInfo() {
        //exchangeInfo
        gameapi.conn.query("select a.userid,b.nickname ,b.phone,a.goodsname,a.createtime\n" +
            "from t_gsexchange a,t_gameuser b,t_gsuser c\n" +
            "where a.userid=c.userid and c.sdkuserid=b.userid\n" +
            "order by a.createtime limit 0,10", [], function (err, rows, fields) {
            if (err) {
                throw (err);
            }
            CacheData.exchangeInfo.splice(0);
            for (var i = 0; i < rows.length; i++) {
                CacheData.exchangeInfo.push({
                    phone: rows[i]["phone"],
                    goods: rows[i]["goodsname"],
                    time: rows[i]["createtime"].getTime()
                });
            }
        });
    }
    CacheData.LoadExchangeInfo = LoadExchangeInfo;
    function LoadShopAD() {
        //shopAD
        gameapi.conn.query("select id,goodsid,createtime from t_gsshopad where del=0 order by createtime", [], function (err, rows, fields) {
            if (err) {
                throw (err);
            }
            CacheData.shopAD.splice(0);
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var ad = new SHOPAD();
                ad.id = row["id"];
                ad.goodsid = row["goodsid"];
                ad.img = gameapi.GetServerUrl("gamecenter/shop/ad/" + ad.id + ".jpg");
                CacheData.shopAD.push(ad);
            }
        });
    }
    CacheData.LoadShopAD = LoadShopAD;
    function LoadPKRecord() {
        //pkrecord
        // var sql="select a.nickname user1,b.nickname user2,c.wingold gold from t_gspkresult c,t_gameuser a,t_gameuser b,t_gsuser d,t_gsuser e\n"+
        //     "where a.userid=d.sdkuserid and b.userid=e.sdkuserid and c.user1=d.userid and c.user2=e.userid order by c.id desc limit 0,10";
        var sql = "select nickname1 user1,nickname2 user2,wingold gold from t_gspkresult order by id desc limit 0,10";
        gameapi.conn.query(sql, [], function (err, rows, fields) {
            if (err) {
                throw (err);
            }
            CacheData.pkRecord.splice(0);
            for (var i = rows.length - 1; i >= 0; i--) {
                var rec = rows[i];
                CacheData.pkRecord.push(rec);
            }
        });
    }
    CacheData.LoadPKRecord = LoadPKRecord;
    function LoadCacheData() {
        //LoadDiscount();
        //LoadTotalAwardPool();
        //LoadExchangeInfo();
        //LoadWeeklyGoods();
        //LoadShopAD();
        //LoadPKRecord();
        LoadActivityAd();
    }
    CacheData.LoadCacheData = LoadCacheData;
    function LoadWeeklyGoods() {
        weeklyGoods.splice(0);
        //weeklyGoods
        gameapi.conn.query("select a.id,a.goodsid,a.timestart,a.timeend,b.stock from t_gsweeklygoods a,t_gsshop b  where a.del=0 and a.goodsid=b.id and timeend>now() order by timestart", [], function (err, rows, fields) {
            if (err) {
                throw (err);
            }
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var wg = new WEEKLYGOODS();
                wg.id = row["id"];
                wg.goodsid = row["goodsid"];
                wg.timestart = row["timestart"].getTime();
                wg.timeend = row["timeend"].getTime();
                wg.stock = row["stock"];
                wg.img = gameapi.GetServerUrl("gamecenter/shop/weekly/" + wg.id + ".jpg");
                weeklyGoods.push(wg);
            }
        });
    }
    CacheData.LoadWeeklyGoods = LoadWeeklyGoods;
})(CacheData = exports.CacheData || (exports.CacheData = {}));
//用户信息
var GSUSERINFO = (function () {
    function GSUSERINFO() {
        this.gold = 0; //金币
    }
    return GSUSERINFO;
}());
//玩家登录后的REQ要以这个为基类
var GSUSERREQBASE = (function () {
    function GSUSERREQBASE() {
    }
    return GSUSERREQBASE;
}());
exports.g_gsuser = {}; //g_gsuser[userid]=GSUSERINFO
//取得已登录的用户信息，g_gsuser会在超时后释放，因此如果释放则自动从数据库查出
function GetGameUser(userid, session, cb) {
    if (!userid)
        userid = parseInt(session.split("_")[0]);
    var ret = exports.g_gsuser[userid];
    if (!ret) {
        loaduser();
        return;
    }
    if (!!ret) {
        if (!session || ret.session == session) {
            ret.lasttime = new Date().getTime();
            cb(ret, null);
        }
        else {
            loaduser();
            return;
        }
    }
    function loaduser() {
        var sql = "select a.loginid, a.nickname,a.point,a.sex,a.headico,a.haspwd,a.phone,a.email,b.sdkuserid, b.gold,b.address,b.addressee,b.addressdetail,b.zipcode,b.addrphone from t_gameuser a, t_gsuser b where a.userid=b.sdkuserid and  b.userid=?";
        var para = [userid];
        if (session) {
            sql += " and b.session=?";
            para.push(session);
        }
        gameapi.conn.query(sql, para, function (err, rows, fields) {
            if (err) {
                cb(null, err);
                return;
            }
            if (rows.length == 0) {
                cb(null, null);
                return;
            }
            ret = new GSUSERINFO();
            ret.userid = userid;
            ret.sdkuserid = rows[0]["sdkuserid"];
            ret.sdkloginid = rows[0]["loginid"];
            ret.nickname = rows[0]["nickname"];
            ret.point = rows[0]["point"];
            ret.sex = rows[0]["sex"];
            ret.headico = rows[0]["headico"];
            ret.gold = rows[0]["gold"];
            ret.haspwd = rows[0]["haspwd"];
            ret.phone = rows[0]["phone"];
            ret.email = rows[0]["email"];
            ret.address = rows[0]["address"];
            ret.addressee = rows[0]["addressee"];
            ret.addressdetail = rows[0]["addressdetail"];
            ret.zipcode = rows[0]["zipcode"];
            ret.addrphone = rows[0]["addrphone"];
            ret.session = session;
            ret.lasttime = new Date().getTime();
            if (ret.headico.indexOf(".qlogo.cn") < 0) {
                ret.headico = gameapi.GetServerUrl("gamecenter/head/" + ret.headico);
            }
            exports.g_gsuser[ret.userid] = ret;
            gameapi.conn.query("update t_gameuser set lastlogintime=now() where userid=?", [ret.sdkuserid], function (err, rows, fields) {
            });
            cb(ret, null);
        });
    }
}
exports.GetGameUser = GetGameUser;
///游戏中心用WEBSOCKET,用于需要双向通讯的场合，辅助正常的HTTP接口
//WEBSOCKET实际传输的数据结构
var WEBSOCKETPACK = (function () {
    function WEBSOCKETPACK() {
        this.errno = 0;
    }
    return WEBSOCKETPACK;
}());
var g_websocketfun = {}; //g_websocketfun[name]=cb:(req:WebSocketReq)=>void
var WebSocketReq = (function () {
    function WebSocketReq() {
    }
    WebSocketReq.prototype.send = function (name, data, errno, message) {
        if (errno === void 0) { errno = 0; }
        if (message === void 0) { message = null; }
        var dat = new WEBSOCKETPACK();
        dat.name = name;
        dat.data = data;
        dat.errno = errno;
        dat.message = message;
        var str = JSON.stringify(dat);
        this.wsocket.sendText(str);
    };
    WebSocketReq.prototype.response = function (data, errno, message) {
        if (errno === void 0) { errno = 0; }
        if (message === void 0) { message = null; }
        return this.send(this.param.name, data, errno, message);
    };
    return WebSocketReq;
}());
var server = ws.createServer(function (conn) {
    conn.on("text", function (str) {
        //       console.trace(str);
        var param = JSON.parse(str);
        var req = new WebSocketReq();
        req.param = param;
        req.wsocket = conn;
        var run = g_websocketfun[param.name];
        if (!run)
            return; //非法操作
        run(req);
    });
    conn.on("close", function onclose(code, reason) {
        conn.removeListener("close", onclose);
        onWsClose(conn, code, reason);
    });
    conn.on("error", function onerr(code, reason) {
        conn.removeListener("error", onerr);
        onWsClose(conn, code, reason);
    });
}).listen(gameapi_1.g_gamecenterwsport);
function onWsClose(conn, code, reason) {
    for (var i in g_gamerooms) {
        var room = g_gamerooms[i];
        for (var j = 0; j < room.users.length; j++) {
            var usr = room.users[j];
            if (usr.wsocket == conn) {
                if (room.IsWaiting()) {
                    room.GameOver();
                }
                else {
                    room.SetUserExit(usr);
                }
            }
        }
    }
    conn.close();
}
//添加websocket接口
function AddWSApi(name, cb) {
    g_websocketfun[name] = cb;
}
exports.AddWSApi = AddWSApi;
//PK游戏信息
var PKAPPINFO = (function () {
    function PKAPPINFO() {
    }
    return PKAPPINFO;
}());
exports.PKAPPINFO = PKAPPINFO;
//联运游戏信息
//联运游戏信息
var H5APPINFO = (function () {
    function H5APPINFO() {
    }
    return H5APPINFO;
}());
exports.H5APPINFO = H5APPINFO;
var H5APPINFOADDIMG = (function (_super) {
    __extends(H5APPINFOADDIMG, _super);
    function H5APPINFOADDIMG() {
        _super.apply(this, arguments);
    }
    return H5APPINFOADDIMG;
}(H5APPINFO));
exports.H5APPINFOADDIMG = H5APPINFOADDIMG;
var SHOPGOODSINFO = (function () {
    function SHOPGOODSINFO() {
    }
    return SHOPGOODSINFO;
}());
exports.SHOPGOODSINFO = SHOPGOODSINFO;
var EXCHANGERECORD = (function () {
    function EXCHANGERECORD() {
    }
    return EXCHANGERECORD;
}());
exports.EXCHANGERECORD = EXCHANGERECORD;
var GSUSERH5LOGINFO = (function () {
    function GSUSERH5LOGINFO() {
    }
    return GSUSERH5LOGINFO;
}());
exports.GSUSERH5LOGINFO = GSUSERH5LOGINFO;
//取得PK游戏列表，id:只取某个游戏
function GetPkGameList(cb, id) {
    var sql = "select id,name,url,detail,opencount,playcount,createtime,entrancegold,wingold,enablerobot,robotdelay,robotscorespeed,robotplaytimemax,robotplaytimemin,robotstartwait,robotwinrate,robotscoreinterval from t_gspkgame where del=0";
    var para = [];
    if (!!id) {
        sql += " and id=?";
        para.push(id);
    }
    sql += "  order by createtime desc";
    gameapi.conn.query(sql, para, function (err, rows, fields) {
        if (err) {
            cb(err, null);
            return;
        }
        var applist = [];
        for (var i = 0; i < rows.length; i++) {
            var info = rows[i];
            info.createtime = rows[i]["createtime"].getTime();
            info.ico = gameapi.GetServerUrl("gamecenter/pkgame/ico/" + info.id + ".png");
            info.bg = gameapi.GetServerUrl("gamecenter/pkgame/bg/" + info.id + ".jpg");
            applist[i] = info;
        }
        cb(null, applist);
    });
}
exports.GetPkGameList = GetPkGameList;
//取得H5游戏列表，id:只取某个游戏
function GetH5AppList(cb, id) {
    var sql = "select id,name,url,detail,opencount,playcount,createtime,getgold,remark,ishot,isrec,hasgift,rank,orderby,newsort,type from t_gsh5game where del=0";
    var para = [];
    if (!!id) {
        sql += " and id=?";
        para.push(id);
    }
    sql += "  order by orderby desc";
    gameapi.conn.query(sql, para, function (err, rows, fields) {
        if (err) {
            cb(err, null);
            return;
        }
        var applist = [];
        for (var i = 0; i < rows.length; i++) {
            var info = rows[i];
            info.createtime = rows[i]["createtime"].getTime();
            var path = app.GetAbsPath("../public/gamecenter/h5game/ico/" + info.id + ".png");
            if (fs.existsSync(path)) {
                info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + info.id + ".png");
            }
            else {
                info.ico = "";
            }
            applist[i] = info;
        }
        cb(null, applist);
    });
}
exports.GetH5AppList = GetH5AppList;
//取得H5游戏列表，NAME:取某个游戏,模糊查询
function GetH5AppListByName(cb, name) {
    var sql = "select id,name,url,detail,opencount,playcount,createtime,getgold,remark,ishot,isrec,hasgift,rank,orderby from t_gsh5game where del=0";
    if (!!name) {
        sql += " and name like '%" + name + "%'";
    }
    sql += "  order by orderby desc";
    gameapi.conn.query(sql, [], function (err, rows, fields) {
        if (err) {
            cb(err, null);
            return;
        }
        var applist = [];
        for (var i = 0; i < rows.length; i++) {
            var info = rows[i];
            info.createtime = rows[i]["createtime"].getTime();
            info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + info.id + ".png");
            info.img = gameapi.GetServerUrl("gamecenter/h5game/img/" + info.id + ".jpg");
            applist[i] = info;
        }
        cb(null, applist);
    });
}
exports.GetH5AppListByName = GetH5AppListByName;
function GetRecentPlayH5AppList(cb, para) {
    var applists = [];
    var sql = "select id,name,url,detail,opencount,playcount,createtime,getgold,remark,ishot,isrec,hasgift,rank,orderby from t_gsh5game where del=0 and Id in(SELECT DISTINCT(gameid) from t_gsuserh5log WHERE userid=?) ORDER BY createtime DESC  ";
    gameapi.conn.query(sql, [para], function (err, rows, fields) {
        if (err) {
            cb(err, null);
            return;
        }
        for (var j = 0; j < rows.length; j++) {
            var info = rows[j];
            info.createtime = rows[j]["createtime"].getTime();
            info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + info.id + ".png");
            applists.push(info);
        }
        cb(null, applists);
    });
}
exports.GetRecentPlayH5AppList = GetRecentPlayH5AppList;
function GetShopGoodsList(id, cb) {
    var para = [];
    var sql = "select id,name,price,rmbprice,stock,detail,notice from t_gsshop where del=0 ";
    if (!!id) {
        sql += "and id=?";
        para.push(id);
    }
    sql += " order by orderby desc";
    gameapi.conn.query(sql, para, function (err, rows, fields) {
        if (err) {
            cb(err, null);
            return;
        }
        var goodslist = [];
        for (var i = 0; i < rows.length; i++) {
            var goods = rows[i];
            goods.ico = gameapi.GetServerUrl("gamecenter/shop/ico/" + goods.id + ".png");
            goods.img = gameapi.GetServerUrl("gamecenter/shop/img/" + goods.id + ".jpg");
            goodslist[i] = goods;
        }
        cb(null, goodslist);
    });
}
exports.GetShopGoodsList = GetShopGoodsList;
//取得兑换记录
function GetExchangeRecord(userid, cb) {
    var para = [];
    var sql = "select a.id,a.userid,a.goodsid,a.goodsname,a.createtime,a.state,a.costgold,a.rmbprice,a.message,b.address,b.addressee,b.zipcode,b.addressdetail,b.addrphone from t_gsexchange a left join t_gsuser b on a.userid=b.userid";
    if (userid) {
        sql += " where a.userid=?";
        para.push(userid);
    }
    sql += " order by a.createtime desc";
    gameapi.conn.query(sql, para, function (err, rows, fields) {
        if (err) {
            cb(err, null);
            return;
        }
        var rec = [];
        for (var i = 0; i < rows.length; i++) {
            rec[i] = rows[i];
            rec[i].createtime = rows[i]["createtime"].getTime();
        }
        cb(null, rec);
    });
}
exports.GetExchangeRecord = GetExchangeRecord;
function GetRandNick(cb) {
    gameapi.conn.GetConn(function (err, conn) {
        if (err) {
            cb(null, err);
            return;
        }
        conn.beginTransaction(function (err) {
            if (err) {
                conn.rollback(function (err2) {
                    conn.release();
                });
                cb(null, err);
                return;
            }
            conn.query("select a.id,a.name from t_random_name a where a.id>=(select nextid from t_random_nextid) and state=0 limit 0,1", [], function (err, rows, fields) {
                if (err) {
                    conn.rollback(function (err2) {
                        conn.release();
                    });
                    cb(null, err);
                    return;
                }
                if (rows.length == 0) {
                    conn.query("select a.id,a.name from t_random_name a where state=0 limit 0,1", [], function (err, rows, fields) {
                        if (err) {
                            conn.rollback(function (err2) {
                                conn.release();
                            });
                            cb(null, err);
                            return;
                        }
                        fun(rows);
                    });
                }
                else {
                    fun(rows);
                }
                function fun(rows) {
                    var id = rows[0]["id"];
                    var name = rows[0]["name"];
                    conn.query("update t_random_nextid set nextid=?", [id + 1], function (err, rows, fields) {
                        if (err) {
                            conn.rollback(function (err2) {
                                conn.release();
                            });
                            cb(null, err);
                            return;
                        }
                        conn.commit(function (err) {
                            conn.release();
                            if (err) {
                                cb(null, err);
                                return;
                            }
                            cb(name, null);
                        });
                    });
                }
            });
        });
    });
}
function GetUserLv(cb, sdkuserid) {
    gameapi.conn.query("select sum(a.payrmb) paytotal from t_userpay a where a.userid=? and a.state>=1 AND sdkid = 0 group by userid", [sdkuserid], function (err, rows, fileds) {
        if (err) {
            cb(err.message, null);
            return;
        }
        var lv = 0;
        if (rows.length != 0) {
            var paytotal = rows[0]['paytotal'];
            if (paytotal >= 0 && paytotal < 6) {
                lv = 0;
            }
            else if (paytotal >= 6 && paytotal < 50) {
                lv = 1;
            }
            else if (paytotal >= 50 && paytotal < 100) {
                lv = 2;
            }
            else if (paytotal >= 100 && paytotal < 200) {
                lv = 3;
            }
            else if (paytotal >= 200 && paytotal < 500) {
                lv = 4;
            }
            else if (paytotal >= 500 && paytotal < 2000) {
                lv = 5;
            }
            else if (paytotal >= 2000 && paytotal < 5000) {
                lv = 6;
            }
            else if (paytotal >= 5000 && paytotal < 10000) {
                lv = 7;
            }
            else if (paytotal >= 10000 && paytotal < 30000) {
                lv = 8;
            }
            else if (paytotal >= 30000 && paytotal < 50000) {
                lv = 9;
            }
            else if (paytotal >= 50000 && paytotal < 100000) {
                lv = 10;
            }
            else if (paytotal >= 100000 && paytotal < 200000) {
                lv = 11;
            }
            else if (paytotal >= 200000 && paytotal < 360000) {
                lv = 12;
            }
            else if (paytotal >= 360000 && paytotal < 700000) {
                lv = 13;
            }
            else if (paytotal >= 700000 && paytotal < 1200000) {
                lv = 14;
            }
            else {
                lv = 15;
            }
        }
        cb(null, lv);
    });
}
exports.GetUserLv = GetUserLv;
function InitApi() {
    CacheData.LoadCacheData();
    setInterval(function () {
        CacheData.LoadCacheData();
    }, 300000);
    //登录后基类
    var USERREQBASE = (function () {
        function USERREQBASE() {
        }
        return USERREQBASE;
    }());
    //随机昵称
    var GSUSERRANDNICKREQ = (function () {
        function GSUSERRANDNICKREQ() {
        }
        return GSUSERRANDNICKREQ;
    }());
    var GSUSERRANDNICKRESP = (function () {
        function GSUSERRANDNICKRESP() {
        }
        return GSUSERRANDNICKRESP;
    }());
    app.AddSdkApi("gsuserrandnick", function (req) {
        var para = req.param;
        GetRandNick(function (nickname, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw (err);
            }
            req.send({ nickname: nickname });
        });
    });
    //用户注册
    var GSUSERREGREQ = (function () {
        function GSUSERREGREQ() {
        }
        return GSUSERREGREQ;
    }());
    var GSUSERREGRESP = (function () {
        function GSUSERREGRESP() {
        }
        return GSUSERREGRESP;
    }());
    app.AddSdkApi("gsuserreg", function (req) {
        var para = req.param;
        if (para.phone && alipay.md5Hex(para.code) != para.key) {
            req.send(null, 1, "验证码错误！");
            return;
        }
        var reginfo = new userapi.USERREGREQ();
        reginfo.loginid = "__loginid" + Math.random();
        reginfo.pwd = para.pwd;
        reginfo.channelappid = null;
        gameapi.conn.query("select * from t_gameuser where loginid=?", [para.loginid], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            if (rows.length != 0) {
                req.send(null, 1, "用户名已存在");
                return;
            }
            userapi.UserReg(reginfo, req.ip, !para.pwd, function (user, err) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                //修改loginid和nickname
                if (para.loginid != null) {
                    user.loginid = para.loginid;
                }
                else {
                    user.loginid = "_" + user.userid;
                }
                user.nickname = gameapi.emoji2Str(para.nickname);
                gameapi.conn.query("update t_gameuser set loginid=?,nickname=?,phone=? where userid=?", [user.loginid, user.nickname, para.phone, user.userid], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    //添加到t_gsuser表,默认0金币
                    gameapi.conn.query("delete from t_gsuser where sdkuserid=?", [user.userid], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        gameapi.conn.query("insert into t_gsuser (sdkuserid,gold,regchannel,regip) values (?,?,?,?)", [user.userid, 1000, para.channel, req.ip], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                throw err;
                            }
                            var gsuser = new GSUSERINFO();
                            gsuser.sdkloginid = user.loginid;
                            gsuser.sdkuserid = user.userid;
                            gsuser.gold = 1000;
                            gsuser.haspwd = 0;
                            gsuser.headico = user.headico;
                            gsuser.lasttime = user.lasttime;
                            gsuser.nickname = user.nickname;
                            gsuser.userid = rows.insertId;
                            gsuser.session = gsuser.userid + "_" + gameapi.GetNextSession();
                            exports.g_gsuser[gsuser.userid] = gsuser;
                            gameapi.conn.query("update t_random_name set state=1 where name=?", [user.nickname], function (err, rows, fields) {
                            });
                            gameapi.conn.query("update t_gsuser set session=? where userid=?", [gsuser.session, gsuser.userid], function (err, rows, fields) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    throw err;
                                }
                                var ret = new GSUSERREGRESP();
                                ret.userinfo = gsuser;
                                req.send(ret);
                            });
                        });
                    });
                });
            });
        });
    });
    //用户登录
    var GSUSERLOGINREQ = (function () {
        function GSUSERLOGINREQ() {
        }
        return GSUSERLOGINREQ;
    }());
    var GSUSERLOGINRESP = (function () {
        function GSUSERLOGINRESP() {
        }
        return GSUSERLOGINRESP;
    }());
    app.AddSdkApi("gsuserlogin", function (req) {
        var para = req.param;
        if (!para.loginid && !para.phone) {
            throw new Error("不支持自动注册");
        }
        else {
            if (para.code == send_code) {
                if (!para.code && !para.pwd && (para.pwd == alipay.md5Hex(para.code))) {
                    req.send("success");
                    return;
                }
                var paras;
                var sql = "select a.loginid, a.nickname,a.headico,a.sex,a.point,a.phone,a.email,a.userid sdkuserid,b.userid,b.gold,b.address,b.addressee,b.addressdetail,b.zipcode,b.addrphone, a.haspwd\n" +
                    "from t_gameuser a\n" +
                    "left join  t_gsuser b on a.userid=b.sdkuserid\n" +
                    "where ";
                if (para.loginid) {
                    sql += " (a.loginid=? or (a.phone is not null and a.phone!='' and a.phone=?)) and a.pwd=?";
                    paras = [para.loginid, para.loginid, para.pwd];
                }
                else if (para.phone) {
                    sql += " a.phone is not null and a.phone!='' and a.phone=? ";
                    paras = [para.phone, para.code];
                }
                gameapi.conn.query(sql, paras, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    if (rows.length == 0) {
                        var reginfo = new userapi.USERREGREQ();
                        reginfo.loginid = "__loginid" + Math.random();
                        userapi.UserReg(reginfo, req.ip, !para.pwd, function (user, err) {
                            if (err) {
                                req.send(null, 1, err.message);
                                throw err;
                            }
                            user.loginid = "5wan" + user.userid;
                            gameapi.conn.query("update t_gameuser set loginid=?,nickname=?,phone=? where userid=?", [user.loginid, para.phone, para.phone, user.userid], function (err, rows, fields) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    throw err;
                                }
                                //添加到t_gsuser表,默认0金币
                                gameapi.conn.query("delete from t_gsuser where sdkuserid=?", [user.userid], function (err, rows, fields) {
                                    if (err) {
                                        req.send(null, 1, err.message);
                                        throw err;
                                    }
                                    gameapi.conn.query("insert into t_gsuser (sdkuserid,gold,regip) values (?,?,?)", [user.userid, 0, req.ip], function (err, rows, fields) {
                                        if (err) {
                                            req.send(null, 1, err.message);
                                            throw err;
                                        }
                                        var gsuser = new GSUSERINFO();
                                        gsuser.sdkloginid = user.loginid;
                                        gsuser.sdkuserid = user.userid;
                                        gsuser.gold = 1000;
                                        gsuser.haspwd = 0;
                                        gsuser.headico = user.headico;
                                        gsuser.lasttime = user.lasttime;
                                        gsuser.nickname = user.nickname;
                                        gsuser.userid = rows.insertId;
                                        gsuser.session = gsuser.userid + "_" + gameapi.GetNextSession();
                                        exports.g_gsuser[gsuser.userid] = gsuser;
                                        gameapi.conn.query("update t_random_name set state=1 where name=?", [user.nickname], function (err, rows, fields) {
                                        });
                                        gameapi.conn.query("update t_gsuser set session=? where userid=?", [gsuser.session, gsuser.userid], function (err, rows, fields) {
                                            if (err) {
                                                req.send(null, 1, err.message);
                                                throw err;
                                            }
                                            var ret = new GSUSERREGRESP();
                                            ret.userinfo = gsuser;
                                            req.send(ret);
                                        });
                                    });
                                });
                            });
                        });
                    }
                    else {
                        var gsuser = new GSUSERINFO();
                        gsuser.sdkloginid = rows[0]["loginid"];
                        gsuser.sdkuserid = rows[0]["sdkuserid"];
                        gsuser.gold = rows[0]["gold"];
                        gsuser.haspwd = rows[0]["haspwd"];
                        gsuser.headico = rows[0]["headico"];
                        gsuser.lasttime = new Date().getTime();
                        gsuser.nickname = rows[0]["nickname"];
                        gsuser.userid = rows[0]["sdkuserid"];
                        gsuser.phone = rows[0]["phone"];
                        gsuser.sex = rows[0]["sex"];
                        gsuser.point = rows[0]["point"];
                        gsuser.email = rows[0]["email"];
                        gsuser.address = rows[0]["address"];
                        gsuser.addressee = rows[0]["addressee"];
                        gsuser.addressdetail = rows[0]["addressdetail"];
                        gsuser.zipcode = rows[0]["zipcode"];
                        gsuser.addrphone = rows[0]["addrphone"];
                        gsuser.session = gsuser.userid + "_" + gameapi.GetNextSession();
                        gsuser.headico = gameapi.GetServerUrl("gamecenter/head/" + gsuser.headico);
                        fun();
                    }
                    function fun() {
                        exports.g_gsuser[gsuser.userid] = gsuser;
                        gameapi.conn.query("update t_gsuser set session=? where userid=?", [gsuser.session, gsuser.userid], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                throw err;
                            }
                            var ret = new GSUSERLOGINRESP();
                            ret.userinfo = gsuser;
                            req.send(ret);
                        });
                        //删除验证码
                        gameapi.conn.query("update t_gameuser set phonecode=null where userid=?", [gsuser.sdkuserid], function (err, rows, fields) {
                            if (err) {
                                throw err;
                            }
                        });
                    }
                });
            }
            else {
                req.send(null, 1, "登录失败：验证码错误！");
                return;
            }
        }
    });
    // app.AddSdkApi("phonelogin",function (req) {
    //     var para : GSUSERLOGINREQ = req.param;
    //     var sql = "SELECT a.loginid, a.nickname, a.headico, a.sex, a.point, a.phone, a.email, a.userid sdkuserid, b.userid, " +
    //         " b.gold, b.address, b.addressee, b.addressdetail, b.zipcode, b.addrphone, a.haspwd FROM t_gameuser a " +
    //         " LEFT JOIN t_gsuser b ON a.userid = b.sdkuserid WHERE ( a.phone IS NOT NULL AND a.phone != '' AND a.phone =? ) ";
    //     gameapi.conn.query(sql, [para.phone], (err, rows, fields) => {
    //         if (err) {
    //             req.send(null, 1, err.message);
    //             throw err;
    //         }
    //         if(rows.length == 0){
    //
    //             var user = new GSUSERINFO();
    //             user.headico = "系统人物头像/system_head_" + (Math.floor(Math.random() * 26) + 1) + ".png"; //"default.png";
    //             gameapi.conn.query("insert into t_gameuser (loginid,headico,phone,regip,haspwd,nickname) select concat('5wan',ifnull(max(mid(loginid,5)+0),0)+1),?,?,?,?,? from t_gameuser where loginid like '5wan%' for update ", [user.headico, para.phone, req.ip, 0, para.phone], function (err, rows, fields) {
    //                 if (err) {
    //                     req.send(null, 1, "登录失败：服务器错误!");
    //                     return;
    //                 }
    //             });
    //         }
    //
    //         var gsuser = new GSUSERINFO();
    //         gsuser.sdkloginid = rows[0]["loginid"];
    //         gsuser.sdkuserid = rows[0]["sdkuserid"];
    //         gsuser.gold = rows[0]["gold"];
    //         gsuser.haspwd = rows[0]["haspwd"];
    //         gsuser.headico = rows[0]["headico"];
    //         gsuser.lasttime = new Date().getTime();
    //         gsuser.nickname = rows[0]["nickname"];
    //         gsuser.userid = rows[0]["userid"];
    //         gsuser.phone = rows[0]["phone"];
    //         gsuser.sex = rows[0]["sex"];
    //         gsuser.point = rows[0]["point"];
    //         gsuser.email = rows[0]["email"];
    //         gsuser.address = rows[0]["address"];
    //         gsuser.addressee = rows[0]["addressee"];
    //         gsuser.addressdetail = rows[0]["addressdetail"];
    //         gsuser.zipcode = rows[0]["zipcode"];
    //         gsuser.addrphone = rows[0]["addrphone"];
    //         gsuser.session = gsuser.userid + "_" + gameapi.GetNextSession();
    //         gsuser.headico = gameapi.GetServerUrl("gamecenter/head/" + gsuser.headico);
    //
    //         if (!gsuser.userid)//SDK账号未在本平台注册
    //         {
    //             gameapi.conn.query("insert into t_gsuser (sdkuserid,gold) values (?,?)", [gsuser.sdkuserid, 0], (err, rows, fields) => {
    //                 if (err) {
    //                     req.send(null, 1, err.message);
    //                     throw err;
    //                 }
    //                 gsuser.userid = rows.insertId;
    //                 gsuser.session = gsuser.userid + "_" + gameapi.GetNextSession();
    //                 gsuser.gold = 0;
    //                 fun();
    //             });
    //         }
    //         else fun();
    //         function fun() {
    //             g_gsuser[gsuser.userid] = gsuser;
    //             gameapi.conn.query("update t_gsuser set session=? where userid=?", [gsuser.session, gsuser.userid], (err, rows, fields) => {
    //                 if (err) {
    //                     req.send(null, 1, err.message);
    //                     throw err;
    //                 }
    //                 var ret = new GSUSERLOGINRESP();
    //                 ret.userinfo = gsuser;
    //                 req.send(ret);
    //             });
    //         }
    //     });
    // })
    app.AddSdkApi("gsuserlogin_old", function (req) {
        var para = req.param;
        if (!para.loginid && !para.phone) {
            throw new Error("不支持自动注册");
        }
        else {
            if (!para.code && !para.pwd && (para.pwd == alipay.md5Hex(para.code))) {
                req.send("success");
                return;
            }
            var paras;
            var sql = "select a.loginid,a.sex,a.point, a.nickname,a.headico,a.phone,a.email,a.userid sdkuserid,b.userid,b.gold,b.address,b.addressee,b.addressdetail,b.zipcode,b.addrphone, a.haspwd\n" +
                "from t_gameuser a\n" +
                "left join  t_gsuser b on a.userid=b.sdkuserid\n" +
                "where ";
            if (para.loginid) {
                sql += " (a.loginid=? or (a.phone is not null and a.phone!='' and a.phone=?)) and a.pwd=?";
                paras = [para.loginid, para.loginid, para.pwd];
            }
            else if (para.phone) {
                sql += " a.phone is not null and a.phone!='' and a.phone=? and  a.phonecode is not null and  a.phonecode!='' and a.phonecode=?";
                paras = [para.phone, para.code];
            }
            gameapi.conn.query(sql, paras, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                if (rows.length == 0) {
                    req.send(null, 1, "账号或密码错误");
                    return;
                }
                var gsuser = new GSUSERINFO();
                gsuser.sdkloginid = rows[0]["loginid"];
                gsuser.sdkuserid = rows[0]["sdkuserid"];
                gsuser.gold = rows[0]["gold"];
                gsuser.haspwd = rows[0]["haspwd"];
                gsuser.headico = rows[0]["headico"];
                gsuser.lasttime = new Date().getTime();
                gsuser.nickname = rows[0]["nickname"];
                gsuser.userid = rows[0]["userid"];
                gsuser.phone = rows[0]["phone"];
                gsuser.email = rows[0]["email"];
                gsuser.sex = rows[0]["sex"];
                gsuser.point = rows[0]["point"];
                gsuser.address = rows[0]["address"];
                gsuser.addressee = rows[0]["addressee"];
                gsuser.addressdetail = rows[0]["addressdetail"];
                gsuser.zipcode = rows[0]["zipcode"];
                gsuser.addrphone = rows[0]["addrphone"];
                gsuser.session = gsuser.userid + "_" + gameapi.GetNextSession();
                gsuser.headico = gameapi.GetServerUrl("gamecenter/head/" + gsuser.headico);
                if (!gsuser.userid) {
                    gameapi.conn.query("insert into t_gsuser (sdkuserid,gold) values (?,?)", [gsuser.sdkuserid, 0], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        gsuser.userid = rows.insertId;
                        gsuser.session = gsuser.userid + "_" + gameapi.GetNextSession();
                        gsuser.gold = 0;
                        fun();
                    });
                }
                else
                    fun();
                function fun() {
                    exports.g_gsuser[gsuser.userid] = gsuser;
                    gameapi.conn.query("update t_gsuser set session=? where userid=?", [gsuser.session, gsuser.userid], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        var ret = new GSUSERLOGINRESP();
                        ret.userinfo = gsuser;
                        req.send(ret);
                    });
                    //删除验证码
                    gameapi.conn.query("update t_gameuser set phonecode=null where userid=?", [gsuser.sdkuserid], function (err, rows, fields) {
                        if (err) {
                            throw err;
                        }
                    });
                }
            });
        }
    });
    //QQ登录
    var GSUSERQQLOGINREQ = (function () {
        function GSUSERQQLOGINREQ() {
        }
        return GSUSERQQLOGINREQ;
    }());
    //微信登录
    var GSUSERWXLOGINREQ = (function () {
        function GSUSERWXLOGINREQ() {
        }
        return GSUSERWXLOGINREQ;
    }());
    //QQ登录
    app.AddSdkApi("gsuserlogin_qq", function (req) {
        var para = req.param;
        gameapi.conn.query("select * from t_gameuser where qqid=?", [para.qqid], function (err, rows, fields) {
            if (rows.length == 0) {
                var reginfo = new userapi.USERREGREQ();
                reginfo.loginid = "__loginid" + Math.random();
                reginfo.pwd = para.pwd;
                reginfo.channelappid = null;
                userapi.UserReg(reginfo, req.ip, !para.pwd, function (user, err) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    //修改loginid和nickname
                    if (para.loginid != null) {
                        user.loginid = para.loginid;
                    }
                    else {
                        user.loginid = "_" + user.userid;
                    }
                    user.nickname = para.nickname;
                    user.headico = para.headico;
                    gameapi.conn.query("update t_gameuser set loginid=?,nickname=?,phone=?,headico=?,qqid=? where userid=?", [user.loginid, user.nickname, null, user.headico, para.qqid, user.userid], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        //添加到t_gsuser表,默认0金币
                        gameapi.conn.query("delete from t_gsuser where sdkuserid=?", [user.userid], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                throw err;
                            }
                            gameapi.conn.query("insert into t_gsuser (sdkuserid,gold,regchannel,regip) values (?,?,?,?)", [user.userid, 1000, null, req.ip], function (err, rows, fields) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    throw err;
                                }
                                var gsuser = new GSUSERINFO();
                                gsuser.sdkloginid = user.loginid;
                                gsuser.sdkuserid = user.userid;
                                gsuser.gold = 1000;
                                gsuser.haspwd = 0;
                                gsuser.headico = user.headico;
                                gsuser.lasttime = user.lasttime;
                                gsuser.nickname = user.nickname;
                                gsuser.userid = rows.insertId;
                                gsuser.session = gsuser.userid + "_" + gameapi.GetNextSession();
                                gameapi.conn.query("update t_random_name set state=1 where name=?", [user.nickname], function (err, rows, fields) {
                                });
                                gameapi.conn.query("update t_gsuser set session=? where userid=?", [gsuser.session, gsuser.userid], function (err, rows, fields) {
                                    exports.g_gsuser[gsuser.userid] = gsuser;
                                    if (err) {
                                        req.send(null, 1, err.message);
                                        throw err;
                                    }
                                    var ret = new GSUSERREGRESP();
                                    ret.userinfo = gsuser;
                                    //console.log(ret);
                                    req.send(ret);
                                });
                            });
                        });
                    });
                });
            }
            else {
                var gsuser = new GSUSERINFO();
                gsuser.sdkloginid = rows[0]["loginid"];
                gsuser.sdkuserid = rows[0]["userid"]; //sdkuserid就是userid
                gsuser.gold = rows[0]["gold"];
                gsuser.haspwd = rows[0]["haspwd"];
                gsuser.headico = rows[0]["headico"];
                gsuser.lasttime = new Date().getTime();
                gsuser.nickname = rows[0]["nickname"];
                gsuser.userid = rows[0]["userid"];
                gsuser.phone = rows[0]["phone"];
                gsuser.address = rows[0]["address"];
                gsuser.addressee = rows[0]["addressee"];
                gsuser.addressdetail = rows[0]["addressdetail"];
                gsuser.zipcode = rows[0]["zipcode"];
                gsuser.addrphone = rows[0]["addrphone"];
                gsuser.session = gsuser.userid + "_" + gameapi.GetNextSession();
                var path = app.GetAbsPath("../public/gamecenter/head/" + gsuser.headico);
                fs.exists(path, function (exist) {
                    if (exist) {
                        gsuser.headico = gameapi.GetServerUrl("gamecenter/head/" + gsuser.headico); //存在则获取目录下的文件
                    }
                    else {
                        gsuser.headico = para.headico; //否则从远程读取，避免用户QQ头像更换导致图片地址错误
                    }
                });
                gsuser.userid = rows[0].userid;
                gameapi.conn.query("update t_gsuser set session=? where userid=?", [gsuser.session, gsuser.userid], function (err, rows, fields) {
                    exports.g_gsuser[gsuser.userid] = gsuser;
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    var ret = new GSUSERREGRESP();
                    ret.userinfo = gsuser;
                    //console.log(ret);
                    req.send(ret);
                });
            }
        });
    });
    //微信登录
    app.AddSdkApi("gsuserlogin_wx", function (req) {
        var para = req.param;
        // console.log(para.headico);
        gameapi.conn.query("select * from t_gameuser where wxid=?", [para.wxid], function (err, rows, fields) {
            if (rows.length == 0) {
                var reginfo = new userapi.USERREGREQ();
                reginfo.loginid = "__loginid" + Math.random();
                reginfo.pwd = para.pwd;
                reginfo.channelappid = null;
                userapi.UserReg(reginfo, req.ip, !para.pwd, function (user, err) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    //修改loginid和nickname
                    if (para.loginid != null) {
                        user.loginid = para.loginid;
                    }
                    else {
                        user.loginid = "_" + user.userid;
                    }
                    user.nickname = gameapi.emoji2Str(para.nickname);
                    user.headico = para.headico;
                    gameapi.conn.query("update t_gameuser set loginid=?,nickname=?,phone=?,headico=?,wxid=? where userid=?", [user.loginid, user.nickname, null, user.headico, para.wxid, user.userid], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        //添加到t_gsuser表,默认0金币
                        gameapi.conn.query("delete from t_gsuser where sdkuserid=?", [user.userid], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                throw err;
                            }
                            gameapi.conn.query("insert into t_gsuser (sdkuserid,gold,regchannel,regip) values (?,?,?,?)", [user.userid, 1000, null, req.ip], function (err, rows, fields) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    throw err;
                                }
                                var gsuser = new GSUSERINFO();
                                gsuser.sdkloginid = user.loginid;
                                gsuser.sdkuserid = user.userid;
                                gsuser.gold = 1000;
                                gsuser.haspwd = 0;
                                gsuser.headico = user.headico;
                                gsuser.lasttime = user.lasttime;
                                gsuser.nickname = user.nickname;
                                gsuser.userid = rows.insertId;
                                gsuser.session = gsuser.userid + "_" + gameapi.GetNextSession();
                                gameapi.conn.query("update t_random_name set state=1 where name=?", [user.nickname], function (err, rows, fields) {
                                });
                                gameapi.conn.query("update t_gsuser set session=? where userid=?", [gsuser.session, gsuser.userid], function (err, rows, fields) {
                                    exports.g_gsuser[gsuser.userid] = gsuser;
                                    if (err) {
                                        req.send(null, 1, err.message);
                                        throw err;
                                    }
                                    var ret = new GSUSERREGRESP();
                                    ret.userinfo = gsuser;
                                    //console.log(ret);
                                    req.send(ret);
                                });
                            });
                        });
                    });
                });
            }
            else {
                var gsuser = new GSUSERINFO();
                gsuser.sdkloginid = rows[0]["loginid"];
                gsuser.sdkuserid = rows[0]["userid"]; //sdkuserid就是userid
                gsuser.gold = rows[0]["gold"];
                gsuser.haspwd = rows[0]["haspwd"];
                gsuser.headico = rows[0]["headico"];
                gsuser.lasttime = new Date().getTime();
                gsuser.nickname = rows[0]["nickname"];
                gsuser.userid = rows[0]["userid"];
                gsuser.phone = rows[0]["phone"];
                gsuser.address = rows[0]["address"];
                gsuser.addressee = rows[0]["addressee"];
                gsuser.addressdetail = rows[0]["addressdetail"];
                gsuser.zipcode = rows[0]["zipcode"];
                gsuser.addrphone = rows[0]["addrphone"];
                gsuser.session = gsuser.userid + "_" + gameapi.GetNextSession();
                var path = app.GetAbsPath("../public/gamecenter/head/" + gsuser.headico);
                fs.exists(path, function (exist) {
                    if (exist) {
                        gsuser.headico = gameapi.GetServerUrl("gamecenter/head/" + gsuser.headico); //存在则获取目录下的文件
                    }
                    else {
                        gsuser.headico = para.headico; //否则从远程读取，避免用户微信头像更换导致图片地址错误
                    }
                });
                gsuser.userid = rows[0].userid;
                gameapi.conn.query("update t_gsuser set session=? where userid=?", [gsuser.session, gsuser.userid], function (err, rows, fields) {
                    exports.g_gsuser[gsuser.userid] = gsuser;
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    var ret = new GSUSERREGRESP();
                    ret.userinfo = gsuser;
                    //console.log(ret);
                    req.send(ret);
                });
            }
        });
    });
    //检测登录
    var GSUSERCHECKSESSIONREQ = (function (_super) {
        __extends(GSUSERCHECKSESSIONREQ, _super);
        function GSUSERCHECKSESSIONREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERCHECKSESSIONREQ;
    }(GSUSERREQBASE));
    app.AddSdkApi("gschecksession", function (req) {
        var para = req.param;
        if (!para.mysession) {
            fun(null);
            req.send(null, 1, "请重新登录！");
            return;
        }
        GetGameUser(null, para.mysession, function (user, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else if (!user) {
                req.send(null, 1, "请重新登录！");
                return;
            }
            fun(user.userid);
            req.send(user);
        });
        function fun(userid) {
            gameapi.conn.query("insert into t_gsuserurlpath(userid,channel,clientip,fromurl,tourl) values(?,?,?,?,?)", [userid, para.channel, req.ip, para.referrer, para.currenturl], function (err, rows, fields) {
                if (err) {
                    throw err;
                }
            });
        }
    });
    //修改头像
    var GSUSERSETHEADICOREQ = (function (_super) {
        __extends(GSUSERSETHEADICOREQ, _super);
        function GSUSERSETHEADICOREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERSETHEADICOREQ;
    }(GSUSERREQBASE));
    var GSUSERSETHEADICOREQ2 = (function (_super) {
        __extends(GSUSERSETHEADICOREQ2, _super);
        function GSUSERSETHEADICOREQ2() {
            _super.apply(this, arguments);
        }
        return GSUSERSETHEADICOREQ2;
    }(GSUSERSETHEADICOREQ));
    var GSUSERSETHEADICORESP = (function () {
        function GSUSERSETHEADICORESP() {
        }
        return GSUSERSETHEADICORESP;
    }());
    app.AddSdkApi("gsusersetheadico", function (req) {
        var para = req.param;
        GetGameUser(null, para.mysession, function (user, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else if (!user) {
                req.send(null, 1, "请重新登录！");
                return;
            }
            if (!req.files) {
                req.send(null, 1, "请上传头像!");
                return;
            }
            var dest = app.GetAbsPath("../public/gamecenter/head/" + user.sdkuserid + ".png");
            for (var i in req.files) {
                gameapi.MoveFile(req.files[i][0].path, dest, function () {
                    gameapi.conn.query("update t_gameuser set headico=? where userid=?", [user.sdkuserid + ".png", user.sdkuserid], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            throw err;
                        }
                        var ret = new GSUSERSETHEADICORESP();
                        ret.headico = gameapi.GetServerUrl("gamecenter/head/" + user.sdkuserid + ".png");
                        user.headico = ret.headico;
                        req.send(ret);
                    });
                });
                break;
            }
        });
    });
    //从默认头像中选取
    app.AddSdkApi("gsusersetheadico2", function (req) {
        var para = req.param;
        // console.log(para.path);
        var path = "public" + para.path.substring(para.path.indexOf("gamecenter") - 1);
        //                                                                                                                                                                                                                                                                                                               (path);
        GetGameUser(null, para.mysession, function (user, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else if (!user) {
                req.send(null, 1, "请重新登录！");
                return;
            }
            if (!para.path) {
                req.send(null, 1, "请选择一个头像");
                return;
            }
            var dest = app.GetAbsPath("../public/gamecenter/head/" + user.sdkuserid + ".png");
            gameapi.MoveFile(path, dest, function () {
                gameapi.conn.query("update t_gameuser set headico=? where userid=?", [user.sdkuserid + ".png", user.sdkuserid], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    var ret = new GSUSERSETHEADICORESP();
                    ret.headico = gameapi.GetServerUrl("gamecenter/head/" + user.sdkuserid + ".png");
                    user.headico = ret.headico;
                    req.send(ret);
                });
            });
        });
    });
    //修改昵称
    var GSUSERSETNICKNAMEREQ = (function (_super) {
        __extends(GSUSERSETNICKNAMEREQ, _super);
        function GSUSERSETNICKNAMEREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERSETNICKNAMEREQ;
    }(GSUSERREQBASE));
    var GSUSERSETNICKNAMERESP = (function () {
        function GSUSERSETNICKNAMERESP() {
        }
        return GSUSERSETNICKNAMERESP;
    }());
    app.AddSdkApi("gsusersetnickname", function (req) {
        var para = req.param;
        GetGameUser(null, para.mysession, function (user, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else if (!user) {
                req.send(null, 1, "请重新登录！");
                return;
            }
            if (shieldname.IsShileStr(para.nickname)) {
                req.send(null, 1, "昵称包含限制词语！");
                return;
            }
            if (user.nickname == para.nickname) {
                req.send({});
                return;
            }
            gameapi.conn.query("update t_gameuser set nickname=? where userid=?", [gameapi.emoji2Str(para.nickname), user.sdkuserid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                user.nickname = para.nickname;
                gameapi.conn.query("update t_random_name set state=0 where name=?", [user.nickname], function (err, rows, fields) {
                });
                gameapi.conn.query("update t_random_name set state=1 where name=?", [user.nickname], function (err, rows, fields) {
                });
                req.send({});
            });
        });
    });
    //手机验证码
    var GSUSERSENDPHONECODEREQ = (function (_super) {
        __extends(GSUSERSENDPHONECODEREQ, _super);
        function GSUSERSENDPHONECODEREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERSENDPHONECODEREQ;
    }(GSUSERREQBASE));
    var GSUSERSENDPHONECODERESP = (function () {
        function GSUSERSENDPHONECODERESP() {
        }
        return GSUSERSENDPHONECODERESP;
    }());
    app.AddSdkApi("gsusersendphonecode", function (req) {
        var para = req.param;
        GetGameUser(null, para.mysession, function (user, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else if (!user) {
                req.send(null, 1, "请重新登录！");
                return;
            }
            var num = Math.floor(Math.random() * 9000 + 1000).toString();
            // console.log(num);
            var now = new Date();
            if (user.sendsmstime && now.getTime() - user.sendsmstime < 60000) {
                req.send({ key: alipay.md5Hex(num) }, 1, "请等待60秒后重试！");
                return;
            }
            gameapi.SendSMS(para.phone, [num, "10"], function (ret, err) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                else if (parseInt((ret.statusCode)) != 0) {
                    req.send({ key: alipay.md5Hex(num) }, 1, ret.statusMsg);
                }
                else {
                    user.sendsmstime = now.getTime();
                    req.send({ key: alipay.md5Hex(num) });
                }
            });
        });
    });
    //设置手机
    var GSUSERSETPHONEREQ = (function (_super) {
        __extends(GSUSERSETPHONEREQ, _super);
        function GSUSERSETPHONEREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERSETPHONEREQ;
    }(GSUSERREQBASE));
    var GSUSERSETPHONERESP = (function () {
        function GSUSERSETPHONERESP() {
        }
        return GSUSERSETPHONERESP;
    }());
    app.AddSdkApi("gsusersetphone", function (req) {
        var para = req.param;
        GetGameUser(null, para.mysession, function (user, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else if (!user) {
                req.send(null, 1, "请重新登录！");
                return;
            }
            //验证码
            if (alipay.md5Hex(para.code) != para.key) {
                req.send(null, 1, "验证码不正确！");
                return;
            }
            gameapi.conn.query("update t_gameuser set phone=? where userid=?", [para.phone, user.sdkuserid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                user.phone = para.phone;
                req.send({});
            });
        });
    });
    //解绑手机
    app.AddSdkApi("gsuserunsetphone", function (req) {
        var para = req.param;
        GetGameUser(null, para.mysession, function (user, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else if (!user) {
                req.send(null, 1, "请重新登录！");
                return;
            }
            gameapi.conn.query("update t_gameuser set phone=? where userid=?", [para.phone, user.sdkuserid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, "解绑失败");
                    throw err;
                }
                user.phone = para.phone;
                req.send({});
            });
        });
    });
    //验证码登录时获取验证码
    var GSUSERLOGINSENDCODEREQ = (function () {
        function GSUSERLOGINSENDCODEREQ() {
        }
        return GSUSERLOGINSENDCODEREQ;
    }());
    var GSUSERLOGINSENDCODERESP = (function () {
        function GSUSERLOGINSENDCODERESP() {
        }
        return GSUSERLOGINSENDCODERESP;
    }());
    var send_code = '';
    app.AddSdkApi("gsuserloginsendcode", function (req) {
        var para = req.param;
        if (!para.phone) {
            req.send(null, 1, "请填写手机号！");
            return;
        }
        function fun(phone, num) {
            gameapi.SendSMS(para.phone, [num, "10"], function (ret, err) {
                console.log(num);
                var resp = {};
                if (para.isreg)
                    resp = { key: alipay.md5Hex(num) };
                if (err) {
                    req.send(resp, 1, err.message);
                    throw err;
                }
                else if (parseInt((ret.statusCode)) != 0) {
                    req.send(resp, 1, ret.statusMsg);
                }
                else {
                    req.send(resp);
                }
            });
        }
        if (para.isreg) {
            gameapi.conn.query("select userid from t_gameuser where phone=?", [para.phone], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                if (rows.length > 1) {
                    req.send(null, 1, "手机号已被注册！");
                    return;
                }
                var num = Math.floor(Math.random() * 9000 + 1000).toString();
                send_code = num;
                fun(para.phone, num);
            });
        }
        else {
            gameapi.conn.query("select userid from t_gameuser where phone=?", [para.phone], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                if (rows.length == 0) {
                    req.send(null, 1, "手机号未绑定！");
                    return;
                }
                var userid = rows[0]["userid"];
                var num = Math.floor(Math.random() * 9000 + 1000).toString();
                gameapi.conn.query("update t_gameuser set phonecode=? where userid=?", [num, userid], function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    fun(para.phone, num);
                });
            });
        }
    });
    //设置地址
    var GSUSERSETADDRREQ = (function (_super) {
        __extends(GSUSERSETADDRREQ, _super);
        function GSUSERSETADDRREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERSETADDRREQ;
    }(GSUSERREQBASE));
    var GSUSERSETADDRRESP = (function () {
        function GSUSERSETADDRRESP() {
        }
        return GSUSERSETADDRRESP;
    }());
    app.AddSdkApi("gsusersetaddr", function (req) {
        var para = req.param;
        GetGameUser(null, para.mysession, function (user, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else if (!user) {
                req.send(null, 1, "请重新登录！");
                return;
            }
            gameapi.conn.query("update t_gsuser set address=?,addressdetail=?,addressee=?,zipcode=?,addrphone=? where userid=?", [para.address, para.addressdetail, para.addressee, para.zipcode, para.addrphone, user.userid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                user.address = para.address;
                user.addressee = para.addressee;
                user.addressdetail = para.addressdetail;
                user.zipcode = para.zipcode;
                user.addrphone = para.addrphone;
                req.send({});
            });
        });
    });
    //修改密码
    var GSUSERCHANGEPWDREQ = (function (_super) {
        __extends(GSUSERCHANGEPWDREQ, _super);
        function GSUSERCHANGEPWDREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERCHANGEPWDREQ;
    }(GSUSERREQBASE));
    var GSUSERCHANGEPWDRESP = (function () {
        function GSUSERCHANGEPWDRESP() {
        }
        return GSUSERCHANGEPWDRESP;
    }());
    app.AddSdkApi("gsuserchangepwd", function (req) {
        var para = req.param;
        GetGameUser(null, para.mysession, function (user, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else if (!user) {
                req.send(null, 1, "请重新登录！");
                return;
            }
            gameapi.conn.query("update t_gameuser set pwd=?,haspwd=1 where userid=? ", [para.newpwd, user.sdkuserid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                if (rows.affectedRows == 0) {
                    req.send(null, 1, "旧密码错误");
                    return;
                }
                req.send({});
            });
        });
    });
    //获取绑定手机号用户
    app.AddSdkApi("gsgetphoneuser", function (req) {
        var para = req.param;
        //验证码
        if (alipay.md5Hex(para.code) != para.key) {
            req.send(null, 1, "验证码不正确！");
            return;
        }
        gameapi.conn.query("select loginid from t_gameuser where phone=?", [para.phone], function (err, rows, fields) {
            if (rows.length == 0) {
                req.send(null, 1, "手机号所绑定的用户不存在");
            }
            else {
                req.send({ loginid: rows[0]['loginid'] });
            }
        });
    });
    app.AddSdkApi("gsgetphonecode", function (req) {
        var para = req.param;
        var num = Math.floor(Math.random() * 9000 + 1000).toString();
        gameapi.SendSMS(para.phone, [num, "10"], function (ret, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            if (parseInt((ret.statusCode)) != 0) {
                req.send(null, 1, ret.statusMsg);
            }
            else {
                req.send({ key: alipay.md5Hex(num) });
            }
        });
    });
    app.AddSdkApi("gscheckphone", function (req) {
        gameapi.conn.query("select loginid from t_gameuser where phone=?", [req.param], function (err, rows, fileds) {
            if (err) {
                req.send(null, 2, err.message);
                throw err;
            }
            if (rows.length == 0) {
                req.send({});
            }
            else {
                req.send(null, 1, "该手机号已被绑定");
            }
        });
    });
    app.AddSdkApi("gsuserchangepwd2", function (req) {
        gameapi.conn.query("update t_gameuser set pwd=?,haspwd=1 where loginid=? and phone=?", [req.param.newpwd, req.param.loginid, req.param.phone], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            if (rows.affectedRows == 0) {
                req.send(null, 1, "修改失败,只能修改当前手机号绑定的账号");
                return;
            }
            req.send({});
        });
    });
    //新版修改密码
    var USERCHECKBINDPHONEREQ = (function () {
        function USERCHECKBINDPHONEREQ() {
        }
        return USERCHECKBINDPHONEREQ;
    }());
    var USERCHECKBINDPHONERESP = (function () {
        function USERCHECKBINDPHONERESP() {
        }
        return USERCHECKBINDPHONERESP;
    }());
    app.AddSdkApi("gsusercheckbindphone", function (req) {
        var para = req.param;
        gameapi.conn.query("select phone from t_gameuser where loginid=? or phone=?", [para.loginid, para.loginid], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            if (rows.length == 0) {
                req.send(null, 2, "账号未注册");
                return;
            }
            if (!rows[0]["phone"]) {
                req.send(null, 2, "账号未绑定，请联系客服：12202");
            }
            else {
                req.send({});
            }
        });
    });
    //找回密码发送验证码
    var USERFINDPWDSENDCODEREQ = (function () {
        function USERFINDPWDSENDCODEREQ() {
        }
        return USERFINDPWDSENDCODEREQ;
    }());
    var USERFINDPWDSENDCODERESP = (function () {
        function USERFINDPWDSENDCODERESP() {
        }
        return USERFINDPWDSENDCODERESP;
    }());
    app.AddSdkApi("gsuserfindpwdsendcode", function (req) {
        var para = req.param;
        gameapi.conn.query("select userid,phone from t_gameuser where loginid=? or phone=?", [para.loginid, para.loginid], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            if (rows.length == 0) {
                req.send(null, 1, "账号不存在");
                return;
            }
            var phone = rows[0]["phone"];
            var userid = rows[0]["userid"];
            if (phone == null || phone == "") {
                req.send(null, 2, "账号未绑定，请先绑定");
                return;
            }
            var num = Math.floor(Math.random() * 9000 + 1000).toString();
            // console.log(num)
            var now = new Date();
            gameapi.conn.query("update t_gameuser set phonecode=? where phone=?", [num, phone], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                gameapi.SendSMS(phone, [num, "10"], function (ret, err) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    else if (parseInt((ret.statusCode)) != 0) {
                        req.send(null, 1, ret.statusMsg);
                    }
                    else {
                        req.send({});
                    }
                });
            });
        });
    });
    //找回密码修改密码
    var USERFINDPWDCHANGEPWDREQ = (function () {
        function USERFINDPWDCHANGEPWDREQ() {
        }
        return USERFINDPWDCHANGEPWDREQ;
    }());
    var USERFINDPWDCHANGEPWDRESP = (function () {
        function USERFINDPWDCHANGEPWDRESP() {
        }
        return USERFINDPWDCHANGEPWDRESP;
    }());
    app.AddSdkApi("gsuserfindpwdchangepwd", function (req) {
        var para = req.param;
        gameapi.conn.query("update t_gameuser set pwd=? where (loginid=? or phone=?) and phonecode is not null and phonecode=? ", [para.pwd, para.loginid, para.loginid, para.code], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            if (rows.affectedRows == 0) {
                req.send(null, 1, "验证码错误");
                return;
            }
            req.send({});
        });
    });
    //取得PK游戏列表
    var GSUSERGETPKAPPLISTREQ = (function () {
        function GSUSERGETPKAPPLISTREQ() {
        }
        return GSUSERGETPKAPPLISTREQ;
    }());
    var GSUSERGETPKAPPLISTRESP = (function () {
        function GSUSERGETPKAPPLISTRESP() {
        }
        return GSUSERGETPKAPPLISTRESP;
    }());
    app.AddSdkApi("gsusergetpkapplist", function (req) {
        var para = req.param;
        GetPkGameList(function (err, applist) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            var ret = new GSUSERGETPKAPPLISTRESP();
            ret.applist = applist;
            req.send(ret);
        }, para.id);
    });
    //取得H5游戏列表
    var GSUSERGETH5APPLISTREQ = (function () {
        function GSUSERGETH5APPLISTREQ() {
        }
        return GSUSERGETH5APPLISTREQ;
    }());
    var GSUSERGETH5APPLISTRESP = (function () {
        function GSUSERGETH5APPLISTRESP() {
        }
        return GSUSERGETH5APPLISTRESP;
    }());
    var GSUSERGETH5APPIMGLISTRESP = (function () {
        function GSUSERGETH5APPIMGLISTRESP() {
        }
        return GSUSERGETH5APPIMGLISTRESP;
    }());
    app.AddSdkApi("gsusergeth5applist", function (req) {
        var para = req.param;
        GetH5AppList(function (err, applist) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            var ret = new GSUSERGETH5APPLISTRESP();
            ret.applist = applist;
            req.send(ret);
        }, para.id);
    });
    //取得玩过的H5游戏信息列表
    var GSUSERGETH5LOGLISTREQ = (function () {
        function GSUSERGETH5LOGLISTREQ() {
        }
        return GSUSERGETH5LOGLISTREQ;
    }());
    app.AddSdkApi("getrecentplayh5applist", function (req) {
        var para = req.param;
        GetRecentPlayH5AppList(function (err, applist) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else {
                var ret = new GSUSERGETH5APPLISTRESP();
                ret.applist = applist;
                req.send(applist);
            }
        }, para.userid);
    });
    //通过名字查找游戏
    app.AddSdkApi("gsusergeth5applistbyname", function (req) {
        var para = req.param;
        GetH5AppListByName(function (err, applist) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else {
                var ret = new GSUSERGETH5APPIMGLISTRESP();
                ret.appimglist = applist;
                req.send(applist);
            }
        }, para);
    });
    app.AddSdkApi("getnextsession", function (req) {
        var para = req.param;
        gameapi.conn.query("SELECT `session` FROM t_gsuser where sdkuserid=?", [para], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            if (rows.length == 0) {
                req.send(null, 1, "登入信息失效");
                return;
            }
            else {
                req.send(rows[0]['session']);
            }
        });
    });
    //点击H5游戏
    app.app.get("/gsh5game", function (req, res) {
        var id = req.query.id;
        if (!id) {
            res.redirect("http://www.5wanpk.com/");
            return;
        }
        var session = req.query.session;
        gameapi.conn.query("select url,getgold from t_gsh5game where id=? and del=0", [id], function (err, rows, fields) {
            if (err) {
                res.send(err.message);
                throw err;
            }
            if (rows.length == 0) {
                res.redirect("http://www.5wanpk.com/");
                return;
            }
            var getgold = rows[0]["getgold"];
            var gameurl = rows[0]["url"];
            var session = req.query.session;
            if (session) {
                GetGameUser(null, session, function (user, err) {
                    if (err)
                        throw err;
                    if (!user) {
                        res.setHeader("Content-Type", "text/html; charset=utf-8");
                        res.end('<script>alert("登入信息失效，请重新登入");top.window.location.href="http://5wanpk.com/gamecenter/h5/html/login.html"</script>');
                        return;
                    }
                    gameapi.conn.query("select session from t_gameuser where userid=?", [user.sdkuserid], function (err, rows, fields) {
                        if (err) {
                            throw err;
                        }
                        if (rows.length == 0) {
                            fun();
                            return;
                        }
                        var sdksession;
                        sdksession = rows[0]["session"];
                        if (!sdksession)
                            sdksession = user.sdkuserid + "_" + "" + "_" + gameapi.GetNextSession();
                        else {
                            var ses = sdksession.split("_");
                            if (ses[0] != user.sdkuserid.toString()) {
                                sdksession = user.sdkuserid + "_" + "" + "_" + gameapi.GetNextSession();
                            }
                        }
                        gameapi.conn.query("update t_gameuser set lastlogintime=now(),lastloginip=?,lastloginchannelapp=?,session=? where userid=?", [req.ip, null, sdksession, user.sdkuserid], function (err, rows, fields) {
                            if (err) {
                                throw err;
                            }
                            userapi.AddAppLoginLog(null, user.sdkuserid);
                        });
                        if (gameurl.indexOf("?") >= 0)
                            gameurl += "&5wansession=" + sdksession + "&5waniframe=" + encodeURIComponent(req.query["5waniframe"]);
                        else
                            gameurl += "?5wansession=" + sdksession + "&5waniframe=" + encodeURIComponent(req.query["5waniframe"]);
                        fun();
                    });
                });
            }
            else
                fun();
            function fun() {
                res.redirect(gameurl);
                gameapi.conn.query("update t_gsh5game set opencount=opencount+1,playcount=playcount+1 where id=?", [id], function (err, rows, fields) {
                    if (err) {
                        throw err;
                    }
                });
                if (session) {
                    GetGameUser(null, session, function (user, err) {
                        if (err) {
                            throw err;
                        }
                        else if (!user) {
                            gameapi.conn.query("insert into t_gsuserh5log(userid,gameid) values(?,?)", [null, id], function (err, rows, fields) {
                                if (err) {
                                    throw err;
                                }
                            });
                            return;
                        }
                        if (getgold > 0) {
                            var timestart = new Date();
                            timestart.setHours(0, 0, 0, 0);
                            var timeend = new Date();
                            timeend.setHours(23, 59, 59, 999);
                            gameapi.conn.query("select count(1) n from t_gsuserh5log where userid=? and gameid=? and createtime>=? and createtime<=?", [user.userid, id, timestart, timeend], function (err, rows, fields) {
                                if (err) {
                                    throw err;
                                }
                                if (rows[0]["n"] == 0) {
                                    user.gold += getgold;
                                    gameapi.conn.query("update t_gsuser set gold=? where userid=?", [user.gold, user.userid], function (err, rows, fields) {
                                        if (err) {
                                            throw err;
                                        }
                                    });
                                }
                                gameapi.conn.query("insert into t_gsuserh5log(userid,gameid) values(?,?)", [user.userid, id], function (err, rows, fields) {
                                    if (err) {
                                        throw err;
                                    }
                                });
                            });
                        }
                        else {
                            gameapi.conn.query("insert into t_gsuserh5log(userid,gameid) values(?,?)", [user.userid, id], function (err, rows, fields) {
                                if (err) {
                                    throw err;
                                }
                            });
                        }
                    });
                }
                else {
                    gameapi.conn.query("insert into t_gsuserh5log(userid,gameid) values(?,?)", [null, id], function (err, rows, fields) {
                        if (err) {
                            throw err;
                        }
                    });
                }
            }
        });
    });
    //取得商城列表
    var GSUSERGETSHOPGOODSLISTREQ = (function () {
        function GSUSERGETSHOPGOODSLISTREQ() {
        }
        return GSUSERGETSHOPGOODSLISTREQ;
    }());
    var GSUSERGETSHOPGOODSLISTRESP = (function () {
        function GSUSERGETSHOPGOODSLISTRESP() {
        }
        return GSUSERGETSHOPGOODSLISTRESP;
    }());
    app.AddSdkApi("gsusergetshopgoodslist", function (req) {
        var para = req.param;
        GetShopGoodsList(para.id, function (err, goods) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            var ret = new GSUSERGETSHOPGOODSLISTRESP();
            ret.goodslist = goods;
            req.send(ret);
        });
    });
    //兑换
    var GSUSEREXCHANGEREQ = (function (_super) {
        __extends(GSUSEREXCHANGEREQ, _super);
        function GSUSEREXCHANGEREQ() {
            _super.apply(this, arguments);
        }
        return GSUSEREXCHANGEREQ;
    }(GSUSERREQBASE));
    var GSUSEREXCHANGERESP = (function () {
        function GSUSEREXCHANGERESP() {
        }
        return GSUSEREXCHANGERESP;
    }());
    app.AddSdkApi("gsuserexchange", function (req) {
        var para = req.param;
        GetGameUser(null, para.mysession, function (user, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else if (!user) {
                req.send(null, 1, "请重新登录！");
                return;
            }
            //使用事务
            gameapi.conn.GetConn(function (err, conn) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                conn.beginTransaction(function (err) {
                    conn.query("select name,price,rmbprice,stock from t_gsshop where id=?", [para.goodsid], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            conn.rollback(function (err2) {
                                conn.release();
                            });
                            throw err;
                        }
                        if (rows.length == 0) {
                            req.send(null, 1, "商品不存在！");
                            conn.rollback(function (err2) {
                                conn.release();
                            });
                            return;
                        }
                        var price = rows[0]["price"];
                        var stock = rows[0]["stock"];
                        var goodsname = rows[0]["name"];
                        var rmbprice = rows[0]["rmbprice"];
                        if (user.gold < price) {
                            req.send(null, 1, "K币不足！");
                            conn.rollback(function (err2) {
                                conn.release();
                            });
                            return;
                        }
                        if (stock <= 0) {
                            req.send(null, 1, "没有库存了！");
                            conn.rollback(function (err2) {
                                conn.release();
                            });
                            return;
                        }
                        //扣K币
                        conn.query("update t_gsuser set gold=gold-? where userid=? and gold>=?", [price, user.userid, price], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                conn.rollback(function (err2) {
                                    conn.release();
                                });
                                throw err;
                            }
                            if (rows.affectedRows == 0) {
                                req.send(null, 1, "K币不足！");
                                conn.rollback(function (err2) {
                                    conn.release();
                                });
                                return;
                            }
                            //写兑换记录
                            conn.query("insert into t_gsexchange (userid,goodsid,goodsname,costgold,rmbprice,message) values (?,?,?,?,?,?)", [user.userid, para.goodsid, goodsname, price, rmbprice, "商品已兑换，待处理…"], function (err, rows, fields) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    conn.rollback(function (err2) {
                                        conn.release();
                                    });
                                    throw err;
                                }
                                var rechargeid = rows.insertId;
                                //CacheData.totalAwardPool+=rmbprice;
                                var exinfo = new CacheData.EXCHANGEINFO();
                                exinfo.phone = user.phone;
                                exinfo.goods = goodsname;
                                exinfo.time = new Date().getTime();
                                CacheData.AppendExchangeInfo(exinfo);
                                //更新库存
                                conn.query("update t_gsshop set stock=stock-1 where id=?", [para.goodsid], function (err, rows, fields) {
                                    if (err) {
                                        req.send(null, 1, err.message);
                                        conn.rollback(function (err2) {
                                            conn.release();
                                        });
                                        throw err;
                                    }
                                    //取得最新K币数量
                                    conn.query("select gold from t_gsuser where userid=?", [user.userid], function (err, rows, fields) {
                                        if (err) {
                                            req.send(null, 1, err.message);
                                            conn.rollback(function (err2) {
                                                conn.release();
                                            });
                                            throw err;
                                        }
                                        if (rows.length == 0) {
                                            conn.rollback(function (err2) {
                                                conn.release();
                                            });
                                            req.send(null, 1, "异常错误,用户不存在");
                                            return;
                                        }
                                        user.gold = rows[0]["gold"];
                                        conn.commit(function (err) {
                                            if (err) {
                                                conn.rollback(function (err2) {
                                                    conn.release();
                                                });
                                                req.send(null, 1, err.message);
                                                throw err;
                                            }
                                            var ret = new GSUSEREXCHANGERESP();
                                            ret.gold = user.gold;
                                            ret.exchangeid = rechargeid;
                                            req.send(ret);
                                            var weekgood = CacheData.GetWeeklyGoods();
                                            if (weekgood && weekgood.goodsid == para.goodsid)
                                                CacheData.LoadWeeklyGoods();
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
    //获取兑换记录
    var GSUSERGETEXCHANGERECORDREQ = (function (_super) {
        __extends(GSUSERGETEXCHANGERECORDREQ, _super);
        function GSUSERGETEXCHANGERECORDREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERGETEXCHANGERECORDREQ;
    }(GSUSERREQBASE));
    var GSUSERGETEXCHANGERECORDRESP = (function () {
        function GSUSERGETEXCHANGERECORDRESP() {
        }
        return GSUSERGETEXCHANGERECORDRESP;
    }());
    app.AddSdkApi("gsusergetexchangerecord", function (req) {
        var para = req.param;
        GetGameUser(null, para.mysession, function (user, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else if (!user) {
                req.send(null, 1, "请重新登录！");
                return;
            }
            GetExchangeRecord(user.userid, function (err, data) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                var ret = new GSUSERGETEXCHANGERECORDRESP();
                ret.data = data;
                req.send(ret);
            });
        });
    });
    //取得各种广告条的数据，包括奖池累计、兑换商城还剩XX份、活动中PK记录、兑换记录
    var GSUSERGETBANNERDATAREQ = (function () {
        function GSUSERGETBANNERDATAREQ() {
        }
        return GSUSERGETBANNERDATAREQ;
    }());
    var GSUSERGETBANNERDATARESP = (function () {
        function GSUSERGETBANNERDATARESP() {
        }
        return GSUSERGETBANNERDATARESP;
    }());
    app.AddSdkApi("gsusergetbannerdata", function (req) {
        var para = req.param;
        var ret = new GSUSERGETBANNERDATARESP();
        //ret.totalAwardPool = CacheData.totalAwardPool.value;
        //ret.exchangeInfo = CacheData.exchangeInfo;
        //ret.weeklygoods = CacheData.GetWeeklyGoods();
        //ret.shopad = CacheData.shopAD;
        //ret.pkrecord = CacheData.pkRecord;
        ret.activityad = CacheData.activityAd;
        req.send(ret);
    });
    //取得充值折扣
    var GSUSERPAYDISCOUNTREQ = (function () {
        function GSUSERPAYDISCOUNTREQ() {
        }
        return GSUSERPAYDISCOUNTREQ;
    }());
    var GSUSERPAYDISCOUNTRESP = (function () {
        function GSUSERPAYDISCOUNTRESP() {
        }
        return GSUSERPAYDISCOUNTRESP;
    }());
    app.AddSdkApi("gsuserpaydiscount", function (req) {
        var resp = new GSUSERPAYDISCOUNTRESP();
        resp.discount = CacheData.discount;
        resp.discounttext = CacheData.discountText;
        req.send(resp);
    });
    //充值
    var GSUSERPAYCREATEREQ = (function (_super) {
        __extends(GSUSERPAYCREATEREQ, _super);
        function GSUSERPAYCREATEREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERPAYCREATEREQ;
    }(GSUSERREQBASE));
    var GSUSERPAYCREATERESP = (function () {
        function GSUSERPAYCREATERESP() {
        }
        return GSUSERPAYCREATERESP;
    }());
    app.AddSdkApi("gsuserpaycreate", function (req) {
        var para = req.param;
        GetGameUser(null, para.mysession, function (user, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else if (!user) {
                req.send(null, 1, "请重新登录！");
                return;
            }
            var money = para.gold * CacheData.discount / 10000;
            //            money=0.01;
            var today = new Date();
            var payiddate = today.getFullYear() + gameapi_1.PrefixInteger(today.getMonth() + 1, 2) + gameapi_1.PrefixInteger(today.getDate(), 2) + gameapi_1.PrefixInteger(today.getHours(), 2) + gameapi_1.PrefixInteger(today.getMinutes(), 2);
            gameapi.conn.query("insert into t_gspay (payid,userid,goodsname,money,paytype,channel) select concat(?,lpad(ifnull(max(right(payid,6)),0)+1,6,'0')) ,\n" +
                "?,?,?,?,?\n" +
                "from t_gspay where payid>=? and payid<?", [payiddate, user.userid, para.goodsname, money, para.paytype, para.channel, payiddate + "000000", payiddate + "999999"], function (err, rows, fields) {
                if (err) {
                    throw err;
                }
                var id = rows.insertId;
                gameapi.conn.query("select payid from t_gspay where id=?", [id], function (err, rows, fields) {
                    if (err) {
                        throw err;
                    }
                    var ret = new GSUSERPAYCREATERESP();
                    ret.payid = rows[0]["payid"];
                    var showurl = para.showurl + "?cancel=1";
                    var returnurl = gameapi_1.g_myFrontDomain + "gamecenter/recharge.shtml";
                    if (para.paytype == 1) {
                        var notifyurl = "http://" + gameapi_1.g_myServerDomain + ":" + gameapi_1.g_serverport + "/gsalinotify";
                        ret.payurl = alipay.Pay(ret.payid, para.goodsname, money.toFixed(2), showurl, returnurl, notifyurl);
                    }
                    else {
                        ret.payurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe983a05c52c5188f&redirect_uri="
                            + encodeURIComponent(gameapi_1.g_myFrontDomain + "gamecenter/wxcode.html?payid=" + ret.payid) + "&response_type=code&scope=snsapi_base&state=" + ret.payid + "#wechat_redirect";
                    }
                    req.send(ret);
                });
            });
        });
    });
    //支付宝点击了返回，删除订单
    var GSUSERPAYDELREQ = (function (_super) {
        __extends(GSUSERPAYDELREQ, _super);
        function GSUSERPAYDELREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERPAYDELREQ;
    }(GSUSERREQBASE));
    var GSUSERPAYDELRESP = (function () {
        function GSUSERPAYDELRESP() {
        }
        return GSUSERPAYDELRESP;
    }());
    app.AddSdkApi("gsuserpaydel", function (req) {
        var para = req.param;
        GetGameUser(null, para.mysession, function (user, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else if (!user) {
                req.send(null, 1, "请重新登录！");
                return;
            }
            gameapi.conn.query("delete from t_gspay where payid=? and state=0", [para.payid], function (err, rows, fields) {
                if (err) {
                    throw err;
                }
                if (rows.affectedRows == 0) {
                    req.send(null, 1, "订单已支付或不存在！");
                    return;
                }
                req.send({});
            });
        });
    });
    //玩家等待支付成功
    var GSUSERWAITPAYRESULTREQ = (function () {
        function GSUSERWAITPAYRESULTREQ() {
        }
        return GSUSERWAITPAYRESULTREQ;
    }());
    var GSUSERWAITPAYRESULTRESP = (function () {
        function GSUSERWAITPAYRESULTRESP() {
        }
        return GSUSERWAITPAYRESULTRESP;
    }());
    app.AddSdkApi("gsuserwaitpayresult", function (req) {
        var para = req.param;
        if (alipay.GetSign(para.query) == para.query.sign) {
            var dat = para.query;
            if (dat.trade_status == "TRADE_SUCCESS") {
                alipay.CheckNotifyID(dat.notify_id, function (success) {
                    if (!success) {
                        gameapi.conn.query("insert into t_paylog (param,success,ispost) values(?,0,0)", [JSON.stringify(para.query)], function (err, rows, fields) {
                            if (err) {
                                throw err;
                            }
                        });
                        req.send(null, 1, "验证失败!");
                    }
                    else {
                        gameapi.conn.query("insert into t_paylog (param,success,ispost) values(?,1,0)", [JSON.stringify(para.query)], function (err, rows, fields) {
                            if (err) {
                                throw err;
                            }
                            var logid = rows.insertId;
                            SaveAliPay(dat.out_trade_no, dat.total_fee, logid, function (err) {
                                if (err)
                                    req.send(null, 1, err.message);
                                else {
                                    req.send({});
                                }
                            });
                        });
                    }
                });
            }
        }
        else {
            gameapi.conn.query("insert into t_paylog (param,success,ispost) values(?,0,0)", [JSON.stringify(para.query)], function (err, rows, fields) {
                if (err) {
                    throw err;
                }
            });
            req.send(null, 1, "验证失败!");
        }
    });
    //支付宝服务器主动通知商户网站里指定的页面http路径。游戏中心用
    app.app.post("/gsalinotify", function (req, res) {
        if (alipay.GetSign(req.body) == req.body.sign) {
            var para = req.body;
            alipay.CheckNotifyID(para.notify_id, function (success) {
                if (success) {
                    gameapi.conn.query("insert into t_paylog (param,success,ispost) values(?,1,1)", [JSON.stringify(para)], function (err, rows, fields) {
                        if (err) {
                            throw err;
                        }
                        var logid = rows.insertId;
                        if (para.trade_status == "TRADE_SUCCESS") {
                            //支付验证成功
                            SaveAliPay(para.out_trade_no, para.total_fee, logid, function (err) {
                                if (err) {
                                    res.send("error");
                                    throw err;
                                }
                                else
                                    res.send("success");
                            });
                        }
                        else
                            res.send("success");
                    });
                }
                else {
                    res.send("error");
                    gameapi.conn.query("insert into t_paylog (param,success,ispost) values(?,0,1)", [JSON.stringify(para)], function (err, rows, fields) {
                        if (err) {
                            throw err;
                        }
                    });
                }
            });
        }
        else {
            gameapi.conn.query("insert into t_paylog (param,success,ispost) values(?,0,1)", [JSON.stringify(para)], function (err, rows, fields) {
                if (err) {
                    throw err;
                }
            });
        }
    });
    function SaveAliPay(out_trade_no, total_fee, logid, cb) {
        gameapi.conn.GetConn(function (err, conn) {
            if (err) {
                cb(err);
                throw err;
            }
            conn.beginTransaction(function (err) {
                conn.query("select id,userid,goodsname,money from t_gspay where payid=?", [out_trade_no], function (err, rows, fields) {
                    if (err) {
                        conn.rollback(function (err2) {
                            conn.release();
                            if (err2)
                                throw err2;
                        });
                        cb(err);
                        throw err;
                    }
                    if (rows.length == 0) {
                        conn.rollback(function (err2) {
                            conn.release();
                            if (err2)
                                throw err2;
                        });
                        cb(new Error("订单不存在！"));
                        return;
                    }
                    var id = rows[0]["id"];
                    var userid = rows[0]["userid"];
                    var money = rows[0]["money"];
                    var goodsname = rows[0]["goodsname"];
                    var goldadd = parseInt(goodsname);
                    conn.query("update t_gspay set payrmb=?,paytime=now(),state=1,logid=? where payid=? and state=0", [total_fee, logid, out_trade_no], function (err, rows, fields) {
                        if (err) {
                            conn.rollback(function (err2) {
                                conn.release();
                                if (err2)
                                    throw err2;
                            });
                            cb(err);
                            throw err;
                        }
                        if (rows.affectedRows == 0) {
                            cb(null); //数据库里已支付或不存在，不作处理
                            conn.rollback(function (err2) {
                                conn.release();
                                if (err2)
                                    throw err2;
                            });
                        }
                        else {
                            //1元＝1000K币
                            //var goldadd:number=money*1000;
                            conn.query("update t_gsuser set gold=gold+? where userid=?", [goldadd, userid], function (err, rows, fields) {
                                if (err) {
                                    conn.rollback(function (err2) {
                                        conn.release();
                                        if (err2)
                                            throw err2;
                                    });
                                    cb(err);
                                    throw err;
                                }
                                conn.commit(function (err) {
                                    conn.release();
                                    if (err) {
                                        cb(err);
                                        throw (err);
                                    }
                                    GetGameUser(userid, null, function (user) {
                                        conn.query("select gold from t_gsuser where userid=?", [userid], function (err, rows, fields) {
                                            if (err) {
                                                cb(err);
                                                throw err;
                                            }
                                            user.gold = rows[0]["gold"];
                                            cb(null);
                                        });
                                    });
                                });
                            });
                        }
                    });
                });
            });
        });
    }
    //微信code获得后发送到服务器，进行获取openid、支付等操作
    var GSUSERWXCODEREQ = (function () {
        function GSUSERWXCODEREQ() {
        }
        return GSUSERWXCODEREQ;
    }());
    var GetBrandWCPayRequestData = (function () {
        function GetBrandWCPayRequestData() {
            this.signType = "MD5";
        }
        return GetBrandWCPayRequestData;
    }());
    var GSUSERWXCODERESP = (function () {
        function GSUSERWXCODERESP() {
        }
        return GSUSERWXCODERESP;
    }());
    app.AddSdkApi("gsuserwxcode", function (req) {
        var para = req.param;
        var urls = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + wxpay.appid + "&secret=" + wxpay.secret + "&code=" + para.code + "&grant_type=authorization_code";
        gameapi.HttpsRequest(urls, false, null, function (retstr, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw (err);
            }
            var tok = JSON.parse(retstr);
            var openid = tok.openid;
            gameapi.conn.query("select id,userid,goodsname,money,state,paytype from t_gspay where payid=?", [para.state], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                if (rows.length == 0) {
                    req.send(null, 1, "订单不存在");
                    return;
                }
                var id = rows[0]["id"];
                var userid = rows[0]["userid"];
                var goodsname = rows[0]["goodsname"];
                var money = rows[0]["money"];
                var state = rows[0]["state"];
                var paytype = rows[0]["paytype"];
                if (state != 0) {
                    req.send(null, 1, "订单已支付，不可重复支付！");
                    return;
                }
                //创建预付单
                wxpay.unifiedorder(openid, req.ip, goodsname, para.state, money, gameapi_1.g_myFrontDomain + "gamecenter/wxnotify.php", function (err, ret) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    var re = new GSUSERWXCODERESP();
                    re.data = new GetBrandWCPayRequestData();
                    re.data.appId = ret.appid;
                    re.data.timeStamp = (new Date().getTime() / 1000).toFixed(0);
                    re.data.nonceStr = (Math.random() * 100000000).toFixed(0);
                    re.data.package = "prepay_id=" + ret.prepay_id;
                    re.data.paySign = wxpay.GetSign(re.data);
                    re.payid = para.state;
                    req.send(re);
                });
            });
        });
    });
    //微信查询订单状态，在客户端显示支付成功时调用，解决收不到notify_url的问题
    var GSUSERQUERYWXPAYREQ = (function () {
        function GSUSERQUERYWXPAYREQ() {
        }
        return GSUSERQUERYWXPAYREQ;
    }());
    var GSUSERQUERYWXPAYRESP = (function () {
        function GSUSERQUERYWXPAYRESP() {
        }
        return GSUSERQUERYWXPAYRESP;
    }());
    app.AddSdkApi("gsuserquerywxpay", function (req) {
        var para = req.param;
        gameapi.conn.query("select userid,goodsname,money,state from t_gspay where payid=?", [para.payid], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            if (rows.length == 0) {
                req.send(null, 1, "订单不存在!");
                return;
            }
            var userid = rows[0]["userid"];
            var goodsname = rows[0]["goodsname"];
            var money = rows[0]["money"];
            var state = rows[0]["state"];
            if (state == 1) {
                req.send({});
                return;
            }
            wxpay.orderquery(para.payid, function (err, orderret, logid) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                if (orderret.return_msg != "OK") {
                    req.send(null, 1, orderret.return_msg);
                    return;
                }
                if (orderret.err_code) {
                    req.send(null, 1, orderret.err_code_des);
                    return;
                }
                if (orderret.trade_state == "SUCCESS") {
                    save(true, parseInt(orderret.total_fee) / 100.0, orderret.time_end, logid, orderret.transaction_id);
                    return;
                }
                else {
                    gameapi.conn.query("update t_gspay set logid2=?,transaction_id=? where payid=? and state=0", [logid, orderret.transaction_id, para.payid], function (err, rows, fields) {
                    });
                    req.send(null, 1, orderret.trade_state_desc);
                    return;
                }
            });
            function save(success, payrmb, paytime, logid, transaction_id) {
                var PayTime = new Date();
                var y = parseInt(paytime.substr(0, 4));
                var m = parseInt(paytime.substr(4, 2));
                var d = parseInt(paytime.substr(6, 2));
                var H = parseInt(paytime.substr(8, 2));
                var M = parseInt(paytime.substr(10, 2));
                var S = parseInt(paytime.substr(12, 2));
                PayTime.setFullYear(y, m - 1, d);
                PayTime.setHours(H, M, S);
                gameapi.conn.GetConn(function (err, conn) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    conn.beginTransaction(function (err) {
                        if (err) {
                            req.send(null, 1, err.message);
                            conn.release();
                            throw (err);
                        }
                        conn.query("update t_gspay set state=?,paytime=?,payrmb=?,logid2=?,transaction_id=? where payid=? and state=0", [success ? 1 : 0, PayTime, payrmb, logid, transaction_id, para.payid], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                conn.rollback(function (err2) {
                                    conn.release();
                                });
                                throw err;
                            }
                            if (rows.affectedRows == 0) {
                                conn.rollback(function (err2) {
                                    conn.release();
                                });
                                req.send({});
                                return;
                            }
                            GetGameUser(userid, null, function (userinfo, err) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    conn.rollback(function (err2) {
                                        conn.release();
                                    });
                                    throw err;
                                }
                                var goldadd = parseInt(goodsname);
                                userinfo.gold += goldadd;
                                conn.query("update t_gsuser set gold=? where userid=?", [userinfo.gold, userinfo.userid], function (err, rows, fields) {
                                    if (err) {
                                        req.send(null, 1, err.message);
                                        conn.rollback(function (err2) {
                                            conn.release();
                                        });
                                        throw err;
                                    }
                                    conn.commit(function (err) {
                                        if (err) {
                                            req.send(null, 1, err.message);
                                            conn.rollback(function (err2) {
                                                conn.release();
                                            });
                                            throw err;
                                        }
                                        conn.release();
                                        req.send({});
                                    });
                                });
                            });
                        });
                    });
                });
            }
        });
    });
    var USERLOGINWEIXINREQ = (function () {
        function USERLOGINWEIXINREQ() {
        }
        return USERLOGINWEIXINREQ;
    }());
    var WEIXINTOKEN = (function () {
        function WEIXINTOKEN() {
        }
        return WEIXINTOKEN;
    }());
    var WEIXINUSERINFO = (function () {
        function WEIXINUSERINFO() {
        }
        return WEIXINUSERINFO;
    }());
    app.AddSdkApi("gsUserLoginWeixin", function (req) {
        var para = req.param;
        var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxe983a05c52c5188f&secret=662ff4fe2f7a883ab0c8f782e418d220&code=" + para.code + "&grant_type=authorization_code";
        gameapi.HttpsRequest(url, false, null, function (retstr, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            var tok = JSON.parse(retstr);
            if (tok.errcode) {
                req.send(null, 1, tok.errmsg);
                return;
            }
            var url2 = "https://api.weixin.qq.com/sns/userinfo?access_token=" + tok.access_token + "&openid=" + tok.openid + "&lang=zh_CN";
            gameapi.HttpsRequest(url2, false, null, function (retstr, err) {
                var info = JSON.parse(retstr);
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                if (tok.errcode) {
                    req.send(null, 1, tok.errmsg);
                    return;
                }
                gameapi.conn.query("select * from t_gameuser where wxid=?", [info.openid], function (err, rows, fields) {
                    if (rows.length == 0) {
                        var reginfo = new userapi.USERREGREQ();
                        reginfo.loginid = "__loginid" + Math.random();
                        reginfo.pwd = para.pwd;
                        reginfo.channelappid = null;
                        userapi.UserReg(reginfo, req.ip, !para.pwd, function (user, err) {
                            if (err) {
                                req.send(null, 1, err.message);
                                throw err;
                            }
                            //修改loginid和nickname
                            if (para.loginid != null) {
                                user.loginid = para.loginid;
                            }
                            else {
                                user.loginid = "_" + user.userid;
                            }
                            user.nickname = gameapi.emoji2Str(info.nickname);
                            user.headico = info.headimgurl;
                            gameapi.conn.query("update t_gameuser set loginid=?,nickname=?,phone=?,headico=?,wxid=? where userid=?", [user.loginid, user.nickname, null, user.headico, info.openid, user.userid], function (err, rows, fields) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    throw err;
                                }
                                //添加到t_gsuser表,默认0金币
                                gameapi.conn.query("delete from t_gsuser where sdkuserid=?", [user.userid], function (err, rows, fields) {
                                    if (err) {
                                        req.send(null, 1, err.message);
                                        throw err;
                                    }
                                    gameapi.conn.query("insert into t_gsuser (sdkuserid,gold,regchannel,regip) values (?,?,?,?)", [user.userid, 1000, null, req.ip], function (err, rows, fields) {
                                        if (err) {
                                            req.send(null, 1, err.message);
                                            throw err;
                                        }
                                        var gsuser = new GSUSERINFO();
                                        gsuser.sdkloginid = user.loginid;
                                        gsuser.sdkuserid = user.userid;
                                        gsuser.gold = 1000;
                                        gsuser.haspwd = 0;
                                        gsuser.headico = user.headico;
                                        gsuser.lasttime = user.lasttime;
                                        gsuser.nickname = user.nickname;
                                        gsuser.userid = rows.insertId;
                                        gsuser.session = gsuser.userid + "_" + gameapi.GetNextSession();
                                        gameapi.conn.query("update t_random_name set state=1 where name=?", [user.nickname], function (err, rows, fields) {
                                        });
                                        gameapi.conn.query("update t_gsuser set session=? where userid=?", [gsuser.session, gsuser.userid], function (err, rows, fields) {
                                            exports.g_gsuser[gsuser.userid] = gsuser;
                                            if (err) {
                                                req.send(null, 1, err.message);
                                                throw err;
                                            }
                                            var ret = new GSUSERREGRESP();
                                            ret.userinfo = gsuser;
                                            //console.log(ret);
                                            req.send(ret);
                                        });
                                    });
                                });
                            });
                        });
                    }
                    else {
                        var gsuser = new GSUSERINFO();
                        gsuser.sdkloginid = rows[0]["loginid"];
                        gsuser.sdkuserid = rows[0]["userid"]; //sdkuserid就是userid
                        gsuser.gold = rows[0]["gold"];
                        gsuser.haspwd = rows[0]["haspwd"];
                        gsuser.headico = rows[0]["headico"];
                        gsuser.lasttime = new Date().getTime();
                        gsuser.nickname = rows[0]["nickname"];
                        gsuser.userid = rows[0]["userid"];
                        gsuser.phone = rows[0]["phone"];
                        gsuser.address = rows[0]["address"];
                        gsuser.addressee = rows[0]["addressee"];
                        gsuser.addressdetail = rows[0]["addressdetail"];
                        gsuser.zipcode = rows[0]["zipcode"];
                        gsuser.addrphone = rows[0]["addrphone"];
                        gsuser.session = gsuser.userid + "_" + gameapi.GetNextSession();
                        var path = app.GetAbsPath("../public/gamecenter/head/" + gsuser.headico);
                        fs.exists(path, function (exist) {
                            if (exist) {
                                gsuser.headico = gameapi.GetServerUrl("gamecenter/head/" + gsuser.headico); //存在则获取目录下的文件
                            }
                            else {
                                gsuser.headico = info.headimgurl; //否则从远程读取，避免用户微信头像更换导致图片地址错误
                            }
                        });
                        gsuser.userid = rows[0].userid;
                        gameapi.conn.query("update t_gsuser set session=? where userid=?", [gsuser.session, gsuser.userid], function (err, rows, fields) {
                            exports.g_gsuser[gsuser.userid] = gsuser;
                            if (err) {
                                req.send(null, 1, err.message);
                                throw err;
                            }
                            var ret = new GSUSERREGRESP();
                            ret.userinfo = gsuser;
                            //console.log(ret);
                            req.send(ret);
                        });
                    }
                });
            });
        });
    });
    // function checkWxExist(wxid):boolean {//验证是否绑定微信
    //     var returnValue = false;
    //     gameapi.conn.query("select * from t_gameuser where wxid=?", [wxid], (err, rows, fields)=> {
    //         if (rows.length == 0) {
    //             returnValue = false;
    //             return;
    //         } else {
    //             returnValue = true;
    //             return;
    //         }
    //     });
    //     return returnValue;
    // }
    var USERLOGINQQREQ = (function () {
        function USERLOGINQQREQ() {
        }
        return USERLOGINQQREQ;
    }());
    var QQTOKEN = (function () {
        function QQTOKEN() {
        }
        return QQTOKEN;
    }());
    var QQOPENID = (function () {
        function QQOPENID() {
        }
        return QQOPENID;
    }());
    var QQUSERINFO = (function () {
        function QQUSERINFO() {
        }
        return QQUSERINFO;
    }());
    app.AddSdkApi("gsUserLoginQQ", function (req) {
        var para = req.param;
        var url1 = "https://graph.qq.com/oauth2.0/token?client_id=101348841&client_secret=e44bd4f07b1a8d0044b1912072072b0c&code=" + para.code + "&grant_type=authorization_code&redirect_uri=http://5wanpk.com/gamecenter/h5/html/sdklogin.html";
        gameapi.HttpsRequest(url1, false, null, function (retstr, err) {
            var toks = gameapi.url2json(retstr); //URL参数转换为JSON，因为返回回来的格式是url参数格式
            var tok = JSON.parse(toks);
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            if (tok.ret) {
                req.send(null, 1, tok.msg);
                return;
            }
            var url2 = "https://graph.qq.com/oauth2.0/me?access_token=" + tok.access_token;
            gameapi.HttpsRequest(url2, false, null, function (retstr, err) {
                var openid = retstr.substring(retstr.indexOf("{"), retstr.indexOf("}") + 1); //取出返回的JSON格式数据
                var topenid = JSON.parse(openid);
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                if (topenid.ret) {
                    req.send(null, 1, topenid.msg);
                    return;
                }
                var url3 = "https://graph.qq.com/user/get_user_info?access_token=" + tok.access_token + "&oauth_consumer_key=101348841&openid=" + topenid.openid;
                gameapi.HttpsRequest(url3, false, null, function (retstr, err) {
                    var tqquserinfo = JSON.parse(retstr);
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    if (tqquserinfo.ret) {
                        req.send(null, 1, tqquserinfo.msg);
                        return;
                    }
                    gameapi.conn.query("select * from t_gameuser where qqid=?", [topenid.openid], function (err, rows, fields) {
                        if (rows.length == 0) {
                            var reginfo = new userapi.USERREGREQ();
                            reginfo.loginid = "__loginid" + Math.random();
                            reginfo.pwd = para.pwd;
                            reginfo.channelappid = null;
                            userapi.UserReg(reginfo, req.ip, !para.pwd, function (user, err) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    throw err;
                                }
                                //修改loginid和nickname
                                if (para.loginid != null) {
                                    user.loginid = para.loginid;
                                }
                                else {
                                    user.loginid = "_" + user.userid;
                                }
                                user.nickname = gameapi.emoji2Str(tqquserinfo.nickname);
                                user.headico = tqquserinfo.figureurl_qq_2;
                                gameapi.conn.query("update t_gameuser set loginid=?,nickname=?,phone=?,headico=?,qqid=? where userid=?", [user.loginid, user.nickname, null, user.headico, topenid.openid, user.userid], function (err, rows, fields) {
                                    if (err) {
                                        req.send(null, 1, err.message);
                                        throw err;
                                    }
                                    //添加到t_gsuser表,默认0金币
                                    gameapi.conn.query("delete from t_gsuser where sdkuserid=?", [user.userid], function (err, rows, fields) {
                                        if (err) {
                                            req.send(null, 1, err.message);
                                            throw err;
                                        }
                                        gameapi.conn.query("insert into t_gsuser (sdkuserid,gold,regchannel,regip) values (?,?,?,?)", [user.userid, 1000, null, req.ip], function (err, rows, fields) {
                                            if (err) {
                                                req.send(null, 1, err.message);
                                                throw err;
                                            }
                                            var gsuser = new GSUSERINFO();
                                            gsuser.sdkloginid = user.loginid;
                                            gsuser.sdkuserid = user.userid;
                                            gsuser.gold = 1000;
                                            gsuser.haspwd = 0;
                                            gsuser.headico = user.headico;
                                            gsuser.lasttime = user.lasttime;
                                            gsuser.nickname = user.nickname;
                                            gsuser.userid = rows.insertId;
                                            gsuser.session = gsuser.userid + "_" + gameapi.GetNextSession();
                                            gameapi.conn.query("update t_random_name set state=1 where name=?", [user.nickname], function (err, rows, fields) {
                                            });
                                            gameapi.conn.query("update t_gsuser set session=? where userid=?", [gsuser.session, gsuser.userid], function (err, rows, fields) {
                                                exports.g_gsuser[gsuser.userid] = gsuser;
                                                if (err) {
                                                    req.send(null, 1, err.message);
                                                    throw err;
                                                }
                                                var ret = new GSUSERREGRESP();
                                                ret.userinfo = gsuser;
                                                //console.log(ret);
                                                req.send(ret);
                                            });
                                        });
                                    });
                                });
                            });
                        }
                        else {
                            var gsuser = new GSUSERINFO();
                            gsuser.sdkloginid = rows[0]["loginid"];
                            gsuser.sdkuserid = rows[0]["userid"]; //sdkuserid就是userid
                            gsuser.gold = rows[0]["gold"];
                            gsuser.haspwd = rows[0]["haspwd"];
                            gsuser.headico = rows[0]["headico"];
                            gsuser.lasttime = new Date().getTime();
                            gsuser.nickname = rows[0]["nickname"];
                            gsuser.userid = rows[0]["userid"];
                            gsuser.phone = rows[0]["phone"];
                            gsuser.address = rows[0]["address"];
                            gsuser.addressee = rows[0]["addressee"];
                            gsuser.addressdetail = rows[0]["addressdetail"];
                            gsuser.zipcode = rows[0]["zipcode"];
                            gsuser.addrphone = rows[0]["addrphone"];
                            gsuser.session = gsuser.userid + "_" + gameapi.GetNextSession();
                            var path = app.GetAbsPath("../public/gamecenter/head/" + gsuser.headico);
                            fs.exists(path, function (exist) {
                                if (exist) {
                                    gsuser.headico = gameapi.GetServerUrl("gamecenter/head/" + gsuser.headico); //存在则获取目录下的文件
                                }
                                else {
                                    gsuser.headico = tqquserinfo.figureurl_qq_2; //否则从远程读取，避免用户QQ头像更换导致图片地址错误
                                }
                            });
                            gsuser.userid = rows[0].userid;
                            gameapi.conn.query("update t_gsuser set session=? where userid=?", [gsuser.session, gsuser.userid], function (err, rows, fields) {
                                exports.g_gsuser[gsuser.userid] = gsuser;
                                if (err) {
                                    req.send(null, 1, err.message);
                                    throw err;
                                }
                                var ret = new GSUSERREGRESP();
                                ret.userinfo = gsuser;
                                //console.log(ret);
                                req.send(ret);
                            });
                        }
                    });
                });
            });
        });
    });
    //礼包模块
    var GETALLGIFTTYPEINFO = (function () {
        function GETALLGIFTTYPEINFO() {
        }
        return GETALLGIFTTYPEINFO;
    }());
    var GETALLGIFTTYPEREQ = (function () {
        function GETALLGIFTTYPEREQ() {
        }
        return GETALLGIFTTYPEREQ;
    }());
    var GETALLGIFTTYPEINFORESP = (function () {
        function GETALLGIFTTYPEINFORESP() {
        }
        return GETALLGIFTTYPEINFORESP;
    }());
    app.AddSdkApi("gsgetallgifttype", function (req) {
        var para = req.param;
        if (para.loginid == null || para.loginid == "") {
            req.send(null, 1, "礼包列表获取失败");
            return;
        }
        gameapi.conn.query("select a.id,a.gameid,giftname,instruction,total,remainder,useway,one,b.loginid from t_gsgifttype a " +
            "LEFT JOIN t_gsgiftlog b ON a.id=b.typeid and loginid=? " +
            "where del=0 order by a.createtime desc", [para.loginid], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var typelist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + info.gameid + ".png");
                if (rows[i]["total"] == null) {
                    info.total = 0;
                }
                if (rows[i]["remainder"] == null) {
                    info.remainder = 0;
                }
                typelist[i] = info;
            }
            var ret = new GETALLGIFTTYPEINFORESP();
            ret.gtlist = typelist;
            req.send(ret);
        });
    });
    var GETCODEINFOREQ = (function () {
        function GETCODEINFOREQ() {
        }
        return GETCODEINFOREQ;
    }());
    app.AddSdkApi("getcodeinfo", function (req) {
        var para = req.param;
        if (para.flags == 0) {
            var sql = "select code from t_gsgift where getted=0 and del=0 and typeid=?";
            gameapi.conn.query(sql, [para.typeid], function (err, rows, fileds) {
                if (err) {
                    req.send(null, 1, "礼包码获取失败");
                    return;
                }
                if (rows.length != 0) {
                    var code = rows[0]['code'];
                    var sql = "select one from t_gsgifttype where id=?";
                    gameapi.conn.query(sql, [para.typeid], function (err, rows, fileds) {
                        if (err) {
                            req.send(null, 1, "礼包码获取失败");
                            return;
                        }
                        if (rows[0].one == 0) {
                            var sqlparamsEntities = [];
                            var entity1 = {
                                sql: "update t_gsgift set getted=1 where code=? and typeid=?",
                                params: [code, para.typeid]
                            };
                            sqlparamsEntities.push(entity1);
                            var entity2 = {
                                sql: "update t_gsgifttype set remainder=remainder+1 where id=? and del=0",
                                params: [para.typeid]
                            };
                            sqlparamsEntities.push(entity2);
                            var entity3 = {
                                sql: "insert into t_gsgiftlog(typeid,loginid,gameid,code) values(?,?,?,?)",
                                params: [para.typeid, para.loginid, para.gameid, code]
                            };
                            sqlparamsEntities.push(entity3);
                            gameapi.conn.execTrans(sqlparamsEntities, function (err, data) {
                                if (err) {
                                    req.send(null, 1, "礼包码获取失败");
                                    return;
                                }
                                var sql = "select code,gameid from t_gsgiftlog where typeid=? and loginid=? and gameid=?";
                                gameapi.conn.query(sql, [para.typeid, para.loginid, para.gameid], function (err, rows, fields) {
                                    if (err) {
                                        req.send(null, 1, "礼包码获取失败");
                                        return;
                                    }
                                    if (rows.length != 0) {
                                        req.send({ code: rows[0].code, gameid: rows[0].gameid });
                                    }
                                    else {
                                        req.send({ code: "" });
                                    }
                                });
                            });
                        }
                        else {
                            var sql = "insert into t_gsgiftlog(typeid,loginid,gameid,code) values(?,?,?,?)";
                            gameapi.conn.query(sql, [para.typeid, para.loginid, para.gameid, code], function (err, rows, filed) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    return;
                                }
                                var sql = "select code,gameid from t_gsgiftlog where typeid=? and loginid=? and gameid=?";
                                gameapi.conn.query(sql, [para.typeid, para.loginid, para.gameid], function (err, rows, fields) {
                                    if (err) {
                                        req.send(null, 1, "礼包码获取失败");
                                        return;
                                    }
                                    if (rows.length != 0) {
                                        req.send({ code: rows[0].code, gameid: rows[0].gameid });
                                    }
                                    else {
                                        req.send({ code: "" });
                                    }
                                });
                            });
                        }
                    });
                }
                else {
                    req.send({ code: "" });
                }
            });
        }
        else {
            var sql = "select code,gameid from t_gsgiftlog where typeid=? and loginid=? and gameid=?";
            gameapi.conn.query(sql, [para.typeid, para.loginid, para.gameid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, "礼包码获取失败");
                    return;
                }
                if (rows.length != 0) {
                    req.send({ code: rows[0].code, gameid: rows[0].gameid });
                }
                else {
                    req.send({ code: "" });
                }
            });
        }
    });
    app.AddSdkApi("getcodeinfo_new", function (req) {
        var para = req.param;
        if (para.flags == 0) {
            var sql = "select giftnum AS code from t_gsgifttype where  del=0 and id=? ";
            gameapi.conn.query(sql, [para.typeid], function (err, rows, fileds) {
                if (err) {
                    req.send(null, 1, "礼包码获取失败");
                    return;
                }
                if (rows.length != 0) {
                    var code = rows[0]['code'];
                    var sql = "select one from t_gsgifttype where id=?";
                    gameapi.conn.query(sql, [para.typeid], function (err, rows, fileds) {
                        if (err) {
                            req.send(null, 1, "礼包码获取失败");
                            return;
                        }
                        var sql = "insert into t_gsgiftlog(typeid,loginid,gameid,code) values(?,?,?,?)";
                        gameapi.conn.query(sql, [para.typeid, para.loginid, para.gameid, code], function (err, rows, filed) {
                            if (err) {
                                req.send(null, 1, err.message);
                                return;
                            }
                            var sql = "select code,gameid from t_gsgiftlog where typeid=? and loginid=? and gameid=?";
                            gameapi.conn.query(sql, [para.typeid, para.loginid, para.gameid], function (err, rows, fields) {
                                if (err) {
                                    req.send(null, 1, "礼包码获取失败");
                                    return;
                                }
                                if (rows.length != 0) {
                                    req.send({ code: rows[0].code, gameid: rows[0].gameid });
                                }
                                else {
                                    req.send({ code: "" });
                                }
                            });
                        });
                    });
                }
                else {
                    req.send({ code: "" });
                }
            });
        }
        else {
            var sql = "select code,gameid from t_gsgiftlog where typeid=? and loginid=? and gameid=?";
            gameapi.conn.query(sql, [para.typeid, para.loginid, para.gameid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, "礼包码获取失败");
                    return;
                }
                if (rows.length != 0) {
                    req.send({ code: rows[0].code, gameid: rows[0].gameid });
                }
                else {
                    req.send({ code: "" });
                }
            });
        }
    });
    var GSGETTEDSTATUSBYLOGINIDREQ = (function () {
        function GSGETTEDSTATUSBYLOGINIDREQ() {
        }
        return GSGETTEDSTATUSBYLOGINIDREQ;
    }());
    var GSGETTEDSTATUSBYLOGINIDINFO = (function () {
        function GSGETTEDSTATUSBYLOGINIDINFO() {
        }
        return GSGETTEDSTATUSBYLOGINIDINFO;
    }());
    var GSGETTEDSTATSUSBYLOGINIDRESP = (function () {
        function GSGETTEDSTATSUSBYLOGINIDRESP() {
        }
        return GSGETTEDSTATSUSBYLOGINIDRESP;
    }());
    app.AddSdkApi("getgettedstatus", function (req) {
        var para = req.param;
        if (!!para.sdkloginid) {
            var sql = "select a.gameid,c.`name`,b.giftname,a.`code` from t_gsgiftlog a " +
                "LEFT JOIN t_gsgifttype b ON a.typeid=b.id " +
                "LEFT JOIN t_gsh5game c ON a.gameid=c.Id AND c.del=0 WHERE loginid=? ORDER BY a.createtime desc";
            gameapi.conn.query(sql, [para.sdkloginid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, "列表获取失败");
                    return;
                }
                var gettedsStatus = [];
                for (var i = 0; i < rows.length; i++) {
                    var info = new GSGETTEDSTATUSBYLOGINIDINFO();
                    info.gameid = rows[i]['gameid'];
                    info.gamename = rows[i]['name'];
                    info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + rows[i]['gameid'] + ".png");
                    info.giftname = rows[i]['giftname'];
                    info.code = rows[i]['code'];
                    gettedsStatus.push(info);
                }
                var ret = new GSGETTEDSTATSUSBYLOGINIDRESP();
                ret.datalist = gettedsStatus;
                req.send(ret);
            });
        }
        else {
            req.send(null, 1, "列表获取失败");
        }
    });
    var GSGETGAMEALLGIFTREQ = (function () {
        function GSGETGAMEALLGIFTREQ() {
        }
        return GSGETGAMEALLGIFTREQ;
    }());
    var GSGETGAMEALLGIFTINFO = (function () {
        function GSGETGAMEALLGIFTINFO() {
        }
        return GSGETGAMEALLGIFTINFO;
    }());
    var GSGETGAMEALLGIFTRESP = (function () {
        function GSGETGAMEALLGIFTRESP() {
        }
        return GSGETGAMEALLGIFTRESP;
    }());
    app.AddSdkApi("getgameallgift", function (req) {
        var para = req.param;
        if (!!para.gname) {
            var sql = "select a.id,a.gameid,giftname,instruction,total,remainder,useway,one,b.loginid " +
                "from t_gsgifttype a left join t_gsgiftlog b ON a.id=b.typeid and loginid=? " +
                "where del=0 and a.gameid in (select id from t_gsh5game where name=? and del=0) order by a.createtime desc";
            gameapi.conn.query(sql, [para.loginid, para.gname], function (err, rows, files) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var gamegifts = [];
                for (var i = 0; i < rows.length; i++) {
                    var info = rows[i];
                    info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + rows[i]['gameid'] + ".png");
                    gamegifts.push(info);
                }
                var ret = new GSGETGAMEALLGIFTRESP();
                ret.datalist = gamegifts;
                req.send({ datalist: ret, itemid: para.itemid });
            });
        }
    });
    var GSGIFTCODEREQ = (function () {
        function GSGIFTCODEREQ() {
        }
        return GSGIFTCODEREQ;
    }());
    var GSGIFTCODERESP = (function () {
        function GSGIFTCODERESP() {
        }
        return GSGIFTCODERESP;
    }());
    app.AddSdkApi("getgiftcode", function (req) {
        var para = req.param;
        var sql = "select code from t_gsgift where typeid=?";
        gameapi.conn.query(sql, [para.typeid], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (rows.length != 0) {
                req.send({ code: rows[0]['code'] });
            }
            else {
                req.send({});
            }
        });
    });
    //新获取礼包列表
    var GETALLGIFTTYPEREQNEW = (function (_super) {
        __extends(GETALLGIFTTYPEREQNEW, _super);
        function GETALLGIFTTYPEREQNEW() {
            _super.apply(this, arguments);
        }
        return GETALLGIFTTYPEREQNEW;
    }(GETALLGIFTTYPEREQ));
    var GETALLGIFTTYPEINFONEW = (function (_super) {
        __extends(GETALLGIFTTYPEINFONEW, _super);
        function GETALLGIFTTYPEINFONEW() {
            _super.apply(this, arguments);
        }
        return GETALLGIFTTYPEINFONEW;
    }(GETALLGIFTTYPEINFO));
    var GETALLGIFTTYPEINFORESPNEW = (function () {
        function GETALLGIFTTYPEINFORESPNEW() {
        }
        return GETALLGIFTTYPEINFORESPNEW;
    }());
    app.AddSdkApi("gsgetallgifttype_new", function (req) {
        var para = req.param;
        if (para.loginid == null || para.loginid == "") {
            req.send(null, 1, "礼包列表获取失败");
            return;
        }
        var param = [];
        var sql = "";
        if (para.gameid) {
            sql += "SELECT a.*,c.`name`,b.loginid from" +
                "(SELECT id,gameid,giftname,instruction,total,remainder,useway,one,updatetime from t_gsgifttype WHERE del=0 AND gameid=?) a " +
                "LEFT JOIN (SELECT loginid,typeid from t_gsgiftlog) b ON a.id=b.typeid and loginid=? " +
                "LEFT JOIN (SELECT id,name FROM t_gsh5game) c ON a.gameid=c.Id GROUP BY a.giftname ORDER BY a.updatetime";
            param.push(para.gameid);
            param.push(para.loginid);
        }
        else {
            sql += "SELECT a.*,c.`name`,b.loginid from" +
                "(SELECT SUM(1) sum,id,gameid,giftname,instruction,total,remainder,useway,one,updatetime from t_gsgifttype WHERE del=0 GROUP BY gameid) a " +
                "LEFT JOIN (SELECT loginid,typeid from t_gsgiftlog) b ON a.id=b.typeid and loginid=? " +
                "LEFT JOIN (SELECT id,name FROM t_gsh5game) c ON a.gameid=c.Id GROUP BY a.gameid ORDER BY a.updatetime DESC";
            param.push(para.loginid);
        }
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var typelist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + info.gameid + ".png");
                if (rows[i]["total"] == null) {
                    info.total = 0;
                }
                if (rows[i]["remainder"] == null) {
                    info.remainder = 0;
                }
                typelist[i] = info;
            }
            var ret = new GETALLGIFTTYPEINFORESPNEW();
            ret.gtlist = typelist;
            req.send(ret);
        });
    });
    //获取游戏活动列表
    var GAMEACTIVITYINFOREQ = (function () {
        function GAMEACTIVITYINFOREQ() {
        }
        return GAMEACTIVITYINFOREQ;
    }());
    var GAMEACTIVITYINFO = (function () {
        function GAMEACTIVITYINFO() {
        }
        return GAMEACTIVITYINFO;
    }());
    var GAMEACTIVITYINFOLISTRESP = (function () {
        function GAMEACTIVITYINFOLISTRESP() {
        }
        return GAMEACTIVITYINFOLISTRESP;
    }());
    app.AddSdkApi("getgameactivityinfo", function (req) {
        var para = req.param;
        if (para.loginid == null || para.loginid == "") {
            req.send(null, 1, "活动列表获取失败");
            return;
        }
        var param = [];
        if (!!para.id) {
            var sql = "SELECT x.*,y.loginid FROM(SELECT a.id,a.title,a.detail,a.prise,a.rule,a.atype,a.`server`,a.starttime,a.endtime,b.appid,b.appname,b.ico " +
                "FROM t_gsgameactivity a LEFT JOIN t_cpapp b ON a.gameid=b.appid and b.del=0 WHERE a.del=0  and a.id=? ) x " +
                "LEFT JOIN (SELECT loginid,activityid FROM t_gsentergameac) y ON x.id=y.activityid AND y.loginid=?";
            param.push(para.id);
            param.push(para.loginid);
        }
        if (!para.id) {
            var sql = "SELECT x.*,y.loginid FROM(SELECT a.id,a.title,a.detail,a.prise,a.rule,a.atype,a.`server`,a.starttime,a.endtime,b.appid,b.appname,b.ico " +
                "FROM t_gsgameactivity a LEFT JOIN t_cpapp b ON a.gameid=b.appid and b.del=0 WHERE a.del=0) x " +
                "LEFT JOIN (SELECT loginid,activityid FROM t_gsentergameac) y ON x.id=y.activityid AND y.loginid=?";
            param.push(para.loginid);
        }
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var gameactivitylist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.ico = gameapi.GetServerUrl("management/icon/" + info.ico);
                info.starttime = rows[i]["starttime"].getTime();
                info.endtime = rows[i]["endtime"].getTime();
                gameactivitylist[i] = info;
            }
            var ret = new GAMEACTIVITYINFOLISTRESP();
            ret.gameactivitylist = gameactivitylist;
            req.send(ret);
        });
    });
    var HOTTOPGAMEINFOREQ = (function () {
        function HOTTOPGAMEINFOREQ() {
        }
        return HOTTOPGAMEINFOREQ;
    }());
    var HOTTOPGAMEINFO = (function () {
        function HOTTOPGAMEINFO() {
        }
        return HOTTOPGAMEINFO;
    }());
    var HOTTOPGAMEINFOLISTRESP = (function () {
        function HOTTOPGAMEINFOLISTRESP() {
        }
        return HOTTOPGAMEINFOLISTRESP;
    }());
    app.AddSdkApi("gethottopgame", function (req) {
        var para = req.param;
        var param = [];
        var sql = "SELECT id,appname as name FROM t_gssearch WHERE del = 0";
        gameapi.conn.query(sql, param, function (err, rows, field) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var hottopgamelist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = new HOTTOPGAMEINFO();
                info.id = rows[i]['id'];
                info.name = rows[i]['name'];
                info.ico = gameapi.GetServerUrl("h5game/ico/" + info.id + ".png");
                hottopgamelist[i] = info;
            }
            var ret = new HOTTOPGAMEINFOLISTRESP();
            ret.hottopgamelist = hottopgamelist;
            req.send(ret);
        });
    });
    //邮箱验证码
    var GSUSERSENDMAILCODEREQ = (function () {
        function GSUSERSENDMAILCODEREQ() {
        }
        return GSUSERSENDMAILCODEREQ;
    }());
    app.AddSdkApi("gsusersendmailcode", function (req) {
        var para = req.param;
        var params = [];
        var sql = "SELECT 1 FROM t_gameuser WHERE email=?";
        params.push(para.mail);
        gameapi.conn.query(sql, params, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (rows.length != 0) {
                req.send(null, 1, "该邮箱已存在");
                return;
            }
            else {
                var emailCode = (Math.random() * 900000 | 100000).toFixed(0);
                gameapi.SendMail({
                    to: para.mail,
                    subject: '5玩游戏绑定邮箱',
                    html: '您好！<br/>您在5玩游戏(http://www.5wanpk.com)请求绑定邮箱，您的帐号为' + para.loginid + ', 此次操作的验证码是：' + emailCode
                        + '<br/><b style="color: red">如果没收到邮件，请前往垃圾邮件查看'
                }, "qq", function (err, res) {
                    if (err) {
                        req.send(null, 1, err.message);
                        throw err;
                    }
                    else {
                        gameapi.conn.query("UPDATE t_gameuser SET emailcode=? , sendmaildate=? WHERE loginid=?", [emailCode, new Date(), para.loginid], function (err, rows, fields) {
                            if (err) {
                                req.send(null, 1, err.message);
                                return;
                            }
                            req.send({});
                        });
                    }
                });
            }
        });
    });
    //绑定邮箱
    var GSUSERSETMAILREQ = (function (_super) {
        __extends(GSUSERSETMAILREQ, _super);
        function GSUSERSETMAILREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERSETMAILREQ;
    }(GSUSERREQBASE));
    app.AddSdkApi("gsusersetmail", function (req) {
        var para = req.param;
        GetGameUser(null, para.mysession, function (user, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else if (!user) {
                req.send(null, 1, "请重新登录！");
                return;
            }
            gameapi.conn.query("SELECT emailcode,sendmaildate FROM t_gameuser WHERE loginid=?", [para.loginid], function (err, rows, fileds) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var signCode = alipay.MD5.sign(para.code, "", "utf-8");
                var signCodeSave = alipay.MD5.sign(rows[0]['emailcode'], "", "utf-8");
                var sendmaildate = rows[0]['sendmaildate'].getTime();
                var now = new Date().getTime();
                if ((now - sendmaildate) >= 600000) {
                    req.send(null, 1, "验证码过期");
                    return;
                }
                if (signCodeSave != signCode) {
                    req.send(null, 1, "验证码错误");
                    return;
                }
                var params = [];
                var sql = "UPDATE t_gameuser SET email=? WHERE emailcode=? AND loginid=?";
                params.push(para.mail, para.code, para.loginid);
                gameapi.conn.query(sql, params, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    gameapi.conn.query("UPDATE t_gameuser SET emailcode=null,sendmaildate=null WHERE loginid=?", [para.loginid], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            return;
                        }
                        user.email = para.mail;
                        req.send({});
                    });
                });
            });
        });
    });
    // app.getRequest("mailVerify",function (req){//保留的邮箱验证链接
    //     console.log(req.param);
    //     req.send({"test":123})
    // });
    var GSUSERLVREQ = (function () {
        function GSUSERLVREQ() {
        }
        return GSUSERLVREQ;
    }());
    var GSUSERLVRESP = (function () {
        function GSUSERLVRESP() {
        }
        return GSUSERLVRESP;
    }());
    app.AddSdkApi("gsuserlv", function (req) {
        var para = req.param;
        GetUserLv(function (err, lv) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var res = new GSUSERLVRESP();
            res.gslv = lv;
            req.send(res);
        }, para.userid);
    });
    //报名操作
    var GSENTERGAMEACREQ = (function () {
        function GSENTERGAMEACREQ() {
        }
        return GSENTERGAMEACREQ;
    }());
    app.AddSdkApi("gsentergameac", function (req) {
        var para = req.param;
        var params = [];
        var sql = "INSERT INTO t_gsentergameac(loginid,activityid,playname,areaname) values(?,?)";
        params.push(para.loginid);
        params.push(para.gamaacid);
        params.push(para.playname);
        params.push(para.areaname);
        gameapi.conn.query(sql, params, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            req.send({});
        });
    });
    //新获取礼包列表
    var GETALLWELFTARETYPEREQ = (function () {
        function GETALLWELFTARETYPEREQ() {
        }
        return GETALLWELFTARETYPEREQ;
    }());
    var GETALLWELFTARETYPEINFO = (function () {
        function GETALLWELFTARETYPEINFO() {
        }
        return GETALLWELFTARETYPEINFO;
    }());
    app.AddSdkApi("getallwelftaretype", function (req) {
        var para = req.param;
        if (para.loginid == null || para.loginid == "") {
            req.send(null, 1, "礼包列表获取失败");
            return;
        }
        var param = [];
        var sql = "";
        if (para.typenum) {
            sql += "SELECT a.*,c.`name`,c.createtime,b.loginid from" +
                "(SELECT id,gameid,giftname,instruction,total,remainder,price,one,type,updatetime from t_gsgamegifttype WHERE del=0 AND type=?) a " +
                "LEFT JOIN (SELECT loginid,typeid from t_gsgamegiftlog) b ON a.id=b.typeid and loginid=? " +
                "LEFT JOIN (SELECT id,name,createtime FROM t_gsh5game) c ON a.gameid=c.Id GROUP BY a.giftname ORDER BY a.updatetime DESC";
            param.push(para.typenum);
            param.push(para.loginid);
        }
        else {
            sql += "SELECT a.*,c.`name`,c.createtime,b.loginid from" +
                "(SELECT a.id,a.gameid,a.giftname,a.instruction,a.total,a.remainder,a.price,a.one,a.type,a.updatetime FROM t_gsgamegifttype a " +
                "LEFT JOIN t_gsgamegifttype b ON a.type = b.type AND a.createtime = b.createtime WHERE a.del = 0 " +
                "GROUP BY a.id,a.type HAVING count(b.id) < 3) a " +
                "LEFT JOIN (SELECT loginid,typeid from t_gsgamegiftlog) b ON a.id=b.typeid and loginid=? " +
                "LEFT JOIN (SELECT id,name,createtime FROM t_gsh5game) c ON a.gameid=c.Id ORDER BY a.updatetime DESC";
            param.push(para.loginid);
        }
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var typelist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + info.gameid + ".png");
                info.createtime = rows[i]["createtime"].getTime();
                if (rows[i]["total"] == null) {
                    info.total = 0;
                }
                if (rows[i]["remainder"] == null) {
                    info.remainder = 0;
                }
                typelist[i] = info;
            }
            var welftare = {};
            var zf_giftlist = []; //专属礼包列表
            var hh_giftlist = []; //豪华礼包列表
            var zz_giftlist = []; //至尊礼包列表
            for (var i = 0; i < typelist.length; i++) {
                if (typelist[i].type == 1) {
                    zf_giftlist.push(typelist[i]);
                }
                else if (typelist[i].type == 2) {
                    hh_giftlist.push(typelist[i]);
                }
                else if (typelist[i].type == 3) {
                    zz_giftlist.push(typelist[i]);
                }
            }
            welftare.zf_giftlist = zf_giftlist;
            welftare.hh_giftlist = hh_giftlist;
            welftare.zz_giftlist = zz_giftlist;
            req.send(welftare);
        });
    });
    var GETCODEINFOREQ2 = (function (_super) {
        __extends(GETCODEINFOREQ2, _super);
        function GETCODEINFOREQ2() {
            _super.apply(this, arguments);
        }
        return GETCODEINFOREQ2;
    }(GETCODEINFOREQ));
    app.AddSdkApi("getcodeinfo2", function (req) {
        var para = req.param;
        GetUserLv(function (err, lv) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (para.typenum == 0) {
                req.send(null, 1, "没有该礼包类型");
                return;
            }
            if ((para.typenum == 1 && lv < 1) || (para.typenum == 2 && lv < 2) || (para.typenum == 3 && lv < 3)) {
                req.send(null, 1, "没有领取权限，请提升您的等级");
                return;
            }
            else {
                if (para.flags == 0) {
                    var sql = "select code from t_gsgamegift where getted=0 and del=0 and typeid=?";
                    gameapi.conn.query(sql, [para.typeid], function (err, rows, fileds) {
                        if (err) {
                            req.send(null, 1, "礼包码获取失败");
                            return;
                        }
                        if (rows.length != 0) {
                            var code = rows[0]['code'];
                            var sql = "select one from t_gsgamegifttype where id=?";
                            gameapi.conn.query(sql, [para.typeid], function (err, rows, fileds) {
                                if (err) {
                                    req.send(null, 1, "礼包码获取失败");
                                    return;
                                }
                                if (rows[0].one == 0) {
                                    var sqlparamsEntities = [];
                                    var entity1 = {
                                        sql: "update t_gsgamegift set getted=1 where code=? and typeid=?",
                                        params: [code, para.typeid]
                                    };
                                    sqlparamsEntities.push(entity1);
                                    var entity2 = {
                                        sql: "update t_gsgamegifttype set remainder=remainder+1 where id=? and del=0",
                                        params: [para.typeid]
                                    };
                                    sqlparamsEntities.push(entity2);
                                    var entity3 = {
                                        sql: "insert into t_gsgamegiftlog(typeid,loginid,gameid,code) values(?,?,?,?)",
                                        params: [para.typeid, para.loginid, para.gameid, code]
                                    };
                                    sqlparamsEntities.push(entity3);
                                    gameapi.conn.execTrans(sqlparamsEntities, function (err, data) {
                                        if (err) {
                                            req.send(null, 1, "礼包码获取失败");
                                            return;
                                        }
                                        var sql = "select code,gameid from t_gsgamegiftlog where typeid=? and loginid=? and gameid=?";
                                        gameapi.conn.query(sql, [para.typeid, para.loginid, para.gameid], function (err, rows, fields) {
                                            if (err) {
                                                req.send(null, 1, "礼包码获取失败");
                                                return;
                                            }
                                            if (rows.length != 0) {
                                                req.send({ code: rows[0].code, gameid: rows[0].gameid });
                                            }
                                            else {
                                                req.send({ code: "" });
                                            }
                                        });
                                    });
                                }
                                else {
                                    var sql = "insert into t_gsgamegiftlog(typeid,loginid,gameid,code) values(?,?,?,?)";
                                    gameapi.conn.query(sql, [para.typeid, para.loginid, para.gameid, code], function (err, rows, filed) {
                                        if (err) {
                                            req.send(null, 1, err.message);
                                            return;
                                        }
                                        var sql = "select code,gameid from t_gsgamegiftlog where typeid=? and loginid=? and gameid=?";
                                        gameapi.conn.query(sql, [para.typeid, para.loginid, para.gameid], function (err, rows, fields) {
                                            if (err) {
                                                req.send(null, 1, "礼包码获取失败");
                                                return;
                                            }
                                            if (rows.length != 0) {
                                                req.send({ code: rows[0].code, gameid: rows[0].gameid });
                                            }
                                            else {
                                                req.send({ code: "" });
                                            }
                                        });
                                    });
                                }
                            });
                        }
                        else {
                            req.send({ code: "" });
                        }
                    });
                }
                else {
                    var sql = "select code,gameid from t_gsgamegiftlog where typeid=? and loginid=? and gameid=?";
                    gameapi.conn.query(sql, [para.typeid, para.loginid, para.gameid], function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, "礼包码获取失败");
                            return;
                        }
                        if (rows.length != 0) {
                            req.send({ code: rows[0].code, gameid: rows[0].gameid });
                        }
                        else {
                            req.send({ code: "" });
                        }
                    });
                }
            }
        }, para.userid);
    });
    var GSSETCITYREQ = (function (_super) {
        __extends(GSSETCITYREQ, _super);
        function GSSETCITYREQ() {
            _super.apply(this, arguments);
        }
        return GSSETCITYREQ;
    }(GSUSERREQBASE));
    app.AddSdkApi("gssetcity", function (req) {
        var para = req.param;
        GetGameUser(null, para.mysession, function (user, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else if (!user) {
                req.send(null, 1, "请重新登录！");
                return;
            }
            gameapi.conn.query("update t_gsuser set address=? where sdkuserid=(select userid from t_gameuser where loginid=?)", [para.city, para.loginid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                user.address = para.city;
                req.send({});
            });
        });
    });
    var GETALLACCOUNTINFOREQ = (function () {
        function GETALLACCOUNTINFOREQ() {
        }
        return GETALLACCOUNTINFOREQ;
    }());
    var GETALLACCOUNTINFO = (function () {
        function GETALLACCOUNTINFO() {
        }
        return GETALLACCOUNTINFO;
    }());
    app.AddSdkApi("gsgetallacount", function (req) {
        var para = req.param;
        gameapi.conn.query("SELECT a.*,b.`name` from t_gsgameaccounttype a LEFT JOIN t_gsh5game b ON a.gameid=b.Id and a.del=0", [], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            var typelist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + info.gameid + ".png");
                info.createtime = rows[i]["createtime"].getTime();
                typelist[i] = info;
            }
            req.send(typelist);
        });
    });
    var GETALLACCOUNTDETAILREQ = (function () {
        function GETALLACCOUNTDETAILREQ() {
        }
        return GETALLACCOUNTDETAILREQ;
    }());
    var GETALLACCOUNTDETAIL = (function () {
        function GETALLACCOUNTDETAIL() {
        }
        return GETALLACCOUNTDETAIL;
    }());
    app.AddSdkApi("gsgetallacountdetail", function (req) {
        var para = req.param;
        if (para.loginid == null || para.loginid == "") {
            req.send(null, 1, "列表获取失败");
            return;
        }
        gameapi.conn.query("SELECT a.*, c.`name`,b.loginid FROM(SELECT x.*, y.gameid FROM(SELECT a.*FROM t_gsgameaccount a LEFT JOIN t_gsgameaccount b ON a.gattid = b.gattid AND a.createtime < b.createtime AND a.del = 0 GROUP BY a.id HAVING count(b.id) < 99999) x " +
            "LEFT JOIN(SELECT id, gameid FROM t_gsgameaccounttype) y ON x.gattid = y.id) a " +
            "LEFT JOIN(SELECT loginid, aid FROM t_gsapplyaccountlog) b ON a.id = b.aid AND loginid = ? " +
            "LEFT JOIN(SELECT id, `name` FROM t_gsh5game) c ON a.gameid = c.Id WHERE a.gattid = ? ORDER BY a.createtime DESC", [para.loginid, para.gatid], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            var alist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                alist[i] = info;
            }
            req.send({ alist: alist, listid: para.listid });
        });
    });
    //申请高级账号
    var GSAPPLYACCOUNTREQ = (function () {
        function GSAPPLYACCOUNTREQ() {
        }
        return GSAPPLYACCOUNTREQ;
    }());
    app.AddSdkApi("gsapplyaccount", function (req) {
        var para = req.param;
        GetUserLv(function (err, lv) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (para.loginid == null || para.loginid == "") {
                req.send(null, 1, "尚未登入,请先登入");
                return;
            }
            if ((para.price <= 100 && lv < 6)
                || ((para.price > 100 && para.price <= 250) && lv < 7)
                || ((para.price > 250 && para.price <= 1000) && lv < 8)
                || ((para.price > 1000 && para.price <= 3000) && lv < 9)
                || ((para.price > 3000 && para.price <= 7500) && lv < 10)
                || ((para.price > 7500 && para.price <= 15000) && lv < 11)
                || ((para.price > 15000 && para.price <= 40000) && lv < 12)
                || ((para.price > 40000 && para.price <= 75000) && lv < 13)
                || ((para.price > 75000 && para.price <= 160000) && lv < 14)
                || ((para.price > 160000 && para.price <= 300000) && lv < 15)) {
                req.send(null, 1, "没有领取权限，请提升您的等级");
                return;
            }
            gameapi.conn.query("SELECT COUNT(1) times FROM t_gsapplyaccountlog WHERE YEARWEEK(date_format(createtime,'%Y-%m-%d')) = YEARWEEK(now()) AND loginid=?", [para.loginid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, "未知错误");
                    return;
                }
                if (rows.length > 0) {
                    if (rows[0]['times'] >= 3) {
                        req.send(null, 1, "已达到本周申领次数");
                        return;
                    }
                    else {
                        var params1 = [];
                        params1.push(para.aid);
                        params1.push(para.loginid);
                        params1.push(para.gname);
                        params1.push(para.detail);
                        params1.push(para.server);
                        params1.push(para.rolename);
                        var sqlparamsEntities = [];
                        var entity1 = {
                            sql: "INSERT INTO t_gsapplyaccountlog(aid,loginid,gname,detail,server,rolename) VALUES(?,?,?,?,?,?)",
                            params: params1
                        };
                        sqlparamsEntities.push(entity1);
                        var entity2 = {
                            sql: "update t_gsgameaccount set surplu=surplu-1 where id=? and del=0",
                            params: [para.aid]
                        };
                        sqlparamsEntities.push(entity2);
                        gameapi.conn.execTrans(sqlparamsEntities, function (err, data) {
                            if (err) {
                                req.send(null, 1, "申领失败");
                                return;
                            }
                            req.send({});
                        });
                    }
                }
                else {
                    req.send(null, 1, "未知错误");
                }
            });
        }, para.userid);
    });
    var GSGETMESSAGEREQ = (function () {
        function GSGETMESSAGEREQ() {
        }
        return GSGETMESSAGEREQ;
    }());
    var GSGETMESSAGEINFO = (function () {
        function GSGETMESSAGEINFO() {
        }
        return GSGETMESSAGEINFO;
    }());
    app.AddSdkApi("gsgetmessage", function (req) {
        var para = req.param;
        var sql = "SELECT a.*, b.msglogid,b.loginid rsld FROM(SELECT a.id,a.msgid,a.createtime,a.loginid,b.title,b.detail FROM t_gsmessagelog a " +
            "LEFT JOIN t_gsmessage b on a.msgid=b.id WHERE (a.loginid=? OR a.loginid IS NULL) AND a.del=0 ORDER BY a.loginid,a.createtime) a " +
            "LEFT JOIN t_gsmsgreadstatus b ON a.id = b.msglogid AND b.loginid=? ORDER BY createtime DESC";
        gameapi.conn.query(sql, [para.loginid, para.loginid], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            var mlist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.createtime = rows[i]["createtime"].getTime();
                mlist[i] = info;
            }
            req.send(mlist);
        });
    });
    var GSSETMSGREADSTATUSREQ = (function () {
        function GSSETMSGREADSTATUSREQ() {
        }
        return GSSETMSGREADSTATUSREQ;
    }());
    app.AddSdkApi("gssetmsgreadstatus", function (req) {
        var para = req.param;
        var sql = "INSERT INTO t_gsmsgreadstatus(msglogid,loginid) VALUES(?,?)";
        gameapi.conn.query(sql, [para.id, para.loginid], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            req.send({});
        });
    });
    var GSDELETEMESSAGEREQ = (function () {
        function GSDELETEMESSAGEREQ() {
        }
        return GSDELETEMESSAGEREQ;
    }());
    app.AddSdkApi("gsdeletemsg", function (req) {
        var para = req.param;
        if (para.loginid == null || para.loginid == "") {
            req.send(null, 1, "系统邮件不能自行删除");
            return;
        }
        var sql = "UPDATE t_gsmessagelog SET del=1 WHERE id=?";
        gameapi.conn.query(sql, [para.id], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            req.send({});
        });
    });
    var GSGETVIPQQREQ = (function () {
        function GSGETVIPQQREQ() {
        }
        return GSGETVIPQQREQ;
    }());
    var GSVIPQQINFO = (function () {
        function GSVIPQQINFO() {
        }
        return GSVIPQQINFO;
    }());
    app.AddSdkApi("gsgetvipqq", function (req) {
        var para = req.param;
        var sql = "SELECT qqname,qqnum FROM t_gsvipqq";
        gameapi.conn.query(sql, [], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            var qqlist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                qqlist[i] = info;
            }
            req.send(qqlist);
        });
    });
    var GSSENDPROBLEMREQ = (function () {
        function GSSENDPROBLEMREQ() {
        }
        return GSSENDPROBLEMREQ;
    }());
    app.AddSdkApi("gssendproblem", function (req) {
        var para = req.param;
        GetUserLv(function (err, lv) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            // if (lv < 5) {
            //     req.send(null, 1, "没有权限，请提升您的等级");
            //     return;
            // }
            gameapi.conn.query("INSERT INTO t_gsproblem(gname,title,detail,server,ptype) VALUES(?,?,?,?,?)", [para.gname, para.title, para.detail, para.server, para.type], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                req.send({});
            });
        }, para.userid);
    });
    var GSCHECKUSERLEVELREQ = (function () {
        function GSCHECKUSERLEVELREQ() {
        }
        return GSCHECKUSERLEVELREQ;
    }());
    app.AddSdkApi("gscheckuserlevel", function (req) {
        var para = req.param;
        GetUserLv(function (err, lv) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (lv < para.lv) {
                req.send(null, 1, "没有权限，请提升您的等级");
                return;
            }
            req.send({});
        }, para.userid);
    });
    var GSGETSERVERTABLEREQ = (function () {
        function GSGETSERVERTABLEREQ() {
        }
        return GSGETSERVERTABLEREQ;
    }());
    var GSSERVERTABLEINFO = (function () {
        function GSSERVERTABLEINFO() {
        }
        return GSSERVERTABLEINFO;
    }());
    var GETSERVERINFONEW = (function (_super) {
        __extends(GETSERVERINFONEW, _super);
        function GETSERVERINFONEW() {
            _super.apply(this, arguments);
        }
        return GETSERVERINFONEW;
    }(GSSERVERTABLEINFO));
    var GETSERVERINFORESPNEW = (function () {
        function GETSERVERINFORESPNEW() {
        }
        return GETSERVERINFORESPNEW;
    }());
    app.AddSdkApi("gsgetservertable", function (req) {
        var para = req.param;
        var params = [];
        // if (!!para.gameid){
        //     var sql = "SELECT a.id,a.gameid,a.serverName,a.opentime,a.createtime,b.appname FROM t_gsserver a " +
        //       "LEFT JOIN t_cpapp b ON a.gameid = b.appid where a.gameid=? and b.del=0 and a.del=0  ORDER BY a.createtime   ";
        //    params.push(para.gameid);
        // }else{
        var sql = "SELECT a.id,a.gameid,a.serverName,a.opentime,a.createtime,b.appname FROM t_gsserver a " +
            "LEFT JOIN t_cpapp b ON a.gameid = b.appid where b.del=0 and a.del=0  ORDER BY a.openTime   ";
        //  }
        gameapi.conn.query(sql, params, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var stList = [];
            for (var i = 0; i < rows.length; i++) {
                var stInfo = rows[i];
                stInfo.openTime = rows[i]['opentime'].getTime();
                stInfo.ico = gameapi.GetServerUrl("management/icon/" + rows[i]['gameid'] + ".png");
                stList[i] = stInfo;
            }
            req.send(stList);
        });
    });
    var GSSHAREGAMEREQ = (function () {
        function GSSHAREGAMEREQ() {
        }
        return GSSHAREGAMEREQ;
    }());
    app.AddSdkApi("gssharegame", function (req) {
        var para = req.param;
        if (para.sharecode != alipay.md5Hex(para.shareuser)) {
            req.send("fail1");
            return;
        }
        var sql1 = "SELECT appid,appname FROM t_cpapp WHERE appname=(SELECT `name` FROM t_gsh5game where id=? and del=0) AND del=0";
        gameapi.conn.query(sql1, [para.appid], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (rows.length != 0) {
                var sql2 = "SELECT 1 FROM t_gssharelog WHERE (ipaddress=? AND sharecode=?) AND appid=?";
                gameapi.conn.query(sql2, [req.ip, para.sharecode, rows[0].appid], function (err, rows2, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    if (rows2.length != 0) {
                        req.send("fail2");
                        return;
                    }
                    var sql3 = "INSERT INTO t_gssharelog(shareuser,sharecode,appid,appname,ipaddress) VALUES(?,?,?,?,?)";
                    var params = [];
                    params.push(para.shareuser);
                    params.push(para.sharecode);
                    params.push(rows[0].appid);
                    params.push(rows[0].appname);
                    params.push(req.ip);
                    gameapi.conn.query(sql3, params, function (err, rows3, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            return;
                        }
                        req.send("success");
                    });
                });
            }
            else {
                req.send("fail3");
            }
        });
    });
    //微信支付通知//外网不明原因收不到推送，现改用客户端支付成功后再主动查询订单状态
    app.app.post("/wxnotify", function (req, res) {
        var body = gameapi.uintToString(req.rawBody);
        gameapi.conn.query("insert into t_paylog (param,success,ispost) values (?,?,1)", [body, 1], function (err, rows, fields) {
            if (err) {
                throw err;
            }
            var WXNOTIFYDATA = (function () {
                function WXNOTIFYDATA() {
                }
                return WXNOTIFYDATA;
            }());
            gameapi.XmlToJson(body, function (err, retobj) {
                var sign = wxpay.GetSign(retobj);
                var logid = rows.insertId;
                var total_fee = parseFloat(retobj.total_fee) / 100;
                gameapi.conn.GetConn(function (err, conn) {
                    if (err)
                        throw err;
                    conn.beginTransaction(function (err) {
                        if (err) {
                            conn.rollback(function (err2) {
                                conn.release();
                                throw err;
                            });
                            return;
                        }
                        conn.query("update t_gspay set logid2=?,paytime=now(),payrmb=?,state=1 where payid=? and state=0", [logid, total_fee, retobj.out_trade_no], function (err, rows, fields) {
                            if (err) {
                                conn.rollback(function (err2) {
                                    conn.release();
                                    throw err;
                                });
                                return;
                            }
                            if (rows.affectedRows == 1) {
                                conn.query("select userid, goodsname from t_gspay where payid=?", [retobj.out_trade_no], function (err, rows, fields) {
                                    if (err) {
                                        conn.rollback(function (err2) {
                                            conn.release();
                                            throw err;
                                        });
                                        return;
                                    }
                                    var gold = parseInt(rows[0]["goodsname"]);
                                    var userid = rows[0]["userid"];
                                    GetGameUser(userid, null, function (userinfo, err) {
                                        if (err) {
                                            conn.rollback(function (err2) {
                                                conn.release();
                                                throw err;
                                            });
                                            return;
                                        }
                                        userinfo.gold += gold;
                                        conn.query("update t_gsuser set gold=? where userid=?", [userinfo.gold, userinfo.userid], function (err, rows, fields) {
                                            if (err) {
                                                conn.rollback(function (err2) {
                                                    conn.release();
                                                    throw err;
                                                });
                                                return;
                                            }
                                            conn.commit(function (err) {
                                                conn.release();
                                                res.send("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>");
                                            });
                                        });
                                    });
                                });
                            }
                            else {
                                res.send("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>");
                            }
                        });
                    });
                });
            });
        });
    });
    /*****************************新平台数据**************************************/
    var GAMETYPEREQ = (function () {
        function GAMETYPEREQ() {
        }
        return GAMETYPEREQ;
    }());
    var GAMETYPERESP = (function () {
        function GAMETYPERESP() {
        }
        return GAMETYPERESP;
    }());
    app.AddSdkApi("gsgetgametypelist", function (req) {
        var para = req.param;
        var sql = "select id,name,url,detail,opencount,playcount,createtime,getgold,remark,ishot,isrec,hasgift,rank,orderby,newsort,type from t_gsh5game where del=0";
        if (!!para.type) {
            sql += " and type=?";
        }
        sql += "  order by orderby desc";
        gameapi.conn.query(sql, [para.type], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var applist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.createtime = rows[i]["createtime"].getTime();
                var path = app.GetAbsPath("../public/gamecenter/h5game/ico/" + info.id + ".png");
                if (fs.existsSync(path)) {
                    info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + info.id + ".png");
                }
                else {
                    info.ico = "";
                }
                applist[i] = info;
            }
            req.send(applist);
        });
    });
    var APPINFO = (function () {
        function APPINFO() {
        }
        return APPINFO;
    }());
    app.AddSdkApi("gsgetshowgamelist", function (req) {
        var para = req.param;
        var sql = "SELECT b.Id, a.appid, a.appname, a.url, a.intro FROM t_gsh5game b LEFT JOIN t_cpapp a ON a.url = b.url  WHERE a.del = 0 AND b.del = 0 ORDER BY orderby DESC LIMIT 0,3 ";
        gameapi.conn.query(sql, [], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var applist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.count = parseInt((Math.random() * 100000).toString());
                var path = app.GetAbsPath("../public/management/ad/" + info.appid + ".jpg");
                if (fs.existsSync(path)) {
                    info.ico = gameapi.GetServerUrl("management/ad/" + info.appid + ".jpg");
                }
                else {
                    info.ico = "";
                }
                applist[i] = info;
            }
            req.send(applist);
        });
    });
    app.AddSdkApi("getactivitylist", function (req) {
        var para = req.param;
        if (para.loginid == null || para.loginid == "") {
            req.send(null, 1, "活动列表获取失败");
            return;
        }
        var param = [];
        if (!!para.id) {
            var sql = "SELECT x.*,y.loginid FROM(SELECT a.id,a.title,a.detail,a.prise,a.rule,a.atype,a.`server`,a.starttime,a.endtime,b.appid,c.Id AS gameid,b.appname,b.ico " +
                "FROM t_gsgameactivity a LEFT JOIN t_cpapp b ON a.gameid=b.appid  LEFT JOIN t_gsh5game c ON c.url = b.url   and b.del=0  and c.del=0  WHERE a.del=0  and a.id=? ) x " +
                "LEFT JOIN (SELECT loginid,activityid FROM t_gsentergameac) y ON x.id=y.activityid ";
            param.push(para.id);
        }
        if (!para.id) {
            var sql = "SELECT x.*,y.loginid FROM(SELECT a.id,a.title,a.ishot,a.createtime,a.lable,a.prise,a.rule,a.atype,a.`server`,a.starttime,a.endtime,b.appid,c.Id AS gameid,b.appname,b.ico " +
                "FROM t_gsgameactivity a LEFT JOIN t_cpapp b ON a.gameid=b.appid  LEFT JOIN t_gsh5game c ON c.url = b.url  and b.del=0  and c.del=0  WHERE a.del=0) x " +
                "LEFT JOIN (SELECT loginid,activityid FROM t_gsentergameac) y ON x.id=y.activityid  ORDER BY x.createtime DESC ";
        }
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var gameactivitylist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.ico = gameapi.GetServerUrl("gamecenter/actbanner/" + info.id + ".png");
                info.starttime = rows[i]["starttime"].getTime();
                info.endtime = rows[i]["endtime"].getTime();
                gameactivitylist[i] = info;
            }
            var ret = new GAMEACTIVITYINFOLISTRESP();
            ret.gameactivitylist = gameactivitylist;
            req.send(ret);
        });
    });
    app.AddSdkApi("getactivitybanner", function (req) {
        var para = req.param;
        var param = [];
        var sql = "SELECT a.id, a.atype, b.appid, c.Id AS gameid, b.appname FROM t_gsgameactivity a LEFT JOIN t_cpapp b ON a.gameid = b.appid  " +
            "  LEFT JOIN t_gsh5game c ON c.url = b.url AND b.del = 0 AND c.del = 0 WHERE a.del = 0 AND a.atype = 1 ";
        gameapi.conn.query(sql, [], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var bannerlist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.banner = gameapi.GetServerUrl("gamecenter/actbanner/" + info.id + ".png");
                bannerlist[i] = info;
            }
            req.send(bannerlist);
        });
    });
    var GAMEDETAILREQ = (function () {
        function GAMEDETAILREQ() {
        }
        return GAMEDETAILREQ;
    }());
    //获取游戏具体信息
    var GAMEDETAILINFO = (function (_super) {
        __extends(GAMEDETAILINFO, _super);
        function GAMEDETAILINFO() {
            _super.apply(this, arguments);
        }
        return GAMEDETAILINFO;
    }(GETALLGIFTTYPEINFO));
    app.AddSdkApi("getgamedetaillist", function (req) {
        var para = req.param;
        var param = [];
        gameapi.conn.query("SELECT * FROM t_gsgifttype b	WHERE b.del = 0  AND gameid = ?", [para.gameid], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (rows.length == 0) {
                var sql = "SELECT	c.Id AS gameid,c.`name`,c.remark,c.detail,c.introduction AS gameint FROM  t_gsh5game c  WHERE  c.del = 0  AND c.Id = ?";
                param.push(para.gameid);
            }
            else {
                var sql = "SELECT a.*, b.loginid FROM ( SELECT b.id, c.Id AS gameid, b.giftname, b.instruction, b.total, " +
                    "  b.remainder, b.groupqq, b.useway, b.one, b.createtime,b.endtime, c.`name`,c.remark, c.detail,c.introduction as gameint, b.gifttype FROM t_gsh5game c  " +
                    "  LEFT JOIN t_gsgifttype b ON b.gameid = c.Id WHERE (b.del = 0 or b.del IS NULL)  AND c.del = 0  AND c.Id = ? ) " +
                    " a LEFT JOIN t_gsgiftlog b ON a.id = b.typeid AND loginid = ? ORDER BY a.createtime DESC";
                param.push(para.gameid, para.loginid);
            }
            gameapi.conn.query(sql, param, function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var gameactivitylist = [];
                for (var i = 0; i < rows.length; i++) {
                    var info = rows[i];
                    info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + info.gameid + ".png");
                    info.playcount = parseInt((Math.random() * 100000).toString());
                    gameactivitylist[i] = info;
                }
                req.send(gameactivitylist);
            });
        });
    });
    var GAMEDETAILACTIVITYINFO = (function () {
        function GAMEDETAILACTIVITYINFO() {
        }
        return GAMEDETAILACTIVITYINFO;
    }());
    app.AddSdkApi("getgamedetailactivity", function (req) {
        var para = req.param;
        var param = [];
        if (!!para.gameid) {
            var sql = "SELECT a.*,c.title,c.createtime,c.atype,c.lable,c.ishot,c.id FROM( SELECT b.appid,a.`name` FROM t_gsh5game a LEFT JOIN t_cpapp b ON b.url = a.url WHERE a.del = 0 AND b.del = 0 AND a.Id = ? )a LEFT JOIN t_gsgameactivity c ON c.gameid = a.appid WHERE c.del = 0  ORDER BY c.createtime DESC";
            param.push(para.gameid);
        }
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var gameactivitylist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                gameactivitylist[i] = info;
            }
            req.send(gameactivitylist);
        });
    });
    var COLLECTGAMEREQ = (function () {
        function COLLECTGAMEREQ() {
        }
        return COLLECTGAMEREQ;
    }());
    app.AddSdkApi("getcollectgame", function (req) {
        var para = req.param;
        var param = [];
        var sql = "SELECT * FROM t_usercollect WHERE del = 0 AND gameid = ? AND userid = ?";
        param.push(para.gameid, para.userid);
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            if (rows.length == 0) {
                var sql = "insert into t_usercollect (gameid,userid,createtime,updatetime,del) values (?,?,now(),now(),0)";
                param.push(para.gameid, para.userid);
                gameapi.conn.query(sql, param, function (err, rows, fields) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    req.send(null, 1, "收藏成功！");
                });
            }
            else {
                req.send(null, 1, "您已收藏过该游戏！");
                return;
            }
        });
    });
    app.AddSdkApi("getmycollectgame", function (req) {
        var para = req.param;
        var param = [];
        var sql = "SELECT a.createtime, b.Id AS id, b.`name`, b.detail FROM t_usercollect a LEFT JOIN t_gsh5game b ON b.Id = a.gameid WHERE a.del = 0 AND b.del = 0 AND userid = ?  ORDER BY createtime DESC";
        param.push(para.userid);
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var collectlist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + info.id + ".png");
                info.createtime = rows[i]["createtime"].getTime();
                collectlist[i] = info;
            }
            req.send(collectlist);
        });
    });
    var GIFTBAGREQ = (function () {
        function GIFTBAGREQ() {
        }
        return GIFTBAGREQ;
    }());
    var MYGIFTBAGINFO = (function () {
        function MYGIFTBAGINFO() {
        }
        return MYGIFTBAGINFO;
    }());
    app.AddSdkApi("getmygiftbaglist", function (req) {
        var para = req.param;
        var param = [];
        var sql = "SELECT a.*,c.`name` FROM( SELECT a.id, a.`code`, a.createtime, a.gameid,b.useway,b.giftname, b.instruction  "
            + "FROM t_gsgiftlog a LEFT JOIN t_gsgifttype b ON b.id = a.typeid WHERE b.del = 0 AND a.loginid = ?  )   " +
            "a LEFT JOIN t_gsh5game c ON c.Id = a.gameid WHERE c.del = 0   ORDER BY createtime DESC";
        param.push(para.sdkloginid);
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var mygiftlist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + info.gameid + ".png");
                info.createtime = rows[i]["createtime"].getTime();
                mygiftlist[i] = info;
            }
            req.send(mygiftlist);
        });
    });
    var CHANGESEXREQ = (function (_super) {
        __extends(CHANGESEXREQ, _super);
        function CHANGESEXREQ() {
            _super.apply(this, arguments);
        }
        return CHANGESEXREQ;
    }(GSUSERREQBASE));
    app.AddSdkApi("changeusersex", function (req) {
        var para = req.param;
        GetGameUser(null, para.mysession, function (user, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else if (!user) {
                req.send(null, 1, "请重新登录！");
                return;
            }
            gameapi.conn.query("update t_gameuser set sex=? where userid=?", [para.sex, user.sdkuserid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    throw err;
                }
                // user.sex = para.sex;
                // gameapi.conn.query("update t_random_name set state=0 where sex=?", [user.sex], (err, rows, fields) => {
                // });
                // gameapi.conn.query("update t_random_name set state=1 where sex=?", [user.sex], (err, rows, fields) => {
                // });
                req.send({});
            });
        });
    });
    app.AddSdkApi("getallgiftlist", function (req) {
        var para = req.param;
        if (para.loginid == null || para.loginid == "") {
            req.send(null, 1, "礼包列表获取失败");
            return;
        }
        var param = [];
        var sql = "SELECT a.*, c.`name`, b.loginid FROM ( SELECT id, gameid, giftname, instruction,  " +
            "  total, remainder, useway, one, endtime, groupqq, createtime, gifttype FROM t_gsgifttype WHERE del = 0 ) a  " +
            "  LEFT JOIN t_gsgiftlog b ON a.id = b.typeid AND loginid = ? LEFT JOIN t_gsh5game c ON a.gameid = c.Id ORDER BY a.createtime DESC";
        param.push(para.loginid);
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var typelist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + info.gameid + ".png");
                info.createtime = rows[i]["createtime"].getTime();
                info.endtime = rows[i]["endtime"].getTime();
                if (rows[i]["total"] == null) {
                    info.total = 0;
                }
                if (rows[i]["remainder"] == null) {
                    info.remainder = 0;
                }
                typelist[i] = info;
            }
            req.send(typelist);
        });
    });
    var GETGIFTCODEINFO = (function () {
        function GETGIFTCODEINFO() {
        }
        return GETGIFTCODEINFO;
    }());
    app.AddSdkApi("getgiftcodeinfo", function (req) {
        var para = req.param;
        if (para.flags == 0) {
            var sql = "SELECT a.code FROM t_gsgift a  WHERE a.getted = 0 AND a.del = 0 AND a.typeid = ? ";
            gameapi.conn.query(sql, [para.typeid], function (err, rows, fileds) {
                if (err) {
                    req.send(null, 1, "礼包码获取失败");
                    return;
                }
                if (rows.length != 0) {
                    var code = rows[0]['code'];
                    var sql = "select one from t_gsgifttype where id=?";
                    gameapi.conn.query(sql, [para.typeid], function (err, rows, fileds) {
                        if (err) {
                            req.send(null, 1, "礼包码获取失败");
                            return;
                        }
                        if (rows[0].one == 0) {
                            var sqlparamsEntities = [];
                            var entity1 = {
                                sql: "update t_gsgift set getted=1 where code=? and typeid=?",
                                params: [code, para.typeid]
                            };
                            sqlparamsEntities.push(entity1);
                            var entity2 = {
                                sql: "update t_gsgifttype set remainder=remainder+1 where id=? and del=0",
                                params: [para.typeid]
                            };
                            sqlparamsEntities.push(entity2);
                            var entity3 = {
                                sql: "insert into t_gsgiftlog(typeid,loginid,gameid,code) values(?,?,?,?)",
                                params: [para.typeid, para.loginid, para.gameid, code]
                            };
                            sqlparamsEntities.push(entity3);
                            gameapi.conn.execTrans(sqlparamsEntities, function (err, data) {
                                if (err) {
                                    req.send(null, 1, "礼包码获取失败");
                                    return;
                                }
                                var sql = "SELECT a.code, a.typeid, b.giftname, b.instruction, b.useway, a.gameid FROM t_gsgiftlog a LEFT JOIN t_gsgifttype b ON b.id = a.typeid WHERE a.typeid = ? AND a.loginid = ? AND a.gameid = ?";
                                gameapi.conn.query(sql, [para.typeid, para.loginid, para.gameid], function (err, rows, fields) {
                                    if (err) {
                                        req.send(null, 1, "礼包码获取失败");
                                        return;
                                    }
                                    var codeinfo;
                                    if (rows.length != 0) {
                                        codeinfo = rows[0];
                                        req.send(codeinfo);
                                    }
                                    else {
                                        req.send(null, 1, "获取失败");
                                    }
                                });
                            });
                        }
                        else {
                            var sql = "insert into t_gsgiftlog(typeid,loginid,gameid,code) values(?,?,?,?)";
                            gameapi.conn.query(sql, [para.typeid, para.loginid, para.gameid, code], function (err, rows, filed) {
                                if (err) {
                                    req.send(null, 1, err.message);
                                    return;
                                }
                                var sql = "SELECT a.code, a.typeid, b.giftname, b.instruction, b.useway, a.gameid FROM t_gsgiftlog a LEFT JOIN t_gsgifttype b ON b.id = a.typeid WHERE a.typeid = ? AND a.loginid = ? AND a.gameid = ? ";
                                gameapi.conn.query(sql, [para.typeid, para.loginid, para.gameid], function (err, rows, fields) {
                                    if (err) {
                                        req.send(null, 1, "礼包码获取失败");
                                        return;
                                    }
                                    var codeinfo;
                                    if (rows.length != 0) {
                                        codeinfo = rows[0];
                                        req.send(codeinfo);
                                    }
                                    else {
                                        req.send(null, 1, "获取失败");
                                    }
                                });
                            });
                        }
                    });
                }
                else {
                    req.send(null, 1, "获取失败，礼包码为空");
                }
            });
        }
        else {
            var sql = "SELECT a.code, a.typeid, b.giftname, b.instruction, b.useway, a.gameid FROM t_gsgiftlog a LEFT JOIN t_gsgifttype b ON b.id = a.typeid WHERE a.typeid = ? AND a.loginid = ? AND a.gameid = ?";
            gameapi.conn.query(sql, [para.typeid, para.loginid, para.gameid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, "礼包码获取失败");
                    return;
                }
                var codeinfo;
                if (rows.length != 0) {
                    codeinfo = rows[0];
                    req.send(codeinfo);
                }
                else {
                    req.send(null, 1, "获取失败");
                }
            });
        }
    });
    var GETRECHAGEREQ = (function () {
        function GETRECHAGEREQ() {
        }
        return GETRECHAGEREQ;
    }());
    var GETRECHAGEINFO = (function () {
        function GETRECHAGEINFO() {
        }
        return GETRECHAGEINFO;
    }());
    app.AddSdkApi("getrechagelist", function (req) {
        var para = req.param;
        var param = [];
        if (!para.userid) {
            var sql = "SELECT a.*, b.nickname,b.point, b.headico FROM ( SELECT id, userid, sum(payrmb) paysum FROM t_userpay WHERE state >= 1 " +
                "  AND sdkid = '0' AND YEARWEEK( date_format(paytime, '%Y-%m-%d') ) = YEARWEEK(now()) GROUP BY userid ) a " +
                "  LEFT JOIN t_gameuser b ON b.userid = a.userid WHERE a.paysum BETWEEN 100 AND 100000000000 UNION ALL SELECT id,userid," +
                "  paysum,nickname,point,headico FROM t_gsrechage ORDER BY paysum DESC LIMIT 0, 20";
        }
        if (!!para.userid) {
            var sql = "SELECT a.*, b.nickname,b.point, b.headico FROM ( SELECT id, userid, sum(payrmb) paysum FROM t_userpay WHERE state >= 1 " +
                "  AND sdkid = '0' AND YEARWEEK( date_format(paytime, '%Y-%m-%d') ) = YEARWEEK(now())-1  GROUP BY userid ) a " +
                "  LEFT JOIN t_gameuser b ON b.userid = a.userid WHERE a.paysum BETWEEN 100 AND 100000000000 UNION ALL SELECT id,userid," +
                "  paysum,nickname,point,headico FROM t_gsrechage ORDER BY paysum DESC LIMIT 0, 20";
        }
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var rechagelist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                if (info.headico.indexOf("http") >= 0) {
                    info.headico = gameapi.GetServerUrl(info.headico);
                }
                else {
                    info.headico = gameapi.GetServerUrl("gamecenter/head/" + info.headico);
                }
                rechagelist[i] = info;
            }
            req.send(rechagelist);
        });
    });
    var RADOMNAMELISTREQ = (function () {
        function RADOMNAMELISTREQ() {
        }
        return RADOMNAMELISTREQ;
    }());
    app.AddSdkApi("getradomrechage", function (req) {
        var para = req.param;
        var param = [];
        var sql = "SELECT id,nickname,paysum,headico FROM t_gsrechage WHERE del = 0 LIMIT 0,?";
        param.push(para.leng);
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var rechagelist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.headico = gameapi.GetServerUrl("gamecenter/head/" + info.headico);
                rechagelist[i] = info;
            }
            req.send(rechagelist);
        });
    });
    var GETRADOMNAMEREQ = (function () {
        function GETRADOMNAMEREQ() {
        }
        return GETRADOMNAMEREQ;
    }());
    var RADOMNAMELISTINFO = (function () {
        function RADOMNAMELISTINFO() {
        }
        return RADOMNAMELISTINFO;
    }());
    app.AddSdkApi("getradomname", function (req) {
        var para = req.param;
        var sql = "SELECT name FROM t_random_name WHERE id = ? ";
        gameapi.conn.query(sql, [para.id], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var rechagelist = rows[0].name;
            req.send(rechagelist);
        });
    });
    var GETACTIVEREQ = (function () {
        function GETACTIVEREQ() {
        }
        return GETACTIVEREQ;
    }());
    var GETACTIVEINFO = (function () {
        function GETACTIVEINFO() {
        }
        return GETACTIVEINFO;
    }());
    app.AddSdkApi("getactivelist", function (req) {
        var para = req.param;
        var param = [];
        var sql = "SELECT userid, loginid, nickname, headico, point FROM t_gameuser WHERE (1) ORDER BY point DESC LIMIT 0, 20  ";
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var activelist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                if (info.headico.indexOf("http") >= 0) {
                    info.headico = gameapi.GetServerUrl(info.headico);
                }
                else {
                    info.headico = gameapi.GetServerUrl("gamecenter/head/" + info.headico);
                }
                activelist[i] = info;
            }
            req.send(activelist);
        });
    });
    app.AddSdkApi("gettjgamelist", function (req) {
        var para = req.param;
        var param = [];
        var sql = "SELECT Id as id,name FROM t_gsh5game WHERE del = 0 ORDER BY orderby DESC LIMIT 0,10";
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var applist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + info.id + ".png");
                applist[i] = info;
            }
            req.send(applist);
        });
    });
    /***********************************官网AJAX调用列取游戏*************************************/
    app.app.get("/gettjgamelist2", function (req, res) {
        var para = req.param;
        var param = [];
        var sql = "SELECT Id as id,name FROM t_gsh5game WHERE del = 0 ORDER BY orderby DESC LIMIT 0,12";
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                res.send(null, 1, err.message);
                return;
            }
            var applist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                var path = app.GetAbsPath("../public/gamecenter/h5game/ico/" + info.id + ".png");
                if (fs.existsSync(path)) {
                    info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + info.id + ".png");
                }
                else {
                    info.ico = "";
                }
                applist[i] = info;
            }
            res.send(applist);
        });
    });
    app.app.get("/test", function (req, res) {
        var list = null;
        gameapi.conn.query("SELECT  id  FROM  t_gsvipqq WHERE  id = 1", [], function (err, rows, fields) {
            if (err) {
                res.send(0);
                return;
            }
            list = rows;
            res.send("1");
        });
        setTimeout(function () {
            if (list == null) {
                res.send("0");
            }
            else {
                res.send("1");
            }
        }, 2000);
    });
    app.app.get("/listbaizhangift", function (req, res) {
        var param = [];
        var sql = "SELECT a.*, c.`name`, b.loginid FROM ( SELECT id, gameid, giftname, instruction,  " +
            "  total, remainder, useway, one, updatetime, groupqq, createtime, gifttype FROM t_gsgifttype WHERE id = 128 ) a  " +
            "  LEFT JOIN t_gsgiftlog b ON a.id = b.typeid AND loginid = ? LEFT JOIN t_gsh5game c ON a.gameid = c.Id ORDER BY a.updatetime DESC";
        param.push(req.query.loginid);
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                res.send(null, 1, err.message);
                return;
            }
            var typelist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + info.gameid + ".png");
                info.createtime = rows[i]["createtime"].getTime();
                if (rows[i]["total"] == null) {
                    info.total = 0;
                }
                if (rows[i]["remainder"] == null) {
                    info.remainder = 0;
                }
                typelist[i] = info;
            }
            res.send(typelist);
        });
    });
    app.app.get("/listjianyugift", function (req, res) {
        var param = [];
        var sql = "SELECT a.*, c.`name`, b.loginid FROM ( SELECT id, gameid, giftname, instruction,  " +
            "  total, remainder, useway, one, updatetime, groupqq, createtime, gifttype FROM t_gsgifttype WHERE id = 168 ) a  " +
            "  LEFT JOIN t_gsgiftlog b ON a.id = b.typeid AND loginid = ? LEFT JOIN t_gsh5game c ON a.gameid = c.Id ORDER BY a.updatetime DESC";
        param.push(req.query.loginid);
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                res.send(null, 1, err.message);
                return;
            }
            var typelist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.ico = gameapi.GetServerUrl("gamecenter/h5game/ico/" + info.gameid + ".png");
                info.createtime = rows[i]["createtime"].getTime();
                if (rows[i]["total"] == null) {
                    info.total = 0;
                }
                if (rows[i]["remainder"] == null) {
                    info.remainder = 0;
                }
                typelist[i] = info;
            }
            res.send(typelist);
        });
    });
    app.app.get("/getmygiftcode", function (req, res) {
        var para = req.param;
        var sql = "SELECT a.code FROM t_gsgift a  WHERE a.getted = 0 AND a.del = 0 AND a.typeid = 128 ";
        gameapi.conn.query(sql, [], function (err, rows, fileds) {
            if (err) {
                res.send(null, 1, "礼包码获取失败");
                return;
            }
            if (rows.length != 0) {
                var code = rows[0]['code'];
                var sql = "select one from t_gsgifttype where id=128";
                gameapi.conn.query(sql, [], function (err, rows, fileds) {
                    if (err) {
                        res.send(null, 1, "礼包码获取失败");
                        return;
                    }
                    if (rows[0].one == 0) {
                        var sqlparamsEntities = [];
                        var entity1 = {
                            sql: "update t_gsgift set getted=1 where code=? and typeid=128",
                            params: [code]
                        };
                        sqlparamsEntities.push(entity1);
                        var entity2 = {
                            sql: "update t_gsgifttype set remainder=remainder+1 where id=128 and del=1",
                            params: []
                        };
                        sqlparamsEntities.push(entity2);
                        var entity3 = {
                            sql: "insert into t_gsgiftlog(typeid,loginid,gameid,code) values(128,?,266,?)",
                            params: [req.query.loginid, code]
                        };
                        sqlparamsEntities.push(entity3);
                        gameapi.conn.execTrans(sqlparamsEntities, function (err, data) {
                            if (err) {
                                res.send(null, 1, "礼包码获取失败");
                                return;
                            }
                            var sql = "SELECT a.code, a.typeid, b.giftname, b.instruction, b.useway, a.gameid FROM t_gsgiftlog a LEFT JOIN t_gsgifttype b ON b.id = a.typeid WHERE a.typeid = 128 AND a.loginid = ? AND a.gameid = 266";
                            gameapi.conn.query(sql, [req.query.loginid], function (err, rows, fields) {
                                if (err) {
                                    res.send(null, 1, "礼包码获取失败");
                                    return;
                                }
                                var codeinfo;
                                if (rows.length != 0) {
                                    codeinfo = rows[0];
                                    res.send(codeinfo);
                                }
                                else {
                                    res.send(null, 1, "获取失败");
                                }
                            });
                        });
                    }
                    else {
                        var sql = "insert into t_gsgiftlog(typeid,loginid,gameid,code) values(128,?,266,?)";
                        gameapi.conn.query(sql, [req.query.loginid, code], function (err, rows, filed) {
                            if (err) {
                                res.send(null, 1, err.message);
                                return;
                            }
                            var sql = "SELECT a.code, a.typeid, b.giftname, b.instruction, b.useway, a.gameid FROM t_gsgiftlog a LEFT JOIN t_gsgifttype b ON b.id = a.typeid WHERE a.typeid = 128 AND a.loginid = ? AND a.gameid = 266 ";
                            gameapi.conn.query(sql, [req.query.loginid], function (err, rows, fields) {
                                if (err) {
                                    res.send(null, 1, "礼包码获取失败");
                                    return;
                                }
                                var codeinfo;
                                if (rows.length != 0) {
                                    codeinfo = rows[0];
                                    res.send(codeinfo);
                                }
                                else {
                                    res.send(null, 1, "获取失败");
                                }
                            });
                        });
                    }
                });
            }
            else {
                res.send(null, 1, "获取失败，礼包码为空");
            }
        });
    });
    app.app.get("/getjianyugiftcode", function (req, res) {
        var para = req.param;
        var sql = "SELECT a.code FROM t_gsgift a  WHERE a.getted = 0 AND a.del = 0 AND a.typeid = 168 ";
        gameapi.conn.query(sql, [], function (err, rows, fileds) {
            if (err) {
                res.send(null, 1, "礼包码获取失败");
                return;
            }
            if (rows.length != 0) {
                var code = rows[0]['code'];
                var sql = "select one from t_gsgifttype where id=128";
                gameapi.conn.query(sql, [], function (err, rows, fileds) {
                    if (err) {
                        res.send(null, 1, "礼包码获取失败");
                        return;
                    }
                    if (rows[0].one == 0) {
                        var sqlparamsEntities = [];
                        var entity1 = {
                            sql: "update t_gsgift set getted=1 where code=? and typeid=128",
                            params: [code]
                        };
                        sqlparamsEntities.push(entity1);
                        var entity2 = {
                            sql: "update t_gsgifttype set remainder=remainder+1 where id=128 and del=1",
                            params: []
                        };
                        sqlparamsEntities.push(entity2);
                        var entity3 = {
                            sql: "insert into t_gsgiftlog(typeid,loginid,gameid,code) values(128,?,266,?)",
                            params: [req.query.loginid, code]
                        };
                        sqlparamsEntities.push(entity3);
                        gameapi.conn.execTrans(sqlparamsEntities, function (err, data) {
                            if (err) {
                                res.send(null, 1, "礼包码获取失败");
                                return;
                            }
                            var sql = "SELECT a.code, a.typeid, b.giftname, b.instruction, b.useway, a.gameid FROM t_gsgiftlog a LEFT JOIN t_gsgifttype b ON b.id = a.typeid WHERE a.typeid = 128 AND a.loginid = ? AND a.gameid = 266";
                            gameapi.conn.query(sql, [req.query.loginid], function (err, rows, fields) {
                                if (err) {
                                    res.send(null, 1, "礼包码获取失败");
                                    return;
                                }
                                var codeinfo;
                                if (rows.length != 0) {
                                    codeinfo = rows[0];
                                    res.send(codeinfo);
                                }
                                else {
                                    res.send(null, 1, "获取失败");
                                }
                            });
                        });
                    }
                    else {
                        var sql = "insert into t_gsgiftlog(typeid,loginid,gameid,code) values(128,?,266,?)";
                        gameapi.conn.query(sql, [req.query.loginid, code], function (err, rows, filed) {
                            if (err) {
                                res.send(null, 1, err.message);
                                return;
                            }
                            var sql = "SELECT a.code, a.typeid, b.giftname, b.instruction, b.useway, a.gameid FROM t_gsgiftlog a LEFT JOIN t_gsgifttype b ON b.id = a.typeid WHERE a.typeid = 128 AND a.loginid = ? AND a.gameid = 266 ";
                            gameapi.conn.query(sql, [req.query.loginid], function (err, rows, fields) {
                                if (err) {
                                    res.send(null, 1, "礼包码获取失败");
                                    return;
                                }
                                var codeinfo;
                                if (rows.length != 0) {
                                    codeinfo = rows[0];
                                    res.send(codeinfo);
                                }
                                else {
                                    res.send(null, 1, "获取失败");
                                }
                            });
                        });
                    }
                });
            }
            else {
                res.send(null, 1, "获取失败，礼包码为空");
            }
        });
    });
    var GETLOTTERYLISTREQ = (function (_super) {
        __extends(GETLOTTERYLISTREQ, _super);
        function GETLOTTERYLISTREQ() {
            _super.apply(this, arguments);
        }
        return GETLOTTERYLISTREQ;
    }(GSUSERREQBASE));
    var LOTTERYINFO = (function () {
        function LOTTERYINFO() {
        }
        return LOTTERYINFO;
    }());
    app.AddSdkApi("getlotterylist", function (req) {
        var para = req.param;
        var param = [];
        var sql = "SELECT userid,point FROM t_gameuser WHERE userid = ?";
        param.push(para.userid);
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var applist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                applist[i] = info;
            }
            req.send(applist);
        });
    });
    app.AddSdkApi("createlottery", function (req) {
        var para = req.param;
        var param = [];
        GetGameUser(null, para.mysession, function (user, err) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            else if (!user) {
                req.send(null, 1, "请重新登录！");
                return;
            }
            gameapi.conn.query("select userid,point from t_gameuser where userid = ?", [para.userid], function (err, row, fields) {
                if (row[0].point > 10) {
                    var sql = "update t_gameuser set point = point - 10 where userid = ?";
                    param.push(para.userid);
                    gameapi.conn.query(sql, param, function (err, rows, fields) {
                        if (err) {
                            req.send(null, 1, err.message);
                            return;
                        }
                        user.point = para.point;
                        req.send({});
                    });
                }
                else {
                    req.send(null, 2, "积分不足...");
                }
            });
        });
    });
    app.AddSdkApi("addlotterylist", function (req) {
        var para = req.param;
        var param = [];
        if (para.flag == "10积分") {
            var sql = "update t_gameuser set point = point + 10 where userid=?";
            var sql2 = "insert into t_gslotterylist (userid,reword,createtime,updatetime) values( ?,'10积分',now(),now()) ";
        }
        if (para.flag == "50积分") {
            var sql = "update t_gameuser set point = point + 50 where userid=?";
            var sql2 = "insert into t_gslotterylist (userid,reword,createtime,updatetime) values( ?,'50积分',now(),now()) ";
        }
        if (para.flag == "100积分") {
            var sql = "update t_gameuser set point = point + 100 where userid=?";
            var sql2 = "insert into t_gslotterylist (userid,reword,createtime,updatetime) values( ?,'100积分',now(),now()) ";
        }
        if (para.flag == "甜心小5") {
            var sql2 = "insert into t_gslotterylist (userid,reword,createtime,updatetime) values( ?,'甜心小五',now(),now()) ";
        }
        if (para.flag == "顽皮小5") {
            var sql2 = "insert into t_gslotterylist (userid,reword,createtime,updatetime) values( ?,'顽皮小5',now(),now()) ";
        }
        param.push(para.userid);
        gameapi.conn.query(sql, [para.userid], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            gameapi.conn.query(sql2, [para.userid], function (err, rows, fields) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                req.send({});
            });
        });
    });
    var LOTTERYLISTREQ = (function () {
        function LOTTERYLISTREQ() {
        }
        return LOTTERYLISTREQ;
    }());
    var LOTTERYLISTINFO = (function () {
        function LOTTERYLISTINFO() {
        }
        return LOTTERYLISTINFO;
    }());
    app.AddSdkApi("listlottery", function (req) {
        var para = req.param;
        var param = [];
        var sql = "SELECT * FROM t_gslotterylist WHERE del = 0 AND userid = ?";
        param.push(para.userid);
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var applist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.createtime = rows[i]["createtime"].getTime();
                applist[i] = info;
            }
            req.send(applist);
        });
    });
    app.AddSdkApi("dellistlottery", function (req) {
        var para = req.param;
        var param = [];
        var sql = "DELETE FROM t_gslotterylist WHERE id = ?";
        param.push(para.userid);
        gameapi.conn.query(sql, param, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            req.send({});
        });
    });
    var HOTGAMELISTINFO = (function () {
        function HOTGAMELISTINFO() {
        }
        return HOTGAMELISTINFO;
    }());
    app.AddSdkApi("gethotgamelist", function (req) {
        var para = req.param;
        var sql = "SELECT a.* ,b.Id as appid FROM( SELECT a.id, a.gameid, b.appname gamename, b.url, a.type, a.orderby," +
            "  a.createtime FROM t_gshotgame a LEFT JOIN t_cpapp b ON a.gameid = b.appid AND b.del = 0 AND b.`status` = '已通过' WHERE a.del = 0 )" +
            " a LEFT JOIN t_gsh5game b ON b.url = a.url WHERE b.del = 0 ORDER BY a.orderby DESC";
        gameapi.conn.query(sql, [], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            var applist = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                info.img = gameapi.GetServerUrl("management/smallbanner/" + info.gameid + ".jpg");
                info.createtime = rows[i]["createtime"].getTime();
                applist[i] = info;
            }
            req.send(applist);
        });
    });
    var COUNTBANNERREQ = (function () {
        function COUNTBANNERREQ() {
        }
        return COUNTBANNERREQ;
    }());
    app.AddSdkApi("countbanner", function (req) {
        var para = req.param;
        var sql = "insert into t_gsaddrcount (type,createtime,updatetime,del) values(?,now(),now(),0)";
        gameapi.conn.query(sql, [para.type], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            req.send({});
        });
    });
    var UPPROBLEMREQ = (function () {
        function UPPROBLEMREQ() {
        }
        return UPPROBLEMREQ;
    }());
    app.AddSdkApi("upproblem", function (req) {
        var para = req.param;
        var sql = "insert into t_gsproblem (title,detail,userid,createtime,updatetime,del) values(?,?,?,now(),now(),0)";
        gameapi.conn.query(sql, [para.title, para.detail, para.userid], function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                return;
            }
            req.send({});
        });
    });
    /**************************************************分割线**********************************************************/
    // gameapi.HttpRequest("http://5wanpk.com/open/gamecenter/wxnotify.php",true,"<xml>\n"+
    //     "<appid><![CDATA[wxb7e5ca65d4186845s]]></appid>\n"+
    //     "<mch_id><![CDATA[1311716701]]></mch_id>\n"+
    //     "<openid><![CDATA[oKWLVsx-LphsYHC8iUnkXbikZeRs]]></openid>\n"+
    //     "<device_info><![CDATA[WEB]]></device_info>\n"+
    //     "<nonce_str><![CDATA[1843324]]></nonce_str>\n"+
    //     "<body><![CDATA[1000K币]]></body>\n"+
    //     "<out_trade_no><![CDATA[201607191009000001]]></out_trade_no>\n"+
    //     "<fee_type><![CDATA[CNY]]></fee_type>\n"+
    //     "<total_fee><![CDATA[100]]></total_fee>\n"+
    //     "<spbill_create_ip><![CDATA[101.226.125.108]]></spbill_create_ip>\n"+
    //     "<notify_url><![CDATA[http://5wanpk.com/open/gamecenter/wxnotify]]></notify_url>\n"+
    //     "<trade_type><![CDATA[JSAPI]]></trade_type>\n"+
    //     "<sign><![CDATA[A08DBA055F82FA7A3102C473F820C352]]></sign>\n"+
    //     "</xml>",(ret,err)=>{
    //     var dd=3;
    // });
}
exports.InitApi = InitApi;
//PK流程：
/*
 1、客户端WEBSOCKET连接服务器
 2、发送GSUSERENTERPKGAME，服务器自动匹配玩家并返回房间号和对方USERID
 3、如果没有匹配则返回新建的房间号，并在别的玩家进来时再次返回2的数据
 4、定时提交分数
 5、所有玩家gameover后写库并通知所有玩家输赢情况


 */
//游戏房，PK匹配后会进入该房间
var RoomUserInfo = (function () {
    function RoomUserInfo() {
        this.score = 0; //分数
        this.gameover = false; //是否已结束
        this.exitgame = false; //是否点击退出游戏
    }
    return RoomUserInfo;
}());
//广播玩家的分数
var GSUSERPKSCORE = (function () {
    function GSUSERPKSCORE() {
    }
    return GSUSERPKSCORE;
}());
//pk结果
var GSUSERPKRESULT = (function () {
    function GSUSERPKRESULT() {
    }
    return GSUSERPKRESULT;
}());
var GameRoom = (function () {
    function GameRoom() {
        this.users = []; //房间中的玩家
        this.state = 0; //房间状态,0:等待，1：游戏中，2：已结束
        this.robotmustwin = false; //机器人必须赢
        this.roomid = ++GameRoom.s_roomid;
    }
    GameRoom.prototype.IsWaiting = function () {
        if (this.state != 0)
            return false;
        if (this.users.length < 2)
            return true;
        return false;
    };
    GameRoom.prototype.AddUser = function (user, wsocket) {
        if (!this.IsWaiting)
            return false;
        var info = new RoomUserInfo();
        info.user = user;
        info.wsocket = wsocket;
        info.lastrecvtime = new Date();
        this.users.push(info);
        if (this.users.length >= 2) {
            this.Start();
        }
        else {
            this.StartKeepAlive();
            this.StartWaitMatch();
        }
    };
    //等待匹配定时器
    GameRoom.prototype.StartWaitMatch = function () {
        var _this = this;
        this.StopWaitMatch();
        var waitsecond = 0;
        this.timewaitstart = setInterval(function () {
            waitsecond++;
            if (_this.users.length >= 2) {
                _this.StopWaitMatch();
                return;
            }
            if (_this.gameinfo.enablerobot && waitsecond >= _this.gameinfo.robotdelay) {
                _this.StopWaitMatch();
                var robot = new RoomUserInfo();
                _this.users.push(robot);
                robot.user = new GSUSERINFO();
                robot.user.headico = gameapi_1.g_myFrontDomain + "gamecenter/style/pk/对手随机头像/" + (Math.floor(Math.random() * 30) + 1) + ".png";
                robot.starttime = new Date();
                GetRandNick(function (nickname, err) {
                    if (err) {
                        throw (err);
                    }
                    robot.user.nickname = nickname;
                    //发送匹配成功
                    var ret = new GSUSERENTERPKGAMERESP();
                    ret.roomid = _this.roomid;
                    ret.user = { userid: null, nickname: robot.user.nickname, headico: robot.user.headico };
                    GameRoom.SendData(_this.users[0].wsocket, "gsuserenterpkgame", ret);
                    _this.StartRobotTimer();
                    _this.Start();
                });
            }
        }, 1000);
    };
    GameRoom.prototype.StopWaitMatch = function () {
        if (this.timewaitstart)
            clearInterval(this.timewaitstart);
    };
    GameRoom.prototype.StartRobotTimer = function () {
        var _this = this;
        this.StopRobotTimer();
        var dt = Math.floor(this.gameinfo.robotscoreinterval * 1000);
        this.timerobot = setInterval(function () {
            clearInterval(_this.timerobot);
            _this.timerobot = setInterval(function () {
                for (var i = 0; i < _this.users.length; i++) {
                    if (!_this.users[i].user.userid) {
                        _this.robotplaytime--;
                        var robot = _this.users[i];
                        var player; //真实玩家
                        if (i == 0)
                            player = _this.users[1];
                        else
                            player = _this.users[0];
                        if (!robot.robotscore)
                            robot.robotscore = 0;
                        var robotadd = _this.gameinfo.robotscorespeed * dt * 0.001;
                        //                        if(this.robotmustwin)
                        {
                            //当需要机器人赢时，根据玩家的分数调整
                            //如果机器人分数比玩家低，则加快机器人得分速度
                            var scorelose = player.score - robot.score;
                            if (scorelose > 0) {
                                robotadd += scorelose / 5;
                            }
                        }
                        robot.robotscore += robotadd;
                        var score = Math.floor(robot.robotscore);
                        var bover = _this.robotplaytime <= 0;
                        if (_this.robotmustwin && (!player.gameover || score < player.score + _this.gameinfo.robotscorespeed * Math.random() * 8))
                            bover = false;
                        if (bover) {
                            _this.StopRobotTimer();
                        }
                        _this.onUserScore(null, null, score, bover, bover);
                        break;
                    }
                }
            }, dt);
        }, this.gameinfo.robotstartwait * 1000);
    };
    GameRoom.prototype.StopRobotTimer = function () {
        if (this.timerobot)
            clearInterval(this.timerobot);
        this.timerobot = null;
    };
    GameRoom.prototype.StartKeepAlive = function () {
        var _this = this;
        //定时10秒一个心跳包检测掉线
        if (this.timewaitexit)
            clearInterval(this.timewaitexit);
        this.timewaitexit = setInterval(function () {
            var nouser = true;
            for (var i = 0; i < _this.users.length; i++) {
                if (!_this.users[i].user.userid) {
                    nouser = false;
                }
                else if (_this.users[i].wsocket) {
                    nouser = false;
                    GameRoom.SendData(_this.users[i].wsocket, "keepalive", {});
                }
            }
            if (nouser) {
                _this.GameOver();
            }
        }, 10000);
    };
    GameRoom.prototype.StopKeepAlive = function () {
        if (this.timewaitexit) {
            clearInterval(this.timewaitexit);
            this.timewaitexit = null;
        }
    };
    GameRoom.prototype.GetUser = function (userid) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].user.userid == userid)
                return this.users[i];
        }
        return null;
    };
    GameRoom.prototype.RemoveUser = function (userid) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].user.userid == userid) {
                this.users.splice(i, 1);
            }
        }
    };
    GameRoom.prototype.Start = function () {
        this.StopWaitMatch();
        this.StopKeepAlive();
        this.state = 1;
        this.starttime = new Date();
    };
    GameRoom.prototype.SetUserExit = function (usr) {
        usr.wsocket = null;
        if (!usr.exitgame) {
            if (!usr.gameover) {
                usr.gameover = true;
                usr.endtime = new Date();
                if (!usr.starttime)
                    usr.starttime = usr.endtime;
            }
            usr.exitgame = true;
        }
        //看另一个玩家是否结束
        var bend = true;
        for (var k = 0; k < this.users.length; k++) {
            if (this.users[k] == usr)
                continue;
            if (!this.users[k].exitgame) {
                bend = false;
                break;
            }
        }
        if (bend) {
            this.GameOver();
        }
    };
    GameRoom.prototype.onUserKeepAlive = function (userid, usersocket) {
        var info = this.GetUser(userid);
        if (!info)
            return;
        info.wsocket = usersocket;
        info.lastrecvtime = new Date();
    };
    GameRoom.prototype.onUserScore = function (userid, usersocket, score, gameover, exitgame) {
        var info = this.GetUser(userid);
        if (!info)
            return;
        //TODO:要加防作弊
        info.wsocket = usersocket;
        info.lastrecvtime = new Date();
        info.score = score;
        if (!info.starttime)
            info.starttime = new Date();
        if (gameover && !info.gameover)
            info.endtime = new Date();
        info.gameover = gameover;
        info.exitgame = exitgame;
        var ret = new GSUSERPKSCORE();
        ret.userid = userid;
        ret.score = score;
        ret.gameover = gameover;
        var isgameexit = exitgame; //是否所有玩家都已退出
        var isgameover = gameover;
        for (var i in this.users) {
            var user = this.users[i];
            if (user.user.userid == userid)
                continue;
            if (!user.exitgame)
                isgameexit = false;
            if (!user.gameover)
                isgameover = false;
            if (!user.user.userid)
                continue; //没用户ID是机器人
            GameRoom.SendData(user.wsocket, "gsuserpkscore", ret);
        }
        if (isgameexit) {
            this.GameOver();
        }
        else if (isgameover) {
            this.StartKeepAlive();
        }
    };
    GameRoom.SendData = function (wsocket, name, data, errno, message) {
        if (errno === void 0) { errno = 0; }
        if (message === void 0) { message = null; }
        if (!wsocket)
            return;
        var dat = new WEBSOCKETPACK();
        dat.name = name;
        dat.data = data;
        dat.errno = errno;
        dat.message = message;
        var str = JSON.stringify(dat);
        wsocket.sendText(str);
    };
    GameRoom.prototype.GameOver = function () {
        var _this = this;
        this.StopWaitMatch();
        this.StopKeepAlive();
        this.StopRobotTimer();
        if (this.state == 0) {
            this.state = 2;
            delete g_gamerooms[this.roomid];
            return;
        }
        else if (this.state == 2)
            return;
        this.state = 2;
        //排序
        this.users.sort(function (a, b) {
            var ret = b.score - a.score;
            if (ret != 0)
                return ret;
            else {
                var timea = a.endtime.getTime() - a.starttime.getTime();
                var timeb = b.endtime.getTime() - b.starttime.getTime();
                return timea - timeb;
            }
        });
        CacheData.AddPkRecord(this.users[0].user, this.users[1].user, this.gameinfo.wingold);
        //        console.trace("GameOver\n");
        //写库
        gameapi.conn.GetConn(function (err, conn) {
            if (err) {
                _this.SendErr(err);
                throw err;
            }
            conn.beginTransaction(function (err) {
                if (err) {
                    _this.SendErr(err);
                    conn.release();
                    throw err;
                }
                _this.users[0].user.gold += _this.gameinfo.wingold - _this.gameinfo.entrancegold;
                _this.users[1].user.gold -= _this.gameinfo.entrancegold;
                conn.query("update t_gsuser set gold=? where userid=?", [_this.users[0].user.gold, _this.users[0].user.userid], function (err, rows, fields) {
                    if (err) {
                        _this.SendErr(err);
                        conn.rollback(function (err2) {
                            conn.release();
                        });
                        throw err;
                    }
                    conn.query("update t_gsuser set gold=? where userid=?", [_this.users[1].user.gold, _this.users[1].user.userid], function (err, rows, fields) {
                        if (err) {
                            _this.SendErr(err);
                            conn.rollback(function (err2) {
                                conn.release();
                            });
                            throw err;
                        }
                        //写PK记录
                        conn.query("insert into t_gspkresult (gameid,user1,user2,nickname1,nickname2,starttime,user1score,user2score,usetime1,usetime2,entrancegold,wingold) values (?,?,?,?,?,?,?,?,?,?,?,?)", [_this.gameinfo.id, _this.users[0].user.userid, _this.users[1].user.userid, _this.users[0].user.nickname, _this.users[1].user.nickname, _this.starttime, _this.users[0].score, _this.users[1].score,
                            _this.users[0].endtime.getTime() - _this.users[0].starttime.getTime(), _this.users[1].endtime.getTime() - _this.users[1].starttime.getTime(), _this.gameinfo.entrancegold, _this.gameinfo.wingold], function (err, rows, fields) {
                            if (err) {
                                _this.SendErr(err);
                                conn.rollback(function (err2) {
                                    conn.release();
                                });
                                throw err;
                            }
                            conn.commit(function (err) {
                                if (err) {
                                    _this.SendErr(err);
                                    conn.rollback(function (err2) {
                                        conn.release();
                                    });
                                    throw err;
                                }
                                conn.release();
                                var ret = new GSUSERPKRESULT();
                                ret.win = true;
                                ret.gold = _this.users[0].user.gold;
                                ret.goldget = _this.gameinfo.wingold;
                                if (_this.users[0].wsocket) {
                                    GameRoom.SendData(_this.users[0].wsocket, "gsuserpkresult", ret);
                                }
                                ret.win = false;
                                ret.gold = _this.users[1].user.gold;
                                ret.goldget = 0;
                                if (_this.users[1].wsocket) {
                                    GameRoom.SendData(_this.users[1].wsocket, "gsuserpkresult", ret);
                                }
                                delete g_gamerooms[_this.roomid];
                                //                                   console.trace("GameOver:ret\n");
                            });
                        });
                    });
                });
            });
        });
    };
    GameRoom.prototype.SendErr = function (err) {
        var dd = 3;
    };
    GameRoom.s_roomid = 0;
    return GameRoom;
}());
//WEBSOCKET连接后登录
var GSUSERENTERPKGAMEREQ = (function (_super) {
    __extends(GSUSERENTERPKGAMEREQ, _super);
    function GSUSERENTERPKGAMEREQ() {
        _super.apply(this, arguments);
    }
    return GSUSERENTERPKGAMEREQ;
}(GSUSERREQBASE));
var PKUSERINFO //PK中的对方玩家信息
 = (function () {
    function PKUSERINFO //PK中的对方玩家信息
        () {
    }
    return PKUSERINFO //PK中的对方玩家信息
    ;
}());
var GSUSERENTERPKGAMERESP = (function () {
    function GSUSERENTERPKGAMERESP() {
    }
    return GSUSERENTERPKGAMERESP;
}());
AddWSApi("gsuserenterpkgame", function (req) {
    var para = req.param.data;
    GetGameUser(null, para.mysession, function (user, err) {
        if (err) {
            req.response(null, 1, err.message);
            throw err;
        }
        else if (!user) {
            req.response(null, 1, "请重新登录！");
            return;
        }
        EnterGameRoom(para.gameid, user, req.wsocket, function (err, room, matchuser) {
            if (err) {
                req.response(null, 1, err.message);
                throw err;
            }
            var ret = new GSUSERENTERPKGAMERESP();
            ret.roomid = room.roomid;
            if (matchuser) {
                ret.user = {
                    userid: matchuser.user.userid,
                    nickname: matchuser.user.nickname,
                    headico: matchuser.user.headico
                };
            }
            req.response(ret);
            if (matchuser) {
                ret.user = { userid: user.userid, nickname: user.nickname, headico: user.headico };
                GameRoom.SendData(matchuser.wsocket, "gsuserenterpkgame", ret);
            }
        });
    });
});
//玩家定时提交分数
var GSUSERUPSCORE = (function (_super) {
    __extends(GSUSERUPSCORE, _super);
    function GSUSERUPSCORE() {
        _super.apply(this, arguments);
    }
    return GSUSERUPSCORE;
}(GSUSERREQBASE));
AddWSApi("gsuserupscore", function (req) {
    var para = req.param.data;
    GetGameUser(null, para.mysession, function (user, err) {
        if (err) {
            req.response(null, 1, err.message);
            throw err;
        }
        else if (!user) {
            req.response(null, 1, "请重新登录！");
            return;
        }
        var room = g_gamerooms[para.roomid];
        if (!room) {
            req.response(null, 1, "房间不存在！");
            return;
        }
        room.onUserScore(user.userid, req.wsocket, para.score, para.gameover, para.exitgame);
    });
});
AddWSApi("keepalive", function (req) {
    var para = req.param.data;
    GetGameUser(null, para.mysession, function (user, err) {
        if (err) {
            req.response(null, 1, err.message);
            throw err;
        }
        else if (!user) {
            return;
        }
        var room = g_gamerooms[para.roomid];
        if (!room) {
            return;
        }
        room.onUserKeepAlive(user.userid, req.wsocket);
    });
});
var g_gamerooms = {}; //游戏房，g_gamerooms[roomid]=GameRoom
//300秒检测一次掉线用户
var g_roomtimer = setInterval(function () {
    var now = new Date().getTime();
    for (var i in g_gamerooms) {
        var room = g_gamerooms[i];
        if (room.state == 2) {
            delete g_gamerooms[room.roomid];
            continue;
        }
        for (var j = 0; j < room.users.length; j++) {
            var usr = room.users[j];
            if (!usr.user.userid)
                continue;
            if (usr.lastrecvtime.getTime() + 300000 < now) {
                room.SetUserExit(usr);
            }
        }
    }
}, 100000);
function EnterGameRoom(gameid, user, wsocket, cb) {
    for (var i in g_gamerooms) {
        var room = g_gamerooms[i];
        if (room.gameinfo.id != gameid)
            continue;
        if (room.state != 0)
            continue;
        var next = false;
        for (var j = 0; j < room.users.length; j++) {
            if (room.users[j].user.userid == user.userid) {
                //              room.users[j].score=0;//强退0分
                var usr = room.users[j];
                room.SetUserExit(usr);
                next = true;
                break;
            }
        }
        if (next)
            continue;
        if (room.IsWaiting()) {
            room.AddUser(user, wsocket);
            cb(null, room, room.users[0]);
            return;
        }
    }
    gameapi.conn.query("select id,name,url,detail,opencount,playcount,entrancegold,wingold,\n" +
        "enablerobot,robotdelay,robotscorespeed,robotplaytimemax,robotplaytimemin,robotstartwait,robotwinrate,robotscoreinterval\n" +
        " from t_gspkgame where id=?", [gameid], function (err, rows, fields) {
        if (err) {
            cb(err, null, null);
            return;
        }
        if (rows.length == 0) {
            cb(new Error("游戏不存在！"), null, null);
            return;
        }
        room = new GameRoom();
        room.gameinfo = rows[0];
        room.robotplaytime = Math.random() * (room.gameinfo.robotplaytimemax - room.gameinfo.robotplaytimemin) + room.gameinfo.robotplaytimemin;
        if (Math.random() * 100 < room.gameinfo.robotwinrate)
            room.robotmustwin = true;
        else
            room.robotmustwin = false;
        room.AddUser(user, wsocket);
        g_gamerooms[room.roomid] = room;
        gameapi.conn.query("update t_gspkgame set opencount=opencount+1,playcount=playcount+1 where id=?", [gameid], function (err, rows, fields) {
        });
        cb(null, room, null);
    });
}
//# sourceMappingURL=gamecenter.js.map