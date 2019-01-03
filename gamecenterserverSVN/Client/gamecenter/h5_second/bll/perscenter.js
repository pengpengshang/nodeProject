var _this = this;
$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if ((_this.parent == _this) || (utils.isMobileBrowser())) {
            if (userinfo == null) {
                alert("尚未登入，请先登入");
                window.location.href = "loginIndex.html";
            }
            else {
                PERSCENTER.showRPList();
                PERSCENTER.phoneNumBind();
            }
        }
        else {
            PERSCENTER.showRPList();
            PERSCENTER.phoneNumBind();
        }
    });
});
var PERSCENTER;
(function (PERSCENTER) {
    function showRPList() {
        var h5rpgamelist = document.getElementById("rplist");
        var h5gameitem = h5rpgamelist.firstElementChild;
        var h5rpgameitems = [];
        var listRPGame = []; //最近游戏
        h5gameitem.style.display = "none";
        for (var i = 0; i < h5rpgameitems.length; i++) {
            h5rpgamelist.removeChild(h5rpgameitems[i]);
        }
        h5rpgameitems.splice(0);
        listRPGame = utils.getStorage("h5rps", "sessionStorage");
        var today = new Date();
        for (var i = 0; listRPGame != null && i < listRPGame.length; i++) {
            var appinfo = listRPGame[i];
            var items = h5gameitem.cloneNode(true);
            var tjImage = document.createElement("img"); //推荐图标生成
            var giftImage = document.createElement("img"); //礼包图标生成
            tjImage.setAttribute("src", "../style/img/游戏信息/推荐图标.png");
            tjImage.setAttribute("class", "perscenter_content_tuijain");
            giftImage.setAttribute("src", "../style/img/游戏信息/礼包图标.png");
            giftImage.setAttribute("class", "perscenter_content_libao");
            items.querySelector(".perscenter_content_left_img")["src"] = appinfo.ico;
            items.querySelector(".perscenter_content_title").textContent = appinfo.name;
            items.querySelector(".perscenter_content_people").textContent = appinfo.playcount.toString();
            items.querySelector(".perscenter_content_info").textContent = utils.DotString(appinfo.detail, 30);
            items.querySelector(".perscenter_content_info")["title"] = appinfo.detail;
            var apptime = new Date(appinfo.createtime);
            if (apptime.getFullYear() == today.getFullYear() && apptime.getMonth() == today.getMonth()) {
                items.querySelector("#redTape").setAttribute("style", "display:block");
            }
            else {
                items.querySelector("#redTape").setAttribute("style", "display:none");
            }
            if (appinfo.isrec == 1) {
                items.querySelector(".perscenter_content_title").appendChild(tjImage);
            }
            if (appinfo.hasgift == 1) {
                items.querySelector(".perscenter_content_title").appendChild(giftImage);
            }
            (function fun(data) {
                $(items).find(".perscenter_content_playing_img").click(function (ev) {
                    if (GAMECENTER.userinfo) {
                        utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                    }
                    window.location.href = "../../gamepage.html#" + data.id;
                });
                $(items).find(".perscenter_content_left_img").click(function (ev) {
                    if (GAMECENTER.userinfo) {
                        utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                    }
                    window.location.href = "../../gamepage.html#" + data.id;
                });
            })(appinfo);
            items.style.display = "";
            h5rpgamelist.appendChild(items);
            h5rpgameitems.push(items);
        }
    }
    PERSCENTER.showRPList = showRPList;
    function phoneNumBind() {
        //alert(GAMECENTER.userinfo.phone);
        var tel = $("#tel");
        if (GAMECENTER.userinfo.phone) {
            $(".pM_content_top").css("display", "none");
            $(".pM_content_top").toggleClass("pM_content_topUse", true);
            $(".pM_content_mid").toggleClass("pM_content_midUse", true);
            $(".pM_content_bomtton").toggleClass("pM_content_bomttonUse", true);
            $(".pM_content_tel").css("display", "block");
            tel.html(GAMECENTER.userinfo.phone);
            tel.html(tel.html().substring(0, 3) + "****" + tel.html().substring(8, 11)).html();
            $(".pM_content_midUse").bind("tap", function () {
                var para = new GAMECENTER.GSUSERSETPHONEREQ();
                para.mysession = GAMECENTER.userinfo.session;
                para.phone = null;
                GAMECENTER.gsUserUnSetPhone(para, function (resp) {
                    if (resp.errno != 0) {
                        alert(resp.message);
                        return;
                    }
                    alert("解绑成功");
                    window.location.reload();
                });
            });
        }
        else {
            $(".pM_content_topUse").toggleClass("pM_content_top", true);
            $(".pM_content_midUse").toggleClass("pM_content_mid", true);
            $(".pM_content_bomttonUse").toggleClass("pM_content_bomtton", true);
            $(".pM_content_tel").css("display", "none");
            $(".pM_content_mid").bind("tap", function () {
                window.location.href = "login_after.html";
            });
        }
    }
    PERSCENTER.phoneNumBind = phoneNumBind;
    function showGiftList() {
        var sdkloginid = GAMECENTER.userinfo.sdkloginid;
        var para = new GAMECENTER.GSGETTEDSTATUSBYLOGINIDREQ();
        para.sdkloginid = sdkloginid;
        GAMECENTER.getGettedStatus(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            console.log(resp.data);
        });
    }
    PERSCENTER.showGiftList = showGiftList;
})(PERSCENTER || (PERSCENTER = {}));
//# sourceMappingURL=perscenter.js.map