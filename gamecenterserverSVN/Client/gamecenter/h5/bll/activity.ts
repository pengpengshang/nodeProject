$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", () => {
                window.location.href = "login.html";
            });
            return;
        }
        ACVIVITY_SECOND.loadDefaultData();
    });
});

module ACVIVITY_SECOND {
    export function loadDefaultData() {
        //GAMECENTER.newMessage();
        loadActivityList();
        loadBanner();
    }






    /*********************加载Banner图************************/

    export function loadBanner() {
        var banner: HTMLDivElement = <any>document.getElementById("activity_banner");
        var para: GAMECENTER.GAMEACTIVITYINFOREQ = new GAMECENTER.GAMEACTIVITYINFOREQ();
        GAMECENTER.getActivityBanner(para, resp => {//获取banner数据
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var ads: GAMECENTER.GAMEACTIVITYINFO[] = resp.data;
            for (var i = 0; i < ads.length; i++) {
                var adItem: HTMLDivElement = document.createElement("div");
                var link: HTMLLinkElement = <any>document.createElement("a");
                var img: HTMLImageElement = document.createElement("img");
                var bannerinfo: GAMECENTER.GAMEACTIVITYINFO = ads[i];
                (function fun(data: GAMECENTER.GAMEACTIVITYINFO) {
                    link.onclick = function () {
                        window.location.href = "activitydetail.html?acId=" + data.id;
                    };
                })(bannerinfo);
                img.src = bannerinfo.banner;
                img.setAttribute("class", "bannerImg");
                link.appendChild(img);
                adItem.setAttribute("class", "swiper-slide");
                adItem.appendChild(link);
                banner.appendChild(adItem);
            }
            var swiper = new Swiper('.bannerx', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                spaceBetween: 30,
                autoplay: 3000,
                centeredSlides: true,
                grabCursor: true,
                loop: true,
                autoplayDisableOnInteraction: false
            });
        });
    }












    export function loadActivityList() {
        var activitylist: HTMLUListElement = <any>document.getElementById("activity_all");
        var activityitem: HTMLLIElement = <any>activitylist.firstElementChild;
        var activityitems: HTMLLIElement[] = [];



        var activitylist_hot: HTMLUListElement = <any>document.getElementById("activity_all_hot");
        var activityitem_hot: HTMLLIElement = <any>activitylist_hot.firstElementChild;
        var activityitems_hot: HTMLLIElement[] = [];


        activityitem_hot.style.display = "none";
        for (var i = 0; i < activityitems_hot.length; i++) {
            activitylist_hot.removeChild(activityitems_hot[i]);
        }
        activityitems_hot.splice(0);


        activityitem.style.display = "none";
        for (var i = 0; i < activityitems.length; i++) {
            activitylist.removeChild(activityitems[i]);
        }
        activityitems.splice(0);
        var para: GAMECENTER.GAMEACTIVITYINFOREQ = new GAMECENTER.GAMEACTIVITYINFOREQ();
        para.loginid = GAMECENTER.userinfo.sdkloginid;
        var activity_list: GAMECENTER.GAMEACTIVITYINFO[] = [];
        var activity_list_hot: GAMECENTER.GAMEACTIVITYINFO[] = [];
        GAMECENTER.getActivityList(para, resp => {//获取活动列表
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat: GAMECENTER.GAMEACTIVITYINFOLISTRESP = resp.data;

            for (var i = 0; i < dat.gameactivitylist.length; i++) {
                if (dat.gameactivitylist[i].ishot == 1) {
                    activity_list_hot.push(dat.gameactivitylist[i]);
                } else {
                    activity_list.push(dat.gameactivitylist[i]);
                }
            }





            for (var i = 0; i < activity_list_hot.length; i++) {
                var actinfo_hot: GAMECENTER.GAMEACTIVITYINFO = activity_list_hot[i];
                var items_hot: HTMLLIElement = <any>activityitem_hot.cloneNode(true);
                $(items_hot).find("#activity_appname_hot").text(actinfo_hot.appname);

                if ((actinfo_hot.title).length > 20) {
                    $(items_hot).find("#activity_title_hot").text((actinfo_hot.title).substr(0, 20) + "...");
                } else {
                    $(items_hot).find("#activity_title_hot").text(actinfo_hot.title);
                }
                if (actinfo_hot.ishot == 1) {
                    $(items_hot).find("#ishot_hot").attr("src", "../img/game/gamedetail/HOT_lable.png");
                } else {
                    $(items_hot).find("#ishot_hot").css("display", "none");
                }
                if (actinfo_hot.lable == '更新') {
                    $(items_hot).find("#lable_hot").attr("src", "../img/game/activity/activity_gengxin.png");
                }
                if (actinfo_hot.lable == '热闻') {
                    $(items_hot).find("#lable_hot").attr("src", "../img/game/activity/activity_news.png");
                }
                if (actinfo_hot.lable == '维护') {
                    $(items_hot).find("#lable_hot").attr("src", "../img/game/activity/activity_weihu.png");
                }
                if (actinfo_hot.lable == '攻略') {
                    $(items_hot).find("#lable_hot").attr("src", "../img/game/activity/activity_huodong.png");
                }

                (function fun(data: GAMECENTER.GAMEACTIVITYINFO) {
                    $(items_hot).find("#activity_title_hot").click(ev => {
                        window.location.href = 'activitydetail.html?acId=' + data.id;
                    });
                })(actinfo_hot);
                items_hot.style.display = "";
                activitylist_hot.appendChild(items_hot);
                activityitems_hot.push(items_hot);
            }











            for (var i = 0; i < activity_list.length; i++) {
                var actinfo: GAMECENTER.GAMEACTIVITYINFO = activity_list[i];
                var items: HTMLLIElement = <any>activityitem.cloneNode(true);
                $(items).find("#activity_appname").text(actinfo.appname);

                if ((actinfo.title).length > 20) {
                    $(items).find("#activity_title").text((actinfo.title).substr(0, 20) + "...");
                } else {
                    $(items).find("#activity_title").text(actinfo.title);
                }
                if (actinfo.ishot == 1) {
                    $(items).find("#ishot").attr("src", "../img/game/gamedetail/HOT_lable.png");
                } else {
                    $(items).find("#ishot").css("display","none");
                }
                if (actinfo.lable == '更新') {
                    $(items).find("#lable").attr("src","../img/game/activity/activity_gengxin.png");
                }
                if (actinfo.lable == '热闻') {
                    $(items).find("#lable").attr("src", "../img/game/activity/activity_news.png");
                }
                if (actinfo.lable == '维护') {
                    $(items).find("#lable").attr("src", "../img/game/activity/activity_weihu.png");
                }
                if (actinfo.lable == '攻略') {
                    $(items).find("#lable").attr("src", "../img/game/activity/activity_huodong.png");
                }

                (function fun(data: GAMECENTER.GAMEACTIVITYINFO) {
                    $(items).find("#activity_title").click(ev => {
                        window.location.href = 'activitydetail.html?acId=' + data.id;
                    });
                })(actinfo);
                items.style.display = "";
                activitylist.appendChild(items);
                activityitems.push(items);
            }
        })
    }
}

