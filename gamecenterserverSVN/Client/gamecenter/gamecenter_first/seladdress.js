///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
///<reference path='selectaddress.ts' />
$(document).ready(function () {
    gcseladdress.LoadData();
});
var gcseladdress;
(function (gcseladdress) {
    function LoadData() {
        //初始化选择列表
        var addressProvince = selectaddress.getElement("contact_province");
        var ar = selectaddress.getItems("0");
        selectaddress.addlist(ar, addressProvince);
        var addressCity = selectaddress.getElement("contact_city");
        var ar = selectaddress.getItems("0_0");
        selectaddress.addlist(ar, addressCity);
        var openarea = selectaddress.getElement("contact_area");
        var ar = selectaddress.getItems("0_0_0");
        selectaddress.addlist(ar, openarea);
        var addr = getQueryString("addr").split(" ");
        if (addr.length > 2) {
            $("#contact_province").val(addr[0]);
            selectaddress.selectprovince($("#contact_province").get(0), 'contact_province', 'contact_city', 'contact_area');
            $("#contact_city").val(addr[1]);
            selectaddress.selectprovince($("#contact_city").get(0), 'contact_province', 'contact_city', 'contact_area');
            $("#contact_area").val(addr[2]);
        }
    }
    gcseladdress.LoadData = LoadData;
    function onOK() {
        var data = {
            prov: $("#contact_province").val(),
            city: $("#contact_city").val(),
            area: $("#contact_area").val()
        };
        parent.window.postMessage({ cmd: "seladdress", data: data }, "*");
    }
    gcseladdress.onOK = onOK;
})(gcseladdress || (gcseladdress = {}));
//# sourceMappingURL=seladdress.js.map