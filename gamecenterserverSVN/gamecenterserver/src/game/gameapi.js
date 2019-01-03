"use strict";
var crypto = require('crypto');
var mysql = require('mysql');
var async = require('async');
var fs = require('fs');
var util = require('util');
var https = require('https');
var url = require('url');
var querystring = require('querystring');
var CRYPTTO = require('crypto');
//var ccap = require('ccap');
var captchapng = require('captchapng');
var nodemailer = require("nodemailer");
var http = require('http');
var https = require('https');
var alipay = require("./alipay");
var app = require("../app");
var xml2js = require('xml2js');
//服务端设置
// export var g_myServerDomain="5wanpk.com";//SDK服务器域名
// export var g_myFrontDomain="http://5wanpk.com/gamecenter/";//前端服务器域名
// export var g_serverport = 7031;//sdk服务器端口
// export var g_gamecenterwsport = 7032;//游戏中心WEBSOCKET端口
//
// export var g_myServerDomain2="5wanpk.com";//SDK服务器域名
// export var g_myFrontDomain2="http://5wanpk.com/open/";//前端服务器域名
// export var g_serverport2=7035;//sdk服务器端口
// export var g_gamecenterwsport2=7036;//游戏中心WEBSOCKET端口
// export var g_serverporthttps=7034;//HTTPS版sdk服务器端口
//
// var g_mailserver = {username: "xmzfkj@5wanpk.com", pwd: "Zfkj10086"};
//本地配置
exports.g_myServerDomain = "192.168.1.206"; //SDK服务器域名
exports.g_myFrontDomain = "http://192.168.1.206:800/"; //前端服务器域名
exports.g_serverport = 7031; //sdk服务器端口
exports.g_gamecenterwsport = 7032; //游戏中心WEBSOCKET端口
exports.g_myServerDomain2 = "5wanpk.com"; //SDK服务器域名
exports.g_myFrontDomain2 = "http://5wanpk.com/open/"; //前端服务器域名
exports.g_serverport2 = 7035; //sdk服务器端口
exports.g_gamecenterwsport2 = 7036; //游戏中心WEBSOCKET端口
exports.g_serverporthttps = 7034; //HTTPS版sdk服务器端口
var g_mailserver = { username: "xmzfkj@outlook.com", pwd: "xmzhangfeng123456" };
//返回服务器下的path路径的完整路径
function GetServerUrl(path) {
    if (path.indexOf("http://") >= 0)
        return path;
    var ret = "http://" + exports.g_myServerDomain + ":" + exports.g_serverport + "/" + path;
    return ret;
}
exports.GetServerUrl = GetServerUrl;
//返回服务器下的path路径的完整路径（SDK）
function GetServerUrl2(path) {
    if (path.indexOf("http://") >= 0)
        return path;
    var ret;
    if (path.substr(0, 1) != "/")
        ret = "http://" + exports.g_myServerDomain2 + ":" + exports.g_serverport2 + "/" + path;
    else
        ret = "http://" + exports.g_myServerDomain2 + ":" + exports.g_serverport2 + path;
    return ret;
}
exports.GetServerUrl2 = GetServerUrl2;
//获取游戏地址，当SDK要求参数传游戏地址时可调此获取
function GetAppUrl(id) {
    return GetServerUrl2("h5game_" + id);
}
exports.GetAppUrl = GetAppUrl;
function GetAppUrlHttps(id) {
    return "https://" + exports.g_myServerDomain2 + ":" + exports.g_serverporthttps + "/h5game_" + id;
}
exports.GetAppUrlHttps = GetAppUrlHttps;
var SqlConn = (function () {
    function SqlConn() {
    }
    SqlConn.prototype.InitServer = function () {
        this.pool = mysql.createPool({
            // host: 'localhost',// user: 'root',
            // user: 'root',// password: 'root',
            // password: 'root',
            host: '119.29.143.172',
            user: 'root',
            password: 'zf10086root',
            database: '5wansdk',
            port: 3306
        });
    };
    SqlConn.prototype.onerror = function (errno) {
        if (errno.errno == "ECONNRESET") {
            console.error(new Date() + "mysql连接断开，正在重连");
        }
        console.error(new Date() + "mysql出错" + errno.message);
    };
    SqlConn.prototype.query = function (sql, param, cb) {
        var _this = this;
        this.pool.getConnection(function (err, conn) {
            if (err) {
                _this.onerror(err);
                cb(err, null, null);
            }
            conn.query(sql, param, function (err, rows, fields) {
                if (!!err && err.errno == "ECONNRESET") {
                    conn.release();
                    //                    this.pool.end();
                    //                    this.InitServer();
                    _this.query(sql, param, cb);
                }
                else {
                    conn.release();
                    cb(err, rows, fields);
                }
            });
        });
    };
    SqlConn.prototype.GetConn = function (cb) {
        this.pool.getConnection(function (err, conn) {
            cb(err, conn);
        });
    };
    SqlConn.prototype.execTrans = function (sqlparamsEntities, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                return callback(err, null);
            }
            var timestart = new Date();
            console.time("开始时间" + timestart);
            connection.beginTransaction(function (err) {
                if (err) {
                    return callback(err, null);
                }
                console.log("开始执行transaction，共执行" + sqlparamsEntities.length + "条数据");
                var funcAry = [];
                sqlparamsEntities.forEach(function (sql_param) {
                    var temp = function (cb) {
                        var sql = sql_param.sql;
                        var param = sql_param.params;
                        connection.query(sql, param, function (tErr, rows, fields) {
                            if (tErr) {
                                connection.rollback(function () {
                                    console.log("事务失败，" + JSON.stringify(sql_param) + "，ERROR：" + tErr);
                                    callback(tErr.message, null);
                                });
                            }
                            else {
                                return cb(null, 'ok');
                            }
                        });
                    };
                    funcAry.push(temp);
                });
                async.series(funcAry, function (err, result) {
                    console.log("transaction error: " + err);
                    if (err) {
                        connection.rollback(function (err) {
                            console.log("transaction error: " + err);
                            connection.release();
                            return callback(err, null);
                        });
                    }
                    else {
                        connection.commit(function (err, info) {
                            console.log("transaction info: " + JSON.stringify(info));
                            if (err) {
                                console.log("执行事务失败，" + err);
                                connection.rollback(function (err) {
                                    console.log("transaction error: " + err);
                                    connection.release();
                                    return callback(err, null);
                                });
                            }
                            else {
                                connection.release();
                                var timeend = new Date();
                                console.log("结束时间" + timeend);
                                console.log("耗时" + new Date(timeend.getTime() - timestart.getTime()).getSeconds() + "s");
                                return callback(null, info);
                            }
                        });
                    }
                });
            });
        });
    };
    return SqlConn;
}());
exports.SqlConn = SqlConn;
exports.conn = new SqlConn();
////////////////////////////////////////////////////////////////////////////////////////
//接口
var g_nextsession = 1000;
function GetNextSession() {
    g_nextsession++;
    return g_nextsession.toString() + "_" + Math.floor(Math.random() * 1000000).toString();
}
exports.GetNextSession = GetNextSession;
var userapi = require("./userapi");
var gamecenter = require("./gamecenter");
var admin = require("./admin");
var ltvdata = require("../dataapi/ltvdata");
var codechars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]; //,"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var CRYDATABASEINFO = (function () {
    function CRYDATABASEINFO() {
        this.requestMethod = "md5";
        this.requestkey = "xmzfkj~!@123";
    }
    return CRYDATABASEINFO;
}());
exports.CRYDATABASEINFO = CRYDATABASEINFO;
function GetIDCodeKey(code) {
    code = code.toUpperCase();
    var md5sum = CRYPTTO.createHash('md5');
    md5sum.update(code + "5wsdk.123");
    return md5sum.digest('hex');
}
exports.GetIDCodeKey = GetIDCodeKey;
function GetIdCodeImg(code) {
    var p = new captchapng(98, 40, code); // 宽,高,数字验证码
    p.color(0, 0, 0, 0); // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
    var img = p.getBase64();
    return img;
}
exports.GetIdCodeImg = GetIdCodeImg;
var MAILINFO = (function () {
    function MAILINFO() {
    }
    return MAILINFO;
}());
exports.MAILINFO = MAILINFO;
//发送邮件
function SendMail(info, server, cb) {
    var smtpTransport = nodemailer.createTransport("SMTP", {
        host: "smtp.exmail." + server + ".com",
        secureConnection: true,
        port: 465,
        auth: {
            user: g_mailserver.username,
            pass: g_mailserver.pwd
        }
    });
    smtpTransport.sendMail({
        from: '<' + g_mailserver.username + '>',
        to: info.to,
        subject: info.subject,
        html: info.html
    }, function (err, res) {
        cb(err, res);
    });
}
exports.SendMail = SendMail;
function HttpRequest(urlstr, isPost, postdata, cb) {
    var opt = url.parse(urlstr, false, true);
    if (!opt.port)
        opt.port = 80;
    var i = opt.host.indexOf(":");
    if (i >= 0)
        opt.host = opt.host.substring(0, i);
    var options;
    options = {
        hostname: opt.host,
        port: opt.port,
        path: opt.path,
        method: isPost ? "POST" : 'GET'
    };
    if (isPost && postdata) {
        options.headers = {
            "Content-Type": 'application/x-www-form-urlencoded',
            "Content-Length": postdata.length
        };
    }
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            cb(chunk, null);
        });
        if (res.statusCode >= 400) {
            cb(null, new Error(res.statusCode + ":" + res.statusMessage));
            return;
        }
    });
    req.on('error', function (e) {
        cb(null, e);
    });
    if (isPost && postdata) {
        req.write(postdata);
    }
    req.end();
}
exports.HttpRequest = HttpRequest;
function pad(n) {
    return n.length < 2 ? "0" + n : n;
}
function uintToString(array) {
    var str = "";
    for (var i = 0, len = array.length; i < len; ++i) {
        str += ("%" + pad(array[i].toString(16)));
    }
    str = decodeURIComponent(str);
    return str;
}
exports.uintToString = uintToString;
//HTTPS 发送请求
function HttpsRequest(urlstr, isPost, postdata, cb, auth, headers) {
    var opt = url.parse(urlstr, false, true);
    if (!opt.port)
        opt.port = 443;
    var i = opt.host.indexOf(":");
    if (i >= 0)
        opt.host = opt.host.substring(0, i);
    var options = {
        hostname: opt.host,
        port: opt.port,
        path: opt.path,
        method: isPost ? "POST" : 'GET'
    };
    if (auth) {
        options.auth = auth;
    }
    if (headers) {
        options.headers = headers;
    }
    var req = https.request(options, function (res) {
        res.on('data', function (d) {
            var arr = [].slice.call(d);
            var str = uintToString(arr);
            cb(str, null);
        });
    });
    if (postdata)
        req.write(postdata);
    req.end();
    req.on('error', function (e) {
        cb(null, e);
    });
}
exports.HttpsRequest = HttpsRequest;
function MoveFile(srcfile, destfile, cb) {
    var is = fs.createReadStream(srcfile);
    var os = fs.createWriteStream(destfile);
    is.pipe(os);
    is.on("end", function () {
        cb();
    });
}
exports.MoveFile = MoveFile;
function PrefixInteger(num, n) {
    return (Array(n).join("0") + num).slice(-n).toString();
}
exports.PrefixInteger = PrefixInteger;
//去掉昵称中的emoji字符，否则mysql可能出错
function emoji2Str(str) {
    var ranges = [
        '\ud83c[\udf00-\udfff]',
        '\ud83d[\udc00-\ude4f]',
        '\ud83d[\ude80-\udeff]'
    ];
    var emojireg = str.replace(new RegExp(ranges.join('|'), 'g'), '');
    return emojireg;
}
exports.emoji2Str = emoji2Str;
function GetBase64(str) {
    var b = new Buffer(str);
    var s = b.toString('base64');
    return s;
}
exports.GetBase64 = GetBase64;
//发送短信接口
var SMSRet = (function () {
    function SMSRet() {
    }
    return SMSRet;
}());
exports.SMSRet = SMSRet;
function SendSMS(phoneno, data, cb) {
    //   cb({statusCode:"0",statusMsg:""},null);
    //    return;
    var now = new Date();
    var timestamp = PrefixInteger(now.getFullYear(), 4) + PrefixInteger(now.getMonth() + 1, 2) + PrefixInteger(now.getDate(), 2) + PrefixInteger(now.getHours(), 2) + PrefixInteger(now.getMinutes(), 2) + PrefixInteger(now.getSeconds(), 2);
    var str = "aaf98f894c49ea4f014c5436f260073f" + "c913320aa4ba4d4581029c55a085c76e" + timestamp;
    var sig = alipay.md5Hex(str).toUpperCase();
    var url = "https://app.cloopen.com:8883/2013-12-26/Accounts/aaf98f894c49ea4f014c5436f260073f/SMS/TemplateSMS?sig=" + sig;
    var auth = "aaf98f894c49ea4f014c5436f260073f:" + timestamp;
    var postdata = {
        to: phoneno,
        appId: "8a48b5514c49eb79014c54a1d14c0756",
        templateId: "153022",
        datas: data
    };
    HttpsRequest(url, true, JSON.stringify(postdata), function (ret, err) {
        if (err) {
            cb(null, err);
            return;
        }
        var dat = JSON.parse(ret);
        cb(dat, null);
    }, null, {
        "Authorization": GetBase64(auth),
        "Accept": "application/json",
        "Content-Type": "application/json;charset=utf-8"
    });
}
exports.SendSMS = SendSMS;
//XML转JSON对象
function XmlToJson(xmlstr, cb) {
    var parser = new xml2js.Parser(); //xml -> json
    var json = parser.parseString(xmlstr, function (err, result) {
        if (err) {
            cb(err, null);
            return;
        }
        var jsonobj = result.xml;
        var retobj = {};
        for (var i in jsonobj) {
            var obj = jsonobj[i];
            if (obj.length == 0) {
                retobj[i] = null;
            }
            else
                retobj[i] = obj[0];
        }
        cb(null, retobj);
    });
}
exports.XmlToJson = XmlToJson;
function url2json(urlParam) {
    var divideUrl = urlParam.split('&');
    var res = {};
    for (var i = 0; i < divideUrl.length; i++) {
        var str = divideUrl[i].split('=');
        res[str[0]] = str[1];
    }
    return JSON.stringify(res);
}
exports.url2json = url2json;
function InitApi() {
    userapi.InitApi();
    gamecenter.InitApi();
    admin.InitApi();
    ltvdata.InitApi();
    //获取验证码
    var GETIDCODEREQ = (function () {
        function GETIDCODEREQ() {
        }
        return GETIDCODEREQ;
    }());
    var GETIDCODERESP = (function () {
        function GETIDCODERESP() {
        }
        return GETIDCODERESP;
    }());
    //获取验证码
    app.AddSdkApi("getidcode", function (req) {
        var para = req.param;
        var code = "";
        for (var i = 0; i < 4; i++) {
            code += codechars[Math.floor(Math.random() * codechars.length)];
        }
        var ret = new GETIDCODERESP();
        ret.codekey = GetIDCodeKey(code);
        ret.codeimg = "data:image/jpg;base64," + GetIdCodeImg(code); //.toString("base64");
        req.send(ret);
        ret = null;
    });
    //获取验证码GET请求
    app.app.get("/getidcode_png", function (req, res) {
        var para = res.param;
        var code = "";
        for (var i = 0; i < 4; i++) {
            code += codechars[Math.floor(Math.random() * codechars.length)];
        }
        var ret = new GETIDCODERESP();
        ret.codekey = GetIDCodeKey(code);
        ret.codeimg = "data:image/jpg;base64," + GetIdCodeImg(code); //.toString("base64");
        res.send(ret);
        ret = null;
    });
    //1分钟检测一次超时
    setInterval(function () {
        userapi.CheckTimeout();
    }, 60000);
    var OPENAPPRESP = (function () {
        function OPENAPPRESP() {
        }
        return OPENAPPRESP;
    }());
    //微信分享
    app.AddSdkApi("openshare", function (req) {
        var appid = req.param; //以后做分享游戏时使用
        if (!appid) {
            req.send(null, 1, "id无效");
            return;
        }
        exports.conn.query("select name,url,detail from t_gsh5game where Id=?", [appid], function (err, rows, fields) {
            var ret = new OPENAPPRESP();
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            if (rows.length == 0) {
                //req.send(null,1,"游戏不存在");
                ret.appname = "5玩游戏";
                ret.sharetext = "最好玩的H5游戏，上5玩游戏平台，即点即玩哦！";
                ret.sharelink = "5wanpk.com/h5";
                fs.exists(app.GetAbsPath("../public/gamecenter/shareicon/lg.png"), function (exists) {
                    if (exists)
                        ret.shareico = GetServerUrl("gamecenter/shareicon/lg.png");
                    else
                        ret.shareico = "";
                    req.send(ret);
                });
                return;
            }
            ret.appname = rows[0]["name"];
            ret.sharetext = rows[0]["detail"];
            ret.sharelink = rows[0]["url"];
            fs.exists(app.GetAbsPath("../public/gamecenter/h5game/ico/" + appid + ".png"), function (exists) {
                if (exists)
                    ret.shareico = GetServerUrl("gamecenter/h5game/ico/" + appid + ".png");
                else
                    ret.shareico = "";
                req.send(ret);
            });
        });
    });
    var WXAPPID = "wxe983a05c52c5188f";
    var WXAPPSECRET = "662ff4fe2f7a883ab0c8f782e418d220";
    //取得微信分享签名
    var WXCONFIG = (function () {
        function WXCONFIG() {
        }
        return WXCONFIG;
    }());
    var GETWXCONFIGSIGNREQ = (function () {
        function GETWXCONFIGSIGNREQ() {
        }
        return GETWXCONFIGSIGNREQ;
    }());
    var GETWXCONFIGSIGNRESP = (function () {
        function GETWXCONFIGSIGNRESP() {
        }
        return GETWXCONFIGSIGNRESP;
    }());
    var wxticket;
    var wxtickettimeout;
    app.AddSdkApi("getwxconfigsign", function (req) {
        var para = req.param;
        if (!wxticket || !wxtickettimeout || wxtickettimeout.getTime() < new Date().getTime()) {
            HttpsRequest("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + WXAPPID + "&secret=" + WXAPPSECRET, false, null, function (retstr, err) {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var dat = JSON.parse(retstr);
                if (dat["errcode"]) {
                    req.send(null, 1, retstr);
                    return;
                }
                var acctok = dat["access_token"];
                HttpsRequest("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + acctok + "&type=jsapi", false, null, function (retstr, err) {
                    if (err) {
                        req.send(null, 1, err.message);
                        return;
                    }
                    var dat = JSON.parse(retstr);
                    if (dat["errcode"]) {
                        req.send(null, 1, retstr);
                        return;
                    }
                    wxticket = dat["ticket"];
                    wxtickettimeout = new Date();
                    wxtickettimeout.setTime(wxtickettimeout.getTime() + 7000000);
                    fun();
                });
            });
        }
        else
            fun();
        function fun() {
            var signstr = "jsapi_ticket=" + wxticket + "&noncestr=" + para.data.nonceStr + "&timestamp=" + para.data.timestamp + "&url=" + para.url;
            var sign = require('crypto').createHash('sha1').update(signstr).digest('hex');
            req.send({ sign: sign });
        }
    });
}
exports.InitApi = InitApi;
//# sourceMappingURL=gameapi.js.map