///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />



$(document).ready(() => {
	
	GAMECENTER.UserAutoLogin(userinfo => {
		gcmatching.LoadData();

	});
});
module gcmatching {
	var appdata: GAMECENTER.PKAPPINFO;
	var searchtime: HTMLDivElement;
	var searchtimer;
	var searchsecond = 0;
	var searchtimerhead;

	var playerhead: HTMLImageElement;
	var pkserver: GAMECENTER.PKServer;

	var bShowResult = false;//是否显示了结算页



	class PlayerScore {
		userid: number;
		nickname: string;
		headico: string;
		score: number = 0;//得分
		lasttime: number;//最后接收score时间 
		gameover: boolean = false;//是否已结束
		exitgame: boolean = false;//是否点击退出游戏
	}
	export class RoomInfo {
		roomid: number;//房间ID
		myscore: PlayerScore;
		playerscore: PlayerScore;
		gsuserpkresult: GAMECENTER.GSUSERPKRESULT;

	}
	var room: RoomInfo;


	export function LoadData() {
		var para = utils.getQueryString("para");
		if (!para) {
			history.back();
			return;
		} 
		appdata = JSON.parse(para);




		playerhead = <any>document.getElementById("playerhead");



		$("#myhead").get(0)["src"] = GAMECENTER.userinfo.headico;
		$("#searchdiv").show();
		$("#vsdiv").hide();
		

		searchtime = <any>document.getElementById("searchtime");
		searchtimer = setInterval(() => {
			searchsecond++;
			var sec = searchsecond % 60;
			var min = Math.floor(searchsecond / 60);
			searchtime.innerText = utils.__prefix(2, min) + ":" + utils.__prefix(2, sec);
		}, 1000);

		//随机头像
		searchtimerhead = setInterval(() => {
			var headpath: string;
			var headcount: number;
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


		setTimeout(() => {//随机延时1-3秒后才开始匹配
			pkserver = new GAMECENTER.PKServer();
			pkserver.Connect(GAMECENTER.userinfo.session, appdata.id,
				ev => {//onopen
					var dd = 3;
				},
				ev => {//onclose
					alert("连接断开，请重新进入！");
					history.back();
				},
				ev => {//onerr
					alert("连接断开，请重新进入！");
					history.back();
				},
				data => {//onmessage
					onWsMessage(data);
				}
			);

		}, Math.floor(Math.random()*2000)+1000);
	}

	export function onCancel() {
		window.location.href = "index.shtml";
	}

	function onWsMessage(data: GAMECENTER.WEBSOCKETPACK) {
		switch (data.name) {
			case "gsuserenterpkgame":
				{//进入游戏，创建房间
					var gsuserenterpkgame: GAMECENTER.GSUSERENTERPKGAMERESP = data.data;
					if (!room) {
						room = new RoomInfo();
						room.roomid = gsuserenterpkgame.roomid;
						room.myscore = new PlayerScore();
						room.myscore.userid = GAMECENTER.userinfo.userid;
						room.myscore.headico = GAMECENTER.userinfo.headico;
						room.myscore.nickname = GAMECENTER.userinfo.nickname;
					}
					if (!!gsuserenterpkgame.user)//匹配成功用户,开始游戏
					{
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
						setTimeout(() => {
							StartGame();
						}, 2000);

						
					}
					break;
				}
			case "gsuserpkscore":
				{
					var gsuserupscore: GAMECENTER.GSUSERPKSCORE = data.data;
					room.playerscore.score = gsuserupscore.score;
					room.playerscore.gameover = gsuserupscore.gameover;
					SetPkBarScore();
					if (!gameframe) break;
					gameframe.contentWindow.postMessage({
						cmd: "gsuserpkscore",
						data: gsuserupscore
					},"*");
					break;
				}
			case "gsuserpkresult":
				{
					var gsuserpkresult: GAMECENTER.GSUSERPKRESULT = data.data;
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
					pkserver.SendData("keepalive", { mysession: GAMECENTER.userinfo.session ,roomid:room.roomid});
					break;
				}
		}
		if (!room) {
			
			
		}
	}
	var gameframe: HTMLIFrameElement;
	var pkbar: HTMLDivElement;

	function CreateFrame(url: string): HTMLIFrameElement {
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


	function StartGame() {//进入H5游戏，使用iframe
		

		gameframe = CreateFrame(appdata.url);

		gameframe.onload = ev => {
			var dd = 3;
		};




		
		pkbar = document.createElement("div");
		$(pkbar).load("pkvsbar.html", null, (resptext, status, req) => {
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
	var autoSubmit;//延时自动提交
	function onMessage(ev: MessageEvent) {
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
				if (autoSubmit) return;
				autoSubmit = setTimeout(() => {
					autoSubmit = null;
					room.myscore.gameover = true;
					room.myscore.exitgame = true;
					SendMyScore();
					ShowResult();
				}, 10000);
				break;
			case "sendCurrentScore"://实时提交分数
				room.myscore.score = Math.floor(data.score);
				room.myscore.gameover = false;
				SendMyScore();
				SetPkBarScore();
				break;
			case "SubmitScore"://点击了游戏中的“确定”结束游戏
				room.myscore.score = Math.floor(data.score);
				room.myscore.gameover = true;
				room.myscore.exitgame = true;
				SendMyScore();

				SetPkBarScore();
				ShowResult();
				break;
			case "cancelwait"://取消等待，认输
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
		if (!pkbar) return;
		var myscore: HTMLDivElement =<any> pkbar.querySelector("#myscore");
		$(myscore).find("*").remove();
		utils.CreateNumberImgs("style/pk/3对战中/对战中分数.png", room.myscore.score.toString(), 34, false, myscore);
		var playerscore: HTMLDivElement = <any>pkbar.querySelector("#playerscore");
		$(playerscore).find("*").remove();
		utils.CreateNumberImgs("style/pk/3对战中/对战中分数.png", room.playerscore.score.toString(), 34, false, playerscore);

		var myprogbar: HTMLImageElement = <any>pkbar.querySelector("#myprogbar");
		var totalscore = room.myscore.score + room.playerscore.score;
		var percent: number = totalscore==0?0.5:( room.myscore.score / totalscore);
	
		myprogbar.style.clip = "rect(0px," + Math.floor(687 * percent) + "px,"+24+"px,0px)";

		var progbarlight:HTMLImageElement = <any>pkbar.querySelector("#progbarlight");
		progbarlight.style.left = 687 * percent - 62 / 2 + "px";
	}
	
	function ShowResult() {//显示结算
		if (!pkbar) return;
		document.body.removeChild(pkbar);
		pkbar = null;
		gameframe.onload = ev => {
//			gameframe.contentWindow.postMessage({ cmd: "roominfo", data: room }, "*");
			bShowResult = true;
			if (room.gsuserpkresult) {
				gameframe.contentWindow.postMessage({
					cmd: "gsuserpkresult",
					data: room.gsuserpkresult
				}, "*");
			}
		};
		gameframe.src = "pksettle.shtml?para="+encodeURI(JSON.stringify(room));

	}
}