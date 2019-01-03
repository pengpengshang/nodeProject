///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        adminweeklyedit.LoadData();
    });
});
var adminweeklyedit;
(function (adminweeklyedit) {
    var imgfile;
    var goodslist;
    var data;
    function LoadData() {
        imgfile = document.getElementById("imgfile");
        goodslist = document.getElementById("goodslist");
        var para = sessionStorage['ADMINWEEKLYGOODINFO'];
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
    adminweeklyedit.LoadData = LoadData;
    function ShowData() {
        if (data) {
            $("#dataid").text(data.id);
            $("#goodslist").val(data.goodsid);
            $("#goodsimg").get(0)["src"] = data.img;
            $("#timestart").val(new Date(data.timestart).toLocaleString());
            $("#timeend").val(new Date(data.timeend).toLocaleString());
        }
    }
    function onSave() {
        var para = new ADMIN.ADMINSAVEWEEKLYGOODSINFOREQ();
        if (data)
            para.id = data.id;
        para.goodsid = $("#goodslist").val();
        if (!para.goodsid) {
            alert("请选择商品!");
            return;
        }
        var str = $("#timestart").val();
        para.timestart = $("#timestart").val();
        para.timeend = $("#timeend").val();
        var file;
        if (imgfile.files.length > 0)
            file = imgfile.files[0];
        ADMIN.adminSaveWeeklyGoodsInfo(para, file, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功");
            history.back();
        });
    }
    adminweeklyedit.onSave = onSave;
    function onSelImg() {
        $("#goodsimg").get(0)["src"] = utils.getFileUrl(imgfile);
    }
    adminweeklyedit.onSelImg = onSelImg;
})(adminweeklyedit || (adminweeklyedit = {}));
//# sourceMappingURL=weeklyedit.js.map