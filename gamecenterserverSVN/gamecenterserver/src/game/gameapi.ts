/**
 * Created by Administrator on 2015/11/27.
 * 主程序
 *
 *
 */
declare function require(name:string);
var crypto = require('crypto');
//var Buffer=require('buffer');
declare var Buffer;
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
import alipay=require("./alipay");
import app=require("../app");
var xml2js = require('xml2js');

import shieldname=require('./shieldname');





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
export var g_myServerDomain="192.168.1.206";//SDK服务器域名
export var g_myFrontDomain="http://192.168.1.206:800/";//前端服务器域名
export var g_serverport = 7031;//sdk服务器端口
export var g_gamecenterwsport = 7032;//游戏中心WEBSOCKET端口

export var g_myServerDomain2="5wanpk.com";//SDK服务器域名
export var g_myFrontDomain2="http://5wanpk.com/open/";//前端服务器域名
export var g_serverport2=7035;//sdk服务器端口
export var g_gamecenterwsport2=7036;//游戏中心WEBSOCKET端口
export var g_serverporthttps=7034;//HTTPS版sdk服务器端口

var g_mailserver = {username: "xmzfkj@outlook.com", pwd: "xmzhangfeng123456"};




//返回服务器下的path路径的完整路径
export function GetServerUrl(path:string):string {
    if (path.indexOf("http://") >= 0)return path
    var ret = "http://" + g_myServerDomain + ":" + g_serverport + "/" + path;
    return ret;
}

//返回服务器下的path路径的完整路径（SDK）
export  function GetServerUrl2(path:string):string
{
    if(path.indexOf("http://")>=0)return path;
    var ret:string;
    if(path.substr(0,1)!="/")ret="http://"+g_myServerDomain2+":"+g_serverport2+"/"+path;
    else ret="http://"+g_myServerDomain2+":"+g_serverport2+path;
    return ret;
}
//获取游戏地址，当SDK要求参数传游戏地址时可调此获取
export function GetAppUrl(id: number): string {
    return GetServerUrl2("h5game_" + id);
}
export function GetAppUrlHttps(id: number): string {
    return "https://" + g_myServerDomain2 + ":" + g_serverporthttps + "/h5game_" + id;
}
export interface Conn {
    connect(options, callback);
    changeUser(options, callback);
    beginTransaction(options, callback?:any);
    commit(options, callback?:any);
    rollback(options, callback?:any);
    query(sql, values, cb);
    ping(options, callback);
    statistics(options, callback);
    end(options, callback);
    destroy();
    pause();
    resume();
    escape(value);
    escapeId(value);

}
export interface PoolConn extends Conn {
    release();

}

export class SqlConn {
//    conn:any;
    pool:any
    InitServer() {
        this.pool = mysql.createPool({
            // host: 'localhost',// user: 'root',
            // user: 'root',// password: 'root',
            // password: 'root',
            host:'119.29.143.172',
            user: 'root',
            password: 'zf10086root',
            database: '5wansdk',
            port: 3306
        });
    }

    onerror(errno) {
        if (errno.errno == "ECONNRESET") {
            console.error(new Date() + "mysql连接断开，正在重连");
//            this.pool.end();
//            this.conn.end();
            //           this.InitServer();
        }
        console.error(new Date() + "mysql出错" + errno.message);
    }

    query(sql:string, param:any[], cb:(err, rows, fields)=>void) {
        this.pool.getConnection((err:Error, conn:PoolConn)=> {
            if (err) {
                this.onerror(err);
                cb(err, null, null);
            }
            conn.query(sql, param, (err, rows, fields)=> {
                if (!!err && err.errno == "ECONNRESET") {
                    conn.release();
//                    this.pool.end();
//                    this.InitServer();
                    this.query(sql, param, cb);
                }
                else {
                    conn.release();
                    cb(err, rows, fields);
                }
            });
        });


    }

    GetConn(cb:(err:Error, conn:PoolConn)=>void)//取得一个连接，用完需调用release()
    {
        this.pool.getConnection((err:Error, conn:PoolConn)=> {
            cb(err, conn);
        });
    }

