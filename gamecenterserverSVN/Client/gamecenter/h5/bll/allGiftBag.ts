$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", () => {
                window.location.href = "login.html";
            });
            return;
        }
        ALLGIFTGAG.listGiftbagAll();
    });
});
module ALLGIFTGAG {
    /**********************************礼包列取********************************************/
    var newGift: GAMECENTER.GETALLGIFTTYPEINFONEW[] = [];//最新礼包
    var hotGift: GAMECENTER.GETALLGIFTTYPEINFONEW[] = [];//最热礼包
    var onlyGift: GAMECENTER.GETALLGIFTTYPEINFONEW[] = [];//独家礼包

    var newgiftlist: HTMLUListElement = <any>document.getElementById("new_gift");
    var newgiftitem: HTMLLIElement = <any>newgiftlist.firstElementChild;
    var newgiftitems: HTMLLIElement[] = [];



    export function listGiftbagAll() {
        var para: GAMECENTER.GETALLGIFTTYPEREQNEW = new GAMECENTER.GETALLGIFTTYPEREQNEW();
        para.loginid = GAMECENTER.userinfo.sdkloginid;
        GAMECENTER.getAllGiftList(para, resp => {
            newgiftitem.style.display = 'none';
            for (var i = 0; i < newgiftitems.length; i++) {
                newgiftlist.removeChild(newgiftitems[i]);
            }
            newgiftitems.splice(0);
            var data: GAMECENTER.GETALLGIFTTYPEINFONEW[] = resp.data;
            //fillType(data);
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            for (var i = 0; i < data.length; i++) {
                var newgiftinfo: GAMECENTER.GETALLGIFTTYPEINFONEW = data[i];
                var newitems = HTMLLIElement = <any>newgiftitem.cloneNode(true);
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
                    } else {
                        $(newitems).find(".together_qq").text("查看");
                    }
                } else {
                    $(newitems).find("#get_in_together").attr("src", '../img/game/giftbag/get_in_together.png');
                    $(newitems).find(".together_qq").text("加群");
                    $(newitems).find(".together_qq").css({
                        "color": "#FA6828",
                        "border": "2px solid #FA6828"
                    });
                }
                (function fun(data: GAMECENTER.GETALLGIFTTYPEINFONEW) {

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
                    })

                })(newgiftinfo)
                newitems.style.display = '';
                newgiftlist.appendChild(newitems);
                newgiftitems.push(newitems);
            }

        })
    }




    export function getGiftCode(typeid, loginid, gameid, flags, doc) {//获取礼包码
        var para: GAMECENTER.GETCODEINFOREQ = new GAMECENTER.GETCODEINFOREQ();
        para.typeid = typeid;
        para.loginid = loginid;
        para.gameid = gameid;
        para.flags = flags;
        GAMECENTER.getGifiCode(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var codeinfo: GAMECENTER.GETGIFTCODEINFO = resp.data;
            if (!!codeinfo.code) {
                $("#one_code").text(codeinfo.code);
                $("#one_detail").text(codeinfo.instruction);
                $("#one_theway").text(codeinfo.useway);
                $("#zhezhao").css("display", "");
                doc.text("查看");
                doc.css({ "color": "skyblue", "background-color": "white", "border": "2px solid skyblue" });
            } else {
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
                } else {
                    window.location.href = "../../gamepage.html#" + resp.data.gameid;
                }


            });
        });
    }




    export function isSafari() {
        var ua = navigator.userAgent;
        var gbshare = document.querySelector("#gb-share");
        var isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios
        var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1; //android
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        if (isiOS) {
            if (userAgent.indexOf("Safari") > -1) {
                return true;
            } else {
                return false;
            }
        }
    }

}