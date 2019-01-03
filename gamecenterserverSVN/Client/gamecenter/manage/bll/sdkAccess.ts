$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        SDKACCESS.loadChannel();
        SDKACCESS.search();
    })
});
module SDKACCESS {
    var selsdktype: HTMLSelectElement,mselappname: HTMLSelectElement,mselsdktype: HTMLSelectElement,aselappname: HTMLSelectElement,aselsdktype: HTMLSelectElement;
    var apptable: HTMLTableElement;
    var appitem: HTMLTableRowElement;
    var appitems: HTMLTableRowElement[] = [];
    export var data: ADMIN.SDKAPPINFO;
    var mproducts: HTMLTextAreaElement;
    var aproducts: HTMLTextAreaElement;
    var applist: ADMIN.ADMINGETSELSDKAPPINFO[];
    var sdklist: ADMIN.ADMINSDKTYPEINFO[];
    export function loadChannel() {
        selsdktype = <any>document.getElementById("selsdktype");
        mselsdktype = <any>document.getElementById("mselsdktype");
        aselsdktype = <any>document.getElementById("aselsdktype");
        mselappname = <any>document.getElementById("mselappname");
        aselappname = <any>document.getElementById("aselappname");
        mproducts = <any>document.getElementById("mproducts");
        aproducts = <any>document.getElementById("aproducts");
        apptable = <any>document.getElementById("apptable");
        appitem = <any>document.getElementById("appitem");
        appitem.style.display = "none";
        var para = new ADMIN.ADMINGETSDKTYPELISTREQ();
        ADMIN.adminGetSdkTypeList(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat: ADMIN.ADMINGETSDKTYPELISTRESP = resp.data;
            sdklist = dat.data;
            for (var i = 0; i < dat.data.length; i++) {
                var opt: HTMLOptionElement = <any>document.createElement("option");
                opt.value = dat.data[i].id.toString();
                opt.innerText = dat.data[i].sdkname;
                selsdktype.appendChild(opt);
                var opt2: HTMLOptionElement = <any>document.createElement("option");
                opt2.value = dat.data[i].id + "-" + dat.data[i].sdkname;
                opt2.innerText = dat.data[i].id+"-"+dat.data[i].sdkname;
                mselsdktype.appendChild(opt2);
                var opt3: HTMLOptionElement = <any>document.createElement("option");
                opt3.value = dat.data[i].id + "-" + dat.data[i].sdkname;
                opt3.innerText = dat.data[i].id + "-" + dat.data[i].sdkname;
                aselsdktype.appendChild(opt3);
            }
            onselsdk2();
            onselsdk3();
        });
        var para2 = new ADMIN.ADMINGETSELSDKAPPLISTREQ();
        ADMIN.adminGetSelSdkAppList(para2, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat: ADMIN.ADMINGETSELSDKAPPLISTRESP = resp.data;
            applist = dat.data;
            for (var i = 0; i < dat.data.length; i++) {
                var data = dat.data[i];
                var opt: HTMLOptionElement = document.createElement("option");
                opt.innerText = data.appid.toString() + "-"+data.appname;
                opt.value = data.appid.toString() + "-"+data.appname;
                mselappname.appendChild(opt);
                var opt2: HTMLOptionElement = document.createElement("option");
                opt2.innerText = data.appid.toString() + "-" + data.appname;
                opt2.value = data.appid.toString() + "-" + data.appname;
                aselappname.appendChild(opt2);
            }
        });
    }

    export function search() {
        var para = new ADMIN.ADMINGETSDKAPPLISTREQ();
        para.addtime = $("#addtime").val();
        para.sdkid = $(selsdktype).val();
        para.appname = $("#txtappname").val();
        ADMIN.adminGetSdkAppList(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            while (apptable.children.length > 1) apptable.removeChild(apptable.lastElementChild);
            var dat: ADMIN.ADMINGETSDKAPPLISTRESP = resp.data;
            for (var i = 0; i < dat.data.length; i++) {
                var data = dat.data[i];
                var item: HTMLTableRowElement = <any>appitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#ID").text(data.id).css("color", "#00AEEF").css("cursor", "pointer");;
                $(item).find("#appid").text(data.appid)
                $(item).find("#appname").text(data.appname);
                $(item).find("#sdkname").text(data.sdkname);
                $(item).find("#addtime").text(new Date(data.addtime).toLocaleDateString());
                $(item).find("#gameurl").text(data.gameurl);
                $(item).find("#payurl").text(data.payurl);
                $(item).find("#needproductid").text(data.needproductid ? "有" : "");
                (function fun(item: HTMLTableRowElement, data: ADMIN.SDKAPPINFO) {
                    $(item).find("#ID").click(ev => {
                        $(".game_bag").show().siblings().hide();
                        $(".glyphicon-remove").click(function () {
                            $(".game_bag").hide().siblings().show();
                        })
                        LoadDefMData(data.id);
                    });
                }).call(this, item, data);
                apptable.appendChild(item);
            }
        });
    }
    export function LoadDefMData(id) {
        //data = JSON.parse(sessionStorage["SDKAPPINFO"]);
        var para = new ADMIN.ADMINGETSDKAPPLISTREQ();
        para.id = id;
        if (para.id) {
            ADMIN.adminGetSdkAppList(para, resp => {
                if (resp.errno != 0) {
                    alert(resp.message);
                    history.back();
                    return;
                }
                var dat: ADMIN.ADMINGETSDKAPPLISTRESP = resp.data;
                if (dat.data.length == 0) {
                    history.back();
                    return;
                }

                data = dat.data[0];
                fun();
            });
        }
        else fun();
        function fun() {
            if (data) {
                $("#txtsdkappid").val(data.sdkappid);
                $("#sdkappsecret").val(data.sdkappsecret);
                $("#mgameurl").text(data.gameurl);
                $("#mpayurl").text(data.payurl);
                $("#qqgroup").val(data.qqgroup);
                $("#kefuqq").val(data.kefuqq);
                $("#channel_charge").val(data.profit);
                mproducts.style.display = data.needproductid == 1 ? "" : "none";
                //获取充值档
                var para2 = new ADMIN.ADMINGETAPPPRODUCTSREQ();
                para2.appid = data.appid;
                para2.sdkid = data.sdkid;
                ADMIN.adminGetAppProducts(para2, resp => {
                    if (resp.errno != 0) {
                        alert(resp.message);
                    }
                    var dat: ADMIN.ADMINGETAPPPRODUCTSRESP = resp.data;
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
    export function onSave(isadd) {//保存游戏
        var para = new ADMIN.ADMINSAVESDKAPPINFOREQ();
        if (isadd == 0) {
            if (data) para.id = data.id;


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
        } else {
            

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
        ADMIN.adminSaveSdkAppInfo(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            if (!para.sdkappid || !para.sdkappsecret) {
                if (!data) {
                    data = new ADMIN.SDKAPPINFO();
                }
                var dat: ADMIN.ADMINSAVESDKAPPINFORESP = resp.data;
                data.id = dat.id;
                data.gameurl = dat.gameurl;
                $("#mgameurl").text(data.gameurl);
                alert("游戏地址已生成，请输入APPID和KEY");
            }
            else {
                alert("保存成功！");
                $(".game_bag").hide().siblings().show();
                $("#sdkmanage").click();
            }
        }); 
    }
    export function onselsdk2() {//修改游戏渠道选择设置数据


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

    export function onselsdk3() {//添加游戏渠道选择设置数据
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

    export function onselsdk(docInput: HTMLInputElement, docSelect: HTMLSelectElement) {//渠道简单筛选
        var sdkname = docInput.value;
        if (sdkname != "") {
            var op: HTMLOptionElement = <any>docSelect.firstElementChild;
            while (op) {
                if (op.innerText.indexOf(sdkname) >= 0) { 
                    docSelect.value = op.value;
                    break;
                }
                op = <any>op.nextElementSibling;
            }
        }
    }
}