    execTrans(sqlparamsEntities, callback) {//事务处理
        this.pool.getConnection(function (err, connection) {
            if (err) {
                return callback(err, null);
            }
            var timestart = new Date();
            console.time("开始时间"+timestart);
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
                                    callback(tErr.message,null);
                                });
                            } else {
                                return cb(null, 'ok');
                            }
                        })
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
                    } else {
                        connection.commit(function (err, info) {
                            console.log("transaction info: " + JSON.stringify(info));
                            if (err) {
                                console.log("执行事务失败，" + err);
                                connection.rollback(function (err) {
                                    console.log("transaction error: " + err);
                                    connection.release();
                                    return callback(err, null);
                                });
                            } else {
                                connection.release();
                                var timeend = new Date();
                                console.log("结束时间"+timeend);
                                console.log("耗时"+new Date(timeend.getTime()-timestart.getTime()).getSeconds()+"s");
                                return callback(null, info);
                            }
                        })
                    }
                })
            });
        });
    }
}

export var conn:SqlConn = new SqlConn();


////////////////////////////////////////////////////////////////////////////////////////
//接口

var g_nextsession:number = 1000;
export function GetNextSession():string {
    g_nextsession++;
    return g_nextsession.toString() + "_" + Math.floor(Math.random() * 1000000).toString();

}


import userapi=require("./userapi");
import gamecenter=require("./gamecenter");
import admin=require("./admin");
import ltvdata=require("../dataapi/ltvdata");

var codechars:string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];//,"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

export class CRYDATABASEINFO{//加密基类，接口参数都需继承与这个
    requestMethod:string = "md5";
    requestkey:string = "xmzfkj~!@123";
}

export function GetIDCodeKey(code:string):string {
    code = code.toUpperCase();
    var md5sum = CRYPTTO.createHash('md5');
    md5sum.update(code + "5wsdk.123");
    return md5sum.digest('hex');
}


export function GetIdCodeImg(code:string):any {
    var p = new captchapng(98, 40, code); // 宽,高,数字验证码
    p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
    var img = p.getBase64();
    return img;


}

export class MAILINFO {
    to:string;//接收者邮箱
    subject:string;//标题
    html:string;//内容（HTML格式）
}
//发送邮件
export function SendMail(info:MAILINFO,server, cb:(err:Error, res)=>void) {
    var smtpTransport = nodemailer.createTransport("SMTP", {
        host: "smtp.exmail."+server+".com",
        secureConnection: true,
        port:465,
        auth: {
            user: g_mailserver.username,
            pass: g_mailserver.pwd
        }
    });

    smtpTransport.sendMail({
        from: '<'+g_mailserver.username+'>'
        , to: info.to
        , subject: info.subject
        , html: info.html
    }, function (err, res) {
        cb(err, res);
    });
}

