$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        EDITACTIVITY.editActivity();
    });
});
module EDITACTIVITY {
    var data: ADMIN.ADMINGETALLACTIVITYINFO;
    var add_activity_name: HTMLInputElement = <any>document.getElementById("add_activity_name");
    var add_typename: HTMLSelectElement = <any>document.getElementById("add_typename");

    //var banner_show: HTMLSelectElement = <any>document.getElementById("banner_show");

    var recDate: HTMLInputElement = <any>document.getElementById("recDate");
    var recDate2: HTMLInputElement = <any>document.getElementById("recDate2");
    var add_activity_reword: HTMLInputElement = <any>document.getElementById("add_activity_reword");
    var add_activity_rule: HTMLInputElement = <any>document.getElementById("add_activity_rule");
    var add_activity_server: HTMLInputElement = <any>document.getElementById("add_activity_server");
    var add_activity_detail: HTMLInputElement = <any>document.getElementById("customized-buttonpane");
    var pingtai: HTMLSelectElement = <any>document.getElementById("pingtai");
    var adimg: HTMLImageElement;            //广告图片
    var adfile: HTMLInputElement;
    adimg = <any>document.getElementById("game_advert_img");
    adfile = <any>document.getElementById("adfile");


    export function editActivity() {
        var para: ADMIN.ADMINGETALLACTIVITYREQ = new ADMIN.ADMINGETALLACTIVITYREQ();
        para.activityid = getQueryString("acid");
        ADMIN.adminGetOneActivity(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data: ADMIN.ADMINGETALLACTIVITYINFO[] = resp.data;
            for (var i = 0; i < data.length; i++) {
                var editinfo: ADMIN.ADMINGETALLACTIVITYINFO = data[i];
                $("#gamelist").val(editinfo.appname);
                utils.optionSelect(add_typename, editinfo.lable);
                
                if (editinfo.ishot == 1) {
                    $("#add_activity_hot").val("是");
                } else {
                    $("#add_activity_hot").val("否");
                }
                $("#add_activity_name").val(editinfo.title);
                $("#recDate").val(new Date(editinfo.starttime).toLocaleDateString());
                $("#recDate2").val(new Date(editinfo.endtime).toLocaleDateString());
                $("#add_activity_reword").val(editinfo.prise);
                $("#add_activity_rule").val(editinfo.rule);
                $("#add_activity_server").val(editinfo.server);
                $("#fuck_img").html(editinfo.detail);
                $("#game_advert_img").attr("src",editinfo.banner);
            }
        })
    }



    export function saveEditActivity() {
        var para: ADMIN.ADMINADDACTIVITYREQ = new ADMIN.ADMINADDACTIVITYREQ();


        var files: any = [];

        if (adfile.files.length > 0) {
            files[0] = adfile.files[0];
        }


        para.appname = $("#gamelist").val();
        para.atype = $("#banner_show").val();
        para.title = $("#add_activity_name").val();
        para.starttime = $("#recDate").val();
        para.typename = add_typename.value;
        para.endtime = $("#recDate2").val();
        para.prise = $("#add_activity_reword").val();
        para.rule = $("#add_activity_rule").val();
        if ($("#add_activity_hot").val() == "是") {
            para.ishot = 1;
        } else {
            para.ishot = 0;
        }
        para.server = $("#add_activity_server").val();
        para.detail = $("#add_activity_server").val();
        para.detail = $("#fuck_img").html();
        para.id =parseInt(getQueryString("acid"));
        ADMIN.adminAddActivity(para, files, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功");
            console.log("修改成功");
            history.back();
        });
    }


}  