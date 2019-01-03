$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        ACCOUNT.loadVipAccount(null, null);
        ACCOUNT.loadGameList_new();
    });
});
module ACCOUNT {
    var data2: ADMIN.ADMINGETALLFEEDBACKINFO;
    var accounttable: HTMLTableElement;
    var accountitem: HTMLTableRowElement;
    var accountitems: HTMLTableRowElement[] = [];
    var reviewtable: HTMLTableElement;
    var reviewitem: HTMLTableRowElement;
    var reviewitems: HTMLTableRowElement[] = [];
    export function loadVipAccount(time, accountname) {
        accounttable = <any>document.getElementById("managementitems");
        accountitem = <any>document.getElementById("managementitem");
        accountitem.style.display = "none";
        var para: ADMIN.ADMINGETALLACCOUNTTYPEREQ = new ADMIN.ADMINGETALLACCOUNTTYPEREQ();
        para.time = time;
        para.accountname = accountname;
        ADMIN.adminGetAllAccountType(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < accountitems.length; i++) {
                accounttable.removeChild(accountitems[i]);
            }
            accountitems.splice(0);
            var dat: ADMIN.ADMINGETALLACCOUNTTYPERESP = resp.data;
            var data = dat.accounttypelist;
            for (var i = 0; i < data.length; i++) {
                var accountinfo: ADMIN.ADMINGETALLACCOUNTTYPEINFO = data[i];
                var item: HTMLTableRowElement = <any>accountitem.cloneNode(true);
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
                (function (mdata: ADMIN.ADMINGETALLACCOUNTTYPEINFO) {


                    $(item).find("#manage_title").click(ev => {
                        sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                       
                    });











                    $("#del").click(ev => {
                        var para: ADMIN.ADMINGETCHECKACCOUNTTYPEREQ = new ADMIN.ADMINGETCHECKACCOUNTTYPEREQ();
                        var accounttypename = PUTILS_NEW.getCheckValues(document.getElementById('managementitems'));
                        para.accounttypename = accounttypename;
                        ADMIN.adminGetCheckAcountTypeList(para, resp => {
                            if (resp.errno != 0) {
                                alert(resp.message);
                                return;
                            }
                            var data: ADMIN.ADMINDELACCOUNTTYPE[] = resp.data;

                            ADMIN.admindelAccountType(data, resp => {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                console.log("成功");
                                window.location.reload();
                            });
                        })
                    });

                })(accountinfo);
            }
        });
    }
    export function loadReviewAccount(time, reviewname) {
        reviewtable = <any>document.getElementById("reviewitems");
        reviewitem = <any>document.getElementById("reviewitem");
        reviewitem.style.display = "none";
        var para: ADMIN.ADMINGETALLREVIEWACCOUNTREQ = new ADMIN.ADMINGETALLREVIEWACCOUNTREQ();
        para.time = time;
        para.reviewname = reviewname;
        ADMIN.adminGetAllReviewAccount(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < reviewitems.length; i++) {
                reviewtable.removeChild(reviewitems[i]);
            }
            reviewitems.splice(0);
            var dat: ADMIN.ADMINGETALLREVIEWACCOUNTRESP = resp.data;
            var data = dat.reviewlist;
            for (var i = 0; i < data.length; i++) {
                var reviewinfo: ADMIN.ADMINGETALLREVIEWACCOUNTINFO = data[i];
                var item: HTMLTableRowElement = <any>reviewitem.cloneNode(true);
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
                } else {
                    if (reviewinfo.remark == '1') {
                        $(item).find("#remark").text("领取成功");
                        $(item).find("#review_updatetime").text(new Date(reviewinfo.updatetime).toLocaleDateString());
                    } else {
                        $(item).find("#remark").text("领取失败");
                        $(item).find("#review_updatetime").text(new Date(reviewinfo.updatetime).toLocaleDateString());
                    }
                }
                $(item).find("#review_createtime").text(new Date(reviewinfo.createtime).toLocaleDateString());
                reviewtable.appendChild(item);
                reviewitems.push(item);
                (function (mdata: ADMIN.ADMINGETALLREVIEWACCOUNTINFO) {
                    $("#pass_all").click(ev => {
                        var para: ADMIN.ADMINGETCHECKREVIEWACCOUNTREQ = new ADMIN.ADMINGETCHECKREVIEWACCOUNTREQ();
                        var reviewname = PUTILS_NEW.getCheckValues(document.getElementById('reviewitems'));
                        para.reviewname = reviewname;
                        ADMIN.adminGetCheckReviewAccountList(para, resp => {
                            if (resp.errno != 0) {
                                alert(resp.message);
                                return;
                            }
                            var data: ADMIN.ADMINDELREVIEWACCOUNT[] = resp.data;

                            ADMIN.adminpassReviewAccount(data, resp => {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                console.log("成功");
                                window.location.reload();
                            });
                        })
                    });
                    $("#not_pass").click(ev => {
                        var para: ADMIN.ADMINGETCHECKREVIEWACCOUNTREQ = new ADMIN.ADMINGETCHECKREVIEWACCOUNTREQ();
                        var reviewname = PUTILS_NEW.getCheckValues(document.getElementById('reviewitems'));
                        para.reviewname = reviewname;
                        ADMIN.adminGetCheckReviewAccountList(para, resp => {
                            if (resp.errno != 0) {
                                alert(resp.message);
                                return;
                            }
                            var data: ADMIN.ADMINDELREVIEWACCOUNT[] = resp.data;

                            ADMIN.adminnotpassReviewAccount(data, resp => {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                console.log("成功");
                                window.location.reload();
                            });
                        })
                    });
                   
                })(reviewinfo);
            }
        });
    }
    //添加高级福利
    export function addAccount() {
        var list_game = $("#gamelist option:selected");
        var para: ADMIN.ADMINADDACCOUNTREQ = new ADMIN.ADMINADDACCOUNTREQ();
        para.appname = list_game.text();
        para.title = $("#add_account_name").val();
        para.condition = $('input:radio[name="type"]:checked').val();
        para.pricelow = $("#add_pricelow").val();
        para.pricehigh = $("#add_pricehigh").val();
        var arr_title = [];
        $(".title").each(function () {
            arr_title.push($(this).val());
        })
        var arr_condition = [];
        $(".condition").each(function () {
            arr_condition.push($(this).val());
        })
        var arr_value = [];
        $(".value").each(function () {
            arr_value.push($(this).val());
        })
        var arr_count = [];
        $(".count").each(function () {
            arr_count.push($(this).val());
        })
        para.accounttitle = arr_title;
        para.accountcondition = arr_condition;
        para.accountprice = arr_value;
        para.accountsurplu = arr_count;
        ADMIN.adminAddAccount(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }
    export function loadGameList_new() {//加载游戏列表
        var selh5game: HTMLSelectElement = <any>document.getElementById("gamelist");
        GAMECENTER.gsUserGetH5AppList({ id: null }, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat: GAMECENTER.GSUSERGETH5APPLISTRESP = resp.data;
            var h5applist: GAMECENTER.H5APPINFO[] = dat.applist;
            for (var i = 0; i < h5applist.length; i++) {
                var opt: HTMLOptionElement = document.createElement("option");
                opt.innerText = h5applist[i].name;
                opt.value = h5applist[i].id.toString();
                selh5game.add(opt, i);
            }
        });
    }
    $("#reviewmain").click(function () {
        ACCOUNT.loadReviewAccount(null, null);
    })
}    