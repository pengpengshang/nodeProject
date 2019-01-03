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
        VIPSERVICE.initVIPQQ();
    });
});




module VIPSERVICE {
    export function initVIPQQ() {//加载VIPQQ列表
        GAMECENTER.gsGetVipQQ({ userid: utils.getCookie("GSUSERINFO").sdkuserid }, (resp) => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var vipqqInfos: GAMECENTER.GSVIPQQINFO[] = resp.data;
            $("#service1").attr("href", "tencent://AddContact/?fromId=50&fromSubId=1&subcmd=all&uin=" + vipqqInfos[0].qqnum);
            $("#service2").attr("href", "tencent://AddContact/?fromId=50&fromSubId=1&subcmd=all&uin=" + vipqqInfos[1].qqnum);
            $("#service3").attr("href", "tencent://AddContact/?fromId=50&fromSubId=1&subcmd=all&uin=" + vipqqInfos[2].qqnum)
        });
    }


    export function upProblem() {
        var para: GAMECENTER.UPPROBLEMREQ = new GAMECENTER.UPPROBLEMREQ();
        para.userid = GAMECENTER.userinfo.sdkuserid;
        para.title = $("#problem_select").val();
        para.detail = $("#problem").val();
        GAMECENTER.upProblem(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            $(".download_app_down").hide();
            utils.dialogBox("问题已提交...");
        })
    }


}









