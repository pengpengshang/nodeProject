///<reference path='../5wansdk.ts' />
var gcglobal;
(function (gcglobal) {
    function ShowQuickReg() {
        SDKUTIL.ShowIFrame("quickreg.shtml", false, function (ev, divbgpage, iframe) {
            window.addEventListener("message", function onmsg(ev) {
                switch (ev.data.cmd) {
                    case "login":
                        SDKUTIL.RemoveIFrame(divbgpage, iframe);
                        location.reload();
                        break;
                    case "cancel":
                        SDKUTIL.RemoveIFrame(divbgpage, iframe);
                        break;
                }
            });
        });
    }
    gcglobal.ShowQuickReg = ShowQuickReg;
})(gcglobal || (gcglobal = {}));
//# sourceMappingURL=global.js.map