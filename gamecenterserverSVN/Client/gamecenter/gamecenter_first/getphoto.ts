///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />



$(document).ready(() => {
	
	GAMECENTER.UserAutoLogin(userinfo => {
		gcgetphoto.LoadData();

	});
});
module gcgetphoto {
	var context: CanvasRenderingContext2D;
	var video: HTMLVideoElement;
	export function LoadData() {
		video =<any> document.getElementById("video");
		var canvas:HTMLCanvasElement = <any>document.getElementById("canvas");
		context = canvas.getContext("2d");
		var errocb = function () {
			console.log('sth wrong!');
		}

		if (navigator["getUserMedia"]) { // 标准的API
			navigator["getUserMedia"]({ "video": true }, function (stream) {
				video.src = stream;
				video.play();
			}, errocb);
		} else if (navigator["webkitGetUserMedia"]) { // WebKit 核心的API
			navigator["webkitGetUserMedia"]({ "video": true }, function (stream) {
				video.src = window["webkitURL"].createObjectURL(stream);
				video.play();
			}, errocb);
		}
	}
	export function onOK() {

	}
	export function onpicture() {
		document.getElementById("picture").addEventListener("click", function () {
			context.drawImage(video, 0, 0, 640, 480);

		}
		);
	}
			
}