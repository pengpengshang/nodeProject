"use strict";
var gameapi = require("./gameapi");
var app = require("../app");
var alipay = require("./alipay");
var qs = require('querystring');
var fs = require('fs');
var USERINFO = (function () {
    function USERINFO() {
        this.userid = 0; //用户ID
        this.loginid = ""; //登录名
        this.channelappid = 0; //登录到哪个游戏
        this.nickname = ""; //昵称
        this.headico = ""; //头像
        this.gold = 0; //金币
        this.logintime = 0; //登录时间
        this.lasttime = 0; //最后操作时间
        this.session = "";
    }
    return USERINFO;
}());
exports.USERINFO = USERINFO;
exports.g_gameusers = {}; //g_gameusers[userid]=GAMEUSERINFO
//取得用户信息，如果用户不在内存中则自动加载
function GetGameUser(userid, session, cb) {
    var sess;
    if (session)
        sess = session.split("_");
    if (!userid)
        userid = parseInt(sess[0]);
    var ret = exports.g_gameusers[userid];
    if (!ret) {
        if (!session) {
            cb(null, null);
            return;
        }
        //不在内存，从数据库加载，加载不记录登录日志
        gameapi.conn.query("select userid,loginid,nickname,headico,gold from t_gameuser where userid=? and session=?", [userid, session], function (err, rows, fields) {
            if (err) {
                cb(err, null);
                return;
            }
            if (rows.length == 0) {
                cb(new Error("请重新登录!"), null);
                return;
            }
            var channelappid = null;
            if (sess[1])
                channelappid = parseInt(sess[1]);
            ret = GetUserInfo(rows[0], channelappid);
            ret.session = session;
            ret.lasttime = new Date().getTime();
            exports.g_gameusers[ret.userid] = ret;
            cb(null, ret);
        });
    }
    else {
        if (!session || ret.session == session) {
            ret.lasttime = new Date().getTime();
            cb(null, ret);
        }
        else {
            cb(new Error("请重新登录！"), null);
        }
    }
}
exports.GetGameUser = GetGameUser;
//检测并删除超时用户
function CheckTimeout() {
    var curtime = new Date().getTime();
    for (var i in exports.g_gameusers) {
        var info = exports.g_gameusers[i];
        if (info.lasttime < curtime - 3600000) {
            delete exports.g_gameusers[i];
        }
    }
}
exports.CheckTimeout = CheckTimeout;
//APP日志
function AddAppLog(appid, channelid, type, msg, userid) {
    gameapi.conn.query("insert into t_applog (appid,channelid,type,msg,userid) values(?,?,?,?,?)", [appid, channelid, type, msg, userid], function (err, rows, fields) {
        if (err)
            throw err;
    });
}
exports.AddAppLog = AddAppLog;
//登录日志
function AddAppLoginLog(channelappid, userid) {
    gameapi.conn.query("select channelid,appid from t_channelapp where id=?", [channelappid], function (err, rows, fields) {
        if (err)
            throw err;
        if (rows.length > 0) {
            AddAppLog(rows[0]["appid"], rows[0]["channelid"], 2, null, userid);
        }
        else {
            AddAppLog(null, null, 2, null, userid);
        }
    });
}
exports.AddAppLoginLog = AddAppLoginLog;
//注册日志
function AddAppRegLog(channelappid, userid) {
    gameapi.conn.query("select channelid,appid from t_channelapp where id=?", [channelappid], function (err, rows, fields) {
        if (err)
            throw err;
        if (rows.length > 0) {
            AddAppLog(rows[0]["appid"], rows[0]["channelid"], 4, null, userid);
        }
        else {
            AddAppLog(null, null, 4, null, userid);
        }
    });
}
exports.AddAppRegLog = AddAppRegLog;
//登出日志
function AddAppLogoutLog(user) {
    gameapi.conn.query("select channelid,appid from t_channelapp where id=?", [user.channelappid], function (err, rows, fields) {
        if (err)
            throw err;
        if (rows.length > 0) {
            AddAppLog(rows[0]["appid"], rows[0]["channelid"], 3, user.logintime.toString(), user.userid);
        }
        else {
            AddAppLog(null, null, 3, user.logintime.toString(), user.userid);
        }
    });
}
exports.AddAppLogoutLog = AddAppLogoutLog;
function GetUserInfo(row, channelappid) {
    var user = new USERINFO();
    user.channelappid = channelappid;
    user.userid = row["userid"];
    user.gold = row["gold"];
    user.headico = row["headico"];
    user.loginid = row["loginid"];
    user.nickname = row["nickname"];
    user.logintime = new Date().getTime();
    user.lasttime = user.logintime;
    user.headico = gameapi.GetServerUrl("gamecenter/head/" + user.headico);
    return user;
}
var USERREGREQ = (function () {
    function USERREGREQ() {
        this.nickname = ""; //昵称，可空
    }
    return USERREGREQ;
}());
exports.USERREGREQ = USERREGREQ;
//取得APPSECRET，appid和channelappid选填一个
function GetAppSecret(appid, channelappid, cb) {
    if (appid) {
        gameapi.conn.query("select a.appsecret from t_cpapp a where a.appid=?", [appid], function (err, rows2, fields) {
            if (err) {
                cb(err, null);
                return;
            }
            var appsecret = null;
            if (rows2.length > 0)
                appsecret = rows2[0]["appsecret"];
            cb(null, appsecret);
        });
    }
    else if (channelappid) {
        gameapi.conn.query("select a.appsecret from t_cpapp a,t_channelapp b where a.appid=b.appid and b.id=?", [channelappid], function (err, rows2, fields) {
            if (err) {
                cb(err, null);
                return;
            }
            var appsecret = null;
            if (rows2.length > 0)
                appsecret = rows2[0]["appsecret"];
            cb(null, appsecret);
        });
    }
    else
        cb(null, null);
}
exports.GetAppSecret = GetAppSecret;
//玩家登录后的REQ要以这个为基类
var USERREQBASE = (function () {
    function USERREQBASE() {
    }
    return USERREQBASE;
}());
exports.USERREQBASE = USERREQBASE;
function InitApi() {
    //玩家注册，注册后自动登录
    var USERREGRESP = (function () {
        function USERREGRESP() {
        }
        return USERREGRESP;
    }());
    exports.UserReg = function (para, ip, autoreg, cb) {
        GetAppSecret(para.appid, para.channelappid, function (err, appsecret) {
            if (err) {
                cb(null, err);
                return;
            }
            var user = new USERINFO();
            user.channelappid = para.channelappid;
            user.loginid = para.loginid;
            user.nickname = para.nickname;
            if (!user.nickname)
                user.nickname = user.loginid;
            user.headico = "系统人物头像/system_head_" + (Math.floor(Math.random() * 26) + 1) + ".png"; //"default.png";
            user.logintime = new Date().getTime();
            user.lasttime = user.logintime;
            user.gold = 0;
            if (!para.channelappid)
                para.channelappid = null;
            gameapi.conn.query("insert into t_gameuser (loginid,pwd,nickname,headico,gold,regip,regchannelapp,haspwd) values(?,?,?,?,?,?,?,?)", [user.loginid, para.pwd ? para.pwd : "", user.nickname, user.headico, user.gold, ip, para.channelappid, autoreg ? 0 : 1], function (err, rows, fields) {
                //TODO:添加注册时间、注册IP
                if (err) {
                    cb(null, err);
                    return;
                }
                user.userid = rows.insertId;
                user.session = user.userid + "_" + (!!para.channelappid ? para.channelappid : "") + "_" + gameapi.GetNextSession();
                user.headico = gameapi.GetServerUrl("gamecenter/head/" + user.headico);
                user["pwd"] = para.pwd;
                user.sign = alipay.GetSign(user, appsecret);
                exports.g_gameusers[user.userid] = user;
                AddAppRegLog(para.channelappid, user.userid);
                AddAppLoginLog(para.channelappid, user.userid);
                cb(user, null);
            });
        });
    };
    app.AddSdkApi("getdefaultImgs", function (req) {
        fs.readdir('public/gamecenter/head/系统人物头像/', function (error, files) {
            var imgsPath = [];
            if (error != null) {
                req.send(null, 1, error);
                return;
            }
            else {
                files.forEach(function (file) {
                    imgsPath.push(gameapi.GetServerUrl("gamecenter/head/系统人物头像/" + file));
                });
                req.send(imgsPath);
            }
        });
    });
    app.AddSdkApi("getdefaultImgssecond", function (req) {
        fs.readdir('public/gamecenter/head/systemhead/', function (error, files) {
            var imgsPath = [];
            if (error != null) {
                req.send(null, 1, error);
                return;
            }
            else {
                files.forEach(function (file) {
                    imgsPath.push(gameapi.GetServerUrl("gamecenter/head/systemhead/" + file));
                });
                req.send(imgsPath);
            }
        });
    });
}
exports.InitApi = InitApi;
//# sourceMappingURL=userapi.js.map