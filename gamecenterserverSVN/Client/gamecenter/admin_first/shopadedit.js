///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        adminshopadedit.LoadData();
    });
});
var adminshopadedit;
(function (adminshopadedit) {
    var imgfile;
    var goodslist;
    var data;
    function LoadData() {
        imgfile = document.getElementById("imgfile");
        goodslist = document.getElementById("goodslist");
        var para = sessionStorage['ADMINSHOPADINFO'];
        if (para)
            data = JSON.parse(para);
        ADMIN.adminGetShopGoodsList({ loginid: null, pwd: null }, function (resp) {
            if (resp.errno) {
                alert(resp.message);
                return;
            }
            var data = resp.data;
            for (var i = 0; i < data.goodslist.length; i++) {
                var goods = data.goodslist[i];
                var opt = document.createElement("option");
                opt.innerText = goods.name;
                opt.value = goods.id.toString();
                goodslist.appendChild(opt);
            }
            ShowData();
        });
    }
    adminshopadedit.LoadData = LoadData;
    function ShowData() {
        if (data) {
            $("#dataid").text(data.id);
            $("#goodslist").val(data.goodsid);
            $("#goodsimg").get(0)["src"] = data.img;
        }
    }
    function onSave() {
        var para = new ADMIN.ADMINSAVESHOPADREQ();
        if (data)
            para.id = data.id;
        para.goodsid = $("#goodslist").val();
        if (!para.goodsid) {
            alert("请选择商品!");
            return;
        }
        var file;
        if (imgfile.files.length > 0)
            file = imgfile.files[0];
        ADMIN.adminSaveShopAD(para, file, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功");
            history.back();
        });
    }
    adminshopadedit.onSave = onSave;
    function onSelImg() {
        $("#goodsimg").get(0)["src"] = utils.getFileUrl(imgfile);
    }
    adminshopadedit.onSelImg = onSelImg;
})(adminshopadedit || (adminshopadedit = {}));
//# sourceMappingURL=shopadedit.js.map