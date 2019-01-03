///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
window.onload = function (ev) {
    GAMECENTER.UserAutoLogin(function (userinfo) {
        gcchipin.LoadData();
    });
};
var gcchipin;
(function (gcchipin) {
    var appdata;
    function LoadData() {
        if (!GAMECENTER.userinfo) {
            setTimeout(function () {
                gcglobal.ShowQuickReg();
                //window.location.href = "login.shtml";
            }, 20);
        }
        var id = utils.getQueryString("id");
        if (!id) {
            history.back();
            return;
        }
        GAMECENTER.gsUserGetPkAppList({ id: parseInt(id) }, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            if (dat.applist.length == 0) {
                alert("游戏不存在！");
                return;
            }
            appdata = dat.applist[0];
            $("#appico").get(0)["src"] = appdata.ico;
            $("#appname").text(appdata.name);
            $("#entrancegold").text(appdata.entrancegold);
            $("#wingold").text(appdata.wingold);
            $("#gamebg").get(0)["src"] = appdata.bg;
            var betcount = document.getElementById("betcount");
            $(betcount).find("*").remove();
            var bcount = "-" + appdata.entrancegold;
            var width = 71 * bcount.length;
            var startx = betcount.clientWidth / 2 - width / 2;
            for (var i = 0; i < bcount.length; i++) {
                function fun(i) {
                    utils.CreateNumberImg("style/pk/1下注页切图/押注数额.png", bcount.substr(i, 1), true, function (img, offsetx, offsety) {
                        img.style.left = startx + (i * 71 - offsetx) + "px";
                        img.style.top = 0 + offsety + "px";
                        betcount.appendChild(img);
                    });
                }
                fun(i);
            }
        });
        if (GAMECENTER.userinfo)
            $("#mygoldremain").text(GAMECENTER.userinfo.gold);
    }
    gcchipin.LoadData = LoadData;
    function onOK() {
        window.location.href = "matching.shtml?para=" + encodeURI(JSON.stringify(appdata));
    }
    gcchipin.onOK = onOK;
    function onCancel() {
        history.back();
    }
    gcchipin.onCancel = onCancel;
})(gcchipin || (gcchipin = {}));
//# sourceMappingURL=chipin.js.map