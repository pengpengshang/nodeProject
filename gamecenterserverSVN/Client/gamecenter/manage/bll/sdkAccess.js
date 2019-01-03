$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        SDKACCESS.loadChannel();
        SDKACCESS.search();
    });
});
var SDKACCESS;
(function (SDKACCESS) {
    var selsdktype, mselappname, mselsdktype, aselappname, aselsdktype;
    var apptable;
    var appitem;
    var appitems = [];
    var mproducts;
    var aproducts;
    var applist;
    var sdklist;
    function loadChannel() {
        selsdktype = document.getElementById("selsdktype");
        mselsdktype = document.getElementById("mselsdktype");
        aselsdktype = document.getElementById("aselsdktype");
        mselappname = document.getElementById("mselappname");
        aselappname = document.getElementById("aselappname");
        mproducts = document.getElementById("mproducts");
        aproducts = document.getElementById("aproducts");
        apptable = document.getElementById("apptable");
        appitem = document.getElementById("appitem");
        appitem.style.display = "none";
        var para = new ADMIN.ADMINGETSDKTYPELISTREQ();
        ADMIN.adminGetSdkTypeList(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            sdklist = dat.data;
            for (var i = 0; i < dat.data.length; i++) {
                var opt = document.createElement("option");
                opt.value = dat.data[i].id.toString();
                opt.innerText = dat.data[i].sdkname;
                selsdktype.appendChild(opt);
                var opt2 = document.createElement("option");
                opt2.value = dat.data[i].id + "-" + dat.data[i].sdkname;
                opt2.innerText = dat.data[i].id + "-" + dat.data[i].sdkname;
                mselsdktype.appendChild(opt2);
                var opt3 = document.createElement("option");
                opt3.value = dat.data[i].id + "-" + dat.data[i].sdkname;
                opt3.innerText = dat.data[i].id + "-" + dat.data[i].sdkname;
                aselsdktype.appendChild(opt3);
            }
            onselsdk2();
            onselsdk3();
        });
        var para2 = new ADMIN.ADMINGETSELSDKAPPLISTREQ();
        ADMIN.adminGetSelSdkAppList(para2, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            applist = dat.data;
            for (var i = 0; i < dat.data.length; i++) {
                var data = dat.data[i];
                var opt = document.createElement("option");
                opt.innerText = data.appid.toString() + "-" + data.appname;
                opt.value = data.appid.toString() + "-" + data.appname;
                mselappname.appendChild(opt);
                var opt2 = document.createElement("option");
                opt2.innerText = data.appid.toString() + "-" + data.appname;
                opt2.value = data.appid.toString() + "-" + data.appname;
                aselappname.appendChild(opt2);
            }
        });
    }
    SDKACCESS.loadChannel = loadChannel;
    function search() {
        var _this = this;
        var para = new ADMIN.ADMINGETSDKAPPLISTREQ();
        para.addtime = $("#addtime").val();
        para.sdkid = $(selsdktype).val();
        para.appname = $("#txtappname").val();
        ADMIN.adminGetSdkAppList(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            while (apptable.children.length > 1)
                apptable.removeChild(apptable.lastElementChild);
            var dat = resp.data;
            for (var i = 0; i < dat.data.length; i++) {
                var data = dat.data[i];
                var item = appitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#ID").text(data.id).css("color", "#00AEEF").css("cursor", "pointer");
                ;
                $(item).find("#appid").text(data.appid);
                $(item).find("#appname").text(data.appname);
                $(item).find("#sdkname").text(data.sdkname);
                $(item).find("#addtime").text(new Date(data.addtime).toLocaleDateString());
                $(item).find("#gameurl").text(data.gameurl);
                $(item).find("#payurl").text(data.payurl);
                $(item).find("#needproductid").text(data.needproductid ? "有" : "");
                (function fun(item, data) {
                    $(item).find("#ID").click(function (ev) {
                        $(".game_bag").show().siblings().hide();
                        $(".glyphicon-remove").click(function () {
                            $(".game_bag").hide().siblings().show();
                        });
                        LoadDefMData(data.id);
                    });
                }).call(_this, item, data);
                apptable.appendChild(item);
            }
        });
    }
    SDKACCESS.search = search;
    function LoadDefMData(id) {
        //data = JSON.parse(sessionStorage["SDKAPPINFO"]);
        var para = new ADMIN.ADMINGETSDKAPPLISTREQ();
        para.id = id;
        if (para.id) {
            ADMIN.adminGetSdkAppList(para, function (resp) {
                if (resp.errno != 0) {
                    alert(resp.message);
                    history.back();
                    return;
                }
                var dat = resp.data;
                if (dat.data.length == 0) {
                    history.back();
                    return;
                }
                SDKACCESS.data = dat.data[0];
                fun();
            });
        }
        else
            fun();
        function fun() {
            if (SDKACCESS.data) {
                $("#txtsdkappid").val(SDKACCESS.data.sdkappid);
                $("#sdkappsecret").val(SDKACCESS.data.sdkappsecret);
                $("#mgameurl").text(SDKACCESS.data.gameurl);
                $("#mpayurl").text(SDKACCESS.data.payurl);
                $("#qqgroup").val(SDKACCESS.data.qqgroup);
                $("#kefuqq").val(SDKACCESS.data.kefuqq);
                $("#channel_charge").val(SDKACCESS.data.profit);
                mproducts.style.display = SDKACCESS.data.needproductid == 1 ? "" : "none";
                //获取充值档
                var para2 = new ADMIN.ADMINGETAPPPRODUCTSREQ();
                para2.appid = SDKACCESS.data.appid;
                para2.sdkid = SDKACCESS.data.sdkid;
                ADMIN.adminGetAppProducts(para2, function (resp) {
                    if (resp.errno != 0) {
                        alert(resp.message);
                    }
                    var dat = resp.data;
                    var str = "";
                    for (var i = 0; i < dat.data.length; i++) {
                        str += dat.data[i].goodsname + "," + dat.data[i].price + "," + dat.data[i].productid + "\r\n";
                    }
                    mproducts.value = str;
                });
                if (SDKACCESS.data) {
                    $("#xg_listgame").val(SDKACCESS.data.appid + "-" + SDKACCESS.data.appname);
                }
                if (SDKACCESS.data) {
                    $("#xg_listsdk").val(SDKACCESS.data.sdkid + "-" + SDKACCESS.data.sdkname);
                }
            }
        }
    }
    SDKACCESS.LoadDefMData = LoadDefMData;
    function onSave(isadd) {
        var para = new ADMIN.ADMINSAVESDKAPPINFOREQ();
        if (isadd == 0) {
            if (SDKACCESS.data)
                para.id = SDKACCESS.data.id;
            var arr = $("#xg_listgame").val().split("-");
            para.appid = parseInt(arr[0]);
            var arr2 = $("#xg_listsdk").val().split("-");
            para.sdkid = parseInt(arr2[0]);
            para.sdkappid = $("#txtsdkappid").val().trim();
            para.sdkappsecret = $("#sdkappsecret").val().trim();
            para.qqgroup = $("#qqgroup").val();
            para.kefuqq = $("#kefuqq").val();
            para.profit = $("#channel_charge").val();
            para.products = [];
            if (mproducts.style.display == "") {
                var productstr = mproducts.value.trim();
                var prolist = productstr.split("\n");
                for (var i = 0; i < prolist.length; i++) {
                    prolist[i] = prolist[i].trim();
                    var prodata = prolist[i].split(",");
                    if (prodata.length != 3) {
                        alert("充值档格式错误");
                        return;
                    }
                    var pinfo = new ADMIN.APPPRODUCTINFO();
                    pinfo.goodsname = prodata[0];
                    pinfo.price = parseFloat(prodata[1]);
                    pinfo.productid = prodata[2];
                    para.products.push(pinfo);
                }
            }
        }
        else {
            var arr = $("#listgame").val().split("-");
            para.appid = parseInt(arr[0]);
            var arr2 = $("#listsdk").val().split("-");
            para.sdkid = parseInt(arr2[0]);
            para.sdkappid = $("#txtsdkappid2").val().trim();
            para.sdkappsecret = $("#sdkappsecret2").val().trim();
            para.qqgroup = $("#qqgroup2").val();
            para.kefuqq = $("#kefuqq2").val();
            para.profit = $("#channel_charge2").val();
            para.products = [];
            if (aproducts.style.display == "") {
                var productstr = aproducts.value.trim();
                var prolist = productstr.split("\n");
                for (var i = 0; i < prolist.length; i++) {
                    prolist[i] = prolist[i].trim();
                    var prodata = prolist[i].split(",");
                    if (prodata.length != 3) {
                        alert("充值档格式错误");
                        return;
                    }
                    var pinfo = new ADMIN.APPPRODUCTINFO();
                    pinfo.goodsname = prodata[0];
                    pinfo.price = parseFloat(prodata[1]);
                    pinfo.productid = prodata[2];
                    para.products.push(pinfo);
                }
            }
        }
        ADMIN.adminSaveSdkAppInfo(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            if (!para.sdkappid || !para.sdkappsecret) {
                if (!SDKACCESS.data) {
                    SDKACCESS.data = new ADMIN.SDKAPPINFO();
                }
                var dat = resp.data;
                SDKACCESS.data.id = dat.id;
                SDKACCESS.data.gameurl = dat.gameurl;
                $("#mgameurl").text(SDKACCESS.data.gameurl);
                alert("游戏地址已生成，请输入APPID和KEY");
            }
            else {
                alert("保存成功！");
                $(".game_bag").hide().siblings().show();
                $("#sdkmanage").click();
            }
        });
    }
    SDKACCESS.onSave = onSave;
    function onselsdk2() {
        var arr2 = $("#xg_listsdk").val().split("-");
        var id = parseInt(arr2[0]);
        for (var i = 0; i < sdklist.length; i++) {
            if (sdklist[i].id == id) {
                $("#remarkappid").text(sdklist[i].remarkappid);
                $("#remarkappsecret").text(sdklist[i].remarkappsecret);
                $("#mpayurl").text(sdklist[i].payurl);
                $("#txtsdkappid").get(0)["value"] = null;
                $("#sdkappsecret").get(0)["value"] = null;
                $("#txtsdkappid").get(0)["placeholder"] = "例：" + sdklist[i].demoappid;
                $("#sdkappsecret").get(0)["placeholder"] = "例：" + sdklist[i].demoappsecret;
                mproducts.style.display = sdklist[i].needproductid == 1 ? "" : "none";
                return;
            }
        }
    }
    SDKACCESS.onselsdk2 = onselsdk2;
    function onselsdk3() {
        var arr2 = $("#listsdk").val().split("-");
        var id = parseInt(arr2[0]);
        for (var i = 0; i < sdklist.length; i++) {
            if (sdklist[i].id == id) {
                $("#remarkappid2").text(sdklist[i].remarkappid);
                $("#remarkappsecret2").text(sdklist[i].remarkappsecret);
                $("#apayurl").text(sdklist[i].payurl);
                $("#txtsdkappid2").get(0)["value"] = null;
                $("#sdkappsecret2").get(0)["value"] = null;
                $("#txtsdkappid2").get(0)["placeholder"] = "例：" + sdklist[i].demoappid;
                $("#sdkappsecret2").get(0)["placeholder"] = "例：" + sdklist[i].demoappsecret;
                //      aproducts.style.display = sdklist[i].needproductid == 1 ? "" : "none";
                return;
            }
        }
    }
    SDKACCESS.onselsdk3 = onselsdk3;
    function onselsdk(docInput, docSelect) {
        var sdkname = docInput.value;
        if (sdkname != "") {
            var op = docSelect.firstElementChild;
            while (op) {
                if (op.innerText.indexOf(sdkname) >= 0) {
                    docSelect.value = op.value;
                    break;
                }
                op = op.nextElementSibling;
            }
        }
    }
    SDKACCESS.onselsdk = onselsdk;
})(SDKACCESS || (SDKACCESS = {}));
//# sourceMappingURL=sdkAccess.js.map