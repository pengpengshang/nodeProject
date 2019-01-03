function Router() {
    this.routes = {};
    this.curUrl = '';
    this.route = function (path, callback) {
        this.routes[path] = callback || function () { };
    };
    this.refresh = function () {
        this.curUrl = location.hash.slice(1) || '/';
        this.routes[this.curUrl]();
    };
    this.init = function () {
        window.addEventListener('load', this.refresh.bind(this), false);
        window.addEventListener('hashchange', this.refresh.bind(this), false);
    }

}

var R = new Router();
R.init();
var res = document.getElementById('result');
var titleName = $("#game_type");
R.route('/', function () {
    $(".levelRules").show();
    titleName.text("等级规则");
});

//当判断有绑定手机时，直接显示的修改密码
R.route('/modifyPwdY', function () {
    loadresult(modifyPwdY());
    titleName.text("修改密码");

});

//未绑定手机时的绑定手机
R.route('/modifyPhone', function () {
    loadresult(modifyPhone());
    titleName.text("手机绑定");

});
//未绑定邮箱时的绑定邮箱
R.route('/modifymail', function () {
    loadresult(modifymail());
    titleName.text("邮箱绑定");
});
//邮箱已经绑定
R.route('/mailBind', function () {
    loadresult(mailBind());
    titleName.text("邮箱绑定");
});
//手机已经绑定
R.route('/phoneBind', function () {
    loadresult(phoneBind());
    titleName.text("手机绑定");
})
$(".back").click(function () {
    history.back();
})
//绑定手机的修改密码
function modifyPwdY() {
    var html = '<div class="modifyPwdY martop36">';
    html += '<div class="modifyPwdY_code borpad"><i></i><input type="text" placeholder="请输入验证码" id="phoneCode"/><a href="javascript:" id="sendCode" onclick="FILLINFO.getCode()">发送验证码</a></div>';
    html += '<div class="modifyPwdY_pwd borpad"><i></i><input type="password" placeholder="请输入新密码" id="wPwd"/></div>';
    html += '<div class="modifyPwdY_pwd borpad"><i></i><input type="password" placeholder="请再次输入新密码" id="cPwd"/></div>';
    html += '<a href="javascript:;" class="PI_btn" onclick="FILLINFO.fgModifyPwd()">确定</a>';
    html += '</div>';
    return html;
}

//未绑定手机时显示的绑定手机
function modifyPhone() {
    var html = '<div class="modifyPhone martop36">';
    html += '<div class="modifyphone_num borpad"><i></i><input type="text" placeholder="请输入需绑定手机号" id="phoneNum"/></div>';
    html += '<div class="modifyphone_code borpad"><i></i><input type="text" placeholder="请输入验证码" id="phoneCode"/><a href="javascript:" id="sendCode" onclick="FILLINFO.sendCode()">发送验证码</a></div>';
    html += '<div class="tipsWorld">您将会收到一条短信，短信中会告知验证码。验证过程中不收取任何费用。</div>';
    html += '<a href="javascript:;" class="PI_btn" onclick="FILLINFO.cognatePhone()">确认绑定</a>';
    html += '</div>';
    return html;
}

//未绑定时的邮箱绑定
function modifymail() {
    var html = '<div class="modifymail martop36">';
    html += '<div class="modifymail_num borpad"><i></i><input type="text" placeholder="请输入需绑定邮箱" id="mailNum"/></div>';
    html += '<div class="modifymail_code borpad"><i></i><input type="text" placeholder="请输入验证码" id="mailCode"/><a href="javascript:" id="sendMailCode" onclick="FILLINFO.sendMailCode()">发送验证码</a></div>';
    html += '<div class="tipsWorld">我们会发送邮件至您的邮箱，请注意查收验证码</div>';
    html += '<a href="javascript:;" class="PI_btn" onclick="FILLINFO.cognateMail()">确认绑定</a>';
    html += '</div>';
    return html;
}

//邮箱已绑定
function mailBind() {
    var html = '<div class="mailBind">';
    html += '<div class="mailBind_title">已绑定邮箱账号</div>';
    html += '<div class="mailBind_num" id="mailBind_num"></div>';
    html += '<div class="mailBind_img"></div>';
    html += '<a href="fillInfo.html#/modifymail" class="PI_btn">更改邮箱</a>';
    html += '</div>';
    return html;
}

//手机号已绑定
function phoneBind() {
    var html = '<div class="phoneBind">';
    html += '<div class="phoneBind_title">已绑定手机号</div>';
    html += '<div class="phoneBind_num" id="phoneBind_num"></div>'
    html += '<div class="phoneBind_img"></div>';
    html += '<a href="fillInfo.html#/modifyPhone" class="PI_btn">更改手机</a>';
    html += '</div>';
    return html;
}
function loadresult(fn) {
    $('#result').empty().append(fn);
    var tel = $('.phoneBind_num');
    var punm = utils.getCookie("GSUSERINFO").phone;
    if (!!punm) {
        tel.text(punm.substring(0, 3) + "****" + punm.substring(8, 11));
    }
    var mail = $('.mailBind_num');
    var mailnum = utils.getCookie("GSUSERINFO").email;
    if (!!mailnum) {
        mail.text(mailnum.substring(0, 4) + "*****" + mailnum.substring(mailnum.indexOf('@'), mailnum.length));
    }
}
