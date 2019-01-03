///<reference path='jquery.d.ts' />



module utils {
    export function ReplaceAllString(str, oldstr, newstr) {
        var arr = str.split(oldstr);
        var afterName = "";
        for (var i = 0; i < arr.length - 1; i++) {
            afterName += arr[i] + newstr;
        }
        afterName += arr[i];
        return afterName;
    }

    export function __prefix(num, val) {
        return (new Array(num).join('0') + val).slice(-num);
    }
    Date.prototype.toLocaleDateString = function (): string {
        return this.getFullYear() + "-" + __prefix(2, this.getMonth() + 1) + "-" + __prefix(2, this.getDate());
    }
    Date.prototype.toLocaleString = function (): string {
        return this.getFullYear() + "-" + __prefix(2, this.getMonth() + 1) + "-" + __prefix(2, this.getDate())
            + " " + __prefix(2, this.getHours()) + ":" + __prefix(2, this.getMinutes()) + ":" + __prefix(2, this.getSeconds())
    }
    export function GetHost(): string {
        //	return "5wanpk.com";
        //	return "cbttpj.vicp.net"; 
        var str = window.location.host;
        var i = str.indexOf(":");
        if (i >= 0) str = str.substr(0, i);
        return str;

    }
    export function GetHostPort(): string {
        var str = window.location.host;
        var i = str.indexOf(":");
        if (i >= 0) return str.substr(i + 1);
        return "80";
    }
    export var g_fronturl: string;
    export var g_serverurl: string;
    export var g_pkserverurl: string;
    var g_ishttps = false;
    if (window.location.href.substr(0, 8) == "https://") {
        g_ishttps = true;
    }

    if (g_ishttps) {
        //	g_fronturl = "https://" + GetHost() + ":" + GetHostPort() + "/";
        //	g_serverurl = "https://" + GetHost() + ":7037/";
        //	g_pkserverurl = "wss://" + GetHost() + ":7038/";


        g_fronturl = "https://5wanpk.com/open/";
        g_serverurl = "https://5wanpk.com:7037/";
        g_pkserverurl = "wss://5wanpk.com:7038/";
    }
    else {
        g_fronturl = "http://" + GetHost() + ":" + GetHostPort() + "/";
        g_serverurl = "http://" + GetHost() + ":7031/";
        g_pkserverurl = "ws://" + GetHost() + ":7032/";
        //	g_fronturl = "http://cbttpj.vicp.net:81/";
        //	g_serverurl = "http://cbttpj.vicp.net:7035/";
        //	g_pkserverurl = "ws://cbttpj.vicp.net:7036/";


        //		g_fronturl = "http://5wanpk.com/open/";
        //		g_serverurl = "http://5wanpk.com:7035/";
        //		g_pkserverurl = "ws://5wanpk.com:7036/";
    }


    export function setCookie(name: string, objvalue: any) {
        name = "5WANSDK_" + name;
        var value = JSON.stringify(objvalue);
        localStorage.setItem(name, value);
        //	var exp = new Date();
        //	exp.setTime(exp.getTime() + 1 * 60 * 60 * 1000);//有效期1小时 
        //	document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toUTCString();
    }
    export function getCookie(name: string): any {
        name = "5WANSDK_" + name;
        var str = localStorage.getItem(name);
        if (str) return JSON.parse(decodeURIComponent(str));
        else return null;
        //	var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        //	if (arr != null)
        //		return JSON.parse(decodeURIComponent(arr[2]));
        //	return null;
    }

    export function getQueryString(name): string {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }
    export function getRequest(): any {
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

    export function getFileUrl(fileInput: HTMLInputElement) {
        var url = window.URL.createObjectURL(fileInput.files.item(0));
        return url;
    }

    export function optionSelect(select: HTMLSelectElement, str) {//设置选择框的选项值，select选择框，str匹配字符串
        var se: HTMLSelectElement = select;
        var flag = 0;
        for (var i = 0; i < se.children.length; i++) {
            if (str === se.children[i].textContent) {
                flag = i;
                se.selectedIndex = flag;
                break;
            } else {
                continue;
            }
        }
    }

    export function deepCopy(source: any): any {
        if (source == null) return null;
        var ty = typeof (source);
        var result;
        if (source instanceof Array)
            result = [];
        else result = {};
        for (var key in source) {
            var keytype: string = typeof source[key];
            if (keytype == "object") {
                result[key] = deepCopy(source[key]);
            }
            else {
                result[key] = source[key];
            }
        }
        return result;
    }

    //使用0123456789数字图片创建img，n:一个数字,0-9，minus:是否有负号，offsetX,offsetY：数字所在偏移
    export function CreateNumberImg(imgurl: string, num: string, minus: boolean, cb: (img: HTMLImageElement, offsetX: number, offsetY: number) => void) {
        var img: HTMLImageElement = document.createElement("img");
        img.style.position = "absolute";
        var nblock = minus ? 11 : 10;

        img.onload = function (ev) {
            var width = img.width;
            var height = img.height;
            var dwidth = width / nblock;

            var offsetX;
            var offsetY;
            var str: string;
            if (num == "-") {
                if (minus) {
                    offsetX = 0;
                    offsetY = 0;
                    str = "rect(0px " + dwidth + "px " + height + "px " + 0 + "px)";
                }
                else {//没有要显示的字符
                    cb(null, 0, 0);
                    return;
                }
            }
            else {

                var n = parseInt(num);
                if (minus) n++;
                offsetX = dwidth * n;
                offsetY = 0;

                str = "rect(0px " + (dwidth * (n + 1)) + "px " + height + "px " + (dwidth * n) + "px)";
            }



            img.style.clip = str;
            cb(img, offsetX, offsetY);
        }
        img.src = imgurl;

    }
    //通过0-9数字图片创建一组img填充到div里
    export function CreateNumberImgs(imgurl: string, num: string, numwidth: number, minus: boolean, parent: HTMLDivElement) {
        for (var i = 0; i < num.length; i++) {
            function fun(i: number) {
                CreateNumberImg(imgurl, num.substr(i, 1), minus, (img, offsetx, offsety) => {
                    img.style.left = (i * numwidth - offsetx) + "px";
                    img.style.top = offsety + "px";
                    parent.appendChild(img);
                });
            }
            fun(i);
        }
    }

    //数组去重
    export function removeRepeat(arrays: any[]) {
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
    //利用sessionStorage做一个缓存机制
    export function setStorage(key, value, flags) {
        var jsonObj = JSON.stringify(value);
        if (flags == "sessionStorage") {
            sessionStorage.setItem(key, jsonObj);
        } else {
            localStorage.setItem(key, jsonObj);
        }
    }
    //读取sessionStorage项
    export function getStorage(key, flags): any {
        var jsonObjs;
        if (flags == "sessionStorage") {
            jsonObjs = sessionStorage.getItem(key);
        } else {
            jsonObjs = localStorage.getItem(key);
        }
        var obj = JSON.parse(jsonObjs);
        return obj;
    }
    //移除sessionStorage项
    export function removeStorag(key, flags) {
        if (flags == "sessionStorage") {
            sessionStorage.removeItem(key);
        } else {
            localStorage.removeItem(key);
        }
    }
    //清空sessionStorage项
    export function clearSessionStorag(flags) {
        if (flags == "sessionStorage") {
            sessionStorage.clear();
        } else {
            localStorage.clear();
        }
    }
    export function DotString(str: string, maxlen: number): string {//文本截取，str内容，maxlen最大长度
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) len += 2;
            else len++;
            if (len > maxlen) {
                return str.substr(0, i) + "...";
            }
        }
        return str;
    }

    export function getBytesLength(str: string) {//取得字符串字节数
        return str.replace(/[^\x00-\xff]/gi, "--").length;
    }

    //获取浏览器名称 
    export function getbrowser() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) { return "Opera" }; //判断是否Opera浏览器
        if (userAgent.indexOf("Firefox") > -1) { return "FF"; } //判断是否Firefox浏览器
        if (userAgent.indexOf("Safari") > -1) { return "Safari"; } //判断是否Safari浏览器
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) { return "IE"; };//判断是否IE浏览器
    }

    export function pageselectCallback(page_index, jq, showtbid, hidetbid, hidetrid, mdata, per_page) {//page_index 索引頁  showtbid 显示数据的tbodyid  hidetbid  隐藏数据的tbodyid  mdata  请求数据的数据  per_page 一页显示多少条数据
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

    export function isMobileBrowser() {//判断是不是移动浏览器
        var UA = navigator.userAgent,
            isAndroid = /android|adr/gi.test(UA),
            isIos = /iphone|ipod|ipad/gi.test(UA) && !isAndroid, // 据说某些国产机的UA会同时包含 android iphone 字符
            isMobile = isAndroid || isIos;  // 粗略的判断
        if (isMobile) {
            return true;
        } else {
            return false;
        }
    }

    export function dialogBox(txt, callback?) {//提示信息的弹出
        var html = '<div id="dialogBox" class="dialog_box">';
        html += '<div class="dialog">';
        html += '<div class="dialog_tip">提示信息</div>';
        html += '<div class="dialog_mess">' + txt + "</div>";
        html += '<div class="dialog_qd">';
        html += '<a href="javascript:;">确定</a>';
        html += '</div></div></div>'
        $("body").append(html);
        $(".dialog_qd a").click(function () {
            $("#dialogBox").remove();
            if (callback) {
                callback()
            }
        })
    }

    export function UrlPara2Json(paraStr) {//URL参数转化为JSON
        var string = paraStr.split('&');
        var res = {};
        for (var i = 0; i < string.length; i++) {
            var str = string[i].split('=');
            res[str[0]] = str[1];
        }
        return JSON.stringify(res);
    }

    export function setExpiresCookies(name, value) {
        var exp = new Date();//1 * 60 * 60 * 1000
        //exp.setTime(exp.getTime() + (1800000));//有效期1小时 
        exp.setTime(exp.getTime() + (43200000));//有效期12小时 
        document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toUTCString();
    }
    export function getExpiresCookies(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return decodeURIComponent(arr[2]);
        else
            return null;
    }
}

function getQueryString(name): string {
    return utils.getQueryString(name);
}
function getCookie(name: string): any {
    return utils.getCookie(name);
}
function setCookie(name: string, objvalue: any) {
    return utils.setCookie(name, objvalue);
}
function getRequest(): any {
    return utils.getRequest();
}
function deepCopy(source: any): any {
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





module MD5UTIL {
    var hexcase = 0;
    function _hex_md5(a) {
        a += "@5wansdk!";
        if (a == "") return a;
        return rstr2hex(rstr_md5(str2rstr_utf8(a)))
    }
    export function hex_md5(a) {
        return _hex_md5(_hex_md5(a) + "!S@D#K?");
    }

    function hex_hmac_md5(a, b) {
        return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(b)))
    }
    function md5_vm_test() {
        return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72"
    }
    function rstr_md5(a) {
        return binl2rstr(binl_md5(rstr2binl(a), a.length * 8))
    }
    function rstr_hmac_md5(c, f) {
        var e = rstr2binl(c);
        if (e.length > 16) {
            e = binl_md5(e, c.length * 8)
        }
        var a = Array(16),
            d = Array(16);
        for (var b = 0; b < 16; b++) {
            a[b] = e[b] ^ 909522486;
            d[b] = e[b] ^ 1549556828
        }
        var g = binl_md5(a.concat(rstr2binl(f)), 512 + f.length * 8);
        return binl2rstr(binl_md5(d.concat(g), 512 + 128))
    }
    function rstr2hex(c) {
        try {
            hexcase
        } catch (g) {
            hexcase = 0
        }
        var f = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var b = "";
        var a;
        for (var d = 0; d < c.length; d++) {
            a = c.charCodeAt(d);
            b += f.charAt((a >>> 4) & 15) + f.charAt(a & 15)
        }
        return b
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
                d++
            }
            if (a <= 127) {
                b += String.fromCharCode(a)
            } else {
                if (a <= 2047) {
                    b += String.fromCharCode(192 | ((a >>> 6) & 31), 128 | (a & 63))
                } else {
                    if (a <= 65535) {
                        b += String.fromCharCode(224 | ((a >>> 12) & 15), 128 | ((a >>> 6) & 63), 128 | (a & 63))
                    } else {
                        if (a <= 2097151) {
                            b += String.fromCharCode(240 | ((a >>> 18) & 7), 128 | ((a >>> 12) & 63), 128 | ((a >>> 6) & 63), 128 | (a & 63))
                        }
                    }
                }
            }
        }
        return b
    }
    function rstr2binl(b) {
        var a = Array(b.length >> 2);
        for (var c = 0; c < a.length; c++) {
            a[c] = 0
        }
        for (var c = 0; c < b.length * 8; c += 8) {
            a[c >> 5] |= (b.charCodeAt(c / 8) & 255) << (c % 32)
        }
        return a
    }
    function binl2rstr(b) {
        var a = "";
        for (var c = 0; c < b.length * 32; c += 8) {
            a += String.fromCharCode((b[c >> 5] >>> (c % 32)) & 255)
        }
        return a
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
            l = safe_add(l, e)
        }
        return Array(o, n, m, l)
    }
    function md5_cmn(h, e, d, c, g, f) {
        return safe_add(bit_rol(safe_add(safe_add(e, h), safe_add(c, f)), g), d)
    }
    function md5_ff(g, f, k, j, e, i, h) {
        return md5_cmn((f & k) | ((~f) & j), g, f, e, i, h)
    }
    function md5_gg(g, f, k, j, e, i, h) {
        return md5_cmn((f & j) | (k & (~j)), g, f, e, i, h)
    }
    function md5_hh(g, f, k, j, e, i, h) {
        return md5_cmn(f ^ k ^ j, g, f, e, i, h)
    }
    function md5_ii(g, f, k, j, e, i, h) {
        return md5_cmn(k ^ (f | (~j)), g, f, e, i, h)
    }
    function safe_add(a, d) {
        var c = (a & 65535) + (d & 65535);
        var b = (a >> 16) + (d >> 16) + (c >> 16);
        return (b << 16) | (c & 65535)
    }
    function bit_rol(a, b) {
        return (a << b) | (a >>> (32 - b))
    };






    export function GetSign(para: any, key: string): string//生成签名
    {
        var keys: string[] = [];
        for (var k in para) {
            keys.push(k);
        }
        keys.sort((a, b) => {
            return a.localeCompare(b);
        });
        var params: string = "";
        for (var i = 0; i < keys.length; i++) {
            var val = para[keys[i]];
            if (val === null || val === undefined || val === "") continue;
            if (keys[i] == "sign" || keys[i] == "sign_type") continue;
            params += "&" + keys[i] + "=" + para[keys[i]];
        }
        params = params.substr(1);
        var sign = rstr2hex(rstr_md5(str2rstr_utf8(params + key)));

        return sign;
    }



}






class ServerResp {
    errno: number;//错误号，0表示成功
    message: string;//错误信息
    data: any;//返回数据
}




//POST数据到服务端
//cmd:指令名称
//param:参数,一个对象
//cb：POST后服务器返回
//files:上传文件，格式为[{名称1:file},{名称2:file}...]
function PostServer(cmd: string, param: any, cb: (resp: ServerResp) => void, files?: any[]) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {// 4 = "loaded"
            if (xmlhttp.status == 200) {// 200 = OK
                var resp = JSON.parse(xmlhttp.responseText);
                cb(resp);
            }
            else {
                //alert("服务器没有响应");
            }
        }
    }
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




    xmlhttp.upload.addEventListener("progress", (evt) => {
    }, false);
    xmlhttp.addEventListener("load", (evt) => {
    }, false);
    xmlhttp.addEventListener("error", (evt) => {
    }, false);
    xmlhttp.addEventListener("abort", (evt) => {
    }, false);
    xmlhttp.send(fd);
    //	xmlhttp.send(str);
}





