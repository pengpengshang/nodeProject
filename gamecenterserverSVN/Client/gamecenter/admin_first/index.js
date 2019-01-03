///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
$(document).ready(function () {
    ADMIN.adminCheckLogin(function (user) {
        adminindex.LoadData();
    });
});
var adminindex;
(function (adminindex) {
    function LoadData() {
    }
    adminindex.LoadData = LoadData;
})(adminindex || (adminindex = {}));
//# sourceMappingURL=index.js.map