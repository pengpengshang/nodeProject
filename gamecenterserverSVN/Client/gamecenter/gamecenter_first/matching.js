///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    GAMECENTER.UserAutoLogin(function (userinfo) {
        gcmatching.LoadData();
    });
});
var gcmatching;
(function (gcmatching) {
    var appdata;
    var searchtime;
    var searchtimer;
    var searchsecond = 0;
    var searchtimerhead;
    var playerhead;
    var pkserver;
    var bShowResult = false; //是否显示了结算页
    var PlayerScore = (function () {
        function PlayerScore() {
            this.score = 0; //得分
            this.gameover = false; //是否已结束
            this.exitgame = false; //是否点击退出游戏
        }
        return PlayerScore;
    }());
    var RoomInfo = (function () {
        function RoomInfo() {
        }
        return RoomInfo;
    }());
    gcmatching.RoomInfo = RoomInfo;
    var room;
    function LoadData() {
        var para = utils.getQueryString("para");
        if (!para) {
            history.back();
            return;
        }
        appdata = JSON.parse(para);
        playerhead = document.getElementById("playerhead");
        $("#myhead").get(0)["src"] = GAMECENTER.userinfo.headico;
        $("#searchdiv").show();
        $("#vsdiv").hide();
        searchtime = document.getElementById("searchtime");
        searchtimer = setInterval(function () {
            searchsecond++;
            var sec = searchsecond % 60;
            var min = Math.floor(searchsecond / 60);
            searchtime.innerText = utils.__prefix(2, min) + ":" + utils.__prefix(2, sec);
        }, 1000);
        //随机头像
        searchtimerhead = setInterval(function () {
            var headpath;
            var headcount;
            if (Math.random() > 0.5) {
                headpath = "style/pk/系统人物头像/system_head_";
                headcount = 26;
            }
            else {
                headpath = "style/pk/对手随机头像/";
                headcount = 30;
            }
            var idx = Math.floor(Math.random() * headcount) + 1;
            playerhead.src = headpath + idx + ".png";
        }, 300);
        setTimeout(function () {
            pkserver = new GAMECENTER.PKServer();
            pkserver.Connect(GAMECENTER.userinfo.session, appdata.id, function (ev) {
                var dd = 3;
            }, function (ev) {
                alert("连接断开，请重新进入！");
                history.back();
            }, function (ev) {
                alert("连接断开，请重新进入！");
                history.back();
            }, function (data) {
                onWsMessage(data);
            });
        }, Math.floor(Math.random() * 2000) + 1000);
    }
    gcmatching.LoadData = LoadData;
    function onCancel() {
        window.location.href = "index.shtml";
    }
    gcmatching.onCancel = onCancel;
    function onWsMessage(data) {
        switch (data.name) {
            case "gsuserenterpkgame":
                {
                    var gsuserenterpkgame = data.data;
                    if (!room) {
                        room = new RoomInfo();
                        room.roomid = gsuserenterpkgame.roomid;
                        room.myscore = new PlayerScore();
                        room.myscore.userid = GAMECENTER.userinfo.userid;
                        room.myscore.headico = GAMECENTER.userinfo.headico;
                        room.myscore.nickname = GAMECENTER.userinfo.nickname;
                    }
                    if (!!gsuserenterpkgame.user) {
                        room.playerscore = new PlayerScore();
                        room.playerscore.userid = gsuserenterpkgame.user.userid;
                        room.playerscore.headico = gsuserenterpkgame.user.headico;
                        room.playerscore.nickname = gsuserenterpkgame.user.nickname;
                        playerhead.src = room.playerscore.headico;
                        clearInterval(searchtimer);
                        searchtimer = null;
                        clearInterval(searchtimerhead);
                        searchtimerhead = null;
                        $("#playername").text(room.playerscore.nickname);
                        $("#searchdiv").hide();
                        $("#vsdiv").show();
                        setTimeout(function () {
                            StartGame();
                        }, 2000);
                    }
                    break;
                }
            case "gsuserpkscore":
                {
                    var gsuserupscore = data.data;
                    room.playerscore.score = gsuserupscore.score;
                    room.playerscore.gameover = gsuserupscore.gameover;
                    SetPkBarScore();
                    if (!gameframe)
                        break;
                    gameframe.contentWindow.postMessage({
                        cmd: "gsuserpkscore",
                        data: gsuserupscore
                    }, "*");
                    break;
                }
            case "gsuserpkresult":
                {
                    var gsuserpkresult = data.data;
                    room.gsuserpkresult = gsuserpkresult;
                    GAMECENTER.userinfo.gold = gsuserpkresult.gold;
                    //					ShowResult();
                    if (bShowResult) {
                        gameframe.contentWindow.postMessage({
                            cmd: "gsuserpkresult",
                            data: gsuserpkresult
                        }, "*");
                    }
                    else {
                    }
                    break;
                }
            case "keepalive":
                {
                    pkserver.SendData("keepalive", { mysession: GAMECENTER.userinfo.session, roomid: room.roomid });
                    break;
                }
        }
        if (!room) {
        }
    }
    var gameframe;
    var pkbar;
    function CreateFrame(url) {
        var iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.style.border = "none";
        iframe.style.display = "block";
        iframe.style.position = "fixed";
        iframe.style.left = "0px";
        iframe.style.right = "0px";
        iframe.style.top = "0px";
        iframe.style.bottom = "0px";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        document.body.appendChild(iframe);
        return iframe;
    }
    function StartGame() {
        gameframe = CreateFrame(appdata.url);
        gameframe.onload = function (ev) {
            var dd = 3;
        };
        pkbar = document.createElement("div");
        $(pkbar).load("pkvsbar.html", null, function (resptext, status, req) {
            $(pkbar).find("#myheadico").get(0)["src"] = room.myscore.headico;
            $(pkbar).find("#playerheadico").get(0)["src"] = room.playerscore.headico;
            SetPkBarScore();
        });
        pkbar.style.position = "fixed";
        pkbar.style.left = "0px";
        pkbar.style.right = "0px";
        pkbar.style.top = "100px";
        document.body.appendChild(pkbar);
        window.addEventListener("message", onMessage, false);
    }
    var autoSubmit; //延时自动提交
    function onMessage(ev) {
        var data = ev.data;
        switch (data.cmd) {
            case "gameStart":
                SendMyScore();
                break;
            case "gameEnd":
                if (data.score !== null && data.score !== undefined) {
                    room.myscore.score = Math.floor(Math.abs(data.score));
                }
                room.myscore.gameover = true;
                SendMyScore();
                SetPkBarScore();
                //游戏结束，延时10秒关闭
                if (autoSubmit)
                    return;
                autoSubmit = setTimeout(function () {
                    autoSubmit = null;
                    room.myscore.gameover = true;
                    room.myscore.exitgame = true;
                    SendMyScore();
                    ShowResult();
                }, 10000);
                break;
            case "sendCurrentScore":
                room.myscore.score = Math.floor(data.score);
                room.myscore.gameover = false;
                SendMyScore();
                SetPkBarScore();
                break;
            case "SubmitScore":
                room.myscore.score = Math.floor(data.score);
                room.myscore.gameover = true;
                room.myscore.exitgame = true;
                SendMyScore();
                SetPkBarScore();
                ShowResult();
                break;
            case "cancelwait":
                //				room.myscore.gameover = true;
                //				room.myscore.score = 0;
                //				SendMyScore();
                Exit();
                window.location.href = "index.shtml";
                break;
            case "onOK":
                Exit();
                window.location.href = "index.shtml";
                break;
            case "onReplay":
                Exit();
                window.location.reload();
                break;
        }
    }
    function SendMyScore() {
        var upscore = new GAMECENTER.GSUSERUPSCORE();
        upscore.mysession = GAMECENTER.userinfo.session;
        upscore.gameover = room.myscore.gameover;
        upscore.roomid = room.roomid;
        upscore.score = room.myscore.score;
        upscore.exitgame = room.myscore.exitgame;
        pkserver.SendData("gsuserupscore", upscore);
    }
    function Exit() {
        window.removeEventListener("message", onMessage);
        pkserver.Close();
    }
    function SetPkBarScore() {
        if (!pkbar)
            return;
        var myscore = pkbar.querySelector("#myscore");
        $(myscore).find("*").remove();
        utils.CreateNumberImgs("style/pk/3对战中/对战中分数.png", room.myscore.score.toString(), 34, false, myscore);
        var playerscore = pkbar.querySelector("#playerscore");
        $(playerscore).find("*").remove();
        utils.CreateNumberImgs("style/pk/3对战中/对战中分数.png", room.playerscore.score.toString(), 34, false, playerscore);
        var myprogbar = pkbar.querySelector("#myprogbar");
        var totalscore = room.myscore.score + room.playerscore.score;
        var percent = totalscore == 0 ? 0.5 : (room.myscore.score / totalscore);
        myprogbar.style.clip = "rect(0px," + Math.floor(687 * percent) + "px," + 24 + "px,0px)";
        var progbarlight = pkbar.querySelector("#progbarlight");
        progbarlight.style.left = 687 * percent - 62 / 2 + "px";
    }
    function ShowResult() {
        if (!pkbar)
            return;
        document.body.removeChild(pkbar);
        pkbar = null;
        gameframe.onload = function (ev) {
            //			gameframe.contentWindow.postMessage({ cmd: "roominfo", data: room }, "*");
            bShowResult = true;
            if (room.gsuserpkresult) {
                gameframe.contentWindow.postMessage({
                    cmd: "gsuserpkresult",
                    data: room.gsuserpkresult
                }, "*");
            }
        };
        gameframe.src = "pksettle.shtml?para=" + encodeURI(JSON.stringify(room));
    }
})(gcmatching || (gcmatching = {}));
//# sourceMappingURL=matching.js.map