//获取验证码
class GETIDCODEREQ {

}
class GETIDCODERESP {
    codekey: string;//验证码KEY
    codeimg: any;//验证码图片数据
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//获取验证码
function GetIDCode(para: GETIDCODEREQ, cb: (para: ServerResp) => void) {

    PostServer("getidcode", para, cb);
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//H5调用模块，用来弹出登录、注册、支付等页面
module SDKUTIL {

    //弹出一个页面
    export function ShowIFrame(url: string, opacity: boolean, onload: (ev: Event, divbgpage: HTMLDivElement, iframe: HTMLIFrameElement) => void) {
        var divbgpage: HTMLDivElement;//半透明背景
        var iframe: HTMLIFrameElement;//显示的iframe


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

        iframe.onload = ev => {
            onload(ev, divbgpage, iframe);
            iframe.onload = null;
        };

    }
    //关闭由ShowIFrame弹出的页面
    export function RemoveIFrame(divbgpage: HTMLDivElement, iframe: HTMLIFrameElement) {
        if (divbgpage) document.body.removeChild(divbgpage);
        if (iframe) document.body.removeChild(iframe);
        divbgpage = null;
        iframe = null;
    }
}

//游戏中心用
module GAMECENTER {

    //用户信息
    export class GSUSERINFO {
        sdkloginid: string;//SDK登录账号
        sdkuserid: number;
        userid: number;//用户ID
        nickname: string;//昵称
        headico: string;//头像
        gold: number;//金币
        haspwd: number;//是否修改过密码
        email: string;//邮箱地址
        phone: string;//电话
        address: string;//地址省 市 区
        addressee: string;//收件人
        addressdetail: string;//地址门牌号
        zipcode: string;//邮编
        addrphone: string;//收件人电话
        session: string;
        lasttime: number;
        sendmailtime: string;
        sendsmstime: number;//上次发送短信时间
        sex: number;//用户性别
        point: number;//用户积分
    }

    //玩家登录后的REQ要以这个为基类
    export class GSUSERREQBASE {
        mysession: string;//登录后的SESSION
    }



    //登录后基类
    export class USERREQBASE {
        mysession: string;//登录后的SESSION
    }
    //检测登录
    class GSUSERCHECKSESSIONREQ extends GSUSERREQBASE {
        //日志记录访问路径
        referrer: string;//引用页
        currenturl: string;//当前页
        channel: string;//渠道
    }

    //用户注册
    export class GSUSERREGREQ {
        nickname: string;//昵称
        loginid: string;
        phone: string;//手机号
        code: string;//验证码
        key: string;//验证码KEY
        pwd: string;//密码
        channel: string;//渠道
    }
    export class GSUSERREGRESP {
        userinfo: GSUSERINFO;
    }


	   //随机昵称
    export class GSUSERRANDNICKREQ {

    }
    export class GSUSERRANDNICKRESP {
        nickname: string;
    }


    //用户登录
    export class GSUSERLOGINREQ {
        //使用账号密码登录时
        loginid: number;//5玩SDK账号，空则自动创建一个账号，密码123456
        pwd: string;//密码
        //使用手机号验证码登录时
        phone: string;//手机号
        code: string;//验证码

    }



    //QQ登录
    export class GSUSERQQLOGINREQ {
        loginid: string;
        pwd: string;
        nickname: string;
        qqid: string;
        headico: string;

    }

    //微信登录
    export class GSUSERWXLOGINREQ {
        loginid: string;
        pwd: string;
        nickname: string;
        wxid: string;
        headico: string;

    }



    export class GSUSERLOGINRESP {
        userinfo: GSUSERINFO;
    }

    //修改头像
    export class GSUSERSETHEADICOREQ extends GSUSERREQBASE {

    }
    export class GSUSERSETHEADICOREQ2 extends GSUSERSETHEADICOREQ {
        path: string;
    }
    export class GSUSERSETHEADICORESP {
        headico: string;
    }
    //修改昵称
    export class GSUSERSETNICKNAMEREQ extends GSUSERREQBASE {
        nickname: string;
    }
    export class GSUSERSETNICKNAMERESP {

    }

    //手机验证码
    export class GSUSERSENDPHONECODEREQ extends GSUSERREQBASE {
        phone: string;//发送到手机号
    }
    //邮箱验证码
    export class GSUSERSENDMAILCODEREQ {
        loginid: string;
        mail: string;//发送到邮箱号
    }
    export class GSUSERSENDPHONECODERESP {
        key: string;//验证码MD5
    }
    //设置手机
    export class GSUSERSETPHONEREQ extends GSUSERREQBASE {
        phone: string;
        code: string;//验证码
        key: string;//验证码MD5
    }

    //设置邮箱
    export class GSUSERSETMAILREQ extends GSUSERREQBASE {
        loginid: string;
        mail: string;
        code: string;//验证码
    }
    export class GSUSERSETPHONERESP {

    }

    //验证码登录时获取验证码
    //验证码登录时获取验证码
    export class GSUSERLOGINSENDCODEREQ {
        phone: string;
        isreg: boolean;//是否是注册时获取
    }
    export class GSUSERLOGINSENDCODERESP {
        key: string;
    }


    //设置地址
    export class GSUSERSETADDRREQ extends GSUSERREQBASE {
        address: string;//地址
        addressee: string;//收件人
        addressdetail: string;//地址门牌号
        zipcode: string;//邮编
        addrphone: string;
    }
    export class GSUSERSETADDRRESP {

    }

    //修改密码
    export class GSUSERCHANGEPWDREQ extends GSUSERREQBASE {
        //        oldpwd: string;//旧密码
        newpwd: string;//新密码
    }
    //修改密码,根据传上来的用户ID
    export class GSUSERCHANGEPWDREQ2 extends GSUSERCHANGEPWDREQ {
        //        oldpwd:string;//旧密码
        newpwd: string;//新密码
        loginid: string;//登入号
        phone: string;
    }
    export class GSUSERCHANGEPWDRESP {

    }

    //取得PK游戏列表
    export class GSUSERGETPKAPPLISTREQ {
        id: number;
    }

    export class GSUSERGETPKAPPLISTRESP {
        applist: PKAPPINFO[];
    }

    //取得H5游戏列表
    export class GSUSERGETH5APPLISTREQ {
        id: number;//空表示所有游戏
    }

    export class GSUSERGETH5APPLISTRESP {
        applist: H5APPINFO[];
    }

    export class GSUSERGETH5APPIMGLISTRESP {
        applist: H5APPINFOADDIMG[];
    }

    //取得商城列表
    export class GSUSERGETSHOPGOODSLISTREQ {
        id: number;//非空时表示查询指定商品信息
    }
    export class SHOPGOODSINFO {
        id: number;
        name: string;//商品名称
        ico: string;//图标
        img: string;//点击进去的大图
        price: number;//售价（K币）
        rmbprice: number;//价值（元）
        stock: number;//库存
        detail: string;//商品描述
        notice: string;//注意要求
    }
    export class GSUSERGETSHOPGOODSLISTRESP {
        goodslist: SHOPGOODSINFO[];
    }

    //兑换
    export class GSUSEREXCHANGEREQ extends GSUSERREQBASE {
        goodsid: number;//商品ID

    }
    export class GSUSEREXCHANGERESP {
        gold: number;//兑换后的金币数
        exchangeid: number;//兑换记录ID
    }

    //获取兑换记录
    export class GSUSERGETEXCHANGERECORDREQ extends GSUSERREQBASE {

    }
    export class EXCHANGERECORD {
        id: number;
        userid: number;//用户ID
        goodsid: number;//商品ID，对应t_gsshop.id
        goodsname: string;//商品名称
        createtime: number;//创建时间
        state: number;//0:已付款，1：已发货，2：已到账，3已取消
        costgold: number;//花费金币
        message: string;//信息，包括物流信息等
        rmbprice: number;//人民币价值

        address: string;//地址（省 市 区）
        addressdetail: string;//地址门牌号
        addressee: string;//收件人
        addrphone: string;//收件人电话
        zipcode: string;//邮编
    }
    export class GSUSERGETEXCHANGERECORDRESP {
        data: EXCHANGERECORD[];
    }
    //取得各种广告条的数据，包括奖池累计、兑换商城还剩XX份、活动中PK记录、兑换记录
    export class EXCHANGEINFO {
        phone: string;//158****3561
        goods: string;//iphone6s一台
        time: number;//兑换时间
    }
    export class WEEKLYGOODS//每周兑换广告
    {
        id: number;
        goodsid: number;//商品ID
        img: string;//商品图片
        stock: number;//库存
        timestart: number;//开始时间
        timeend: number;//结束时间
    }
    //兑换商城上的广告
    export class SHOPAD {
        id: number;
        goodsid: number;
        img: string;

    }
    //PK记录,XXX VS YYY 1000K币
    export class PKRECORD {
        user1: string;
        user2: string;
        gold: number;
    }
    //精彩活动广告
    export class ACTIVITYAD {
        id: number;
        type: number;//0:url是一个链接，1：url是数字（H5游戏ID）
        url: any;
        img: string;
        isrec: number;
    }

    export class GSUSERGETBANNERDATAREQ {

    }
    export class GSUSERGETBANNERDATARESP {
        totalAwardPool: number;//累计奖池
        exchangeInfo: EXCHANGEINFO[]//兑换记录
        weeklygoods: WEEKLYGOODS;//每周兑换广告
        shopad: SHOPAD[];//商城广告
        pkrecord: PKRECORD[];//XXX VS YYY 1000K币
        activityad: ACTIVITYAD[];//活动广告
    }



    //取得充值折扣
    export class GSUSERPAYDISCOUNTREQ {

    }
    export class GSUSERPAYDISCOUNTRESP {
        discounttext: string;
        discount: number;//折扣,默认10折
    }

    //充值
    export class GSUSERPAYCREATEREQ extends GSUSERREQBASE {
        paytype: number;//0微信支付，1支付宝支付
        goodsname: string;//物品名称
        gold: number;//购买K币数
        //        money: string;//购买物品总金额（元）,保留两位小数
        showurl: string;
        channel: string;//渠道
    }

    export class GSUSERPAYCREATERESP {
        payid: string;//订单ID
        payurl: string;//支付URL
    }
    //支付宝点击了返回，删除订单
    export class GSUSERPAYDELREQ extends GSUSERREQBASE {
        payid: string;
    }
    export class GSUSERPAYDELRESP {

    }
    //玩家等待支付成功
    export class GSUSERWAITPAYRESULTREQ {
        query: any;//支付宝跳转的URL参数,调用getRequest()获得
    }
    export class GSUSERWAITPAYRESULTRESP {

    }



    //微信code获得后发送到服务器，进行获取openid、支付等操作
    export class GSUSERWXCODEREQ {
        code: string;
        state: string;
    }
    export class GetBrandWCPayRequestData {
        appId: string;
        timeStamp: string;
        nonceStr: string;
        package: string;
        signType: string = "MD5";
        paySign: string;
    }
    export class GSUSERWXCODERESP {
        data: GetBrandWCPayRequestData;
        payid: string;
    }

    export class USERLOGINWEIXINREQ {
        loginid: string;
        pwd: string;
        code: string;
        state: string;
    }

    export class WEIXINTOKEN {
        errcode: number;
        errmsg: string;
        access_token: string;//网页授权接口调用凭证,注意：此access_token与基础支持的access_token不同
        expires_in: number;//access_token接口调用凭证超时时间，单位（秒）
        refresh_token: string;//用户刷新access_token
        openid: string;//用户唯一标识，请注意，在未关注公众号时，用户访问公众号的网页，也会产生一个用户和公众号唯一的OpenID
        scope: string;//用户授权的作用域，使用逗号（,）分隔
    }

    export class WEIXINUSERINFO {
        errcode: number;
        errmsg: string;
        openid: string;//用户的唯一标识
        nickname: string;//用户昵称
        sex: number;//用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
        province: string;//用户个人资料填写的省份
        city: string;//普通用户个人资料填写的城市
        country: string;//国家，如中国为CN
        headimgurl: string;//用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
        privilege: string;//用户特权信息，json 数组，如微信沃卡用户为（chinaunicom）
        unionid: string;//只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。
    }

    export class OPENAPPRESP {
        appname: string;//分享的标题
        sharetext: string;//分享内容，空表示使用appname
        shareico: string;//分享时使用的图标
        sharelink: string;//分享的链接
    }

    export class WXCONFIG {
        debug: boolean; // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: string; // 必填，公众号的唯一标识
        timestamp: string; // 必填，生成签名的时间戳
        nonceStr: string; // 必填，生成签名的随机串
        signature: string;// 必填，签名，见附录1
        jsApiList: string[] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

    }
    export class GETWXCONFIGSIGNREQ {
        data: WXCONFIG;
        url: string;
    }
    export class GETWXCONFIGSIGNRESP {
        sign: string;
    }

    export class USERLOGINQQREQ {
        loginid: string;
        pwd: string;
        code: string;
        state: string;
    }

    export class QQTOKEN {
        ret: number;
        msg: string;
        access_token: string;
        expires_in: number;
        refresh_token: string;
    }

    export class QQOPENID {
        ret: number;
        msg: string;
        openid: string;
        client_id: string;
    }

    export class QQUSERINFO {
        ret: number;
        msg: string;
        is_lost: number;
        nickname: string;
        gender: string;
        province: string;
        city: string;
        year: string;
        figureurl: string;
        figureurl_1: string;
        figureurl_2: string;
        figureurl_qq_1: string;
        figureurl_qq_2: string;
        is_yellow_vip: string;
        vip: string;
        yellow_vip_level: string;
        level: string;
        is_yellow_year_vip: string;
    }

    //微信查询订单状态
    export class GSUSERQUERYWXPAYREQ {
        payid: string;
    }
    export class GSUSERQUERYWXPAYRESP {
    }





    ///////////////////////////////////////////////////////////////////////



    //WEBSOCKET实际传输的数据结构
    export class WEBSOCKETPACK {
        name: string;//接口名称
        errno: number = 0;
        message: string;
        data: any;//数据
    }
    //PK游戏信息
    export class PKAPPINFO {
        id: number;
        name: string;//游戏名称
        ico: string;//游戏图标
        bg: string;//下注页背景
        url: string;//游戏链接
        detail: string;//游戏描述
        opencount: number;//点击次数
        playcount: number;//多少人在玩
        createtime: number;//创建时间
        entrancegold: number;//入场花费金币
        wingold: number;//胜利获得金币

        enablerobot: number;//是否使用机器人
        robotdelay: number;//用户等待匹配几秒后使用机器人
        robotstartwait: number;//机器人等待几秒后开始游戏
        robotscorespeed: number;//机器人每秒增加多少分数
        robotplaytimemax: number;//机器人游戏最长时间（秒）
        robotplaytimemin: number;//机器人游戏最短时间（秒）
        robotwinrate: number;//机器人必胜概率百分比
        robotscoreinterval: number;//机器人每几秒提交一次分数
    }
    //联运游戏信息
    export class H5APPINFO {
        id: number;
        name: string;//游戏名称
        ico: string;//游戏图标
        url: string;//游戏链接
        detail: string;//游戏描述
        opencount: number;//点击次数
        playcount: number;//多少人在玩
        createtime: number;//创建时间
        getgold: number;//点击获得金币
        orderby: number;//排序
        remark: string;//备注
        ishot: number;//是否热门
        isrec: number;//是否推荐
        hasgift: number;//是否有礼包
        rank: number;//临时排行
        newsort: number;//新游排序数字
        type: string;//游戏类别
        show: number;//是否展示标识
    }

    export class H5APPINFOADDIMG extends H5APPINFO {
        img: string;
    }

    //广播玩家的分数
    export class GSUSERPKSCORE {
        userid: number;//玩家
        score: number;//分数
        gameover: boolean;//是否已结束
        exitgame: boolean;//是否点击退出游戏
    }
    //pk结果
    export class GSUSERPKRESULT {
        win: boolean;//是否胜利
        goldget: number;//获得多少金币
        gold: number;//获得金币后当前金币数
    }


    //WEBSOCKET连接后登录
    export class GSUSERENTERPKGAMEREQ extends GSUSERREQBASE {
        gameid: number;//游戏ID
    }
    export class PKUSERINFO//PK中的对方玩家信息
    {
        userid: number;
        nickname: string;
        headico: string;
    }
    export class GSUSERENTERPKGAMERESP {
        roomid: number;//房间ID
        user: PKUSERINFO;//对方玩家,如果没有匹配的则为空，等到有别的玩家进来匹配时才再次发送
    }

    //玩家定时提交分数
    export class GSUSERUPSCORE extends GSUSERREQBASE {
        roomid: number;//房间ID
        score: number;//分数
        gameover: boolean;//是否已结束
        exitgame: boolean;///是否点击退出游戏
    }

    export var userinfo: GSUSERINFO = null;//用户信息
    export var channel: string = null;//渠道名称
    export function SetChannel(chn: string) {
        channel = chn;
        sessionStorage["GSCHANNEL"] = channel;
    }
    export function GetChannel(): string {
        if (!channel) channel = sessionStorage["GSCHANNEL"];
        return channel;
    }


    export class HistoryUsers {//登录过的历史用户
        userid: number;
        sdkloginid: string;
        nickname: string;
        phone: string;
        email: string;
        headico: string;
        session: string;
    }
    export var historyUsers: HistoryUsers[];

    //礼包相关
    export class GETALLGIFTTYPEINFO {
        id: number;
        gameid: number;
        loginid: string;
        giftname: string;
        gifttype: string;
        groupqq: string;//加群链接
        createtime: string;
        endtime: string;
        instruction: string;
        total: number;
        remainder: number;
        useway: string;
        ico: string;
    }
    export class GETALLGIFTTYPEREQ {
        loginid: string;
    }
    export class GETALLGIFTTYPEINFORESP {
        gtlist: GETALLGIFTTYPEINFO[];
    }
    export class GETCODEINFOREQ {
        typeid: number;
        loginid: string;
        gameid: number;
        flags: number;//标识 0未领取，1领取
    }
    export class GSGETTEDSTATUSBYLOGINIDREQ {
        sdkloginid: string;
    }
    export class GSGETTEDSTATUSBYLOGINIDINFO {
        gameid: string;
        gamename: string;
        ico: string;
        giftname: string;
        code: string;
    }
    export class GSGETTEDSTATSUSBYLOGINIDRESP {
        datalist: GSGETTEDSTATUSBYLOGINIDINFO[];
    }
    export class GSGETGAMEALLGIFTREQ {
        loginid: string;
        gname: string;
        itemid: string;
    }
    export class GSGETGAMEALLGIFTINFO {
        id: string;
        gameid: string;
        loginid: string;
        giftname: string;
        instruction: string;
        total: number;
        remainder: number;
        useway: string;
        ico: string;
    }
    export class CHECKPHONEISEXISTREQ {
        phone: string;
    }
    export class GSGETGAMEALLGIFTRESP {
        datalist: GSGETGAMEALLGIFTINFO[];
    }

    export class USERCHECKBINDPHONEREQ {
        loginid: string;
    }
    export class USERCHECKBINDPHONERESP {

    }
    export class USERFINDPWDSENDCODEREQ {
        loginid: string;//账号
    }
    export class USERFINDPWDSENDCODERESP {

    }
    export class USERFINDPWDCHANGEPWDREQ {
        loginid: string;
        code: string;
        pwd: string;
    }
    export class USERFINDPWDCHANGEPWDRESP {

    }
    //新平台
    //新获取礼包列表
    export class GETALLGIFTTYPEREQNEW extends GETALLGIFTTYPEREQ {
        loginid: string;
        gameid: string;
    }

    export class GETALLGIFTTYPEINFONEW extends GETALLGIFTTYPEINFO {
        sum: number;
        name: string;
    }
    export class GETALLGIFTTYPEINFORESPNEW {
        gtlist: GETALLGIFTTYPEINFONEW[];
    }
    //获取游戏活动列表
    export class GAMEACTIVITYINFOREQ {
        loginid: string;
        id: string;
    }
    export class GAMEACTIVITYINFO {
        id: string;
        appid: string;
        appname: string;
        ico: string;
        title: string;
        starttime: string;
        endtime: string;
        prise: string;
        server: string;
        rule: string;
        detail: string;
        atype: number;
        loginid: string;
        gameid: string;
        ishot: number;
        lable: string;
        banner: string;
    }
    export class GAMEACTIVITYINFOLISTRESP {
        gameactivitylist: GAMEACTIVITYINFO[];
    }
    //获取热门搜索列表
    export class HOTTOPGAMEINFOREQ {

    }
    export class HOTTOPGAMEINFO {
        id: string;
        name: string;
        ico: string;
    }
    export class HOTTOPGAMEINFOLISTRESP {
        hottopgamelist: HOTTOPGAMEINFO[];
    }
    //获取用户VIP等级
    export class GSUSERLVREQ {
        userid: number;
    }
    export class GSUSERLVRESP {
        gslv: number;
    }

    export class GSENTERGAMEACREQ {//报名操作
        loginid: string;
        gamaacid: string;
        playname: string;
        areaname: string;
    }

    export class GETALLWELFTARETYPEREQ {//获取特权礼包列表
        loginid: string;
        typenum: string;
    }
    export class GETALLWELFTARETYPEINFO {
        id: number;
        gameid: number;
        loginid: string;
        giftname: string;
        instruction: string;
        total: number;
        remainder: number;
        price: string;
        one: string;
        type: number;
        ico: string;
        name: string;
        createtime: string;
    }
    export class GETCODEINFOREQ2 extends GETCODEINFOREQ {//领取特权礼包
        userid: string;
        typenum: number;
    }
    export class GSSETCITYREQ extends GSUSERREQBASE {//填写城市信息
        loginid: string;
        city: string;
    }
    export class GETALLACCOUNTINFOREQ {

    }
    export class GETALLACCOUNTINFO {
        id: number;
        gameid: number;
        title: string;
        condition: string;
        pricelow: string;
        pricehigh: number;
        type: number;
        ico: string;
        name: string;
        createtime: string;
    }
    export class GETALLACCOUNTDETAILREQ {
        gatid: number;
        loginid: string;
        listid: string;//li ID便于获取对应元素控件
    }
    export class GETALLACCOUNTDETAIL {
        id: number;
        gattid: number;
        title: string;
        condition: string;
        price: string;
        surplu: number;
        gameid: number;
        name: string;
        loginid: string;
    }
    export class GSAPPLYACCOUNTREQ {
        aid: number;
        loginid: string;
        userid: string;
        price: string;
        gname: string;
        detail: string;
        server: string;
        rolename: string;
    }
    export class GSGETMESSAGEREQ {//获取消息列表
        loginid: string;
    }
    export class GSGETMESSAGEINFO {
        id: number;
        msgid: number;
        title: string;
        detail: string;
        msglogid: number;
        loginid: string;
        rsld: string;
        createtime: string;//创建时间
    }
    export class GSSETMSGREADSTATUSREQ {//设置消息的阅读状态
        id: string;//消息ID
        loginid: string;
    }
    export class GSDELETEMESSAGEREQ {//删除消息
        id: string;//消息ID
        loginid: string;
    }
    export class GSGETVIPQQREQ {//获取VIPQQ列表
        userid: number;
    }
    export class GSVIPQQINFO {
        qqname: string;
        qqnum: number;
    }
    export class GSSENDPROBLEMREQ {//发送问题
        userid: number;
        gname: string;
        title: string;
        detail: string;
        server: string;
        type: number;//问题类型：1游戏问题 2充值问题 3账号问题
    }
    export class GSGETSERVERTABLEREQ {

    }
    export class GSSERVERTABLEINFO {//开服表信息
        id: number;
        gameid: number;
        appname: string;
        ico: string;
        serverName: string;
        openTime: number;
    }
    export class GSCHECKUSERLEVELREQ {//通过传递一个等级验证用户等级权限
        lv: number;
        userid: number;
    }
    export class GSSHAREGAMEREQ {//分享需要存储的基本信息（暂只能在微信分享）
        shareuser: string;
        sharecode: string;
        appid: string;
    }
    //保存用户信息到本地
    export function SaveUserInfo() {
        utils.setCookie("GSUSERINFO", userinfo);
        if (!historyUsers) {
            LoadHistoryUsers();
            if (!historyUsers) historyUsers = [];
        }
        if (!userinfo) return;
        for (var i = 0; i < historyUsers.length; i++) {
            if (historyUsers[i].userid == userinfo.userid) {
                historyUsers.splice(i, 1);
                break;
            }
        }
        historyUsers.push({
            userid: userinfo.userid,
            sdkloginid: userinfo.sdkloginid,
            nickname: userinfo.nickname,
            phone: userinfo.phone,
            email: userinfo.email,
            headico: userinfo.headico,
            session: userinfo.session
        });
        SaveHistoryUsers();
    }
    //从本地加载用户信息
    export function LoadUserInfo(): GSUSERINFO {
        return utils.getCookie("GSUSERINFO");

    }
    export function LoadHistoryUsers() {
        historyUsers = utils.getCookie("GSHistoryUsers");

    }
    export function SaveHistoryUsers() {
        utils.setCookie("GSHistoryUsers", historyUsers);
    }
    //验证本地用户信息
    export function CheckUserLogin(cb: (userinfo: GSUSERINFO) => void) {
        var session = null;
        if (!userinfo) userinfo = LoadUserInfo();
        if (!userinfo) {
            //			cb(null);
            //			return;
        }
        else session = userinfo.session;
        //取得上一个页面URL
        var fromurl: string;
        if (sessionStorage["currenturl"] == window.location.href) {
            fromurl = sessionStorage["prevurl"];
            if (!fromurl) fromurl = "";
        }
        else {
            fromurl = sessionStorage["currenturl"];
            if (!fromurl) fromurl = "";
            sessionStorage["prevurl"] = fromurl;
            sessionStorage["currenturl"] = window.location.href;
        }
        if (!fromurl) fromurl = document.referrer;

        gsCheckSession({ mysession: session, channel: GetChannel(), referrer: fromurl, currenturl: window.location.href }, resp => {
            if (resp.errno != 0) {
                userinfo = null;
                SaveUserInfo();
                cb(null);
                console.log(resp.message);
                return;
            }
            userinfo = resp.data;
            SaveUserInfo();
            cb(userinfo);
        });
    }

    //自动登录
    export function UserAutoLogin(cb: (userinfo: GSUSERINFO) => void) {
        CheckUserLogin(user => {
            if (user) {
                cb(user);
                return;
            }
            else {
                cb(null);
            }
        });
    }


    export function getNextSession(param: string, cb: (para: ServerResp) => void) {
        PostServer("getnextsession", param, cb);
    }

    export function gsCheckSession(param: GSUSERCHECKSESSIONREQ, cb: (para: ServerResp) => void) {
        PostServer("gschecksession", param, cb);
    }

    export function gsUserLogin(param: GSUSERLOGINREQ, cb: (para: ServerResp) => void) {
        PostServer("gsuserlogin", param, cb);
    }



    export function gsUserLogin_old(param: GSUSERLOGINREQ, cb: (para: ServerResp) => void) {
        PostServer("gsuserlogin_old", param, cb);
    }

    //微端QQ登录
    export function gsUserLogin_qq(param: GSUSERQQLOGINREQ, cb: (para: ServerResp) => void) {
        PostServer("gsuserlogin_qq", param, cb);
    }

    //微端微信登录
    export function gsUserLogin_wx(param: GSUSERWXLOGINREQ, cb: (para: ServerResp) => void) {
        PostServer("gsuserlogin_wx", param, cb);
    }

    export function gsUserReg(param: GSUSERREGREQ, cb: (para: ServerResp) => void) {
        if (!param.channel) param.channel = GetChannel();
        PostServer("gsuserreg", param, cb);
    }
    export function gsUserRandNick(param: GSUSERRANDNICKREQ, cb: (para: ServerResp) => void) {//随机昵称
        PostServer("gsuserrandnick", param, cb);
    }

    export function gsUserSetHeadIco(param: GSUSERSETHEADICOREQ, file, cb: (para: ServerResp) => void) {
        PostServer("gsusersetheadico", param, cb, [{ head: file }]);
    }
    export function gsUserSetNickName(param: GSUSERSETNICKNAMEREQ, cb: (para: ServerResp) => void) {//昵称修改
        PostServer("gsusersetnickname", param, cb);
    }
    export function gsUserSetPhone(param: GSUSERSETPHONEREQ, cb: (para: ServerResp) => void) {//设置手机
        PostServer("gsusersetphone", param, cb);
    }
    export function gsUserSendPhoneCode(param: GSUSERSENDPHONECODEREQ, cb: (para: ServerResp) => void) {//获取验证码
        PostServer("gsusersendphonecode", param, cb);
    }
    export function gsUserLoginSendCode(param: GSUSERLOGINSENDCODEREQ, cb: (para: ServerResp) => void) {//手机登入验证码
        PostServer("gsuserloginsendcode", param, cb);
    }

    export function gsUserSetAddr(param: GSUSERSETADDRREQ, cb: (para: ServerResp) => void) {
        PostServer("gsusersetaddr", param, cb);
    }
    export function gsUserChangePwd(param: GSUSERCHANGEPWDREQ, cb: (para: ServerResp) => void) {
        PostServer("gsuserchangepwd", param, cb);
    }
    export function gsUserGetPkAppList(param: GSUSERGETPKAPPLISTREQ, cb: (para: ServerResp) => void) {
        PostServer("gsusergetpkapplist", param, cb);
    }
    export function gsUserGetH5AppList(param: GSUSERGETH5APPLISTREQ, cb: (para: ServerResp) => void) {
        PostServer("gsusergeth5applist", param, cb);
    }
    export function gsUserGetShopGoodsList(param: GSUSERGETSHOPGOODSLISTREQ, cb: (para: ServerResp) => void) {
        PostServer("gsusergetshopgoodslist", param, cb);
    }
    export function gsUserExchange(param: GSUSEREXCHANGEREQ, cb: (para: ServerResp) => void) {
        PostServer("gsuserexchange", param, cb);
    }
    export function gsUserGetExchangeRecord(param: GSUSERGETEXCHANGERECORDREQ, cb: (para: ServerResp) => void) {
        PostServer("gsusergetexchangerecord", param, cb);
    }
    export function gsUserGetBannerData(param: GSUSERGETBANNERDATAREQ, cb: (para: ServerResp) => void) {
        PostServer("gsusergetbannerdata", param, cb);
    }

    export function gsUserPayCreate(param: GSUSERPAYCREATEREQ, cb: (para: ServerResp) => void) {
        if (!param.channel) param.channel = GetChannel();
        PostServer("gsuserpaycreate", param, cb);
    }
    export function gsUserPayDel(param: GSUSERPAYDELREQ, cb: (para: ServerResp) => void) {
        PostServer("gsuserpaydel", param, cb);
    }
    export function gsUserWaitPayResult(param: GSUSERWAITPAYRESULTREQ, cb: (para: ServerResp) => void) {
        PostServer("gsuserwaitpayresult", param, cb);
    }
    export function gsUserWxCode(param: GSUSERWXCODEREQ, cb: (para: ServerResp) => void) {
        PostServer("gsuserwxcode", param, cb);
    }
    export function gsUserPayDiscount(param: GSUSERPAYDISCOUNTREQ, cb: (para: ServerResp) => void) {
        PostServer("gsuserpaydiscount", param, cb);
    }
    export function gsUserQueryWxPay(param: GSUSERQUERYWXPAYREQ, cb: (para: ServerResp) => void) {
        PostServer("gsuserquerywxpay", param, cb);
    }
    export function getRecentPlayH5AppList(param: H5LOGINFOEntity_SECOND.GSUSERGETH5LOGLISTREQ, cb: (para: ServerResp) => void) {//获取最近玩过的游戏列表
        PostServer("getrecentplayh5applist", param, cb);
    }
    export function gsusergeth5applistbyname(param: string, cb: (para: ServerResp) => void) {//通过游戏名获取游戏，搜索模块
        PostServer("gsusergeth5applistbyname", param, cb);
    }
    export function gsUserUnSetPhone(param: GSUSERSETPHONEREQ, cb: (para: ServerResp) => void) {//设置手机
        PostServer("gsuserunsetphone", param, cb);
    }
    export function gsUserChangePwd2(param: GSUSERCHANGEPWDREQ, cb: (para: ServerResp) => void) {//平台旧修改密码
        PostServer("gsuserchangepwd2", param, cb);
    }
    export function getdefaultImgs(cb: (para: ServerResp) => void) {//获取默认头像列表
        PostServer("getdefaultImgs", {}, cb);
    }
    export function gsUserSetHeadIco2(param: GSUSERSETHEADICOREQ2, cb: (para: ServerResp) => void) {//设置用户头像
        PostServer("gsusersetheadico2", param, cb);
    }
    export function gsUserLoginWeixin(param: USERLOGINWEIXINREQ, cb: (para: ServerResp) => void) {//微信登入
        PostServer("gsUserLoginWeixin", param, cb);
    }
    export function gsUserLoginQQ(param: USERLOGINQQREQ, cb: (para: ServerResp) => void) {//QQ登入
        PostServer("gsUserLoginQQ", param, cb);
    }
    export function openShare(param: string, cb: (para: ServerResp) => void) {
        PostServer("openshare", param, cb);
    }
    export function getWXConfigSign(param: GETWXCONFIGSIGNREQ, cb: (para: ServerResp) => void) {//微信签名配置
        PostServer("getwxconfigsign", param, cb);
    }
    export function gsGetAllGiftType(param: GETALLGIFTTYPEREQ, cb: (para: ServerResp) => void) {//获取所有礼包类型
        PostServer("gsgetallgifttype", param, cb);
    }
    export function getCodeInfo(param: GETCODEINFOREQ, cb: (para: ServerResp) => void) {//领取礼包
        PostServer("getcodeinfo", param, cb);
    }


    export function getCodeInfo_new(param: GETCODEINFOREQ, cb: (para: ServerResp) => void) {//领取礼包
        PostServer("getcodeinfo_new", param, cb);
    }


    export function getGettedStatus(param: GSGETTEDSTATUSBYLOGINIDREQ, cb: (para: ServerResp) => void) {//礼包领取状态
        PostServer("getgettedstatus", param, cb);
    }
    export function getGameAllGift(param: GSGETGAMEALLGIFTREQ, cb: (para: ServerResp) => void) {//获取所有礼包列表,查询用
        PostServer("getgameallgift", param, cb);
    }
    export function gsCheckPhone(param: string, cb: (para: ServerResp) => void) {//验证手机是否已经绑定
        PostServer("gscheckphone", param, cb);
    }

    export function gsGetPhoneUser(param: GSUSERSETPHONEREQ, cb: (para: ServerResp) => void) {//获取当前手机绑定用户
        PostServer("gsgetphoneuser", param, cb);
    }
    export function gsGetPhoneCode(param: GSUSERSENDPHONECODEREQ, cb: (para: ServerResp) => void) {//获取手机验证码
        PostServer("gsgetphonecode", param, cb);
    }
    //新修改密码
    export function gsUserCheckBindPhone(para: USERCHECKBINDPHONEREQ, cb: (para: ServerResp) => void) {//找回密码验证是否绑定手机
        PostServer("gsusercheckbindphone", para, cb);
    }
    export function gsUserFindPwdSendCode(para: USERFINDPWDSENDCODEREQ, cb: (para: ServerResp) => void) {//找回密码发送验证码
        PostServer("gsuserfindpwdsendcode", para, cb);
    }
    export function gsUserFindPwdChangePwd(para: USERFINDPWDCHANGEPWDREQ, cb: (para: ServerResp) => void) {//找回密码修改密码
        PostServer("gsuserfindpwdchangepwd", para, cb);
    }
    export function gsGetAllGiftType_New(param: GETALLGIFTTYPEREQNEW, cb: (para: ServerResp) => void) {//获取所有礼包类型（新平台）
        PostServer("gsgetallgifttype_new", param, cb);
    }
    export function getGameActivityInfo(param: GAMEACTIVITYINFOREQ, cb: (para: ServerResp) => void) {//获取游戏活动列表
        PostServer("getgameactivityinfo", param, cb);
    }
    export function getHotTopGame(param: HOTTOPGAMEINFOREQ, cb: (para: ServerResp) => void) {//获取前9个热门游戏
        PostServer("gethottopgame", param, cb);
    }
    export function gsUserSendMailCode(param: GSUSERSENDMAILCODEREQ, cb: (para: ServerResp) => void) {//获取邮箱验证码
        PostServer("gsusersendmailcode", param, cb);
    }
    export function gsUserSetMail(param: GSUSERSETMAILREQ, cb: (para: ServerResp) => void) {//绑定邮箱
        PostServer("gsusersetmail", param, cb);
    }
    export function gsUserLv(param: GSUSERLVREQ, cb: (para: ServerResp) => void) {//获取用户等级
        PostServer("gsuserlv", param, cb);
    }
    export function GSEnterGameAC(param: GSENTERGAMEACREQ, cb: (para: ServerResp) => void) {//平台活动报名
        PostServer("gsentergameac", param, cb);
    }
    export function GetAllWelftareType(param: GETALLWELFTARETYPEREQ, cb: (para: ServerResp) => void) {//获取特权礼包列表
        PostServer("getallwelftaretype", param, cb);
    }
    export function getCodeInfo2(param: GETCODEINFOREQ, cb: (para: ServerResp) => void) {//领取特权礼包
        PostServer("getcodeinfo2", param, cb);
    }
    export function gsSetCity(param: GSSETCITYREQ, cb: (para: ServerResp) => void) {//设置省份城市
        PostServer("gssetcity", param, cb);
    }
    export function gsGetAllAcount(param: GETALLACCOUNTINFOREQ, cb: (para: ServerResp) => void) {//获取账号列表
        PostServer("gsgetallacount", param, cb);
    }
    export function gsGetAllAcountDetail(param: GETALLACCOUNTDETAILREQ, cb: (para: ServerResp) => void) {//获取账号详细列表，类型为1的
        PostServer("gsgetallacountdetail", param, cb);
    }
    export function gsApplyAccount(param: GSAPPLYACCOUNTREQ, cb: (para: ServerResp) => void) {//高级账号申请
        PostServer("gsapplyaccount", param, cb);
    }
    export function gsGetMessage(param: GSGETMESSAGEREQ, cb: (para: ServerResp) => void) {//获取消息列表
        PostServer("gsgetmessage", param, cb);
    }
    export function gsGetVipQQ(param: GSGETVIPQQREQ, cb: (para: ServerResp) => void) {//发送问题请求
        PostServer("gsgetvipqq", param, cb);
    }
    export function gsSetMsgReadStatus(param: GSSETMSGREADSTATUSREQ, cb: (para: ServerResp) => void) {//设置消息阅读状态
        PostServer("gssetmsgreadstatus", param, cb);
    }
    export function gsDeleteMsg(param: GSDELETEMESSAGEREQ, cb: (para: ServerResp) => void) {//删除消息
        PostServer("gsdeletemsg", param, cb);
    }
    export function gsSendProblem(param: GSSENDPROBLEMREQ, cb: (para: ServerResp) => void) {//发送问题请求
        PostServer("gssendproblem", param, cb);
    }
    export function gsGetServerTable(param: GSGETSERVERTABLEREQ, cb: (para: ServerResp) => void) {//获取开服表
        PostServer("gsgetservertable", param, cb);
    }
    export function gsCheckUserLevel(param: GSCHECKUSERLEVELREQ, cb: (para: ServerResp) => void) {//传递一个等级校验是否满足该等级
        PostServer("gscheckuserlevel", param, cb);
    }
    export function gsShareGame(param: GSSHAREGAMEREQ, cb: (para: ServerResp) => void) {//分享活动信息存储（只能在微信）
        PostServer("gssharegame", param, cb);
    }
    //PK服务器的websocket
    export class PKServer {
        wsocket: WebSocket;
        isLogin = false;
        Close() {
            if (this.wsocket) {
                this.wsocket.onopen = null;
                this.wsocket.onclose = null;
                this.wsocket.onerror = null;
                this.wsocket.onmessage = null;
                this.wsocket.close();
                this.wsocket = null;
            }
        }

        Connect(session: string, gameid: number, onopen: (ev: Event) => void, onclose: (ev: Event) => void, onerror: (ev: Event) => void, onmessage: (data: WEBSOCKETPACK) => void) {
            this.Close();
            var url = utils.g_pkserverurl;
            this.wsocket = new WebSocket(url);
            this.wsocket.onopen = (ev) => {
                if (!this.isLogin) {//未登录，连接后自动登录
                    var dat = new GSUSERENTERPKGAMEREQ();
                    dat.mysession = session;
                    dat.gameid = gameid;
                    onopen(ev);
                    this.SendData("gsuserenterpkgame", dat);
                }
            }
            this.wsocket.onmessage = (ev) => {
                var ret: WEBSOCKETPACK = JSON.parse(ev.data);
                if (!ret.name) {
                    alert("数据无效");
                    return;
                }
                if (!this.isLogin) {
                    if (ret.name == "gsuserenterpkgame") {
                        if (ret.errno != 0) {
                            alert(ret.message);
                            return;
                        }
                        this.isLogin = true;
                    }
                }
                onmessage(ret);
            };
            this.wsocket.onclose = onclose;
            this.wsocket.onerror = onerror;
        }
        SendData(name: string, data: any) {
            var dat = new WEBSOCKETPACK();
            dat.name = name;
            dat.data = data;

            var str = JSON.stringify(dat);
            if (!this.wsocket) return;
            this.wsocket.send(str);
        }


    }





    /*************************新平台全新数据******************************************/
    export class GAMETYPEREQ {
        type: string;
    }
    export class GAMETYPERESP {
        typelist: H5APPINFO[];
    }
    export class APPINFO {
        Id: number;//h5game表中id
        appid: string;//游戏id
        appname: string;//游戏名称
        url: string;//游戏链接
        intro: string;//游戏介绍
        ico: string;//游戏背景图
        count: number;//当前在线人数
    }

    export class GAMEDETAILREQ {
        gameid: string;
        loginid: string;
    }

    //获取游戏具体信息
    export class GAMEDETAILINFO extends GETALLGIFTTYPEINFO {
        id: number;
        url: string;
        name: string;//游戏名称
        ico: string;//游戏图标
        groupqq: string;//不为空则是加群礼包
        detail: string;//游戏描述
        createtime: string;//创建时间
        remark: string;
        playcount: number;//玩家人数
        gameint: string;
    }
    export class GAMEDETAILACTIVITYINFO {
        id: number;//活动id
        appid: number;//游戏id
        title: string;//游戏活动名称
        aptye: number;//活动的类型
        name: string;//游戏名称
        ishot: number;
        lable: string;
    }

    export class COLLECTGAMEREQ {
        gameid: string;//游戏id
        userid: number;//用户id
    }

    export class GIFTBAGREQ {
        sdkloginid: string;
    }

    export class MYGIFTBAGINFO {
        id: number;//礼包
        name: string;//游戏名称
        code: string;//礼包码
        giftname: string;//礼包名称
        gameid: number;//游戏id
        instruction: string;//礼包介绍
        createtime: string;//礼包领取时间
        ico: string;//游戏图标
        useway: string;//使用方法
    }


    export class GETGIFTCODEINFO {
        code: string;//礼包码
        giftname: string;//礼包名称
        instruction: string;//礼包介绍
        useway: string;//使用方法
    }
    export class CHANGESEXREQ extends GSUSERREQBASE {
        sex: number;//用户性别
        userid: number;//用户id
    }

    export class GETRECHAGEREQ {
        userid: number;//用户id
    }

    export class GETRECHAGEINFO {
        id: number//充值id
        appid: number;//游戏id
        userid: number;//用户id
        paysum: number;//充值金额
        nickname: string;//用户昵称
        headico: string;//用户头像
    }

    export class GETRADOMNAMEREQ {
        id: number;//随机id
    }
    export class RADOMNAMELISTREQ {
        leng: number;
    }

    export class GETACTIVEREQ {
        userid: number;//用户id
    }

    export class GETACTIVEINFO {
        userid: number;
        loginid: string;
        nickname: string;
        headico: string;
        point: number;
    }

    export class GETLOTTERYLISTREQ extends GSUSERREQBASE {
        userid: number;//用户id
        point: number;
        flag: string;//标识位
    }
    export class LOTTERYINFO {
        userid: number;//用户id
        point: number;//用户积分
    }
    export class LOTTERYLISTREQ {
        userid: number;//用户id
    }
    export class LOTTERYLISTINFO {
        id: number;//奖励id
        createtime: string;//创建时间
        reword: string;//获得奖励
    }


    export class HOTGAMELISTINFO {
        id: number;//
        gameid: number;//cpapp表中id
        appid: number;//h5game表中id
        gamename: string;
        img: string;//banner
        url: string;//
        type: string;//
        orderby: number;//
        createtime: string;
    }


    export class UPPROBLEMREQ {
        userid: number;
        title: string;
        detail: string;
    }



    export class COUNTBANNERREQ {
        type: string;//类型
    }





    //export function gsGetradomname(param: GETRADOMNAMEREQ, cb: (para: ServerResp) => void) {
    //    PostServer("getradomname", param, cb);
    //}


   


    export function gsGetgametypelist(param: GAMETYPEREQ, cb: (para: ServerResp) => void) {
        PostServer("gsgetgametypelist", param, cb);
    }

    export function gsGetshowgamelist(param: GAMETYPEREQ, cb: (para: ServerResp) => void) {
        PostServer("gsgetshowgamelist", param, cb);
    }

    export function getActivityList(param: GAMEACTIVITYINFOREQ, cb: (para: ServerResp) => void) {
        PostServer("getactivitylist", param, cb);
    }
    export function getGameDetailList(param: GAMEDETAILREQ, cb: (para: ServerResp) => void) {
        PostServer("getgamedetaillist", param, cb);
    }

    export function getGameDetailAT(param: GAMEDETAILREQ, cb: (para: ServerResp) => void) {
        PostServer("getgamedetailactivity", param, cb);
    }

    export function getCollectGame(param: COLLECTGAMEREQ, cb: (para: ServerResp) => void) {
        PostServer("getcollectgame", param, cb);
    }

    export function getMyCollectGame(param: COLLECTGAMEREQ, cb: (para: ServerResp) => void) {
        PostServer("getmycollectgame", param, cb);
    }

    export function getMygiftBagList(param: GIFTBAGREQ, cb: (para: ServerResp) => void) {
        PostServer("getmygiftbaglist", param, cb);
    }

    export function changeSex(param: CHANGESEXREQ, cb: (para: ServerResp) => void) {//修改用户性别
        PostServer("changeusersex", param, cb);
    }

    export function getdefaultImgs_second(cb: (para: ServerResp) => void) {//获取默认头像列表
        PostServer("getdefaultImgssecond", {}, cb);
    }

    export function getAllGiftList(param: GETALLGIFTTYPEREQNEW, cb: (para: ServerResp) => void) {//获取所有礼包类型（新平台）
        PostServer("getallgiftlist", param, cb);
    }

    export function getGifiCode(param: GETCODEINFOREQ, cb: (para: ServerResp) => void) {//领取礼包
        PostServer("getgiftcodeinfo", param, cb);
    }

    export function getRechageList(param: GETRECHAGEREQ, cb: (para: ServerResp) => void) {
        PostServer("getrechagelist", param, cb);
    }

    export function getRadomRechage(param: RADOMNAMELISTREQ, cb: (para: ServerResp) => void) {
        PostServer("getradomrechage", param, cb);
    }

    export function getActiveList(param: GETACTIVEREQ, cb: (para: ServerResp) => void) {
        PostServer("getactivelist", param, cb);
    }

    export function getTjGameList(param: GETACTIVEREQ, cb: (para: ServerResp) => void) {
        PostServer("gettjgamelist", param, cb);
    }

    export function getLotteryList(param: GETLOTTERYLISTREQ, cb: (para: ServerResp) => void) {
        PostServer("getlotterylist", param, cb);
    }
    export function createLottery(param: GETLOTTERYLISTREQ, cb: (para: ServerResp) => void) {
        PostServer("createlottery", param, cb);
    }

    export function addLotteryList(param: GETLOTTERYLISTREQ, cb: (para: ServerResp) => void) {
        PostServer("addlotterylist", param, cb);
    }

    export function listLottery(param: LOTTERYLISTREQ, cb: (para: ServerResp) => void) {
        PostServer("listlottery", param, cb);
    }

    export function dellistLottery(param: LOTTERYLISTREQ, cb: (para: ServerResp) => void) {
        PostServer("dellistlottery", param, cb);
    }


    export function getHotGameList(param: HOTGAMELISTINFO, cb: (para: ServerResp) => void) {
        PostServer("gethotgamelist",param,cb);
    }



    export function getActivityBanner(param: GAMEACTIVITYINFOREQ, cb: (para: ServerResp) => void) {
        PostServer("getactivitybanner", param, cb);
    }

    export function upProblem(param: UPPROBLEMREQ, cb: (para: ServerResp) => void) {
        PostServer("upproblem", param, cb);
    }


    export function countBanner(param: COUNTBANNERREQ, cb: (para: ServerResp) => void) {
        PostServer("countbanner", param, cb);
    }


    //export function phoneLogin(param: GSUSERLOGINREQ, cb: (para: ServerResp) => void) {
    //    PostServer("phonelogin", param, cb);
    //}




    export function newMessage() {
        var newmessage: GAMECENTER.GSGETMESSAGEINFO[] = [];
        GAMECENTER.gsGetMessage({ loginid: GAMECENTER.userinfo.sdkloginid }, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data: GAMECENTER.GSGETMESSAGEINFO[] = resp.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].rsld == null) {
                    newmessage.push(data[i]);
                }
            }
            if (data.length == 0) {
                $("#message_point").css("display", "none");
                $("#message_point_footer").css("display", "none");
            } else {
                if (newmessage.length != 0) {
                    $("#message_point").css("display", "");
                    $("#message_point_footer").css("display", "");
                } else {
                    $("#message_point").css("display", "none");
                    $("#message_point_footer").css("display", "none");
                }
            }

        })
    }
}

