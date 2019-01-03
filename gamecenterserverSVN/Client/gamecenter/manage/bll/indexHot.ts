$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        INDEXHOTGAME.loadData();
    });
});
module INDEXHOTGAME {
    var imgfile: HTMLInputElement;
    var selh5game: HTMLSelectElement;
    var h5applist: ADMIN.H5APPINFO[];
    var activity: HTMLTableElement;
    var activityitem: HTMLTableRowElement;
    var activityitems: HTMLTableRowElement[] = [];
    var activity_bottom: HTMLTableElement;
    var activityitem_bottom: HTMLTableRowElement;
    var activityitems_bottom: HTMLTableRowElement[] = [];
    export function loadData() {
        imgfile = <any>document.getElementById("ad_imgfile");
        selh5game = <any>document.getElementById("ad_gnamelist");
        activity = <any>document.getElementById("activity");
        activityitem = <any>document.getElementById("activityitems");
        activityitem.style.display = "none";


        activity_bottom = <any>document.getElementById("activity_bottom");
        activityitem_bottom = <any>document.getElementById("activityitems_bottom");
        activityitem_bottom.style.display = "none";


        var para: ADMIN.ADMINGETACTIVITYINFOSREQ = new ADMIN.ADMINGETACTIVITYINFOSREQ();

        var top_hot: ADMIN.ADMINACTIVITYINFO[] = [];
        var bottom_hot: ADMIN.ADMINACTIVITYINFO[] = [];

        ADMIN.adminGetHotGame(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < activityitems.length; i++) {
                activity.removeChild(activityitems[i]);
            }
            activityitems.splice(0);

            for (var i = 0; i < activityitems_bottom.length; i++) {
                activity_bottom.removeChild(activityitems_bottom[i]);
            }
            activityitems_bottom.splice(0);
            var dat: ADMIN.ADMINGETACTIVITYINFORESP = resp.data;


            for (var i = 0; i < dat.data.length; i++) {
                if ((dat.data[i].type).toString() == 'top') {
                    top_hot.push(dat.data[i]);
                } else {
                    bottom_hot.push(dat.data[i]);
                }
            }


            for (var i = 0; i <top_hot.length; i++) {
                var activityInfo: ADMIN.ADMINACTIVITYINFO = top_hot[i];
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




            for (var i = 0; i < bottom_hot.length; i++) {
                var activityInfo_bottom: ADMIN.ADMINACTIVITYINFO = bottom_hot[i];
                var aditem_bottom: HTMLTableRowElement = <any>activityitem_bottom.cloneNode(true);
                aditem_bottom.style.display = "";
                $(aditem_bottom).find("#appname").val(activityInfo_bottom.gamename);
                $(aditem_bottom).find("#createtime").text(new Date(activityInfo_bottom.createtime).toLocaleDateString());
                $(aditem_bottom).find("#img").get(0)["src"] = activityInfo_bottom.img + "?" + Math.random();
                (function (mdata: ADMIN.ADMINACTIVITYINFO, item: HTMLTableRowElement) {
                    $(aditem_bottom).find("#orderby").val(activityInfo_bottom.orderby).change(function () {
                        sortChange(mdata.id, $(this).val());
                    });
                    $(aditem_bottom).find("#get_bottom").click(function () {
                        getImgByGameName(item);
                    });
                    $(aditem_bottom).find("#save_bottom").click(function () {
                        adminSaveActivityAD(mdata.id, item);
                    });
                }).call(this, activityInfo_bottom, aditem_bottom);
                activity_bottom.appendChild(aditem_bottom);
                activityitems_bottom.push(aditem_bottom);
            }
        });
    }



    export function adminSaveActivityAD(id, item) {
        var para: ADMIN.ADMINSAVEACTIVITYINFOREQ = new ADMIN.ADMINSAVEACTIVITYINFOREQ();
        para.id = id;
        para.gamaname = $(item).find("#appname").val();
        para.orderby = $(item).find("#orderby").val();
        para.imgurl = $(item).find("#img").attr("src");
        para.flags = 0;
        ADMIN.adminSaveHotGameInfo(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("成功");
            window.location.reload();
        });
    }


    export function getImgByGameName(item) {//根据游戏名获取广告图
        var para: ADMIN.ADMINGETACTIVITYINFOIMGREQ = new ADMIN.ADMINGETACTIVITYINFOIMGREQ();
        para.gamename = $(item).find("#appname").val();
        ADMIN.adminGethotgameImg(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            $(item).find("#img").get(0)["src"] = resp.data.data + "?" + Math.random();
        });
    }






    export function sortChange(id, sort) {
        var para: ADMIN.ADMINSORTCHANGEREQ = new ADMIN.ADMINSORTCHANGEREQ();
        para.id = id;
        para.sortnum = sort;
        ADMIN.adminSortHotGame(para, resp => {
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
} 