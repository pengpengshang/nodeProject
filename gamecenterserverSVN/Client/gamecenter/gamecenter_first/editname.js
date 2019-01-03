///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    GAMECENTER.UserAutoLogin(function (userinfo) {
        gceditname.LoadData();
    });
});
var gceditname;
(function (gceditname) {
    var goods;
    function LoadData() {
        if (!GAMECENTER.userinfo) {
            window.location.href = "login.shtml";
            return;
        }
        $("#nickname").val(GAMECENTER.userinfo.nickname);
    }
    gceditname.LoadData = LoadData;
    function onOK() {
        var para = new GAMECENTER.GSUSERSETNICKNAMEREQ();
        para.mysession = GAMECENTER.userinfo.session;
        para.nickname = $("#nickname").val();
        if (!para.nickname) {
            alert("请输入昵称！");
            return;
        }
        GAMECENTER.gsUserSetNickName(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            history.back();
        });
    }
    gceditname.onOK = onOK;
})(gceditname || (gceditname = {}));
//# sourceMappingURL=editname.js.map