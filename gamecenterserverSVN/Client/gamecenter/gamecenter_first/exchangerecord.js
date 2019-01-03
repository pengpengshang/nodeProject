///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    GAMECENTER.UserAutoLogin(function (userinfo) {
        gcexchangerecord.LoadData();
    });
});
var gcexchangerecord;
(function (gcexchangerecord) {
    var recordlist;
    var recorditem;
    var recorditems = [];
    function LoadData() {
        if (!GAMECENTER.userinfo) {
            window.location.href = "login.shtml";
            return;
        }
        recordlist = document.getElementById("recordlist");
        recorditem = document.getElementById("recorditem");
        recorditem.style.display = "none";
        GAMECENTER.gsUserGetExchangeRecord({ mysession: GAMECENTER.userinfo.session }, function (resp) {
            if (resp.errno) {
                alert(resp.message);
                history.back();
                return;
            }
            for (var i = 0; i < recorditems.length; i++) {
                recordlist.removeChild(recorditems[i]);
            }
            recorditems.splice(0);
            var data = resp.data;
            if (data.data.length > 0) {
                $("#norecord").hide();
            }
            for (var i = 0; i < data.data.length; i++) {
                var dat = data.data[i];
                var item = recorditem.cloneNode(true);
                item.style.display = "";
                $(item).find("#goodsname").text(dat.goodsname);
                $(item).find("#time").text(new Date(dat.createtime).toLocaleString());
                $(item).find("#message").text(dat.message);
                if (dat.state == 0) {
                    $(item).find("#state").text("已兑换");
                }
                else if (dat.state == 1) {
                    $(item).find("#state").text("兑换成功");
                }
                recordlist.appendChild(item);
                recorditems.push(item);
            }
        });
    }
    gcexchangerecord.LoadData = LoadData;
})(gcexchangerecord || (gcexchangerecord = {}));
//# sourceMappingURL=exchangerecord.js.map