$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", function () {
                window.location.href = "login.html";
            });
            return;
        }
        //GAMECENTER.newMessage();
        ACTIVE.loadActiveData();
        //ACTIVE.getTimeWeek();
    });
});
var ACTIVE;
(function (ACTIVE) {
    function loadActiveData() {
        var activelist = document.getElementById("active_list");
        var activeintem = activelist.firstElementChild;
        var activeitems = [];
        activeintem.style.display = "none";
        for (var i = 0; i < activeitems.length; i++) {
            activelist.removeChild(activeitems[i]);
        }
        activeitems.splice(0);
        var mine_userid = GAMECENTER.userinfo.sdkuserid;
        var para = new GAMECENTER.GETACTIVEREQ();
        GAMECENTER.getActiveList(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data = resp.data;
            $("#active_ico_first").attr("src", data[0].headico);
            $("#active_ico_second").attr("src", data[1].headico);
            $("#active_ico_third").attr("src", data[2].headico);
            if (data[0].nickname == '') {
                $("#active_nickname_first").text("未命名");
            }
            else {
                $("#active_nickname_first").text(data[0].nickname);
            }
            if (data[1].nickname == '') {
                $("#active_nickname_second").text("未命名");
            }
            else {
                $("#active_nickname_second").text(data[1].nickname);
            }
            if (data[1].nickname == '') {
                $("#active_nickname_third").text("未命名");
            }
            else {
                $("#active_nickname_third").text(data[2].nickname);
            }
            for (var i = 3; i < data.length; i++) {
                var activeinfo = data[i];
                var item = activeintem.cloneNode(true);
                $(item).find("#active_head").attr("src", activeinfo.headico);
                $(item).find("#active_mingci").text(i + 1);
                if (activeinfo.nickname == '') {
                    $(item).find("#active_name").text("未命名");
                }
                else {
                    $(item).find("#active_name").text(activeinfo.nickname);
                }
                if (i < 6) {
                    $(item).find("#adtive_reward").text((600 - 100 * (i - 0)) + "积分");
                }
                else {
                    if (i > 5 && i < 10) {
                        $(item).find("#adtive_reward").text((90 - 10 * (i - 6)) + "积分");
                    }
                    else {
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
            $("#user_headico").attr("src", GAMECENTER.userinfo.headico);
            $("#user_nickname").text(GAMECENTER.userinfo.nickname);
        });
    }
    ACTIVE.loadActiveData = loadActiveData;
    /***************************获取当前周的时间段*********************************/
    function getTimeWeek() {
        var Nowdate = new Date();
        var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
        var M = Number(WeekFirstDay.getMonth()) + 1;
        var Nowdate = new Date();
        var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
        var WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);
        M = Number(WeekLastDay.getMonth()) + 1;
        $("#rank_date").text(WeekFirstDay.getFullYear() + "-" + M + "-" + WeekFirstDay.getDate() + "至" + WeekLastDay.getFullYear() + "-" + M + "-" + WeekLastDay.getDate());
    }
    ACTIVE.getTimeWeek = getTimeWeek;
})(ACTIVE || (ACTIVE = {}));
//# sourceMappingURL=active.js.map