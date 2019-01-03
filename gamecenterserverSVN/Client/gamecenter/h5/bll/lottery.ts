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
        LOTTERY.listlottery();
    });
});
module LOTTERY {
    export function listlottery() {
        var para: GAMECENTER.GETLOTTERYLISTREQ = new GAMECENTER.GETLOTTERYLISTREQ();
        para.userid = GAMECENTER.userinfo.sdkuserid;
        GAMECENTER.getLotteryList(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var info: GAMECENTER.LOTTERYINFO[] = resp.data;
            $("#my_point").text(info[0].point );
            if (info[0].point < 10) {
                sessionStorage.setItem("point", "over");
            } else {
                sessionStorage.setItem("point", "full");
            }
        })
    }

    export function createLottery() {
        var para: GAMECENTER.GETLOTTERYLISTREQ = new GAMECENTER.GETLOTTERYLISTREQ();
        para.userid = GAMECENTER.userinfo.sdkuserid;
        para.mysession = GAMECENTER.userinfo.session;
        GAMECENTER.createLottery(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            if (resp.errno == 2) {
                sessionStorage.setItem("point", "over");
                return;
            } else {
                $("#my_point").text(parseInt($("#my_point").text()) - 10);
            }
           
        })
    }

    export function addtolist(flag) {
        var para: GAMECENTER.GETLOTTERYLISTREQ = new GAMECENTER.GETLOTTERYLISTREQ();
        para.flag = flag;
        para.userid = GAMECENTER.userinfo.sdkuserid;
        GAMECENTER.addLotteryList(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            if (flag == "10积分") {
                $("#my_point").text(parseInt($("#my_point").text()) + 10);
            }
            if (flag == "50积分") {
                $("#my_point").text(parseInt($("#my_point").text()) + 50);
            }
            if (flag == "100积分") {
                $("#my_point").text(parseInt($("#my_point").text()) + 100);
            }
        })
    }

}