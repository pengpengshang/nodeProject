///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    gcpksettle.LoadData();
});
var gcpksettle;
(function (gcpksettle) {
    var room;
    var waittip;
    var resultdiv;
    var windiv;
    var losediv;
    var imgtitle;
    var playerscore;
    var myscore;
    var wingold;
    function LoadData() {
        var para = utils.getQueryString("para");
        if (!para) {
            history.back();
            return;
        }
        room = JSON.parse(para);
        waittip = document.getElementById("waittip");
        resultdiv = document.getElementById("resultdiv");
        windiv = document.getElementById("windiv");
        losediv = document.getElementById("losediv");
        imgtitle = document.getElementById("imgtitle");
        playerscore = document.getElementById("playerscore");
        myscore = document.getElementById("myscore");
        wingold = document.getElementById("wingold");
        $("#playerhead").get(0)["src"] = room.playerscore.headico;
        $("#myhead").get(0)["src"] = room.myscore.headico;
        $("#playername").text(room.playerscore.nickname);
        playerscore.innerText = room.playerscore.score.toString();
        myscore.innerText = room.myscore.score.toString();
        if (!room.playerscore.gameover) {
            waittip.style.display = "";
        }
        window.addEventListener("message", function onMessage(ev) {
            var dat = ev.data;
            switch (dat.cmd) {
                case "gsuserpkscore":
                    {
                        var gsuserupscore = dat.data;
                        room.playerscore.score = gsuserupscore.score;
                        room.playerscore.gameover = gsuserupscore.gameover;
                        playerscore.innerText = room.playerscore.score.toString();
                        break;
                    }
                case "gsuserpkresult":
                    {
                        var gsuserpkresult = dat.data;
                        ShowWinLose(gsuserpkresult.win, gsuserpkresult.goldget);
                        break;
                    }
            }
        });
        if (room.gsuserpkresult) {
            ShowWinLose(room.gsuserpkresult.win, room.gsuserpkresult.goldget);
        }
    }
    gcpksettle.LoadData = LoadData;
    function UpdateData() {
        playerscore.innerText = room.playerscore.score.toString();
        myscore.innerText = room.myscore.score.toString();
    }
    function ShowWinLose(iswin, gold) {
        waittip.style.display = "none";
        if (iswin) {
            imgtitle.src = "style/pk/4结算切图/赢了和等待/字--胜利了.png";
            $(wingold).find("*").remove();
            windiv.style.display = "";
            losediv.style.display = "none";
            var num = gold.toString();
            for (var i = 0; i < num.length; i++) {
                var img = document.createElement("img");
                img.src = "style/pk/4结算切图/赢了和等待/新建文件夹/" + num.substr(i, 1) + ".png";
                wingold.appendChild(img);
            }
            $("#mywinimg").show();
        }
        else {
            imgtitle.src = "style/pk/4结算切图/失败/字--失败了.png";
            windiv.style.display = "none";
            losediv.style.display = "";
            $("#playerwinimg").show();
        }
        resultdiv.style.display = "";
        waittip.style.display = "none";
    }
    function onCancelWait() {
        parent.window.postMessage({ cmd: "cancelwait" }, "*");
    }
    gcpksettle.onCancelWait = onCancelWait;
    function onOK() {
        parent.window.postMessage({ cmd: "onOK" }, "*");
    }
    gcpksettle.onOK = onOK;
    function onReplay() {
        parent.window.postMessage({ cmd: "onReplay" }, "*");
    }
    gcpksettle.onReplay = onReplay;
})(gcpksettle || (gcpksettle = {}));
//# sourceMappingURL=pksettle.js.map