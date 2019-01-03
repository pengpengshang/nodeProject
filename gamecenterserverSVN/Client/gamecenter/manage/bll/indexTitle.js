$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        INDEXTITLE.loadTitleData();
        INDEXTITLE.loadGame();
    });
});
var INDEXTITLE;
(function (INDEXTITLE) {
    function loadTitleData() {
        var para = new ADMIN.ACTIVITYINFO();
        ADMIN.getIndexTile(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data = resp.data;
            $("#gametitle1").val(data[0].title);
            $("#gametitle2").val(data[1].title);
            $("#gametitle3").val(data[2].title);
            $("#gametitle4").val(data[3].title);
            $("#gametitle5").val(data[4].title);
        });
    }
    INDEXTITLE.loadTitleData = loadTitleData;
    function saveTile(id, title) {
        var para = new ADMIN.INDEXTITLEINFO();
        para.id = id;
        para.title = title;
        ADMIN.saveIndexTitle(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功");
        });
    }
    INDEXTITLE.saveTile = saveTile;
    function loadGame() {
        var title1 = [], title2 = [], title3 = [], title4 = [], title5 = [];
        var para = new ADMIN.INDEXTITLEINFO();
        ADMIN.getIndexTitleGame(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data = resp.data;
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
        });
    }
    INDEXTITLE.loadGame = loadGame;
    function saveGame(type, doc) {
        var para = new ADMIN.INDEXGAMEREQ();
        var game = new Array();
        para.type = type;
        doc.each(function () {
            if ($(this).val() != '') {
                game.push($(this).val());
            }
        });
        para.appname = game;
        ADMIN.saveIndexGame(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功");
        });
    }
    INDEXTITLE.saveGame = saveGame;
})(INDEXTITLE || (INDEXTITLE = {}));
//# sourceMappingURL=indexTitle.js.map