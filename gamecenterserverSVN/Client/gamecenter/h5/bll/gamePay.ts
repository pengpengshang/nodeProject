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
        //GAMEPAY.ShowRecentPlay(userinfo);
        GAMEPAY.loadHotGameList();
        GAMEPAY.getTjGame();
    });
}); 
module GAMEPAY {
    export function ShowRecentPlay(userinfo: GAMECENTER.GSUSERINFO) {
        var rpgame: HTMLDivElement = <any>document.getElementById("game_pay_list");
        var para: H5LOGINFOEntity_SECOND.GSUSERGETH5LOGLISTREQ = new H5LOGINFOEntity_SECOND.GSUSERGETH5LOGLISTREQ();
        para.userid = userinfo.userid;
        GAMECENTER.getRecentPlayH5AppList(para, resp => {//获取所有玩过的游戏列表
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var h5gameRPlist: GAMECENTER.H5APPINFO[] = resp.data;
            utils.setStorage("h5rps", resp.data, "sessionStorage");
            for (var i = 0; i < h5gameRPlist.length; i++) {
                var item: HTMLDivElement = document.createElement("div");
                var link: HTMLLinkElement = <any>document.createElement("a");
                var img: HTMLImageElement = document.createElement("img");
                var appinfo: GAMECENTER.H5APPINFO = h5gameRPlist[i];
                (function fun(data: GAMECENTER.H5APPINFO) {
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




    /**********************获取推荐游戏*****************************/
    export function getTjGame() {
        var tjgame: HTMLDivElement = <any>document.getElementById("tj_game_list");
        var para: GAMECENTER.GETACTIVEREQ = new GAMECENTER.GETACTIVEREQ();
        GAMECENTER.getTjGameList(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var tjgamelist: GAMECENTER.H5APPINFO[] = resp.data;
            for (var i = 0; i < tjgamelist.length; i++) {
                var item: HTMLDivElement = document.createElement("div");
                var link: HTMLLinkElement = <any>document.createElement("a");
                var img: HTMLImageElement = document.createElement("img");
                var appinfo: GAMECENTER.H5APPINFO = tjgamelist[i];
                (function fun(data: GAMECENTER.H5APPINFO) {
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
        })
    }




    /************************获取大家都玩过的游戏***************************/
    export function loadHotGameList() {

        var top_hot: GAMECENTER.HOTGAMELISTINFO[] = [];
        var tophotlist: HTMLUListElement = <any>document.getElementById("hotgame_top");
        var tophotitem: HTMLLIElement = <any>tophotlist.firstElementChild;
        var tophotitems: HTMLLIElement[] = [];
        tophotitem.style.display = "none";
        for (var i = 0; i < tophotitems.length; i++) {
            tophotlist.removeChild(tophotitems[i]);
        }
        tophotitems.splice(0);
        var para: GAMECENTER.HOTGAMELISTINFO = new GAMECENTER.HOTGAMELISTINFO();
        GAMECENTER.getHotGameList(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data: GAMECENTER.HOTGAMELISTINFO[] = resp.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].type == 'top') {
                    top_hot.push(data[i]);
                } 
            }
            for (var i = 0; i < top_hot.length; i++) {
                var tophotinfo: GAMECENTER.HOTGAMELISTINFO = top_hot[i];
                var topitem: HTMLLIElement = <any>tophotitem.cloneNode(true);
                $(topitem).find("#top_img").attr("src", tophotinfo.img);
                $(topitem).find("#top_gamename").text(tophotinfo.gamename);
                (function fun(mdata: GAMECENTER.HOTGAMELISTINFO) {
                    $(topitem).find("#top_startgame").click(function () {
                        window.location.href = "../../gamepage.html#" + mdata.appid;
                    })
                    $(topitem).find(".gift_bag").click(function () {
                        window.location.href = 'gameDetail.html?gameid=' + mdata.appid;
                    })
                })(tophotinfo)
                topitem.style.display = "";
                tophotlist.appendChild(topitem);
                tophotitems.push(topitem);
            }
        })

    }


}