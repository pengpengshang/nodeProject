$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        INDEXTITLE.loadTitleData();
        INDEXTITLE.loadGame();
    });
}); 
module INDEXTITLE {
    export function loadTitleData() {
        var para: ADMIN.ACTIVITYINFO = new ADMIN.ACTIVITYINFO();
        ADMIN.getIndexTile(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data: ADMIN.INDEXTITLEINFO[] = resp.data;
            $("#gametitle1").val(data[0].title);
            $("#gametitle2").val(data[1].title);
            $("#gametitle3").val(data[2].title);
            $("#gametitle4").val(data[3].title);
            $("#gametitle5").val(data[4].title);
        })
    }


    export function saveTile(id,title) {
        var para: ADMIN.INDEXTITLEINFO = new ADMIN.INDEXTITLEINFO();
        para.id = id;
        para.title = title;
        ADMIN.saveIndexTitle(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功");
        })
    }


    export function loadGame() {
        var title1: ADMIN.H5APPINFO[] = [],
            title2: ADMIN.H5APPINFO[] = [],
            title3: ADMIN.H5APPINFO[] = [],
            title4: ADMIN.H5APPINFO[] = [],
            title5: ADMIN.H5APPINFO[] = [];
        var para: ADMIN.INDEXTITLEINFO = new ADMIN.INDEXTITLEINFO();
        ADMIN.getIndexTitleGame(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return
            }
            var data: ADMIN.H5APPINFO[] = resp.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].type == "1") {
                    title1.push(data[i]);
                }
                if (data[i].type == "2") {
                    title2.push(data[i]);
                }
                if (data[i].type == "3") {
                    title3.push(data[i]);
                }
                if (data[i].type == "4") {
                    title4.push(data[i]);
                }
                if (data[i].type == "5") {
                    title5.push(data[i]);
                }
            }

            for (var i = 0; i < title1.length; i++) {
                $(".gameinput").eq(i).val(title1[i].name);
            }
            for (var i = 0; i < title2.length; i++) {
                $(".gameinput2").eq(i).val(title2[i].name);
            }
            for (var i = 0; i < title3.length; i++) {
                $(".gameinput3").eq(i).val(title3[i].name);
            }
            for (var i = 0; i < title4.length; i++) {
                $(".gameinput4").eq(i).val(title4[i].name);
            }
            for (var i = 0; i < title5.length; i++) {
                $(".gameinput5").eq(i).val(title5[i].name);
            }
        })
    }


    export function saveGame(type,doc) {
        var para: ADMIN.INDEXGAMEREQ = new ADMIN.INDEXGAMEREQ();
        var game = new Array();
        para.type = type;
        doc.each(function () {
            if ($(this).val() != '') {
                game.push($(this).val());
            }
        })
        para.appname = game;
        ADMIN.saveIndexGame(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功");
        })
    }



}