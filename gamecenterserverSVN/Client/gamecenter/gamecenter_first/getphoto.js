///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    GAMECENTER.UserAutoLogin(function (userinfo) {
        gcgetphoto.LoadData();
    });
});
var gcgetphoto;
(function (gcgetphoto) {
    var context;
    var video;
    function LoadData() {
        video = document.getElementById("video");
        var canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        var errocb = function () {
            console.log('sth wrong!');
        };
        if (navigator["getUserMedia"]) {
            navigator["getUserMedia"]({ "video": true }, function (stream) {
                video.src = stream;
                video.play();
            }, errocb);
        }
        else if (navigator["webkitGetUserMedia"]) {
            navigator["webkitGetUserMedia"]({ "video": true }, function (stream) {
                video.src = window["webkitURL"].createObjectURL(stream);
                video.play();
            }, errocb);
        }
    }
    gcgetphoto.LoadData = LoadData;
    function onOK() {
    }
    gcgetphoto.onOK = onOK;
    function onpicture() {
        document.getElementById("picture").addEventListener("click", function () {
            context.drawImage(video, 0, 0, 640, 480);
        });
    }
    gcgetphoto.onpicture = onpicture;
})(gcgetphoto || (gcgetphoto = {}));
//# sourceMappingURL=getphoto.js.map