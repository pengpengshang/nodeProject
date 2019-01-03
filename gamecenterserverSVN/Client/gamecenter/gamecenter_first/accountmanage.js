///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    GAMECENTER.UserAutoLogin(function (userinfo) {
        gcaccountmanage.LoadData();
    });
});
var gcaccountmanage;
(function (gcaccountmanage) {
    var tabaccount;
    var accountitem;
    var accountitems = [];
    function LoadData() {
        tabaccount = document.getElementById("tabaccount");
        accountitem = document.getElementById("accountitem");
        accountitem.style.display = "none";
        GAMECENTER.LoadHistoryUsers();
        if (!GAMECENTER.historyUsers)
            return;
        for (var i = 0; i < accountitems.length; i++) {
            tabaccount.removeChild(accountitems[i]);
        }
        accountitems.splice(0);
        for (var i = GAMECENTER.historyUsers.length - 1; i >= 0; i--) {
            var usr = GAMECENTER.historyUsers[i];
            var item = accountitem.cloneNode(true);
            item.querySelector("#accountid").textContent = usr.nickname;
            item.querySelector("#accountid").textContent = usr.nickname;
            if (!GAMECENTER.userinfo || usr.userid != GAMECENTER.userinfo.userid) {
                $(item).find("#checkimg").hide();
            }
            item.querySelector("#imghead")["src"] = usr.headico;
            (function (usr) {
                item.onclick = function (ev) {
                    GAMECENTER.userinfo = new GAMECENTER.GSUSERINFO();
                    GAMECENTER.userinfo.userid = usr.userid;
                    GAMECENTER.userinfo.session = usr.session;
                    GAMECENTER.UserAutoLogin(function (userinfo) {
                        if (!userinfo) {
                            alert("用户信息改变，需重新登录！");
                            window.location.href = "login.shtml";
                        }
                        else {
                            history.back();
                        }
                    });
                };
            })(usr);
            item.style.display = "";
            accountitems.push(item);
            tabaccount.insertBefore(item, tabaccount.lastChild);
        }
    }
    gcaccountmanage.LoadData = LoadData;
    function onLogout() {
        GAMECENTER.userinfo = null;
        GAMECENTER.SaveUserInfo();
        window.location.href = "login.shtml";
    }
    gcaccountmanage.onLogout = onLogout;
})(gcaccountmanage || (gcaccountmanage = {}));
//# sourceMappingURL=accountmanage.js.map