//管理员后台
module ADMIN {
    export class ADMINREQBASE {
        loginid: string;
        pwd: string;
    }
    export class USERINFO {
        loginid: string;
        pwd: string;
        nickname: string;
    }
    export class CPUSERINFO {
        loginid: string;
        pwd: string;
    }
    export class SPUSERINFO {
        loginid: string;
        pwd: string;
    }
    export var userinfo: USERINFO;
    export var cpuserinfo: CPUSERINFO;
    export var spuserinfo: SPUSERINFO;
    //PK游戏列表
    export class ADMINGETPKAPPLISTREQ extends ADMINREQBASE {

    }
    export class PKAPPINFO extends GAMECENTER.PKAPPINFO {

    }
    export class ADMINGETPKAPPLISTRESP {
        applist: PKAPPINFO[];
    }






    //修改PK游戏信息
    export class ADMINSAVEPKAPPINFOREQ extends ADMINREQBASE {
        id: number;
        name: string;//游戏名称
        url: string;//游戏链接
        detail: string;//游戏描述
        playcount: number;//多少人在玩
        entrancegold: number;//入场花费金币
        wingold: number;//胜利获得金币

        enablerobot: number;//是否使用机器人
        robotdelay: number;//用户等待匹配几秒后使用机器人
        robotstartwait: number;//机器人等待几秒后开始游戏
        robotscorespeed: number;//机器人每秒增加多少分数
        robotplaytimemax: number;//机器人游戏最长时间（秒）
        robotplaytimemin: number;//机器人游戏最短时间（秒）
        robotwinrate: number;//机器人必胜概率百分比
        robotscoreinterval: number;//机器人每几秒提交一次分数
    }
    export class ADMINSAVEPKAPPINFORESP {

    }
    //删除PK游戏
    export class ADMINDELPKAPPREQ extends ADMINREQBASE {
        id: number;
    }
    export class ADMINDELPKAPPRESP {

    }


