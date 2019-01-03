$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        GAMESEARCH.loadGame();
        GAMESEARCH.loadBanner();
    });
});
module GAMESEARCH {

    export function loadGame() {
        var para: ADMIN.INDEXTITLEINFO = new ADMIN.INDEXTITLEINFO();
        ADMIN.getSearchGameList(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return
            }
            var data: ADMIN.H5APPINFO[] = resp.data;
            for (var i = 0; i < data.length; i++) {
                $(".gameinput5").eq(i).val(data[i].name);
            }
        })
    }




    export function loadBanner() {
        var para: ADMIN.ACTIVITYINFO = new ADMIN.ACTIVITYINFO();
        ADMIN.getAdBannerlist(para, resp =>{
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data: ADMIN.ADBANNERINFO[] = resp.data;
            $("#ad_appname").val(data[0].appname);
            $("#second_banner").val(data[1].appname);
            $("#search_banner").val(data[2].appname);
            $("#game_advert_img").attr("src", data[0].banner);
            $("#game_advert_img2").attr("src", data[1].banner);
            $("#game_advert_img3").attr("src", data[2].banner);
        })
    }




    export function saveGame(doc) {
        var para: ADMIN.INDEXGAMEREQ = new ADMIN.INDEXGAMEREQ();
        var game = new Array();
        doc.each(function () {
            if ($(this).val() != '') {
                game.push($(this).val());
            }
        })
        para.appname = game;
        ADMIN.saveSearchGame(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功");
        })
    }



    var adimg: HTMLImageElement;            //广告图片
    var adfile: HTMLInputElement;
    adimg = <any>document.getElementById("game_advert_img");
    adfile = <any>document.getElementById("adfile");

    var adimg2: HTMLImageElement;            //广告图片
    var adfile2: HTMLInputElement;
    adimg2 = <any>document.getElementById("game_advert_img2");
    adfile2 = <any>document.getElementById("adfile2");

    var adimg3: HTMLImageElement;            //广告图片
    var adfile3: HTMLInputElement;
    adimg3 = <any>document.getElementById("game_advert_img3");
    adfile3 = <any>document.getElementById("adfile3");


    export function addAdBanner(type) {
        var para: ADMIN.ADMINADDACTIVITYREQ = new ADMIN.ADMINADDACTIVITYREQ();

        if (type == 1) {
            para.appname = $("#ad_appname").val();
            para.count = type;
            var files: any = [];
            if (adfile.files.length > 0) {
                files[0] = adfile.files[0];
            }
        }
        if (type == 2) {
            para.appname = $("#second_banner").val();
            para.count = type;
            var files: any = [];
            if (adfile2.files.length > 0) {
                files[0] = adfile2.files[0];
            }
        }
        if (type == 3) {
            para.appname = $("#search_banner").val();
            para.count = type;
            var files: any = [];
            if (adfile3.files.length > 0) {
                files[0] = adfile3.files[0];
            }
        }
        
        ADMIN.addIndexFirstBanner(para, files, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功！");
            window.location.reload();
        });
    }

} 