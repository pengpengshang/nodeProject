var PUTILS_NEW;
(function (PUTILS_NEW) {
    function checkFileType(f, limit) {
        if ("" == f.value) {
            alert("请上传图片");
            return false;
        }
        else {
            var ext = "\.(gif|jpg|png|GIF|JPG|PNG)";
            if (f.files[0].name.search(ext) == -1) {
                alert("文件类型错误，请重新上传");
                return false;
            }
            else {
                var filesize = Math.round(f.files[0].size / 1024 * 100) / 100; //kb
                if (filesize > limit) {
                    alert("文件大小错误，不得超过" + limit + "k");
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    }
    function checkPicSize(f, img_hide, img, width, height) {
        img_hide.src = utils.getFileUrl(f);
        img_hide.onload = function () {
            var imgwidth = img_hide.naturalWidth;
            var imgheight = img_hide.naturalHeight;
            if (imgwidth != width && imgheight != height) {
                alert("上传错误，图片尺寸应为" + width + "x" + height);
            }
            else {
                img.src = img_hide.src;
            }
        };
    }
    function checkIconFileSize(f, img_hide, img) {
        if (checkFileType(f, 3096)) {
            checkPicSize(f, img_hide, img, 120, 120);
        }
    }
    PUTILS_NEW.checkIconFileSize = checkIconFileSize;
    function checkBannerFileSize(f, smalimg_hide, img) {
        if (checkFileType(f, 3096)) {
            checkPicSize(f, smalimg_hide, img, 285, 160);
        }
    }
    PUTILS_NEW.checkBannerFileSize = checkBannerFileSize;
    function checkBACKFileSize(f, img_hide, img) {
        if (checkFileType(f, 1024)) {
            checkPicSize(f, img_hide, img, 640, 1136);
        }
    }
    PUTILS_NEW.checkBACKFileSize = checkBACKFileSize;
    function checkADFileSize(f, img_hide, img) {
        if (checkFileType(f, 1024)) {
            checkPicSize(f, img_hide, img, 640, 250);
        }
    }
    PUTILS_NEW.checkADFileSize = checkADFileSize;
    function checkADbannerFileSize(f, img_hide, img) {
        if (checkFileType(f, 1024)) {
            checkPicSize(f, img_hide, img, 640, 130);
        }
    }
    PUTILS_NEW.checkADbannerFileSize = checkADbannerFileSize;
    function checkAll(doc) {
        var code_Values = doc.getElementsByTagName("input");
        for (var i = 0; i < code_Values.length; i++) {
            if (code_Values[i].type == "checkbox") {
                code_Values[i].checked = true;
            }
        }
    }
    PUTILS_NEW.checkAll = checkAll;
    function cancelCheck(doc) {
        var code_Values = doc.getElementsByTagName("input");
        for (var i = 0; i < code_Values.length; i++) {
            if (code_Values[i].type == "checkbox") {
                code_Values[i].checked = false;
            }
        }
    }
    PUTILS_NEW.cancelCheck = cancelCheck;
    function getCheckValues(doc) {
        var code_Values = doc.getElementsByTagName("input");
        var items = [];
        for (var i = 0; i < code_Values.length; i++) {
            if (code_Values[i].type == "checkbox") {
                if (code_Values[i].checked) {
                    items.push(code_Values[i].value);
                }
            }
        }
        return items;
    }
    PUTILS_NEW.getCheckValues = getCheckValues;
    function getCheckValues_ceshi(doc) {
        var code_Values = doc.getElementsByTagName("input");
        var items = [];
        for (var i = 0; i < code_Values.length; i++) {
            if (code_Values[i].type == "checkbox") {
                if (code_Values[i].checked) {
                    items.push(code_Values[i].title);
                }
            }
        }
        return items;
    }
    PUTILS_NEW.getCheckValues_ceshi = getCheckValues_ceshi;
})(PUTILS_NEW || (PUTILS_NEW = {}));
//# sourceMappingURL=public.js.map