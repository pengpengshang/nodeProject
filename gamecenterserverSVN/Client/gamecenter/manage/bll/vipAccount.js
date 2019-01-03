$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        ACCOUNT.loadVipAccount(null, null);
        ACCOUNT.loadGameList_new();
    });
});
var ACCOUNT;
(function (ACCOUNT) {
    var data2;
    var accounttable;
    var accountitem;
    var accountitems = [];
    var reviewtable;
    var reviewitem;
    var reviewitems = [];
    function loadVipAccount(time, accountname) {
        accounttable = document.getElementById("managementitems");
        accountitem = document.getElementById("managementitem");
        accountitem.style.display = "none";
        var para = new ADMIN.ADMINGETALLACCOUNTTYPEREQ();
        para.time = time;
        para.accountname = accountname;
        ADMIN.adminGetAllAccountType(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < accountitems.length; i++) {
                accounttable.removeChild(accountitems[i]);
            }
            accountitems.splice(0);
            var dat = resp.data;
            var data = dat.accounttypelist;
            for (var i = 0; i < data.length; i++) {
                var accountinfo = data[i];
                var item = accountitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#management_id").val(accountinfo.id);
                $(item).find("#manage_gamename").text(accountinfo.appname);
                $(item).find("#management_type").text(accountinfo.condition);
                $(item).find("#management_lowvalue").text(accountinfo.pricelow);
                $(item).find("#management_heightvalue").text(accountinfo.pricehigh);
                $(item).find("#manage_title").text(accountinfo.title);
                $(item).find("#management_createtime").text(new Date(accountinfo.createtime).toLocaleString());
                accounttable.appendChild(item);
                accountitems.push(item);
                (function (mdata) {
                    $(item).find("#manage_title").click(function (ev) {
                        sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                    });
                    $("#del").click(function (ev) {
                        var para = new ADMIN.ADMINGETCHECKACCOUNTTYPEREQ();
                        var accounttypename = PUTILS_NEW.getCheckValues(document.getElementById('managementitems'));
                        para.accounttypename = accounttypename;
                        ADMIN.adminGetCheckAcountTypeList(para, function (resp) {
                            if (resp.errno != 0) {
                                alert(resp.message);
                                return;
                            }
                            var data = resp.data;
                            ADMIN.admindelAccountType(data, function (resp) {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                console.log("成功");
                                window.location.reload();
                            });
                        });
                    });
                })(accountinfo);
            }
        });
    }
    ACCOUNT.loadVipAccount = loadVipAccount;
    function loadReviewAccount(time, reviewname) {
        reviewtable = document.getElementById("reviewitems");
        reviewitem = document.getElementById("reviewitem");
        reviewitem.style.display = "none";
        var para = new ADMIN.ADMINGETALLREVIEWACCOUNTREQ();
        para.time = time;
        para.reviewname = reviewname;
        ADMIN.adminGetAllReviewAccount(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < reviewitems.length; i++) {
                reviewtable.removeChild(reviewitems[i]);
            }
            reviewitems.splice(0);
            var dat = resp.data;
            var data = dat.reviewlist;
            for (var i = 0; i < data.length; i++) {
                var reviewinfo = data[i];
                var item = reviewitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#review_id").val(reviewinfo.id);
                $(item).find("#review_loginid").text(reviewinfo.loginid);
                $(item).find("#review_gname").text(reviewinfo.gname);
                $(item).find("#review_server").text(reviewinfo.server);
                $(item).find("#review_rolename").text(reviewinfo.rolename);
                $(item).find("#review_detail").text(reviewinfo.detail);
                if (reviewinfo.remark == '0') {
                    $(item).find("#remark").text("未处理");
                    $(item).find("#review_updatetime").text("");
                }
                else {
                    if (reviewinfo.remark == '1') {
                        $(item).find("#remark").text("领取成功");
                        $(item).find("#review_updatetime").text(new Date(reviewinfo.updatetime).toLocaleDateString());
                    }
                    else {
                        $(item).find("#remark").text("领取失败");
                        $(item).find("#review_updatetime").text(new Date(reviewinfo.updatetime).toLocaleDateString());
                    }
                }
                $(item).find("#review_createtime").text(new Date(reviewinfo.createtime).toLocaleDateString());
                reviewtable.appendChild(item);
                reviewitems.push(item);
                (function (mdata) {
                    $("#pass_all").click(function (ev) {
                        var para = new ADMIN.ADMINGETCHECKREVIEWACCOUNTREQ();
                        var reviewname = PUTILS_NEW.getCheckValues(document.getElementById('reviewitems'));
                        para.reviewname = reviewname;
                        ADMIN.adminGetCheckReviewAccountList(para, function (resp) {
                            if (resp.errno != 0) {
                                alert(resp.message);
                                return;
                            }
                            var data = resp.data;
                            ADMIN.adminpassReviewAccount(data, function (resp) {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                console.log("成功");
                                window.location.reload();
                            });
                        });
                    });
                    $("#not_pass").click(function (ev) {
                        var para = new ADMIN.ADMINGETCHECKREVIEWACCOUNTREQ();
                        var reviewname = PUTILS_NEW.getCheckValues(document.getElementById('reviewitems'));
                        para.reviewname = reviewname;
                        ADMIN.adminGetCheckReviewAccountList(para, function (resp) {
                            if (resp.errno != 0) {
                                alert(resp.message);
                                return;
                            }
                            var data = resp.data;
                            ADMIN.adminnotpassReviewAccount(data, function (resp) {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                console.log("成功");
                                window.location.reload();
                            });
                        });
                    });
                })(reviewinfo);
            }
        });
    }
    ACCOUNT.loadReviewAccount = loadReviewAccount;
    //添加高级福利
    function addAccount() {
        var list_game = $("#gamelist option:selected");
        var para = new ADMIN.ADMINADDACCOUNTREQ();
        para.appname = list_game.text();
        para.title = $("#add_account_name").val();
        para.condition = $('input:radio[name="type"]:checked').val();
        para.pricelow = $("#add_pricelow").val();
        para.pricehigh = $("#add_pricehigh").val();
        var arr_title = [];
        $(".title").each(function () {
            arr_title.push($(this).val());
        });
        var arr_condition = [];
        $(".condition").each(function () {
            arr_condition.push($(this).val());
        });
        var arr_value = [];
        $(".value").each(function () {
            arr_value.push($(this).val());
        });
        var arr_count = [];
        $(".count").each(function () {
            arr_count.push($(this).val());
        });
        para.accounttitle = arr_title;
        para.accountcondition = arr_condition;
        para.accountprice = arr_value;
        para.accountsurplu = arr_count;
        ADMIN.adminAddAccount(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }
    ACCOUNT.addAccount = addAccount;
    function loadGameList_new() {
        var selh5game = document.getElementById("gamelist");
        GAMECENTER.gsUserGetH5AppList({ id: null }, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat = resp.data;
            var h5applist = dat.applist;
            for (var i = 0; i < h5applist.length; i++) {
                var opt = document.createElement("option");
                opt.innerText = h5applist[i].name;
                opt.value = h5applist[i].id.toString();
                selh5game.add(opt, i);
            }
        });
    }
    ACCOUNT.loadGameList_new = loadGameList_new;
    $("#reviewmain").click(function () {
        ACCOUNT.loadReviewAccount(null, null);
    });
})(ACCOUNT || (ACCOUNT = {}));
//# sourceMappingURL=vipAccount.js.map