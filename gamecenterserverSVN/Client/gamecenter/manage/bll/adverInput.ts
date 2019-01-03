$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        ADVERINPUT.loadData();
    });
});
module ADVERINPUT {
    var imgfile: HTMLInputElement;
    var selh5game: HTMLSelectElement;
    var h5applist: ADMIN.H5APPINFO[];
    var activity: HTMLTableElement;
    var activityitem: HTMLTableRowElement;
    var activityitems: HTMLTableRowElement[] = [];
    export function loadData() {
        imgfile = <any>document.getElementById("ad_imgfile");
        selh5game = <any>document.getElementById("ad_gnamelist");
        activity = <any>document.getElementById("activity");
        activityitem = <any>document.getElementById("activityitems");
        activityitem.style.display = "none";
        var para: ADMIN.ADMINGETACTIVITYINFOSREQ = new ADMIN.ADMINGETACTIVITYINFOSREQ();
        ADMIN.adminGetActivityInfos(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < activityitems.length; i++) {
                activity.removeChild(activityitems[i]);
            }
            activityitems.splice(0);
            var dat: ADMIN.ADMINGETACTIVITYINFORESP = resp.data;
            for (var i = 0; i < dat.data.length; i++) {
                var activityInfo: ADMIN.ADMINACTIVITYINFO = dat.data[i];
                    var aditem: HTMLTableRowElement = <any>activityitem.cloneNode(true);
                    aditem.style.display = "";
                    $(aditem).find("#appname").val(activityInfo.gamename);
                    $(aditem).find("#createtime").text(new Date(activityInfo.createtime).toLocaleDateString());
                    $(aditem).find("#img").get(0)["src"] = activityInfo.img + "?" + Math.random();
                    (function (mdata: ADMIN.ADMINACTIVITYINFO, item: HTMLTableRowElement) {
                        $(aditem).find("#orderby").val(activityInfo.orderby).change(function () {
                            sortChange(mdata.id, $(this).val());
                        });
                        $(aditem).find("#get").click(function () {
                            getImgByGameName(item);
                        });
                        $(aditem).find("#save").click(function () {
                            adminSaveActivityAD(mdata.id,item);
                        });
                    }).call(this,activityInfo,aditem);
                    activity.appendChild(aditem);
                    activityitems.push(aditem);
            }
            //ADMIN.adminGetH5AppList({ loginid: null, pwd: null }, resp => {//获取游戏列表
            //    if (resp.errno != 0) {
            //        alert(resp.message);
            //        return;
            //    }
            //    var dat: ADMIN.ADMINGETH5APPLISTRESP = resp.data;
            //    h5applist = dat.applist;

            //    for (var i = 0; i < h5applist.length; i++) {
            //        var opt: HTMLOptionElement = document.createElement("option");
            //        opt.innerText = h5applist[i].name;
            //        opt.value = h5applist[i].id.toString();
            //        selh5game.add(opt, i);

            //    }
            //});
        });
    }

    export function getImgByGameName(item) {//根据游戏名获取广告图
        var para: ADMIN.ADMINGETACTIVITYINFOIMGREQ = new ADMIN.ADMINGETACTIVITYINFOIMGREQ();
        para.gamename = $(item).find("#appname").val();
        ADMIN.adminGetADImg(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            $(item).find("#img").get(0)["src"] = resp.data.data + "?" + Math.random();
        });
    }
    export function adminSaveActivityAD(id,item) {//flags标记是否为精选广告
        var para: ADMIN.ADMINSAVEACTIVITYINFOREQ = new ADMIN.ADMINSAVEACTIVITYINFOREQ();
        para.id = id;
        para.gamaname = $(item).find("#appname").val();
        para.orderby = $(item).find("#orderby").val();
        para.imgurl = $(item).find("#img").attr("src");
        para.flags = 0;
        ADMIN.adminSaveADInfo(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("成功");
            window.location.reload();
        });
    }
    export function sortInsert(id, sort) {
        var para: ADMIN.ADMINSORTINSERTREQ = new ADMIN.ADMINSORTINSERTREQ();
        para.id = id;
        para.sortnum = sort;
        ADMIN.adminSortInsertForAD(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }
    export function sortChange(id, sort) {
        var para: ADMIN.ADMINSORTCHANGEREQ = new ADMIN.ADMINSORTCHANGEREQ();
        para.id = id;
        para.sortnum = sort;
        ADMIN.adminSortChange(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }
    export function adminAddActivityAD() {
        var para = new ADMIN.ADMINSAVEACTIVITYREQ();
        var selh5id = selh5game.value;
        var selh5name = selh5game.selectedOptions[0].textContent;
        para.gamename = selh5name;
        para.url = selh5id;
        para.type = 1;
        para.orderby = $("#ad_sort").val();
        var file;
        if (imgfile.files.length > 0) file = imgfile.files[0];
        ADMIN.adminInsertADInfo(para, file, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功");
            window.location.reload();
        });
    }
    export function adminDelActivityAD(id) {
        var para = new ADMIN.ADMINDELACTIVITYREQ();
        para.id = id;
        ADMIN.adminDelActivity(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("删除成功");
            window.location.reload();
        });
    }
}