    //H5游戏列表
    export class ADMINGETH5APPLISTREQ extends ADMINREQBASE {

    }
    export class H5APPINFO extends GAMECENTER.H5APPINFO {

    }
    export class ADMINGETH5APPLISTRESP {
        applist: H5APPINFO[];
    }
    //修改H5游戏信息
    export class ADMINSAVEH5APPINFOREQ extends ADMINREQBASE {
        id: number;
        name: string;//游戏名称
        url: string;//游戏链接
        detail: string;//游戏描述
        playcount: number;//多少人在玩
        orderby: number;//排序
        getgold: number;//第一次进入获得K币
        remark: string;//备注
        ishot: number;//是否热门
        isrec: number;//是否推荐
    }
    export class ADMINSAVEH5APPINFORESP {

    }
    //删除H5游戏
    export class ADMINDELH5APPREQ extends ADMINREQBASE {
        id: number;
    }
    export class ADMINDELH5APPRESP {

    }
    //取得商品列表
    export class ADMINGETSHOPGOODSLISTREQ extends ADMINREQBASE {

    }
    export class ADMINGETSHOPGOODSLISTRESP {
        goodslist: GAMECENTER.SHOPGOODSINFO[];
    }
    //保存商品设置
    export class ADMINSAVEGOODSINFOREQ extends ADMINREQBASE {
        id: number;
        name: string;//商品名称
        price: number;//售价（K币）
        rmbprice: number;//价值（元）
        stock: number;//库存
        detail: string;//商品描述
        notice: string;//注意要求
    }
    export class ADMINSAVEGOODSINFORESP {

    }
    //删除商品
    export class ADMINDELGOODSREQ extends ADMINREQBASE {
        id: number;
    }
    export class ADMINDELGOODSRESP {

    }

