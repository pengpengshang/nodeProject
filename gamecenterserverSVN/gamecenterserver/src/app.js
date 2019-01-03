"use strict";
var gameapi_1 = require("./game/gameapi");
var path = require('path');
var serveStatic = require('serve-static');
var http = require('http');
var qs = require('querystring');
var multiparty = require('multiparty');
var fs = require('fs');
var ws = require("nodejs-websocket");
var express = require('express');
var bodyParser = require('body-parser');
var gameapi = require("./game/gameapi");
var admin = require("./game/admin");
gameapi.conn.InitServer();
/*

 var game1 = null,game2 = null , game1Ready = false , game2Ready = false;
 var server = ws.createServer(function(conn){
 conn.on("text", function (str) {
 //       console.trace(str);
 var param=JSON.parse(str);
 // var ret=gamelogic.ExecCmd(conn,param);
 // if(ret!=null)
 // {
 //     var js=JSON.stringify(ret);
 //     conn.sendText(js);
 // }


 })
 conn.on("close", function (code, reason) {
 //        gamelogic.ClientClose(conn);
 });
 conn.on("error", function (code, reason) {
 //        gamelogic.ClientErr(conn);
 });
 }).listen(9000);
 */
var ExpReq = (function () {
    function ExpReq() {
    }
    return ExpReq;
}());
var ExpRes = (function () {
    function ExpRes() {
    }
    return ExpRes;
}());
var ServerResp = (function () {
    function ServerResp() {
    }
    return ServerResp;
}());
var GameReq = (function () {
    function GameReq() {
    }
    GameReq.prototype.send = function (data, errno, message) {
        if (errno === void 0) { errno = 0; }
        if (message === void 0) { message = null; }
        var ret = new ServerResp();
        ret.errno = errno;
        ret.message = message;
        ret.data = data;
        var str = JSON.stringify(ret);
        this.res.send(str);
        ret = null;
        str = null;
        if (!!this.files) {
            for (var i in this.files) {
                var file = this.files[i];
                for (var j in file) {
                    fs.unlink(file[j].path, function (err) {
                    });
                }
            }
            this.files = null;
        }
    };
    return GameReq;
}());
exports.GameReq = GameReq;
//全部替换字符串
function ReplaceAllString(str, oldstr, newstr) {
    var arr = str.split(oldstr);
    var afterName = "";
    for (var i = 0; i < arr.length - 1; i++) {
        afterName += arr[i] + newstr;
    }
    afterName += arr[i];
    return afterName;
}
exports.ReplaceAllString = ReplaceAllString;
//取得绝对路径
function GetAbsPath(filepath) {
    var fname = ReplaceAllString(__filename, "\\", "/");
    var i = fname.lastIndexOf("/");
    var str = fname.substr(0, i + 1);
    var ret = str + filepath;
    return ret;
}
exports.GetAbsPath = GetAbsPath;
//添加http post接口
function AddSdkApi(name, cb) {
    exports.app.post("/" + name, function (req, res) {
        var form = new multiparty.Form();
        //设置编辑
        form.encoding = 'utf-8';
        //设置文件存储路径
        //        form.uploadDir = "uploads/images/";
        //设置单文件大小限制
        //        form.maxFilesSize = 2 * 1024 * 1024;
        //form.maxFields = 1000;  设置所以文件的大小总和
        form.parse(req, function (err, fields, files) {
            // console.log(files.originalFilename);
            // console.log(files.path);
            var gamereq = new GameReq();
            gamereq.req = req;
            gamereq.res = res;
            gamereq.param = JSON.parse(fields.param[0]);
            gamereq.ip = req.connection.remoteAddress;
            var idx = gamereq.ip.lastIndexOf(":");
            if (idx >= 0)
                gamereq.ip = gamereq.ip.substr(idx + 1);
            var havefile = false;
            for (var i in files) {
                havefile = true;
                break;
            }
            if (havefile)
                gamereq.files = files;
            var len = gamereq.ip.length;
            cb(gamereq);
        });
        // var gamereq=new GameReq();
        // gamereq.req=req;
        // gamereq.res=res;
        // gamereq.param=JSON.parse(req.body["param"]);
        // gamereq.ip=req.ip;
        // var len=gamereq.ip.length;
        // cb(gamereq);
    });
}
exports.AddSdkApi = AddSdkApi;
//SDK接口
exports.app = express();
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
exports.app.use(bodyParser.json({
    verify: function (req, res, buf, encoding) {
        req.rawBody = buf;
    }
}));
exports.app.use(bodyParser.urlencoded({
    extended: false,
    verify: function (req, res, buf, encoding) {
        req.rawBody = buf;
    }
}));
exports.app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
gameapi.InitApi();
// app.get("/idcode.jpg",(req,res)=>{
//     var key:string=req.query["key"];
//     res.send(gameapi.GetIdCodeImg(key));
// });
//本地路径
exports.app.use(serveStatic(GetAbsPath("../public")));
exports.app.listen(gameapi_1.g_serverport);
process.on('uncaughtException', function (error) {
    admin.isbusy = false;
    console.error(new Date());
    console.error(error.stack);
});
console.log("启动成功");
//
// var alpa:any={};
// alpa.buyer_email="abc-abc-abc---@163.com";
// alpa.buyer_id="2088002153149702";
// alpa.gmt_create="2016-06-12 15:29:56";
// alpa.gmt_payment="2016-06-12 15:29:57";
// alpa.is_total_fee_adjust="N";
// alpa.notify_id="5d3e7d9ae95ba1a602ba6a4854c9e31lei";
// alpa.notify_time="2016-06-12 15:29:57";
// alpa.notify_type="trade_status_sync";
// alpa.out_trade_no="201606121020000006";
// alpa.payment_type="1";
// alpa.price="0.01";
// alpa.quantity="1";
// alpa.seller_email="zhangfengkeji@aliyun.com";
// alpa.seller_id="2088711165280951";
// alpa.sign="2b474f683a5936dc578d42ecf1e6bbdc";
// alpa.sign_type="MD5";
// alpa.subject="sp123";
// alpa.total_fee="0.01";
// alpa.trade_no="2016061221001004700222438956";
// alpa.trade_status="TRADE_SUCCESS";
// alpa.use_coupon="N";
// HttpRequest("http://localhost:3000/alinotify",true,qs.stringify(alpa),(data,err)=> {
//     var dd=3;
// });
// var url=alipay.Pay("100002","sp123","0.01","http://zzxxybld.xicp.net/","http://zzxxybld.xicp.net:3000/aliredirect");
// var dd=3;
// HttpRequest("http://localhost:3000/aliredirect",true,"orderid=20160623144615022MGzU0GGoJ7l2crc&payid=201606231446000001&paytime=2016-06-23%2014%3A46%3A46&sign=8d6fd3c551a81bcb591ecc466852e8d1",(data,err)=>{
//     var dd=3;
// });
////////////////////////////
// var hackpath:string;//='/php/jump.php?loc_id=490_82e3bf7006acd6cec9c94743da1b6c95';
//
//
// var hackcount=0;
// function wayoshack(idx:number) {
//
//     var options;
//     if(idx==0)options= {
//         hostname: 't.ecmvs.com',
//         port: 80,
//         path: '/cl/html/fav.html',
//         method: 'GET'
//     };
//     else if(idx==1) options = {
//         hostname: 'www.youmiapp.com',
//         port: 80,
//         path: '/OpenView/OpenView26.html',
//         method: 'GET'
//     };
//     else if(idx==2) options = {
//         hostname: 'ac.o2.qq.com',
//         port: 80,
//         path: hackpath,
//         method: 'GET'
//     };
//     var req = http.request(options, function (res) {
//         if(idx==1) {
//             res.setEncoding('utf8');
//             res.on('data', function (chunk:string) {
//
//                 var p=chunk.indexOf("window.location.href");
//                 if(p>0)
//                 {
//                     p=chunk.indexOf("http",p+20);
//                     var q=chunk.indexOf("\"",p+1);
//                     var url=chunk.substring(p,q);
//                     p=url.indexOf("/php");
//                     hackpath=url.substr(p);
//                 }
//             });
//         }
//         else
//         {
//             hackcount++;
//             wayoshack(idx);
//         }
//     });
//
//     req.on('error', function (e) {
//         console.log('problem with request: ' + e.message);
//         if(idx==2) {
//             hackcount++;
//             wayoshack(idx);
//         }
//     });
//
//     req.end();
//
// }
// var thackstart=setInterval(()=>{
//     if(!hackpath)return;
//     clearInterval(thackstart);
//     for(var i=0;i<70;i++)
//     {
//         wayoshack(2);
//     }
// },1000);
//
// setInterval(()=>{
//     wayoshack(1);
// },30000);
// wayoshack(1);
//
// setInterval(()=>{
//     console.log("hackcount="+hackcount);
// },1000);
//# sourceMappingURL=app.js.map