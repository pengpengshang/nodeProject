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
        //GAMEPAY.ShowRecentPlay(userinfo);
        GAMEPAY.loadHotGameList();
        GAMEPAY.getTjGame();
    });
});
var GAMEPAY;
(function (GAMEPAY) {
    function ShowRecentPlay(userinfo) {
        var rpgame = document.getElementById("game_pay_list");
        var para = new H5LOGINFOEntity_SECOND.GSUSERGETH5LOGLISTREQ();
        para.userid = userinfo.userid;
        GAMECENTER.getRecentPlayH5AppList(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var h5gameRPlist = resp.data;
            utils.setStorage("h5rps", resp.data, "sessionStorage");
            for (var i = 0; i < h5gameRPlist.length; i++) {
                var item = document.createElement("div");
                var link = document.createElement("a");
                var img = document.createElement("img");
                var appinfo = h5gameRPlist[i];
                (function fun(data) {
                    link.onclick = function () {
                        utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                        window.location.href = "../../gamepage.html#" + data.id;
                    };
                })(appinfo);
                img.src = appinfo.ico;
                img.setAttribute("class", "show_img");
                link.appendChild(img);
                item.setAttribute("class", "swiper-slide img");
                item.appendChild(link);
                rpgame.appendChild(item);
            }
            var swiper2 = new Swiper('.game_pay_list', {
                pagination: '.swiper-pagination',
                slidesPerView: 4.6,
                paginationClickable: true,
                spaceBetween: 10
            });
        });
    }
    GAMEPAY.ShowRecentPlay = ShowRecentPlay;
    /**********************获取推荐游戏*****************************/
    function getTjGame() {
        var tjgame = document.getElementById("tj_game_list");
        var para = new GAMECENTER.GETACTIVEREQ();
        GAMECENTER.getTjGameList(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var tjgamelist = resp.data;
            for (var i = 0; i < tjgamelist.length; i++) {
                var item = document.createElement("div");
                var link = document.createElement("a");
                var img = document.createElement("img");
                var appinfo = tjgamelist[i];
                (function fun(data) {
                    link.onclick = function () {
                        //utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                        window.location.href = "../../gamepage.html#" + data.id;
                    };
                })(appinfo);
                img.src = appinfo.ico;
                img.setAttribute("class", "show_img");
                link.appendChild(img);
                item.setAttribute("class", "swiper-slide img");
                item.appendChild(link);
                tjgame.appendChild(item);
            }
            var swiper = new Swiper('.tj_game', {
                pagination: '.swiper-pagination',
                slidesPerView: 5,
                autoplay: 2000,
                paginationClickable: true,
                grabCursor: true,
                loop: true,
                spaceBetween: 10
            });
        });
    }
    GAMEPAY.getTjGame = getTjGame;
    /************************获取大家都玩过的游戏***************************/
    function loadHotGameList() {
        var top_hot = [];
        var tophotlist = document.getElementById("hotgame_top");
        var tophotitem = tophotlist.firstElementChild;
        var tophotitems = [];
        tophotitem.style.display = "none";
        for (var i = 0; i < tophotitems.length; i++) {
            tophotlist.removeChild(tophotitems[i]);
        }
        tophotitems.splice(0);
        var para = new GAMECENTER.HOTGAMELISTINFO();
        GAMECENTER.getHotGameList(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data = resp.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].type == 'top') {
                    top_hot.push(data[i]);
                }
            }
            for (var i = 0; i < top_hot.length; i++) {
                var tophotinfo = top_hot[i];
                var topitem = tophotitem.cloneNode(true);
                $(topitem).find("#top_img").attr("src", tophotinfo.img);
                $(topitem).find("#top_gamename").text(tophotinfo.gamename);
                (function fun(mdata) {
                    $(topitem).find("#top_startgame").click(function () {
                        window.location.href = "../../gamepage.html#" + mdata.appid;
                    });
                    $(topitem).find(".gift_bag").click(function () {
                        window.location.href = 'gameDetail.html?gameid=' + mdata.appid;
                    });
                })(tophotinfo);
                topitem.style.display = "";
                tophotlist.appendChild(topitem);
                tophotitems.push(topitem);
            }
        });
    }
    GAMEPAY.loadHotGameList = loadHotGameList;
})(GAMEPAY || (GAMEPAY = {}));
//# sourceMappingURL=gamePay.js.map