    //读取每周兑换商品
    export class ADMINGETWEEKLYGOODSLISTREQ extends ADMINREQBASE {

    }
    export class WEEKLYGOODINFO {
        id: number;//数据ID
        goodsid: number;//商品ID
        timestart: number;//开始时间
        timeend: number;//结束时间
        name: string;//商品名称
        price: number;//价格
        rmbprice: number;//人民币价值
        stock: number;//库存
        img: string;//图片
    }
    export class ADMINGETWEEKLYGOODSLISTRESP {
        data: WEEKLYGOODINFO[];
    }
    //添加、保存每周兑换商品
    export class ADMINSAVEWEEKLYGOODSINFOREQ extends ADMINREQBASE {
        id: number;
        goodsid: number;//商品ID
        timestart: string;//开始时间
        timeend: string;//结束时间
    }
    export class ADMINSAVEWEEKLYGOODSINFORESP {

    }

	   //取得商城广告列表
    export class ADMINGETSHOPADLISTREQ extends ADMINREQBASE {

    }
    export class SHOPADINFO {
        id: number;
        goodsid: string;
        goodsname: string;
        price: number;//价格
        rmbprice: number;//人民币价值
        stock: number;//库存
        img: string;//广告图
    }
    export class ADMINGETSHOPADLISTRESP {
        data: SHOPADINFO[];
    }
	   //保存商城广告
    export class ADMINSAVESHOPADREQ extends ADMINREQBASE {
        id: number;//id为空表示新增
        goodsid: number;//商品ID

    }
    export class ADMINSAVESHOPADRESP {

    }
    //删除商城广告
    export class ADMINDELSHOPADREQ extends ADMINREQBASE {
        id: number;
    }
    export class ADMINDELSHOPADRESP {

    }
    //删除每周兑换
    export class ADMINDELWEEKLYGOODSREQ extends ADMINREQBASE {
        id: number;
    }
    export class ADMINDELWEEKLYGOODSRESP {

    }
    //精彩活动
    export class ADMINGETACTIVITYLISTREQ extends ADMINREQBASE {

    }
    export class ACTIVITYINFO {
        id: number;
        type: number;//0:url是一个链接，1：url是数字（H5游戏ID）
        img: string;
        url: string;
        orderby: number;
        createtime: string;
    }
    export class ADMINGETACTIVITYLISTRESP {
        data: ACTIVITYINFO[];
    }
    //保存精彩活动
    export class ADMINSAVEACTIVITYREQ extends ADMINREQBASE {
        id: number;
        gamename: string;
        type: number;
        url: string;
        orderby: number;
    }
    export class ADMINSAVEACTIVITYRESP {

    }
    //删除活动
    export class ADMINDELACTIVITYREQ extends ADMINREQBASE {
        id: number;
    }
    export class ADMINDELACTIVITYRESP {

    }


    //取得用户兑换记录
    export class ADMINGETEXCHANGERECORDREQ extends ADMINREQBASE {

    }
    export class ADMINGETEXCHANGERECORDRESP {
        data: GAMECENTER.EXCHANGERECORD[];
    }
    //修改兑换状态
    export class ADMINSAVEEXCHANGERECORDREQ extends ADMINREQBASE {
        id: number;
        state: number;
        message: string;
    }
    export class ADMINSAVEEXCHANGERECORDRESP {

    }



    //流量统计
    export class ADMINGETFLOWSTATISTICSREQ extends ADMINREQBASE {
        timestart: number;//开始时间
        timeend: number;//结束时间
    }

    export class FLOWSTATISTICSDATA {
        today: number;//日期
        channel: string;//渠道
        opencount: number = 0;//数量
        regcount: number = 0;//注册用户
        payusercount: number = 0;//付费用户
        paymoney: number = 0;//付费金额
    }
    export class ADMINGETFLOWSTATISTICSRESP {
        data: FLOWSTATISTICSDATA[];
    }

	   //充值记录
    export class ADMINGETRECHARGELISTREQ extends ADMINREQBASE {
        timestart: number;//开始时间
        timeend: number;//结束时间
    }
    export class RECHARGEINFO {
        id: number;
        payid: string;
        userid: string;
        nickname: string;
        phone: string;
        createtime: number;
        goodsname: string;
        money: number;
        payrmb: number;
        paytime: number;
        state: number;
        logid: number;
        paytype: number;
        channel: string;
    }
    export class ADMINGETRECHARGELISTRESP {
        data: RECHARGEINFO[];
    }

    //CP管理
    //取得CP列表
    export class CPINFO {
        cpid: number;//CP的ID
        loginid: string;//登录用户名
        nickname: string;//昵称
        regtime: number;//注册时间
        regip: string;//注册的IP
        lastlogintime: number;//最后登录时间
        lastloginip: string;//最后登录IP

    }
    export class ADMINGETCPLISTREQ extends ADMINREQBASE {
        cpid: number;//CPID
        cploginid: string;//账号，二选一
    }
    export class ADMINGETCPLISTRESP {
        data: CPINFO[];
    }
    //CP游戏列表
    export class ADMINGETCPAPPLISTREQ extends ADMINREQBASE {
        time: string;
        appname: string;
        cpid: number;
        mode: string;
        status: string;
        sort: number;
    }
    export class CPAPPINFO extends ADMINREQBASE {
        appid: number;
        cpid: number;
        cpname: string;
        appsecret: string;//密钥，用于登录、支付
        appname: string;//应用名称
        ico: string;//游戏图标
        adimg: string;//广告图
        backimg: string;
        bannerimg: string;
        isad: string;//是有否广告图
        url: string;//APP的URL
        intro: string;//简介
        enabled: number;//是否激活,0表示不会出现在SP的游戏列表中
        verify: number;//是否通过
        addtime: number;//添加时间
        recommend: number;//推荐等级，越大排名越前
        posturl: string;//支付成功后POST消息
        testurl: string;//测试地址
        mode: string;//接入模式
        gametype: string;//游戏类型
        extraofmonth: number;//月额
        xl_level: string;//吸量评级
        lc_level: string;//留存评级
        ff_level: string;//付费评级
        zh_level: string;//综合评级
        starts: string;//星数
        status: string;//状态
        jsmode: string;//结算模式
        percent: any;//分成比例
        createtime: string//创建时间
        nickname: string;
        uptime: string;//最后更新时间
        lable: string;//游戏标签
        downreason: string;//游戏下架原因
        orderby: string;//游戏排序
        profit: string;//cp分成
        introduction: string;//游戏详情介绍
    }
    export class ADMINCPAPPINFOREQ extends CPAPPINFO {

    }
    export class ADMINGETCPAPPLISTRESP {
        data: CPAPPINFO[];
    }
    export class ADMINAPPINFO extends CPAPPINFO {
        opencount: number;//打开次数
        playcount: number;//play次数
        getgold: number;//每日首次点击增加金币
        ishot: number;//是否热门
        isrec: number;//是否推荐
    }
    export class ADMINAPPINFOREQ extends ADMINAPPINFO {

    }
    export class ADMINNOPASSREQ extends ADMINREQBASE {
        appid: number;
        appname: string;
    }
    export class ADMINDELREQ extends ADMINREQBASE {
        appid: number;
        appname: string;
    }
    export class ADMINDOWNREQ extends ADMINREQBASE {
        appid: number;
        appname: string;
    }
    export class ADMINPUSHTOREQ extends ADMINREQBASE {
        appid: number;
        appname: string;
        pushto: string;
    }
    export class ADMINPAYRECORDREQ extends ADMINREQBASE {
        appid: number;
    }
    export class APPPAYRECORD {
        id: number;
        payid: string;//订单ID,yyyymmddhhmm+6位流水号
        appid: number;//APPID,对应t_cpapp.appid
        channelid: number;//渠道ID
        sdkname: string;//渠道名
        userid: number;//用户ID
        loginid: string;//用户账号
        createtime: number;//创建时间
        goodsname: string;//物品名称
        orderid: string;//CP的订单ID
        money: number;//购买物品总金额（元）
        goodsnum: number;//购买物品的数量
        payrmb: number;//实际支付了多少人民币
        paytime: number;//支付时间
        state: number;//状态：0等待支付，1：支付成功,2:支付成功但无法通知到CP
    }
    export class ADMINGETAPPPAYRECORDRESP {
        data: APPPAYRECORD[];
    }

    export class ADMINGETCHECKAPPINFOREQ extends ADMINREQBASE {
        appnames: string[];
        downreason: string;
    }

    //传输数据表
    export class DATATABLE {
        fields: string[];
        rows: any[];
    }
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
    export class ADMINGETDATASREQ extends ADMINREQBASE {
        appname: string;//游戏名
        nuserorder: string;//新用户排序
        incomeorder: string;//本月收入排序
        extraorder: string;//月结额排序
    }
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
    export class ADMINGETDATACOUNTRESP {
        data: DATATABLE;
    }

    //获取已接入的SDK列表
    export class ADMINGETSDKTYPELISTREQ {

    }
    export class ADMINSDKTYPEINFO {
        id: number;
        sdkname: string;//渠道名称
        payurl: string;//支付回调地址，例：/anysdk/haihaipay
        remarkappid: string;//后台显示，提示sdkappid要怎么填写
        remarkappsecret: string;//后台显示，提示sdkappsecret要如何填写
        demoappid: string;//appid填写范例，数据来源于本SDK第一条游戏的配置参数
        demoappsecret: string;//appsecret填写范例，数据来源于本SDK第一条游戏的配置参数
        needproductid: number;//是否需要充值档
    }
    export class ADMINGETSDKTYPELISTRESP {
        data: ADMINSDKTYPEINFO[];
    }

    export class ADMINGETDATADETAILREQ extends ADMINREQBASE {
        timestart: string;//开始时间
        timeend: string;//结束时间
        sdkid: number;//SDKID，空表示所有SDK
        appid: number;//APPID
    }
    export class ADMINGETDATADETAILRESP {
        sdktypes: { id: number, sdkname: string }[];//
        newusers: { appid: number, sdkid: number, today: number, newuser: number }[];//新用户表
        activeusers: { appid: number, sdkid: number, today: number, activeuser: number }[];//活跃用户表
        totalusers: { appid: number, sdkid: number, totaluser: number }[];//总用户表(只统计timestart之前的数量)
        newpays: { appid: number, sdkid: number, today: number, newpayuser: number, newpaymoney: number }[];//新安装付费用户、金额
        keeps: { appid: number, sdkid: number, today: number, keeps1: number, keeps2: number, keeps3: number, keeps4: number, keeps5: number, keeps6: number, keeps7: number, keeps14: number, keeps21: number, keeps30: number }[];//留存
        // keeps1: {appid: number, sdkid: number, today: number, onekeep: number,newuser:number}[];//次日留存
        // keeps2: {appid: number, sdkid: number, today: number, onekeep: number,newuser:number}[];//次日留存
        // keeps3: {appid: number, sdkid: number, today: number, onekeep: number,newuser:number}[];//3日留存
        // keeps4: {appid: number, sdkid: number, today: number, onekeep: number,newuser:number}[];//次日留存
        // keeps5: {appid: number, sdkid: number, today: number, onekeep: number,newuser:number}[];//次日留存
        // keeps6: {appid: number, sdkid: number, today: number, onekeep: number,newuser:number}[];//次日留存
        // keeps7: {appid: number, sdkid: number, today: number, onekeep: number,newuser:number}[];//7日留存
        // keeps14: {appid: number, sdkid: number, today: number, onekeep: number,newuser:number}[];//14日留存
        // keeps21: {appid: number, sdkid: number, today: number, onekeep: number,newuser:number}[];//次日留存
        // keeps30: {appid: number, sdkid: number, today: number, onekeep: number,newuser:number}[];//30日留存
        incometodays: { appid: number, sdkid: number, today: number, incometoday: number }[];//每日充值表
        incometotals: { appid: number, sdkid: number, incometotal: number }[];//总充值表(只统计timestart之前的充值)
        payusers: { appid: number, sdkid: number, today: number, payuser: number }[];//每日付费用户
        payuserstotals: { appid: number, sdkid: number, payuserstotal: number }[];//总付费用户(只统计timestart之前的充值)

        totaluser: number;//累计用户
        newuser: number;//新增用户
        payuser: number;//付费用户;
        activeuser: number;//活跃用户;
        payrate: number;//付费率
        income: number;//收入
        arpu: number;//ARPU
        arppu: number;//ARPPU
    }

    export class ADMINGETH5GAMELISTREQ extends ADMINREQBASE {
        appname: string;
        starts: string;
    }

    export class ADMINGETCALUSEROFDETAILRESP {
        data: DATATABLE;
    }
    export class ADMINGETCALUSEROFOLRESP {
        data: DATATABLE;
    }
    export class ADMINGETCALUSEROFCLRESP {
        data: DATATABLE;
    }
    export class ADMINGETCALINCOMEOFDETAILRESP {
        data: DATATABLE;
    }

    export class ADMINSORTINSERTREQ extends ADMINREQBASE {
        id: number;
        sortnum: number;

        all_id: string[];
        all_sortnum: string[];
    }
    export class ADMINSORTCLICKREQ extends ADMINREQBASE {
        id: number;
        orderby: number;
        flags: number;
        ishot: number;
        isrec: number;
    }
    export class ADMINACTIVITYINFO extends ACTIVITYINFO {
        gameid: number;
        gamename: string;
    }
    export class ADMINGETACTIVITYINFOSREQ extends ADMINREQBASE {

    }
    export class ADMINGETACTIVITYINFOIMGREQ extends ADMINREQBASE {
        gamename: number;
    }
    export class ADMINGETACTIVITYINFORESP extends ADMINACTIVITYINFO {
        data: ADMINACTIVITYINFO[];
    }
    export class ADMINSAVEACTIVITYINFOREQ extends ADMINREQBASE {
        id: number;
        gamaname: string;
        orderby: number;
        imgurl: string;
        flags: number;
    }
    export class ADMINGETCPAPPPERCENTREQ extends ADMINREQBASE {
        gameid: number;
    }
    export class ADMINCHANGEBALANCESTATUSREQ extends ADMINREQBASE {
        id: number;
        status: string;
        user: string;
    }
    export class ADMINGETCPAPPJSREQ extends ADMINREQBASE {
        gameid: number;
        timestart: string;
        timeend: string;
        user: string;
    }
    export class ADMINGETCPAPPJSINFO {
        id: number;
        date: string;
        totalIncome: any;
        status: string;
        payrmb: any;
        balance: any;
        user: string;
    }
    export class ADMINGETCPAPPJSINFORESP {//结算信息
        data: ADMINGETCPAPPJSINFO[];
    }
    export class ADMINGETCPAPPJSINFOREQ extends ADMINREQBASE {
        data: ADMINGETCPAPPJSINFO[];
        percent: any;
        gameid: number;
    }
    export class ADMINREMOVEHOTORREC extends ADMINREQBASE {//移动到热门或精选
        id: number;
        flags: string;
    }
    export class ADMINGETGAMECOUNTREQ extends ADMINREQBASE {//flags标记不同时间
        flags: string;
    }
    export class ADMINGETGAMEINCOMEREQ extends ADMINREQBASE {//flags 标记渠道还是所有
        flags: string;
    }
    export class ADMINGETGAMEUSERREQ extends ADMINREQBASE {//flags 标记渠道还是所有
        flags: string;
        appid: string;//统计单一游戏
    }
    export class ADMINGETCHANNELCOUNTREQ extends ADMINREQBASE {//获取渠道总数（不包括子渠道）
        flags: string;
    }




    export class ADMINADDGIFTTYPREQ extends ADMINREQBASE {
        id: string;
        gameid: string;
        gamename: string;
        giftname: string;
        giftnum: string;//礼包码
        instruction: string;//礼包内容
        useway: string;//使用方法
        gametype: string;//礼包类型
        giftvalue: string;//礼包价值
        groupqq: string;//加群链接
        endtime: string;//结束时间
    }


