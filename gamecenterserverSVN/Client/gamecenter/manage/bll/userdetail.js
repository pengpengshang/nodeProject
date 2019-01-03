$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        adminuserdetail_new.LoadData();
    });
});
var adminuserdetail_new;
(function (adminuserdetail_new) {
    var selsdktype;
    var datatable;
    var dataheader;
    var dataitem;
    var userid;
    var is5wanuser;
    function LoadData() {
        datatable = document.getElementById("datatable");
        dataheader = document.getElementById("dataheader");
        dataitem = document.getElementById("dataitem");
        dataitem.style.display = "none";
        userid = getQueryString("userid");
        is5wanuser = getQueryString("is5wanuser") == "1";
        if (!userid) {
            history.back();
            return;
        }
        search();
    }
    adminuserdetail_new.LoadData = LoadData;
    //详单
    function search() {
        var para = new ADMIN.ADMINGETUSERDETAILREQ();
        para.userid = userid;
        para.is5wanuser = is5wanuser;
        ADMIN.adminGetUserDetail(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            while (datatable.childElementCount > 1)
                datatable.removeChild(datatable.lastElementChild);
            for (var i = 0; i < dat.timeinfo.length; i++) {
                var data = dat.timeinfo[i];
                var item = dataitem.cloneNode(true);
                item.style.display = "";
                item.querySelector("#appid").textContent = data.appid;
                item.querySelector("#appname").textContent = data.appname;
                item.querySelector("#sdkid").textContent = data.sdkid;
                item.querySelector("#sdkname").textContent = data.sdkname;
                item.querySelector("#regtime").textContent = new Date(data.regtime).toLocaleString();
                item.querySelector("#lastlogintime").textContent = new Date(data.lastlogintime).toLocaleString();
                item.querySelector("#paytotal").textContent = data.paytotal;
                var paytable = item.querySelector("#paytable");
                var trpayitem = paytable.querySelector("#trpayitem");
                trpayitem.style.display = "none";
                var havepay = false;
                for (var j = 0; j < dat.payrecord.length; j++) {
                    var paydata = dat.payrecord[j];
                    if (paydata.appid == data.appid && paydata.sdkid == data.sdkid) {
                        havepay = true;
                        var payitem = trpayitem.cloneNode(true);
                        payitem.style.display = "";
                        payitem.querySelector("#payid").textContent = paydata.payid;
                        payitem.querySelector("#createtime").textContent = new Date(paydata.createtime).toLocaleString();
                        payitem.querySelector("#paytime").textContent = new Date(paydata.paytime).toLocaleString();
                        payitem.querySelector("#goodsname").textContent = paydata.goodsname;
                        payitem.querySelector("#goodsnum").textContent = paydata.goodsnum;
                        payitem.querySelector("#money").textContent = paydata.money;
                        payitem.querySelector("#payrmb").textContent = paydata.payrmb;
                        if (paydata.state == 0)
                            payitem.querySelector("#state").textContent = "未支付";
                        else if (paydata.state == 1)
                            payitem.querySelector("#state").textContent = "支付成功";
                        else if (paydata.state == 2)
                            payitem.querySelector("#state").textContent = "支付成功但通知CP失败";
                        paytable.appendChild(payitem);
                    }
                }
                if (!havepay) {
                    item.querySelector("#trpayinfo")["style"].display = "none";
                }
                datatable.appendChild(item);
            }
        });
    }
    adminuserdetail_new.search = search;
    function onclose() {
        parent.postMessage({ type: "close" }, "*");
    }
    adminuserdetail_new.onclose = onclose;
})(adminuserdetail_new || (adminuserdetail_new = {}));
//# sourceMappingURL=userdetail.js.map