$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        GAMESEARCH.loadGame();
        GAMESEARCH.loadBanner();
    });
});
var GAMESEARCH;
(function (GAMESEARCH) {
    function loadGame() {
        var para = new ADMIN.INDEXTITLEINFO();
        ADMIN.getSearchGameList(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data = resp.data;
            for (var i = 0; i < data.length; i++) {
                $(".gameinput5").eq(i).val(data[i].name);
            }
        });
    }
    GAMESEARCH.loadGame = loadGame;
    function loadBanner() {
        var para = new ADMIN.ACTIVITYINFO();
        ADMIN.getAdBannerlist(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data = resp.data;
            $("#ad_appname").val(data[0].appname);
            $("#second_banner").val(data[1].appname);
            $("#search_banner").val(data[2].appname);
            $("#game_advert_img").attr("src", data[0].banner);
            $("#game_advert_img2").attr("src", data[1].banner);
            $("#game_advert_img3").attr("src", data[2].banner);
        });
    }
    GAMESEARCH.loadBanner = loadBanner;
    function saveGame(doc) {
        var para = new ADMIN.INDEXGAMEREQ();
        var game = new Array();
        doc.each(function () {
            if ($(this).val() != '') {
                game.push($(this).val());
            }
        });
        para.appname = game;
        ADMIN.saveSearchGame(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功");
        });
    }
    GAMESEARCH.saveGame = saveGame;
    var adimg; //广告图片
    var adfile;
    adimg = document.getElementById("game_advert_img");
    adfile = document.getElementById("adfile");
    var adimg2; //广告图片
    var adfile2;
    adimg2 = document.getElementById("game_advert_img2");
    adfile2 = document.getElementById("adfile2");
    var adimg3; //广告图片
    var adfile3;
    adimg3 = document.getElementById("game_advert_img3");
    adfile3 = document.getElementById("adfile3");
    function addAdBanner(type) {
        var para = new ADMIN.ADMINADDACTIVITYREQ();
        if (type == 1) {
            para.appname = $("#ad_appname").val();
            para.count = type;
            var files = [];
            if (adfile.files.length > 0) {
                files[0] = adfile.files[0];
            }
        }
        if (type == 2) {
            para.appname = $("#second_banner").val();
            para.count = type;
            var files = [];
            if (adfile2.files.length > 0) {
                files[0] = adfile2.files[0];
            }
        }
        if (type == 3) {
            para.appname = $("#search_banner").val();
            para.count = type;
            var files = [];
            if (adfile3.files.length > 0) {
                files[0] = adfile3.files[0];
            }
        }
        ADMIN.addIndexFirstBanner(para, files, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功！");
            window.location.reload();
        });
    }
    GAMESEARCH.addAdBanner = addAdBanner;
})(GAMESEARCH || (GAMESEARCH = {}));
//# sourceMappingURL=gamesearch.js.map