    export class ADMINDELETEGIFTTYPREQ extends ADMINREQBASE {
        id: string;
        gameid: string;
        gamename: string;
    }
    export class ADMINGETALLGIFTREQ extends ADMINREQBASE {
        gameid: string;
        gamename: string;
        time: string;
        giftname: string;
        flag: string;//0为平台礼包，1为高级福利礼包
    }
    export class ADMINGETALLGIFTINFO {
        id: number;
        giftname: string;//礼包名称
        createtime: string;//创建时间
        instruction: string;//礼包说明
        giftnum: string;//礼包码
        total: number;//礼包总数
        remainder: number;//剩余数
        useway: string;//使用方法
        appname: string;//游戏名称
        gameid: string;
        gifttype: string;//礼包类型
        giftvalue: string;//礼包价值
        groupqq: string;//加群链接
        endtime: string;//结束时间
    }
    export class ADMINGETALLGIFTRESP {
        giftlist: ADMINGETALLGIFTINFO[];
    }

    export class ADMINDELGIFTBAG extends ADMINGETALLGIFTINFO {

    }
    export class ADMINGETCHECKGIFTBAGREQ extends ADMINREQBASE {
        giftname: string[];
    }
    export class ADMINUPLOADFILE extends ADMINREQBASE {
        gameid: string;
        gamename: string;
        typeid: string;
        giftname: string;
    }
    export class ADMINCHARGERANKREQ extends ADMINREQBASE {
        flags: number;//0(当日)，1（本周），2（本月），3（总）
        searchTime: string;
    }
    export class ADMINCHARGERANK {
        data: DATATABLE;
    }

    //新后台数据统计
    export class ADMINCALDATAREQ extends ADMINREQBASE {
        appname: string;//游戏名
        nuserorder: string;//新用户排序
        incomeorder: string;//本月收入排序

    }
    export class ADMINCALDATARESP {
        data: DATATABLE;
    }

    //单个玩家注册时间、充值详情等
    export class USERPAYRECORD {
        payid: string;
        createtime: number;//订单创建时间
        paytime: number;//充值成功时间
        state: number;//充值状态，0：未充值，1：成功，2：通知CP失败
        goodsname: string;//商品名称
        goodsnum: number;//数量
        money: number;//应付金额
        payrmb: number;//实付金额
        appid: number;
        appname: string;
        sdkid: number;
        sdkname: string;
    }
    export class USERTIMEINFO//玩家注册、最后登录时间等时间信息
    {
        appid: number;
        appname: string;
        sdkid: number;
        sdkname: string;
        regtime: number;//注册时间
        lastlogintime: number;//最后登录时间
        paytotal: number;//在该游戏中累计充值
    }

    export class ADMINGETUSERDETAILREQ extends ADMINREQBASE {
        userid: string;
        is5wanuser: boolean;//userid是否是5玩用户
    }
    export class ADMINGETUSERDETAILRESP {
        timeinfo: USERTIMEINFO[];
        payrecord: USERPAYRECORD[];
    }


    export class ADMINGETYSHCPDETAILREQ extends ADMINREQBASE {

    }


    export class ADMINGETYSHCPDETAILINFO {
        nickname: string;
        cextraofmonth: number;
        cmode: string;
        totalIncome: number;
        monthIncome: number;
        gamecount: number;
    }
    export class ADMINGETYSHCPDETAILRESP {
        data: ADMINGETYSHCPDETAILINFO[];
    }

    //手动发送支付回调
    export class ADMINSENDPAYCALLBACKREQ extends ADMINREQBASE {
        payid: string;
    }
    export class ADMINSENDPAYCALLBACKRESP {

    }

    //---------------------新版后台------------------------------
    export class ADMINGETPLAMFORMDATAREQ extends ADMINREQBASE {

    }
    export class ADMINGETPLAMEFORMDATARESP {
        totalIncome: string;
        todayIncome: string;
        weekIncome: string;
        monthIncome: string;
        totalUser: string;
        todayUser: string;
        weekUser: string;
        monthUser: string;
    }
    export class ADMINGAMECHARGEDATASEARCHREQ extends ADMINREQBASE {//获取游戏充值数据
        sdkid: string;
        appname: string;
        timestart: string;
        timeend: string;
    }
    export class ADMINGAMECHARGEDATASEARCHRESP {
        paydata: DATATABLE;//充值数据
        regdata: DATATABLE;//新用户以及创角
        acdata: DATATABLE;//活跃用户
        newpays: DATATABLE;//新安装付费用户、金额
    }

    export class ADMINCHANNELCHARGEDATASEARCHREQ extends ADMINREQBASE {//获取渠道充值数据
        sdkname: string;
        timestart: string;
        timeend: string;
    }
    export class ADMINCHANNELCHARGEDATASEARCHRESP {
        paydata: DATATABLE;//充值数据
        regdata: DATATABLE;//新用户以及创角
        acdata: DATATABLE;//活跃用户
    }

    //SDK充值记录
    export class ADMINUSERCHARGEDATASEARCHREQ extends ADMINREQBASE {
        timestart: string;//开始时间
        timeend: string;//结束时间
        appname: string;//APP名称，空表示所有APP
        sdkid: string;//SDKID，空表示所有SDK

    }
    export class ADMINUSERCHARGEDATASEARCHRESP {
        data: DATATABLE;
    }

    export class ADMINGAMEDATADETAILREQ extends ADMINREQBASE {
        timestart: string;//开始时间
        timeend: string;//结束时间
        sdkid: number;//SDKID，空表示所有SDK
        appid: number;//AppID
    }
    export class ADMINGAMEDATADETAILRESP {
        sdktypes: { id: number, sdkname: string }[];//
        newusers: { appid: number, sdkid: number, today: number, newuser: number }[];//新用户表
        activeusers: { appid: number, sdkid: number, today: number, activeuser: number }[];//活跃用户表
        totalusers: { appid: number, sdkid: number, totaluser: number }[];//总用户表(只统计timestart之前的数量)
        newpays: { appid: number, sdkid: number, today: number, newpayuser: number, newpaymoney: number }[];//新安装付费用户、金额
        incometodays: { appid: number, sdkid: number, today: number, incometoday: number }[];//每日充值表
        incometotals: { appid: number, sdkid: number, incometotal: number }[];//总充值表(只统计timestart之前的充值)
        payusers: { appid: number, sdkid: number, today: number, payuser: number }[];//每日付费用户
        payuserstotals: { appid: number, sdkid: number, payuserstotal: number }[];//总付费用户(只统计timestart之前的充值)

        totaluser: number;//累计用户
        newuser: number;//新增用户
        payuser: number;//付费用户;
        activeuser: number;//活跃用户;
        payrate: number;//付费率
        income: number;//收入
        arpu: number;//ARPU
        arppu: number;//ARPPU
    }

    export class ADMINGAMEKEEPDATADETAILREQ extends ADMINREQBASE {
        timestart: string;//开始时间
        timeend: string;//结束时间
        appid: number;//AppID
        sdkid: number;
    }
    export class ADMINGAMEKEEPDATADETAILRESP {
        sdktypes: { id: number, sdkname: string }[];
        newusers: { appid: number, sdkid: number, today: number, newuser: number }[];//新用户表
        activeusers: { appid: number, sdkid: number, today: number, activeuser: number }[];//活跃用户表
        keeps: { appid: number, sdkid: number, today: number, keeps1: number, keeps2: number, keeps3: number, keeps4: number, keeps5: number, keeps6: number, keeps7: number, keeps14: number, keeps21: number, keeps30: number }[];//留存
    }

    export class ADMINPLAFORMCDSREQ extends ADMINREQBASE {//取得平台充值数据
        timestart: string;//开始时间
        timeend: string;//结束时间

    }
    export class ADMINPLAFORMCDSRESP {
        data: DATATABLE;
    }

    export class ADMINPLAFORMPUDSREQ extends ADMINREQBASE {//取得平台每日新用户数据
        timestart: string;//开始时间
        timeend: string;//结束时间
    }
    export class ADMINPLAFORMPUDSRESP {
        data: DATATABLE;
    }

    export class ADMINPLAFORMPVDSREQ extends ADMINREQBASE {//取得平台每日PV数据
        timestart: string;//开始时间
        timeend: string;//结束时间
    }
    export class ADMINPLAFORMPVDSRESP {
        data: DATATABLE;
    }
    export class ADMINPLAFORMGAMECHARGESEARCHREQ extends ADMINREQBASE {
        timestart: string;//开始时间
        timeend: string;//结束时间
        appname: string;//APP名称，空表示所有APP
    }
    export class ADMINPLAFORMGAMECHARGESEARCHRESP {
        paydata: DATATABLE;//充值数据
        flowdata: DATATABLE;//创角数据
        clickdata: DATATABLE;//点击数据
    }

    export class ADMINPLAFORMUSERCHARGEREQ extends ADMINREQBASE {
        timestart: string;//开始时间
        timeend: string;//结束时间
        appname: string;//APP名称，空表示所有APP
    }

    export class ADMINPLAFORMUSERCHARGEINFO {
        userid: string;
        appname: string;
        paytotal: string;
        minpaytime: string;
        maxpaytime: string;
    }




    //开服表
    export class ADMINGETALLACTIVITYREQ extends ADMINREQBASE {
        activityid: string;
        title: string;
        time: string;
    }


    export class ADMINGETALLOPENTABLEINFO {
        id: number;
        gameid: string;//游戏ID
        serverName: string;//服务器名称
        openTime: string;//开服时间
        createTime: number;//创建时间
        updateTime: number;//更新时间
        gamename: string;//游戏名
        appname: string;
    }
    export class ADMINGETALLTABLERESP {
        tablelist: ADMINGETALLOPENTABLEINFO[];
    }


    export class ADMINDELOPENTABLE extends ADMINGETALLOPENTABLEINFO {

    }

    export class ADMINGETCHECKGIFTTABLEREQ extends ADMINREQBASE {
        tablename: string[];
    }


    export class ADMINADDOPENTABLEREQ extends ADMINREQBASE {
        id: string;
        gameid: string;//游戏ID
        gamename: string;//游戏名称
        serverName: string;//服务器名称
        openTime: string;//开服时间
        createtime: string;//创建时间
        updatetime: string;//更新时间
    }




    //获取用户信息
    export class ADMINGETALLLISTUSERREQ extends ADMINREQBASE {
        tablename: string;
        time: string;
    }


    export class ADMINGETALLLISTUSERINFO {
        userid: number;//用户ID
        nickname: string;//用户昵称
        phone: string;//用户注册手机号
        wxid: string;//用户微信
        qqid: string;//用户QQ
        email: string;//用户邮箱
        regtime: string;//用户注册时间
        pay: number;//用户充值金额
        regip: string;//用户注册IP
    }
    export class ADMINGETALLLISTUSERRESP {
        userlist: ADMINGETALLLISTUSERINFO[];
    }



    //获取用户进入游戏具体信息
    export class ADMINGETALLLISTUSERGAMEREQ extends ADMINREQBASE {
        userid: string;
        tablename: string;
        time: string;
    }


    export class ADMINGETALLLISTUSERGAMEINFO {
        sdkuserid: number;//用户ID
        name: string;//游戏名称
        regip: string;//IP
        createtime: string;//登录时间

    }
    export class ADMINGETALLLISTUSERGAMERESP {
        usergamelist: ADMINGETALLLISTUSERGAMEINFO[];
    }





    //VIPQQ
    export class ADMINGETALLVIPQQREQ extends ADMINREQBASE {

    }


    export class ADMINGETALLVIPQQINFO {
        id: string;
        qqname: string;
        qqnum: string;
        createtime: string;
    }
    export class ADMINGETALLVIPQQRESP {
        vipqqlist: ADMINGETALLVIPQQINFO[];
    }


    export class ADMINADDVIPQQREQ extends ADMINREQBASE {
        id: number;
        qqname: string;
        qqnum: string;
        createtime: string;
    }





    //活动相关数据
    export class ADMINGETALLOPENTABLEREQ extends ADMINREQBASE {
        tableid: string;
        tablename: string;
        time: string;
    }


    export class ADMINGETALLACTIVITYINFO {
        id: number;
        gameid: string;//游戏ID
        appname: string;//游戏名称
        title: string;//活动名称
        detail: string;//活动具体内容
        prise: string;//活动奖励
        server: string;//活动所在区服
        rule: string;//活动规则
        count: number;//活动参加人数
        atype: string;//活动类型
        typename: string;//活动类型名称
        starttime: number;//创建时间
        endtime: number;//更新时间
        createtime: string;//创建时间
        lable: string;
        ishot: number;
        banner: string;
    }



    export class ADMINGETALLACTIVITYDETAILINFO {
        id: number;
        atype: string;
        loginid: string;//用户登录名
        createtime: string;//创建时间
        playname: string;//角色名称
        areaname: string;//区服名称
        paymoney: string;
        appname: string;

    }


    export class ADMINGETALLACTIVITYRESP {
        activitylist: ADMINGETALLACTIVITYINFO[];
    }

    export class ADMINGETALLACTIVITYRDETAILESP {
        detaillist: ADMINGETALLACTIVITYDETAILINFO[];
    }
    export class ADMINDELACTIVITY extends ADMINGETALLACTIVITYINFO {

    }

    export class ADMINGETCHECKACTIVITYREQ extends ADMINREQBASE {
        title: string[];
    }


    export class ADMINADDACTIVITYREQ extends ADMINREQBASE {
        id: number;
        gameid: string;//游戏ID
        appname: string;//游戏名称
        title: string;//活动名称
        detail: string;//活动具体内容
        prise: string;//活动奖励
        server: string;//活动所在区服
        rule: string;//活动规则
        count: number;//活动参加人数
        atype: string;//活动类型
        typename: string;//活动类型名称
        starttime: number;//创建时间
        endtime: number;//更新时间
        createtime: string;//创建时间
        choosetype: string;//判断分享活动或者充值活动
        lable: string;
        ishot: number;
    }









    //消息相关数据
    export class ADMINGETALLMESSAGEREQ extends ADMINREQBASE {
        messageid: string;
        messagename: string;
        time: string;
    }


    export class ADMINGETALLMESSAGEINFO {
        id: number;
        title: string;//消息名称
        detail: string;//消息具体内容
        sender: string;//发件人
        loginname: string;//收件人名称
        updatetime: string;//更新时间
        createtime: string;//创建时间

    }



    export class ADMINGETALLMESSAGEDETAILINFO {
        id: number;
        detail: string;
        loginid: string;//用户登录名
        createtime: string;//创建时间
        updatetime: string;//角色名称

    }


    export class ADMINGETALLMESSAGERESP {
        messagelist: ADMINGETALLMESSAGEINFO[];
    }

    export class ADMINGETALLMESSAGEDETAILESP {
        detaillist: ADMINGETALLMESSAGEDETAILINFO[];
    }
    export class ADMINDELMESSAGE extends ADMINGETALLMESSAGEINFO {

    }

    export class ADMINGETCHECKMESSAGEREQ extends ADMINREQBASE {
        messagename: string[];
    }


    export class ADMINADDMESSAGEREQ extends ADMINREQBASE {
        id: number;
        ceshi: string;
        title: string;//消息名称
        detail: string;//消息具体内容
        sender: string;//发件人
        loginname: string;//收件人名称
        updatetime: string;//更新时间
        createtime: string;//创建时间
    }






    //用户反馈信息相关数据
    export class ADMINGETALLFEEDBACKREQ extends ADMINREQBASE {
        backid: string;
        backname: string;
        time: string;
    }


    export class ADMINGETALFEEDBACKINFO {
        id: number;
        nickname: string;//用户名
        userid: string;
        gname: string;//反馈游戏名称
        title: string;//反馈标题
        detail: string;//反馈具体内容
        server: string;//反馈服务器
        ptype: string;//反馈类型   1游戏问题 2充值问题 3账号问题
        status: string;//状态
        createtime: string;//创建时间
        updatetime: string;//更新时间

    }



    export class ADMINGETALLFEEDBACKINFO {
        id: number;
        gname: string;//反馈游戏名称
        userid: string;
        nickname: string;//用户名
        title: string;//反馈标题
        detail: string;//反馈具体内容
        server: string;//反馈服务器
        ptype: string;//反馈类型   1游戏问题 2充值问题 3账号问题
        status: string;//状态
        createtime: string;//创建时间
        updatetime: string;//更新时间

    }


    export class ADMINGETALLFEEDBACKRESP {
        feedbacklist: ADMINGETALLFEEDBACKINFO[];
    }

    export class ADMINGETALLFEEDBACKESP {
        detaillist: ADMINGETALLFEEDBACKINFO[];
    }
    export class ADMINDELFEEDBACK extends ADMINGETALLFEEDBACKINFO {

    }

    export class ADMINGETCHECKFEEDBACKREQ extends ADMINREQBASE {
        feedbackname: string[];
    }


    export class ADMINADDFEEDBACKREQ extends ADMINREQBASE {
        id: number;
        nickname: string;//用户名
        userid: string;
        gname: string;//反馈游戏名称
        title: string;//反馈标题
        detail: string;//反馈具体内容
        server: string;//反馈服务器
        ptype: string;//反馈类型   1游戏问题 2充值问题 3账号问题
        status: string;//状态
        createtime: string;//创建时间
        updatetime: string;//更新时间
    }



