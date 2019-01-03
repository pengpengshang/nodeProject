///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        adminh5gameedit.LoadData();
    });
});
var adminh5gameedit;
(function (adminh5gameedit) {
    var data;
    var icofile;
    function LoadData() {
        icofile = document.getElementById("icofile");
        var para = sessionStorage["ADMINH5APPINFO"];
        if (para)
            data = JSON.parse(para);
        if (data) {
            $("#gameid").text(data.id);
            $("#gamename").val(data.name);
            $("#orderby").val(data.orderby);
            $("#gameico").get(0)["src"] = data.ico + "?" + Math.random();
            $("#gameurl").val(data.url);
            $("#gamedetail").val(data.detail);
            $("#getgold").val(data.getgold);
            $("#playcount").val(data.playcount);
            $("#opencount").text(data.opencount);
            $("#remark").val(data.remark);
            $("#ishot").attr({ "checked": data.ishot != 0 });
            $("#isrecommend").attr({ "checked": data.isrec != 0 });
        }
        else {
        }
    }
    adminh5gameedit.LoadData = LoadData;
    function onSave() {
        var para = new ADMIN.ADMINSAVEH5APPINFOREQ();
        if (data)
            para.id = data.id;
        para.detail = $("#gamedetail").val();
        para.name = $("#gamename").val();
        para.orderby = $("#orderby").val();
        para.playcount = $("#playcount").val();
        para.url = $("#gameurl").val();
        para.getgold = $("#getgold").val();
        para.remark = $("#remark").val();
        para.ishot = $("#ishot").get(0).checked ? 1 : 0;
        para.isrec = $("#isrecommend").get(0).checked ? 1 : 0;
        var file;
        if (icofile.files.length > 0) {
            file = icofile.files[0];
        }
        ADMIN.adminSaveH5AppInfo(para, file, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功!");
            history.back();
        });
    }
    adminh5gameedit.onSave = onSave;
    function onSelIco() {
        $("#gameico").get(0)["src"] = utils.getFileUrl(icofile);
    }
    adminh5gameedit.onSelIco = onSelIco;
})(adminh5gameedit || (adminh5gameedit = {}));
//# sourceMappingURL=h5gameedit.js.map