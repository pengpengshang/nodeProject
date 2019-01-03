///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    gcpayresult.LoadData();
});
var gcpayresult;
(function (gcpayresult) {
    function LoadData() {
        var cancel = utils.getQueryString("cancel");
        if (cancel) {
            window.parent.postMessage({ cmd: "paycancel" }, "*");
            return;
        }
        var para = utils.getRequest();
        var havepara = false;
        for (var i in para) {
            havepara = true;
            break;
        }
        if (havepara) {
            if (parent) {
                parent.window.postMessage({ cmd: "payresult", data: para }, "*");
            }
        }
    }
    gcpayresult.LoadData = LoadData;
})(gcpayresult || (gcpayresult = {}));
//# sourceMappingURL=payresult.js.map