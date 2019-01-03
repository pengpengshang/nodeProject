"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var app = require("../app");
var gameapi = require("../game/gameapi");
function InitApi() {
    var LTVGAMEUSERDATAREQ = (function (_super) {
        __extends(LTVGAMEUSERDATAREQ, _super);
        function LTVGAMEUSERDATAREQ() {
            _super.apply(this, arguments);
        }
        return LTVGAMEUSERDATAREQ;
    }(gameapi.CRYDATABASEINFO));
    var LTVGAMEUSERDATARESP = (function () {
        function LTVGAMEUSERDATARESP() {
        }
        return LTVGAMEUSERDATARESP;
    }());
    app.app.get("/getgameuserdata", function (req, res) {
        var param = req.query;
        var sql = "SELECT userid,loginid,UNIX_TIMESTAMP(regtime) regtime,regip FROM t_gameuser WHERE DATE(regtime)>DATE_SUB(CURRENT_DATE,INTERVAL 3 DAY) AND userid>? LIMIT 0,20";
        var sqlparam = [];
        sqlparam.push(param.userid);
        if (!!!param.userid || param.userid == 0) {
            res.send([], 0, "empty");
            return;
        }
        gameapi.conn.query(sql, sqlparam, function (err, rows, fields) {
            if (err) {
                res.send(null, 1, err.message);
                throw err;
            }
            var ltvgsuds = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                ltvgsuds[i] = info;
            }
            res.send(ltvgsuds, 0, "SUCCESS");
        });
    });
    app.AddSdkApi("getgameuserdata", function (req) {
        var param = req.param;
        var sql = "SELECT userid,loginid,UNIX_TIMESTAMP(regtime) regtime,regip FROM t_gameuser WHERE DATE(regtime)>DATE_SUB(CURRENT_DATE,INTERVAL 3 DAY) AND userid>? LIMIT 0,20";
        var sqlparam = [];
        sqlparam.push(param.userid);
        if (!!!param.userid || param.userid == 0) {
            req.send([], 0, "empty");
            return;
        }
        gameapi.conn.query(sql, sqlparam, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            var ltvgsuds = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                ltvgsuds[i] = info;
            }
            req.send(ltvgsuds, 0, "SUCCESS");
        });
    });
    var LTVSDKUSERDATAREQ = (function (_super) {
        __extends(LTVSDKUSERDATAREQ, _super);
        function LTVSDKUSERDATAREQ() {
            _super.apply(this, arguments);
        }
        return LTVSDKUSERDATAREQ;
    }(gameapi.CRYDATABASEINFO));
    var LTVSDKUSERDATARESP = (function () {
        function LTVSDKUSERDATARESP() {
        }
        return LTVSDKUSERDATARESP;
    }());
    app.app.get("/getsdkuserdata", function (req, res) {
        var param = req.query;
        var sql = "SELECT id,userid,sdkuserid,sdkid,UNIX_TIMESTAMP(createtime) createtime FROM t_sdkuser WHERE DATE(createtime)>DATE_SUB(CURRENT_DATE,INTERVAL 3 DAY) AND id>?  LIMIT 0,20";
        var sqlparam = [];
        sqlparam.push(param.id);
        if (!!!param.id || param.id == 0) {
            res.send([], 0, "empty");
            return;
        }
        gameapi.conn.query(sql, sqlparam, function (err, rows, fields) {
            if (err) {
                res.send(null, 1, err.message);
                throw err;
            }
            var ltvsuds = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                ltvsuds[i] = info;
            }
            res.send(ltvsuds, 0, "SUCCESS");
        });
    });
    app.AddSdkApi("getsdkuserdata", function (req) {
        var param = req.param;
        var sql = "SELECT id,userid,sdkuserid,sdkid,UNIX_TIMESTAMP(createtime) createtime FROM t_sdkuser WHERE DATE(createtime)>DATE_SUB(CURRENT_DATE,INTERVAL 3 DAY) AND id>?  LIMIT 0,20";
        var sqlparam = [];
        sqlparam.push(param.id);
        if (!!!param.id || param.id == 0) {
            req.send([], 0, "empty");
            return;
        }
        gameapi.conn.query(sql, sqlparam, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            var ltvsuds = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                ltvsuds[i] = info;
            }
            req.send(ltvsuds, 0, "SUCCESS");
        });
    });
    var LTVUSERPAYDATAREQ = (function (_super) {
        __extends(LTVUSERPAYDATAREQ, _super);
        function LTVUSERPAYDATAREQ() {
            _super.apply(this, arguments);
        }
        return LTVUSERPAYDATAREQ;
    }(gameapi.CRYDATABASEINFO));
    var LTVUSERPAYDATARESP = (function () {
        function LTVUSERPAYDATARESP() {
        }
        return LTVUSERPAYDATARESP;
    }());
    app.app.get("/getuserpaydata", function (req, res) {
        var param = req.query;
        var sql = "SELECT id, payid, appid, channelid, userid , UNIX_TIMESTAMP(createtime) createtime, goodsname, orderid, money, goodsnum , payrmb, UNIX_TIMESTAMP(paytime) paytime, state FROM t_userpay WHERE UNIX_TIMESTAMP(paytime) >= ?  AND state > 0 LIMIT 0, 20";
        var sqlparam = [];
        sqlparam.push(param.paytime);
        if (!!!param || param.paytime == 0) {
            res.send([], 0, "empty");
            return;
        }
        gameapi.conn.query(sql, sqlparam, function (err, rows, fields) {
            if (err) {
                res.send(null, 1, err.message);
                throw err;
            }
            var ltvgupds = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                ltvgupds[i] = info;
            }
            res.send(ltvgupds, 0, "SUCCESS");
        });
    });
    app.AddSdkApi("getuserpaydata", function (req) {
        var param = req.param;
        var sql = "SELECT id, payid, appid, channelid, userid , UNIX_TIMESTAMP(createtime) createtime, goodsname, orderid, money, goodsnum , payrmb, UNIX_TIMESTAMP(paytime) paytime, state FROM t_userpay WHERE ? > UNIX_TIMESTAMP(paytime) AND state > 0 LIMIT 0, 20";
        var sqlparam = [];
        sqlparam.push(param.paytime);
        if (!!!param || param.paytime == 0) {
            req.send([], 0, "empty");
            return;
        }
        gameapi.conn.query(sql, sqlparam, function (err, rows, fields) {
            if (err) {
                req.send(null, 1, err.message);
                throw err;
            }
            var ltvgupds = [];
            for (var i = 0; i < rows.length; i++) {
                var info = rows[i];
                ltvgupds[i] = info;
            }
            req.send(ltvgupds, 0, "SUCCESS");
        });
    });
}
exports.InitApi = InitApi;
//# sourceMappingURL=ltvdata.js.map