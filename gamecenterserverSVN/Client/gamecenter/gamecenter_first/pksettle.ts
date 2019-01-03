///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />



$(document).ready(() => {
	
	gcpksettle.LoadData();

});
module gcpksettle {
	var room: gcmatching.RoomInfo;
	var waittip: HTMLDivElement;
	var resultdiv: HTMLDivElement;
	var windiv: HTMLDivElement;
	var losediv: HTMLDivElement;
	var imgtitle: HTMLImageElement;

	var playerscore: HTMLDivElement;
	var myscore: HTMLDivElement;

	var wingold: HTMLDivElement;

	export function LoadData() {
		var para = utils.getQueryString("para");
		if (!para) {
			history.back();
			return;
		} 
		room = JSON.parse(para);


		waittip = <any>document.getElementById("waittip");
		resultdiv = <any>document.getElementById("resultdiv");
		windiv = <any>document.getElementById("windiv");
		losediv = <any>document.getElementById("losediv");
		imgtitle = <any>document.getElementById("imgtitle");
		playerscore = <any>document.getElementById("playerscore");
		myscore = <any>document.getElementById("myscore");
		wingold = <any>document.getElementById("wingold");


		$("#playerhead").get(0)["src"] = room.playerscore.headico;
		$("#myhead").get(0)["src"] = room.myscore.headico;
		$("#playername").text(room.playerscore.nickname);
		playerscore.innerText=room.playerscore.score.toString();
		myscore.innerText=room.myscore.score.toString();

		if (!room.playerscore.gameover) {
			waittip.style.display = "";
		}
		window.addEventListener("message", function onMessage(ev) {
			var dat = ev.data;
			switch (dat.cmd) {
				case "gsuserpkscore":
					{
						var gsuserupscore: GAMECENTER.GSUSERPKSCORE = dat.data;
						room.playerscore.score = gsuserupscore.score;
						room.playerscore.gameover = gsuserupscore.gameover;
						playerscore.innerText = room.playerscore.score.toString();

						break
					}
				case "gsuserpkresult":
					{
						var gsuserpkresult: GAMECENTER.GSUSERPKRESULT = dat.data;
						ShowWinLose(gsuserpkresult.win, gsuserpkresult.goldget);
						break;
					}
			}
		});
		if (room.gsuserpkresult) {
			ShowWinLose(room.gsuserpkresult.win, room.gsuserpkresult.goldget);
		}
	}
	function UpdateData() {
		playerscore.innerText = room.playerscore.score.toString();
		myscore.innerText = room.myscore.score.toString();
		
	}
	function ShowWinLose(iswin: boolean, gold: number) {
		waittip.style.display = "none";
		if (iswin) {
			imgtitle.src = "style/pk/4结算切图/赢了和等待/字--胜利了.png";

			$(wingold).find("*").remove();
			windiv.style.display = "";
			losediv.style.display = "none";
			var num = gold.toString();
			for (var i = 0; i < num.length; i++) {
				var img: HTMLImageElement = document.createElement("img");
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
	export function onCancelWait() {
		parent.window.postMessage({ cmd: "cancelwait" }, "*");
	}
	export function onOK() {
		parent.window.postMessage({ cmd: "onOK" }, "*");
	}
	export function onReplay() {
		parent.window.postMessage({ cmd: "onReplay" }, "*");
	}

}