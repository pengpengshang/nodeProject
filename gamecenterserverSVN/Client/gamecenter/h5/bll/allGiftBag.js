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
        ALLGIFTGAG.listGiftbagAll();
    });
});
var ALLGIFTGAG;
(function (ALLGIFTGAG) {
    /**********************************礼包列取********************************************/
    var newGift = []; //最新礼包
    var hotGift = []; //最热礼包
    var onlyGift = []; //独家礼包
    var newgiftlist = document.getElementById("new_gift");
    var newgiftitem = newgiftlist.firstElementChild;
    var newgiftitems = [];
    function listGiftbagAll() {
        var para = new GAMECENTER.GETALLGIFTTYPEREQNEW();
        para.loginid = GAMECENTER.userinfo.sdkloginid;
        GAMECENTER.getAllGiftList(para, function (resp) {
            newgiftitem.style.display = 'none';
            for (var i = 0; i < newgiftitems.length; i++) {
                newgiftlist.removeChild(newgiftitems[i]);
            }
            newgiftitems.splice(0);
            var data = resp.data;
            //fillType(data);
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            for (var i = 0; i < data.length; i++) {
                var newgiftinfo = data[i];
                var newitems = HTMLLIElement = newgiftitem.cloneNode(true);
                var prent = parseInt(((newgiftinfo.total - newgiftinfo.remainder) / newgiftinfo.total * 100).toString());
                $(newitems).find("#newgift_ico").attr("src", newgiftinfo.ico);
                $(newitems).find("#newgift_appname").text(newgiftinfo.name);
                $(newitems).find("#newgift_name").text(newgiftinfo.giftname);
                $(newitems).find("#newgift_createtime").text(new Date(newgiftinfo.endtime).toLocaleDateString());
                $(newitems).find("#newgift_left").attr("max", newgiftinfo.total);
                $(newitems).find("#newgift_left").attr("value", newgiftinfo.total - newgiftinfo.remainder);
                $(newitems).find("#newgift_baifen").text(prent + "%");
                if (newgiftinfo.groupqq == '' || newgiftinfo.groupqq == null) {
                    $(newitems).find("#get_in_together").attr("src", '../img/game/giftbag/nomall.png');
                    if (newgiftinfo.loginid == null) {
                        $(newitems).find(".together_qq").text("领取");
                        $(newitems).find(".together_qq").css({ "color": "white", "background-color": "red", "border": "none" });
                    }
                    else {
                        $(newitems).find(".together_qq").text("查看");
                    }
                }
                else {
                    $(newitems).find("#get_in_together").attr("src", '../img/game/giftbag/get_in_together.png');
                    $(newitems).find(".together_qq").text("加群");
                    $(newitems).find(".together_qq").css({
                        "color": "#FA6828",
                        "border": "2px solid #FA6828"
                    });
                }
                (function fun(data) {
                    $(newitems).find("#get_gift_code").on("click", function () {
                        var getFlag = $(this).text();
                        var loginid = GAMECENTER.userinfo.sdkloginid;
                        if ($(this).text() == "领取") {
                            getGiftCode(data.id, loginid, data.gameid, 0, $(this));
                        }
                        if ($(this).text() == "查看") {
                            getGiftCode(data.id, loginid, data.gameid, 1, $(this));
                        }
                        if (($(this).text() == "加群")) {
                            window.location.href = data.groupqq;
                        }
                    });
                    $(newitems).find("#newgift_ico").on("click", function () {
                        window.location.href = 'gameDetail.html?gameid=' + data.gameid;
                    });
                })(newgiftinfo);
                newitems.style.display = '';
                newgiftlist.appendChild(newitems);
                newgiftitems.push(newitems);
            }
        });
    }
    ALLGIFTGAG.listGiftbagAll = listGiftbagAll;
    function getGiftCode(typeid, loginid, gameid, flags, doc) {
        var para = new GAMECENTER.GETCODEINFOREQ();
        para.typeid = typeid;
        para.loginid = loginid;
        para.gameid = gameid;
        para.flags = flags;
        GAMECENTER.getGifiCode(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var codeinfo = resp.data;
            if (!!codeinfo.code) {
                $("#one_code").text(codeinfo.code);
                $("#one_detail").text(codeinfo.instruction);
                $("#one_theway").text(codeinfo.useway);
                $("#zhezhao").css("display", "");
                doc.text("查看");
                doc.css({ "color": "skyblue", "background-color": "white", "border": "2px solid skyblue" });
            }
            else {
                utils.dialogBox("来晚了,请等待下次发放");
                doc.text("结束");
                doc.css({ "color": "#999999", "border": "2px solid #999999", "background-color": "white" });
                $("#zhezhao").css("display", "none");
            }
            $("#start_game").click(function () {
                if (GAMECENTER.userinfo) {
                    utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                }
                if (isSafari()) {
                    window.location.href = "../../gamepage.html#" + resp.data.gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                }
                else {
                    window.location.href = "../../gamepage.html#" + resp.data.gameid;
                }
            });
        });
    }
    ALLGIFTGAG.getGiftCode = getGiftCode;
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
    ALLGIFTGAG.isSafari = isSafari;
})(ALLGIFTGAG || (ALLGIFTGAG = {}));
//# sourceMappingURL=allGiftBag.js.map