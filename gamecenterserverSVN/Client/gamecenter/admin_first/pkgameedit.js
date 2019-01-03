///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        adminpkgameedit.LoadData();
    });
});
var adminpkgameedit;
(function (adminpkgameedit) {
    var data;
    var icofile;
    var bgfile;
    function LoadData() {
        icofile = document.getElementById("icofile");
        bgfile = document.getElementById("bgfile");
        var para = sessionStorage["ADMINPKAPPINFO"];
        if (para) {
            data = JSON.parse(para);
        }
        if (data) {
            $("#gameid").text(data.id);
            $("#gamename").val(data.name);
            $("#gameico").get(0)["src"] = data.ico;
            $("#gamebg").get(0)["src"] = data.bg;
            $("#gameurl").val(data.url);
            $("#gamedetail").val(data.detail);
            $("#entrancegold").val(data.entrancegold);
            $("#wingold").val(data.wingold);
            $("#playcount").val(data.playcount);
            $("#opencount").text(data.opencount);
            document.getElementById("enablerobot").checked = (data.enablerobot != 0);
            $("#robotdelay").val(data.robotdelay);
            $("#robotscorespeed").val(data.robotscorespeed);
            $("#robotplaytimemax").val(data.robotplaytimemax);
            $("#robotplaytimemin").val(data.robotplaytimemin);
            $("#robotstartwait").val(data.robotstartwait);
            $("#robotwinrate").val(data.robotwinrate);
            $("#robotscoreinterval").val(data.robotscoreinterval);
        }
        else {
        }
    }
    adminpkgameedit.LoadData = LoadData;
    function onSave() {
        var para = new ADMIN.ADMINSAVEPKAPPINFOREQ();
        if (data)
            para.id = data.id;
        para.detail = $("#gamedetail").val();
        para.entrancegold = $("#entrancegold").val();
        para.name = $("#gamename").val();
        para.playcount = $("#playcount").val();
        para.url = $("#gameurl").val();
        para.wingold = $("#wingold").val();
        para.enablerobot = document.getElementById("enablerobot").checked ? 1 : 0;
        para.robotdelay = $("#robotdelay").val();
        para.robotscorespeed = $("#robotscorespeed").val();
        para.robotplaytimemax = $("#robotplaytimemax").val();
        para.robotplaytimemin = $("#robotplaytimemin").val();
        para.robotstartwait = $("#robotstartwait").val();
        para.robotwinrate = $("#robotwinrate").val();
        para.robotscoreinterval = $("#robotscoreinterval").val();
        var file;
        if (icofile.files.length > 0) {
            file = icofile.files[0];
        }
        var file2;
        if (bgfile.files.length > 0) {
            file2 = bgfile.files[0];
        }
        ADMIN.adminSavePkAppInfo(para, file, file2, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功!");
            history.back();
        });
    }
    adminpkgameedit.onSave = onSave;
    function onSelIco() {
        $("#gameico").get(0)["src"] = utils.getFileUrl(icofile);
    }
    adminpkgameedit.onSelIco = onSelIco;
    function onSelBg() {
        $("#gamebg").get(0)["src"] = utils.getFileUrl(bgfile);
    }
    adminpkgameedit.onSelBg = onSelBg;
})(adminpkgameedit || (adminpkgameedit = {}));
//# sourceMappingURL=pkgameedit.js.map