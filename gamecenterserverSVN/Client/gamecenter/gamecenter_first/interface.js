/**
 * 提交分数，无返回值
 */
function SubmitScore(score) { 

	window.parent.postMessage({ cmd: "SubmitScore", score: score }, "*");
}

/**
 * 当前模式，返回0:练习模式，1:PK模式, 2: 淘汰赛
 */
function GetGameMode() {
	return 1;
}

/**
 * 分享，无返回值，score：当前分数，content：要分享的内容（文字）
 */
function ShareGame(score,content) { 

}

/**
 *	发送当前成绩
 *	param currentScore 当前分数
 *	实时分数2秒发送一次给app端。
 */
function sendCurrentScore(currentScore) {
	window.parent.postMessage({ cmd: "sendCurrentScore", score: currentScore }, "*");
}

/*
 *	提醒引擎游戏开始
 */
function gameStart() {
	window.parent.postMessage({ cmd: "gameStart" }, "*");
}

function gameEnd(currentScore) {
	window.parent.postMessage({ cmd: "gameEnd", score: currentScore }, "*");
}