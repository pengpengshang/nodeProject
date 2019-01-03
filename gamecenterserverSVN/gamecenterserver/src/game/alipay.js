"use strict";
var gameapi_1 = require("./gameapi");
var https = require('https');
var CRYPTTO = require('crypto');
var iconv = require('iconv-lite');
var fs = require('fs');
function md5Hex(data) {
    var md5sum = CRYPTTO.createHash('md5');
    md5sum.update(data);
    var str = md5sum.digest('hex');
    return str;
}
exports.md5Hex = md5Hex;
function getContentBytes(str, input_charset) {
    var buf = iconv.encode(str, input_charset);
    return buf;
}
/**
 * 功能：支付宝MD5签名处理核心文件，不需要修改
 * 版本：3.3
 * 修改日期：2012-08-17
 * 说明：
 * 以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
 * 该代码仅供学习和研究支付宝接口使用，只是提供一个
 * */
var MD5 = (function () {
    function MD5() {
    }
    /**
     * 签名字符串
     * @param text 需要签名的字符串
     * @param key 密钥
     * @param input_charset 编码格式
     * @return 签名结果
     */
    MD5.sign = function (text, key, input_charset) {
        text = text + key;
        return md5Hex(getContentBytes(text, input_charset));
    };
    /**
     * 签名字符串
     * @param text 需要签名的字符串
     * @param sign 签名结果
     * @param key 密钥
     * @param input_charset 编码格式
     * @return 签名结果
     */
    MD5.verify = function (text, sign, key, input_charset) {
        text = text + key;
        var mysign = md5Hex(getContentBytes(text, input_charset));
        if (mysign == sign) {
            return true;
        }
        else {
            return false;
        }
    };
    return MD5;
}());
exports.MD5 = MD5;
//
// /* *
//  *类名：AlipayConfig
//  *功能：基础配置类
//  *详细：设置帐户有关信息及返回路径
//  *版本：3.4
//  *修改日期：2016-03-08
//  *说明：
//  *以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
//  *该代码仅供学习和研究支付宝接口使用，只是提供一个参考。
//  */
// export class AlipayConfig
// {
// //↓↓↓↓↓↓↓↓↓↓请在这里配置您的基本信息↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
//
//     // 合作身份者ID，签约账号，以2088开头由16位纯数字组成的字符串，查看地址：https://b.alipay.com/order/pidAndKey.htm
//     public static partner = "2088711165280951";
//
//     // 收款支付宝账号，以2088开头由16位纯数字组成的字符串，一般情况下收款账号就是签约账号
//     public static seller_id = "2088711165280951";
//
//     // MD5密钥，安全检验码，由数字和字母组成的32位字符串，查看地址：https://b.alipay.com/order/pidAndKey.htm
//     public static key = "ll5qmw9eva4wds367ip2nuy0nlzq11yp";
//
//
//     // 服务器异步通知页面路径  需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
//     public static notify_url = "http://商户网址/alipay.wap.create.direct.pay.by.user-JAVA-UTF-8/notify_url.jsp";
//
//     // 页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
//     public static return_url = "http://商户网址/alipay.wap.create.direct.pay.by.user-JAVA-UTF-8/return_url.jsp";
//
//     // 签名方式
//     public static sign_type = "MD5";
//
//     // 调试用，创建TXT日志文件夹路径，见AlipayCore.java类中的logResult(String sWord)打印方法。
//     public static log_path = "C:\\";
//
//     // 字符编码格式 目前支持utf-8
//     public static input_charset = "utf-8";
//
//     // 支付类型 ，无需修改
//     public static payment_type = "1";
//
//     // 调用的接口名，无需修改
//     public static service = "alipay.wap.create.direct.pay.by.user";
//
//
// //↑↑↑↑↑↑↑↑↑↑请在这里配置您的基本信息↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
// }
//
//
//
//
// export class AlipayCore
// {
//     /**
//      * 除去数组中的空值和签名参数
//      * @param sArray 签名参数组
//      * @return 去掉空值与签名参数后的新签名参数组
//      */
//     public static paraFilter(sArray:any):any
//     {
//
//         var result = {};
//
//         if (sArray == null || sArray.size() <= 0)
//         {
//             return result;
//         }
//
//         for (var key in sArray) {
//             var value:string = sArray[key];
//             if (value == null || value=="" || key.toLowerCase()=="sign"
//                 || key.toLowerCase()=="sign_type") {
//                 continue;
//             }
//             result[key]= value;
//         }
//
//         return result;
//     }
//
//     /**
//      * 把数组所有元素排序，并按照“参数=参数值”的模式用“&”字符拼接成字符串
//      * @param params 需要排序并参与字符拼接的参数组
//      * @return 拼接后字符串
//      */
//     public static  createLinkString( params:any):string {
//
//         var keys:string[]=[];
//         for(var k in params)
//         {
//             keys.push(k);
//         }
//         keys.sort((a,b)=>{
//             return a.localeCompare(b);
//         })
//
//         var prestr = "";
//
//         for (var i = 0; i < keys.length; i++) {
//             var key = keys[i];
//             var value = params[key];
//
//             if (i == keys.length - 1) {//拼接时，不包括最后一个&字符
//                 prestr = prestr + key + "=" + value;
//             } else {
//                 prestr = prestr + key + "=" + value + "&";
//             }
//         }
//
//         return prestr;
//     }
//
//     /**
//      * 写日志，方便测试（看网站需求，也可以改成把记录存入数据库）
//      * @param sWord 要写入日志里的文本内容
//      */
//     public static logResult(sWord:string) {
//         console.log(sWord);
//
//     }
//
//     /**
//      * 生成文件摘要
//      * @param strFilePath 文件路径
//      * @param file_digest_type 摘要算法
//      * @return 文件摘要结果
//      */
//     public static  getAbstract( strFilePath:string, file_digest_type:string):string
//     {
//         var fdata=fs.readFileSync(strFilePath, "binary");
//
//
//         if(file_digest_type="MD5"){
//             return AlipayCore.md5(fdata);
//         }
//         else if(file_digest_type="SHA") {
//             return AlipayCore.sha256(fdata);
//         }
//         else {
//             return "";
//         }
//     }
//     public static md5(str) {
//         var md5sum = CRYPTTO.createHash('md5');
//         md5sum.update(str);
//         str = md5sum.digest('hex');
//         return str;
//     }
//     public static sha256(str) {
//         var md5sum = CRYPTTO.createHash('sha256');
//         md5sum.update(str);
//         str = md5sum.digest('hex');
//         return str;
//     }
// }
//
// /* *
//  *类名：AlipayNotify
//  *功能：支付宝通知处理类
//  *详细：处理支付宝各接口通知返回
//  *版本：3.3
//  *日期：2012-08-17
//  *说明：
//  *以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
//  *该代码仅供学习和研究支付宝接口使用，只是提供一个参考
//
//  *************************注意*************************
//  *调试通知返回时，可查看或改写log日志的写入TXT里的数据，来检查通知返回是否正常
//  */
// export class AlipayNotify
// {
//     /**
//      * 支付宝消息验证地址
//      */
//     private static  HTTPS_VERIFY_URL = "https://mapi.alipay.com/gateway.do?service=notify_verify&";
//
//     /**
//      * 验证消息是否是支付宝发出的合法消息
//      * @param params 通知返回来的参数数组
//      * @return 验证结果
//      */
//     public static verify( params:any):boolean
//     {
//
//         //判断responsetTxt是否为true，isSign是否为true
//         //responsetTxt的结果不是true，与服务器设置问题、合作身份者ID、notify_id一分钟失效有关
//         //isSign不是true，与安全校验码、请求时的参数格式（如：带自定义参数等）、编码格式有关
//         var responseTxt = "false";
//         if(!!params["notify_id"])
//         {
//             var notify_id = params["notify_id"];
//             responseTxt = AlipayNotify.verifyResponse(notify_id);
//         }
//         var sign = "";
//         if(!!params["sign"]) {sign = params["sign"];}
//         var isSign = AlipayNotify.getSignVeryfy(params, sign);
//
//         //写日志记录（若要调试，请取消下面两行注释）
//         //String sWord = "responseTxt=" + responseTxt + "\n isSign=" + isSign + "\n 返回回来的参数：" + AlipayCore.createLinkString(params);
//         //AlipayCore.logResult(sWord);
//
//         if (isSign && responseTxt=="true")
//         {
//             return true;
//         }
//         else
//         {
//             return false;
//         }
//     }
//
//     /**
//      * 根据反馈回来的信息，生成签名结果
//      * @param Params 通知返回来的参数数组
//      * @param sign 比对的签名结果
//      * @return 生成的签名结果
//      */
//     private static getSignVeryfy(Params:any, sign:string):boolean {
//         //过滤空值、sign与sign_type参数
//         var sParaNew = AlipayCore.paraFilter(Params);
//         //获取待签名字符串
//         var preSignStr = AlipayCore.createLinkString(sParaNew);
//         //获得签名验证结果
//         var isSign = false;
//         if(AlipayConfig.sign_type=="MD5" ) {
//             isSign = AlipayNotify.md5verify(preSignStr, sign, AlipayConfig.key, AlipayConfig.input_charset);
//         }
//         return isSign;
//     }
//     /**
//      * 签名字符串
//      * @param text 需要签名的字符串
//      * @param sign 签名结果
//      * @param key 密钥
//      * @param input_charset 编码格式
//      * @return 签名结果
//      */
//     public static md5verify(text:string, sign:string, key:string, input_charset:string):boolean
//     {
//         text = text + key;
//         var mysign = AlipayCore.md5(text);
//         if(mysign.equals(sign))
//         {
//             return true;
//         }
//         else
//         {
//             return false;
//         }
//     }
//     /**
//      * 获取远程服务器ATN结果,验证返回URL
//      * @param notify_id 通知校验ID
//      * @return 服务器ATN结果
//      * 验证结果集：
//      * invalid命令参数不对 出现这个错误，请检测返回处理中partner和key是否为空
//      * true 返回正确信息
//      * false 请检查防火墙或者是服务器阻止端口问题以及验证时间是否超过一分钟
//      */
//     private static verifyResponse( notify_id:string):string {
//         //获取远程服务器ATN结果，验证是否是支付宝服务器发来的请求
//
//         var partner = AlipayConfig.partner;
//         var veryfy_url = AlipayNotify.HTTPS_VERIFY_URL + "partner=" + partner + "&notify_id=" + notify_id;
//
//         return AlipayNotify.checkUrl(veryfy_url);
//     }
//
//     /**
//      * 获取远程服务器ATN结果
//      * @param urlvalue 指定URL路径地址
//      * @return 服务器ATN结果
//      * 验证结果集：
//      * invalid命令参数不对 出现这个错误，请检测返回处理中partner和key是否为空
//      * true 返回正确信息
//      * false 请检查防火墙或者是服务器阻止端口问题以及验证时间是否超过一分钟
//      */
//     private static  checkUrl(urlvalue:string):string {
//         var inputLine = "";
//         //
//         // try {
//         //     var url = new URL(urlvalue);
//         //     HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
//         //     BufferedReader in = new BufferedReader(new InputStreamReader(urlConnection
//         //         .getInputStream()));
//         //     inputLine = in.readLine().toString();
//         // } catch (Exception e) {
//         //     e.printStackTrace();
//         //     inputLine = "";
//         // }
//
//         return inputLine;
//     }
//
//
// }
//
//
//     /* *
//      *类名：AlipaySubmit
//      *功能：支付宝各接口请求提交类
//      *详细：构造支付宝各接口表单HTML文本，获取远程HTTP数据
//      *版本：3.3
//      *日期：2012-08-13
//      *说明：
//      *以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
//      *该代码仅供学习和研究支付宝接口使用，只是提供一个参考。
//      */
//
// export class AlipaySubmit
// {
//
//     /**
//      * 支付宝提供给商户的服务接入网关URL(新)
//      */
//     private static  ALIPAY_GATEWAY_NEW = "https://mapi.alipay.com/gateway.do?";
//
//     /**
//      * 生成签名结果
//      * @param sPara 要签名的数组
//      * @return 签名结果字符串
//      */
//     public static  buildRequestMysign(sPara):string
//     {
//         var prestr = AlipayCore.createLinkString(sPara); //把数组所有元素，按照“参数=参数值”的模式用“&”字符拼接成字符串
//         var mysign = "";
//         if(AlipayConfig.sign_type=="MD5" ) {
//         mysign = MD5.sign(prestr, AlipayConfig.key, AlipayConfig.input_charset);
//     }
//     return mysign;
//     }
//
//     /**
//      * 生成要请求给支付宝的参数数组
//      * @param sParaTemp 请求前的参数数组
//      * @return 要请求的参数数组
//      */
//     private static buildRequestPara( sParaTemp):any
//     {
//         //除去数组中的空值和签名参数
//         var sPara = AlipayCore.paraFilter(sParaTemp);
//         //生成签名结果
//         var mysign = AlipaySubmit.buildRequestMysign(sPara);
//
//         //签名结果与签名方式加入请求提交参数组中
//         sPara["sign"]=mysign;
//         sPara["sign_type"]=AlipayConfig.sign_type;
//
//         return sPara;
//     }
//
//     /**
//      * 建立请求，以表单HTML形式构造（默认）
//      * @param sParaTemp 请求参数数组
//      * @param strMethod 提交方式。两个值可选：post、get
//      * @param strButtonName 确认按钮显示文字
//      * @return 提交表单HTML文本
//      */
//     public static buildRequest(sParaTemp, strMethod:string,  strButtonName:string):String
//     {
//         //待请求参数数组
//         var sPara = AlipaySubmit.buildRequestPara(sParaTemp);
//         var keys =[];
//         for(var  k in sPara)
//         {
//             keys.push(k);
//         }
//
//
//         var sbHtml = "";
//
//         sbHtml+="<form id=\"alipaysubmit\" name=\"alipaysubmit\" action=\"" + AlipaySubmit.ALIPAY_GATEWAY_NEW
//             + "_input_charset=" + AlipayConfig.input_charset + "\" method=\"" + strMethod
//             + "\">";
//
//         for (var i = 0; i < keys.length; i++) {
//             var name =  keys[i];
//             var value = sPara[name];
//
//             sbHtml+="<input type=\"hidden\" name=\"" + name + "\" value=\"" + value + "\"/>";
//         }
//
//         //submit按钮控件请不要含有name属性
//         sbHtml+="<input type=\"submit\" value=\"" + strButtonName + "\" style=\"display:none;\"></form>";
//         sbHtml+="<script>document.forms['alipaysubmit'].submit();</script>";
//
//         return sbHtml
//     }
//
//
//
//     /**
//      * 用于防钓鱼，调用接口query_timestamp来获取时间戳的处理函数
//      * 注意：远程解析XML出错，与服务器是否支持SSL等配置有关
//      * @return 时间戳字符串
//      * @throws IOException
//      * @throws DocumentException
//      * @throws MalformedURLException
//      */
//     public static query_timestamp():string
//     {
//         return "";
//         //
//         // //构造访问query_timestamp接口的URL串
//         // var strUrl = ALIPAY_GATEWAY_NEW + "service=query_timestamp&partner=" + AlipayConfig.partner + "&_input_charset" +AlipayConfig.input_charset;
//         // var result = new StringBuffer();
//         //
//         // SAXReader reader = new SAXReader();
//         // Document doc = reader.read(new URL(strUrl).openStream());
//         //
//         // List<Node> nodeList = doc.selectNodes("//alipay/*");
//         //
//         // for (Node node : nodeList) {
//         //     // 截取部分不需要解析的信息
//         //     if (node.getName().equals("is_success") && node.getText().equals("T")) {
//         //         // 判断是否有成功标示
//         //         List<Node> nodeList1 = doc.selectNodes("//response/timestamp/*");
//         //         for (Node node1 : nodeList1) {
//         //             result.append(node1.getText());
//         //         }
//         //     }
//         // }
//         //
//         // return result.toString();
//     }
// }
var partner = "2088711165280951";
var md5key = "ll5qmw9eva4wds367ip2nuy0nlzq11yp";
var PAYPARA = (function () {
    function PAYPARA() {
        this._input_charset = "utf-8";
        this.notify_url = "http://" + gameapi_1.g_myServerDomain + ":" + gameapi_1.g_serverport + "/alinotify"; //支付宝服务器主动通知商户网站里指定的页面http路径
        this.out_trade_no = ""; //支付宝合作商户网站唯一订单号。
        this.partner = partner; //签约的支付宝账号对应的支付宝唯一用户号。以2088开头的16位纯数字组成。
        this.seller_id = partner; //卖家支付宝账号对应的支付宝唯一用户号。以2088开头的纯16位数字
        this.payment_type = 1;
        this.return_url = ""; //支付宝处理完请求后，当前页面自动跳转到商户网站里指定页面的http路径。
        this.service = "alipay.wap.create.direct.pay.by.user"; //接口名称
        this.subject = ""; //商品的标题/交易标题/订单标题/订单关键字等。该参数最长为128个汉字。
        this.total_fee = ""; //该笔订单的资金总额，单位为RMB-Yuan。取值范围为[0.01，100000000.00]，精确到小数点后两位。
        this.show_url = ""; //收银台页面上，商品展示的超链接
    }
    return PAYPARA;
}());
function GetSign(para, key) {
    if (key === void 0) { key = md5key; }
    var keys = [];
    for (var k in para) {
        keys.push(k);
    }
    keys.sort(function (a, b) {
        return a.localeCompare(b);
    });
    var params = "";
    for (var i = 0; i < keys.length; i++) {
        var val = para[keys[i]];
        if (val === null || val === undefined || val === "")
            continue;
        if (keys[i] == "sign" || keys[i] == "sign_type")
            continue;
        params += "&" + keys[i] + "=" + para[keys[i]];
    }
    params = params.substr(1);
    var sign = MD5.sign(params, key, "utf-8");
    return sign;
}
exports.GetSign = GetSign;
function CheckNotifyID(notify_id, cb) {
    //    var str="http://notify.alipay.com/trade/notify_query.do?partner="+ partner+"&notify_id="+notify_id;
    var str = "https://mapi.alipay.com/gateway.do?service=notify_verify&partner=" + partner + "&notify_id=" + notify_id;
    gameapi_1.HttpsRequest(str, false, null, function (data) {
        data = data.trim();
        cb(data == "true");
    });
}
exports.CheckNotifyID = CheckNotifyID;
//返回支付宝链接
function Pay(out_trade_no, subject, total_fee, show_url, return_url, notify_url) {
    var sign; //签名
    var sign_type = "MD5"; //DSA、RSA、MD5三个值可选，必须大写。
    var para = new PAYPARA();
    para.out_trade_no = out_trade_no;
    para.subject = subject;
    para.total_fee = total_fee;
    para.show_url = show_url;
    para.return_url = return_url;
    if (notify_url)
        para.notify_url = notify_url;
    var keys = [];
    var params = "";
    sign = GetSign(para);
    para.sign = sign;
    para.sign_type = sign_type;
    keys = [];
    for (var k in para) {
        keys.push(k);
    }
    keys.sort(function (a, b) {
        return a.localeCompare(b);
    });
    params = "";
    for (var i = 0; i < keys.length; i++) {
        if (!para[keys[i]])
            continue;
        params += "&" + keys[i] + "=" + encodeURIComponent(para[keys[i]]);
    }
    params = params.substr(1);
    var url = "https://mapi.alipay.com/gateway.do?" + params;
    return url;
}
exports.Pay = Pay;
var ALINOTIFY = (function () {
    function ALINOTIFY() {
    }
    return ALINOTIFY;
}());
exports.ALINOTIFY = ALINOTIFY;
//# sourceMappingURL=alipay.js.map