    export class ADMINGETALLGAMENAMEINFO {
        id: number;
        appid: string;//游戏ID
        appname: string;
        sdkname: string;
    }
    export class ADMINGETALLGAMENAMERESP {
        gamename: ADMINGETALLGAMENAMEINFO[];
    }




    //管理高级福利相关数据
    export class ADMINGETALLACCOUNTTYPEREQ extends ADMINREQBASE {
        accountid: string;
        accountname: string;
        time: string;
    }


    export class ADMINGETALLACCOUNTTYPEINFO {
        id: number;
        gameid: string;//游戏ID
        appname: string;//游戏名称
        title: string;//福利名称
        condition: string;//福利类型
        pricelow: string;//最低价格
        pricehigh: string;//最高价格
        createtime: string;//创建时间
        updatetime: string;//更新时间

    }

    export class ADMINGETALLACCOUNTTYPERESP {
        accounttypelist: ADMINGETALLACCOUNTTYPEINFO[];
    }

    export class ADMINDELACCOUNTTYPE extends ADMINGETALLACCOUNTTYPEINFO {

    }

    export class ADMINGETCHECKACCOUNTTYPEREQ extends ADMINREQBASE {
        accounttypename: string[];
    }


    export class ADMINADDACCOUNTTYPEREQ extends ADMINREQBASE {
        id: number;
        gameid: string;//游戏ID
        appname: string;//游戏名称
        title: string;//福利名称
        condition: string;//福利类型
        pricelow: string;//最低价格
        pricehigh: string;//最高价格
        createtime: string;//创建时间
        updatetime: string;//更新时间
    }

    export class ADMINADDACCOUNTREQ extends ADMINREQBASE {
        id: number;
        gameid: string;//游戏ID
        appname: string;//游戏名称
        title: string;//福利名称
        condition: string;//福利类型
        pricelow: string;//最低价格
        pricehigh: string;//最高价格
        accounttitle: string[];
        accountcondition: string[];
        accountprice: string[];
        accountsurplu: string[];
    }



    //审核高级福利相关数据
    export class ADMINGETALLREVIEWACCOUNTREQ extends ADMINREQBASE {
        reviewid: string;
        reviewname: string;
        time: string;
    }


    export class ADMINGETALLREVIEWACCOUNTINFO {
        id: number;
        loginid: string;//用户ID名
        gname: string;//游戏名称
        detail: string;//具体信息
        server: string;//服务器
        rolename: string;//角色名
        createtime: string;//创建时间
        updatetime: string;//更新时间
        remark: string;//处理标记 0：未处理 1：领取成功 2：领取失败
    }

    export class ADMINGETALLREVIEWACCOUNTRESP {
        reviewlist: ADMINGETALLREVIEWACCOUNTINFO[];
    }

    export class ADMINDELREVIEWACCOUNT extends ADMINGETALLREVIEWACCOUNTINFO {

    }

    export class ADMINGETCHECKREVIEWACCOUNTREQ extends ADMINREQBASE {
        reviewname: string[];
    }


    export class ADMINADDREVIEWACCOUNTREQ extends ADMINREQBASE {
        id: number;
        loginid: string;//用户ID名
        gname: string;//游戏名称
        detail: string;//具体信息
        server: string;//服务器
        rolename: string;//角色名
        createtime: string;//创建时间
        updatetime: string;//更新时间
        remark: string;//处理标记 0：未处理 1：领取成功 2：领取失败
    }


    export class ADMINPLAFORMUSERCHARGEREQ2 extends ADMINREQBASE {//获取充值排行
        flags: number;
        timestart: string;
        timeend: string;
        moneyrang: string;
        userId: string;
    }

    //取得接入发行SDK的游戏列表
    export class ADMINGETSDKAPPLISTREQ extends ADMINREQBASE {
        addtime: string;//根据添加时间查询
        sdkid: number;//指定查询某个渠道SDK,空表示所有渠道
        appname: string;//游戏名称，空表示所有游戏
        id: number;//可选，指定查询t_sdkapp.id的游戏
    }
    export class SDKAPPINFO {
        //来自t_cpapp
        appid: number;
        appname: string;
        appsecret: string;
        ico: string;
        posturl: string;
        //来自t_sdkapp
        id: number;
        sdkid: number;
        sdkname: string;
        sdkappid: string;
        sdkappsecret: string;

        gameurl: string;//给渠道的游戏地址，例：http://5wanpk.com:7035/sdkapp_sdkappid_10，地址自动生成
        payurl: string;//给渠道的支付回调地址，例：http://5wanpk.com:7035/anysdk/haihaipay，地址SDK程序员手动输入
        remarkappid: string;//后台显示，提示sdkappid要怎么填写
        remarkappsecret: string;//后台显示，提示sdkappsecret要如何填写
        needproductid: number;//是否有充值档
        //渠道定制信息
        qqgroup: string;//QQ群
        kefuqq: string;//客服QQ
        addtime: string;//添加时间
        profit: string;//渠道分成
    }
    export class ADMINGETSDKAPPLISTRESP {
        data: SDKAPPINFO[];
    }

    //添加SDK游戏时取得可选择的游戏列表
    export class ADMINGETSELSDKAPPLISTREQ extends ADMINREQBASE {

    }
    export class ADMINGETSELSDKAPPINFO {
        appid: number;
        appname: string;
    }
    export class ADMINGETSELSDKAPPLISTRESP {
        data: ADMINGETSELSDKAPPINFO[];
    }

    //取得游戏充值档
    export class ADMINGETAPPPRODUCTSREQ {
        appid: number;
        sdkid: number;
    }
    export class APPPRODUCTINFO {
        appid: number;
        sdkid: number
        goodsname: string;
        price: number;
        productid: string;
    }
    export class ADMINGETAPPPRODUCTSRESP {
        data: APPPRODUCTINFO[];
    }

    //保存SDK游戏信息
    export class ADMINSAVESDKAPPINFOREQ extends ADMINREQBASE {
        id: number;//空表示新增
        appid: number;
        sdkid: number;
        sdkappid: string;
        sdkappsecret: string;
        products: APPPRODUCTINFO[];
        //渠道数据
        qqgroup: string;//qq群
        kefuqq: string;//客服QQ
        profit: string;//渠道分成
    }
    export class ADMINSAVESDKAPPINFORESP {
        id: number;
        gameurl: string;
    }
    export class ADMINSORTCHANGEREQ extends ADMINREQBASE {//交换排序编号
        id: number;
        sortnum: number;
    }
    export class ADMINGETALLCPAPPLISTREQ extends ADMINREQBASE {//获取CP应用列表简单数据
        appname: string;
    }
    export class ADMINGETALLCPAPPINFO {
        appid: number;
        appname: string;
        addtime: string;
    }
    export class ADMINGETBLANCEREQ extends ADMINREQBASE {//获取选中游戏的对账单数据
        appid: string;
        games: string[];
        timestart: string;
        timeend: string;
    }
    export class ADMINBLANCEINFO {//对账单信息
        appid: string;
        appname: string;
        bdate: string;
        income: string;
        hzimg: string;
        smimg: string;
    }
    export class ADMINUPLOADBLANCEFILEREQ extends ADMINREQBASE {//上传结算相关文件
        gameid: string;
        gamename: string;
        addtime: string;
        flags: string;
    }


    export class RECHAGEROBOTREQ {
        id: number//充值id
        appid: number;//游戏id
        userid: number;//用户id
        paysum: number;//充值金额
        nickname: string;//用户昵称
        headico: string;//用户头像
    }


    export class RECHAGEROBOTINFO {
        id: number//充值id
        appid: number;//游戏id
        userid: number;//用户id
        paysum: number;//充值金额
        nickname: string;//用户昵称
        headico: string;//用户头像
    }


    export class INDEXTITLEINFO {
        id: number;
        title: string;
    }

    export class INDEXGAMEREQ {
        type: number;
        appname: string[];
    }


    export class ADBANNERINFO {
        appname: string;//游戏名称
        gameid: number;//游戏id
        banner: string;//广告图片
    }


    export class LISTCOUNTBANNERREQ {
        time: string;//时间
    }

    export class LISTCOUNTBANNERINFO {
        type: string;//位置
        count: number;//点击总数
    }



    export function adminCheckLogin(cb: (userinfo: USERINFO) => void) {
        if (!userinfo) userinfo = utils.getCookie("ADMINUSERINFO");
        if (!userinfo) {
            window.parent.location.href = "index.html";
        }
        else {
            adminLogin({ loginid: userinfo.loginid, pwd: userinfo.pwd }, (resp) => {
                if (resp.errno != 0) {
                    alert(resp.message);
                    history.back();
                    return;
                }
                cb(userinfo);
            });
        }
    }

    export function spCheckLogin(cb: (userinfo: USERINFO) => void) {
        if (!userinfo) userinfo = utils.getCookie("SPUSERINFO");
        if (!userinfo) {
            window.parent.location.href = "index.html";
        }
        else {
            spLogin({ loginid: userinfo.loginid, pwd: userinfo.pwd }, (resp) => {
                if (resp.errno != 0) {
                    alert(resp.message);
                    history.back();
                    return;
                }
                cb(userinfo);
            });
        }
    }

    export function cpCheckLogin(cb: (userinfo: USERINFO) => void) {
        if (!userinfo) userinfo = utils.getCookie("CPUSERINFO");
        if (!userinfo) {
            window.parent.location.href = "index.html";
        }
        else {
            cpLogin({ loginid: userinfo.loginid, pwd: userinfo.pwd }, (resp) => {
                if (resp.errno != 0) {
                    alert(resp.message);
                    history.back();
                    return;
                }
                cb(userinfo);
            });
        }
    }

    export function adminLogin(param: ADMINREQBASE, cb: (para: ServerResp) => void) {
        if (!param.loginid && userinfo) param.loginid = userinfo.loginid;
        if (!param.pwd && userinfo) param.pwd = userinfo.pwd;
        PostServer("adminlogin", param, cb);
    }
    export function spLogin(param: ADMINREQBASE, cb: (para: ServerResp) => void) {
        if (!param.loginid && cpuserinfo) param.loginid = cpuserinfo.loginid;
        if (!param.pwd && cpuserinfo) param.pwd = cpuserinfo.pwd;
        PostServer("splogin", param, cb);
    }
    export function cpLogin(param: ADMINREQBASE, cb: (para: ServerResp) => void) {
        if (!param.loginid && spuserinfo) param.loginid = spuserinfo.loginid;
        if (!param.pwd && spuserinfo) param.pwd = spuserinfo.pwd;
        PostServer("cplogin", param, cb);
    }
    export function adminGetPkAppList(param: ADMINGETPKAPPLISTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetpkapplist", param, cb);
    }
    export function adminSavePkAppInfo(param: ADMINSAVEPKAPPINFOREQ, icofile, bgfile, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsavepkappinfo", param, cb, [{ ico: icofile, bg: bgfile }]);
    }

    export function adminDelPkApp(param: ADMINDELPKAPPREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admindelpkapp", param, cb);
    }


    export function adminGetH5AppList(param: ADMINGETH5APPLISTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingeth5applist", param, cb);
    }
    export function adminSaveH5AppInfo(param: ADMINSAVEH5APPINFOREQ, icofile, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsaveh5appinfo", param, cb, [{ ico: icofile }]);
    }

    export function adminDelH5App(param: ADMINDELH5APPREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admindelh5app", param, cb);
    }

    export function adminGetShopGoodsList(param: ADMINGETSHOPGOODSLISTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetshopgoodslist", param, cb);
    }
    export function adminSaveGoodsInfo(param: ADMINSAVEGOODSINFOREQ, icofile, imgfile, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsavegoodsinfo", param, cb, [{ icofile: icofile, imgfile: imgfile }]);
    }
    export function adminDelGoods(param: ADMINDELGOODSREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admindelgoods", param, cb);
    }
    export function adminGetWeeklyGoodsList(param: ADMINGETWEEKLYGOODSLISTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetweeklygoodslist", param, cb);
    }
    export function adminSaveWeeklyGoodsInfo(param: ADMINSAVEWEEKLYGOODSINFOREQ, imgfile, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsaveweeklygoodsinfo", param, cb, [{ imgfile: imgfile }]);
    }
    export function adminGetShopAdList(param: ADMINGETSHOPADLISTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetshopadlist", param, cb);
    }
    export function adminSaveShopAD(param: ADMINSAVESHOPADREQ, imgfile, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsaveshopad", param, cb, [{ imgfile: imgfile }]);
    }
    export function adminDelShopAD(param: ADMINDELSHOPADREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admindelshopad", param, cb);
    }
    export function adminDelWeeklyGoods(param: ADMINDELWEEKLYGOODSREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admindelweeklygoods", param, cb);
    }
    export function adminGetActivityList(param: ADMINGETACTIVITYLISTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetactivitylist", param, cb);
    }
    export function adminSaveActivity(param: ADMINSAVEACTIVITYREQ, imgfile, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsaveactivity", param, cb, [{ imgfile: imgfile }]);
    }
    export function adminDelActivity(param: ADMINDELACTIVITYREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admindelactivity", param, cb);
    }
    export function admingetExchangeRecord(param: ADMINGETEXCHANGERECORDREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetexchangerecord", param, cb);
    }
    export function adminSaveExchangeRecord(param: ADMINSAVEEXCHANGERECORDREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsaveexchangerecord", param, cb);
    }
    export function adminGetFlowStatistics(param: ADMINGETFLOWSTATISTICSREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetflowstatistics", param, cb);
    }
    export function adminGetRechargeList(param: ADMINGETRECHARGELISTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetrechargelist", param, cb);
    }
    export function adminGetCpList(param: ADMINGETCPLISTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetcplist", param, cb);
    }
    export function adminGetCPAppsList(param: ADMINGETCPAPPLISTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetcpappslist", param, cb);
    }

    export function adminGetCPAppsList_old(param: ADMINGETCPAPPLISTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetcpappslist_old", param, cb);
    }

    export function adminSaveCPAppInfo(param: ADMINCPAPPINFOREQ, files, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsavecpappinfo", param, cb, [{ icoimg: files[0], adimg: files[1] }]);
    }

