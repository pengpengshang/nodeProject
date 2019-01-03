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
        ACVIVITYDETAIL.loadData();
    });
});
var ACVIVITYDETAIL;
(function (ACVIVITYDETAIL) {
    function loadData() {
        loadActivityList();
    }
    ACVIVITYDETAIL.loadData = loadData;
    function loadActivityList() {
        var para = new GAMECENTER.GAMEACTIVITYINFOREQ();
        para.loginid = GAMECENTER.userinfo.sdkloginid;
        para.id = utils.getQueryString("acId").toString();
        GAMECENTER.getActivityList(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat = resp.data;
            for (var i = 0; i < dat.gameactivitylist.length; i++) {
                var actinfo = dat.gameactivitylist[i];
                $("#gamedetail_ad").attr("src", actinfo.ico);
                $("#detail_appname").text(actinfo.appname);
                $("#gamedetail_start").click(function () {
                    if (isSafari()) {
                        window.location.href = '../../gamepage.html#' + actinfo.gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                    }
                    else {
                        window.location.href = '../../gamepage.html#' + actinfo.gameid;
                    }
                });
                $("#detail_title").text(actinfo.title);
                $("#detail_time").text(new Date(actinfo.starttime).toLocaleDateString() + "至" + new Date(actinfo.endtime).toLocaleDateString());
                $("#activitydetail_jieshao").html(actinfo.detail);
                if (actinfo.atype == 0) {
                    $("#the_way").attr("src", "../img/game/activity/activity_qq.png");
                }
                $("#ac_start").click(function (ev) {
                    if (isSafari()) {
                        window.location.href = '../../gamepage.html#' + actinfo.gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                    }
                    else {
                        window.location.href = '../../gamepage.html#' + actinfo.gameid;
                    }
                });
            }
        });
    }
    ACVIVITYDETAIL.loadActivityList = loadActivityList;
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
    ACVIVITYDETAIL.isSafari = isSafari;
})(ACVIVITYDETAIL || (ACVIVITYDETAIL = {}));
//# sourceMappingURL=activityDetail.js.map