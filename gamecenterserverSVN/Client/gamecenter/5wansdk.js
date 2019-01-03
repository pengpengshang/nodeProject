///<reference path='jquery.d.ts' />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utils;
(function (utils) {
    function ReplaceAllString(str, oldstr, newstr) {
        var arr = str.split(oldstr);
        var afterName = "";
        for (var i = 0; i < arr.length - 1; i++) {
            afterName += arr[i] + newstr;
        }
        afterName += arr[i];
        return afterName;
    }
    utils.ReplaceAllString = ReplaceAllString;
    function __prefix(num, val) {
        return (new Array(num).join('0') + val).slice(-num);
    }
    utils.__prefix = __prefix;
    Date.prototype.toLocaleDateString = function () {
        return this.getFullYear() + "-" + __prefix(2, this.getMonth() + 1) + "-" + __prefix(2, this.getDate());
    };
    Date.prototype.toLocaleString = function () {
        return this.getFullYear() + "-" + __prefix(2, this.getMonth() + 1) + "-" + __prefix(2, this.getDate())
            + " " + __prefix(2, this.getHours()) + ":" + __prefix(2, this.getMinutes()) + ":" + __prefix(2, this.getSeconds());
    };
    function GetHost() {
        //	return "5wanpk.com";
        //	return "cbttpj.vicp.net"; 
        var str = window.location.host;
        var i = str.indexOf(":");
        if (i >= 0)
            str = str.substr(0, i);
        return str;
    }
    utils.GetHost = GetHost;
    function GetHostPort() {
        var str = window.location.host;
        var i = str.indexOf(":");
        if (i >= 0)
            return str.substr(i + 1);
        return "80";
    }
    utils.GetHostPort = GetHostPort;
    var g_ishttps = false;
    if (window.location.href.substr(0, 8) == "https://") {
        g_ishttps = true;
    }
    if (g_ishttps) {
        //	g_fronturl = "https://" + GetHost() + ":" + GetHostPort() + "/";
        //	g_serverurl = "https://" + GetHost() + ":7037/";
        //	g_pkserverurl = "wss://" + GetHost() + ":7038/";
        utils.g_fronturl = "https://5wanpk.com/open/";
        utils.g_serverurl = "https://5wanpk.com:7037/";
        utils.g_pkserverurl = "wss://5wanpk.com:7038/";
    }
    else {
        utils.g_fronturl = "http://" + GetHost() + ":" + GetHostPort() + "/";
        utils.g_serverurl = "http://" + GetHost() + ":7031/";
        utils.g_pkserverurl = "ws://" + GetHost() + ":7032/";
    }
    function setCookie(name, objvalue) {
        name = "5WANSDK_" + name;
        var value = JSON.stringify(objvalue);
        localStorage.setItem(name, value);
        //	var exp = new Date();
        //	exp.setTime(exp.getTime() + 1 * 60 * 60 * 1000);//有效期1小时 
        //	document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toUTCString();
    }
    utils.setCookie = setCookie;
    function getCookie(name) {
        name = "5WANSDK_" + name;
        var str = localStorage.getItem(name);
        if (str)
            return JSON.parse(decodeURIComponent(str));
        else
            return null;
        //	var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        //	if (arr != null)
        //		return JSON.parse(decodeURIComponent(arr[2]));
        //	return null;
    }
    utils.getCookie = getCookie;
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return decodeURI(r[2]);
        return null;
    }
    utils.getQueryString = getQueryString;
    function getRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURIComponent(ReplaceAllString(strs[i].split("=")[1], "+", "%20"));
            }
        }
        return theRequest;
    }
    utils.getRequest = getRequest;
    function getFileUrl(fileInput) {
        var url = window.URL.createObjectURL(fileInput.files.item(0));
        return url;
    }
    utils.getFileUrl = getFileUrl;
    function optionSelect(select, str) {
        var se = select;
        var flag = 0;
        for (var i = 0; i < se.children.length; i++) {
            if (str === se.children[i].textContent) {
                flag = i;
                se.selectedIndex = flag;
                break;
            }
            else {
                continue;
            }
        }
    }
    utils.optionSelect = optionSelect;
    function deepCopy(source) {
        if (source == null)
            return null;
        var ty = typeof (source);
        var result;
        if (source instanceof Array)
            result = [];
        else
            result = {};
        for (var key in source) {
            var keytype = typeof source[key];
            if (keytype == "object") {
                result[key] = deepCopy(source[key]);
            }
            else {
                result[key] = source[key];
            }
        }
        return result;
    }
    utils.deepCopy = deepCopy;
    //使用0123456789数字图片创建img，n:一个数字,0-9，minus:是否有负号，offsetX,offsetY：数字所在偏移
    function CreateNumberImg(imgurl, num, minus, cb) {
        var img = document.createElement("img");
        img.style.position = "absolute";
        var nblock = minus ? 11 : 10;
        img.onload = function (ev) {
            var width = img.width;
            var height = img.height;
            var dwidth = width / nblock;
            var offsetX;
            var offsetY;
            var str;
            if (num == "-") {
                if (minus) {
                    offsetX = 0;
                    offsetY = 0;
                    str = "rect(0px " + dwidth + "px " + height + "px " + 0 + "px)";
                }
                else {
                    cb(null, 0, 0);
                    return;
                }
            }
            else {
                var n = parseInt(num);
                if (minus)
                    n++;
                offsetX = dwidth * n;
                offsetY = 0;
                str = "rect(0px " + (dwidth * (n + 1)) + "px " + height + "px " + (dwidth * n) + "px)";
            }
            img.style.clip = str;
            cb(img, offsetX, offsetY);
        };
        img.src = imgurl;
    }
    utils.CreateNumberImg = CreateNumberImg;
    //通过0-9数字图片创建一组img填充到div里
    function CreateNumberImgs(imgurl, num, numwidth, minus, parent) {
        for (var i = 0; i < num.length; i++) {
            function fun(i) {
                CreateNumberImg(imgurl, num.substr(i, 1), minus, function (img, offsetx, offsety) {
                    img.style.left = (i * numwidth - offsetx) + "px";
                    img.style.top = offsety + "px";
                    parent.appendChild(img);
                });
            }
            fun(i);
        }
    }
    utils.CreateNumberImgs = CreateNumberImgs;
    //数组去重
    function removeRepeat(arrays) {
        var res = [];
        var json = {};
        if (arrays != null) {
            for (var i = 0; i < arrays.length; i++) {
                if (!json[arrays[i]]) {
                    res.push(arrays[i]);
                    json[arrays[i]] = 1;
                }
            }
        }
        return res;
    }
    utils.removeRepeat = removeRepeat;
    //利用sessionStorage做一个缓存机制
    function setStorage(key, value, flags) {
        var jsonObj = JSON.stringify(value);
        if (flags == "sessionStorage") {
            sessionStorage.setItem(key, jsonObj);
        }
        else {
            localStorage.setItem(key, jsonObj);
        }
    }
    utils.setStorage = setStorage;
    //读取sessionStorage项
    function getStorage(key, flags) {
        var jsonObjs;
        if (flags == "sessionStorage") {
            jsonObjs = sessionStorage.getItem(key);
        }
        else {
            jsonObjs = localStorage.getItem(key);
        }
        var obj = JSON.parse(jsonObjs);
        return obj;
    }
    utils.getStorage = getStorage;
    //移除sessionStorage项
    function removeStorag(key, flags) {
        if (flags == "sessionStorage") {
            sessionStorage.removeItem(key);
        }
        else {
            localStorage.removeItem(key);
        }
    }
    utils.removeStorag = removeStorag;
    //清空sessionStorage项
    function clearSessionStorag(flags) {
        if (flags == "sessionStorage") {
            sessionStorage.clear();
        }
        else {
            localStorage.clear();
        }
    }
    utils.clearSessionStorag = clearSessionStorag;
    function DotString(str, maxlen) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255)
                len += 2;
            else
                len++;
            if (len > maxlen) {
                return str.substr(0, i) + "...";
            }
        }
        return str;
    }
    utils.DotString = DotString;
    function getBytesLength(str) {
        return str.replace(/[^\x00-\xff]/gi, "--").length;
    }
    utils.getBytesLength = getBytesLength;
    //获取浏览器名称 
    function getbrowser() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) {
            return "Opera";
        }
        ; //判断是否Opera浏览器
        if (userAgent.indexOf("Firefox") > -1) {
            return "FF";
        } //判断是否Firefox浏览器
        if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        } //判断是否Safari浏览器
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            return "IE";
        }
        ; //判断是否IE浏览器
    }
    utils.getbrowser = getbrowser;
    function pageselectCallback(page_index, jq, showtbid, hidetbid, hidetrid, mdata, per_page) {
        $(showtbid).find("*").remove();
        var num_entries = mdata.length;
        var items_per_page = per_page;
        var max_elem = Math.min((page_index + 1) * items_per_page, num_entries);
        for (var j = page_index * items_per_page; j < max_elem; j++) {
            var new_content = $("#" + hidetbid + " tr:eq('" + (j + 1) + "')").clone(true, true);
            $(showtbid).append(new_content);
        }
        return false;
    }
    utils.pageselectCallback = pageselectCallback;
    function isMobileBrowser() {
        var UA = navigator.userAgent, isAndroid = /android|adr/gi.test(UA), isIos = /iphone|ipod|ipad/gi.test(UA) && !isAndroid, // 据说某些国产机的UA会同时包含 android iphone 字符
        isMobile = isAndroid || isIos; // 粗略的判断
        if (isMobile) {
            return true;
        }
        else {
            return false;
        }
    }
    utils.isMobileBrowser = isMobileBrowser;
    function dialogBox(txt, callback) {
        var html = '<div id="dialogBox" class="dialog_box">';
        html += '<div class="dialog">';
        html += '<div class="dialog_tip">提示信息</div>';
        html += '<div class="dialog_mess">' + txt + "</div>";
        html += '<div class="dialog_qd">';
        html += '<a href="javascript:;">确定</a>';
        html += '</div></div></div>';
        $("body").append(html);
        $(".dialog_qd a").click(function () {
            $("#dialogBox").remove();
            if (callback) {
                callback();
            }
        });
    }
    utils.dialogBox = dialogBox;
    function UrlPara2Json(paraStr) {
        var string = paraStr.split('&');
        var res = {};
        for (var i = 0; i < string.length; i++) {
            var str = string[i].split('=');
            res[str[0]] = str[1];
        }
        return JSON.stringify(res);
    }
    utils.UrlPara2Json = UrlPara2Json;
    function setExpiresCookies(name, value) {
        var exp = new Date(); //1 * 60 * 60 * 1000
        //exp.setTime(exp.getTime() + (1800000));//有效期1小时 
        exp.setTime(exp.getTime() + (43200000)); //有效期12小时 
        document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toUTCString();
    }
    utils.setExpiresCookies = setExpiresCookies;
    function getExpiresCookies(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return decodeURIComponent(arr[2]);
        else
            return null;
    }
    utils.getExpiresCookies = getExpiresCookies;
})(utils || (utils = {}));
function getQueryString(name) {
    return utils.getQueryString(name);
}
function getCookie(name) {
    return utils.getCookie(name);
}
function setCookie(name, objvalue) {
    return utils.setCookie(name, objvalue);
}
function getRequest() {
    return utils.getRequest();
}
function deepCopy(source) {
    return utils.deepCopy(source);
}
///**
// * MobileWeb 通用功能助手，包含常用的 UA 判断、页面适配、search 参数转 键值对。
// * 该 JS 应在 head 中尽可能早的引入，减少重绘。
// *
// * fixScreen 方法根据两种情况适配，该方法自动执行。
// *      1. 定宽： 对应 meta 标签写法 -- <meta name="viewport" content="width=750">
// *          该方法会提取 width 值，主动添加 scale 相关属性值。
// *          注意： 如果 meta 标签中指定了 initial-scale， 该方法将不做处理（即不执行）。
// *      2. REM: 不用写 meta 标签，该方法根据 dpr 自动生成，并在 html 标签中加上 data-dpr 和 font-size 两个属性值。
// *          该方法约束：IOS 系统最大 dpr = 3，其它系统 dpr = 1，页面每 dpr 最大宽度（即页面宽度/dpr） = 750，REM 换算比值为 16。
// *          对应 css 开发，任何弹性尺寸均使用 rem 单位，rem 默认宽度为 视觉稿宽度 / 16;
// *              scss 中 $ppr(pixel per rem) 变量写法 -- $ppr: 750px/16/1rem;
// *                      元素尺寸写法 -- html { font-size: $ppr*1rem; } body { width: 750px/$ppr; }。
// */
//var mobileUtil = (function (win, doc) {
//    var UA = navigator.userAgent,
//        isAndroid = /android|adr/gi.test(UA),
//        isIos = /iphone|ipod|ipad/gi.test(UA) && !isAndroid, // 据说某些国产机的UA会同时包含 android iphone 字符
//        isMobile = isAndroid || isIos;  // 粗略的判断
//    return {
//        isAndroid: isAndroid,
//        isIos: isIos,
//        isMobile: isMobile,
//        isNewsApp: /NewsApp\/[\d\.]+/gi.test(UA),
//        isWeixin: /MicroMessenger/gi.test(UA),
//        isQQ: /QQ\/\d/gi.test(UA),
//        isYixin: /YiXin/gi.test(UA),
//        isWeibo: /Weibo/gi.test(UA),
//        isTXWeibo: /T(?:X|encent)MicroBlog/gi.test(UA),
//        tapEvent: isMobile ? 'tap' : 'click',
//        /**
//         * 缩放页面
//         */
//        fixScreen: function () {
//            var metaEl = doc.querySelector('meta[name="viewport"]'),
//                metaCtt = metaEl ? metaEl.content : '',
//                matchScale = metaCtt.match(/initial\-scale=([\d\.]+)/),
//                matchWidth = metaCtt.match(/width=([^,\s]+)/);
//            if (!metaEl) { // REM
//                var docEl = doc.documentElement,
//                    maxwidth = docEl.dataset.mw || 750, // 每 dpr 最大页面宽度
//                    dpr = isIos ? Math.min(win.devicePixelRatio, 3) : 1,
//                    scale = 1 / dpr,
//                    tid;
//                docEl.removeAttribute('data-mw');
//                docEl.dataset.dpr = dpr;
//                metaEl = doc.createElement('meta');
//                metaEl.name = 'viewport';
//                metaEl.content = fillScale(scale);
//                docEl.firstElementChild.appendChild(metaEl);
//                var refreshRem = function () {
//                    var width = docEl.getBoundingClientRect().width;
//                    if (width / dpr > maxwidth) {
//                        width = maxwidth * dpr;
//                    }
//                    var rem = width / 16;
//                    docEl.style.fontSize = rem + 'px';
//                };
//                win.addEventListener('resize', function () {
//                    clearTimeout(tid);
//                    tid = setTimeout(refreshRem, 300);
//                }, false);
//                win.addEventListener('pageshow', function (e) {
//                    if (e.persisted) {
//                        clearTimeout(tid);
//                        tid = setTimeout(refreshRem, 300);
//                    }
//                }, false);
//                refreshRem();
//            } else if (isMobile && !matchScale && (matchWidth && matchWidth[1] != 'device-width')) { // 定宽
//                var width = parseInt(matchWidth[1]),
//                    iw = win.innerWidth || width,
//                    ow = win.outerWidth || iw,
//                    sw = win.screen.width || iw,
//                    saw = win.screen.availWidth || iw,
//                    ih = win.innerHeight || width,
//                    oh = win.outerHeight || ih,
//                    ish = win.screen.height || ih,
//                    sah = win.screen.availHeight || ih,
//                    w = Math.min(iw, ow, sw, saw, ih, oh, ish, sah),
//                    scale = w / width;
//                if (scale < 1) {
//                    metaEl.content = metaCtt + ',' + fillScale(scale);
//                }
//            }
//            function fillScale(scale) {
//                return 'initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale + ',user-scalable=no';
//            }
//        },
//        /**
//         * 转href参数成键值对
//         * @param href {string} 指定的href，默认为当前页href
//         * @returns {object} 键值对
//         */
//        getSearch: function (href) {
//            href = href || win.location.search;
//            var data = {}, reg = new RegExp("([^?=&]+)(=([^&]*))?", "g");
//            href && href.replace(reg, function ($0, $1, $2, $3) {
//                data[$1] = $3;
//            });
//            return data;
//        }
//    };
//})(window, document);
//// 默认直接适配页面
////mobileUtil.fixScreen();
var MD5UTIL;
(function (MD5UTIL) {
    var hexcase = 0;
    function _hex_md5(a) {
        a += "@5wansdk!";
        if (a == "")
            return a;
        return rstr2hex(rstr_md5(str2rstr_utf8(a)));
    }
    function hex_md5(a) {
        return _hex_md5(_hex_md5(a) + "!S@D#K?");
    }
    MD5UTIL.hex_md5 = hex_md5;
    function hex_hmac_md5(a, b) {
        return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(b)));
    }
    function md5_vm_test() {
        return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
    }
    function rstr_md5(a) {
        return binl2rstr(binl_md5(rstr2binl(a), a.length * 8));
    }
    function rstr_hmac_md5(c, f) {
        var e = rstr2binl(c);
        if (e.length > 16) {
            e = binl_md5(e, c.length * 8);
        }
        var a = Array(16), d = Array(16);
        for (var b = 0; b < 16; b++) {
            a[b] = e[b] ^ 909522486;
            d[b] = e[b] ^ 1549556828;
        }
        var g = binl_md5(a.concat(rstr2binl(f)), 512 + f.length * 8);
        return binl2rstr(binl_md5(d.concat(g), 512 + 128));
    }
    function rstr2hex(c) {
        try {
            hexcase;
        }
        catch (g) {
            hexcase = 0;
        }
        var f = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var b = "";
        var a;
        for (var d = 0; d < c.length; d++) {
            a = c.charCodeAt(d);
            b += f.charAt((a >>> 4) & 15) + f.charAt(a & 15);
        }
        return b;
    }
    function str2rstr_utf8(c) {
        var b = "";
        var d = -1;
        var a, e;
        while (++d < c.length) {
            a = c.charCodeAt(d);
            e = d + 1 < c.length ? c.charCodeAt(d + 1) : 0;
            if (55296 <= a && a <= 56319 && 56320 <= e && e <= 57343) {
                a = 65536 + ((a & 1023) << 10) + (e & 1023);
                d++;
            }
            if (a <= 127) {
                b += String.fromCharCode(a);
            }
            else {
                if (a <= 2047) {
                    b += String.fromCharCode(192 | ((a >>> 6) & 31), 128 | (a & 63));
                }
                else {
                    if (a <= 65535) {
                        b += String.fromCharCode(224 | ((a >>> 12) & 15), 128 | ((a >>> 6) & 63), 128 | (a & 63));
                    }
                    else {
                        if (a <= 2097151) {
                            b += String.fromCharCode(240 | ((a >>> 18) & 7), 128 | ((a >>> 12) & 63), 128 | ((a >>> 6) & 63), 128 | (a & 63));
                        }
                    }
                }
            }
        }
        return b;
    }
    function rstr2binl(b) {
        var a = Array(b.length >> 2);
        for (var c = 0; c < a.length; c++) {
            a[c] = 0;
        }
        for (var c = 0; c < b.length * 8; c += 8) {
            a[c >> 5] |= (b.charCodeAt(c / 8) & 255) << (c % 32);
        }
        return a;
    }
    function binl2rstr(b) {
        var a = "";
        for (var c = 0; c < b.length * 32; c += 8) {
            a += String.fromCharCode((b[c >> 5] >>> (c % 32)) & 255);
        }
        return a;
    }
    function binl_md5(p, k) {
        p[k >> 5] |= 128 << ((k) % 32);
        p[(((k + 64) >>> 9) << 4) + 14] = k;
        var o = 1732584193;
        var n = -271733879;
        var m = -1732584194;
        var l = 271733878;
        for (var g = 0; g < p.length; g += 16) {
            var j = o;
            var h = n;
            var f = m;
            var e = l;
            o = md5_ff(o, n, m, l, p[g + 0], 7, -680876936);
            l = md5_ff(l, o, n, m, p[g + 1], 12, -389564586);
            m = md5_ff(m, l, o, n, p[g + 2], 17, 606105819);
            n = md5_ff(n, m, l, o, p[g + 3], 22, -1044525330);
            o = md5_ff(o, n, m, l, p[g + 4], 7, -176418897);
            l = md5_ff(l, o, n, m, p[g + 5], 12, 1200080426);
            m = md5_ff(m, l, o, n, p[g + 6], 17, -1473231341);
            n = md5_ff(n, m, l, o, p[g + 7], 22, -45705983);
            o = md5_ff(o, n, m, l, p[g + 8], 7, 1770035416);
            l = md5_ff(l, o, n, m, p[g + 9], 12, -1958414417);
            m = md5_ff(m, l, o, n, p[g + 10], 17, -42063);
            n = md5_ff(n, m, l, o, p[g + 11], 22, -1990404162);
            o = md5_ff(o, n, m, l, p[g + 12], 7, 1804603682);
            l = md5_ff(l, o, n, m, p[g + 13], 12, -40341101);
            m = md5_ff(m, l, o, n, p[g + 14], 17, -1502002290);
            n = md5_ff(n, m, l, o, p[g + 15], 22, 1236535329);
            o = md5_gg(o, n, m, l, p[g + 1], 5, -165796510);
            l = md5_gg(l, o, n, m, p[g + 6], 9, -1069501632);
            m = md5_gg(m, l, o, n, p[g + 11], 14, 643717713);
            n = md5_gg(n, m, l, o, p[g + 0], 20, -373897302);
            o = md5_gg(o, n, m, l, p[g + 5], 5, -701558691);
            l = md5_gg(l, o, n, m, p[g + 10], 9, 38016083);
            m = md5_gg(m, l, o, n, p[g + 15], 14, -660478335);
            n = md5_gg(n, m, l, o, p[g + 4], 20, -405537848);
            o = md5_gg(o, n, m, l, p[g + 9], 5, 568446438);
            l = md5_gg(l, o, n, m, p[g + 14], 9, -1019803690);
            m = md5_gg(m, l, o, n, p[g + 3], 14, -187363961);
            n = md5_gg(n, m, l, o, p[g + 8], 20, 1163531501);
            o = md5_gg(o, n, m, l, p[g + 13], 5, -1444681467);
            l = md5_gg(l, o, n, m, p[g + 2], 9, -51403784);
            m = md5_gg(m, l, o, n, p[g + 7], 14, 1735328473);
            n = md5_gg(n, m, l, o, p[g + 12], 20, -1926607734);
            o = md5_hh(o, n, m, l, p[g + 5], 4, -378558);
            l = md5_hh(l, o, n, m, p[g + 8], 11, -2022574463);
            m = md5_hh(m, l, o, n, p[g + 11], 16, 1839030562);
            n = md5_hh(n, m, l, o, p[g + 14], 23, -35309556);
            o = md5_hh(o, n, m, l, p[g + 1], 4, -1530992060);
            l = md5_hh(l, o, n, m, p[g + 4], 11, 1272893353);
            m = md5_hh(m, l, o, n, p[g + 7], 16, -155497632);
            n = md5_hh(n, m, l, o, p[g + 10], 23, -1094730640);
            o = md5_hh(o, n, m, l, p[g + 13], 4, 681279174);
            l = md5_hh(l, o, n, m, p[g + 0], 11, -358537222);
            m = md5_hh(m, l, o, n, p[g + 3], 16, -722521979);
            n = md5_hh(n, m, l, o, p[g + 6], 23, 76029189);
            o = md5_hh(o, n, m, l, p[g + 9], 4, -640364487);
            l = md5_hh(l, o, n, m, p[g + 12], 11, -421815835);
            m = md5_hh(m, l, o, n, p[g + 15], 16, 530742520);
            n = md5_hh(n, m, l, o, p[g + 2], 23, -995338651);
            o = md5_ii(o, n, m, l, p[g + 0], 6, -198630844);
            l = md5_ii(l, o, n, m, p[g + 7], 10, 1126891415);
            m = md5_ii(m, l, o, n, p[g + 14], 15, -1416354905);
            n = md5_ii(n, m, l, o, p[g + 5], 21, -57434055);
            o = md5_ii(o, n, m, l, p[g + 12], 6, 1700485571);
            l = md5_ii(l, o, n, m, p[g + 3], 10, -1894986606);
            m = md5_ii(m, l, o, n, p[g + 10], 15, -1051523);
            n = md5_ii(n, m, l, o, p[g + 1], 21, -2054922799);
            o = md5_ii(o, n, m, l, p[g + 8], 6, 1873313359);
            l = md5_ii(l, o, n, m, p[g + 15], 10, -30611744);
            m = md5_ii(m, l, o, n, p[g + 6], 15, -1560198380);
            n = md5_ii(n, m, l, o, p[g + 13], 21, 1309151649);
            o = md5_ii(o, n, m, l, p[g + 4], 6, -145523070);
            l = md5_ii(l, o, n, m, p[g + 11], 10, -1120210379);
            m = md5_ii(m, l, o, n, p[g + 2], 15, 718787259);
            n = md5_ii(n, m, l, o, p[g + 9], 21, -343485551);
            o = safe_add(o, j);
            n = safe_add(n, h);
            m = safe_add(m, f);
            l = safe_add(l, e);
        }
        return Array(o, n, m, l);
    }
    function md5_cmn(h, e, d, c, g, f) {
        return safe_add(bit_rol(safe_add(safe_add(e, h), safe_add(c, f)), g), d);
    }
    function md5_ff(g, f, k, j, e, i, h) {
        return md5_cmn((f & k) | ((~f) & j), g, f, e, i, h);
    }
    function md5_gg(g, f, k, j, e, i, h) {
        return md5_cmn((f & j) | (k & (~j)), g, f, e, i, h);
    }
    function md5_hh(g, f, k, j, e, i, h) {
        return md5_cmn(f ^ k ^ j, g, f, e, i, h);
    }
    function md5_ii(g, f, k, j, e, i, h) {
        return md5_cmn(k ^ (f | (~j)), g, f, e, i, h);
    }
    function safe_add(a, d) {
        var c = (a & 65535) + (d & 65535);
        var b = (a >> 16) + (d >> 16) + (c >> 16);
        return (b << 16) | (c & 65535);
    }
    function bit_rol(a, b) {
        return (a << b) | (a >>> (32 - b));
    }
    ;
    function GetSign(para, key) {
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
        var sign = rstr2hex(rstr_md5(str2rstr_utf8(params + key)));
        return sign;
    }
    MD5UTIL.GetSign = GetSign;
})(MD5UTIL || (MD5UTIL = {}));
var ServerResp = (function () {
    function ServerResp() {
    }
    return ServerResp;
}());
//POST数据到服务端
//cmd:指令名称
//param:参数,一个对象
//cb：POST后服务器返回
//files:上传文件，格式为[{名称1:file},{名称2:file}...]
function PostServer(cmd, param, cb, files) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                var resp = JSON.parse(xmlhttp.responseText);
                cb(resp);
            }
            else {
            }
        }
    };
    var fd = new FormData();
    fd.append("param", JSON.stringify(param));
    if (!!files) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            for (var j in file) {
                if (file[j])
                    fd.append(j, file[j]);
            }
        }
    }
    //	var str = "param=" + encodeURIComponent(JSON.stringify(param));
    xmlhttp.open("POST", utils.g_serverurl + cmd, true);
    //	xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //	xmlhttp.setRequestHeader("Content-Length", str.length.toString());
    xmlhttp.upload.addEventListener("progress", function (evt) {
    }, false);
    xmlhttp.addEventListener("load", function (evt) {
    }, false);
    xmlhttp.addEventListener("error", function (evt) {
    }, false);
    xmlhttp.addEventListener("abort", function (evt) {
    }, false);
    xmlhttp.send(fd);
    //	xmlhttp.send(str);
}
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//获取验证码
function GetIDCode(para, cb) {
    PostServer("getidcode", para, cb);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//H5调用模块，用来弹出登录、注册、支付等页面
var SDKUTIL;
(function (SDKUTIL) {
    //弹出一个页面
    function ShowIFrame(url, opacity, onload) {
        var divbgpage; //半透明背景
        var iframe; //显示的iframe
        divbgpage = document.createElement("div");
        divbgpage.style.position = "fixed";
        if (!opacity) {
            divbgpage.style.opacity = "0.5";
            divbgpage.style.backgroundColor = "black";
        }
        else {
            divbgpage.style.backgroundColor = "white";
        }
        divbgpage.style.left = "0px";
        divbgpage.style.right = "0px";
        divbgpage.style.top = "0px";
        divbgpage.style.bottom = "0px";
        document.body.appendChild(divbgpage);
        iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.style.border = "none";
        iframe.style.display = "block";
        iframe.style.position = "fixed";
        iframe.style.left = "0px";
        iframe.style.right = "0px";
        iframe.style.top = "0px";
        iframe.style.bottom = "0px";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        document.body.appendChild(iframe);
        iframe.style.zIndex = "99999";
        iframe.onload = function (ev) {
            onload(ev, divbgpage, iframe);
            iframe.onload = null;
        };
    }
    SDKUTIL.ShowIFrame = ShowIFrame;
    //关闭由ShowIFrame弹出的页面
    function RemoveIFrame(divbgpage, iframe) {
        if (divbgpage)
            document.body.removeChild(divbgpage);
        if (iframe)
            document.body.removeChild(iframe);
        divbgpage = null;
        iframe = null;
    }
    SDKUTIL.RemoveIFrame = RemoveIFrame;
})(SDKUTIL || (SDKUTIL = {}));
//游戏中心用
var GAMECENTER;
(function (GAMECENTER) {
    //用户信息
    var GSUSERINFO = (function () {
        function GSUSERINFO() {
        }
        return GSUSERINFO;
    }());
    GAMECENTER.GSUSERINFO = GSUSERINFO;
    //玩家登录后的REQ要以这个为基类
    var GSUSERREQBASE = (function () {
        function GSUSERREQBASE() {
        }
        return GSUSERREQBASE;
    }());
    GAMECENTER.GSUSERREQBASE = GSUSERREQBASE;
    //登录后基类
    var USERREQBASE = (function () {
        function USERREQBASE() {
        }
        return USERREQBASE;
    }());
    GAMECENTER.USERREQBASE = USERREQBASE;
    //检测登录
    var GSUSERCHECKSESSIONREQ = (function (_super) {
        __extends(GSUSERCHECKSESSIONREQ, _super);
        function GSUSERCHECKSESSIONREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERCHECKSESSIONREQ;
    }(GSUSERREQBASE));
    //用户注册
    var GSUSERREGREQ = (function () {
        function GSUSERREGREQ() {
        }
        return GSUSERREGREQ;
    }());
    GAMECENTER.GSUSERREGREQ = GSUSERREGREQ;
    var GSUSERREGRESP = (function () {
        function GSUSERREGRESP() {
        }
        return GSUSERREGRESP;
    }());
    GAMECENTER.GSUSERREGRESP = GSUSERREGRESP;
    //随机昵称
    var GSUSERRANDNICKREQ = (function () {
        function GSUSERRANDNICKREQ() {
        }
        return GSUSERRANDNICKREQ;
    }());
    GAMECENTER.GSUSERRANDNICKREQ = GSUSERRANDNICKREQ;
    var GSUSERRANDNICKRESP = (function () {
        function GSUSERRANDNICKRESP() {
        }
        return GSUSERRANDNICKRESP;
    }());
    GAMECENTER.GSUSERRANDNICKRESP = GSUSERRANDNICKRESP;
    //用户登录
    var GSUSERLOGINREQ = (function () {
        function GSUSERLOGINREQ() {
        }
        return GSUSERLOGINREQ;
    }());
    GAMECENTER.GSUSERLOGINREQ = GSUSERLOGINREQ;
    //QQ登录
    var GSUSERQQLOGINREQ = (function () {
        function GSUSERQQLOGINREQ() {
        }
        return GSUSERQQLOGINREQ;
    }());
    GAMECENTER.GSUSERQQLOGINREQ = GSUSERQQLOGINREQ;
    //微信登录
    var GSUSERWXLOGINREQ = (function () {
        function GSUSERWXLOGINREQ() {
        }
        return GSUSERWXLOGINREQ;
    }());
    GAMECENTER.GSUSERWXLOGINREQ = GSUSERWXLOGINREQ;
    var GSUSERLOGINRESP = (function () {
        function GSUSERLOGINRESP() {
        }
        return GSUSERLOGINRESP;
    }());
    GAMECENTER.GSUSERLOGINRESP = GSUSERLOGINRESP;
    //修改头像
    var GSUSERSETHEADICOREQ = (function (_super) {
        __extends(GSUSERSETHEADICOREQ, _super);
        function GSUSERSETHEADICOREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERSETHEADICOREQ;
    }(GSUSERREQBASE));
    GAMECENTER.GSUSERSETHEADICOREQ = GSUSERSETHEADICOREQ;
    var GSUSERSETHEADICOREQ2 = (function (_super) {
        __extends(GSUSERSETHEADICOREQ2, _super);
        function GSUSERSETHEADICOREQ2() {
            _super.apply(this, arguments);
        }
        return GSUSERSETHEADICOREQ2;
    }(GSUSERSETHEADICOREQ));
    GAMECENTER.GSUSERSETHEADICOREQ2 = GSUSERSETHEADICOREQ2;
    var GSUSERSETHEADICORESP = (function () {
        function GSUSERSETHEADICORESP() {
        }
        return GSUSERSETHEADICORESP;
    }());
    GAMECENTER.GSUSERSETHEADICORESP = GSUSERSETHEADICORESP;
    //修改昵称
    var GSUSERSETNICKNAMEREQ = (function (_super) {
        __extends(GSUSERSETNICKNAMEREQ, _super);
        function GSUSERSETNICKNAMEREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERSETNICKNAMEREQ;
    }(GSUSERREQBASE));
    GAMECENTER.GSUSERSETNICKNAMEREQ = GSUSERSETNICKNAMEREQ;
    var GSUSERSETNICKNAMERESP = (function () {
        function GSUSERSETNICKNAMERESP() {
        }
        return GSUSERSETNICKNAMERESP;
    }());
    GAMECENTER.GSUSERSETNICKNAMERESP = GSUSERSETNICKNAMERESP;
    //手机验证码
    var GSUSERSENDPHONECODEREQ = (function (_super) {
        __extends(GSUSERSENDPHONECODEREQ, _super);
        function GSUSERSENDPHONECODEREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERSENDPHONECODEREQ;
    }(GSUSERREQBASE));
    GAMECENTER.GSUSERSENDPHONECODEREQ = GSUSERSENDPHONECODEREQ;
    //邮箱验证码
    var GSUSERSENDMAILCODEREQ = (function () {
        function GSUSERSENDMAILCODEREQ() {
        }
        return GSUSERSENDMAILCODEREQ;
    }());
    GAMECENTER.GSUSERSENDMAILCODEREQ = GSUSERSENDMAILCODEREQ;
    var GSUSERSENDPHONECODERESP = (function () {
        function GSUSERSENDPHONECODERESP() {
        }
        return GSUSERSENDPHONECODERESP;
    }());
    GAMECENTER.GSUSERSENDPHONECODERESP = GSUSERSENDPHONECODERESP;
    //设置手机
    var GSUSERSETPHONEREQ = (function (_super) {
        __extends(GSUSERSETPHONEREQ, _super);
        function GSUSERSETPHONEREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERSETPHONEREQ;
    }(GSUSERREQBASE));
    GAMECENTER.GSUSERSETPHONEREQ = GSUSERSETPHONEREQ;
    //设置邮箱
    var GSUSERSETMAILREQ = (function (_super) {
        __extends(GSUSERSETMAILREQ, _super);
        function GSUSERSETMAILREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERSETMAILREQ;
    }(GSUSERREQBASE));
    GAMECENTER.GSUSERSETMAILREQ = GSUSERSETMAILREQ;
    var GSUSERSETPHONERESP = (function () {
        function GSUSERSETPHONERESP() {
        }
        return GSUSERSETPHONERESP;
    }());
    GAMECENTER.GSUSERSETPHONERESP = GSUSERSETPHONERESP;
    //验证码登录时获取验证码
    //验证码登录时获取验证码
    var GSUSERLOGINSENDCODEREQ = (function () {
        function GSUSERLOGINSENDCODEREQ() {
        }
        return GSUSERLOGINSENDCODEREQ;
    }());
    GAMECENTER.GSUSERLOGINSENDCODEREQ = GSUSERLOGINSENDCODEREQ;
    var GSUSERLOGINSENDCODERESP = (function () {
        function GSUSERLOGINSENDCODERESP() {
        }
        return GSUSERLOGINSENDCODERESP;
    }());
    GAMECENTER.GSUSERLOGINSENDCODERESP = GSUSERLOGINSENDCODERESP;
    //设置地址
    var GSUSERSETADDRREQ = (function (_super) {
        __extends(GSUSERSETADDRREQ, _super);
        function GSUSERSETADDRREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERSETADDRREQ;
    }(GSUSERREQBASE));
    GAMECENTER.GSUSERSETADDRREQ = GSUSERSETADDRREQ;
    var GSUSERSETADDRRESP = (function () {
        function GSUSERSETADDRRESP() {
        }
        return GSUSERSETADDRRESP;
    }());
    GAMECENTER.GSUSERSETADDRRESP = GSUSERSETADDRRESP;
    //修改密码
    var GSUSERCHANGEPWDREQ = (function (_super) {
        __extends(GSUSERCHANGEPWDREQ, _super);
        function GSUSERCHANGEPWDREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERCHANGEPWDREQ;
    }(GSUSERREQBASE));
    GAMECENTER.GSUSERCHANGEPWDREQ = GSUSERCHANGEPWDREQ;
    //修改密码,根据传上来的用户ID
    var GSUSERCHANGEPWDREQ2 = (function (_super) {
        __extends(GSUSERCHANGEPWDREQ2, _super);
        function GSUSERCHANGEPWDREQ2() {
            _super.apply(this, arguments);
        }
        return GSUSERCHANGEPWDREQ2;
    }(GSUSERCHANGEPWDREQ));
    GAMECENTER.GSUSERCHANGEPWDREQ2 = GSUSERCHANGEPWDREQ2;
    var GSUSERCHANGEPWDRESP = (function () {
        function GSUSERCHANGEPWDRESP() {
        }
        return GSUSERCHANGEPWDRESP;
    }());
    GAMECENTER.GSUSERCHANGEPWDRESP = GSUSERCHANGEPWDRESP;
    //取得PK游戏列表
    var GSUSERGETPKAPPLISTREQ = (function () {
        function GSUSERGETPKAPPLISTREQ() {
        }
        return GSUSERGETPKAPPLISTREQ;
    }());
    GAMECENTER.GSUSERGETPKAPPLISTREQ = GSUSERGETPKAPPLISTREQ;
    var GSUSERGETPKAPPLISTRESP = (function () {
        function GSUSERGETPKAPPLISTRESP() {
        }
        return GSUSERGETPKAPPLISTRESP;
    }());
    GAMECENTER.GSUSERGETPKAPPLISTRESP = GSUSERGETPKAPPLISTRESP;
    //取得H5游戏列表
    var GSUSERGETH5APPLISTREQ = (function () {
        function GSUSERGETH5APPLISTREQ() {
        }
        return GSUSERGETH5APPLISTREQ;
    }());
    GAMECENTER.GSUSERGETH5APPLISTREQ = GSUSERGETH5APPLISTREQ;
    var GSUSERGETH5APPLISTRESP = (function () {
        function GSUSERGETH5APPLISTRESP() {
        }
        return GSUSERGETH5APPLISTRESP;
    }());
    GAMECENTER.GSUSERGETH5APPLISTRESP = GSUSERGETH5APPLISTRESP;
    var GSUSERGETH5APPIMGLISTRESP = (function () {
        function GSUSERGETH5APPIMGLISTRESP() {
        }
        return GSUSERGETH5APPIMGLISTRESP;
    }());
    GAMECENTER.GSUSERGETH5APPIMGLISTRESP = GSUSERGETH5APPIMGLISTRESP;
    //取得商城列表
    var GSUSERGETSHOPGOODSLISTREQ = (function () {
        function GSUSERGETSHOPGOODSLISTREQ() {
        }
        return GSUSERGETSHOPGOODSLISTREQ;
    }());
    GAMECENTER.GSUSERGETSHOPGOODSLISTREQ = GSUSERGETSHOPGOODSLISTREQ;
    var SHOPGOODSINFO = (function () {
        function SHOPGOODSINFO() {
        }
        return SHOPGOODSINFO;
    }());
    GAMECENTER.SHOPGOODSINFO = SHOPGOODSINFO;
    var GSUSERGETSHOPGOODSLISTRESP = (function () {
        function GSUSERGETSHOPGOODSLISTRESP() {
        }
        return GSUSERGETSHOPGOODSLISTRESP;
    }());
    GAMECENTER.GSUSERGETSHOPGOODSLISTRESP = GSUSERGETSHOPGOODSLISTRESP;
    //兑换
    var GSUSEREXCHANGEREQ = (function (_super) {
        __extends(GSUSEREXCHANGEREQ, _super);
        function GSUSEREXCHANGEREQ() {
            _super.apply(this, arguments);
        }
        return GSUSEREXCHANGEREQ;
    }(GSUSERREQBASE));
    GAMECENTER.GSUSEREXCHANGEREQ = GSUSEREXCHANGEREQ;
    var GSUSEREXCHANGERESP = (function () {
        function GSUSEREXCHANGERESP() {
        }
        return GSUSEREXCHANGERESP;
    }());
    GAMECENTER.GSUSEREXCHANGERESP = GSUSEREXCHANGERESP;
    //获取兑换记录
    var GSUSERGETEXCHANGERECORDREQ = (function (_super) {
        __extends(GSUSERGETEXCHANGERECORDREQ, _super);
        function GSUSERGETEXCHANGERECORDREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERGETEXCHANGERECORDREQ;
    }(GSUSERREQBASE));
    GAMECENTER.GSUSERGETEXCHANGERECORDREQ = GSUSERGETEXCHANGERECORDREQ;
    var EXCHANGERECORD = (function () {
        function EXCHANGERECORD() {
        }
        return EXCHANGERECORD;
    }());
    GAMECENTER.EXCHANGERECORD = EXCHANGERECORD;
    var GSUSERGETEXCHANGERECORDRESP = (function () {
        function GSUSERGETEXCHANGERECORDRESP() {
        }
        return GSUSERGETEXCHANGERECORDRESP;
    }());
    GAMECENTER.GSUSERGETEXCHANGERECORDRESP = GSUSERGETEXCHANGERECORDRESP;
    //取得各种广告条的数据，包括奖池累计、兑换商城还剩XX份、活动中PK记录、兑换记录
    var EXCHANGEINFO = (function () {
        function EXCHANGEINFO() {
        }
        return EXCHANGEINFO;
    }());
    GAMECENTER.EXCHANGEINFO = EXCHANGEINFO;
    var WEEKLYGOODS //每周兑换广告
     = (function () {
        function WEEKLYGOODS //每周兑换广告
            () {
        }
        return WEEKLYGOODS //每周兑换广告
        ;
    }());
    GAMECENTER.WEEKLYGOODS //每周兑换广告
     = WEEKLYGOODS //每周兑换广告
    ;
    //兑换商城上的广告
    var SHOPAD = (function () {
        function SHOPAD() {
        }
        return SHOPAD;
    }());
    GAMECENTER.SHOPAD = SHOPAD;
    //PK记录,XXX VS YYY 1000K币
    var PKRECORD = (function () {
        function PKRECORD() {
        }
        return PKRECORD;
    }());
    GAMECENTER.PKRECORD = PKRECORD;
    //精彩活动广告
    var ACTIVITYAD = (function () {
        function ACTIVITYAD() {
        }
        return ACTIVITYAD;
    }());
    GAMECENTER.ACTIVITYAD = ACTIVITYAD;
    var GSUSERGETBANNERDATAREQ = (function () {
        function GSUSERGETBANNERDATAREQ() {
        }
        return GSUSERGETBANNERDATAREQ;
    }());
    GAMECENTER.GSUSERGETBANNERDATAREQ = GSUSERGETBANNERDATAREQ;
    var GSUSERGETBANNERDATARESP = (function () {
        function GSUSERGETBANNERDATARESP() {
        }
        return GSUSERGETBANNERDATARESP;
    }());
    GAMECENTER.GSUSERGETBANNERDATARESP = GSUSERGETBANNERDATARESP;
    //取得充值折扣
    var GSUSERPAYDISCOUNTREQ = (function () {
        function GSUSERPAYDISCOUNTREQ() {
        }
        return GSUSERPAYDISCOUNTREQ;
    }());
    GAMECENTER.GSUSERPAYDISCOUNTREQ = GSUSERPAYDISCOUNTREQ;
    var GSUSERPAYDISCOUNTRESP = (function () {
        function GSUSERPAYDISCOUNTRESP() {
        }
        return GSUSERPAYDISCOUNTRESP;
    }());
    GAMECENTER.GSUSERPAYDISCOUNTRESP = GSUSERPAYDISCOUNTRESP;
    //充值
    var GSUSERPAYCREATEREQ = (function (_super) {
        __extends(GSUSERPAYCREATEREQ, _super);
        function GSUSERPAYCREATEREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERPAYCREATEREQ;
    }(GSUSERREQBASE));
    GAMECENTER.GSUSERPAYCREATEREQ = GSUSERPAYCREATEREQ;
    var GSUSERPAYCREATERESP = (function () {
        function GSUSERPAYCREATERESP() {
        }
        return GSUSERPAYCREATERESP;
    }());
    GAMECENTER.GSUSERPAYCREATERESP = GSUSERPAYCREATERESP;
    //支付宝点击了返回，删除订单
    var GSUSERPAYDELREQ = (function (_super) {
        __extends(GSUSERPAYDELREQ, _super);
        function GSUSERPAYDELREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERPAYDELREQ;
    }(GSUSERREQBASE));
    GAMECENTER.GSUSERPAYDELREQ = GSUSERPAYDELREQ;
    var GSUSERPAYDELRESP = (function () {
        function GSUSERPAYDELRESP() {
        }
        return GSUSERPAYDELRESP;
    }());
    GAMECENTER.GSUSERPAYDELRESP = GSUSERPAYDELRESP;
    //玩家等待支付成功
    var GSUSERWAITPAYRESULTREQ = (function () {
        function GSUSERWAITPAYRESULTREQ() {
        }
        return GSUSERWAITPAYRESULTREQ;
    }());
    GAMECENTER.GSUSERWAITPAYRESULTREQ = GSUSERWAITPAYRESULTREQ;
    var GSUSERWAITPAYRESULTRESP = (function () {
        function GSUSERWAITPAYRESULTRESP() {
        }
        return GSUSERWAITPAYRESULTRESP;
    }());
    GAMECENTER.GSUSERWAITPAYRESULTRESP = GSUSERWAITPAYRESULTRESP;
    //微信code获得后发送到服务器，进行获取openid、支付等操作
    var GSUSERWXCODEREQ = (function () {
        function GSUSERWXCODEREQ() {
        }
        return GSUSERWXCODEREQ;
    }());
    GAMECENTER.GSUSERWXCODEREQ = GSUSERWXCODEREQ;
    var GetBrandWCPayRequestData = (function () {
        function GetBrandWCPayRequestData() {
            this.signType = "MD5";
        }
        return GetBrandWCPayRequestData;
    }());
    GAMECENTER.GetBrandWCPayRequestData = GetBrandWCPayRequestData;
    var GSUSERWXCODERESP = (function () {
        function GSUSERWXCODERESP() {
        }
        return GSUSERWXCODERESP;
    }());
    GAMECENTER.GSUSERWXCODERESP = GSUSERWXCODERESP;
    var USERLOGINWEIXINREQ = (function () {
        function USERLOGINWEIXINREQ() {
        }
        return USERLOGINWEIXINREQ;
    }());
    GAMECENTER.USERLOGINWEIXINREQ = USERLOGINWEIXINREQ;
    var WEIXINTOKEN = (function () {
        function WEIXINTOKEN() {
        }
        return WEIXINTOKEN;
    }());
    GAMECENTER.WEIXINTOKEN = WEIXINTOKEN;
    var WEIXINUSERINFO = (function () {
        function WEIXINUSERINFO() {
        }
        return WEIXINUSERINFO;
    }());
    GAMECENTER.WEIXINUSERINFO = WEIXINUSERINFO;
    var OPENAPPRESP = (function () {
        function OPENAPPRESP() {
        }
        return OPENAPPRESP;
    }());
    GAMECENTER.OPENAPPRESP = OPENAPPRESP;
    var WXCONFIG = (function () {
        function WXCONFIG() {
        }
        return WXCONFIG;
    }());
    GAMECENTER.WXCONFIG = WXCONFIG;
    var GETWXCONFIGSIGNREQ = (function () {
        function GETWXCONFIGSIGNREQ() {
        }
        return GETWXCONFIGSIGNREQ;
    }());
    GAMECENTER.GETWXCONFIGSIGNREQ = GETWXCONFIGSIGNREQ;
    var GETWXCONFIGSIGNRESP = (function () {
        function GETWXCONFIGSIGNRESP() {
        }
        return GETWXCONFIGSIGNRESP;
    }());
    GAMECENTER.GETWXCONFIGSIGNRESP = GETWXCONFIGSIGNRESP;
    var USERLOGINQQREQ = (function () {
        function USERLOGINQQREQ() {
        }
        return USERLOGINQQREQ;
    }());
    GAMECENTER.USERLOGINQQREQ = USERLOGINQQREQ;
    var QQTOKEN = (function () {
        function QQTOKEN() {
        }
        return QQTOKEN;
    }());
    GAMECENTER.QQTOKEN = QQTOKEN;
    var QQOPENID = (function () {
        function QQOPENID() {
        }
        return QQOPENID;
    }());
    GAMECENTER.QQOPENID = QQOPENID;
    var QQUSERINFO = (function () {
        function QQUSERINFO() {
        }
        return QQUSERINFO;
    }());
    GAMECENTER.QQUSERINFO = QQUSERINFO;
    //微信查询订单状态
    var GSUSERQUERYWXPAYREQ = (function () {
        function GSUSERQUERYWXPAYREQ() {
        }
        return GSUSERQUERYWXPAYREQ;
    }());
    GAMECENTER.GSUSERQUERYWXPAYREQ = GSUSERQUERYWXPAYREQ;
    var GSUSERQUERYWXPAYRESP = (function () {
        function GSUSERQUERYWXPAYRESP() {
        }
        return GSUSERQUERYWXPAYRESP;
    }());
    GAMECENTER.GSUSERQUERYWXPAYRESP = GSUSERQUERYWXPAYRESP;
    ///////////////////////////////////////////////////////////////////////
    //WEBSOCKET实际传输的数据结构
    var WEBSOCKETPACK = (function () {
        function WEBSOCKETPACK() {
            this.errno = 0;
        }
        return WEBSOCKETPACK;
    }());
    GAMECENTER.WEBSOCKETPACK = WEBSOCKETPACK;
    //PK游戏信息
    var PKAPPINFO = (function () {
        function PKAPPINFO() {
        }
        return PKAPPINFO;
    }());
    GAMECENTER.PKAPPINFO = PKAPPINFO;
    //联运游戏信息
    var H5APPINFO = (function () {
        function H5APPINFO() {
        }
        return H5APPINFO;
    }());
    GAMECENTER.H5APPINFO = H5APPINFO;
    var H5APPINFOADDIMG = (function (_super) {
        __extends(H5APPINFOADDIMG, _super);
        function H5APPINFOADDIMG() {
            _super.apply(this, arguments);
        }
        return H5APPINFOADDIMG;
    }(H5APPINFO));
    GAMECENTER.H5APPINFOADDIMG = H5APPINFOADDIMG;
    //广播玩家的分数
    var GSUSERPKSCORE = (function () {
        function GSUSERPKSCORE() {
        }
        return GSUSERPKSCORE;
    }());
    GAMECENTER.GSUSERPKSCORE = GSUSERPKSCORE;
    //pk结果
    var GSUSERPKRESULT = (function () {
        function GSUSERPKRESULT() {
        }
        return GSUSERPKRESULT;
    }());
    GAMECENTER.GSUSERPKRESULT = GSUSERPKRESULT;
    //WEBSOCKET连接后登录
    var GSUSERENTERPKGAMEREQ = (function (_super) {
        __extends(GSUSERENTERPKGAMEREQ, _super);
        function GSUSERENTERPKGAMEREQ() {
            _super.apply(this, arguments);
        }
        return GSUSERENTERPKGAMEREQ;
    }(GSUSERREQBASE));
    GAMECENTER.GSUSERENTERPKGAMEREQ = GSUSERENTERPKGAMEREQ;
    var PKUSERINFO //PK中的对方玩家信息
     = (function () {
        function PKUSERINFO //PK中的对方玩家信息
            () {
        }
        return PKUSERINFO //PK中的对方玩家信息
        ;
    }());
    GAMECENTER.PKUSERINFO //PK中的对方玩家信息
     = PKUSERINFO //PK中的对方玩家信息
    ;
    var GSUSERENTERPKGAMERESP = (function () {
        function GSUSERENTERPKGAMERESP() {
        }
        return GSUSERENTERPKGAMERESP;
    }());
    GAMECENTER.GSUSERENTERPKGAMERESP = GSUSERENTERPKGAMERESP;
    //玩家定时提交分数
    var GSUSERUPSCORE = (function (_super) {
        __extends(GSUSERUPSCORE, _super);
        function GSUSERUPSCORE() {
            _super.apply(this, arguments);
        }
        return GSUSERUPSCORE;
    }(GSUSERREQBASE));
    GAMECENTER.GSUSERUPSCORE = GSUSERUPSCORE;
    GAMECENTER.userinfo = null; //用户信息
    GAMECENTER.channel = null; //渠道名称
    function SetChannel(chn) {
        GAMECENTER.channel = chn;
        sessionStorage["GSCHANNEL"] = GAMECENTER.channel;
    }
    GAMECENTER.SetChannel = SetChannel;
    function GetChannel() {
        if (!GAMECENTER.channel)
            GAMECENTER.channel = sessionStorage["GSCHANNEL"];
        return GAMECENTER.channel;
    }
    GAMECENTER.GetChannel = GetChannel;
    var HistoryUsers = (function () {
        function HistoryUsers() {
        }
        return HistoryUsers;
    }());
    GAMECENTER.HistoryUsers = HistoryUsers;
    //礼包相关
    var GETALLGIFTTYPEINFO = (function () {
        function GETALLGIFTTYPEINFO() {
        }
        return GETALLGIFTTYPEINFO;
    }());
    GAMECENTER.GETALLGIFTTYPEINFO = GETALLGIFTTYPEINFO;
    var GETALLGIFTTYPEREQ = (function () {
        function GETALLGIFTTYPEREQ() {
        }
        return GETALLGIFTTYPEREQ;
    }());
    GAMECENTER.GETALLGIFTTYPEREQ = GETALLGIFTTYPEREQ;
    var GETALLGIFTTYPEINFORESP = (function () {
        function GETALLGIFTTYPEINFORESP() {
        }
        return GETALLGIFTTYPEINFORESP;
    }());
    GAMECENTER.GETALLGIFTTYPEINFORESP = GETALLGIFTTYPEINFORESP;
    var GETCODEINFOREQ = (function () {
        function GETCODEINFOREQ() {
        }
        return GETCODEINFOREQ;
    }());
    GAMECENTER.GETCODEINFOREQ = GETCODEINFOREQ;
    var GSGETTEDSTATUSBYLOGINIDREQ = (function () {
        function GSGETTEDSTATUSBYLOGINIDREQ() {
        }
        return GSGETTEDSTATUSBYLOGINIDREQ;
    }());
    GAMECENTER.GSGETTEDSTATUSBYLOGINIDREQ = GSGETTEDSTATUSBYLOGINIDREQ;
    var GSGETTEDSTATUSBYLOGINIDINFO = (function () {
        function GSGETTEDSTATUSBYLOGINIDINFO() {
        }
        return GSGETTEDSTATUSBYLOGINIDINFO;
    }());
    GAMECENTER.GSGETTEDSTATUSBYLOGINIDINFO = GSGETTEDSTATUSBYLOGINIDINFO;
    var GSGETTEDSTATSUSBYLOGINIDRESP = (function () {
        function GSGETTEDSTATSUSBYLOGINIDRESP() {
        }
        return GSGETTEDSTATSUSBYLOGINIDRESP;
    }());
    GAMECENTER.GSGETTEDSTATSUSBYLOGINIDRESP = GSGETTEDSTATSUSBYLOGINIDRESP;
    var GSGETGAMEALLGIFTREQ = (function () {
        function GSGETGAMEALLGIFTREQ() {
        }
        return GSGETGAMEALLGIFTREQ;
    }());
    GAMECENTER.GSGETGAMEALLGIFTREQ = GSGETGAMEALLGIFTREQ;
    var GSGETGAMEALLGIFTINFO = (function () {
        function GSGETGAMEALLGIFTINFO() {
        }
        return GSGETGAMEALLGIFTINFO;
    }());
    GAMECENTER.GSGETGAMEALLGIFTINFO = GSGETGAMEALLGIFTINFO;
    var CHECKPHONEISEXISTREQ = (function () {
        function CHECKPHONEISEXISTREQ() {
        }
        return CHECKPHONEISEXISTREQ;
    }());
    GAMECENTER.CHECKPHONEISEXISTREQ = CHECKPHONEISEXISTREQ;
    var GSGETGAMEALLGIFTRESP = (function () {
        function GSGETGAMEALLGIFTRESP() {
        }
        return GSGETGAMEALLGIFTRESP;
    }());
    GAMECENTER.GSGETGAMEALLGIFTRESP = GSGETGAMEALLGIFTRESP;
    var USERCHECKBINDPHONEREQ = (function () {
        function USERCHECKBINDPHONEREQ() {
        }
        return USERCHECKBINDPHONEREQ;
    }());
    GAMECENTER.USERCHECKBINDPHONEREQ = USERCHECKBINDPHONEREQ;
    var USERCHECKBINDPHONERESP = (function () {
        function USERCHECKBINDPHONERESP() {
        }
        return USERCHECKBINDPHONERESP;
    }());
    GAMECENTER.USERCHECKBINDPHONERESP = USERCHECKBINDPHONERESP;
    var USERFINDPWDSENDCODEREQ = (function () {
        function USERFINDPWDSENDCODEREQ() {
        }
        return USERFINDPWDSENDCODEREQ;
    }());
    GAMECENTER.USERFINDPWDSENDCODEREQ = USERFINDPWDSENDCODEREQ;
    var USERFINDPWDSENDCODERESP = (function () {
        function USERFINDPWDSENDCODERESP() {
        }
        return USERFINDPWDSENDCODERESP;
    }());
    GAMECENTER.USERFINDPWDSENDCODERESP = USERFINDPWDSENDCODERESP;
    var USERFINDPWDCHANGEPWDREQ = (function () {
        function USERFINDPWDCHANGEPWDREQ() {
        }
        return USERFINDPWDCHANGEPWDREQ;
    }());
    GAMECENTER.USERFINDPWDCHANGEPWDREQ = USERFINDPWDCHANGEPWDREQ;
    var USERFINDPWDCHANGEPWDRESP = (function () {
        function USERFINDPWDCHANGEPWDRESP() {
        }
        return USERFINDPWDCHANGEPWDRESP;
    }());
    GAMECENTER.USERFINDPWDCHANGEPWDRESP = USERFINDPWDCHANGEPWDRESP;
    //新平台
    //新获取礼包列表
    var GETALLGIFTTYPEREQNEW = (function (_super) {
        __extends(GETALLGIFTTYPEREQNEW, _super);
        function GETALLGIFTTYPEREQNEW() {
            _super.apply(this, arguments);
        }
        return GETALLGIFTTYPEREQNEW;
    }(GETALLGIFTTYPEREQ));
    GAMECENTER.GETALLGIFTTYPEREQNEW = GETALLGIFTTYPEREQNEW;
    var GETALLGIFTTYPEINFONEW = (function (_super) {
        __extends(GETALLGIFTTYPEINFONEW, _super);
        function GETALLGIFTTYPEINFONEW() {
            _super.apply(this, arguments);
        }
        return GETALLGIFTTYPEINFONEW;
    }(GETALLGIFTTYPEINFO));
    GAMECENTER.GETALLGIFTTYPEINFONEW = GETALLGIFTTYPEINFONEW;
    var GETALLGIFTTYPEINFORESPNEW = (function () {
        function GETALLGIFTTYPEINFORESPNEW() {
        }
        return GETALLGIFTTYPEINFORESPNEW;
    }());
    GAMECENTER.GETALLGIFTTYPEINFORESPNEW = GETALLGIFTTYPEINFORESPNEW;
    //获取游戏活动列表
    var GAMEACTIVITYINFOREQ = (function () {
        function GAMEACTIVITYINFOREQ() {
        }
        return GAMEACTIVITYINFOREQ;
    }());
    GAMECENTER.GAMEACTIVITYINFOREQ = GAMEACTIVITYINFOREQ;
    var GAMEACTIVITYINFO = (function () {
        function GAMEACTIVITYINFO() {
        }
        return GAMEACTIVITYINFO;
    }());
    GAMECENTER.GAMEACTIVITYINFO = GAMEACTIVITYINFO;
    var GAMEACTIVITYINFOLISTRESP = (function () {
        function GAMEACTIVITYINFOLISTRESP() {
        }
        return GAMEACTIVITYINFOLISTRESP;
    }());
    GAMECENTER.GAMEACTIVITYINFOLISTRESP = GAMEACTIVITYINFOLISTRESP;
    //获取热门搜索列表
    var HOTTOPGAMEINFOREQ = (function () {
        function HOTTOPGAMEINFOREQ() {
        }
        return HOTTOPGAMEINFOREQ;
    }());
    GAMECENTER.HOTTOPGAMEINFOREQ = HOTTOPGAMEINFOREQ;
    var HOTTOPGAMEINFO = (function () {
        function HOTTOPGAMEINFO() {
        }
        return HOTTOPGAMEINFO;
    }());
    GAMECENTER.HOTTOPGAMEINFO = HOTTOPGAMEINFO;
    var HOTTOPGAMEINFOLISTRESP = (function () {
        function HOTTOPGAMEINFOLISTRESP() {
        }
        return HOTTOPGAMEINFOLISTRESP;
    }());
    GAMECENTER.HOTTOPGAMEINFOLISTRESP = HOTTOPGAMEINFOLISTRESP;
    //获取用户VIP等级
    var GSUSERLVREQ = (function () {
        function GSUSERLVREQ() {
        }
        return GSUSERLVREQ;
    }());
    GAMECENTER.GSUSERLVREQ = GSUSERLVREQ;
    var GSUSERLVRESP = (function () {
        function GSUSERLVRESP() {
        }
        return GSUSERLVRESP;
    }());
    GAMECENTER.GSUSERLVRESP = GSUSERLVRESP;
    var GSENTERGAMEACREQ = (function () {
        function GSENTERGAMEACREQ() {
        }
        return GSENTERGAMEACREQ;
    }());
    GAMECENTER.GSENTERGAMEACREQ = GSENTERGAMEACREQ;
    var GETALLWELFTARETYPEREQ = (function () {
        function GETALLWELFTARETYPEREQ() {
        }
        return GETALLWELFTARETYPEREQ;
    }());
    GAMECENTER.GETALLWELFTARETYPEREQ = GETALLWELFTARETYPEREQ;
    var GETALLWELFTARETYPEINFO = (function () {
        function GETALLWELFTARETYPEINFO() {
        }
        return GETALLWELFTARETYPEINFO;
    }());
    GAMECENTER.GETALLWELFTARETYPEINFO = GETALLWELFTARETYPEINFO;
    var GETCODEINFOREQ2 = (function (_super) {
        __extends(GETCODEINFOREQ2, _super);
        function GETCODEINFOREQ2() {
            _super.apply(this, arguments);
        }
        return GETCODEINFOREQ2;
    }(GETCODEINFOREQ));
    GAMECENTER.GETCODEINFOREQ2 = GETCODEINFOREQ2;
    var GSSETCITYREQ = (function (_super) {
        __extends(GSSETCITYREQ, _super);
        function GSSETCITYREQ() {
            _super.apply(this, arguments);
        }
        return GSSETCITYREQ;
    }(GSUSERREQBASE));
    GAMECENTER.GSSETCITYREQ = GSSETCITYREQ;
    var GETALLACCOUNTINFOREQ = (function () {
        function GETALLACCOUNTINFOREQ() {
        }
        return GETALLACCOUNTINFOREQ;
    }());
    GAMECENTER.GETALLACCOUNTINFOREQ = GETALLACCOUNTINFOREQ;
    var GETALLACCOUNTINFO = (function () {
        function GETALLACCOUNTINFO() {
        }
        return GETALLACCOUNTINFO;
    }());
    GAMECENTER.GETALLACCOUNTINFO = GETALLACCOUNTINFO;
    var GETALLACCOUNTDETAILREQ = (function () {
        function GETALLACCOUNTDETAILREQ() {
        }
        return GETALLACCOUNTDETAILREQ;
    }());
    GAMECENTER.GETALLACCOUNTDETAILREQ = GETALLACCOUNTDETAILREQ;
    var GETALLACCOUNTDETAIL = (function () {
        function GETALLACCOUNTDETAIL() {
        }
        return GETALLACCOUNTDETAIL;
    }());
    GAMECENTER.GETALLACCOUNTDETAIL = GETALLACCOUNTDETAIL;
    var GSAPPLYACCOUNTREQ = (function () {
        function GSAPPLYACCOUNTREQ() {
        }
        return GSAPPLYACCOUNTREQ;
    }());
    GAMECENTER.GSAPPLYACCOUNTREQ = GSAPPLYACCOUNTREQ;
    var GSGETMESSAGEREQ = (function () {
        function GSGETMESSAGEREQ() {
        }
        return GSGETMESSAGEREQ;
    }());
    GAMECENTER.GSGETMESSAGEREQ = GSGETMESSAGEREQ;
    var GSGETMESSAGEINFO = (function () {
        function GSGETMESSAGEINFO() {
        }
        return GSGETMESSAGEINFO;
    }());
    GAMECENTER.GSGETMESSAGEINFO = GSGETMESSAGEINFO;
    var GSSETMSGREADSTATUSREQ = (function () {
        function GSSETMSGREADSTATUSREQ() {
        }
        return GSSETMSGREADSTATUSREQ;
    }());
    GAMECENTER.GSSETMSGREADSTATUSREQ = GSSETMSGREADSTATUSREQ;
    var GSDELETEMESSAGEREQ = (function () {
        function GSDELETEMESSAGEREQ() {
        }
        return GSDELETEMESSAGEREQ;
    }());
    GAMECENTER.GSDELETEMESSAGEREQ = GSDELETEMESSAGEREQ;
    var GSGETVIPQQREQ = (function () {
        function GSGETVIPQQREQ() {
        }
        return GSGETVIPQQREQ;
    }());
    GAMECENTER.GSGETVIPQQREQ = GSGETVIPQQREQ;
    var GSVIPQQINFO = (function () {
        function GSVIPQQINFO() {
        }
        return GSVIPQQINFO;
    }());
    GAMECENTER.GSVIPQQINFO = GSVIPQQINFO;
    var GSSENDPROBLEMREQ = (function () {
        function GSSENDPROBLEMREQ() {
        }
        return GSSENDPROBLEMREQ;
    }());
    GAMECENTER.GSSENDPROBLEMREQ = GSSENDPROBLEMREQ;
    var GSGETSERVERTABLEREQ = (function () {
        function GSGETSERVERTABLEREQ() {
        }
        return GSGETSERVERTABLEREQ;
    }());
    GAMECENTER.GSGETSERVERTABLEREQ = GSGETSERVERTABLEREQ;
    var GSSERVERTABLEINFO = (function () {
        function GSSERVERTABLEINFO() {
        }
        return GSSERVERTABLEINFO;
    }());
    GAMECENTER.GSSERVERTABLEINFO = GSSERVERTABLEINFO;
    var GSCHECKUSERLEVELREQ = (function () {
        function GSCHECKUSERLEVELREQ() {
        }
        return GSCHECKUSERLEVELREQ;
    }());
    GAMECENTER.GSCHECKUSERLEVELREQ = GSCHECKUSERLEVELREQ;
    var GSSHAREGAMEREQ = (function () {
        function GSSHAREGAMEREQ() {
        }
        return GSSHAREGAMEREQ;
    }());
    GAMECENTER.GSSHAREGAMEREQ = GSSHAREGAMEREQ;
    //保存用户信息到本地
    function SaveUserInfo() {
        utils.setCookie("GSUSERINFO", GAMECENTER.userinfo);
        if (!GAMECENTER.historyUsers) {
            LoadHistoryUsers();
            if (!GAMECENTER.historyUsers)
                GAMECENTER.historyUsers = [];
        }
        if (!GAMECENTER.userinfo)
            return;
        for (var i = 0; i < GAMECENTER.historyUsers.length; i++) {
            if (GAMECENTER.historyUsers[i].userid == GAMECENTER.userinfo.userid) {
                GAMECENTER.historyUsers.splice(i, 1);
                break;
            }
        }
        GAMECENTER.historyUsers.push({
            userid: GAMECENTER.userinfo.userid,
            sdkloginid: GAMECENTER.userinfo.sdkloginid,
            nickname: GAMECENTER.userinfo.nickname,
            phone: GAMECENTER.userinfo.phone,
            email: GAMECENTER.userinfo.email,
            headico: GAMECENTER.userinfo.headico,
            session: GAMECENTER.userinfo.session
        });
        SaveHistoryUsers();
    }
    GAMECENTER.SaveUserInfo = SaveUserInfo;
    //从本地加载用户信息
    function LoadUserInfo() {
        return utils.getCookie("GSUSERINFO");
    }
    GAMECENTER.LoadUserInfo = LoadUserInfo;
    function LoadHistoryUsers() {
        GAMECENTER.historyUsers = utils.getCookie("GSHistoryUsers");
    }
    GAMECENTER.LoadHistoryUsers = LoadHistoryUsers;
    function SaveHistoryUsers() {
        utils.setCookie("GSHistoryUsers", GAMECENTER.historyUsers);
    }
    GAMECENTER.SaveHistoryUsers = SaveHistoryUsers;
    //验证本地用户信息
    function CheckUserLogin(cb) {
        var session = null;
        if (!GAMECENTER.userinfo)
            GAMECENTER.userinfo = LoadUserInfo();
        if (!GAMECENTER.userinfo) {
        }
        else
            session = GAMECENTER.userinfo.session;
        //取得上一个页面URL
        var fromurl;
        if (sessionStorage["currenturl"] == window.location.href) {
            fromurl = sessionStorage["prevurl"];
            if (!fromurl)
                fromurl = "";
        }
        else {
            fromurl = sessionStorage["currenturl"];
            if (!fromurl)
                fromurl = "";
            sessionStorage["prevurl"] = fromurl;
            sessionStorage["currenturl"] = window.location.href;
        }
        if (!fromurl)
            fromurl = document.referrer;
        gsCheckSession({ mysession: session, channel: GetChannel(), referrer: fromurl, currenturl: window.location.href }, function (resp) {
            if (resp.errno != 0) {
                GAMECENTER.userinfo = null;
                SaveUserInfo();
                cb(null);
                console.log(resp.message);
                return;
            }
            GAMECENTER.userinfo = resp.data;
            SaveUserInfo();
            cb(GAMECENTER.userinfo);
        });
    }
    GAMECENTER.CheckUserLogin = CheckUserLogin;
    //自动登录
    function UserAutoLogin(cb) {
        CheckUserLogin(function (user) {
            if (user) {
                cb(user);
                return;
            }
            else {
                cb(null);
            }
        });
    }
    GAMECENTER.UserAutoLogin = UserAutoLogin;
    function getNextSession(param, cb) {
        PostServer("getnextsession", param, cb);
    }
    GAMECENTER.getNextSession = getNextSession;
    function gsCheckSession(param, cb) {
        PostServer("gschecksession", param, cb);
    }
    GAMECENTER.gsCheckSession = gsCheckSession;
    function gsUserLogin(param, cb) {
        PostServer("gsuserlogin", param, cb);
    }
    GAMECENTER.gsUserLogin = gsUserLogin;
    function gsUserLogin_old(param, cb) {
        PostServer("gsuserlogin_old", param, cb);
    }
    GAMECENTER.gsUserLogin_old = gsUserLogin_old;
    //微端QQ登录
    function gsUserLogin_qq(param, cb) {
        PostServer("gsuserlogin_qq", param, cb);
    }
    GAMECENTER.gsUserLogin_qq = gsUserLogin_qq;
    //微端微信登录
    function gsUserLogin_wx(param, cb) {
        PostServer("gsuserlogin_wx", param, cb);
    }
    GAMECENTER.gsUserLogin_wx = gsUserLogin_wx;
    function gsUserReg(param, cb) {
        if (!param.channel)
            param.channel = GetChannel();
        PostServer("gsuserreg", param, cb);
    }
    GAMECENTER.gsUserReg = gsUserReg;
    function gsUserRandNick(param, cb) {
        PostServer("gsuserrandnick", param, cb);
    }
    GAMECENTER.gsUserRandNick = gsUserRandNick;
    function gsUserSetHeadIco(param, file, cb) {
        PostServer("gsusersetheadico", param, cb, [{ head: file }]);
    }
    GAMECENTER.gsUserSetHeadIco = gsUserSetHeadIco;
    function gsUserSetNickName(param, cb) {
        PostServer("gsusersetnickname", param, cb);
    }
    GAMECENTER.gsUserSetNickName = gsUserSetNickName;
    function gsUserSetPhone(param, cb) {
        PostServer("gsusersetphone", param, cb);
    }
    GAMECENTER.gsUserSetPhone = gsUserSetPhone;
    function gsUserSendPhoneCode(param, cb) {
        PostServer("gsusersendphonecode", param, cb);
    }
    GAMECENTER.gsUserSendPhoneCode = gsUserSendPhoneCode;
    function gsUserLoginSendCode(param, cb) {
        PostServer("gsuserloginsendcode", param, cb);
    }
    GAMECENTER.gsUserLoginSendCode = gsUserLoginSendCode;
    function gsUserSetAddr(param, cb) {
        PostServer("gsusersetaddr", param, cb);
    }
    GAMECENTER.gsUserSetAddr = gsUserSetAddr;
    function gsUserChangePwd(param, cb) {
        PostServer("gsuserchangepwd", param, cb);
    }
    GAMECENTER.gsUserChangePwd = gsUserChangePwd;
    function gsUserGetPkAppList(param, cb) {
        PostServer("gsusergetpkapplist", param, cb);
    }
    GAMECENTER.gsUserGetPkAppList = gsUserGetPkAppList;
    function gsUserGetH5AppList(param, cb) {
        PostServer("gsusergeth5applist", param, cb);
    }
    GAMECENTER.gsUserGetH5AppList = gsUserGetH5AppList;
    function gsUserGetShopGoodsList(param, cb) {
        PostServer("gsusergetshopgoodslist", param, cb);
    }
    GAMECENTER.gsUserGetShopGoodsList = gsUserGetShopGoodsList;
    function gsUserExchange(param, cb) {
        PostServer("gsuserexchange", param, cb);
    }
    GAMECENTER.gsUserExchange = gsUserExchange;
    function gsUserGetExchangeRecord(param, cb) {
        PostServer("gsusergetexchangerecord", param, cb);
    }
    GAMECENTER.gsUserGetExchangeRecord = gsUserGetExchangeRecord;
    function gsUserGetBannerData(param, cb) {
        PostServer("gsusergetbannerdata", param, cb);
    }
    GAMECENTER.gsUserGetBannerData = gsUserGetBannerData;
    function gsUserPayCreate(param, cb) {
        if (!param.channel)
            param.channel = GetChannel();
        PostServer("gsuserpaycreate", param, cb);
    }
    GAMECENTER.gsUserPayCreate = gsUserPayCreate;
    function gsUserPayDel(param, cb) {
        PostServer("gsuserpaydel", param, cb);
    }
    GAMECENTER.gsUserPayDel = gsUserPayDel;
    function gsUserWaitPayResult(param, cb) {
        PostServer("gsuserwaitpayresult", param, cb);
    }
    GAMECENTER.gsUserWaitPayResult = gsUserWaitPayResult;
    function gsUserWxCode(param, cb) {
        PostServer("gsuserwxcode", param, cb);
    }
    GAMECENTER.gsUserWxCode = gsUserWxCode;
    function gsUserPayDiscount(param, cb) {
        PostServer("gsuserpaydiscount", param, cb);
    }
    GAMECENTER.gsUserPayDiscount = gsUserPayDiscount;
    function gsUserQueryWxPay(param, cb) {
        PostServer("gsuserquerywxpay", param, cb);
    }
    GAMECENTER.gsUserQueryWxPay = gsUserQueryWxPay;
    function getRecentPlayH5AppList(param, cb) {
        PostServer("getrecentplayh5applist", param, cb);
    }
    GAMECENTER.getRecentPlayH5AppList = getRecentPlayH5AppList;
    function gsusergeth5applistbyname(param, cb) {
        PostServer("gsusergeth5applistbyname", param, cb);
    }
    GAMECENTER.gsusergeth5applistbyname = gsusergeth5applistbyname;
    function gsUserUnSetPhone(param, cb) {
        PostServer("gsuserunsetphone", param, cb);
    }
    GAMECENTER.gsUserUnSetPhone = gsUserUnSetPhone;
    function gsUserChangePwd2(param, cb) {
        PostServer("gsuserchangepwd2", param, cb);
    }
    GAMECENTER.gsUserChangePwd2 = gsUserChangePwd2;
    function getdefaultImgs(cb) {
        PostServer("getdefaultImgs", {}, cb);
    }
    GAMECENTER.getdefaultImgs = getdefaultImgs;
    function gsUserSetHeadIco2(param, cb) {
        PostServer("gsusersetheadico2", param, cb);
    }
    GAMECENTER.gsUserSetHeadIco2 = gsUserSetHeadIco2;
    function gsUserLoginWeixin(param, cb) {
        PostServer("gsUserLoginWeixin", param, cb);
    }
    GAMECENTER.gsUserLoginWeixin = gsUserLoginWeixin;
    function gsUserLoginQQ(param, cb) {
        PostServer("gsUserLoginQQ", param, cb);
    }
    GAMECENTER.gsUserLoginQQ = gsUserLoginQQ;
    function openShare(param, cb) {
        PostServer("openshare", param, cb);
    }
    GAMECENTER.openShare = openShare;
    function getWXConfigSign(param, cb) {
        PostServer("getwxconfigsign", param, cb);
    }
    GAMECENTER.getWXConfigSign = getWXConfigSign;
    function gsGetAllGiftType(param, cb) {
        PostServer("gsgetallgifttype", param, cb);
    }
    GAMECENTER.gsGetAllGiftType = gsGetAllGiftType;
    function getCodeInfo(param, cb) {
        PostServer("getcodeinfo", param, cb);
    }
    GAMECENTER.getCodeInfo = getCodeInfo;
    function getCodeInfo_new(param, cb) {
        PostServer("getcodeinfo_new", param, cb);
    }
    GAMECENTER.getCodeInfo_new = getCodeInfo_new;
    function getGettedStatus(param, cb) {
        PostServer("getgettedstatus", param, cb);
    }
    GAMECENTER.getGettedStatus = getGettedStatus;
    function getGameAllGift(param, cb) {
        PostServer("getgameallgift", param, cb);
    }
    GAMECENTER.getGameAllGift = getGameAllGift;
    function gsCheckPhone(param, cb) {
        PostServer("gscheckphone", param, cb);
    }
    GAMECENTER.gsCheckPhone = gsCheckPhone;
    function gsGetPhoneUser(param, cb) {
        PostServer("gsgetphoneuser", param, cb);
    }
    GAMECENTER.gsGetPhoneUser = gsGetPhoneUser;
    function gsGetPhoneCode(param, cb) {
        PostServer("gsgetphonecode", param, cb);
    }
    GAMECENTER.gsGetPhoneCode = gsGetPhoneCode;
    //新修改密码
    function gsUserCheckBindPhone(para, cb) {
        PostServer("gsusercheckbindphone", para, cb);
    }
    GAMECENTER.gsUserCheckBindPhone = gsUserCheckBindPhone;
    function gsUserFindPwdSendCode(para, cb) {
        PostServer("gsuserfindpwdsendcode", para, cb);
    }
    GAMECENTER.gsUserFindPwdSendCode = gsUserFindPwdSendCode;
    function gsUserFindPwdChangePwd(para, cb) {
        PostServer("gsuserfindpwdchangepwd", para, cb);
    }
    GAMECENTER.gsUserFindPwdChangePwd = gsUserFindPwdChangePwd;
    function gsGetAllGiftType_New(param, cb) {
        PostServer("gsgetallgifttype_new", param, cb);
    }
    GAMECENTER.gsGetAllGiftType_New = gsGetAllGiftType_New;
    function getGameActivityInfo(param, cb) {
        PostServer("getgameactivityinfo", param, cb);
    }
    GAMECENTER.getGameActivityInfo = getGameActivityInfo;
    function getHotTopGame(param, cb) {
        PostServer("gethottopgame", param, cb);
    }
    GAMECENTER.getHotTopGame = getHotTopGame;
    function gsUserSendMailCode(param, cb) {
        PostServer("gsusersendmailcode", param, cb);
    }
    GAMECENTER.gsUserSendMailCode = gsUserSendMailCode;
    function gsUserSetMail(param, cb) {
        PostServer("gsusersetmail", param, cb);
    }
    GAMECENTER.gsUserSetMail = gsUserSetMail;
    function gsUserLv(param, cb) {
        PostServer("gsuserlv", param, cb);
    }
    GAMECENTER.gsUserLv = gsUserLv;
    function GSEnterGameAC(param, cb) {
        PostServer("gsentergameac", param, cb);
    }
    GAMECENTER.GSEnterGameAC = GSEnterGameAC;
    function GetAllWelftareType(param, cb) {
        PostServer("getallwelftaretype", param, cb);
    }
    GAMECENTER.GetAllWelftareType = GetAllWelftareType;
    function getCodeInfo2(param, cb) {
        PostServer("getcodeinfo2", param, cb);
    }
    GAMECENTER.getCodeInfo2 = getCodeInfo2;
    function gsSetCity(param, cb) {
        PostServer("gssetcity", param, cb);
    }
    GAMECENTER.gsSetCity = gsSetCity;
    function gsGetAllAcount(param, cb) {
        PostServer("gsgetallacount", param, cb);
    }
    GAMECENTER.gsGetAllAcount = gsGetAllAcount;
    function gsGetAllAcountDetail(param, cb) {
        PostServer("gsgetallacountdetail", param, cb);
    }
    GAMECENTER.gsGetAllAcountDetail = gsGetAllAcountDetail;
    function gsApplyAccount(param, cb) {
        PostServer("gsapplyaccount", param, cb);
    }
    GAMECENTER.gsApplyAccount = gsApplyAccount;
    function gsGetMessage(param, cb) {
        PostServer("gsgetmessage", param, cb);
    }
    GAMECENTER.gsGetMessage = gsGetMessage;
    function gsGetVipQQ(param, cb) {
        PostServer("gsgetvipqq", param, cb);
    }
    GAMECENTER.gsGetVipQQ = gsGetVipQQ;
    function gsSetMsgReadStatus(param, cb) {
        PostServer("gssetmsgreadstatus", param, cb);
    }
    GAMECENTER.gsSetMsgReadStatus = gsSetMsgReadStatus;
    function gsDeleteMsg(param, cb) {
        PostServer("gsdeletemsg", param, cb);
    }
    GAMECENTER.gsDeleteMsg = gsDeleteMsg;
    function gsSendProblem(param, cb) {
        PostServer("gssendproblem", param, cb);
    }
    GAMECENTER.gsSendProblem = gsSendProblem;
    function gsGetServerTable(param, cb) {
        PostServer("gsgetservertable", param, cb);
    }
    GAMECENTER.gsGetServerTable = gsGetServerTable;
    function gsCheckUserLevel(param, cb) {
        PostServer("gscheckuserlevel", param, cb);
    }
    GAMECENTER.gsCheckUserLevel = gsCheckUserLevel;
    function gsShareGame(param, cb) {
        PostServer("gssharegame", param, cb);
    }
    GAMECENTER.gsShareGame = gsShareGame;
    //PK服务器的websocket
    var PKServer = (function () {
        function PKServer() {
            this.isLogin = false;
        }
        PKServer.prototype.Close = function () {
            if (this.wsocket) {
                this.wsocket.onopen = null;
                this.wsocket.onclose = null;
                this.wsocket.onerror = null;
                this.wsocket.onmessage = null;
                this.wsocket.close();
                this.wsocket = null;
            }
        };
        PKServer.prototype.Connect = function (session, gameid, onopen, onclose, onerror, onmessage) {
            var _this = this;
            this.Close();
            var url = utils.g_pkserverurl;
            this.wsocket = new WebSocket(url);
            this.wsocket.onopen = function (ev) {
                if (!_this.isLogin) {
                    var dat = new GSUSERENTERPKGAMEREQ();
                    dat.mysession = session;
                    dat.gameid = gameid;
                    onopen(ev);
                    _this.SendData("gsuserenterpkgame", dat);
                }
            };
            this.wsocket.onmessage = function (ev) {
                var ret = JSON.parse(ev.data);
                if (!ret.name) {
                    alert("数据无效");
                    return;
                }
                if (!_this.isLogin) {
                    if (ret.name == "gsuserenterpkgame") {
                        if (ret.errno != 0) {
                            alert(ret.message);
                            return;
                        }
                        _this.isLogin = true;
                    }
                }
                onmessage(ret);
            };
            this.wsocket.onclose = onclose;
            this.wsocket.onerror = onerror;
        };
        PKServer.prototype.SendData = function (name, data) {
            var dat = new WEBSOCKETPACK();
            dat.name = name;
            dat.data = data;
            var str = JSON.stringify(dat);
            if (!this.wsocket)
                return;
            this.wsocket.send(str);
        };
        return PKServer;
    }());
    GAMECENTER.PKServer = PKServer;
    /*************************新平台全新数据******************************************/
    var GAMETYPEREQ = (function () {
        function GAMETYPEREQ() {
        }
        return GAMETYPEREQ;
    }());
    GAMECENTER.GAMETYPEREQ = GAMETYPEREQ;
    var GAMETYPERESP = (function () {
        function GAMETYPERESP() {
        }
        return GAMETYPERESP;
    }());
    GAMECENTER.GAMETYPERESP = GAMETYPERESP;
    var APPINFO = (function () {
        function APPINFO() {
        }
        return APPINFO;
    }());
    GAMECENTER.APPINFO = APPINFO;
    var GAMEDETAILREQ = (function () {
        function GAMEDETAILREQ() {
        }
        return GAMEDETAILREQ;
    }());
    GAMECENTER.GAMEDETAILREQ = GAMEDETAILREQ;
    //获取游戏具体信息
    var GAMEDETAILINFO = (function (_super) {
        __extends(GAMEDETAILINFO, _super);
        function GAMEDETAILINFO() {
            _super.apply(this, arguments);
        }
        return GAMEDETAILINFO;
    }(GETALLGIFTTYPEINFO));
    GAMECENTER.GAMEDETAILINFO = GAMEDETAILINFO;
    var GAMEDETAILACTIVITYINFO = (function () {
        function GAMEDETAILACTIVITYINFO() {
        }
        return GAMEDETAILACTIVITYINFO;
    }());
    GAMECENTER.GAMEDETAILACTIVITYINFO = GAMEDETAILACTIVITYINFO;
    var COLLECTGAMEREQ = (function () {
        function COLLECTGAMEREQ() {
        }
        return COLLECTGAMEREQ;
    }());
    GAMECENTER.COLLECTGAMEREQ = COLLECTGAMEREQ;
    var GIFTBAGREQ = (function () {
        function GIFTBAGREQ() {
        }
        return GIFTBAGREQ;
    }());
    GAMECENTER.GIFTBAGREQ = GIFTBAGREQ;
    var MYGIFTBAGINFO = (function () {
        function MYGIFTBAGINFO() {
        }
        return MYGIFTBAGINFO;
    }());
    GAMECENTER.MYGIFTBAGINFO = MYGIFTBAGINFO;
    var GETGIFTCODEINFO = (function () {
        function GETGIFTCODEINFO() {
        }
        return GETGIFTCODEINFO;
    }());
    GAMECENTER.GETGIFTCODEINFO = GETGIFTCODEINFO;
    var CHANGESEXREQ = (function (_super) {
        __extends(CHANGESEXREQ, _super);
        function CHANGESEXREQ() {
            _super.apply(this, arguments);
        }
        return CHANGESEXREQ;
    }(GSUSERREQBASE));
    GAMECENTER.CHANGESEXREQ = CHANGESEXREQ;
    var GETRECHAGEREQ = (function () {
        function GETRECHAGEREQ() {
        }
        return GETRECHAGEREQ;
    }());
    GAMECENTER.GETRECHAGEREQ = GETRECHAGEREQ;
    var GETRECHAGEINFO = (function () {
        function GETRECHAGEINFO() {
        }
        return GETRECHAGEINFO;
    }());
    GAMECENTER.GETRECHAGEINFO = GETRECHAGEINFO;
    var GETRADOMNAMEREQ = (function () {
        function GETRADOMNAMEREQ() {
        }
        return GETRADOMNAMEREQ;
    }());
    GAMECENTER.GETRADOMNAMEREQ = GETRADOMNAMEREQ;
    var RADOMNAMELISTREQ = (function () {
        function RADOMNAMELISTREQ() {
        }
        return RADOMNAMELISTREQ;
    }());
    GAMECENTER.RADOMNAMELISTREQ = RADOMNAMELISTREQ;
    var GETACTIVEREQ = (function () {
        function GETACTIVEREQ() {
        }
        return GETACTIVEREQ;
    }());
    GAMECENTER.GETACTIVEREQ = GETACTIVEREQ;
    var GETACTIVEINFO = (function () {
        function GETACTIVEINFO() {
        }
        return GETACTIVEINFO;
    }());
    GAMECENTER.GETACTIVEINFO = GETACTIVEINFO;
    var GETLOTTERYLISTREQ = (function (_super) {
        __extends(GETLOTTERYLISTREQ, _super);
        function GETLOTTERYLISTREQ() {
            _super.apply(this, arguments);
        }
        return GETLOTTERYLISTREQ;
    }(GSUSERREQBASE));
    GAMECENTER.GETLOTTERYLISTREQ = GETLOTTERYLISTREQ;
    var LOTTERYINFO = (function () {
        function LOTTERYINFO() {
        }
        return LOTTERYINFO;
    }());
    GAMECENTER.LOTTERYINFO = LOTTERYINFO;
    var LOTTERYLISTREQ = (function () {
        function LOTTERYLISTREQ() {
        }
        return LOTTERYLISTREQ;
    }());
    GAMECENTER.LOTTERYLISTREQ = LOTTERYLISTREQ;
    var LOTTERYLISTINFO = (function () {
        function LOTTERYLISTINFO() {
        }
        return LOTTERYLISTINFO;
    }());
    GAMECENTER.LOTTERYLISTINFO = LOTTERYLISTINFO;
    var HOTGAMELISTINFO = (function () {
        function HOTGAMELISTINFO() {
        }
        return HOTGAMELISTINFO;
    }());
    GAMECENTER.HOTGAMELISTINFO = HOTGAMELISTINFO;
    var UPPROBLEMREQ = (function () {
        function UPPROBLEMREQ() {
        }
        return UPPROBLEMREQ;
    }());
    GAMECENTER.UPPROBLEMREQ = UPPROBLEMREQ;
    var COUNTBANNERREQ = (function () {
        function COUNTBANNERREQ() {
        }
        return COUNTBANNERREQ;
    }());
    GAMECENTER.COUNTBANNERREQ = COUNTBANNERREQ;
    //export function gsGetradomname(param: GETRADOMNAMEREQ, cb: (para: ServerResp) => void) {
    //    PostServer("getradomname", param, cb);
    //}
    function gsGetgametypelist(param, cb) {
        PostServer("gsgetgametypelist", param, cb);
    }
    GAMECENTER.gsGetgametypelist = gsGetgametypelist;
    function gsGetshowgamelist(param, cb) {
        PostServer("gsgetshowgamelist", param, cb);
    }
    GAMECENTER.gsGetshowgamelist = gsGetshowgamelist;
    function getActivityList(param, cb) {
        PostServer("getactivitylist", param, cb);
    }
    GAMECENTER.getActivityList = getActivityList;
    function getGameDetailList(param, cb) {
        PostServer("getgamedetaillist", param, cb);
    }
    GAMECENTER.getGameDetailList = getGameDetailList;
    function getGameDetailAT(param, cb) {
        PostServer("getgamedetailactivity", param, cb);
    }
    GAMECENTER.getGameDetailAT = getGameDetailAT;
    function getCollectGame(param, cb) {
        PostServer("getcollectgame", param, cb);
    }
    GAMECENTER.getCollectGame = getCollectGame;
    function getMyCollectGame(param, cb) {
        PostServer("getmycollectgame", param, cb);
    }
    GAMECENTER.getMyCollectGame = getMyCollectGame;
    function getMygiftBagList(param, cb) {
        PostServer("getmygiftbaglist", param, cb);
    }
    GAMECENTER.getMygiftBagList = getMygiftBagList;
    function changeSex(param, cb) {
        PostServer("changeusersex", param, cb);
    }
    GAMECENTER.changeSex = changeSex;
    function getdefaultImgs_second(cb) {
        PostServer("getdefaultImgssecond", {}, cb);
    }
    GAMECENTER.getdefaultImgs_second = getdefaultImgs_second;
    function getAllGiftList(param, cb) {
        PostServer("getallgiftlist", param, cb);
    }
    GAMECENTER.getAllGiftList = getAllGiftList;
    function getGifiCode(param, cb) {
        PostServer("getgiftcodeinfo", param, cb);
    }
    GAMECENTER.getGifiCode = getGifiCode;
    function getRechageList(param, cb) {
        PostServer("getrechagelist", param, cb);
    }
    GAMECENTER.getRechageList = getRechageList;
    function getRadomRechage(param, cb) {
        PostServer("getradomrechage", param, cb);
    }
    GAMECENTER.getRadomRechage = getRadomRechage;
    function getActiveList(param, cb) {
        PostServer("getactivelist", param, cb);
    }
    GAMECENTER.getActiveList = getActiveList;
    function getTjGameList(param, cb) {
        PostServer("gettjgamelist", param, cb);
    }
    GAMECENTER.getTjGameList = getTjGameList;
    function getLotteryList(param, cb) {
        PostServer("getlotterylist", param, cb);
    }
    GAMECENTER.getLotteryList = getLotteryList;
    function createLottery(param, cb) {
        PostServer("createlottery", param, cb);
    }
    GAMECENTER.createLottery = createLottery;
    function addLotteryList(param, cb) {
        PostServer("addlotterylist", param, cb);
    }
    GAMECENTER.addLotteryList = addLotteryList;
    function listLottery(param, cb) {
        PostServer("listlottery", param, cb);
    }
    GAMECENTER.listLottery = listLottery;
    function dellistLottery(param, cb) {
        PostServer("dellistlottery", param, cb);
    }
    GAMECENTER.dellistLottery = dellistLottery;
    function getHotGameList(param, cb) {
        PostServer("gethotgamelist", param, cb);
    }
    GAMECENTER.getHotGameList = getHotGameList;
    function getActivityBanner(param, cb) {
        PostServer("getactivitybanner", param, cb);
    }
    GAMECENTER.getActivityBanner = getActivityBanner;
    function upProblem(param, cb) {
        PostServer("upproblem", param, cb);
    }
    GAMECENTER.upProblem = upProblem;
    function countBanner(param, cb) {
        PostServer("countbanner", param, cb);
    }
    GAMECENTER.countBanner = countBanner;
    //export function phoneLogin(param: GSUSERLOGINREQ, cb: (para: ServerResp) => void) {
    //    PostServer("phonelogin", param, cb);
    //}
    function newMessage() {
        var newmessage = [];
        GAMECENTER.gsGetMessage({ loginid: GAMECENTER.userinfo.sdkloginid }, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data = resp.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].rsld == null) {
                    newmessage.push(data[i]);
                }
            }
            if (data.length == 0) {
                $("#message_point").css("display", "none");
                $("#message_point_footer").css("display", "none");
            }
            else {
                if (newmessage.length != 0) {
                    $("#message_point").css("display", "");
                    $("#message_point_footer").css("display", "");
                }
                else {
                    $("#message_point").css("display", "none");
                    $("#message_point_footer").css("display", "none");
                }
            }
        });
    }
    GAMECENTER.newMessage = newMessage;
})(GAMECENTER || (GAMECENTER = {}));
//管理员后台
var ADMIN;
(function (ADMIN) {
    var ADMINREQBASE = (function () {
        function ADMINREQBASE() {
        }
        return ADMINREQBASE;
    }());
    ADMIN.ADMINREQBASE = ADMINREQBASE;
    var USERINFO = (function () {
        function USERINFO() {
        }
        return USERINFO;
    }());
    ADMIN.USERINFO = USERINFO;
    var CPUSERINFO = (function () {
        function CPUSERINFO() {
        }
        return CPUSERINFO;
    }());
    ADMIN.CPUSERINFO = CPUSERINFO;
    var SPUSERINFO = (function () {
        function SPUSERINFO() {
        }
        return SPUSERINFO;
    }());
    ADMIN.SPUSERINFO = SPUSERINFO;
    //PK游戏列表
    var ADMINGETPKAPPLISTREQ = (function (_super) {
        __extends(ADMINGETPKAPPLISTREQ, _super);
        function ADMINGETPKAPPLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETPKAPPLISTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETPKAPPLISTREQ = ADMINGETPKAPPLISTREQ;
    var PKAPPINFO = (function (_super) {
        __extends(PKAPPINFO, _super);
        function PKAPPINFO() {
            _super.apply(this, arguments);
        }
        return PKAPPINFO;
    }(GAMECENTER.PKAPPINFO));
    ADMIN.PKAPPINFO = PKAPPINFO;
    var ADMINGETPKAPPLISTRESP = (function () {
        function ADMINGETPKAPPLISTRESP() {
        }
        return ADMINGETPKAPPLISTRESP;
    }());
    ADMIN.ADMINGETPKAPPLISTRESP = ADMINGETPKAPPLISTRESP;
    //修改PK游戏信息
    var ADMINSAVEPKAPPINFOREQ = (function (_super) {
        __extends(ADMINSAVEPKAPPINFOREQ, _super);
        function ADMINSAVEPKAPPINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVEPKAPPINFOREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINSAVEPKAPPINFOREQ = ADMINSAVEPKAPPINFOREQ;
    var ADMINSAVEPKAPPINFORESP = (function () {
        function ADMINSAVEPKAPPINFORESP() {
        }
        return ADMINSAVEPKAPPINFORESP;
    }());
    ADMIN.ADMINSAVEPKAPPINFORESP = ADMINSAVEPKAPPINFORESP;
    //删除PK游戏
    var ADMINDELPKAPPREQ = (function (_super) {
        __extends(ADMINDELPKAPPREQ, _super);
        function ADMINDELPKAPPREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDELPKAPPREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINDELPKAPPREQ = ADMINDELPKAPPREQ;
    var ADMINDELPKAPPRESP = (function () {
        function ADMINDELPKAPPRESP() {
        }
        return ADMINDELPKAPPRESP;
    }());
    ADMIN.ADMINDELPKAPPRESP = ADMINDELPKAPPRESP;
    //H5游戏列表
    var ADMINGETH5APPLISTREQ = (function (_super) {
        __extends(ADMINGETH5APPLISTREQ, _super);
        function ADMINGETH5APPLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETH5APPLISTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETH5APPLISTREQ = ADMINGETH5APPLISTREQ;
    var H5APPINFO = (function (_super) {
        __extends(H5APPINFO, _super);
        function H5APPINFO() {
            _super.apply(this, arguments);
        }
        return H5APPINFO;
    }(GAMECENTER.H5APPINFO));
    ADMIN.H5APPINFO = H5APPINFO;
    var ADMINGETH5APPLISTRESP = (function () {
        function ADMINGETH5APPLISTRESP() {
        }
        return ADMINGETH5APPLISTRESP;
    }());
    ADMIN.ADMINGETH5APPLISTRESP = ADMINGETH5APPLISTRESP;
    //修改H5游戏信息
    var ADMINSAVEH5APPINFOREQ = (function (_super) {
        __extends(ADMINSAVEH5APPINFOREQ, _super);
        function ADMINSAVEH5APPINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVEH5APPINFOREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINSAVEH5APPINFOREQ = ADMINSAVEH5APPINFOREQ;
    var ADMINSAVEH5APPINFORESP = (function () {
        function ADMINSAVEH5APPINFORESP() {
        }
        return ADMINSAVEH5APPINFORESP;
    }());
    ADMIN.ADMINSAVEH5APPINFORESP = ADMINSAVEH5APPINFORESP;
    //删除H5游戏
    var ADMINDELH5APPREQ = (function (_super) {
        __extends(ADMINDELH5APPREQ, _super);
        function ADMINDELH5APPREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDELH5APPREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINDELH5APPREQ = ADMINDELH5APPREQ;
    var ADMINDELH5APPRESP = (function () {
        function ADMINDELH5APPRESP() {
        }
        return ADMINDELH5APPRESP;
    }());
    ADMIN.ADMINDELH5APPRESP = ADMINDELH5APPRESP;
    //取得商品列表
    var ADMINGETSHOPGOODSLISTREQ = (function (_super) {
        __extends(ADMINGETSHOPGOODSLISTREQ, _super);
        function ADMINGETSHOPGOODSLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETSHOPGOODSLISTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETSHOPGOODSLISTREQ = ADMINGETSHOPGOODSLISTREQ;
    var ADMINGETSHOPGOODSLISTRESP = (function () {
        function ADMINGETSHOPGOODSLISTRESP() {
        }
        return ADMINGETSHOPGOODSLISTRESP;
    }());
    ADMIN.ADMINGETSHOPGOODSLISTRESP = ADMINGETSHOPGOODSLISTRESP;
    //保存商品设置
    var ADMINSAVEGOODSINFOREQ = (function (_super) {
        __extends(ADMINSAVEGOODSINFOREQ, _super);
        function ADMINSAVEGOODSINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVEGOODSINFOREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINSAVEGOODSINFOREQ = ADMINSAVEGOODSINFOREQ;
    var ADMINSAVEGOODSINFORESP = (function () {
        function ADMINSAVEGOODSINFORESP() {
        }
        return ADMINSAVEGOODSINFORESP;
    }());
    ADMIN.ADMINSAVEGOODSINFORESP = ADMINSAVEGOODSINFORESP;
    //删除商品
    var ADMINDELGOODSREQ = (function (_super) {
        __extends(ADMINDELGOODSREQ, _super);
        function ADMINDELGOODSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDELGOODSREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINDELGOODSREQ = ADMINDELGOODSREQ;
    var ADMINDELGOODSRESP = (function () {
        function ADMINDELGOODSRESP() {
        }
        return ADMINDELGOODSRESP;
    }());
    ADMIN.ADMINDELGOODSRESP = ADMINDELGOODSRESP;
    //读取每周兑换商品
    var ADMINGETWEEKLYGOODSLISTREQ = (function (_super) {
        __extends(ADMINGETWEEKLYGOODSLISTREQ, _super);
        function ADMINGETWEEKLYGOODSLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETWEEKLYGOODSLISTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETWEEKLYGOODSLISTREQ = ADMINGETWEEKLYGOODSLISTREQ;
    var WEEKLYGOODINFO = (function () {
        function WEEKLYGOODINFO() {
        }
        return WEEKLYGOODINFO;
    }());
    ADMIN.WEEKLYGOODINFO = WEEKLYGOODINFO;
    var ADMINGETWEEKLYGOODSLISTRESP = (function () {
        function ADMINGETWEEKLYGOODSLISTRESP() {
        }
        return ADMINGETWEEKLYGOODSLISTRESP;
    }());
    ADMIN.ADMINGETWEEKLYGOODSLISTRESP = ADMINGETWEEKLYGOODSLISTRESP;
    //添加、保存每周兑换商品
    var ADMINSAVEWEEKLYGOODSINFOREQ = (function (_super) {
        __extends(ADMINSAVEWEEKLYGOODSINFOREQ, _super);
        function ADMINSAVEWEEKLYGOODSINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVEWEEKLYGOODSINFOREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINSAVEWEEKLYGOODSINFOREQ = ADMINSAVEWEEKLYGOODSINFOREQ;
    var ADMINSAVEWEEKLYGOODSINFORESP = (function () {
        function ADMINSAVEWEEKLYGOODSINFORESP() {
        }
        return ADMINSAVEWEEKLYGOODSINFORESP;
    }());
    ADMIN.ADMINSAVEWEEKLYGOODSINFORESP = ADMINSAVEWEEKLYGOODSINFORESP;
    //取得商城广告列表
    var ADMINGETSHOPADLISTREQ = (function (_super) {
        __extends(ADMINGETSHOPADLISTREQ, _super);
        function ADMINGETSHOPADLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETSHOPADLISTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETSHOPADLISTREQ = ADMINGETSHOPADLISTREQ;
    var SHOPADINFO = (function () {
        function SHOPADINFO() {
        }
        return SHOPADINFO;
    }());
    ADMIN.SHOPADINFO = SHOPADINFO;
    var ADMINGETSHOPADLISTRESP = (function () {
        function ADMINGETSHOPADLISTRESP() {
        }
        return ADMINGETSHOPADLISTRESP;
    }());
    ADMIN.ADMINGETSHOPADLISTRESP = ADMINGETSHOPADLISTRESP;
    //保存商城广告
    var ADMINSAVESHOPADREQ = (function (_super) {
        __extends(ADMINSAVESHOPADREQ, _super);
        function ADMINSAVESHOPADREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVESHOPADREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINSAVESHOPADREQ = ADMINSAVESHOPADREQ;
    var ADMINSAVESHOPADRESP = (function () {
        function ADMINSAVESHOPADRESP() {
        }
        return ADMINSAVESHOPADRESP;
    }());
    ADMIN.ADMINSAVESHOPADRESP = ADMINSAVESHOPADRESP;
    //删除商城广告
    var ADMINDELSHOPADREQ = (function (_super) {
        __extends(ADMINDELSHOPADREQ, _super);
        function ADMINDELSHOPADREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDELSHOPADREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINDELSHOPADREQ = ADMINDELSHOPADREQ;
    var ADMINDELSHOPADRESP = (function () {
        function ADMINDELSHOPADRESP() {
        }
        return ADMINDELSHOPADRESP;
    }());
    ADMIN.ADMINDELSHOPADRESP = ADMINDELSHOPADRESP;
    //删除每周兑换
    var ADMINDELWEEKLYGOODSREQ = (function (_super) {
        __extends(ADMINDELWEEKLYGOODSREQ, _super);
        function ADMINDELWEEKLYGOODSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDELWEEKLYGOODSREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINDELWEEKLYGOODSREQ = ADMINDELWEEKLYGOODSREQ;
    var ADMINDELWEEKLYGOODSRESP = (function () {
        function ADMINDELWEEKLYGOODSRESP() {
        }
        return ADMINDELWEEKLYGOODSRESP;
    }());
    ADMIN.ADMINDELWEEKLYGOODSRESP = ADMINDELWEEKLYGOODSRESP;
    //精彩活动
    var ADMINGETACTIVITYLISTREQ = (function (_super) {
        __extends(ADMINGETACTIVITYLISTREQ, _super);
        function ADMINGETACTIVITYLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETACTIVITYLISTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETACTIVITYLISTREQ = ADMINGETACTIVITYLISTREQ;
    var ACTIVITYINFO = (function () {
        function ACTIVITYINFO() {
        }
        return ACTIVITYINFO;
    }());
    ADMIN.ACTIVITYINFO = ACTIVITYINFO;
    var ADMINGETACTIVITYLISTRESP = (function () {
        function ADMINGETACTIVITYLISTRESP() {
        }
        return ADMINGETACTIVITYLISTRESP;
    }());
    ADMIN.ADMINGETACTIVITYLISTRESP = ADMINGETACTIVITYLISTRESP;
    //保存精彩活动
    var ADMINSAVEACTIVITYREQ = (function (_super) {
        __extends(ADMINSAVEACTIVITYREQ, _super);
        function ADMINSAVEACTIVITYREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVEACTIVITYREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINSAVEACTIVITYREQ = ADMINSAVEACTIVITYREQ;
    var ADMINSAVEACTIVITYRESP = (function () {
        function ADMINSAVEACTIVITYRESP() {
        }
        return ADMINSAVEACTIVITYRESP;
    }());
    ADMIN.ADMINSAVEACTIVITYRESP = ADMINSAVEACTIVITYRESP;
    //删除活动
    var ADMINDELACTIVITYREQ = (function (_super) {
        __extends(ADMINDELACTIVITYREQ, _super);
        function ADMINDELACTIVITYREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDELACTIVITYREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINDELACTIVITYREQ = ADMINDELACTIVITYREQ;
    var ADMINDELACTIVITYRESP = (function () {
        function ADMINDELACTIVITYRESP() {
        }
        return ADMINDELACTIVITYRESP;
    }());
    ADMIN.ADMINDELACTIVITYRESP = ADMINDELACTIVITYRESP;
    //取得用户兑换记录
    var ADMINGETEXCHANGERECORDREQ = (function (_super) {
        __extends(ADMINGETEXCHANGERECORDREQ, _super);
        function ADMINGETEXCHANGERECORDREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETEXCHANGERECORDREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETEXCHANGERECORDREQ = ADMINGETEXCHANGERECORDREQ;
    var ADMINGETEXCHANGERECORDRESP = (function () {
        function ADMINGETEXCHANGERECORDRESP() {
        }
        return ADMINGETEXCHANGERECORDRESP;
    }());
    ADMIN.ADMINGETEXCHANGERECORDRESP = ADMINGETEXCHANGERECORDRESP;
    //修改兑换状态
    var ADMINSAVEEXCHANGERECORDREQ = (function (_super) {
        __extends(ADMINSAVEEXCHANGERECORDREQ, _super);
        function ADMINSAVEEXCHANGERECORDREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVEEXCHANGERECORDREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINSAVEEXCHANGERECORDREQ = ADMINSAVEEXCHANGERECORDREQ;
    var ADMINSAVEEXCHANGERECORDRESP = (function () {
        function ADMINSAVEEXCHANGERECORDRESP() {
        }
        return ADMINSAVEEXCHANGERECORDRESP;
    }());
    ADMIN.ADMINSAVEEXCHANGERECORDRESP = ADMINSAVEEXCHANGERECORDRESP;
    //流量统计
    var ADMINGETFLOWSTATISTICSREQ = (function (_super) {
        __extends(ADMINGETFLOWSTATISTICSREQ, _super);
        function ADMINGETFLOWSTATISTICSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETFLOWSTATISTICSREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETFLOWSTATISTICSREQ = ADMINGETFLOWSTATISTICSREQ;
    var FLOWSTATISTICSDATA = (function () {
        function FLOWSTATISTICSDATA() {
            this.opencount = 0; //数量
            this.regcount = 0; //注册用户
            this.payusercount = 0; //付费用户
            this.paymoney = 0; //付费金额
        }
        return FLOWSTATISTICSDATA;
    }());
    ADMIN.FLOWSTATISTICSDATA = FLOWSTATISTICSDATA;
    var ADMINGETFLOWSTATISTICSRESP = (function () {
        function ADMINGETFLOWSTATISTICSRESP() {
        }
        return ADMINGETFLOWSTATISTICSRESP;
    }());
    ADMIN.ADMINGETFLOWSTATISTICSRESP = ADMINGETFLOWSTATISTICSRESP;
    //充值记录
    var ADMINGETRECHARGELISTREQ = (function (_super) {
        __extends(ADMINGETRECHARGELISTREQ, _super);
        function ADMINGETRECHARGELISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETRECHARGELISTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETRECHARGELISTREQ = ADMINGETRECHARGELISTREQ;
    var RECHARGEINFO = (function () {
        function RECHARGEINFO() {
        }
        return RECHARGEINFO;
    }());
    ADMIN.RECHARGEINFO = RECHARGEINFO;
    var ADMINGETRECHARGELISTRESP = (function () {
        function ADMINGETRECHARGELISTRESP() {
        }
        return ADMINGETRECHARGELISTRESP;
    }());
    ADMIN.ADMINGETRECHARGELISTRESP = ADMINGETRECHARGELISTRESP;
    //CP管理
    //取得CP列表
    var CPINFO = (function () {
        function CPINFO() {
        }
        return CPINFO;
    }());
    ADMIN.CPINFO = CPINFO;
    var ADMINGETCPLISTREQ = (function (_super) {
        __extends(ADMINGETCPLISTREQ, _super);
        function ADMINGETCPLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCPLISTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETCPLISTREQ = ADMINGETCPLISTREQ;
    var ADMINGETCPLISTRESP = (function () {
        function ADMINGETCPLISTRESP() {
        }
        return ADMINGETCPLISTRESP;
    }());
    ADMIN.ADMINGETCPLISTRESP = ADMINGETCPLISTRESP;
    //CP游戏列表
    var ADMINGETCPAPPLISTREQ = (function (_super) {
        __extends(ADMINGETCPAPPLISTREQ, _super);
        function ADMINGETCPAPPLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCPAPPLISTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETCPAPPLISTREQ = ADMINGETCPAPPLISTREQ;
    var CPAPPINFO = (function (_super) {
        __extends(CPAPPINFO, _super);
        function CPAPPINFO() {
            _super.apply(this, arguments);
        }
        return CPAPPINFO;
    }(ADMINREQBASE));
    ADMIN.CPAPPINFO = CPAPPINFO;
    var ADMINCPAPPINFOREQ = (function (_super) {
        __extends(ADMINCPAPPINFOREQ, _super);
        function ADMINCPAPPINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINCPAPPINFOREQ;
    }(CPAPPINFO));
    ADMIN.ADMINCPAPPINFOREQ = ADMINCPAPPINFOREQ;
    var ADMINGETCPAPPLISTRESP = (function () {
        function ADMINGETCPAPPLISTRESP() {
        }
        return ADMINGETCPAPPLISTRESP;
    }());
    ADMIN.ADMINGETCPAPPLISTRESP = ADMINGETCPAPPLISTRESP;
    var ADMINAPPINFO = (function (_super) {
        __extends(ADMINAPPINFO, _super);
        function ADMINAPPINFO() {
            _super.apply(this, arguments);
        }
        return ADMINAPPINFO;
    }(CPAPPINFO));
    ADMIN.ADMINAPPINFO = ADMINAPPINFO;
    var ADMINAPPINFOREQ = (function (_super) {
        __extends(ADMINAPPINFOREQ, _super);
        function ADMINAPPINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINAPPINFOREQ;
    }(ADMINAPPINFO));
    ADMIN.ADMINAPPINFOREQ = ADMINAPPINFOREQ;
    var ADMINNOPASSREQ = (function (_super) {
        __extends(ADMINNOPASSREQ, _super);
        function ADMINNOPASSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINNOPASSREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINNOPASSREQ = ADMINNOPASSREQ;
    var ADMINDELREQ = (function (_super) {
        __extends(ADMINDELREQ, _super);
        function ADMINDELREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDELREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINDELREQ = ADMINDELREQ;
    var ADMINDOWNREQ = (function (_super) {
        __extends(ADMINDOWNREQ, _super);
        function ADMINDOWNREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDOWNREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINDOWNREQ = ADMINDOWNREQ;
    var ADMINPUSHTOREQ = (function (_super) {
        __extends(ADMINPUSHTOREQ, _super);
        function ADMINPUSHTOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINPUSHTOREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINPUSHTOREQ = ADMINPUSHTOREQ;
    var ADMINPAYRECORDREQ = (function (_super) {
        __extends(ADMINPAYRECORDREQ, _super);
        function ADMINPAYRECORDREQ() {
            _super.apply(this, arguments);
        }
        return ADMINPAYRECORDREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINPAYRECORDREQ = ADMINPAYRECORDREQ;
    var APPPAYRECORD = (function () {
        function APPPAYRECORD() {
        }
        return APPPAYRECORD;
    }());
    ADMIN.APPPAYRECORD = APPPAYRECORD;
    var ADMINGETAPPPAYRECORDRESP = (function () {
        function ADMINGETAPPPAYRECORDRESP() {
        }
        return ADMINGETAPPPAYRECORDRESP;
    }());
    ADMIN.ADMINGETAPPPAYRECORDRESP = ADMINGETAPPPAYRECORDRESP;
    var ADMINGETCHECKAPPINFOREQ = (function (_super) {
        __extends(ADMINGETCHECKAPPINFOREQ, _super);
        function ADMINGETCHECKAPPINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHECKAPPINFOREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETCHECKAPPINFOREQ = ADMINGETCHECKAPPINFOREQ;
    //传输数据表
    var DATATABLE = (function () {
        function DATATABLE() {
        }
        return DATATABLE;
    }());
    ADMIN.DATATABLE = DATATABLE;
    //export class ADMINGETCALUSERDATAFORDAYREQ extends ADMINREQBASE {
    //    appname: string;//游戏名
    //    nuserorder: string;//新用户排序
    //    incomeorder: string;//本月收入排序
    //    extraorder: string;//月结额排序
    //}
    //export class ADMINGETCALINCOMEDATAFORDAYREQ extends ADMINREQBASE {
    //    appname: string;//游戏名
    //    nuserorder: string;//新用户排序
    //    incomeorder: string;//本月收入排序
    //    extraorder: string;//月结额排序
    //}
    //export class ADMINGETCALINCOMEDATAFORMONTHREQ extends ADMINREQBASE {
    //    appname: string;//游戏名
    //    nuserorder: string;//新用户排序
    //    incomeorder: string;//本月收入排序
    //    extraorder: string;//月结额排序
    //}
    //export class ADMINGETCALUSERDATAFORTOTALREQ extends ADMINREQBASE {
    //    appname: string;//游戏名
    //    nuserorder: string;//新用户排序
    //    incomeorder: string;//本月收入排序
    //    extraorder: string;//月结额排序
    //}
    //export class ADMINGETCALINCOMEDATAFORTOTALREQ extends ADMINREQBASE {
    //    appname: string;//游戏名
    //    nuserorder: string;//新用户排序
    //    incomeorder: string;//本月收入排序
    //    extraorder: string;//月结额排序
    //}
    //export class ADMINGETUSEROLDATAGROUPBYGAME extends ADMINREQBASE {
    //    appname: string;//游戏名
    //    nuserorder: string;//新用户排序
    //    incomeorder: string;//本月收入排序
    //    extraorder: string;//月结额排序
    //}
    var ADMINGETDATASREQ = (function (_super) {
        __extends(ADMINGETDATASREQ, _super);
        function ADMINGETDATASREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETDATASREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETDATASREQ = ADMINGETDATASREQ;
    //export class ADMINGETCALUSERFORDAYCOUNTRESP {
    //    data: DATATABLE;
    //}
    //export class ADMINGETCALUSERFORTOTALCOUNTRESP {
    //    data: DATATABLE;
    //}
    //export class ADMINGETCALINCOMEFORDAYCOUNTRESP {
    //    data: DATATABLE;
    //}
    //export class ADMINGETCALINCOMEFORMONTHCOUNTRESP {
    //    data: DATATABLE;
    //}
    //export class ADMINGETCALINCOMEFORTOTALCOUNTRESP {
    //    data: DATATABLE;
    //}
    var ADMINGETDATACOUNTRESP = (function () {
        function ADMINGETDATACOUNTRESP() {
        }
        return ADMINGETDATACOUNTRESP;
    }());
    ADMIN.ADMINGETDATACOUNTRESP = ADMINGETDATACOUNTRESP;
    //获取已接入的SDK列表
    var ADMINGETSDKTYPELISTREQ = (function () {
        function ADMINGETSDKTYPELISTREQ() {
        }
        return ADMINGETSDKTYPELISTREQ;
    }());
    ADMIN.ADMINGETSDKTYPELISTREQ = ADMINGETSDKTYPELISTREQ;
    var ADMINSDKTYPEINFO = (function () {
        function ADMINSDKTYPEINFO() {
        }
        return ADMINSDKTYPEINFO;
    }());
    ADMIN.ADMINSDKTYPEINFO = ADMINSDKTYPEINFO;
    var ADMINGETSDKTYPELISTRESP = (function () {
        function ADMINGETSDKTYPELISTRESP() {
        }
        return ADMINGETSDKTYPELISTRESP;
    }());
    ADMIN.ADMINGETSDKTYPELISTRESP = ADMINGETSDKTYPELISTRESP;
    var ADMINGETDATADETAILREQ = (function (_super) {
        __extends(ADMINGETDATADETAILREQ, _super);
        function ADMINGETDATADETAILREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETDATADETAILREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETDATADETAILREQ = ADMINGETDATADETAILREQ;
    var ADMINGETDATADETAILRESP = (function () {
        function ADMINGETDATADETAILRESP() {
        }
        return ADMINGETDATADETAILRESP;
    }());
    ADMIN.ADMINGETDATADETAILRESP = ADMINGETDATADETAILRESP;
    var ADMINGETH5GAMELISTREQ = (function (_super) {
        __extends(ADMINGETH5GAMELISTREQ, _super);
        function ADMINGETH5GAMELISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETH5GAMELISTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETH5GAMELISTREQ = ADMINGETH5GAMELISTREQ;
    var ADMINGETCALUSEROFDETAILRESP = (function () {
        function ADMINGETCALUSEROFDETAILRESP() {
        }
        return ADMINGETCALUSEROFDETAILRESP;
    }());
    ADMIN.ADMINGETCALUSEROFDETAILRESP = ADMINGETCALUSEROFDETAILRESP;
    var ADMINGETCALUSEROFOLRESP = (function () {
        function ADMINGETCALUSEROFOLRESP() {
        }
        return ADMINGETCALUSEROFOLRESP;
    }());
    ADMIN.ADMINGETCALUSEROFOLRESP = ADMINGETCALUSEROFOLRESP;
    var ADMINGETCALUSEROFCLRESP = (function () {
        function ADMINGETCALUSEROFCLRESP() {
        }
        return ADMINGETCALUSEROFCLRESP;
    }());
    ADMIN.ADMINGETCALUSEROFCLRESP = ADMINGETCALUSEROFCLRESP;
    var ADMINGETCALINCOMEOFDETAILRESP = (function () {
        function ADMINGETCALINCOMEOFDETAILRESP() {
        }
        return ADMINGETCALINCOMEOFDETAILRESP;
    }());
    ADMIN.ADMINGETCALINCOMEOFDETAILRESP = ADMINGETCALINCOMEOFDETAILRESP;
    var ADMINSORTINSERTREQ = (function (_super) {
        __extends(ADMINSORTINSERTREQ, _super);
        function ADMINSORTINSERTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSORTINSERTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINSORTINSERTREQ = ADMINSORTINSERTREQ;
    var ADMINSORTCLICKREQ = (function (_super) {
        __extends(ADMINSORTCLICKREQ, _super);
        function ADMINSORTCLICKREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSORTCLICKREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINSORTCLICKREQ = ADMINSORTCLICKREQ;
    var ADMINACTIVITYINFO = (function (_super) {
        __extends(ADMINACTIVITYINFO, _super);
        function ADMINACTIVITYINFO() {
            _super.apply(this, arguments);
        }
        return ADMINACTIVITYINFO;
    }(ACTIVITYINFO));
    ADMIN.ADMINACTIVITYINFO = ADMINACTIVITYINFO;
    var ADMINGETACTIVITYINFOSREQ = (function (_super) {
        __extends(ADMINGETACTIVITYINFOSREQ, _super);
        function ADMINGETACTIVITYINFOSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETACTIVITYINFOSREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETACTIVITYINFOSREQ = ADMINGETACTIVITYINFOSREQ;
    var ADMINGETACTIVITYINFOIMGREQ = (function (_super) {
        __extends(ADMINGETACTIVITYINFOIMGREQ, _super);
        function ADMINGETACTIVITYINFOIMGREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETACTIVITYINFOIMGREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETACTIVITYINFOIMGREQ = ADMINGETACTIVITYINFOIMGREQ;
    var ADMINGETACTIVITYINFORESP = (function (_super) {
        __extends(ADMINGETACTIVITYINFORESP, _super);
        function ADMINGETACTIVITYINFORESP() {
            _super.apply(this, arguments);
        }
        return ADMINGETACTIVITYINFORESP;
    }(ADMINACTIVITYINFO));
    ADMIN.ADMINGETACTIVITYINFORESP = ADMINGETACTIVITYINFORESP;
    var ADMINSAVEACTIVITYINFOREQ = (function (_super) {
        __extends(ADMINSAVEACTIVITYINFOREQ, _super);
        function ADMINSAVEACTIVITYINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVEACTIVITYINFOREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINSAVEACTIVITYINFOREQ = ADMINSAVEACTIVITYINFOREQ;
    var ADMINGETCPAPPPERCENTREQ = (function (_super) {
        __extends(ADMINGETCPAPPPERCENTREQ, _super);
        function ADMINGETCPAPPPERCENTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCPAPPPERCENTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETCPAPPPERCENTREQ = ADMINGETCPAPPPERCENTREQ;
    var ADMINCHANGEBALANCESTATUSREQ = (function (_super) {
        __extends(ADMINCHANGEBALANCESTATUSREQ, _super);
        function ADMINCHANGEBALANCESTATUSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINCHANGEBALANCESTATUSREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINCHANGEBALANCESTATUSREQ = ADMINCHANGEBALANCESTATUSREQ;
    var ADMINGETCPAPPJSREQ = (function (_super) {
        __extends(ADMINGETCPAPPJSREQ, _super);
        function ADMINGETCPAPPJSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCPAPPJSREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETCPAPPJSREQ = ADMINGETCPAPPJSREQ;
    var ADMINGETCPAPPJSINFO = (function () {
        function ADMINGETCPAPPJSINFO() {
        }
        return ADMINGETCPAPPJSINFO;
    }());
    ADMIN.ADMINGETCPAPPJSINFO = ADMINGETCPAPPJSINFO;
    var ADMINGETCPAPPJSINFORESP = (function () {
        function ADMINGETCPAPPJSINFORESP() {
        }
        return ADMINGETCPAPPJSINFORESP;
    }());
    ADMIN.ADMINGETCPAPPJSINFORESP = ADMINGETCPAPPJSINFORESP;
    var ADMINGETCPAPPJSINFOREQ = (function (_super) {
        __extends(ADMINGETCPAPPJSINFOREQ, _super);
        function ADMINGETCPAPPJSINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCPAPPJSINFOREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETCPAPPJSINFOREQ = ADMINGETCPAPPJSINFOREQ;
    var ADMINREMOVEHOTORREC = (function (_super) {
        __extends(ADMINREMOVEHOTORREC, _super);
        function ADMINREMOVEHOTORREC() {
            _super.apply(this, arguments);
        }
        return ADMINREMOVEHOTORREC;
    }(ADMINREQBASE));
    ADMIN.ADMINREMOVEHOTORREC = ADMINREMOVEHOTORREC;
    var ADMINGETGAMECOUNTREQ = (function (_super) {
        __extends(ADMINGETGAMECOUNTREQ, _super);
        function ADMINGETGAMECOUNTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETGAMECOUNTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETGAMECOUNTREQ = ADMINGETGAMECOUNTREQ;
    var ADMINGETGAMEINCOMEREQ = (function (_super) {
        __extends(ADMINGETGAMEINCOMEREQ, _super);
        function ADMINGETGAMEINCOMEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETGAMEINCOMEREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETGAMEINCOMEREQ = ADMINGETGAMEINCOMEREQ;
    var ADMINGETGAMEUSERREQ = (function (_super) {
        __extends(ADMINGETGAMEUSERREQ, _super);
        function ADMINGETGAMEUSERREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETGAMEUSERREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETGAMEUSERREQ = ADMINGETGAMEUSERREQ;
    var ADMINGETCHANNELCOUNTREQ = (function (_super) {
        __extends(ADMINGETCHANNELCOUNTREQ, _super);
        function ADMINGETCHANNELCOUNTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHANNELCOUNTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETCHANNELCOUNTREQ = ADMINGETCHANNELCOUNTREQ;
    var ADMINADDGIFTTYPREQ = (function (_super) {
        __extends(ADMINADDGIFTTYPREQ, _super);
        function ADMINADDGIFTTYPREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDGIFTTYPREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINADDGIFTTYPREQ = ADMINADDGIFTTYPREQ;
    var ADMINDELETEGIFTTYPREQ = (function (_super) {
        __extends(ADMINDELETEGIFTTYPREQ, _super);
        function ADMINDELETEGIFTTYPREQ() {
            _super.apply(this, arguments);
        }
        return ADMINDELETEGIFTTYPREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINDELETEGIFTTYPREQ = ADMINDELETEGIFTTYPREQ;
    var ADMINGETALLGIFTREQ = (function (_super) {
        __extends(ADMINGETALLGIFTREQ, _super);
        function ADMINGETALLGIFTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLGIFTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETALLGIFTREQ = ADMINGETALLGIFTREQ;
    var ADMINGETALLGIFTINFO = (function () {
        function ADMINGETALLGIFTINFO() {
        }
        return ADMINGETALLGIFTINFO;
    }());
    ADMIN.ADMINGETALLGIFTINFO = ADMINGETALLGIFTINFO;
    var ADMINGETALLGIFTRESP = (function () {
        function ADMINGETALLGIFTRESP() {
        }
        return ADMINGETALLGIFTRESP;
    }());
    ADMIN.ADMINGETALLGIFTRESP = ADMINGETALLGIFTRESP;
    var ADMINDELGIFTBAG = (function (_super) {
        __extends(ADMINDELGIFTBAG, _super);
        function ADMINDELGIFTBAG() {
            _super.apply(this, arguments);
        }
        return ADMINDELGIFTBAG;
    }(ADMINGETALLGIFTINFO));
    ADMIN.ADMINDELGIFTBAG = ADMINDELGIFTBAG;
    var ADMINGETCHECKGIFTBAGREQ = (function (_super) {
        __extends(ADMINGETCHECKGIFTBAGREQ, _super);
        function ADMINGETCHECKGIFTBAGREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHECKGIFTBAGREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETCHECKGIFTBAGREQ = ADMINGETCHECKGIFTBAGREQ;
    var ADMINUPLOADFILE = (function (_super) {
        __extends(ADMINUPLOADFILE, _super);
        function ADMINUPLOADFILE() {
            _super.apply(this, arguments);
        }
        return ADMINUPLOADFILE;
    }(ADMINREQBASE));
    ADMIN.ADMINUPLOADFILE = ADMINUPLOADFILE;
    var ADMINCHARGERANKREQ = (function (_super) {
        __extends(ADMINCHARGERANKREQ, _super);
        function ADMINCHARGERANKREQ() {
            _super.apply(this, arguments);
        }
        return ADMINCHARGERANKREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINCHARGERANKREQ = ADMINCHARGERANKREQ;
    var ADMINCHARGERANK = (function () {
        function ADMINCHARGERANK() {
        }
        return ADMINCHARGERANK;
    }());
    ADMIN.ADMINCHARGERANK = ADMINCHARGERANK;
    //新后台数据统计
    var ADMINCALDATAREQ = (function (_super) {
        __extends(ADMINCALDATAREQ, _super);
        function ADMINCALDATAREQ() {
            _super.apply(this, arguments);
        }
        return ADMINCALDATAREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINCALDATAREQ = ADMINCALDATAREQ;
    var ADMINCALDATARESP = (function () {
        function ADMINCALDATARESP() {
        }
        return ADMINCALDATARESP;
    }());
    ADMIN.ADMINCALDATARESP = ADMINCALDATARESP;
    //单个玩家注册时间、充值详情等
    var USERPAYRECORD = (function () {
        function USERPAYRECORD() {
        }
        return USERPAYRECORD;
    }());
    ADMIN.USERPAYRECORD = USERPAYRECORD;
    var USERTIMEINFO //玩家注册、最后登录时间等时间信息
     = (function () {
        function USERTIMEINFO //玩家注册、最后登录时间等时间信息
            () {
        }
        return USERTIMEINFO //玩家注册、最后登录时间等时间信息
        ;
    }());
    ADMIN.USERTIMEINFO //玩家注册、最后登录时间等时间信息
     = USERTIMEINFO //玩家注册、最后登录时间等时间信息
    ;
    var ADMINGETUSERDETAILREQ = (function (_super) {
        __extends(ADMINGETUSERDETAILREQ, _super);
        function ADMINGETUSERDETAILREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETUSERDETAILREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETUSERDETAILREQ = ADMINGETUSERDETAILREQ;
    var ADMINGETUSERDETAILRESP = (function () {
        function ADMINGETUSERDETAILRESP() {
        }
        return ADMINGETUSERDETAILRESP;
    }());
    ADMIN.ADMINGETUSERDETAILRESP = ADMINGETUSERDETAILRESP;
    var ADMINGETYSHCPDETAILREQ = (function (_super) {
        __extends(ADMINGETYSHCPDETAILREQ, _super);
        function ADMINGETYSHCPDETAILREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETYSHCPDETAILREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETYSHCPDETAILREQ = ADMINGETYSHCPDETAILREQ;
    var ADMINGETYSHCPDETAILINFO = (function () {
        function ADMINGETYSHCPDETAILINFO() {
        }
        return ADMINGETYSHCPDETAILINFO;
    }());
    ADMIN.ADMINGETYSHCPDETAILINFO = ADMINGETYSHCPDETAILINFO;
    var ADMINGETYSHCPDETAILRESP = (function () {
        function ADMINGETYSHCPDETAILRESP() {
        }
        return ADMINGETYSHCPDETAILRESP;
    }());
    ADMIN.ADMINGETYSHCPDETAILRESP = ADMINGETYSHCPDETAILRESP;
    //手动发送支付回调
    var ADMINSENDPAYCALLBACKREQ = (function (_super) {
        __extends(ADMINSENDPAYCALLBACKREQ, _super);
        function ADMINSENDPAYCALLBACKREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSENDPAYCALLBACKREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINSENDPAYCALLBACKREQ = ADMINSENDPAYCALLBACKREQ;
    var ADMINSENDPAYCALLBACKRESP = (function () {
        function ADMINSENDPAYCALLBACKRESP() {
        }
        return ADMINSENDPAYCALLBACKRESP;
    }());
    ADMIN.ADMINSENDPAYCALLBACKRESP = ADMINSENDPAYCALLBACKRESP;
    //---------------------新版后台------------------------------
    var ADMINGETPLAMFORMDATAREQ = (function (_super) {
        __extends(ADMINGETPLAMFORMDATAREQ, _super);
        function ADMINGETPLAMFORMDATAREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETPLAMFORMDATAREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETPLAMFORMDATAREQ = ADMINGETPLAMFORMDATAREQ;
    var ADMINGETPLAMEFORMDATARESP = (function () {
        function ADMINGETPLAMEFORMDATARESP() {
        }
        return ADMINGETPLAMEFORMDATARESP;
    }());
    ADMIN.ADMINGETPLAMEFORMDATARESP = ADMINGETPLAMEFORMDATARESP;
    var ADMINGAMECHARGEDATASEARCHREQ = (function (_super) {
        __extends(ADMINGAMECHARGEDATASEARCHREQ, _super);
        function ADMINGAMECHARGEDATASEARCHREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGAMECHARGEDATASEARCHREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGAMECHARGEDATASEARCHREQ = ADMINGAMECHARGEDATASEARCHREQ;
    var ADMINGAMECHARGEDATASEARCHRESP = (function () {
        function ADMINGAMECHARGEDATASEARCHRESP() {
        }
        return ADMINGAMECHARGEDATASEARCHRESP;
    }());
    ADMIN.ADMINGAMECHARGEDATASEARCHRESP = ADMINGAMECHARGEDATASEARCHRESP;
    var ADMINCHANNELCHARGEDATASEARCHREQ = (function (_super) {
        __extends(ADMINCHANNELCHARGEDATASEARCHREQ, _super);
        function ADMINCHANNELCHARGEDATASEARCHREQ() {
            _super.apply(this, arguments);
        }
        return ADMINCHANNELCHARGEDATASEARCHREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINCHANNELCHARGEDATASEARCHREQ = ADMINCHANNELCHARGEDATASEARCHREQ;
    var ADMINCHANNELCHARGEDATASEARCHRESP = (function () {
        function ADMINCHANNELCHARGEDATASEARCHRESP() {
        }
        return ADMINCHANNELCHARGEDATASEARCHRESP;
    }());
    ADMIN.ADMINCHANNELCHARGEDATASEARCHRESP = ADMINCHANNELCHARGEDATASEARCHRESP;
    //SDK充值记录
    var ADMINUSERCHARGEDATASEARCHREQ = (function (_super) {
        __extends(ADMINUSERCHARGEDATASEARCHREQ, _super);
        function ADMINUSERCHARGEDATASEARCHREQ() {
            _super.apply(this, arguments);
        }
        return ADMINUSERCHARGEDATASEARCHREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINUSERCHARGEDATASEARCHREQ = ADMINUSERCHARGEDATASEARCHREQ;
    var ADMINUSERCHARGEDATASEARCHRESP = (function () {
        function ADMINUSERCHARGEDATASEARCHRESP() {
        }
        return ADMINUSERCHARGEDATASEARCHRESP;
    }());
    ADMIN.ADMINUSERCHARGEDATASEARCHRESP = ADMINUSERCHARGEDATASEARCHRESP;
    var ADMINGAMEDATADETAILREQ = (function (_super) {
        __extends(ADMINGAMEDATADETAILREQ, _super);
        function ADMINGAMEDATADETAILREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGAMEDATADETAILREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGAMEDATADETAILREQ = ADMINGAMEDATADETAILREQ;
    var ADMINGAMEDATADETAILRESP = (function () {
        function ADMINGAMEDATADETAILRESP() {
        }
        return ADMINGAMEDATADETAILRESP;
    }());
    ADMIN.ADMINGAMEDATADETAILRESP = ADMINGAMEDATADETAILRESP;
    var ADMINGAMEKEEPDATADETAILREQ = (function (_super) {
        __extends(ADMINGAMEKEEPDATADETAILREQ, _super);
        function ADMINGAMEKEEPDATADETAILREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGAMEKEEPDATADETAILREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGAMEKEEPDATADETAILREQ = ADMINGAMEKEEPDATADETAILREQ;
    var ADMINGAMEKEEPDATADETAILRESP = (function () {
        function ADMINGAMEKEEPDATADETAILRESP() {
        }
        return ADMINGAMEKEEPDATADETAILRESP;
    }());
    ADMIN.ADMINGAMEKEEPDATADETAILRESP = ADMINGAMEKEEPDATADETAILRESP;
    var ADMINPLAFORMCDSREQ = (function (_super) {
        __extends(ADMINPLAFORMCDSREQ, _super);
        function ADMINPLAFORMCDSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINPLAFORMCDSREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINPLAFORMCDSREQ = ADMINPLAFORMCDSREQ;
    var ADMINPLAFORMCDSRESP = (function () {
        function ADMINPLAFORMCDSRESP() {
        }
        return ADMINPLAFORMCDSRESP;
    }());
    ADMIN.ADMINPLAFORMCDSRESP = ADMINPLAFORMCDSRESP;
    var ADMINPLAFORMPUDSREQ = (function (_super) {
        __extends(ADMINPLAFORMPUDSREQ, _super);
        function ADMINPLAFORMPUDSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINPLAFORMPUDSREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINPLAFORMPUDSREQ = ADMINPLAFORMPUDSREQ;
    var ADMINPLAFORMPUDSRESP = (function () {
        function ADMINPLAFORMPUDSRESP() {
        }
        return ADMINPLAFORMPUDSRESP;
    }());
    ADMIN.ADMINPLAFORMPUDSRESP = ADMINPLAFORMPUDSRESP;
    var ADMINPLAFORMPVDSREQ = (function (_super) {
        __extends(ADMINPLAFORMPVDSREQ, _super);
        function ADMINPLAFORMPVDSREQ() {
            _super.apply(this, arguments);
        }
        return ADMINPLAFORMPVDSREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINPLAFORMPVDSREQ = ADMINPLAFORMPVDSREQ;
    var ADMINPLAFORMPVDSRESP = (function () {
        function ADMINPLAFORMPVDSRESP() {
        }
        return ADMINPLAFORMPVDSRESP;
    }());
    ADMIN.ADMINPLAFORMPVDSRESP = ADMINPLAFORMPVDSRESP;
    var ADMINPLAFORMGAMECHARGESEARCHREQ = (function (_super) {
        __extends(ADMINPLAFORMGAMECHARGESEARCHREQ, _super);
        function ADMINPLAFORMGAMECHARGESEARCHREQ() {
            _super.apply(this, arguments);
        }
        return ADMINPLAFORMGAMECHARGESEARCHREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINPLAFORMGAMECHARGESEARCHREQ = ADMINPLAFORMGAMECHARGESEARCHREQ;
    var ADMINPLAFORMGAMECHARGESEARCHRESP = (function () {
        function ADMINPLAFORMGAMECHARGESEARCHRESP() {
        }
        return ADMINPLAFORMGAMECHARGESEARCHRESP;
    }());
    ADMIN.ADMINPLAFORMGAMECHARGESEARCHRESP = ADMINPLAFORMGAMECHARGESEARCHRESP;
    var ADMINPLAFORMUSERCHARGEREQ = (function (_super) {
        __extends(ADMINPLAFORMUSERCHARGEREQ, _super);
        function ADMINPLAFORMUSERCHARGEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINPLAFORMUSERCHARGEREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINPLAFORMUSERCHARGEREQ = ADMINPLAFORMUSERCHARGEREQ;
    var ADMINPLAFORMUSERCHARGEINFO = (function () {
        function ADMINPLAFORMUSERCHARGEINFO() {
        }
        return ADMINPLAFORMUSERCHARGEINFO;
    }());
    ADMIN.ADMINPLAFORMUSERCHARGEINFO = ADMINPLAFORMUSERCHARGEINFO;
    //开服表
    var ADMINGETALLACTIVITYREQ = (function (_super) {
        __extends(ADMINGETALLACTIVITYREQ, _super);
        function ADMINGETALLACTIVITYREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLACTIVITYREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETALLACTIVITYREQ = ADMINGETALLACTIVITYREQ;
    var ADMINGETALLOPENTABLEINFO = (function () {
        function ADMINGETALLOPENTABLEINFO() {
        }
        return ADMINGETALLOPENTABLEINFO;
    }());
    ADMIN.ADMINGETALLOPENTABLEINFO = ADMINGETALLOPENTABLEINFO;
    var ADMINGETALLTABLERESP = (function () {
        function ADMINGETALLTABLERESP() {
        }
        return ADMINGETALLTABLERESP;
    }());
    ADMIN.ADMINGETALLTABLERESP = ADMINGETALLTABLERESP;
    var ADMINDELOPENTABLE = (function (_super) {
        __extends(ADMINDELOPENTABLE, _super);
        function ADMINDELOPENTABLE() {
            _super.apply(this, arguments);
        }
        return ADMINDELOPENTABLE;
    }(ADMINGETALLOPENTABLEINFO));
    ADMIN.ADMINDELOPENTABLE = ADMINDELOPENTABLE;
    var ADMINGETCHECKGIFTTABLEREQ = (function (_super) {
        __extends(ADMINGETCHECKGIFTTABLEREQ, _super);
        function ADMINGETCHECKGIFTTABLEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHECKGIFTTABLEREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETCHECKGIFTTABLEREQ = ADMINGETCHECKGIFTTABLEREQ;
    var ADMINADDOPENTABLEREQ = (function (_super) {
        __extends(ADMINADDOPENTABLEREQ, _super);
        function ADMINADDOPENTABLEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDOPENTABLEREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINADDOPENTABLEREQ = ADMINADDOPENTABLEREQ;
    //获取用户信息
    var ADMINGETALLLISTUSERREQ = (function (_super) {
        __extends(ADMINGETALLLISTUSERREQ, _super);
        function ADMINGETALLLISTUSERREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLLISTUSERREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETALLLISTUSERREQ = ADMINGETALLLISTUSERREQ;
    var ADMINGETALLLISTUSERINFO = (function () {
        function ADMINGETALLLISTUSERINFO() {
        }
        return ADMINGETALLLISTUSERINFO;
    }());
    ADMIN.ADMINGETALLLISTUSERINFO = ADMINGETALLLISTUSERINFO;
    var ADMINGETALLLISTUSERRESP = (function () {
        function ADMINGETALLLISTUSERRESP() {
        }
        return ADMINGETALLLISTUSERRESP;
    }());
    ADMIN.ADMINGETALLLISTUSERRESP = ADMINGETALLLISTUSERRESP;
    //获取用户进入游戏具体信息
    var ADMINGETALLLISTUSERGAMEREQ = (function (_super) {
        __extends(ADMINGETALLLISTUSERGAMEREQ, _super);
        function ADMINGETALLLISTUSERGAMEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLLISTUSERGAMEREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETALLLISTUSERGAMEREQ = ADMINGETALLLISTUSERGAMEREQ;
    var ADMINGETALLLISTUSERGAMEINFO = (function () {
        function ADMINGETALLLISTUSERGAMEINFO() {
        }
        return ADMINGETALLLISTUSERGAMEINFO;
    }());
    ADMIN.ADMINGETALLLISTUSERGAMEINFO = ADMINGETALLLISTUSERGAMEINFO;
    var ADMINGETALLLISTUSERGAMERESP = (function () {
        function ADMINGETALLLISTUSERGAMERESP() {
        }
        return ADMINGETALLLISTUSERGAMERESP;
    }());
    ADMIN.ADMINGETALLLISTUSERGAMERESP = ADMINGETALLLISTUSERGAMERESP;
    //VIPQQ
    var ADMINGETALLVIPQQREQ = (function (_super) {
        __extends(ADMINGETALLVIPQQREQ, _super);
        function ADMINGETALLVIPQQREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLVIPQQREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETALLVIPQQREQ = ADMINGETALLVIPQQREQ;
    var ADMINGETALLVIPQQINFO = (function () {
        function ADMINGETALLVIPQQINFO() {
        }
        return ADMINGETALLVIPQQINFO;
    }());
    ADMIN.ADMINGETALLVIPQQINFO = ADMINGETALLVIPQQINFO;
    var ADMINGETALLVIPQQRESP = (function () {
        function ADMINGETALLVIPQQRESP() {
        }
        return ADMINGETALLVIPQQRESP;
    }());
    ADMIN.ADMINGETALLVIPQQRESP = ADMINGETALLVIPQQRESP;
    var ADMINADDVIPQQREQ = (function (_super) {
        __extends(ADMINADDVIPQQREQ, _super);
        function ADMINADDVIPQQREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDVIPQQREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINADDVIPQQREQ = ADMINADDVIPQQREQ;
    //活动相关数据
    var ADMINGETALLOPENTABLEREQ = (function (_super) {
        __extends(ADMINGETALLOPENTABLEREQ, _super);
        function ADMINGETALLOPENTABLEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLOPENTABLEREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETALLOPENTABLEREQ = ADMINGETALLOPENTABLEREQ;
    var ADMINGETALLACTIVITYINFO = (function () {
        function ADMINGETALLACTIVITYINFO() {
        }
        return ADMINGETALLACTIVITYINFO;
    }());
    ADMIN.ADMINGETALLACTIVITYINFO = ADMINGETALLACTIVITYINFO;
    var ADMINGETALLACTIVITYDETAILINFO = (function () {
        function ADMINGETALLACTIVITYDETAILINFO() {
        }
        return ADMINGETALLACTIVITYDETAILINFO;
    }());
    ADMIN.ADMINGETALLACTIVITYDETAILINFO = ADMINGETALLACTIVITYDETAILINFO;
    var ADMINGETALLACTIVITYRESP = (function () {
        function ADMINGETALLACTIVITYRESP() {
        }
        return ADMINGETALLACTIVITYRESP;
    }());
    ADMIN.ADMINGETALLACTIVITYRESP = ADMINGETALLACTIVITYRESP;
    var ADMINGETALLACTIVITYRDETAILESP = (function () {
        function ADMINGETALLACTIVITYRDETAILESP() {
        }
        return ADMINGETALLACTIVITYRDETAILESP;
    }());
    ADMIN.ADMINGETALLACTIVITYRDETAILESP = ADMINGETALLACTIVITYRDETAILESP;
    var ADMINDELACTIVITY = (function (_super) {
        __extends(ADMINDELACTIVITY, _super);
        function ADMINDELACTIVITY() {
            _super.apply(this, arguments);
        }
        return ADMINDELACTIVITY;
    }(ADMINGETALLACTIVITYINFO));
    ADMIN.ADMINDELACTIVITY = ADMINDELACTIVITY;
    var ADMINGETCHECKACTIVITYREQ = (function (_super) {
        __extends(ADMINGETCHECKACTIVITYREQ, _super);
        function ADMINGETCHECKACTIVITYREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHECKACTIVITYREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETCHECKACTIVITYREQ = ADMINGETCHECKACTIVITYREQ;
    var ADMINADDACTIVITYREQ = (function (_super) {
        __extends(ADMINADDACTIVITYREQ, _super);
        function ADMINADDACTIVITYREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDACTIVITYREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINADDACTIVITYREQ = ADMINADDACTIVITYREQ;
    //消息相关数据
    var ADMINGETALLMESSAGEREQ = (function (_super) {
        __extends(ADMINGETALLMESSAGEREQ, _super);
        function ADMINGETALLMESSAGEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLMESSAGEREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETALLMESSAGEREQ = ADMINGETALLMESSAGEREQ;
    var ADMINGETALLMESSAGEINFO = (function () {
        function ADMINGETALLMESSAGEINFO() {
        }
        return ADMINGETALLMESSAGEINFO;
    }());
    ADMIN.ADMINGETALLMESSAGEINFO = ADMINGETALLMESSAGEINFO;
    var ADMINGETALLMESSAGEDETAILINFO = (function () {
        function ADMINGETALLMESSAGEDETAILINFO() {
        }
        return ADMINGETALLMESSAGEDETAILINFO;
    }());
    ADMIN.ADMINGETALLMESSAGEDETAILINFO = ADMINGETALLMESSAGEDETAILINFO;
    var ADMINGETALLMESSAGERESP = (function () {
        function ADMINGETALLMESSAGERESP() {
        }
        return ADMINGETALLMESSAGERESP;
    }());
    ADMIN.ADMINGETALLMESSAGERESP = ADMINGETALLMESSAGERESP;
    var ADMINGETALLMESSAGEDETAILESP = (function () {
        function ADMINGETALLMESSAGEDETAILESP() {
        }
        return ADMINGETALLMESSAGEDETAILESP;
    }());
    ADMIN.ADMINGETALLMESSAGEDETAILESP = ADMINGETALLMESSAGEDETAILESP;
    var ADMINDELMESSAGE = (function (_super) {
        __extends(ADMINDELMESSAGE, _super);
        function ADMINDELMESSAGE() {
            _super.apply(this, arguments);
        }
        return ADMINDELMESSAGE;
    }(ADMINGETALLMESSAGEINFO));
    ADMIN.ADMINDELMESSAGE = ADMINDELMESSAGE;
    var ADMINGETCHECKMESSAGEREQ = (function (_super) {
        __extends(ADMINGETCHECKMESSAGEREQ, _super);
        function ADMINGETCHECKMESSAGEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHECKMESSAGEREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETCHECKMESSAGEREQ = ADMINGETCHECKMESSAGEREQ;
    var ADMINADDMESSAGEREQ = (function (_super) {
        __extends(ADMINADDMESSAGEREQ, _super);
        function ADMINADDMESSAGEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDMESSAGEREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINADDMESSAGEREQ = ADMINADDMESSAGEREQ;
    //用户反馈信息相关数据
    var ADMINGETALLFEEDBACKREQ = (function (_super) {
        __extends(ADMINGETALLFEEDBACKREQ, _super);
        function ADMINGETALLFEEDBACKREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLFEEDBACKREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETALLFEEDBACKREQ = ADMINGETALLFEEDBACKREQ;
    var ADMINGETALFEEDBACKINFO = (function () {
        function ADMINGETALFEEDBACKINFO() {
        }
        return ADMINGETALFEEDBACKINFO;
    }());
    ADMIN.ADMINGETALFEEDBACKINFO = ADMINGETALFEEDBACKINFO;
    var ADMINGETALLFEEDBACKINFO = (function () {
        function ADMINGETALLFEEDBACKINFO() {
        }
        return ADMINGETALLFEEDBACKINFO;
    }());
    ADMIN.ADMINGETALLFEEDBACKINFO = ADMINGETALLFEEDBACKINFO;
    var ADMINGETALLFEEDBACKRESP = (function () {
        function ADMINGETALLFEEDBACKRESP() {
        }
        return ADMINGETALLFEEDBACKRESP;
    }());
    ADMIN.ADMINGETALLFEEDBACKRESP = ADMINGETALLFEEDBACKRESP;
    var ADMINGETALLFEEDBACKESP = (function () {
        function ADMINGETALLFEEDBACKESP() {
        }
        return ADMINGETALLFEEDBACKESP;
    }());
    ADMIN.ADMINGETALLFEEDBACKESP = ADMINGETALLFEEDBACKESP;
    var ADMINDELFEEDBACK = (function (_super) {
        __extends(ADMINDELFEEDBACK, _super);
        function ADMINDELFEEDBACK() {
            _super.apply(this, arguments);
        }
        return ADMINDELFEEDBACK;
    }(ADMINGETALLFEEDBACKINFO));
    ADMIN.ADMINDELFEEDBACK = ADMINDELFEEDBACK;
    var ADMINGETCHECKFEEDBACKREQ = (function (_super) {
        __extends(ADMINGETCHECKFEEDBACKREQ, _super);
        function ADMINGETCHECKFEEDBACKREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHECKFEEDBACKREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETCHECKFEEDBACKREQ = ADMINGETCHECKFEEDBACKREQ;
    var ADMINADDFEEDBACKREQ = (function (_super) {
        __extends(ADMINADDFEEDBACKREQ, _super);
        function ADMINADDFEEDBACKREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDFEEDBACKREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINADDFEEDBACKREQ = ADMINADDFEEDBACKREQ;
    var ADMINGETALLGAMENAMEINFO = (function () {
        function ADMINGETALLGAMENAMEINFO() {
        }
        return ADMINGETALLGAMENAMEINFO;
    }());
    ADMIN.ADMINGETALLGAMENAMEINFO = ADMINGETALLGAMENAMEINFO;
    var ADMINGETALLGAMENAMERESP = (function () {
        function ADMINGETALLGAMENAMERESP() {
        }
        return ADMINGETALLGAMENAMERESP;
    }());
    ADMIN.ADMINGETALLGAMENAMERESP = ADMINGETALLGAMENAMERESP;
    //管理高级福利相关数据
    var ADMINGETALLACCOUNTTYPEREQ = (function (_super) {
        __extends(ADMINGETALLACCOUNTTYPEREQ, _super);
        function ADMINGETALLACCOUNTTYPEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLACCOUNTTYPEREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETALLACCOUNTTYPEREQ = ADMINGETALLACCOUNTTYPEREQ;
    var ADMINGETALLACCOUNTTYPEINFO = (function () {
        function ADMINGETALLACCOUNTTYPEINFO() {
        }
        return ADMINGETALLACCOUNTTYPEINFO;
    }());
    ADMIN.ADMINGETALLACCOUNTTYPEINFO = ADMINGETALLACCOUNTTYPEINFO;
    var ADMINGETALLACCOUNTTYPERESP = (function () {
        function ADMINGETALLACCOUNTTYPERESP() {
        }
        return ADMINGETALLACCOUNTTYPERESP;
    }());
    ADMIN.ADMINGETALLACCOUNTTYPERESP = ADMINGETALLACCOUNTTYPERESP;
    var ADMINDELACCOUNTTYPE = (function (_super) {
        __extends(ADMINDELACCOUNTTYPE, _super);
        function ADMINDELACCOUNTTYPE() {
            _super.apply(this, arguments);
        }
        return ADMINDELACCOUNTTYPE;
    }(ADMINGETALLACCOUNTTYPEINFO));
    ADMIN.ADMINDELACCOUNTTYPE = ADMINDELACCOUNTTYPE;
    var ADMINGETCHECKACCOUNTTYPEREQ = (function (_super) {
        __extends(ADMINGETCHECKACCOUNTTYPEREQ, _super);
        function ADMINGETCHECKACCOUNTTYPEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHECKACCOUNTTYPEREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETCHECKACCOUNTTYPEREQ = ADMINGETCHECKACCOUNTTYPEREQ;
    var ADMINADDACCOUNTTYPEREQ = (function (_super) {
        __extends(ADMINADDACCOUNTTYPEREQ, _super);
        function ADMINADDACCOUNTTYPEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDACCOUNTTYPEREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINADDACCOUNTTYPEREQ = ADMINADDACCOUNTTYPEREQ;
    var ADMINADDACCOUNTREQ = (function (_super) {
        __extends(ADMINADDACCOUNTREQ, _super);
        function ADMINADDACCOUNTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDACCOUNTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINADDACCOUNTREQ = ADMINADDACCOUNTREQ;
    //审核高级福利相关数据
    var ADMINGETALLREVIEWACCOUNTREQ = (function (_super) {
        __extends(ADMINGETALLREVIEWACCOUNTREQ, _super);
        function ADMINGETALLREVIEWACCOUNTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLREVIEWACCOUNTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETALLREVIEWACCOUNTREQ = ADMINGETALLREVIEWACCOUNTREQ;
    var ADMINGETALLREVIEWACCOUNTINFO = (function () {
        function ADMINGETALLREVIEWACCOUNTINFO() {
        }
        return ADMINGETALLREVIEWACCOUNTINFO;
    }());
    ADMIN.ADMINGETALLREVIEWACCOUNTINFO = ADMINGETALLREVIEWACCOUNTINFO;
    var ADMINGETALLREVIEWACCOUNTRESP = (function () {
        function ADMINGETALLREVIEWACCOUNTRESP() {
        }
        return ADMINGETALLREVIEWACCOUNTRESP;
    }());
    ADMIN.ADMINGETALLREVIEWACCOUNTRESP = ADMINGETALLREVIEWACCOUNTRESP;
    var ADMINDELREVIEWACCOUNT = (function (_super) {
        __extends(ADMINDELREVIEWACCOUNT, _super);
        function ADMINDELREVIEWACCOUNT() {
            _super.apply(this, arguments);
        }
        return ADMINDELREVIEWACCOUNT;
    }(ADMINGETALLREVIEWACCOUNTINFO));
    ADMIN.ADMINDELREVIEWACCOUNT = ADMINDELREVIEWACCOUNT;
    var ADMINGETCHECKREVIEWACCOUNTREQ = (function (_super) {
        __extends(ADMINGETCHECKREVIEWACCOUNTREQ, _super);
        function ADMINGETCHECKREVIEWACCOUNTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETCHECKREVIEWACCOUNTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETCHECKREVIEWACCOUNTREQ = ADMINGETCHECKREVIEWACCOUNTREQ;
    var ADMINADDREVIEWACCOUNTREQ = (function (_super) {
        __extends(ADMINADDREVIEWACCOUNTREQ, _super);
        function ADMINADDREVIEWACCOUNTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINADDREVIEWACCOUNTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINADDREVIEWACCOUNTREQ = ADMINADDREVIEWACCOUNTREQ;
    var ADMINPLAFORMUSERCHARGEREQ2 = (function (_super) {
        __extends(ADMINPLAFORMUSERCHARGEREQ2, _super);
        function ADMINPLAFORMUSERCHARGEREQ2() {
            _super.apply(this, arguments);
        }
        return ADMINPLAFORMUSERCHARGEREQ2;
    }(ADMINREQBASE));
    ADMIN.ADMINPLAFORMUSERCHARGEREQ2 = ADMINPLAFORMUSERCHARGEREQ2;
    //取得接入发行SDK的游戏列表
    var ADMINGETSDKAPPLISTREQ = (function (_super) {
        __extends(ADMINGETSDKAPPLISTREQ, _super);
        function ADMINGETSDKAPPLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETSDKAPPLISTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETSDKAPPLISTREQ = ADMINGETSDKAPPLISTREQ;
    var SDKAPPINFO = (function () {
        function SDKAPPINFO() {
        }
        return SDKAPPINFO;
    }());
    ADMIN.SDKAPPINFO = SDKAPPINFO;
    var ADMINGETSDKAPPLISTRESP = (function () {
        function ADMINGETSDKAPPLISTRESP() {
        }
        return ADMINGETSDKAPPLISTRESP;
    }());
    ADMIN.ADMINGETSDKAPPLISTRESP = ADMINGETSDKAPPLISTRESP;
    //添加SDK游戏时取得可选择的游戏列表
    var ADMINGETSELSDKAPPLISTREQ = (function (_super) {
        __extends(ADMINGETSELSDKAPPLISTREQ, _super);
        function ADMINGETSELSDKAPPLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETSELSDKAPPLISTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETSELSDKAPPLISTREQ = ADMINGETSELSDKAPPLISTREQ;
    var ADMINGETSELSDKAPPINFO = (function () {
        function ADMINGETSELSDKAPPINFO() {
        }
        return ADMINGETSELSDKAPPINFO;
    }());
    ADMIN.ADMINGETSELSDKAPPINFO = ADMINGETSELSDKAPPINFO;
    var ADMINGETSELSDKAPPLISTRESP = (function () {
        function ADMINGETSELSDKAPPLISTRESP() {
        }
        return ADMINGETSELSDKAPPLISTRESP;
    }());
    ADMIN.ADMINGETSELSDKAPPLISTRESP = ADMINGETSELSDKAPPLISTRESP;
    //取得游戏充值档
    var ADMINGETAPPPRODUCTSREQ = (function () {
        function ADMINGETAPPPRODUCTSREQ() {
        }
        return ADMINGETAPPPRODUCTSREQ;
    }());
    ADMIN.ADMINGETAPPPRODUCTSREQ = ADMINGETAPPPRODUCTSREQ;
    var APPPRODUCTINFO = (function () {
        function APPPRODUCTINFO() {
        }
        return APPPRODUCTINFO;
    }());
    ADMIN.APPPRODUCTINFO = APPPRODUCTINFO;
    var ADMINGETAPPPRODUCTSRESP = (function () {
        function ADMINGETAPPPRODUCTSRESP() {
        }
        return ADMINGETAPPPRODUCTSRESP;
    }());
    ADMIN.ADMINGETAPPPRODUCTSRESP = ADMINGETAPPPRODUCTSRESP;
    //保存SDK游戏信息
    var ADMINSAVESDKAPPINFOREQ = (function (_super) {
        __extends(ADMINSAVESDKAPPINFOREQ, _super);
        function ADMINSAVESDKAPPINFOREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSAVESDKAPPINFOREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINSAVESDKAPPINFOREQ = ADMINSAVESDKAPPINFOREQ;
    var ADMINSAVESDKAPPINFORESP = (function () {
        function ADMINSAVESDKAPPINFORESP() {
        }
        return ADMINSAVESDKAPPINFORESP;
    }());
    ADMIN.ADMINSAVESDKAPPINFORESP = ADMINSAVESDKAPPINFORESP;
    var ADMINSORTCHANGEREQ = (function (_super) {
        __extends(ADMINSORTCHANGEREQ, _super);
        function ADMINSORTCHANGEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINSORTCHANGEREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINSORTCHANGEREQ = ADMINSORTCHANGEREQ;
    var ADMINGETALLCPAPPLISTREQ = (function (_super) {
        __extends(ADMINGETALLCPAPPLISTREQ, _super);
        function ADMINGETALLCPAPPLISTREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETALLCPAPPLISTREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETALLCPAPPLISTREQ = ADMINGETALLCPAPPLISTREQ;
    var ADMINGETALLCPAPPINFO = (function () {
        function ADMINGETALLCPAPPINFO() {
        }
        return ADMINGETALLCPAPPINFO;
    }());
    ADMIN.ADMINGETALLCPAPPINFO = ADMINGETALLCPAPPINFO;
    var ADMINGETBLANCEREQ = (function (_super) {
        __extends(ADMINGETBLANCEREQ, _super);
        function ADMINGETBLANCEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINGETBLANCEREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINGETBLANCEREQ = ADMINGETBLANCEREQ;
    var ADMINBLANCEINFO = (function () {
        function ADMINBLANCEINFO() {
        }
        return ADMINBLANCEINFO;
    }());
    ADMIN.ADMINBLANCEINFO = ADMINBLANCEINFO;
    var ADMINUPLOADBLANCEFILEREQ = (function (_super) {
        __extends(ADMINUPLOADBLANCEFILEREQ, _super);
        function ADMINUPLOADBLANCEFILEREQ() {
            _super.apply(this, arguments);
        }
        return ADMINUPLOADBLANCEFILEREQ;
    }(ADMINREQBASE));
    ADMIN.ADMINUPLOADBLANCEFILEREQ = ADMINUPLOADBLANCEFILEREQ;
    var RECHAGEROBOTREQ = (function () {
        function RECHAGEROBOTREQ() {
        }
        return RECHAGEROBOTREQ;
    }());
    ADMIN.RECHAGEROBOTREQ = RECHAGEROBOTREQ;
    var RECHAGEROBOTINFO = (function () {
        function RECHAGEROBOTINFO() {
        }
        return RECHAGEROBOTINFO;
    }());
    ADMIN.RECHAGEROBOTINFO = RECHAGEROBOTINFO;
    var INDEXTITLEINFO = (function () {
        function INDEXTITLEINFO() {
        }
        return INDEXTITLEINFO;
    }());
    ADMIN.INDEXTITLEINFO = INDEXTITLEINFO;
    var INDEXGAMEREQ = (function () {
        function INDEXGAMEREQ() {
        }
        return INDEXGAMEREQ;
    }());
    ADMIN.INDEXGAMEREQ = INDEXGAMEREQ;
    var ADBANNERINFO = (function () {
        function ADBANNERINFO() {
        }
        return ADBANNERINFO;
    }());
    ADMIN.ADBANNERINFO = ADBANNERINFO;
    var LISTCOUNTBANNERREQ = (function () {
        function LISTCOUNTBANNERREQ() {
        }
        return LISTCOUNTBANNERREQ;
    }());
    ADMIN.LISTCOUNTBANNERREQ = LISTCOUNTBANNERREQ;
    var LISTCOUNTBANNERINFO = (function () {
        function LISTCOUNTBANNERINFO() {
        }
        return LISTCOUNTBANNERINFO;
    }());
    ADMIN.LISTCOUNTBANNERINFO = LISTCOUNTBANNERINFO;
    function adminCheckLogin(cb) {
        if (!ADMIN.userinfo)
            ADMIN.userinfo = utils.getCookie("ADMINUSERINFO");
        if (!ADMIN.userinfo) {
            window.parent.location.href = "index.html";
        }
        else {
            adminLogin({ loginid: ADMIN.userinfo.loginid, pwd: ADMIN.userinfo.pwd }, function (resp) {
                if (resp.errno != 0) {
                    alert(resp.message);
                    history.back();
                    return;
                }
                cb(ADMIN.userinfo);
            });
        }
    }
    ADMIN.adminCheckLogin = adminCheckLogin;
    function spCheckLogin(cb) {
        if (!ADMIN.userinfo)
            ADMIN.userinfo = utils.getCookie("SPUSERINFO");
        if (!ADMIN.userinfo) {
            window.parent.location.href = "index.html";
        }
        else {
            spLogin({ loginid: ADMIN.userinfo.loginid, pwd: ADMIN.userinfo.pwd }, function (resp) {
                if (resp.errno != 0) {
                    alert(resp.message);
                    history.back();
                    return;
                }
                cb(ADMIN.userinfo);
            });
        }
    }
    ADMIN.spCheckLogin = spCheckLogin;
    function cpCheckLogin(cb) {
        if (!ADMIN.userinfo)
            ADMIN.userinfo = utils.getCookie("CPUSERINFO");
        if (!ADMIN.userinfo) {
            window.parent.location.href = "index.html";
        }
        else {
            cpLogin({ loginid: ADMIN.userinfo.loginid, pwd: ADMIN.userinfo.pwd }, function (resp) {
                if (resp.errno != 0) {
                    alert(resp.message);
                    history.back();
                    return;
                }
                cb(ADMIN.userinfo);
            });
        }
    }
    ADMIN.cpCheckLogin = cpCheckLogin;
    function adminLogin(param, cb) {
        if (!param.loginid && ADMIN.userinfo)
            param.loginid = ADMIN.userinfo.loginid;
        if (!param.pwd && ADMIN.userinfo)
            param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminlogin", param, cb);
    }
    ADMIN.adminLogin = adminLogin;
    function spLogin(param, cb) {
        if (!param.loginid && ADMIN.cpuserinfo)
            param.loginid = ADMIN.cpuserinfo.loginid;
        if (!param.pwd && ADMIN.cpuserinfo)
            param.pwd = ADMIN.cpuserinfo.pwd;
        PostServer("splogin", param, cb);
    }
    ADMIN.spLogin = spLogin;
    function cpLogin(param, cb) {
        if (!param.loginid && ADMIN.spuserinfo)
            param.loginid = ADMIN.spuserinfo.loginid;
        if (!param.pwd && ADMIN.spuserinfo)
            param.pwd = ADMIN.spuserinfo.pwd;
        PostServer("cplogin", param, cb);
    }
    ADMIN.cpLogin = cpLogin;
    function adminGetPkAppList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetpkapplist", param, cb);
    }
    ADMIN.adminGetPkAppList = adminGetPkAppList;
    function adminSavePkAppInfo(param, icofile, bgfile, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsavepkappinfo", param, cb, [{ ico: icofile, bg: bgfile }]);
    }
    ADMIN.adminSavePkAppInfo = adminSavePkAppInfo;
    function adminDelPkApp(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admindelpkapp", param, cb);
    }
    ADMIN.adminDelPkApp = adminDelPkApp;
    function adminGetH5AppList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingeth5applist", param, cb);
    }
    ADMIN.adminGetH5AppList = adminGetH5AppList;
    function adminSaveH5AppInfo(param, icofile, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsaveh5appinfo", param, cb, [{ ico: icofile }]);
    }
    ADMIN.adminSaveH5AppInfo = adminSaveH5AppInfo;
    function adminDelH5App(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admindelh5app", param, cb);
    }
    ADMIN.adminDelH5App = adminDelH5App;
    function adminGetShopGoodsList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetshopgoodslist", param, cb);
    }
    ADMIN.adminGetShopGoodsList = adminGetShopGoodsList;
    function adminSaveGoodsInfo(param, icofile, imgfile, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsavegoodsinfo", param, cb, [{ icofile: icofile, imgfile: imgfile }]);
    }
    ADMIN.adminSaveGoodsInfo = adminSaveGoodsInfo;
    function adminDelGoods(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admindelgoods", param, cb);
    }
    ADMIN.adminDelGoods = adminDelGoods;
    function adminGetWeeklyGoodsList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetweeklygoodslist", param, cb);
    }
    ADMIN.adminGetWeeklyGoodsList = adminGetWeeklyGoodsList;
    function adminSaveWeeklyGoodsInfo(param, imgfile, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsaveweeklygoodsinfo", param, cb, [{ imgfile: imgfile }]);
    }
    ADMIN.adminSaveWeeklyGoodsInfo = adminSaveWeeklyGoodsInfo;
    function adminGetShopAdList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetshopadlist", param, cb);
    }
    ADMIN.adminGetShopAdList = adminGetShopAdList;
    function adminSaveShopAD(param, imgfile, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsaveshopad", param, cb, [{ imgfile: imgfile }]);
    }
    ADMIN.adminSaveShopAD = adminSaveShopAD;
    function adminDelShopAD(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admindelshopad", param, cb);
    }
    ADMIN.adminDelShopAD = adminDelShopAD;
    function adminDelWeeklyGoods(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admindelweeklygoods", param, cb);
    }
    ADMIN.adminDelWeeklyGoods = adminDelWeeklyGoods;
    function adminGetActivityList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetactivitylist", param, cb);
    }
    ADMIN.adminGetActivityList = adminGetActivityList;
    function adminSaveActivity(param, imgfile, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsaveactivity", param, cb, [{ imgfile: imgfile }]);
    }
    ADMIN.adminSaveActivity = adminSaveActivity;
    function adminDelActivity(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admindelactivity", param, cb);
    }
    ADMIN.adminDelActivity = adminDelActivity;
    function admingetExchangeRecord(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetexchangerecord", param, cb);
    }
    ADMIN.admingetExchangeRecord = admingetExchangeRecord;
    function adminSaveExchangeRecord(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsaveexchangerecord", param, cb);
    }
    ADMIN.adminSaveExchangeRecord = adminSaveExchangeRecord;
    function adminGetFlowStatistics(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetflowstatistics", param, cb);
    }
    ADMIN.adminGetFlowStatistics = adminGetFlowStatistics;
    function adminGetRechargeList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetrechargelist", param, cb);
    }
    ADMIN.adminGetRechargeList = adminGetRechargeList;
    function adminGetCpList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetcplist", param, cb);
    }
    ADMIN.adminGetCpList = adminGetCpList;
    function adminGetCPAppsList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetcpappslist", param, cb);
    }
    ADMIN.adminGetCPAppsList = adminGetCPAppsList;
    function adminGetCPAppsList_old(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetcpappslist_old", param, cb);
    }
    ADMIN.adminGetCPAppsList_old = adminGetCPAppsList_old;
    function adminSaveCPAppInfo(param, files, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsavecpappinfo", param, cb, [{ icoimg: files[0], adimg: files[1] }]);
    }
    ADMIN.adminSaveCPAppInfo = adminSaveCPAppInfo;
    function adminSaveCPAppInfo_new(param, files, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsavecpappinfo", param, cb, [{ icoimg: files[0], adimg: files[1], backimg: files[2], bannerimg: files[3] }]);
    }
    ADMIN.adminSaveCPAppInfo_new = adminSaveCPAppInfo_new;
    function adminpassCPAppInfo(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminpasscpappinfo", param, cb);
    }
    ADMIN.adminpassCPAppInfo = adminpassCPAppInfo;
    function adminnopassCPAppInfo(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminnopasscpappinfo", param, cb);
    }
    ADMIN.adminnopassCPAppInfo = adminnopassCPAppInfo;
    function admindelAppInfo(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admindelappinfo", param, cb);
    }
    ADMIN.admindelAppInfo = admindelAppInfo;
    function admindownCPAppInfo(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admindowncpappinfo", param, cb);
    }
    ADMIN.admindownCPAppInfo = admindownCPAppInfo;
    function adminSaveAppInfo(param, files, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsaveappinfo", param, cb, [{ icoimg: files[0], adimg: files[1] }]);
    }
    ADMIN.adminSaveAppInfo = adminSaveAppInfo;
    function getPayRecord(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("getpayrecord", param, cb);
    }
    ADMIN.getPayRecord = getPayRecord;
    function adminGetCheckList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetchecklist", param, cb);
    }
    ADMIN.adminGetCheckList = adminGetCheckList;
    function adminpassAll(param, cb) {
        PostServer("adminpassall", param, cb);
    }
    ADMIN.adminpassAll = adminpassAll;
    function admindelAll(param, cb) {
        PostServer("admindelall", param, cb);
    }
    ADMIN.admindelAll = admindelAll;
    function admindownAll(param, cb) {
        PostServer("admindownall", param, cb);
    }
    ADMIN.admindownAll = admindownAll;
    function adminCalUserForDay(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admincaluserforday", param, cb);
    }
    ADMIN.adminCalUserForDay = adminCalUserForDay;
    function adminCalUserForTotal(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admincaluserfortotal", param, cb);
    }
    ADMIN.adminCalUserForTotal = adminCalUserForTotal;
    function adminCalIncomeForDay(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admincalincomeforday", param, cb);
    }
    ADMIN.adminCalIncomeForDay = adminCalIncomeForDay;
    function adminCalIncomeForMonth(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admincalincomeformonth", param, cb);
    }
    ADMIN.adminCalIncomeForMonth = adminCalIncomeForMonth;
    function adminCalIncomeForTotal(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admincalincomefortotal", param, cb);
    }
    ADMIN.adminCalIncomeForTotal = adminCalIncomeForTotal;
    function adminGetSdkTypeList(param, cb) {
        PostServer("admingetsdktypelist", param, cb);
    }
    ADMIN.adminGetSdkTypeList = adminGetSdkTypeList;
    function adminGetGameDataDetail(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetgamedatadetail", param, cb);
    }
    ADMIN.adminGetGameDataDetail = adminGetGameDataDetail;
    function adminGetUserOLData(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetuseroldata", param, cb);
    }
    ADMIN.adminGetUserOLData = adminGetUserOLData;
    function adminGetSdkPayDaily(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetsdkpaydaily", param, cb);
    }
    ADMIN.adminGetSdkPayDaily = adminGetSdkPayDaily;
    function adminGetUserolForCLData(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetuserolforcldata", param, cb);
    }
    ADMIN.adminGetUserolForCLData = adminGetUserolForCLData;
    function adminGetH5GameList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingeth5gamelist", param, cb);
    }
    ADMIN.adminGetH5GameList = adminGetH5GameList;
    function adminSortInsert(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsortinsert", param, cb);
    }
    ADMIN.adminSortInsert = adminSortInsert;
    function adminSortInsert_allgame(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsortinsert_allgame", param, cb);
    }
    ADMIN.adminSortInsert_allgame = adminSortInsert_allgame;
    function adminSortInsert_newgame(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsortinsert_newgame", param, cb);
    }
    ADMIN.adminSortInsert_newgame = adminSortInsert_newgame;
    function adminSortClick(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsortclick", param, cb);
    }
    ADMIN.adminSortClick = adminSortClick;
    function adminGetActivityInfos(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetactivityinfos", param, cb);
    }
    ADMIN.adminGetActivityInfos = adminGetActivityInfos;
    function adminGetHotGame(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingethotgame", param, cb);
    }
    ADMIN.adminGetHotGame = adminGetHotGame;
    function adminGetADImg(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetadimg", param, cb);
    }
    ADMIN.adminGetADImg = adminGetADImg;
    function adminGethotgameImg(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingethotgameimg", param, cb);
    }
    ADMIN.adminGethotgameImg = adminGethotgameImg;
    function adminSaveHotGameInfo(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsavehotgameinfo", param, cb);
    }
    ADMIN.adminSaveHotGameInfo = adminSaveHotGameInfo;
    function adminSaveADInfo(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsaveadinfo", param, cb);
    }
    ADMIN.adminSaveADInfo = adminSaveADInfo;
    function adminInsertADInfo(param, imgfile, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admininsertadinfo", param, cb, [{ imgfile: imgfile }]);
    }
    ADMIN.adminInsertADInfo = adminInsertADInfo;
    function adminSortInsertForAD(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsortinsertforad", param, cb);
    }
    ADMIN.adminSortInsertForAD = adminSortInsertForAD;
    function adminGetCPGameBalance(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetcpgamebalance", param, cb);
    }
    ADMIN.adminGetCPGameBalance = adminGetCPGameBalance;
    function adminGetCPAppInfoForPercent(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetcpappinfoforpercent", param, cb);
    }
    ADMIN.adminGetCPAppInfoForPercent = adminGetCPAppInfoForPercent;
    function adminChangeBalanceStatus(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminchangebalancestatus", param, cb);
    }
    ADMIN.adminChangeBalanceStatus = adminChangeBalanceStatus;
    function adminJS(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminjs", param, cb);
    }
    ADMIN.adminJS = adminJS;
    function adminNotJS(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminnotjs", param, cb);
    }
    ADMIN.adminNotJS = adminNotJS;
    function adminPushTo(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminpushto", param, cb);
    }
    ADMIN.adminPushTo = adminPushTo;
    function adminRemoveHotORec(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminremovehotorrec", param, cb);
    }
    ADMIN.adminRemoveHotORec = adminRemoveHotORec;
    function adminGetUserOLDataGroupByGame(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetuseroldatagroupbygame", param, cb);
    }
    ADMIN.adminGetUserOLDataGroupByGame = adminGetUserOLDataGroupByGame;
    function adminGetChannelCount(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetchannelcount", param, cb);
    }
    ADMIN.adminGetChannelCount = adminGetChannelCount;
    function adminGetChannelCount_NEW(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetchannelcountnew", param, cb);
    }
    ADMIN.adminGetChannelCount_NEW = adminGetChannelCount_NEW;
    function adminGetALLGAMENAME_NEW(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetallgamenamenew", param, cb);
    }
    ADMIN.adminGetALLGAMENAME_NEW = adminGetALLGAMENAME_NEW;
    function adminGetNEWGAMENAME_NEW(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetnewgamenamenew", param, cb);
    }
    ADMIN.adminGetNEWGAMENAME_NEW = adminGetNEWGAMENAME_NEW;
    function adminGetNEWGAMENAMEUP_NEW(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetnewgamenameupnew", param, cb);
    }
    ADMIN.adminGetNEWGAMENAMEUP_NEW = adminGetNEWGAMENAMEUP_NEW;
    function adminGetAllSdkName_NEW(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetallsdknew", param, cb);
    }
    ADMIN.adminGetAllSdkName_NEW = adminGetAllSdkName_NEW;
    function adminGetGameCount(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetgamecount", param, cb);
    }
    ADMIN.adminGetGameCount = adminGetGameCount;
    function adminGetGameIncome(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetgameincome", param, cb);
    }
    ADMIN.adminGetGameIncome = adminGetGameIncome;
    function adminGetGameUser(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetgameuser", param, cb);
    }
    ADMIN.adminGetGameUser = adminGetGameUser;
    function adminAddGiftType(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminaddgifttype", param, cb);
    }
    ADMIN.adminAddGiftType = adminAddGiftType;
    function adminDeleteGiftType(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admindeletegifttype", param, cb);
    }
    ADMIN.adminDeleteGiftType = adminDeleteGiftType;
    function adminGetAllGift(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetallgift", param, cb);
    }
    ADMIN.adminGetAllGift = adminGetAllGift;
    function adminGetAllGift_new(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetallgift_new", param, cb);
    }
    ADMIN.adminGetAllGift_new = adminGetAllGift_new;
    function adminUploadFile(param, file, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminuploadfile", param, cb, [{ codefile: file }]);
    }
    ADMIN.adminUploadFile = adminUploadFile;
    function adminUploadFile_vip(param, file, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminuploadfile_vip", param, cb, [{ codefile: file }]);
    }
    ADMIN.adminUploadFile_vip = adminUploadFile_vip;
    function adminCalData(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admincaldata", param, cb);
    }
    ADMIN.adminCalData = adminCalData;
    function adminChargeRankData(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminchargerankdata", param, cb);
    }
    ADMIN.adminChargeRankData = adminChargeRankData;
    function adminGetUserDetail(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetuserdetail", param, cb);
    }
    ADMIN.adminGetUserDetail = adminGetUserDetail;
    function adminGetYshCPDetail(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetyshcpdetail", param, cb);
    }
    ADMIN.adminGetYshCPDetail = adminGetYshCPDetail;
    function adminSendPayCallback(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsendpaycallback", param, cb);
    }
    ADMIN.adminSendPayCallback = adminSendPayCallback;
    function adminGetPlameformData(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetplameformdata", param, cb);
    }
    ADMIN.adminGetPlameformData = adminGetPlameformData;
    function adminGCDS(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingcds", param, cb);
    }
    ADMIN.adminGCDS = adminGCDS;
    function adminChannelDetail(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminchanneldetail", param, cb);
    }
    ADMIN.adminChannelDetail = adminChannelDetail;
    function adminCCDS(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminccds", param, cb);
    }
    ADMIN.adminCCDS = adminCCDS;
    function adminUCDS(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminucds", param, cb);
    }
    ADMIN.adminUCDS = adminUCDS;
    function adminGDDS(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingdds", param, cb);
    }
    ADMIN.adminGDDS = adminGDDS;
    function adminGKDS(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingkds", param, cb);
    }
    ADMIN.adminGKDS = adminGKDS;
    function adminPCDS(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminpcds", param, cb);
    }
    ADMIN.adminPCDS = adminPCDS;
    function adminPUDS(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminpuds", param, cb);
    }
    ADMIN.adminPUDS = adminPUDS;
    function adminPVDS(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminpvds", param, cb);
    }
    ADMIN.adminPVDS = adminPVDS;
    function adminPGCDS(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminpgcds", param, cb);
    }
    ADMIN.adminPGCDS = adminPGCDS;
    function adminPUCDS(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminpucds", param, cb);
    }
    ADMIN.adminPUCDS = adminPUCDS;
    function admindelBAG(param, cb) {
        PostServer("admindelbag", param, cb);
    }
    ADMIN.admindelBAG = admindelBAG;
    function admindelBAG_vip(param, cb) {
        PostServer("admindelbag_vip", param, cb);
    }
    ADMIN.admindelBAG_vip = admindelBAG_vip;
    function adminGetCheckBagList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetcheckbaglist", param, cb);
    }
    ADMIN.adminGetCheckBagList = adminGetCheckBagList;
    function adminGetCheckBagList_vip(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetcheckbaglist_vip", param, cb);
    }
    ADMIN.adminGetCheckBagList_vip = adminGetCheckBagList_vip;
    //获取开服表
    function adminGetAllTable(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetalltable", param, cb);
    }
    ADMIN.adminGetAllTable = adminGetAllTable;
    //平台用户信息
    function adminGetAllUser(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetalluser", param, cb);
    }
    ADMIN.adminGetAllUser = adminGetAllUser;
    //VIP用户信息
    function adminGetAllVIPUser(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetallvipuser", param, cb);
    }
    ADMIN.adminGetAllVIPUser = adminGetAllVIPUser;
    //平台用户游戏列表
    function adminGetAllUserGame(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetallusergame", param, cb);
    }
    ADMIN.adminGetAllUserGame = adminGetAllUserGame;
    //保存开服表
    function adminAddTable(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminaddtable", param, cb);
    }
    ADMIN.adminAddTable = adminAddTable;
    function adminGetCheckTableList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetchecktablelist", param, cb);
    }
    ADMIN.adminGetCheckTableList = adminGetCheckTableList;
    function admindelTable(param, cb) {
        PostServer("admindeltable", param, cb);
    }
    ADMIN.admindelTable = admindelTable;
    //获取游戏活动列表
    function adminGetAllActivity(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetallactivity", param, cb);
    }
    ADMIN.adminGetAllActivity = adminGetAllActivity;
    //获取游戏活动列表
    function adminGetOneActivity(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetoneactivity", param, cb);
    }
    ADMIN.adminGetOneActivity = adminGetOneActivity;
    //保存活动
    function adminAddActivity(param, files, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminaddactivity", param, cb, [{ adimg: files[0] }]);
    }
    ADMIN.adminAddActivity = adminAddActivity;
    //保存首页第一个banner
    function addIndexFirstBanner(param, files, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("addindexfirstbanner", param, cb, [{ adimg: files[0] }]);
    }
    ADMIN.addIndexFirstBanner = addIndexFirstBanner;
    //获取活动多选列表
    function adminGetCheckActivityList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetcheckactivitylist", param, cb);
    }
    ADMIN.adminGetCheckActivityList = adminGetCheckActivityList;
    //多选删除活动
    function admindelActivity(param, cb) {
        PostServer("admindelallactivity", param, cb);
    }
    ADMIN.admindelActivity = admindelActivity;
    //获取具体游戏活动详情
    function adminGetAllActivityDetail(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetallactivitydetail", param, cb);
    }
    ADMIN.adminGetAllActivityDetail = adminGetAllActivityDetail;
    //获取具体游戏活动详情
    function adminGetAllActivityDetail2(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetallactivitydetail2", param, cb);
    }
    ADMIN.adminGetAllActivityDetail2 = adminGetAllActivityDetail2;
    //获取消息列表
    function adminGetAllMessage(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetallmessage", param, cb);
    }
    ADMIN.adminGetAllMessage = adminGetAllMessage;
    //获取消息多选列表
    function adminGetCheckMessageList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetcheckmessagelist", param, cb);
    }
    ADMIN.adminGetCheckMessageList = adminGetCheckMessageList;
    //多选选删除消息列表
    function admindelMessage(param, cb) {
        PostServer("admindelallmessage", param, cb);
    }
    ADMIN.admindelMessage = admindelMessage;
    //保存消息内容
    function adminAddMessage(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminaddmessage", param, cb);
    }
    ADMIN.adminAddMessage = adminAddMessage;
    //获取反馈消息列表
    function adminGetAllFeedBack(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetallfeedback", param, cb);
    }
    ADMIN.adminGetAllFeedBack = adminGetAllFeedBack;
    //获取反馈消息列表
    function adminGetCheckFeedBackList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetcheckfeedbacklist", param, cb);
    }
    ADMIN.adminGetCheckFeedBackList = adminGetCheckFeedBackList;
    //多选选删除反馈信息列表
    function admindelFeedBack(param, cb) {
        PostServer("admindelallfeedback", param, cb);
    }
    ADMIN.admindelFeedBack = admindelFeedBack;
    //处理反馈问题
    function adminDealProblem(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminadddealproblem", param, cb);
    }
    ADMIN.adminDealProblem = adminDealProblem;
    //管理获取高级福利列表
    function adminGetAllAccountType(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetallaccounttype", param, cb);
    }
    ADMIN.adminGetAllAccountType = adminGetAllAccountType;
    //审核高级福利列表
    function adminGetAllReviewAccount(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetallreviewaccount", param, cb);
    }
    ADMIN.adminGetAllReviewAccount = adminGetAllReviewAccount;
    //获取高级福利管理列表
    function adminGetCheckAcountTypeList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetcheckaccounttypelist", param, cb);
    }
    ADMIN.adminGetCheckAcountTypeList = adminGetCheckAcountTypeList;
    //多选选删除反馈信息列表
    function admindelAccountType(param, cb) {
        PostServer("admindelallaccounttype", param, cb);
    }
    ADMIN.admindelAccountType = admindelAccountType;
    //获取审核高级福利列表
    function adminGetCheckReviewAccountList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetcheckreviewaccountlist", param, cb);
    }
    ADMIN.adminGetCheckReviewAccountList = adminGetCheckReviewAccountList;
    //多选通过高级福利审核
    function adminpassReviewAccount(param, cb) {
        PostServer("adminpassallreviewaccount", param, cb);
    }
    ADMIN.adminpassReviewAccount = adminpassReviewAccount;
    //多选不通过高级福利审核
    function adminnotpassReviewAccount(param, cb) {
        PostServer("adminnotpassreviewaccount", param, cb);
    }
    ADMIN.adminnotpassReviewAccount = adminnotpassReviewAccount;
    //添加高级福利
    function adminAddAccount(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminaddaccount", param, cb);
    }
    ADMIN.adminAddAccount = adminAddAccount;
    function adminSaveAppInfo_new(param, files, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsaveappinfo_new", param, cb, [{ icoimg: files[0], adimg: files[1], backimg: files[2], bannerimg: files[3] }]);
    }
    ADMIN.adminSaveAppInfo_new = adminSaveAppInfo_new;
    function adminChargeRankData_New(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminchargerankdatanew", param, cb);
    }
    ADMIN.adminChargeRankData_New = adminChargeRankData_New;
    function adminGetSdkAppList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetsdkapplist", param, cb);
    }
    ADMIN.adminGetSdkAppList = adminGetSdkAppList;
    function adminGetAppProducts(param, cb) {
        PostServer("admingetappproducts", param, cb);
    }
    ADMIN.adminGetAppProducts = adminGetAppProducts;
    function adminGetSelSdkAppList(param, cb) {
        PostServer("admingetselsdkapplist", param, cb);
    }
    ADMIN.adminGetSelSdkAppList = adminGetSelSdkAppList;
    function adminSaveSdkAppInfo(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsavesdkappinfo", param, cb);
    }
    ADMIN.adminSaveSdkAppInfo = adminSaveSdkAppInfo;
    function adminSortChange(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsortchange", param, cb);
    }
    ADMIN.adminSortChange = adminSortChange;
    function adminSortHotGame(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminsorthotgame", param, cb);
    }
    ADMIN.adminSortHotGame = adminSortHotGame;
    function adminGetAllCpAppList(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("getallcpapplist", param, cb);
    }
    ADMIN.adminGetAllCpAppList = adminGetAllCpAppList;
    function adminGetBlance(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetblance", param, cb);
    }
    ADMIN.adminGetBlance = adminGetBlance;
    function adminGetBlanceDetail(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetblancedetail", param, cb);
    }
    ADMIN.adminGetBlanceDetail = adminGetBlanceDetail;
    function adminUploadBlanceFile(param, file, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminuploadblancefile", param, cb, [{ imgfile: file }]);
    }
    ADMIN.adminUploadBlanceFile = adminUploadBlanceFile;
    function getAllVipQQ(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("admingetallvipqq", param, cb);
    }
    ADMIN.getAllVipQQ = getAllVipQQ;
    function updateVipQQ(param, cb) {
        param.loginid = ADMIN.userinfo.loginid;
        param.pwd = ADMIN.userinfo.pwd;
        PostServer("adminupdatevipqq", param, cb);
    }
    ADMIN.updateVipQQ = updateVipQQ;
    function getRechageReward(param, cb) {
        PostServer("getrechagereward", param, cb);
    }
    ADMIN.getRechageReward = getRechageReward;
    function getPointReward(param, cb) {
        PostServer("getpointreward", param, cb);
    }
    ADMIN.getPointReward = getPointReward;
    function getRechagerobot(param, cb) {
        PostServer("getrechagerobot", param, cb);
    }
    ADMIN.getRechagerobot = getRechagerobot;
    function saveRechageRobot(param, cb) {
        PostServer("saverechagerobot", param, cb);
    }
    ADMIN.saveRechageRobot = saveRechageRobot;
    function getIndexTile(param, cb) {
        PostServer("getindextitle", param, cb);
    }
    ADMIN.getIndexTile = getIndexTile;
    function saveIndexTitle(param, cb) {
        PostServer("saveindextitle", param, cb);
    }
    ADMIN.saveIndexTitle = saveIndexTitle;
    function getIndexTitleGame(param, cb) {
        PostServer("getindextitlegame", param, cb);
    }
    ADMIN.getIndexTitleGame = getIndexTitleGame;
    function saveIndexGame(param, cb) {
        PostServer("saveindexgame", param, cb);
    }
    ADMIN.saveIndexGame = saveIndexGame;
    function saveSearchGame(param, cb) {
        PostServer("savesearchgame", param, cb);
    }
    ADMIN.saveSearchGame = saveSearchGame;
    function getSearchGameList(param, cb) {
        PostServer("getsearchgamelist", param, cb);
    }
    ADMIN.getSearchGameList = getSearchGameList;
    function getAdBannerlist(param, cb) {
        PostServer("getadbannerlist", param, cb);
    }
    ADMIN.getAdBannerlist = getAdBannerlist;
    function getIndexCountBanner(param, cb) {
        PostServer("getcountbanner", param, cb);
    }
    ADMIN.getIndexCountBanner = getIndexCountBanner;
})(ADMIN || (ADMIN = {}));
//# sourceMappingURL=5wansdk.js.map