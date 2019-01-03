$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", () => {
                window.location.href = "login.html";
            });
            return;
        }
        //GAMECENTER.newMessage();
        RECHAGE.loadRechageData(null);
        RECHAGE.getTimeWeek();
    });
});  
module RECHAGE {
    export function loadRechageData(flag) {
        var rechagelist: HTMLUListElement = <any>document.getElementById("rechage_list");
        var rechageitem: HTMLLIElement = <any>rechagelist.firstElementChild;
        var rechageitems: HTMLLIElement[] = [];

        rechageitem.style.display = "none";
        for (var i = 0; i < rechageitems.length; i++) {
            rechagelist.removeChild(rechageitems[i]);
        }
        rechageitems.splice(0);
        var mine_userid = GAMECENTER.userinfo.sdkuserid;
        var para: GAMECENTER.GETRECHAGEREQ = new GAMECENTER.GETRECHAGEREQ();
        para.userid = flag;
        GAMECENTER.getRechageList(para,resp=>{
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            if (flag) {
                $(".show_hide").css("display","none");
            }
            var data: GAMECENTER.GETRECHAGEINFO[] = resp.data;
                    $("#first_ico").attr("src", data[0].headico);
                    if (data[0].nickname == '') {
                        $("#first_nickname").text("未命名");
                    } else {
                        $("#first_nickname").text(data[0].nickname);
                    }
                    if (data[1].nickname == '') {
                        $("#second_nickname").text("未命名");
                    } else {
                        $("#second_nickname").text(data[1].nickname);
                    }
                    if (data[2].nickname == '') {
                        $("#third_nickname").text("未命名");
                    } else {
                        $("#third_nickname").text(data[2].nickname);
                    }
                    $("#second_ico").attr("src", data[1].headico);
                    $("#third_ico").attr("src", data[2].headico);
                    for (var i = 3; i < data.length; i++) {
                            var listinfo: GAMECENTER.GETRECHAGEINFO = data[i];
                            var item: HTMLLIElement = <any>rechageitem.cloneNode(true);
                            $(item).find("#mingci").text(i + 1);
                            $(item).find("#user_ico").attr("src", listinfo.headico);

                            if (listinfo.nickname == '') {
                                $(item).find("#user_nickname").text("未命名");
                            } else {
                                $(item).find("#user_nickname").text(listinfo.nickname);
                            }
                            //$(item).find("#person_paysum").text(listinfo.paysum + "元");
                            if (i > 9) {
                                $(item).find("#delete_cash").css("display", "none");
                                $(item).find("#rechge_point").text((100 - 10 * (i - 10)) + "积分");
                            } else {
                                $(item).find("#rechge_point").text((2000 - 200 * (i - 0)) + "积分");
                                $(item).find("#rechge_cash").text((100-10*(i-0)) + "元");
                            }

                            if (data[i].userid == mine_userid) {
                                $("#get_mine_rechage").text("我要冲榜");
                                $("#mine_up").text(i + 1);
                            }
                            item.style.display = '';
                            rechagelist.appendChild(item);
                            rechageitems.push(item);
                    }
                    $("#mine_headico").attr("src", GAMECENTER.userinfo.headico);
                    $("#mine_nickname").text(GAMECENTER.userinfo.nickname);
        })
    }

    /***************************获取当前周的时间段*********************************/
    export function getTimeWeek() {
        var Nowdate = <any>new Date();
        var WeekFirstDay = <any>new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
        var M = Number(WeekFirstDay.getMonth()) + 1
        var Nowdate = <any>new Date();
        var WeekFirstDay = <any>new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
        var WeekLastDay = <any>new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);
        M = Number(WeekLastDay.getMonth()) + 1
        $("#rank_date").text(WeekFirstDay.getFullYear() + "-" + M + "-" + (WeekFirstDay.getDate()-2) + "至" + WeekLastDay.getFullYear() + "-" + M + "-" + (WeekLastDay.getDate()-2));
    }
}