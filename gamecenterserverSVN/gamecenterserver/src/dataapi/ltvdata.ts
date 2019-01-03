//LTV数据接口
import {H5APPINFO} from "../game/gamecenter";
declare function require(name: string);
import app=require("../app");
import gameapi = require("../game/gameapi");

export function InitApi(){

    class LTVGAMEUSERDATAREQ extends gameapi.CRYDATABASEINFO{
        userid:number;
    }

    class LTVGAMEUSERDATARESP{
        userid:string;
        loginid:string;
        regtime:string;
        regip:string;
    }


    app.app.get("/getgameuserdata", function (req, res) {
        let param:LTVGAMEUSERDATAREQ = req.query;
        let sql = "SELECT userid,loginid,UNIX_TIMESTAMP(regtime) regtime,regip FROM t_gameuser WHERE DATE(regtime)>DATE_SUB(CURRENT_DATE,INTERVAL 3 DAY) AND userid>? LIMIT 0,20";
        let sqlparam:any[] = [];
        sqlparam.push(param.userid);
        if(!!!param.userid || param.userid==0){
            res.send([],0,"empty");
            return;
        }
        gameapi.conn.query(sql,sqlparam,(err,rows,fields)=>{
            if (err) {
                res.send(null,1,err.message)
                throw err;
            }
            let ltvgsuds:LTVGAMEUSERDATARESP[] = [];
            for (let i = 0; i < rows.length; i++) {
                let info: LTVGAMEUSERDATARESP = rows[i];
                ltvgsuds[i] = info;
            }
            res.send(ltvgsuds,0,"SUCCESS");
        })
    });

    app.AddSdkApi("getgameuserdata",(req)=>{//从数据库中拉去gameuser数据
        let param:LTVGAMEUSERDATAREQ = req.param;
        let sql = "SELECT userid,loginid,UNIX_TIMESTAMP(regtime) regtime,regip FROM t_gameuser WHERE DATE(regtime)>DATE_SUB(CURRENT_DATE,INTERVAL 3 DAY) AND userid>? LIMIT 0,20";
        let sqlparam:any[] = [];
        sqlparam.push(param.userid);
        if(!!!param.userid || param.userid==0){
            req.send([],0,"empty");
            return;
        }
        gameapi.conn.query(sql,sqlparam,(err,rows,fields)=>{
            if (err) {
                req.send(null,1,err.message)
                throw err;
            }
            let ltvgsuds:LTVGAMEUSERDATARESP[] = [];
            for (let i = 0; i < rows.length; i++) {
                let info: LTVGAMEUSERDATARESP = rows[i];
                ltvgsuds[i] = info;
            }
            req.send(ltvgsuds,0,"SUCCESS");
        })
    })

    class LTVSDKUSERDATAREQ extends gameapi.CRYDATABASEINFO{
        id:number;
    }

    class LTVSDKUSERDATARESP{
        id:number;
        userid:string;
        sdkuserid:string;
        sdkid:number;
        createtime:string;
    }


    app.app.get("/getsdkuserdata", function (req, res) {
        let param:LTVSDKUSERDATAREQ = req.query;
        let sql = "SELECT id,userid,sdkuserid,sdkid,UNIX_TIMESTAMP(createtime) createtime FROM t_sdkuser WHERE DATE(createtime)>DATE_SUB(CURRENT_DATE,INTERVAL 3 DAY) AND id>?  LIMIT 0,20";
        let sqlparam:any[] = [];
        sqlparam.push(param.id);
        if(!!!param.id || param.id==0){
            res.send([],0,"empty");
            return;
        }
        gameapi.conn.query(sql,sqlparam,(err,rows,fields)=>{
            if (err) {
                res.send(null,1,err.message)
                throw err;
            }
            let ltvsuds:LTVSDKUSERDATARESP[] = [];
            for (let i = 0; i < rows.length; i++) {
                let info: LTVSDKUSERDATARESP = rows[i];
                ltvsuds[i] = info;
            }
            res.send(ltvsuds,0,"SUCCESS");
        })
    });

    app.AddSdkApi("getsdkuserdata",(req)=>{//从数据库中拉去sdkuser数据
        let param:LTVSDKUSERDATAREQ = req.param;
        let sql = "SELECT id,userid,sdkuserid,sdkid,UNIX_TIMESTAMP(createtime) createtime FROM t_sdkuser WHERE DATE(createtime)>DATE_SUB(CURRENT_DATE,INTERVAL 3 DAY) AND id>?  LIMIT 0,20";
        let sqlparam:any[] = [];
        sqlparam.push(param.id);
        if(!!!param.id || param.id==0){
            req.send([],0,"empty");
            return;
        }
        gameapi.conn.query(sql,sqlparam,(err,rows,fields)=>{
            if (err) {
                req.send(null,1,err.message)
                throw err;
            }
            let ltvsuds:LTVSDKUSERDATARESP[] = [];
            for (let i = 0; i < rows.length; i++) {
                let info: LTVSDKUSERDATARESP = rows[i];
                ltvsuds[i] = info;
            }
            req.send(ltvsuds,0,"SUCCESS");
        })
    })

    class LTVUSERPAYDATAREQ extends gameapi.CRYDATABASEINFO{
        paytime:number;
    }

    class LTVUSERPAYDATARESP{
        id:number;
        payid:string;
        appid:number;
        channelid:number;
        userid:string;
        createtime:string;
        goodsname:string;
        orderid:string;
        money:any;
        goodsnum:string;
        payrmb:any;
        paytime:string;
        state:number;
    }

    app.app.get("/getuserpaydata", function (req, res) {
        let param:LTVUSERPAYDATAREQ = req.query;
        let sql = "SELECT id, payid, appid, channelid, userid , UNIX_TIMESTAMP(createtime) createtime, goodsname, orderid, money, goodsnum , payrmb, UNIX_TIMESTAMP(paytime) paytime, state FROM t_userpay WHERE UNIX_TIMESTAMP(paytime) >= ?  AND state > 0 LIMIT 0, 20";
        let sqlparam:any[] = [];
        sqlparam.push(param.paytime);
        if(!!!param || param.paytime==0){
            res.send([],0,"empty");
            return;
        }
        gameapi.conn.query(sql,sqlparam,(err,rows,fields)=>{
            if (err) {
                res.send(null,1,err.message)
                throw err;
            }
            let ltvgupds:LTVSDKUSERDATARESP[] = [];
            for (let i = 0; i < rows.length; i++) {
                let info: LTVSDKUSERDATARESP = rows[i];
                ltvgupds[i] = info;
            }
            res.send(ltvgupds,0,"SUCCESS");
        })
    });

    app.AddSdkApi("getuserpaydata",(req)=>{//从数据库中拉去userpay数据
        let param:LTVUSERPAYDATAREQ = req.param;
        let sql = "SELECT id, payid, appid, channelid, userid , UNIX_TIMESTAMP(createtime) createtime, goodsname, orderid, money, goodsnum , payrmb, UNIX_TIMESTAMP(paytime) paytime, state FROM t_userpay WHERE ? > UNIX_TIMESTAMP(paytime) AND state > 0 LIMIT 0, 20";
        let sqlparam:any[] = [];
        sqlparam.push(param.paytime);
        if(!!!param || param.paytime==0){
            req.send([],0,"empty");
            return;
        }
        gameapi.conn.query(sql,sqlparam,(err,rows,fields)=>{
            if (err) {
                req.send(null,1,err.message)
                throw err;
            }
            let ltvgupds:LTVSDKUSERDATARESP[] = [];
            for (let i = 0; i < rows.length; i++) {
                let info: LTVSDKUSERDATARESP = rows[i];
                ltvgupds[i] = info;
            }
            req.send(ltvgupds,0,"SUCCESS");
        })
    })
}
