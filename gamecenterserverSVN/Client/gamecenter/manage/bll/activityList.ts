$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        ACTIVITY.loadActivity(null, null);
        ACTIVITY.loadGameList_new();
    });
});
module ACTIVITY {
    var activity_title: HTMLInputElement = <any>document.getElementById("activity_title");
    var activity_typename: HTMLInputElement = <any>document.getElementById("activity_typename");
    var activity_createtime: HTMLInputElement = <any>document.getElementById("activity_createtime");
    var activity_starttime: HTMLInputElement = <any>document.getElementById("activity_starttime");
    var sctivity_endtime: HTMLInputElement = <any>document.getElementById("sctivity_endtime");
    var activity_count: HTMLInputElement = <any>document.getElementById("activity_count");
    var sctivity_detail: HTMLInputElement = <any>document.getElementById("sctivity_detail");

    var add_typename: HTMLSelectElement = <any>document.getElementById("add_typename");
    var pingtai: HTMLSelectElement = <any>document.getElementById("pingtai");


    var activitytable: HTMLTableElement;
    var activityitem: HTMLTableRowElement;
    var activityitems: HTMLTableRowElement[] = [];


    var detailtable: HTMLTableElement;
    var detailitem: HTMLTableRowElement;
    var detailitems: HTMLTableRowElement[] = [];


    var detailtable2: HTMLTableElement;
    var detailitem2: HTMLTableRowElement;
    var detailitems2: HTMLTableRowElement[] = [];

    var adimg: HTMLImageElement;            //广告图片
    var adfile: HTMLInputElement;
    adimg = <any>document.getElementById("game_advert_img"); 
    adfile = <any>document.getElementById("adfile");



