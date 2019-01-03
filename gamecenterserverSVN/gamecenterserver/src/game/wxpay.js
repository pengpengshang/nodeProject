"use strict";
var https = require('https');
var CRYPTTO = require('crypto');
var iconv = require('iconv-lite');
var fs = require('fs');
var gameapi = require("./gameapi");
var alipay = require("./alipay");
var xml2js = require('xml2js');
function Json2Xml(obj) {
    var str = "<xml>\n";
    for (var i in obj) {
        str += "<" + i + "><![CDATA[" + obj[i] + "]]></" + i + ">\n";
    }
    str += "</xml>";
    return str;
}
exports.Json2Xml = Json2Xml;
exports.signkey = "4504409907f63e6f5edccbac1bd7b914";
exports.appid = "wxb7e5ca65d4186845";
exports.secret = "4504409907f63e6f5edccbac1bd7b914";
exports.mch_id = "1311716701";
function GetSign(para) {
    var keys = [];
    for (var k in para) {
        keys.push(k);
    }
    keys.sort(function (a, b) {
        return a.localeCompare(b);
    });
    var params = "";
    for (var i = 0; i < keys.length; i++) {
        if (!para[keys[i]])
            continue;
        if (keys[i] == "sign" || keys[i] == "sign_type")
            continue;
        params += "&" + keys[i] + "=" + para[keys[i]];
    }
    params = params.substr(1);
    var sign = alipay.MD5.sign(params, "&key=" + exports.signkey, "utf-8");
    return sign.toUpperCase();
}
exports.GetSign = GetSign;
var UnifiedOrderRet = (function () {
    function UnifiedOrderRet() {
    }
    return UnifiedOrderRet;
}());
exports.UnifiedOrderRet = UnifiedOrderRet;
//body:商品描述,out_trade_no:商户订单号,total_fee:总金额(分),notify_url:通知地址
function unifiedorder(openid, ip, body, out_trade_no, total_fee, notify_url, cb) {
    var pdata;
    var para = {
        appid: exports.appid,
        mch_id: exports.mch_id,
        openid: openid,
        device_info: "WEB",
        nonce_str: Math.floor(Math.random() * 10000000),
        body: body,
        out_trade_no: out_trade_no,
        fee_type: "CNY",
        total_fee: (total_fee * 100).toFixed(0),
        spbill_create_ip: ip,
        notify_url: notify_url,
        trade_type: "JSAPI"
    };
    var sign = GetSign(para);
    para.sign = sign;
    var xmlstr = Json2Xml(para);
    gameapi.HttpsRequest("https://api.mch.weixin.qq.com/pay/unifiedorder", true, xmlstr, function (resp, err) {
        if (err) {
            cb(err, null);
            return;
        }
        var parser = new xml2js.Parser(); //xml -> json
        var json = parser.parseString(resp, function (err, result) {
            var jsonobj = result.xml;
            var retobj = new UnifiedOrderRet();
            for (var i in jsonobj) {
                var obj = jsonobj[i];
                if (obj.length == 0) {
                    retobj[i] = null;
                }
                else
                    retobj[i] = obj[0];
            }
            var sign2 = GetSign(retobj);
            gameapi.conn.query("insert into t_paylog (param,success,ispost) values(?,?,2)", ["send:" + xmlstr + "\n" + "recv:" + resp, sign2 == retobj.sign], function (err, rows, fields) {
                if (err) {
                    cb(err, retobj);
                    throw err;
                }
                var logid = rows.insertId;
                if (sign2 == retobj.sign) {
                    gameapi.conn.query("update t_gspay set trade_no=?,logid=? where payid=?", [retobj.prepay_id, logid, out_trade_no], function (err, rows, fields) {
                        if (err) {
                            cb(err, retobj);
                            throw err;
                        }
                        cb(null, retobj);
                    });
                }
                else {
                    cb(new Error("返回的签名验证失败!"), null);
                }
            });
        });
    });
}
exports.unifiedorder = unifiedorder;
//查询订单状态
var OrderQueryRet = (function () {
    function OrderQueryRet() {
    }
    return OrderQueryRet;
}());
function orderquery(out_trade_no, cb) {
    var para = {
        appid: exports.appid,
        mch_id: exports.mch_id,
        out_trade_no: out_trade_no,
        nonce_str: (Math.random() * 100000000).toFixed(0)
    };
    para.sign = GetSign(para);
    var xml = Json2Xml(para);
    gameapi.HttpsRequest("https://api.mch.weixin.qq.com/pay/orderquery", true, xml, function (resp, err) {
        if (err) {
            cb(err, null, null);
            return;
        }
        gameapi.conn.query("insert into t_paylog (param,success,ispost) values (?,?,2)", ["send:" + xml + "\nrecv:" + resp, 1], function (err, rows, fields) {
            if (err) {
                cb(err, null, null);
                return;
            }
            var logid = rows.insertId;
            gameapi.XmlToJson(resp, function (err, retobj) {
                var sign = GetSign(retobj);
                if (sign != retobj.sign) {
                    cb(new Error("返回的签名错误"), retobj, logid);
                    return;
                }
                cb(null, retobj, logid);
            });
        });
    });
}
exports.orderquery = orderquery;
//# sourceMappingURL=wxpay.js.map