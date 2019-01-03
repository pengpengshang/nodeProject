$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", function () {
                window.location.href = "login.html";
            });
            return;
        }
    });
});
var GAMETYPE;
(function (GAMETYPE) {
    var gametypelist = document.getElementById("gametype_all");
    var gametypeitem = gametypelist.firstElementChild;
    var gametypeitems = [];
    function loadGameTypeList(type) {
        var para = new GAMECENTER.GAMETYPEREQ();
        para.type = type;
        GAMECENTER.gsGetgametypelist(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            gametypeitem.style.display = "none";
            for (var i = 0; i < gametypeitems.length; i++) {
                gametypelist.removeChild(gametypeitem[i]);
            }
            gametypeitems.splice(0);
            var stlist = resp.data;
            for (var i = 0; i < stlist.length; i++) {
                var data = stlist[i];
                var item = HTMLLIElement = gametypeitem.cloneNode(true);
                if (data.ico == null || data.ico == "") {
                    continue;
                }
                else {
                    $(item).find("#gametype_ico").attr("src", data.ico);
                    $(item).find("#gametype_name").text(data.name);
                    $(item).find("#gametype_name").attr("title", data.id);
                    $(item).find("#gametype_detail").text(data.detail);
                    (function fun(appinfo) {
                        $(item).find("#gametype_ingame").click(function (ev) {
                            if (isSafari()) {
                                window.location.href = '../../gamepage.html#' + appinfo.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                            }
                            else {
                                window.location.href = '../../gamepage.html#' + appinfo.id;
                            }
                        });
                        $(item).find("#gametype_ico").click(function (ev) {
                            window.location.href = 'gameDetail.html?gameid=' + appinfo.id;
                        });
                    })(data);
                    item.style.display = "";
                    gametypelist.appendChild(item);
                    gametypeitems.push(item);
                }
            }
        });
    }
    GAMETYPE.loadGameTypeList = loadGameTypeList;
    function isSafari() {
        var ua = navigator.userAgent;
        var gbshare = document.querySelector("#gb-share");
        var isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios
        var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1; //android
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        if (isiOS) {
            if (userAgent.indexOf("Safari") > -1) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    GAMETYPE.isSafari = isSafari;
})(GAMETYPE || (GAMETYPE = {}));
//# sourceMappingURL=gameType.js.map