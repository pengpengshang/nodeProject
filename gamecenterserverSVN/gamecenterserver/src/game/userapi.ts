/**
 * Created by Administrator on 2016/5/26.
 * 提供给玩家接口
 */
declare function require(name:string);

import gameapi = require("./gameapi");
import app=require("../app");
import alipay=require("./alipay");
import {HttpRequest, PrefixInteger, g_myFrontDomain} from "./gameapi";
var qs = require('querystring');
var fs = require('fs');
export class USERINFO {
    userid:number = 0;//用户ID
    loginid:string = "";//登录名
    channelappid:number = 0;//登录到哪个游戏
    nickname:string = "";//昵称
    headico:string = "";//头像
    gold:number = 0;//金币
    logintime:number = 0;//登录时间
    lasttime:number = 0;//最后操作时间
    session:string = "";
    sign:string;//签名，计算方法同支付回调的签名方法
}
export var g_gameusers:any = {};//g_gameusers[userid]=GAMEUSERINFO
//取得用户信息，如果用户不在内存中则自动加载
export function GetGameUser(userid:number, session:string, cb:(err:Error, user:USERINFO)=>void) {
    var sess;
    if (session)sess = session.split("_");
    if (!userid)userid = parseInt(sess[0]);
    var ret:USERINFO = g_gameusers[userid];
    if (!ret) {
        if (!session) {
            cb(null, null);
            return;
        }
        //不在内存，从数据库加载，加载不记录登录日志
        gameapi.conn.query("select userid,loginid,nickname,headico,gold from t_gameuser where userid=? and session=?", [userid, session], (err, rows, fields)=> {
            if (err) {
                cb(err, null);
                return;
            }
            if (rows.length == 0) {
                cb(new Error("请重新登录!"), null);
                return;
            }
            var channelappid:number = null;
            if (sess[1])channelappid = parseInt(sess[1]);
            ret = GetUserInfo(rows[0], channelappid);
            ret.session = session;
            ret.lasttime = new Date().getTime();
            g_gameusers[ret.userid] = ret;
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


//检测并删除超时用户
export function CheckTimeout() {
    var curtime = new Date().getTime();
    for (var i in g_gameusers) {
        var info:USERINFO = g_gameusers[i];
        if (info.lasttime < curtime - 3600000)//一小时超时
        {
            delete g_gameusers[i];
        }
    }
}


//APP日志
export function AddAppLog(appid:number, channelid:number, type:number, msg:string, userid:number) {
    gameapi.conn.query("insert into t_applog (appid,channelid,type,msg,userid) values(?,?,?,?,?)", [appid, channelid, type, msg, userid], (err, rows, fields)=> {
        if (err)throw err;
    });
}
//登录日志
export function AddAppLoginLog(channelappid:number, userid:number) {
    gameapi.conn.query("select channelid,appid from t_channelapp where id=?", [channelappid], (err, rows, fields)=> {
        if (err)throw err;
        if (rows.length > 0) {
            AddAppLog(rows[0]["appid"], rows[0]["channelid"], 2, null, userid);
        }
        else {
            AddAppLog(null, null, 2, null, userid);
        }

    });
}
//注册日志
export function AddAppRegLog(channelappid:number, userid:number) {
    gameapi.conn.query("select channelid,appid from t_channelapp where id=?", [channelappid], (err, rows, fields)=> {
        if (err)throw err;
        if (rows.length > 0) {
            AddAppLog(rows[0]["appid"], rows[0]["channelid"], 4, null, userid);
        }
        else {
            AddAppLog(null, null, 4, null, userid);
        }

    });
}


//登出日志
export function AddAppLogoutLog(user:USERINFO) {
    gameapi.conn.query("select channelid,appid from t_channelapp where id=?", [user.channelappid], (err, rows, fields)=> {
        if (err)throw err;
        if (rows.length > 0) {
            AddAppLog(rows[0]["appid"], rows[0]["channelid"], 3, user.logintime.toString(), user.userid);
        }
        else {
            AddAppLog(null, null, 3, user.logintime.toString(), user.userid);
        }
    });
}

function GetUserInfo(row, channelappid:number):USERINFO {
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

export class USERREGREQ {
    loginid:string;
    pwd:string;
    nickname:string = "";//昵称，可空
    appid:number;//游戏的APPID
    channelappid:any;//在哪个渠道游戏中注册的，会通过URL参数带进来，可使用getQueryString("id")获取
}
//取得APPSECRET，appid和channelappid选填一个
export function GetAppSecret(appid:number, channelappid:number, cb:(err:Error, appsecret:string)=>void) {
    if (appid) {
        gameapi.conn.query("select a.appsecret from t_cpapp a where a.appid=?", [appid], (err, rows2, fields)=> {
            if (err) {
                cb(err, null);
                return;
            }
            var appsecret:string = null;
            if (rows2.length > 0)appsecret = rows2[0]["appsecret"];
            cb(null, appsecret);

        });
    }
    else if (channelappid) {
        gameapi.conn.query("select a.appsecret from t_cpapp a,t_channelapp b where a.appid=b.appid and b.id=?", [channelappid], (err, rows2, fields)=> {
            if (err) {
                cb(err, null);
                return;
            }
            var appsecret:string = null;
            if (rows2.length > 0)appsecret = rows2[0]["appsecret"];
            cb(null, appsecret);

        });
    }
    else cb(null, null);
}

//玩家登录后的REQ要以这个为基类
export class USERREQBASE {
    //       myuserid:number;//登录后的SPID
    mysession:string;//登录后的SESSION
}


export var UserReg:(para:USERREGREQ, ip, autoreg:boolean, cb:(user:USERINFO, err:Error)=>void)=>void;
export function InitApi() {
//玩家注册，注册后自动登录

    class USERREGRESP {
        userinfo:USERINFO;
    }
    UserReg = function (para:USERREGREQ, ip, autoreg:boolean, cb:(user:USERINFO, err:Error)=>void)//autoreg:是否是自动注册
    {
        GetAppSecret(para.appid, para.channelappid, (err, appsecret)=> {
            if (err) {
                cb(null, err);
                return;
            }
            var user = new USERINFO();
            user.channelappid = para.channelappid;
            user.loginid = para.loginid;
            user.nickname = para.nickname;
            if (!user.nickname)user.nickname = user.loginid;
            user.headico = "系统人物头像/system_head_" + (Math.floor(Math.random() * 26) + 1) + ".png";//"default.png";
            user.logintime = new Date().getTime();
            user.lasttime = user.logintime;
            user.gold = 0;
            if (!para.channelappid)para.channelappid = null;
            gameapi.conn.query("insert into t_gameuser (loginid,pwd,nickname,headico,gold,regip,regchannelapp,haspwd) values(?,?,?,?,?,?,?,?)",
                [user.loginid, para.pwd ? para.pwd : "", user.nickname, user.headico, user.gold, ip, para.channelappid, autoreg ? 0 : 1], (err, rows, fields)=> {
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

                    g_gameusers[user.userid] = user;
                    AddAppRegLog(para.channelappid, user.userid);
                    AddAppLoginLog(para.channelappid, user.userid);
                    cb(user, null);
                });
        });
    }
    app.AddSdkApi("getdefaultImgs", function (req) {
        fs.readdir('public/gamecenter/head/系统人物头像/', function (error, files) {
            var imgsPath:string[] = [];
            if (error != null) {
                req.send(null, 1, error);
                return;
            } else {
                files.forEach(function (file) {
                    imgsPath.push(gameapi.GetServerUrl("gamecenter/head/系统人物头像/" + file));
                })
                req.send(imgsPath);
            }
        });
    });
	
	
	    app.AddSdkApi("getdefaultImgssecond", function (req) {
        fs.readdir('public/gamecenter/head/systemhead/', function (error, files) {
            var imgsPath:string[] = [];
            if (error != null) {
                req.send(null, 1, error);
                return;
            } else {
                files.forEach(function (file) {
                    imgsPath.push(gameapi.GetServerUrl("gamecenter/head/systemhead/" + file));
                })
                req.send(imgsPath);
            }
        });
    });

}