export function HttpRequest(urlstr:string, isPost:boolean, postdata:string, cb:(data:string, err:Error)=>void) {
    var opt = url.parse(urlstr, false, true);
    if (!opt.port)opt.port = 80;
    var i = opt.host.indexOf(":");
    if (i >= 0)opt.host = opt.host.substring(0, i);
    var options;
    options = {
        hostname: opt.host,
        port: opt.port,
        path: opt.path,
        method: isPost ? "POST" : 'GET',

    };
    if (isPost && postdata) {
        options.headers = {
            "Content-Type": 'application/x-www-form-urlencoded',
            "Content-Length": postdata.length
        };

    }
    var req = http.request(options, function (res) {

        res.setEncoding('utf8');
        res.on('data', function (chunk:string) {
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

function pad(n) {
    return n.length < 2 ? "0" + n : n;
}
export function uintToString(array) {


    var str = "";
    for (var i = 0, len = array.length; i < len; ++i) {
        str += ( "%" + pad(array[i].toString(16)))
    }

    str = decodeURIComponent(str);
    return str;
}


//HTTPS 发送请求
export function HttpsRequest(urlstr:string, isPost:boolean, postdata:string, cb:(data:string, err:Error)=>void, auth?:string, headers?:any) {
    var opt = url.parse(urlstr, false, true);
    if (!opt.port)opt.port = 443;
    var i = opt.host.indexOf(":");
    if (i >= 0)opt.host = opt.host.substring(0, i);
    var options:any = {
        hostname: opt.host,
        port: opt.port,
        path: opt.path,
        method: isPost ? "POST" : 'GET',

    };
    if (auth) {
        options.auth = auth;
    }
    if (headers) {
        options.headers = headers;
    }

    var req = https.request(options, (res) => {
        res.on('data', (d) => {
            var arr = [].slice.call(d);

            var str = uintToString(arr);
            cb(str, null);
        });
    });
    if (postdata)
        req.write(postdata);
    req.end();

    req.on('error', (e) => {
        cb(null, e);
    });


}

export function MoveFile(srcfile:string, destfile:string, cb:()=>void) {
    var is = fs.createReadStream(srcfile);
    var os = fs.createWriteStream(destfile);
    is.pipe(os);
    is.on("end", function () {
        cb();
    });
}

export function PrefixInteger(num, n):string {
    return (Array(n).join("0") + num).slice(-n).toString();
}

//去掉昵称中的emoji字符，否则mysql可能出错
export function emoji2Str (str) {
    var ranges = [
        '\ud83c[\udf00-\udfff]',
        '\ud83d[\udc00-\ude4f]',
        '\ud83d[\ude80-\udeff]'
    ];
    var emojireg = str .replace(new RegExp(ranges.join('|'), 'g'), '');
    return emojireg;
}
export function GetBase64(str:string):string {
    var b = new Buffer(str);
    var s = b.toString('base64');
    return s;
}

//发送短信接口
export class SMSRet {
    statusCode:string;
    statusMsg:string;
}
export function SendSMS(phoneno:string, data:string[], cb:(ret:SMSRet, err:Error)=>void) {
    //   cb({statusCode:"0",statusMsg:""},null);
//    return;

    var now = new Date();
    var timestamp = PrefixInteger(now.getFullYear(), 4) + PrefixInteger(now.getMonth() + 1, 2) + PrefixInteger(now.getDate(), 2) + PrefixInteger(now.getHours(), 2) + PrefixInteger(now.getMinutes(), 2) + PrefixInteger(now.getSeconds(), 2);

    var str:string = "aaf98f894c49ea4f014c5436f260073f" + "c913320aa4ba4d4581029c55a085c76e" + timestamp;
    var sig = alipay.md5Hex(str).toUpperCase();
    var url = "https://app.cloopen.com:8883/2013-12-26/Accounts/aaf98f894c49ea4f014c5436f260073f/SMS/TemplateSMS?sig=" + sig;
    var auth = "aaf98f894c49ea4f014c5436f260073f:" + timestamp;

    var postdata:any = {
        to: phoneno,
        appId: "8a48b5514c49eb79014c54a1d14c0756",
        templateId: "153022",
        datas: data,

    };
    HttpsRequest(url, true, JSON.stringify(postdata), (ret, err)=> {
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


//XML转JSON对象
export function XmlToJson(xmlstr:string, cb:(err:Error, jsonobj)=>void) {
    var parser = new xml2js.Parser();   //xml -> json
    var json = parser.parseString(xmlstr, function (err, result) {
        if (err) {
            cb(err, null);
            return;
        }
        var jsonobj = result.xml;
        var retobj:any = {};
        for (var i in jsonobj) {
            var obj = jsonobj[i];
            if (obj.length == 0) {
                retobj[i] = null;
            }
            else retobj[i] = obj[0];
        }
        cb(null, retobj);
    });
}


export function url2json(urlParam) {//将URL参数转换为JSON格式
    var divideUrl = urlParam.split('&');
    var res = {};
    for (var i = 0; i < divideUrl.length; i++) {
        var str = divideUrl[i].split('=');
        res[str[0]] = str[1];
    }
    return JSON.stringify(res);
}


export function InitApi() {

    userapi.InitApi();
    gamecenter.InitApi();
    admin.InitApi();
    ltvdata.InitApi();

    //获取验证码
    class GETIDCODEREQ {

    }
    class GETIDCODERESP {
        codekey:string;//验证码KEY
        codeimg:string;//验证码图片URL
    }
    //获取验证码
    app.AddSdkApi("getidcode", function (req) {
        var para:GETIDCODEREQ = req.param;
        var code:string = "";

        for (var i = 0; i < 4; i++) {
            code += codechars[Math.floor(Math.random() * codechars.length)];
        }

        var ret = new GETIDCODERESP();
        ret.codekey = GetIDCodeKey(code);
        ret.codeimg = "data:image/jpg;base64," + GetIdCodeImg(code);//.toString("base64");


        req.send(ret);
        ret = null;
    });


    //获取验证码GET请求
    app.app.get("/getidcode_png", function (req,res) {
        var para:GETIDCODEREQ = res.param;
        var code:string = "";

        for (var i = 0; i < 4; i++) {
            code += codechars[Math.floor(Math.random() * codechars.length)];
        }

        var ret = new GETIDCODERESP();
        ret.codekey = GetIDCodeKey(code);
        ret.codeimg = "data:image/jpg;base64," + GetIdCodeImg(code);//.toString("base64");


        res.send(ret);
        ret = null;
    });



    //1分钟检测一次超时
    setInterval(()=> {
        userapi.CheckTimeout();
    }, 60000);

    class OPENAPPRESP {
        appname:string;//分享的标题
        sharetext:string;//分享内容，空表示使用appname
        sharelink:string;//分享的链接
        shareico:string;//分享时使用的图标
    }

    //微信分享
    app.AddSdkApi("openshare", function (req) {//传ID是为以后分享游戏做保留
        var appid = req.param;//以后做分享游戏时使用
        if (!appid) {
            req.send(null, 1, "id无效");
            return;
        }
        conn.query("select name,url,detail from t_gsh5game where Id=?", [appid], function (err, rows, fields) {
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
                fs.exists(app.GetAbsPath("../public/gamecenter/shareicon/lg.png"), exists=> {
                    if (exists) ret.shareico = GetServerUrl("gamecenter/shareicon/lg.png");
                    else ret.shareico = "";
                    req.send(ret);
                });
                return;
            }
            ret.appname = rows[0]["name"];
            ret.sharetext = rows[0]["detail"];
            ret.sharelink = rows[0]["url"];
            fs.exists(app.GetAbsPath("../public/gamecenter/h5game/ico/" + appid + ".png"), exists=> {
                if (exists)ret.shareico = GetServerUrl("gamecenter/h5game/ico/" + appid + ".png");
                else ret.shareico = "";
                req.send(ret);
            });
        })
    })

    var WXAPPID = "wxe983a05c52c5188f";
    var WXAPPSECRET = "662ff4fe2f7a883ab0c8f782e418d220";
    //取得微信分享签名
    class WXCONFIG {
        debug:boolean; // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId:string; // 必填，公众号的唯一标识
        timestamp:string; // 必填，生成签名的时间戳
        nonceStr:string; // 必填，生成签名的随机串
        signature:string;// 必填，签名，见附录1
        jsApiList:string[] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

    }
    class GETWXCONFIGSIGNREQ {
        data:WXCONFIG;
        url:string;
    }
    class GETWXCONFIGSIGNRESP {
        sign:string;
    }
    var wxticket:string;
    var wxtickettimeout:Date;
    app.AddSdkApi("getwxconfigsign", function (req) {
        var para:GETWXCONFIGSIGNREQ = req.param;
        if (!wxticket || !wxtickettimeout || wxtickettimeout.getTime() < new Date().getTime()) {
            HttpsRequest("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + WXAPPID + "&secret=" + WXAPPSECRET, false, null, (retstr, err)=> {
                if (err) {
                    req.send(null, 1, err.message);
                    return;
                }
                var dat = JSON.parse(retstr);
                if (dat["errcode"]) {
                    req.send(null, 1, retstr);
                    return;
                }
                var acctok:string = dat["access_token"];
                HttpsRequest("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + acctok + "&type=jsapi", false, null, (retstr, err)=> {
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
        else fun();
        function fun() {
            var signstr = "jsapi_ticket=" + wxticket + "&noncestr=" + para.data.nonceStr + "&timestamp=" + para.data.timestamp + "&url=" + para.url;
            var sign = require('crypto').createHash('sha1').update(signstr).digest('hex');
            req.send({sign: sign});
        }

    });
}