    export function loadActivity(time, title) {
        activitytable = <any>document.getElementById("activityitems");
        activityitem = <any>document.getElementById("activityitem");
        activityitem.style.display = "none";

        var para: ADMIN.ADMINGETALLACTIVITYREQ = new ADMIN.ADMINGETALLACTIVITYREQ();
        para.time = time;
        para.title = title;

        ADMIN.adminGetAllActivity(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < activityitems.length; i++) {
                activitytable.removeChild(activityitems[i]);
            }
            activityitems.splice(0);
            var dat: ADMIN.ADMINGETALLACTIVITYRESP = resp.data;
            var data = dat.activitylist;
            for (var i = 0; i < data.length; i++) {
                var activityinfo: ADMIN.ADMINGETALLACTIVITYINFO = data[i];
                var item: HTMLTableRowElement = <any>activityitem.cloneNode(true);
                item.style.display = "";
               
                $(item).find("#activity_title_input").val(activityinfo.title);
                $(item).find("#activity_title").text(activityinfo.title);
                $(item).find("#activity_typename").text(activityinfo.appname);
                $(item).find("#activity_createtime").text(new Date(activityinfo.createtime).toLocaleDateString());
                $(item).find("#activity_count").text(activityinfo.count);
                $(item).find("#activity_starttime").text(new Date(activityinfo.starttime).toLocaleDateString());
                $(item).find("#sctivity_endtime").text(new Date(activityinfo.endtime).toLocaleDateString());
                activitytable.appendChild(item);
                activityitems.push(item);
               (function (mdata: ADMIN.ADMINGETALLACTIVITYINFO) {
                   $(item).find("#activity_title").click(ev => {
                        window.location.href = "editActivity.html?acid="+mdata.id;
                    });

                    
                    $("#del").click(ev => {
                        var para: ADMIN.ADMINGETCHECKACTIVITYREQ = new ADMIN.ADMINGETCHECKACTIVITYREQ();
                        var activityname = PUTILS_NEW.getCheckValues(document.getElementById('activityitems'));
                        para.title = activityname;

                        ADMIN.adminGetCheckActivityList(para, resp => {
                            if (resp.errno != 0) {
                                alert(resp.message);
                                return;
                            }
                            var data: ADMIN.ADMINDELACTIVITY[] = resp.data;
                            ADMIN.admindelActivity(data, resp => {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                console.log("成功");
                                window.location.reload();
                            });
                        })
                    });

                })(activityinfo);
            }
        });
    }
    export function addActivity() {
        var list_game = $("#gamelist option:selected");
        var para: ADMIN.ADMINADDACTIVITYREQ = new ADMIN.ADMINADDACTIVITYREQ();


        var files: any = [];
        
        if (adfile.files.length > 0) {
            files[0] = adfile.files[0];
        }
        

        para.appname = list_game.text();
        para.typename = add_typename.value;
        console.log(para.typename);
        para.title = $("#add_activity_name").val();
        para.starttime = $("#recDate").val();
        if ($("#add_activity_hot").val() == "是") {
            para.ishot = 1;
        } else {
            para.ishot = 0;
        }

        para.atype = $("#banner_show").val();

        para.endtime = $("#recDate2").val();
        para.prise = $("#add_activity_reword").val();
        para.rule = $("#add_activity_rule").val();
        para.server = $("#add_activity_server").val();
        para.detail = $("#fuck_img").html();
        ADMIN.adminAddActivity(para, files, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功！");
            window.location.reload();
        });
    }




    export function loadDetail(time,title) {
        detailtable = <any>document.getElementById("detailitems");
        detailitem = <any>document.getElementById("detailitem");
        detailtable2 = <any>document.getElementById("other_detailitems");
        detailitem2 = <any>document.getElementById("other_detailitem");
        detailitem.style.display = "none";
        detailitem2.style.display = "none";
        var para: ADMIN.ADMINGETALLACTIVITYREQ = new ADMIN.ADMINGETALLACTIVITYREQ();
        para.time = time;
        para.title = title;
        
        ADMIN.adminGetAllActivityDetail(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < detailitems.length; i++) {
                detailtable.removeChild(detailitems[i]);
            }
            detailitems.splice(0);
            for (var i = 0; i < detailitems2.length; i++) {
                detailtable2.removeChild(detailitems2[i]);
            }
            detailitems2.splice(0);
            var dat: ADMIN.ADMINGETALLACTIVITYRDETAILESP = resp.data;
            var data = dat.detaillist;
            for (var i = 0; i < data.length; i++) {
                var detailinfo: ADMIN.ADMINGETALLACTIVITYDETAILINFO = data[i];
                var item: HTMLTableRowElement = <any>detailitem.cloneNode(true);
                var item2: HTMLTableRowElement = <any>detailitem2.cloneNode(true);
                item.style.display = "";
                item2.style.display = "";
               // alert(detailinfo.atype);
                if (detailinfo.atype == "3") {
                    $(item).find("#user_name").text(detailinfo.loginid);
                    $(item).find("#gamename").text(detailinfo.appname);
                    $(item).find("#area_name").text(detailinfo.areaname);
                    $(item).find("#role_name").text(detailinfo.playname);
                    if (detailinfo.paymoney == null || detailinfo.paymoney == '') {
                        $(item).find("#money").text('0');
                    } else {
                        $(item).find("#money").text(detailinfo.paymoney);
                    }
                    
                    $(item).find("#user_time").text(new Date(detailinfo.createtime).toLocaleDateString());
                    detailtable.appendChild(item);
                    detailitems.push(item);
                } else {
                    $(item2).find("#other_user_name").text(detailinfo.loginid);
                    $(item2).find("#other_area_name").text(detailinfo.areaname);
                    $(item2).find("#other_role_name").text(detailinfo.playname);
                    $(item2).find("#other_user_time").text(new Date(detailinfo.createtime).toLocaleDateString());
                    detailtable2.appendChild(item2);
                    detailitems2.push(item2);
                }
                
            }
        });
    }

    export function loadDetail2(time, title) {
        detailtable2 = <any>document.getElementById("other_detailitems");
        detailitem2 = <any>document.getElementById("other_detailitem");
        detailitem2.style.display = "none";
        var para: ADMIN.ADMINGETALLACTIVITYREQ = new ADMIN.ADMINGETALLACTIVITYREQ();
        para.time = time;
        para.title = title;

        ADMIN.adminGetAllActivityDetail2(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < detailitems2.length; i++) {
                detailtable2.removeChild(detailitems2[i]);
            }
            detailitems2.splice(0);
            var dat: ADMIN.ADMINGETALLACTIVITYRDETAILESP = resp.data;
            var data = dat.detaillist;
            for (var i = 0; i < data.length; i++) {
                var detailinfo: ADMIN.ADMINGETALLACTIVITYDETAILINFO = data[i];
                var item2: HTMLTableRowElement = <any>detailitem2.cloneNode(true);
                item2.style.display = "";
               
                $(item2).find("#other_user_name").text(detailinfo.loginid);
                $(item2).find("#other_gamename").text(detailinfo.appname);
                    $(item2).find("#other_area_name").text(detailinfo.areaname);
                    $(item2).find("#other_role_name").text(detailinfo.playname);
                    $(item2).find("#other_user_time").text(new Date(detailinfo.createtime).toLocaleDateString());
                    detailtable2.appendChild(item2);
                    detailitems2.push(item2);
                

            }
        });
    }

    export function loadGameList_new() {//加载游戏列表
        var selh5game: HTMLSelectElement = <any>document.getElementById("gamelist");
        GAMECENTER.gsUserGetH5AppList({ id: null }, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat: GAMECENTER.GSUSERGETH5APPLISTRESP = resp.data;
            var h5applist: GAMECENTER.H5APPINFO[] = dat.applist;
            for (var i = 0; i < h5applist.length; i++) {
                var opt: HTMLOptionElement = document.createElement("option");
                opt.innerText = h5applist[i].name;
                opt.value = h5applist[i].id.toString();
                selh5game.add(opt, i);
            }
        });
    }


}  