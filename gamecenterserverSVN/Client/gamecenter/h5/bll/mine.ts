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
        MINE_SECOND.loadDefaultData(userinfo);
    });
}); 
module MINE_SECOND {
    export function loadDefaultData(userinfo) {
        getPersoninfo(userinfo);
        //GAMECENTER.newMessage();
    }
    export function getPersoninfo( userinfo: GAMECENTER.GSUSERINFO) {
        $("#my_headico").attr("src", userinfo.headico);
        $("#my_nickname").text(userinfo.nickname);
        $("#my_userid").text(userinfo.sdkuserid);
    }


}