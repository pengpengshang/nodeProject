/**
 * Created by Administrator on 2016/7/4.
 */
declare function require(name:string);
var https = require('https');
var CRYPTTO=require('crypto');
var iconv = require('iconv-lite');
var fs=require('fs');
import gameapi=require("./gameapi");
import alipay=require("./alipay");
var xml2js = require('xml2js');

export function Json2Xml(obj:any):string
{
    var str="<xml>\n";
    for(var i in obj)
    {
        str+="<"+i+"><![CDATA["+obj[i]+"]]></"+i+">\n";

    }
    str+="</xml>";
    return str;
}
export var signkey="4504409907f63e6f5edccbac1bd7b914";
export var appid="wxb7e5ca65d4186845";
export var secret="4504409907f63e6f5edccbac1bd7b914";
export var mch_id="1311716701";

export function GetSign(para:any):string
{
    var keys:string[]=[];
    for(var k in para)
    {
        keys.push(k);
    }
    keys.sort((a,b)=>
    {
        return a.localeCompare(b);
    });
    var params:string="";
    for(var i=0;i<keys.length;i++)
    {
        if(!para[keys[i]])continue;
        if(keys[i]=="sign"||keys[i]=="sign_type")continue;
        params+="&"+keys[i]+"="+para[keys[i]];
    }
    params=params.substr(1);
    var sign=alipay.MD5.sign(params,"&key="+signkey,"utf-8");
    return sign.toUpperCase();
}

export class UnifiedOrderRet
{
    return_code:string;
    return_msg:string;
    appid:string;
    mch_id:string;
    device_info:string;
    nonce_str:string;
    sign:string;
    result_code:string;
    prepay_id:string;
    trade_type:string;
}


//body:商品描述,out_trade_no:商户订单号,total_fee:总金额(分),notify_url:通知地址
export function unifiedorder(openid:string,ip:string,body:string,out_trade_no:string,total_fee:number,notify_url:string,cb:(err,ret:UnifiedOrderRet)=>void)
{
    var pdata:string;
    var para:any={
        appid:appid,
        mch_id:mch_id,
        openid:openid,
        device_info:"WEB",
        nonce_str:Math.floor(Math.random()*10000000),
        body:body,
        out_trade_no:out_trade_no,
        fee_type:"CNY",
        total_fee:(total_fee*100).toFixed(0),
        spbill_create_ip:ip,
        notify_url:notify_url,
        trade_type:"JSAPI",

    };
    var sign=GetSign(para);
    para.sign=sign;
    var xmlstr=Json2Xml(para);
    gameapi.HttpsRequest("https://api.mch.weixin.qq.com/pay/unifiedorder",true,xmlstr,(resp,err)=>{
        if(err)
        {
            cb(err,null);
            return;
        }

        var parser = new xml2js.Parser();   //xml -> json
        var json =  parser.parseString(resp,function (err, result) {
            var jsonobj=result.xml;
            var retobj:UnifiedOrderRet=new UnifiedOrderRet();
            for(var i in jsonobj)
            {
                var obj=jsonobj[i];
                if(obj.length==0)
                {
                    retobj[i]=null;
                }
                else retobj[i]=obj[0];
            }
            var sign2=GetSign(retobj);
            gameapi.conn.query("insert into t_paylog (param,success,ispost) values(?,?,2)",["send:"+xmlstr+"\n"+"recv:"+resp,sign2 == retobj.sign],(err, rows, fields)=> {
                if (err) {
                    cb(err, retobj);
                    throw err;
                }
                var logid=rows.insertId;
                if (sign2 == retobj.sign) {

                    gameapi.conn.query("update t_gspay set trade_no=?,logid=? where payid=?", [retobj.prepay_id,logid, out_trade_no], (err, rows, fields)=> {
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


//查询订单状态
class OrderQueryRet
{
    return_code:string;//返回状态码
    return_msg:string;//返回信息
    appid:string;//公众账号ID
    mch_id:string;//商户号
    nonce_str:string;//随机字符串
    sign:string;//签名
    result_code:string;//业务结果
    err_code:string;//错误代码
    err_code_des:string;//错误代码描述
    device_info:string;//设备号
    openid:string;//用户标识
    is_subscribe:string;//是否关注公众账号
    trade_type:string;//交易类型
    trade_state:string;//交易状态
    bank_type:string;//付款银行
    total_fee:string;//订单金额
    settlement_total_fee:string;//应结订单金额
    fee_type:string;//货币种类
    cash_fee:string;//现金支付金额
    cash_fee_type:string;//现金支付货币类型
    coupon_fee:string;//代金券金额
    coupon_count:string;//代金券使用数量
    transaction_id:string;//微信支付订单号
    out_trade_no:string;//商户订单号
    attach:string;//附加数据
    time_end:string;//支付完成时间
    trade_state_desc:string;//交易状态描述
}

export function  orderquery(out_trade_no:string,cb:(err:Error,ret:OrderQueryRet,logid:number)=>void)
{
    var para:any={
        appid:appid,
        mch_id:mch_id,
        out_trade_no:out_trade_no,
        nonce_str:(Math.random()*100000000).toFixed(0),
    };
    para.sign=GetSign(para);
    var xml=Json2Xml(para);
    gameapi.HttpsRequest("https://api.mch.weixin.qq.com/pay/orderquery",true,xml,(resp,err)=>{
        if(err)
        {
            cb(err,null,null);
            return;
        }
        gameapi.conn.query("insert into t_paylog (param,success,ispost) values (?,?,2)",["send:"+xml+"\nrecv:"+resp,1],(err, rows, fields)=> {
            if (err) {
                cb(err, null,null);
                return;
            }
            var logid:number=rows.insertId;
            gameapi.XmlToJson(resp,(err,retobj)=>{
                var sign=GetSign(retobj);
                if(sign!=retobj.sign)
                {
                    cb(new Error("返回的签名错误"),retobj,logid);
                    return;
                }
                cb(null,retobj,logid);
            });
        });


    });
}