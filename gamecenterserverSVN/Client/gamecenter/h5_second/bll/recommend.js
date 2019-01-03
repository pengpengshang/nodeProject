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
                RECOMMENDPAGE.ShowBannerData();
                RECOMMENDPAGE.ShowRECHtml5GameList();
            }
        }
        else {
            RECOMMENDPAGE.ShowBannerData();
            RECOMMENDPAGE.ShowRECHtml5GameList();
        }
    });
});
var RECOMMENDPAGE;
(function (RECOMMENDPAGE) {
    var h5tjgamelist = document.getElementById("reclist");
    var h5gameitem = h5tjgamelist.firstElementChild;
    var h5tjgameitems = [];
    var lisRecGame = []; //荐游
    function ShowBannerData() {
        var url;
        var muigroup = $("#mui-slider-group");
        var muiindicator = $("#mui-slider-indicator");
        muiindicator.find("*").remove(); //移除指示点元素内容
        muigroup.find("*").remove(); //移除banner项元素内容
        var ad = utils.getStorage("reclist", "sessionStorage");
        var adItem = document.createElement("div");
        var link = document.createElement("a");
        var img = document.createElement("img");
        if (ad[ad.length - 1].isrec == 1) {
            img.src = ad[ad.length - 1].img;
            img.setAttribute("style", "width:100%;height:400px"); //动态生成图片属性
            link.appendChild(img);
            adItem.setAttribute("class", "mui-slider-item mui-slider-item-duplicate");
            adItem.appendChild(link);
            muigroup.append(adItem);
        }
        for (var i = 0; i < ad.length; i++) {
            var indicatorPoint = document.createElement("div");
            var adItem = document.createElement("div");
            var link = document.createElement("a");
            var img = document.createElement("img");
            if (ad[i].isrec == 1) {
                if (ad[i].type == 1) {
                    link.onclick = function () {
                        utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                    };
                    url = "../../gamepage.html#" + ad[i].url;
                }
                else {
                    url = ad[i].url;
                }
                link.href = url;
                img.src = ad[i].img;
                img.setAttribute("style", "width:100%;height:400px");
                link.appendChild(img);
                if (i == 0) {
                    indicatorPoint.setAttribute("class", "mui-indicator mui-active");
                    adItem.setAttribute("class", "mui-slider-item mui-active");
                }
                else {
                    adItem.setAttribute("class", "mui-slider-item");
                    indicatorPoint.setAttribute("class", "mui-indicator");
                }
                muiindicator.append(indicatorPoint);
                adItem.appendChild(link);
                muigroup.append(adItem);
            }
        }
        var adItem = document.createElement("div");
        var link = document.createElement("a");
        var img = document.createElement("img");
        //if (ad[0].isrec == 1) {
        img.src = ad[0].img;
        img.setAttribute("style", "width:100%;height:400px");
        link.appendChild(img);
        adItem.setAttribute("class", "mui-slider-item mui-slider-item-duplicate");
        adItem.appendChild(link);
        muigroup.append(adItem);
        //}
    }
    RECOMMENDPAGE.ShowBannerData = ShowBannerData;
    function ShowRECHtml5GameList() {
        var today = new Date();
        h5gameitem.style.display = "none";
        for (var i = 0; i < h5tjgameitems.length; i++) {
            h5tjgamelist.removeChild(h5tjgameitems[i]);
        }
        h5tjgameitems.splice(0);
        var dat = utils.getStorage("h5gameitems", "sessionStorage");
        for (var k = 0; k < dat.length; k++) {
            var appinfo = dat[k];
            lisRecGame.push(appinfo);
        }
        if (lisRecGame.length <= 10) {
            $("#tmorepkgame").hide();
        }
        AddH5GameToList(0, Math.min(dat.length, 10));
    }
    RECOMMENDPAGE.ShowRECHtml5GameList = ShowRECHtml5GameList;
    function AddH5GameToList(start, count) {
        var today = new Date();
        for (var i = start; i < start + count; i++) {
            var tjImage = document.createElement("img"); //推荐图标生成
            var giftImage = document.createElement("img"); //礼包图标生成
            tjImage.setAttribute("src", "../style/img/游戏信息/推荐图标.png");
            tjImage.setAttribute("class", "perscenter_content_tuijain");
            giftImage.setAttribute("src", "../style/img/游戏信息/礼包图标.png");
            giftImage.setAttribute("class", "perscenter_content_libao");
            var appinfo = lisRecGame[i];
            var items = h5gameitem.cloneNode(true);
            items.querySelector(".recommend_content_left_img")["src"] = appinfo.ico;
            items.querySelector(".recommend_content_title").textContent = appinfo.name;
            items.querySelector(".recommend_content_people").textContent = appinfo.playcount.toString();
            items.querySelector(".recommend_content_info").textContent = utils.DotString(appinfo.detail, 30);
            items.querySelector(".recommend_content_info")["title"] = appinfo.detail;
            var apptime = new Date(appinfo.createtime);
            if (apptime.getFullYear() == today.getFullYear() && apptime.getMonth() == today.getMonth()) {
                items.querySelector("#redTape").setAttribute("style", "display:block");
            }
            else {
                items.querySelector("#redTape").setAttribute("style", "display:none");
            }
            if (appinfo.isrec == 1) {
                items.querySelector(".recommend_content_title").appendChild(tjImage);
            }
            if (appinfo.hasgift == 1) {
                items.querySelector(".recommend_content_title").appendChild(giftImage);
            }
            (function fun(data) {
                $(items).find(".recommend_content_left_img").click(function (ev) {
                    if (GAMECENTER.userinfo) {
                        utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                    }
                    window.location.href = "../../gamepage.html#" + data.id;
                });
                $(items).find(".recommend_content_playing_img").click(function (ev) {
                    if (GAMECENTER.userinfo) {
                        utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                    }
                    window.location.href = "../../gamepage.html#" + data.id;
                });
            })(appinfo);
            items.style.display = "";
            h5tjgamelist.appendChild(items);
            h5tjgameitems.push(items);
        }
    }
    //更多游戏
    function onMorePkGame(flag) {
        var count = lisRecGame.length - h5tjgameitems.length;
        if (count <= 0)
            return;
        AddH5GameToList(h5tjgameitems.length, count);
        $("#tmorepkgame").hide();
    }
    RECOMMENDPAGE.onMorePkGame = onMorePkGame;
})(RECOMMENDPAGE || (RECOMMENDPAGE = {}));
//# sourceMappingURL=recommend.js.map