    export function adminSaveCPAppInfo_new(param: ADMINCPAPPINFOREQ, files, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsavecpappinfo", param, cb, [{ icoimg: files[0], adimg: files[1], backimg: files[2],bannerimg:files[3] }]);
    }
    export function adminpassCPAppInfo(param: ADMINCPAPPINFOREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminpasscpappinfo", param, cb);
    }
    export function adminnopassCPAppInfo(param: ADMIN.ADMINNOPASSREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminnopasscpappinfo", param, cb);
    }
    export function admindelAppInfo(param: ADMIN.ADMINNOPASSREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admindelappinfo", param, cb);
    }
    export function admindownCPAppInfo(param: ADMIN.ADMINDELREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admindowncpappinfo", param, cb);
    }
    export function adminSaveAppInfo(param: ADMINAPPINFOREQ, files, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsaveappinfo", param, cb, [{ icoimg: files[0], adimg: files[1] }]);
    }
    export function getPayRecord(param: ADMINPAYRECORDREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("getpayrecord", param, cb);
    }
    export function adminGetCheckList(param: ADMINGETCHECKAPPINFOREQ, cb: (param: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetchecklist", param, cb);
    }
    export function adminpassAll(param: ADMINCPAPPINFOREQ[], cb: (param: ServerResp) => void) {
        PostServer("adminpassall", param, cb);
    }
    export function admindelAll(param: ADMINCPAPPINFOREQ[], cb: (param: ServerResp) => void) {
        PostServer("admindelall", param, cb);
    }
    export function admindownAll(param: ADMINCPAPPINFOREQ[], cb: (param: ServerResp) => void) {
        PostServer("admindownall", param, cb);
    }
    export function adminCalUserForDay(param: ADMINGETDATASREQ, cb: (param: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admincaluserforday", param, cb);
    }
    export function adminCalUserForTotal(param: ADMINGETDATASREQ, cb: (param: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admincaluserfortotal", param, cb);
    }
    export function adminCalIncomeForDay(param: ADMINGETDATASREQ, cb: (param: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admincalincomeforday", param, cb);
    }
    export function adminCalIncomeForMonth(param: ADMINGETDATASREQ, cb: (param: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admincalincomeformonth", param, cb);
    }
    export function adminCalIncomeForTotal(param: ADMINGETDATASREQ, cb: (param: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admincalincomefortotal", param, cb);
    }
    export function adminGetSdkTypeList(param: ADMINGETSDKTYPELISTREQ, cb: (para: ServerResp) => void) {
        PostServer("admingetsdktypelist", param, cb);
    }
    export function adminGetGameDataDetail(param: ADMINGETDATADETAILREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetgamedatadetail", param, cb);
    }
    export function adminGetUserOLData(param: ADMINGETDATADETAILREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetuseroldata", param, cb);
    }
    export function adminGetSdkPayDaily(param: ADMINGETDATADETAILREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetsdkpaydaily", param, cb);
    }
    export function adminGetUserolForCLData(param: ADMINGETDATADETAILREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetuserolforcldata", param, cb);
    }
    export function adminGetH5GameList(param: ADMINGETH5GAMELISTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingeth5gamelist", param, cb);
    }
    export function adminSortInsert(param: ADMINSORTINSERTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsortinsert", param, cb);
    }


    export function adminSortInsert_allgame(param: ADMINSORTINSERTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsortinsert_allgame", param, cb);
    }


    export function adminSortInsert_newgame(param: ADMINSORTINSERTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsortinsert_newgame", param, cb);
    }


    export function adminSortClick(param: ADMINSORTCLICKREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsortclick", param, cb);
    }
    export function adminGetActivityInfos(param: ADMINGETACTIVITYINFOSREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetactivityinfos", param, cb);
    }


    export function adminGetHotGame(param: ADMINGETACTIVITYINFOSREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingethotgame", param, cb);
    }



    export function adminGetADImg(param: ADMINGETACTIVITYINFOIMGREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetadimg", param, cb);
    }


    export function adminGethotgameImg(param: ADMINGETACTIVITYINFOIMGREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingethotgameimg", param, cb);
    }

    export function adminSaveHotGameInfo(param: ADMINSAVEACTIVITYINFOREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsavehotgameinfo", param, cb);
    }

    export function adminSaveADInfo(param: ADMINSAVEACTIVITYINFOREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsaveadinfo", param, cb);
    }
    export function adminInsertADInfo(param: ADMINSAVEACTIVITYREQ, imgfile, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admininsertadinfo", param, cb, [{ imgfile: imgfile }]);
    }
    export function adminSortInsertForAD(param: ADMINSORTINSERTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsortinsertforad", param, cb);
    }
    export function adminGetCPGameBalance(param: ADMINGETCPAPPJSREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetcpgamebalance", param, cb);
    }
    export function adminGetCPAppInfoForPercent(param: ADMINGETCPAPPPERCENTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetcpappinfoforpercent", param, cb);
    }
    export function adminChangeBalanceStatus(param: ADMINCHANGEBALANCESTATUSREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminchangebalancestatus", param, cb);
    }
    export function adminJS(param: ADMINGETCPAPPJSINFOREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminjs", param, cb);
    }
    export function adminNotJS(param: ADMINGETCPAPPJSINFOREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminnotjs", param, cb);
    }
    export function adminPushTo(param: ADMIN.ADMINPUSHTOREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminpushto", param, cb);
    }
    export function adminRemoveHotORec(param: ADMIN.ADMINREMOVEHOTORREC, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminremovehotorrec", param, cb);
    }
    export function adminGetUserOLDataGroupByGame(param: ADMINGETDATASREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetuseroldatagroupbygame", param, cb);
    }
    export function adminGetChannelCount(param: ADMINGETCHANNELCOUNTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetchannelcount", param, cb);
    }


    export function adminGetChannelCount_NEW(param: ADMINGETCHANNELCOUNTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetchannelcountnew", param, cb);
    }

    export function adminGetALLGAMENAME_NEW(param: ADMINGETCHANNELCOUNTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetallgamenamenew", param, cb);
    }

    export function adminGetNEWGAMENAME_NEW(param: ADMINGETCHANNELCOUNTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetnewgamenamenew", param, cb);
    }
    export function adminGetNEWGAMENAMEUP_NEW(param: ADMINGETCHANNELCOUNTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetnewgamenameupnew", param, cb);
    }

    export function adminGetAllSdkName_NEW(param: ADMINGETCHANNELCOUNTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetallsdknew", param, cb);
    }
    export function adminGetGameCount(param: ADMINGETGAMECOUNTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetgamecount", param, cb);
    }
    export function adminGetGameIncome(param: ADMINGETGAMEINCOMEREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetgameincome", param, cb);
    }
    export function adminGetGameUser(param: ADMINGETGAMEUSERREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetgameuser", param, cb);
    }
    export function adminAddGiftType(param: ADMINADDGIFTTYPREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminaddgifttype", param, cb);
    }
    export function adminDeleteGiftType(param: ADMINDELETEGIFTTYPREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admindeletegifttype", param, cb);
    }
    export function adminGetAllGift(param: ADMINGETALLGIFTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetallgift", param, cb);
    }


    export function adminGetAllGift_new(param: ADMINGETALLGIFTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetallgift_new", param, cb);
    }


    export function adminUploadFile(param: ADMINUPLOADFILE, file, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminuploadfile", param, cb, [{ codefile: file }]);
    }


    export function adminUploadFile_vip(param: ADMINUPLOADFILE, file, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminuploadfile_vip", param, cb, [{ codefile: file }]);
    }


    export function adminCalData(param: ADMINCALDATAREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admincaldata", param, cb);
    }
    export function adminChargeRankData(param: ADMINCHARGERANKREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminchargerankdata", param, cb);
    }
    export function adminGetUserDetail(param: ADMINGETUSERDETAILREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetuserdetail", param, cb);
    }
    export function adminGetYshCPDetail(param: ADMINGETYSHCPDETAILREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetyshcpdetail", param, cb);
    }
    export function adminSendPayCallback(param: ADMINSENDPAYCALLBACKREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsendpaycallback", param, cb);
    }
    export function adminGetPlameformData(param: ADMINGETPLAMFORMDATAREQ, cb: (para: ServerResp) => void) {//获取平台显示基本数据
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetplameformdata", param, cb);
    }
    export function adminGCDS(param: ADMINGAMECHARGEDATASEARCHREQ, cb: (para: ServerResp) => void) {//获取游戏充值数据
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingcds", param, cb);
    }


    export function adminChannelDetail(param: ADMINGAMECHARGEDATASEARCHREQ, cb: (para: ServerResp) => void) {//获取游戏充值数据
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminchanneldetail", param, cb);
    }


    export function adminCCDS(param: ADMINCHANNELCHARGEDATASEARCHREQ, cb: (para: ServerResp) => void) {//获取渠道充值数据
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminccds", param, cb);
    }

    export function adminUCDS(param: ADMINUSERCHARGEDATASEARCHREQ, cb: (para: ServerResp) => void) {//获取用户充值数据
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminucds", param, cb);
    }

    export function adminGDDS(param: ADMINGAMEDATADETAILREQ, cb: (para: ServerResp) => void) {//获取游戏详情数据
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingdds", param, cb);
    }

    export function adminGKDS(param: ADMINGAMEKEEPDATADETAILREQ, cb: (para: ServerResp) => void) {//获取游戏留存数据
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingkds", param, cb);
    }

    export function adminPCDS(param: ADMINPLAFORMCDSREQ, cb: (para: ServerResp) => void) {//平台每日充值数据
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminpcds", param, cb);
    }

    export function adminPUDS(param: ADMINPLAFORMPUDSREQ, cb: (para: ServerResp) => void) {//平台新用户数据
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminpuds", param, cb);
    }
    export function adminPVDS(param: ADMINPLAFORMPVDSREQ, cb: (para: ServerResp) => void) {//平台PV数据
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminpvds", param, cb);
    }
    export function adminPGCDS(param: ADMINPLAFORMGAMECHARGESEARCHREQ, cb: (para: ServerResp) => void) {//平台游戏充值数据
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminpgcds", param, cb);
    }

    export function adminPUCDS(param: ADMINPLAFORMUSERCHARGEREQ, cb: (para: ServerResp) => void) {//平台游戏充值数据
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminpucds", param, cb);
    }


    export function admindelBAG(param: ADMINDELGIFTBAG[], cb: (param: ServerResp) => void) {
        PostServer("admindelbag", param, cb);
    }


    export function admindelBAG_vip(param: ADMINDELGIFTBAG[], cb: (param: ServerResp) => void) {
        PostServer("admindelbag_vip", param, cb);
    }

    export function adminGetCheckBagList(param: ADMINGETCHECKGIFTBAGREQ, cb: (param: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetcheckbaglist", param, cb);
    }

    export function adminGetCheckBagList_vip(param: ADMINGETCHECKGIFTBAGREQ, cb: (param: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetcheckbaglist_vip", param, cb);
    }

    //获取开服表
    export function adminGetAllTable(param: ADMINGETALLOPENTABLEREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetalltable", param, cb);
    }



    //平台用户信息
    export function adminGetAllUser(param: ADMINGETALLLISTUSERREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetalluser", param, cb);
    }


    //VIP用户信息
    export function adminGetAllVIPUser(param: ADMINGETALLLISTUSERREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetallvipuser", param, cb);
    }


    //平台用户游戏列表
    export function adminGetAllUserGame(param: ADMINGETALLLISTUSERGAMEREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetallusergame", param, cb);
    }




    //保存开服表
    export function adminAddTable(param: ADMINADDOPENTABLEREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminaddtable", param, cb);
    }

    export function adminGetCheckTableList(param: ADMINGETCHECKGIFTTABLEREQ, cb: (param: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetchecktablelist", param, cb);
    }

    export function admindelTable(param: ADMINDELOPENTABLE[], cb: (param: ServerResp) => void) {
        PostServer("admindeltable", param, cb);
    }


    //获取游戏活动列表
    export function adminGetAllActivity(param: ADMINGETALLACTIVITYREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetallactivity", param, cb);
    }


    //获取游戏活动列表
    export function adminGetOneActivity(param: ADMINGETALLACTIVITYREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetoneactivity", param, cb);
    }


    //保存活动
    export function adminAddActivity(param: ADMINADDACTIVITYREQ, files, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminaddactivity", param, cb, [{adimg: files[0]}]);
    }


    //保存首页第一个banner
    export function addIndexFirstBanner(param: ADMINADDACTIVITYREQ, files, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("addindexfirstbanner", param, cb, [{ adimg: files[0] }]);
    }



    //获取活动多选列表
    export function adminGetCheckActivityList(param: ADMINGETCHECKACTIVITYREQ, cb: (param: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetcheckactivitylist", param, cb);
    }

    //多选删除活动
    export function admindelActivity(param: ADMINDELACTIVITY[], cb: (param: ServerResp) => void) {
        PostServer("admindelallactivity", param, cb);
    }


    //获取具体游戏活动详情
    export function adminGetAllActivityDetail(param: ADMINGETALLACTIVITYREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetallactivitydetail", param, cb);
    }

    //获取具体游戏活动详情
    export function adminGetAllActivityDetail2(param: ADMINGETALLACTIVITYREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetallactivitydetail2", param, cb);
    }

    //获取消息列表
    export function adminGetAllMessage(param: ADMINGETALLMESSAGEREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetallmessage", param, cb);
    }

    //获取消息多选列表
    export function adminGetCheckMessageList(param: ADMINGETCHECKMESSAGEREQ, cb: (param: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetcheckmessagelist", param, cb);
    }
    //多选选删除消息列表
    export function admindelMessage(param: ADMINDELMESSAGE[], cb: (param: ServerResp) => void) {
        PostServer("admindelallmessage", param, cb);
    }

    //保存消息内容
    export function adminAddMessage(param: ADMINADDMESSAGEREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminaddmessage", param, cb);
    }


    //获取反馈消息列表
    export function adminGetAllFeedBack(param: ADMINGETALLFEEDBACKREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetallfeedback", param, cb);
    }

    //获取反馈消息列表
    export function adminGetCheckFeedBackList(param: ADMINGETCHECKFEEDBACKREQ, cb: (param: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetcheckfeedbacklist", param, cb);
    }

    //多选选删除反馈信息列表
    export function admindelFeedBack(param: ADMINDELFEEDBACK[], cb: (param: ServerResp) => void) {
        PostServer("admindelallfeedback", param, cb);
    }

    //处理反馈问题
    export function adminDealProblem(param: ADMINADDMESSAGEREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminadddealproblem", param, cb);
    }

    //管理获取高级福利列表
    export function adminGetAllAccountType(param: ADMINGETALLACCOUNTTYPEREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetallaccounttype", param, cb);
    }

    //审核高级福利列表
    export function adminGetAllReviewAccount(param: ADMINGETALLREVIEWACCOUNTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetallreviewaccount", param, cb);
    }


    //获取高级福利管理列表
    export function adminGetCheckAcountTypeList(param: ADMINGETCHECKACCOUNTTYPEREQ, cb: (param: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetcheckaccounttypelist", param, cb);
    }

    //多选选删除反馈信息列表
    export function admindelAccountType(param: ADMINDELACCOUNTTYPE[], cb: (param: ServerResp) => void) {
        PostServer("admindelallaccounttype", param, cb);
    }


    //获取审核高级福利列表
    export function adminGetCheckReviewAccountList(param: ADMINGETCHECKREVIEWACCOUNTREQ, cb: (param: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetcheckreviewaccountlist", param, cb);
    }

    //多选通过高级福利审核
    export function adminpassReviewAccount(param: ADMINDELREVIEWACCOUNT[], cb: (param: ServerResp) => void) {
        PostServer("adminpassallreviewaccount", param, cb);
    }

    //多选不通过高级福利审核
    export function adminnotpassReviewAccount(param: ADMINDELREVIEWACCOUNT[], cb: (param: ServerResp) => void) {
        PostServer("adminnotpassreviewaccount", param, cb);
    }


    //添加高级福利
    export function adminAddAccount(param: ADMINADDACCOUNTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminaddaccount", param, cb);
    }

    export function adminSaveAppInfo_new(param: ADMINAPPINFOREQ, files, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsaveappinfo_new", param, cb, [{ icoimg: files[0], adimg: files[1], backimg: files[2],bannerimg:files[3] }]);
    }

    export function adminChargeRankData_New(param: ADMINPLAFORMUSERCHARGEREQ2, cb: (para: ServerResp) => void) {//获取用户充值
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminchargerankdatanew", param, cb);
    }

    export function adminGetSdkAppList(param: ADMINGETSDKAPPLISTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetsdkapplist", param, cb);
    }

    export function adminGetAppProducts(param: ADMINGETAPPPRODUCTSREQ, cb: (para: ServerResp) => void) {
        PostServer("admingetappproducts", param, cb);
    }

    export function adminGetSelSdkAppList(param: ADMINGETSELSDKAPPLISTREQ, cb: (para: ServerResp) => void) {
        PostServer("admingetselsdkapplist", param, cb);
    }

    export function adminSaveSdkAppInfo(param: ADMINSAVESDKAPPINFOREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsavesdkappinfo", param, cb);
    }

    export function adminSortChange(param: ADMINSORTCHANGEREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsortchange", param, cb);
    }

    export function adminSortHotGame(param: ADMINSORTCHANGEREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminsorthotgame", param, cb);
    }


    export function adminGetAllCpAppList(param: ADMINGETALLCPAPPLISTREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("getallcpapplist", param, cb);
    }

    export function adminGetBlance(param: ADMINGETBLANCEREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetblance", param, cb);
    }
    export function adminGetBlanceDetail(param: ADMINGETBLANCEREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetblancedetail", param, cb);
    }

    export function adminUploadBlanceFile(param: ADMINUPLOADBLANCEFILEREQ, file, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminuploadblancefile", param, cb, [{ imgfile: file }]);
    }




    export function getAllVipQQ(param: ADMINGETALLVIPQQREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("admingetallvipqq", param, cb);
    }



    export function updateVipQQ(param: ADMINADDVIPQQREQ, cb: (para: ServerResp) => void) {
        param.loginid = userinfo.loginid;
        param.pwd = userinfo.pwd;
        PostServer("adminupdatevipqq", param, cb);
    }

    export function getRechageReward(param: ACTIVITYINFO, cb: (para: ServerResp) => void) {
        PostServer("getrechagereward", param, cb);
    }
    export function getPointReward(param: ACTIVITYINFO, cb: (para: ServerResp) => void) {
        PostServer("getpointreward", param, cb);
    }
    export function getRechagerobot(param: ACTIVITYINFO, cb: (para: ServerResp) => void) {
        PostServer("getrechagerobot", param, cb);
    }
    export function saveRechageRobot(param: RECHAGEROBOTREQ, cb: (para: ServerResp) => void) {
        PostServer("saverechagerobot", param, cb);
    }


    export function getIndexTile(param: ACTIVITYINFO, cb: (para: ServerResp) => void) {
        PostServer("getindextitle", param, cb);
    }

    export function saveIndexTitle(param: INDEXTITLEINFO, cb: (para: ServerResp) => void) {
        PostServer("saveindextitle", param, cb);
    }

    export function getIndexTitleGame(param: INDEXTITLEINFO, cb: (para: ServerResp) => void) {
        PostServer("getindextitlegame", param, cb);
    }

    export function saveIndexGame(param: INDEXGAMEREQ, cb: (para: ServerResp) => void) {
        PostServer("saveindexgame", param, cb);
    }


    export function saveSearchGame(param: INDEXGAMEREQ, cb: (para: ServerResp) => void) {
        PostServer("savesearchgame", param, cb);
    }

    export function getSearchGameList(param: INDEXTITLEINFO, cb: (para: ServerResp) => void) {
        PostServer("getsearchgamelist", param, cb);
    }


    export function getAdBannerlist(param: ACTIVITYINFO, cb: (para: ServerResp) => void) {
        PostServer("getadbannerlist", param, cb);
    }


    export function getIndexCountBanner(param: LISTCOUNTBANNERREQ, cb: (para: ServerResp) => void) {
        PostServer("getcountbanner", param, cb);
    }


}