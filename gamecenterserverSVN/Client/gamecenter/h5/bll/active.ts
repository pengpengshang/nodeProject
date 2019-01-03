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
        ACTIVE.loadActiveData();
        //ACTIVE.getTimeWeek();
    });
});
module ACTIVE {
    export function loadActiveData() {
        var activelist: HTMLUListElement = <any>document.getElementById("active_list");
        var activeintem: HTMLLIElement = <any>activelist.firstElementChild;
        var activeitems: HTMLLIElement[] = [];
        activeintem.style.display = "none";
        for (var i = 0; i < activeitems.length; i++) {
            activelist.removeChild(activeitems[i]);
        }
        activeitems.splice(0);
        var mine_userid = GAMECENTER.userinfo.sdkuserid;
        var para: GAMECENTER.GETACTIVEREQ = new GAMECENTER.GETACTIVEREQ();
       
        GAMECENTER.getActiveList(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data: GAMECENTER.GETACTIVEINFO[] = resp.data;
            $("#active_ico_first").attr("src", data[0].headico);
            $("#active_ico_second").attr("src", data[1].headico);
            $("#active_ico_third").attr("src", data[2].headico);
            if (data[0].nickname == '') {
                $("#active_nickname_first").text("未命名");
            } else {
                $("#active_nickname_first").text(data[0].nickname);
            }
            if (data[1].nickname == '') {
                $("#active_nickname_second").text("未命名");
            } else {
                $("#active_nickname_second").text(data[1].nickname);
            }
            if (data[1].nickname == '') {
                $("#active_nickname_third").text("未命名");
            } else {
                $("#active_nickname_third").text(data[2].nickname);
            }
            for (var i = 3; i < data.length; i++) {
                var activeinfo: GAMECENTER.GETACTIVEINFO = data[i];
                var item: HTMLLIElement = <any>activeintem.cloneNode(true);
                $(item).find("#active_head").attr("src", activeinfo.headico);
                $(item).find("#active_mingci").text(i+1);
                
                if (activeinfo.nickname == '') {
                    $(item).find("#active_name").text("未命名");
                } else {
                    $(item).find("#active_name").text(activeinfo.nickname);
                }
                if (i < 6) {
                    $(item).find("#adtive_reward").text((600 - 100 * (i - 0)) + "积分");
                } else {
                    if (i > 5 && i < 10) {
                        $(item).find("#adtive_reward").text((90 - 10 * (i - 6)) + "积分");
                    } else {
                        $(item).find("#adtive_reward").text((50 - 5 * (i - 10)) + "积分");
                    }
                }
                if (activeinfo.userid == mine_userid) {
                    $("#need_up").text("我要冲榜");
                    $("#no_up").text(i + 1);
                }
                item.style.display = "";
                activelist.appendChild(item);
                activeitems.push(item);
            }
            $("#user_headico").attr("src",GAMECENTER.userinfo.headico);
            $("#user_nickname").text(GAMECENTER.userinfo.nickname);

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
        $("#rank_date").text(WeekFirstDay.getFullYear() + "-" + M + "-" + WeekFirstDay.getDate() + "至" + WeekLastDay.getFullYear() + "-" + M + "-" + WeekLastDay.getDate());
    }


    //export function getWeekEndDate() {

    //    var now = new Date(); //当前日期
    //    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    //    var nowDay = now.getDate(); //当前日
    //    var nowMonth = now.getMonth(); //当前月
    //    var nowYear =now.getFullYear(); //当前年
    //    nowYear += (nowYear < 2000) ? 1900 : 0; //

    //    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (3 - nowDayOfWeek));

    //    alert(new Date().toLocaleDateString());
    //    alert(formatDate(weekEndDate));

    //    if (new Date().toLocaleDateString() == formatDate(weekEndDate)) {
    //        alert();
    //    } else {
    //        alert("========");
    //    }

    //}

    //export function formatDate(date) {
    //    var myyear = date.getFullYear();
    //    var mymonth = date.getMonth() + 1;
    //    var myweekday = date.getDate();
    //    if (mymonth < 10) {
    //        mymonth = "0" + mymonth;
    //    }
    //    if (myweekday < 10) {
    //        myweekday = "0" + myweekday;
    //    }
    //    return (myyear + "-" + mymonth + "-" + myweekday);
    //}
}