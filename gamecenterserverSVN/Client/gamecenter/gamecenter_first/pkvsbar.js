///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    gcpkvsbar.LoadData();
});
var gcpkvsbar;
(function (gcpkvsbar) {
    var myheadico; //我的头像
    var playerheadico; //对方头像
    var myprogbar; //我的进度条
    var progbarlight; //进度条闪光
    var myscore; //我的得分
    var playerscore; //对方得分
    function LoadData() {
        myheadico = document.getElementById("myheadico");
        playerheadico = document.getElementById("playerheadico");
        myprogbar = document.getElementById("myprogbar");
        progbarlight = document.getElementById("progbarlight");
        myscore = document.getElementById("myscore");
        playerscore = document.getElementById("playerscore");
        window.addEventListener("message", function onmsg(ev) {
        }, false);
    }
    gcpkvsbar.LoadData = LoadData;
})(gcpkvsbar || (gcpkvsbar = {}));
//# sourceMappingURL=pkvsbar.js.map