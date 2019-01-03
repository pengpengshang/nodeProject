///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    GAMECENTER.UserAutoLogin(function (userinfo) {
        gceditpassword.LoadData();
    });
});
var gceditpassword;
(function (gceditpassword) {
    function LoadData() {
        if (!GAMECENTER.userinfo) {
            window.location.href = "login.shtml";
            return;
        }
    }
    gceditpassword.LoadData = LoadData;
    function onOK() {
        var para = new GAMECENTER.GSUSERCHANGEPWDREQ();
        //		para.oldpwd = $("#pwdold").val();
        var pwd1 = $("#pwdold").val();
        var pwd2 = $("#pwdnew").val();
        para.newpwd = $("#pwdnew").val();
        if (!pwd1) {
            alert("请输入新密码！");
            $("#pwdold").focus();
            return;
        }
        if (!pwd2) {
            alert("请再次输入密码！");
            $("#pwdnew").focus();
            return;
        }
        if (pwd1 != pwd2) {
            alert("两次输入密码不一致！");
            return;
        }
        //		para.oldpwd = MD5UTIL.hex_md5(para.oldpwd);
        para.newpwd = MD5UTIL.hex_md5(para.newpwd);
        para.mysession = GAMECENTER.userinfo.session;
        GAMECENTER.gsUserChangePwd(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("修改成功！");
            history.back();
        });
    }
    gceditpassword.onOK = onOK;
})(gceditpassword || (gceditpassword = {}));
//# sourceMappingURL=editpassword.js.map