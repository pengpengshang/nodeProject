///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        adminexchangeedit.LoadData();
    });
});
var adminexchangeedit;
(function (adminexchangeedit) {
    var data;
    function LoadData() {
        data = JSON.parse(sessionStorage["EXCHANGERECORD"]);
        if (data) {
            $("#exchangeid").text(data.id);
            $("#createtime").text(new Date(data.createtime).toLocaleString());
            $("#userid").text(data.userid);
            $("#addressee").text(data.addressee);
            $("#addrphone").text(data.addrphone);
            $("#address").text(data.address + " " + data.addressdetail);
            $("#zipcode").text(data.zipcode);
            document.getElementById("state0").checked = data.state == 0;
            document.getElementById("state1").checked = data.state == 1;
            $("#message").text(data.message);
        }
        else {
            history.back();
        }
    }
    adminexchangeedit.LoadData = LoadData;
    function onSave() {
        var para = new ADMIN.ADMINSAVEEXCHANGERECORDREQ();
        para.id = data.id;
        para.state = document.getElementById("state0").checked ? 0 : 1;
        para.message = $("#message").text();
        ADMIN.adminSaveExchangeRecord(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功！");
            history.back();
        });
    }
    adminexchangeedit.onSave = onSave;
})(adminexchangeedit || (adminexchangeedit = {}));
//# sourceMappingURL=exchangeedit.js.map