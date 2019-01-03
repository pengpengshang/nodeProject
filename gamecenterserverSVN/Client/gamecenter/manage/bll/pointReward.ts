$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        POINTREWARD.loadRechageRobot();
    });
}); 
module POINTREWARD {

    var nick : HTMLInputElement =<any> document.getElementById("#user_nick");
    var headico : HTMLInputElement =<any> document.getElementById("#user_head");
    var pay : HTMLInputElement =<any> document.getElementById("#user_pay");

    export function loadRechage() {
        var para: ADMIN.ACTIVITYINFO = new ADMIN.ACTIVITYINFO();
        ADMIN.getRechageReward(para, resp => {
            if (resp.errno != 0) {
               alert(resp.message);
                return;
            }
        })
    }


    export function loadPoint() {
        var para: ADMIN.ACTIVITYINFO = new ADMIN.ACTIVITYINFO();
        ADMIN.getPointReward(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }          
        })
    }


    var rechagelist: HTMLTableElement = <any>document.getElementById("activityitems");
    var rechageitem: HTMLTableRowElement = <any>document.getElementById("activityitem");
    var rechageitems : HTMLTableRowElement[] = []
    export function loadRechageRobot() {
        rechageitem.style.display = "none";
        for (var i = 0; i < rechageitems.length; i++) {
            rechagelist.removeChild(rechageitems[i]);
        }
        rechageitems.splice(0);
        var para: ADMIN.ACTIVITYINFO = new ADMIN.ACTIVITYINFO();
        ADMIN.getRechagerobot(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data: ADMIN.RECHAGEROBOTINFO[] = resp.data;
            for (var i = 0; i < data.length; i++) {
                var item: HTMLTableRowElement = <any>rechageitem.cloneNode(true);
                var rechageinfo: ADMIN.RECHAGEROBOTINFO = data[i];
                $(item).find("#user_nick").val(rechageinfo.nickname);
                $(item).find("#user_nick").addClass(""+rechageinfo.id+"");
                $(item).find("#user_pay").val(rechageinfo.paysum);
                $(item).find("#user_pay").addClass("pay" + "" + rechageinfo.id +"");
                $(item).find("#user_head").val(rechageinfo.headico);
                $(item).find("#user_head").addClass("head"+""+rechageinfo.id+"");
                $(item).find("#user_id").val(rechageinfo.userid);


                (function fun(data: ADMIN.RECHAGEROBOTINFO) {
                    $(item).find("#user_save").click(ev => {
                        saveRechageRobot(data.id);
                    })
                })(rechageinfo)


                item.style.display = '';
                rechagelist.appendChild(item);
                rechageitems.push(item);
            }

        })
    }

    export function saveRechageRobot(id) {
        var para: ADMIN.RECHAGEROBOTREQ = new ADMIN.RECHAGEROBOTREQ();
        para.id = id;
        para.nickname = $("." +id +"").val();
        para.headico = $(".head" + id + "").val();
        para.paysum = $(".pay" + id + "").val();
        ADMIN.saveRechageRobot(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功！");
        })
    }

}