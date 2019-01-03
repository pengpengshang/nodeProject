///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        admingoodsedit.LoadData();
    });
});
var admingoodsedit;
(function (admingoodsedit) {
    var data;
    var icofile;
    var imgfile;
    function LoadData() {
        icofile = document.getElementById("icofile");
        imgfile = document.getElementById("imgfile");
        var para = sessionStorage["SHOPGOODSINFO"];
        if (para)
            data = JSON.parse(para);
        if (data) {
            $("#goodsid").text(data.id);
            $("#goodsname").val(data.name);
            $("#goodsico").get(0)["src"] = data.ico + "?" + Math.random();
            $("#goodsimg").get(0)["src"] = data.img + "?" + Math.random();
            $("#price").val(data.price);
            $("#rmbprice").val(data.rmbprice);
            $("#stock").val(data.stock);
            //			$("#detail").val(data.detail);
            $("#notice").text(data.notice);
        }
        else {
        }
    }
    admingoodsedit.LoadData = LoadData;
    function onSave() {
        var para = new ADMIN.ADMINSAVEGOODSINFOREQ();
        if (data)
            para.id = data.id;
        para.name = $("#goodsname").val();
        para.price = $("#price").val();
        para.rmbprice = $("#rmbprice").val();
        para.detail = ""; // $("#detail").val();
        para.notice = $("#notice").val();
        para.stock = $("#stock").val();
        ADMIN.adminSaveGoodsInfo(para, icofile.files[0], imgfile.files[0], function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功！");
            history.back();
            return;
        });
    }
    admingoodsedit.onSave = onSave;
    function onSelIco() {
        $("#goodsico").get(0)["src"] = utils.getFileUrl(icofile);
    }
    admingoodsedit.onSelIco = onSelIco;
    function onSelImg() {
        $("#goodsimg").get(0)["src"] = utils.getFileUrl(imgfile);
    }
    admingoodsedit.onSelImg = onSelImg;
})(admingoodsedit || (admingoodsedit = {}));
//# sourceMappingURL=goodsedit.js.map