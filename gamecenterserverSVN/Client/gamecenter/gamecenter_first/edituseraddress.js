///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    GAMECENTER.UserAutoLogin(function (userinfo) {
        gcedituseraddress.LoadData();
    });
});
var gcedituseraddress;
(function (gcedituseraddress) {
    function LoadData() {
        if (!GAMECENTER.userinfo) {
            window.location.href = "login.shtml";
            return;
        }
        if (GAMECENTER.userinfo.address)
            $("#address").text(GAMECENTER.userinfo.address);
        $("#addressee").val(GAMECENTER.userinfo.addressee);
        $("#addressdetail").val(GAMECENTER.userinfo.addressdetail);
        $("#addrphone").val(GAMECENTER.userinfo.addrphone);
        $("#zipcode").val(GAMECENTER.userinfo.zipcode);
    }
    gcedituseraddress.LoadData = LoadData;
    function onOK() {
        var para = new GAMECENTER.GSUSERSETADDRREQ();
        para.mysession = GAMECENTER.userinfo.session;
        para.addressee = $("#addressee").val();
        para.address = $("#address").text();
        if (para.address.split(" ").length < 2)
            para.address = "";
        para.addressdetail = $("#addressdetail").val();
        para.addrphone = $("#addrphone").val();
        para.zipcode = $("#zipcode").val();
        if (!para.addressee) {
            alert("请输入收货人");
            $("#addressee").focus();
            return;
        }
        if (!para.addrphone) {
            alert("请输入联系电话");
            $("#addrphone").focus();
            return;
        }
        if (!para.address) {
            alert("请选择所在地区");
            $("#address").click();
            return;
        }
        if (!para.addressdetail) {
            alert("请输入详细地址");
            $("#addressdetail").focus();
            return;
        }
        GAMECENTER.gsUserSetAddr(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("修改成功！");
            history.back();
        });
    }
    gcedituseraddress.onOK = onOK;
    function onSelCity() {
        SDKUTIL.ShowIFrame("seladdress.shtml?addr=" + encodeURIComponent($("#address").text()), false, function (ev, divbgpage, iframe) {
            window.addEventListener("message", function onmsg(ev) {
                switch (ev.data.cmd) {
                    case "seladdress":
                        {
                            var address = ev.data.data.prov + " " + ev.data.data.city + " " + ev.data.data.area;
                            $("#address").text(address);
                            SDKUTIL.RemoveIFrame(divbgpage, iframe);
                            window.removeEventListener("message", onmsg);
                            break;
                        }
                }
            }, false);
        });
    }
    gcedituseraddress.onSelCity = onSelCity;
})(gcedituseraddress || (gcedituseraddress = {}));
//# sourceMappingURL=edituseraddress.js.map