$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        SELLACCOUNT.loadAllCPGames();
    });
});
var SELLACCOUNT;
(function (SELLACCOUNT) {
    var ctable;
    var ctableitem;
    var ctableitems = [];
    var btable;
    var btableitem;
    var btableitems = [];
    var bdtable;
    var bdtableitem;
    var bdtableitems = [];
    function loadAllCPGames() {
        var _this = this;
        ctable = document.getElementById("ctable");
        ctableitem = document.getElementById("ctableitem");
        ctableitem.style.display = "none";
        var para = new ADMIN.ADMINGETALLCPAPPLISTREQ();
        para.appname = $("#stxtappname").val();
        ADMIN.adminGetAllCpAppList(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < ctableitems.length; i++) {
                ctable.removeChild(ctableitems[i]);
            }
            ctableitems.splice(0);
            var dat = resp.data;
            for (var i = 0; i < dat.length; i++) {
                var cInfo = dat[i];
                var citem = ctableitem.cloneNode(true);
                citem.style.display = "";
                $(citem).find("#appname").val(cInfo.appname);
                $(citem).find("#txtappname").text(cInfo.appname);
                (function (citem, info) {
                    $(citem).find("#detail").click(function () {
                        $("#title").text(info.appname);
                        $("#appid").val(info.appid);
                        loadBlanceDetail(info.appid);
                    });
                }).call(_this, citem, cInfo);
                ctable.appendChild(citem);
                ctableitems.push(citem);
            }
        });
    }
    SELLACCOUNT.loadAllCPGames = loadAllCPGames;
    function loadCheckedBlance() {
        btable = document.getElementById("btable");
        btableitem = document.getElementById("btableitem");
        btableitem.style.display = "none";
        var para = new ADMIN.ADMINGETBLANCEREQ();
        para.games = PUTILS_NEW.getCheckValues(document.getElementById('ctable'));
        para.timestart = $("#timestart").val();
        para.timeend = $("#timeend").val();
        ADMIN.adminGetBlance(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < btableitems.length; i++) {
                btable.removeChild(btableitems[i]);
            }
            btableitems.splice(0);
            var dat = resp.data;
            for (var i = 0; i < dat.length; i++) {
                var bInfo = dat[i];
                var bitem = btableitem.cloneNode(true);
                bitem.style.display = "";
                $(bitem).find("#bappname").text(bInfo.appname);
                $(bitem).find("#bdate").text(bInfo.bdate);
                $(bitem).find("#bincome").text(bInfo.income);
                btable.appendChild(bitem);
                btableitems.push(bitem);
            }
            $(".bill").show().siblings().hide();
            $(".glyphicon-remove").click(function () {
                $(".bill").hide();
                $(".change").show();
            });
        });
    }
    SELLACCOUNT.loadCheckedBlance = loadCheckedBlance;
    function loadBlanceDetail(appid) {
        bdtable = document.getElementById("bdtable");
        bdtableitem = document.getElementById("bdtableitem");
        bdtableitem.style.display = "none";
        var para = new ADMIN.ADMINGETBLANCEREQ();
        para.appid = appid;
        para.timestart = $("#timestart2").val();
        ADMIN.adminGetBlanceDetail(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < bdtableitems.length; i++) {
                bdtable.removeChild(bdtableitems[i]);
            }
            bdtableitems.splice(0);
            var dat = resp.data;
            for (var i = 0; i < dat.length; i++) {
                var bdInfo = dat[i];
                var bditem = bdtableitem.cloneNode(true);
                bditem.style.display = "";
                $(bditem).find("#bddate").text(bdInfo.bdate);
                $(bditem).find("#bdincome").text(bdInfo.income);
                bdtable.appendChild(bditem);
                bdtableitems.push(bditem);
            }
            if (dat.length != 0) {
                $("#blanceImg").css("display", "");
                $("#hzimg").attr('src', dat[0].hzimg);
                $("#smimg").attr('src', dat[0].smimg);
            }
            else {
                $("#blanceImg").css("display", "none");
            }
            $(".game_bag").show().siblings().hide();
            $(".glyphicon-remove").click(function () {
                $(".game_bag").hide();
                $(".change").show();
                $('#timestart2').val(new XDate(new Date()).toString('yyyy-MM'));
            });
        });
    }
    SELLACCOUNT.loadBlanceDetail = loadBlanceDetail;
    function setImgSrc(input, img, flags) {
        img.src = utils.getFileUrl(input);
        var para = new ADMIN.ADMINUPLOADBLANCEFILEREQ();
        para.gamename = $("#title").text();
        para.gameid = $("#appid").val();
        para.addtime = $("#timestart2").val();
        para.flags = flags;
        var file = input.files[0];
        ADMIN.adminUploadBlanceFile(para, file, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("上传成功");
        });
    }
    SELLACCOUNT.setImgSrc = setImgSrc;
})(SELLACCOUNT || (SELLACCOUNT = {}));
//# sourceMappingURL=sellAccount.js.map