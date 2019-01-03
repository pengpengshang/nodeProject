var egret, __extends, egret_dom, testDeviceType, testRuntimeType, __global, egret_sin_map, egret_cos_map, i, RES, egret_html5_localStorage, egret_h5_graphics, egret_webgl_graphics, GamePanel, StartPanel, Main, Greens, Logic, OverPanel, PausePanel;
!function(a) {
    function b(b) {
        var c, d, e, f;
        for (c = [],
        d = 1; d < arguments.length; d++)
            c[d - 1] = arguments[d];
        if (d = a.egret_string_code[b])
            for (e = c.length,
            f = 0; e > f; f++)
                d = d.replace("{" + f + "}", c[f]);
        return d
    }
    var c = function() {
        function c() {}
        return c.fatal = function(b, c) {
            throw void 0 === c && (c = null ),
            a.Logger.traceToConsole("Fatal", b, c),
            Error(a.Logger.getTraceCode("Fatal", b, c))
        }
        ,
        c.info = function(b, c) {
            void 0 === c && (c = null ),
            a.Logger.traceToConsole("Info", b, c)
        }
        ,
        c.warning = function(b, c) {
            void 0 === c && (c = null ),
            a.Logger.traceToConsole("Warning", b, c)
        }
        ,
        c.fatalWithErrorId = function(a) {
            for (var d = [], e = 1; e < arguments.length; e++)
                d[e - 1] = arguments[e];
            d.unshift(a),
            (d = b.apply(null , d)) ? c.fatal(d) : c.warning(b(-1, a))
        }
        ,
        c.infoWithErrorId = function(a) {
            for (var d = [], e = 1; e < arguments.length; e++)
                d[e - 1] = arguments[e];
            d.unshift(a),
            (d = b.apply(null , d)) ? c.info(d) : c.warning(b(-1, a))
        }
        ,
        c.warningWithErrorId = function(a) {
            for (var d = [], e = 1; e < arguments.length; e++)
                d[e - 1] = arguments[e];
            d.unshift(a),
            (d = b.apply(null , d)) ? c.warning(d) : c.warning(b(-1, a))
        }
        ,
        c.traceToConsole = function(b, c, d) {
            console.log(a.Logger.getTraceCode(b, c, d))
        }
        ,
        c.getTraceCode = function(a, b, c) {
            return "[" + a + "]" + b + (null  == c ? "" : ":" + c)
        }
        ,
        c
    }
    ();
    a.Logger = c,
    c.prototype.__class__ = "egret.Logger",
    a.egret_string_code = {},
    a.egret_string_code[-1] = "不存在的stringId:{0}",
    a.egret_string_code[1e3] = "Browser.isMobile接口参数已经变更，请尽快调整用法为 egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE",
    a.egret_string_code[1001] = "该方法目前不应传入 resolutionPolicy 参数，请在 docs/1.0_Final_ReleaseNote中查看如何升级",
    a.egret_string_code[1002] = "egret.Ticker是框架内部使用的单例，不允许在外部实例化，计时器请使用egret.Timer类！",
    a.egret_string_code[1003] = "Ticker#setTimeout方法即将废弃,请使用egret.setTimeout",
    a.egret_string_code[1004] = "ExternalInterface调用了js没有注册的方法: {0}",
    a.egret_string_code[1005] = "设置了已经存在的blendMode: {0}",
    a.egret_string_code[1006] = "child不在当前容器内",
    a.egret_string_code[1007] = "提供的索引超出范围",
    a.egret_string_code[1008] = "child未被addChild到该parent",
    a.egret_string_code[1009] = "设置了已经存在的适配模式:{0}",
    a.egret_string_code[1010] = "addEventListener侦听函数不能为空",
    a.egret_string_code[1011] = 'BitmapText找不到文字所对应的纹理:"{0}"',
    a.egret_string_code[1012] = "egret.BitmapTextSpriteSheet已废弃，请使用egret.BitmapFont代替。",
    a.egret_string_code[1013] = "TextField.setFocus 没有实现",
    a.egret_string_code[1014] = "Ease不能被实例化",
    a.egret_string_code[1015] = "xml not found!",
    a.egret_string_code[1016] = "{0}已经废弃",
    a.egret_string_code[1017] = "JSON文件格式不正确: {0}\ndata: {1}",
    a.egret_string_code[1018] = "egret_html5_localStorage.setItem保存失败,key={0}&value={1}",
    a.egret_string_code[1019] = "网络异常:{0}",
    a.egret_string_code[1020] = "无法初始化着色器",
    a.egret_string_code[1021] = "当前浏览器不支持webgl",
    a.egret_string_code[1022] = "{0} ArgumentError",
    a.egret_string_code[1023] = "此方法在ScrollView内不可用!",
    a.egret_string_code[1024] = "使用了尚未实现的ScaleMode",
    a.egret_string_code[1025] = "遇到文件尾",
    a.egret_string_code[1026] = "EncodingError! The code point {0} could not be encoded.",
    a.egret_string_code[1027] = "DecodingError",
    a.egret_string_code[1028] = "调用了未配置的注入规则:{0}。 请先在项目初始化里配置指定的注入规则，再调用对应单例。",
    a.egret_string_code[1029] = "Function.prototype.bind - what is trying to be bound is not callable",
    a.egret_string_code[1030] = "该API已废弃",
    a.egret_string_code[2e3] = "RES.createGroup()传入了配置中不存在的键值: {0}",
    a.egret_string_code[2001] = 'RES加载了不存在或空的资源组:"{0}"',
    a.egret_string_code[3e3] = "主题配置文件加载失败: {0}",
    a.egret_string_code[3001] = "找不到主题中所配置的皮肤类名: {0}",
    a.egret_string_code[3002] = '索引:"{0}"超出集合元素索引范围',
    a.egret_string_code[3003] = "在此组件中不可用，若此组件为容器类，请使用",
    a.egret_string_code[3004] = "addChild(){0}addElement()代替",
    a.egret_string_code[3005] = "addChildAt(){0}addElementAt()代替",
    a.egret_string_code[3006] = "removeChild(){0}removeElement()代替",
    a.egret_string_code[3007] = "removeChildAt(){0}removeElementAt()代替",
    a.egret_string_code[3008] = "setChildIndex(){0}setElementIndex()代替",
    a.egret_string_code[3009] = "swapChildren(){0}swapElements()代替",
    a.egret_string_code[3010] = "swapChildrenAt(){0}swapElementsAt()代替",
    a.egret_string_code[3011] = '索引:"{0}"超出可视元素索引范围',
    a.egret_string_code[3012] = "此方法在Scroller组件内不可用!",
    a.egret_string_code[3013] = "UIStage是GUI根容器，只能有一个此实例在显示列表中！",
    a.egret_string_code[4e3] = "An Bone cannot be added as a child to itself or one of its children (or children's children, etc.)",
    a.egret_string_code[4001] = "Abstract class can not be instantiated!",
    a.egret_string_code[4002] = "Unnamed data!",
    a.egret_string_code[4003] = "Nonsupport version!",
    a.egret_string_code[3100] = "当前浏览器不支持WebSocket",
    a.egret_string_code[3101] = "请先连接WebSocket",
    a.getString = b
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function a() {
            this._hashCode = a.hashCount++
        }
        return Object.defineProperty(a.prototype, "hashCode", {
            get: function() {
                return this._hashCode
            },
            enumerable: !0,
            configurable: !0
        }),
        a.hashCount = 1,
        a
    }
    ();
    a.HashObject = b,
    b.prototype.__class__ = "egret.HashObject"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b(b) {
            void 0 === b && (b = 300),
            a.call(this),
            this.objectPool = [],
            this._length = 0,
            1 > b && (b = 1),
            this.autoDisposeTime = b,
            this.frameCount = 0
        }
        return __extends(b, a),
        b.prototype._checkFrame = function() {
            this.frameCount--,
            0 >= this.frameCount && this.dispose()
        }
        ,
        Object.defineProperty(b.prototype, "length", {
            get: function() {
                return this._length
            },
            enumerable: !0,
            configurable: !0
        }),
        b.prototype.push = function(a) {
            var c = this.objectPool;
            -1 == c.indexOf(a) && (c.push(a),
            a.__recycle && a.__recycle(),
            this._length++,
            0 == this.frameCount && (this.frameCount = this.autoDisposeTime,
            b._callBackList.push(this)))
        }
        ,
        b.prototype.pop = function() {
            return 0 == this._length ? null  : (this._length--,
            this.objectPool.pop())
        }
        ,
        b.prototype.dispose = function() {
            0 < this._length && (this.objectPool = [],
            this._length = 0),
            this.frameCount = 0;
            var a = b._callBackList
              , c = a.indexOf(this);
            -1 != c && a.splice(c, 1)
        }
        ,
        b._callBackList = [],
        b
    }
    (a.HashObject);
    a.Recycler = b,
    b.prototype.__class__ = "egret.Recycler"
}
(egret || (egret = {})),
function(a) {
    a.__START_TIME,
    a.getTimer = function() {
        return Date.now() - a.__START_TIME
    }
}
(egret || (egret = {})),
function(a) {
    a.__callLaterFunctionList = [],
    a.__callLaterThisList = [],
    a.__callLaterArgsList = [],
    a.callLater = function(b, c) {
        for (var d = [], e = 2; e < arguments.length; e++)
            d[e - 2] = arguments[e];
        a.__callLaterFunctionList.push(b),
        a.__callLaterThisList.push(c),
        a.__callLaterArgsList.push(d)
    }
    ,
    a.__callAsyncFunctionList = [],
    a.__callAsyncThisList = [],
    a.__callAsyncArgsList = [],
    a.__callAsync = function(b, c) {
        for (var d = [], e = 2; e < arguments.length; e++)
            d[e - 2] = arguments[e];
        a.__callAsyncFunctionList.push(b),
        a.__callAsyncThisList.push(c),
        a.__callAsyncArgsList.push(d)
    }
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function b() {}
        return b.prototype.call = function(a) {
            this.callback && this.callback.call(this.thisObject, a)
        }
        ,
        b.prototype.dispose = function() {
            this.thisObject = this.callback = null ,
            b.__freeList.push(this)
        }
        ,
        b.push = function(c, d) {
            var e;
            e = b.__freeList.length ? b.__freeList.pop() : new a.RenderCommand,
            e.callback = c,
            e.thisObject = d,
            a.MainContext.__DRAW_COMMAND_LIST.push(e)
        }
        ,
        b.__freeList = [],
        b
    }
    ();
    a.RenderCommand = b,
    b.prototype.__class__ = "egret.RenderCommand"
}
(egret || (egret = {})),
function(a) {
    function b() {
        for (var a = document.createElement("div").style, b = ["t", "webkitT", "msT", "MozT", "OT"], c = 0; c < b.length; c++)
            if (b[c] + "ransform" in a)
                return b[c];
        return b[0]
    }
    a.header = "",
    a.getHeader = b,
    a.getTrans = function(c) {
        return "" == a.header && (a.header = b()),
        a.header + c.substring(1, c.length)
    }
}
(egret_dom || (egret_dom = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(a, c, d) {
            void 0 === c && (c = !1),
            void 0 === d && (d = !1),
            b.call(this),
            this.data = null ,
            this._type = "",
            this._cancelable = this._bubbles = !1,
            this._eventPhase = 2,
            this._target = this._currentTarget = null ,
            this._isPropagationImmediateStopped = this._isPropagationStopped = this._isDefaultPrevented = !1,
            this.isNew = !0,
            this._type = a,
            this._bubbles = c,
            this._cancelable = d
        }
        return __extends(c, b),
        Object.defineProperty(c.prototype, "type", {
            get: function() {
                return this._type
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "bubbles", {
            get: function() {
                return this._bubbles
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "cancelable", {
            get: function() {
                return this._cancelable
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "eventPhase", {
            get: function() {
                return this._eventPhase
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "currentTarget", {
            get: function() {
                return this._currentTarget
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "target", {
            get: function() {
                return this._target
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype.isDefaultPrevented = function() {
            return this._isDefaultPrevented
        }
        ,
        c.prototype.preventDefault = function() {
            this._cancelable && (this._isDefaultPrevented = !0)
        }
        ,
        c.prototype.stopPropagation = function() {
            this._bubbles && (this._isPropagationStopped = !0)
        }
        ,
        c.prototype.stopImmediatePropagation = function() {
            this._bubbles && (this._isPropagationImmediateStopped = !0)
        }
        ,
        c.prototype._reset = function() {
            this.isNew ? this.isNew = !1 : (this._isPropagationImmediateStopped = this._isPropagationStopped = this._isDefaultPrevented = !1,
            this._currentTarget = this._target = null ,
            this._eventPhase = 2)
        }
        ,
        c.prototype.__recycle = function() {
            this.data = this._target = this._currentTarget = null 
        }
        ,
        c._dispatchByTarget = function(b, c, d, e, f, g) {
            var h, i, j;
            if (void 0 === f && (f = !1),
            void 0 === g && (g = !1),
            h = b.eventRecycler,
            h || (h = b.eventRecycler = new a.Recycler),
            i = h.pop(),
            i ? i._type = d : i = new b(d),
            i._bubbles = f,
            i._cancelable = g,
            e)
                for (j in e)
                    i[j] = e[j],
                    null  !== i[j] && (e[j] = null );
            return b = c.dispatchEvent(i),
            h.push(i),
            b
        }
        ,
        c._getPropertyData = function(a) {
            var b = a._props;
            return b || (b = a._props = {}),
            b
        }
        ,
        c.dispatchEvent = function(a, b, d, e) {
            void 0 === d && (d = !1);
            var f = c._getPropertyData(c);
            e && (f.data = e),
            c._dispatchByTarget(c, a, b, f, d)
        }
        ,
        c.ADDED_TO_STAGE = "addedToStage",
        c.REMOVED_FROM_STAGE = "removedFromStage",
        c.ADDED = "added",
        c.REMOVED = "removed",
        c.COMPLETE = "complete",
        c.LOOP_COMPLETE = "loopcomplete",
        c.ENTER_FRAME = "enterFrame",
        c.RENDER = "render",
        c.FINISH_RENDER = "finishRender",
        c.FINISH_UPDATE_TRANSFORM = "finishUpdateTransform",
        c.LEAVE_STAGE = "leaveStage",
        c.RESIZE = "resize",
        c.CHANGE = "change",
        c.ACTIVATE = "activate",
        c.DEACTIVATE = "deactivate",
        c.CLOSE = "close",
        c.CONNECT = "connect",
        c
    }
    (a.HashObject);
    a.Event = b,
    b.prototype.__class__ = "egret.Event"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b(b, c, d) {
            void 0 === c && (c = !1),
            void 0 === d && (d = !1),
            a.call(this, b, c, d),
            this._status = 0
        }
        return __extends(b, a),
        Object.defineProperty(b.prototype, "status", {
            get: function() {
                return this._status
            },
            enumerable: !0,
            configurable: !0
        }),
        b.dispatchHTTPStatusEvent = function(a, c) {
            null  == b.httpStatusEvent && (b.httpStatusEvent = new b(b.HTTP_STATUS)),
            b.httpStatusEvent._status = c,
            a.dispatchEvent(b.httpStatusEvent)
        }
        ,
        b.HTTP_STATUS = "httpStatus",
        b.httpStatusEvent = null ,
        b
    }
    (a.Event);
    a.HTTPStatusEvent = b,
    b.prototype.__class__ = "egret.HTTPStatusEvent"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(a, c, d) {
            void 0 === c && (c = !1),
            void 0 === d && (d = !1),
            b.call(this, a, c, d)
        }
        return __extends(c, b),
        c.dispatchIOErrorEvent = function(b) {
            a.Event._dispatchByTarget(c, b, c.IO_ERROR)
        }
        ,
        c.IO_ERROR = "ioError",
        c
    }
    (a.Event);
    a.IOErrorEvent = b,
    b.prototype.__class__ = "egret.IOErrorEvent"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(a, c, d, e, f, g, h, i, j, k) {
            void 0 === c && (c = !0),
            void 0 === d && (d = !0),
            void 0 === e && (e = 0),
            void 0 === f && (f = 0),
            void 0 === g && (g = 0),
            void 0 === h && (h = !1),
            void 0 === i && (i = !1),
            void 0 === k && (k = !1),
            b.call(this, a, c, d),
            this._stageY = this._stageX = 0,
            this.touchPointID = 0 / 0,
            this.touchDown = this.altKey = this.shiftKey = this.ctrlKey = !1,
            this.touchPointID = e,
            this._stageX = f,
            this._stageY = g,
            this.ctrlKey = h,
            this.altKey = i,
            this.touchDown = k
        }
        return __extends(c, b),
        Object.defineProperty(c.prototype, "stageX", {
            get: function() {
                return this._stageX
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "stageY", {
            get: function() {
                return this._stageY
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "localX", {
            get: function() {
                return this._currentTarget.globalToLocal(this._stageX, this._stageY, a.Point.identity).x
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "localY", {
            get: function() {
                return this._currentTarget.globalToLocal(this._stageX, this._stageY, a.Point.identity).y
            },
            enumerable: !0,
            configurable: !0
        }),
        c.dispatchTouchEvent = function(b, d, e, f, g, h, i, j, k) {
            void 0 === e && (e = 0),
            void 0 === f && (f = 0),
            void 0 === g && (g = 0),
            void 0 === h && (h = !1),
            void 0 === i && (i = !1),
            void 0 === j && (j = !1),
            void 0 === k && (k = !1);
            var l = a.Event._getPropertyData(c);
            l.touchPointID = e,
            l._stageX = f,
            l._stageY = g,
            l.ctrlKey = h,
            l.altKey = i,
            l.shiftKey = j,
            l.touchDown = k,
            a.Event._dispatchByTarget(c, b, d, l, !0, !0)
        }
        ,
        c.TOUCH_TAP = "touchTap",
        c.TOUCH_MOVE = "touchMove",
        c.TOUCH_BEGIN = "touchBegin",
        c.TOUCH_END = "touchEnd",
        c.TOUCH_RELEASE_OUTSIDE = "touchReleaseOutside",
        c.TOUCH_ROLL_OUT = "touchRollOut",
        c.TOUCH_ROLL_OVER = "touchRollOver",
        c.TOUCH_OUT = "touchOut",
        c.TOUCH_OVER = "touchOver",
        c
    }
    (a.Event);
    a.TouchEvent = b,
    b.prototype.__class__ = "egret.TouchEvent"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(a, c, d) {
            void 0 === c && (c = !1),
            void 0 === d && (d = !1),
            b.call(this, a, c, d)
        }
        return __extends(c, b),
        c.dispatchTimerEvent = function(b, d) {
            a.Event._dispatchByTarget(c, b, d)
        }
        ,
        c.TIMER = "timer",
        c.TIMER_COMPLETE = "timerComplete",
        c
    }
    (a.Event);
    a.TimerEvent = b,
    b.prototype.__class__ = "egret.TimerEvent"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(a, c, d, e, f) {
            void 0 === c && (c = !1),
            void 0 === d && (d = !1),
            void 0 === e && (e = 0),
            void 0 === f && (f = 0),
            b.call(this, a, c, d),
            this.bytesTotal = this.bytesLoaded = 0,
            this.bytesLoaded = e,
            this.bytesTotal = f
        }
        return __extends(c, b),
        c.dispatchProgressEvent = function(b, d, e, f) {
            void 0 === e && (e = 0),
            void 0 === f && (f = 0),
            a.Event._dispatchByTarget(c, b, d, {
                bytesLoaded: e,
                bytesTotal: f
            })
        }
        ,
        c.PROGRESS = "progress",
        c.SOCKET_DATA = "socketData",
        c
    }
    (a.Event);
    a.ProgressEvent = b,
    b.prototype.__class__ = "egret.ProgressEvent"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function a() {}
        return a.CAPTURING_PHASE = 1,
        a.AT_TARGET = 2,
        a.BUBBLING_PHASE = 3,
        a
    }
    ();
    a.EventPhase = b,
    b.prototype.__class__ = "egret.EventPhase"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(a) {
            void 0 === a && (a = null ),
            b.call(this),
            this._captureEventsMap = this._eventsMap = this._eventTarget = null ,
            this._eventTarget = a ? a : this
        }
        return __extends(c, b),
        c.prototype.addEventListener = function(b, c, d, e, f) {
            void 0 === e && (e = !1),
            void 0 === f && (f = 0),
            "undefined" == typeof e && (e = !1),
            "undefined" == typeof f && (f = 0),
            c || a.Logger.fatalWithErrorId(1010),
            e ? (this._captureEventsMap || (this._captureEventsMap = {}),
            e = this._captureEventsMap) : (this._eventsMap || (this._eventsMap = {}),
            e = this._eventsMap);
            var g = e[b];
            g || (g = e[b] = []),
            this._insertEventBin(g, c, d, f)
        }
        ,
        c.prototype._insertEventBin = function(a, b, c, d, e) {
            var f, g, h, i;
            for (void 0 === e && (e = void 0),
            f = -1,
            g = a.length,
            h = 0; g > h; h++) {
                if (i = a[h],
                i.listener === b && i.thisObject === c && i.display === e)
                    return !1;
                -1 == f && i.priority < d && (f = h)
            }
            return b = {
                listener: b,
                thisObject: c,
                priority: d
            },
            e && (b.display = e),
            -1 != f ? a.splice(f, 0, b) : a.push(b),
            !0
        }
        ,
        c.prototype.removeEventListener = function(a, b, c, d) {
            if (void 0 === d && (d = !1),
            d = d ? this._captureEventsMap : this._eventsMap) {
                var e = d[a];
                e && (this._removeEventBin(e, b, c),
                0 == e.length && delete d[a])
            }
        }
        ,
        c.prototype._removeEventBin = function(a, b, c, d) {
            var e, f, g;
            for (void 0 === d && (d = void 0),
            e = a.length,
            f = 0; e > f; f++)
                if (g = a[f],
                g.listener === b && g.thisObject === c && g.display === d)
                    return a.splice(f, 1),
                    !0;
            return !1
        }
        ,
        c.prototype.hasEventListener = function(a) {
            return this._eventsMap && this._eventsMap[a] || this._captureEventsMap && this._captureEventsMap[a]
        }
        ,
        c.prototype.willTrigger = function(a) {
            return this.hasEventListener(a)
        }
        ,
        c.prototype.dispatchEvent = function(a) {
            return a._reset(),
            a._target = this._eventTarget,
            a._currentTarget = this._eventTarget,
            this._notifyListener(a)
        }
        ,
        c.prototype._notifyListener = function(a) {
            var c, d, e, b = 1 == a._eventPhase ? this._captureEventsMap : this._eventsMap;
            if (!b)
                return !0;
            if (b = b[a._type],
            !b)
                return !0;
            if (c = b.length,
            0 == c)
                return !0;
            for (b = b.concat(),
            d = 0; c > d && (e = b[d],
            e.listener.call(e.thisObject, a),
            !a._isPropagationImmediateStopped); d++)
                ;
            return !a._isDefaultPrevented
        }
        ,
        c.prototype.dispatchEventWith = function(b, c, d) {
            void 0 === c && (c = !1),
            a.Event.dispatchEvent(this, b, c, d)
        }
        ,
        c
    }
    (a.HashObject);
    a.EventDispatcher = b,
    b.prototype.__class__ = "egret.EventDispatcher"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this.stage = this.deviceContext = this.netContext = this.touchContext = this.rendererContext = null ,
            this.reuseEvent = new a.Event("")
        }
        return __extends(c, b),
        c.prototype.run = function() {
            a.Ticker.getInstance().run(),
            a.Ticker.getInstance().register(this.renderLoop, this, Number.NEGATIVE_INFINITY),
            a.Ticker.getInstance().register(this.broadcastEnterFrame, this, Number.POSITIVE_INFINITY),
            this.touchContext.run(),
            this._profileInstance = a.Profiler.getInstance()
        }
        ,
        c.prototype.renderLoop = function(b) {
            var d, e, f, g;
            0 < a.__callLaterFunctionList.length && (d = a.__callLaterFunctionList,
            a.__callLaterFunctionList = [],
            e = a.__callLaterThisList,
            a.__callLaterThisList = [],
            f = a.__callLaterArgsList,
            a.__callLaterArgsList = []),
            b = this.stage,
            g = c.cachedEvent,
            g._type = a.Event.RENDER,
            this.dispatchEvent(g),
            a.Stage._invalidateRenderFlag && (this.broadcastRender(),
            a.Stage._invalidateRenderFlag = !1),
            d && this.doCallLaterList(d, e, f),
            0 < a.__callAsyncFunctionList.length && this.doCallAsyncList(),
            d = this.rendererContext,
            d.onRenderStart(),
            d.clearScreen(),
            c.__DRAW_COMMAND_LIST = [],
            c._renderLoopPhase = "updateTransform",
            b._updateTransform(),
            c._renderLoopPhase = "draw",
            g._type = a.Event.FINISH_UPDATE_TRANSFORM,
            this.dispatchEvent(g),
            c.__use_new_draw ? this._draw(d) : b._draw(d),
            g._type = a.Event.FINISH_RENDER,
            this.dispatchEvent(g),
            this._profileInstance._isRunning && this._profileInstance._drawProfiler(),
            d.onRenderFinish()
        }
        ,
        c.prototype._draw = function(a) {
            var b, d, e, f;
            for (b = c.__DRAW_COMMAND_LIST,
            d = b.length,
            e = 0; d > e; e++)
                f = b[e],
                f.call(a),
                f.dispose()
        }
        ,
        c.prototype.broadcastEnterFrame = function(b) {
            var c, d, e, f;
            for (b = this.reuseEvent,
            b._type = a.Event.ENTER_FRAME,
            this.dispatchEvent(b),
            c = a.DisplayObject._enterFrameCallBackList.concat(),
            d = c.length,
            e = 0; d > e; e++)
                f = c[e],
                b._target = f.display,
                b._currentTarget = f.display,
                f.listener.call(f.thisObject, b);
            for (c = a.Recycler._callBackList,
            e = c.length - 1; e >= 0; e--)
                c[e]._checkFrame()
        }
        ,
        c.prototype.broadcastRender = function() {
            var c, d, e, f, g, b = this.reuseEvent;
            for (b._type = a.Event.RENDER,
            c = a.DisplayObject._renderCallBackList.concat(),
            d = c.length,
            e = 0; d > e; e++)
                f = c[e],
                g = f.display,
                b._target = g,
                b._currentTarget = g,
                f.listener.call(f.thisObject, b)
        }
        ,
        c.prototype.doCallLaterList = function(a, b, c) {
            var d, e, f;
            for (d = a.length,
            e = 0; d > e; e++)
                f = a[e],
                null  != f && f.apply(b[e], c[e])
        }
        ,
        c.prototype.doCallAsyncList = function() {
            var e, f, b = a.__callAsyncFunctionList.concat(), c = a.__callAsyncThisList.concat(), d = a.__callAsyncArgsList.concat();
            for (a.__callAsyncFunctionList.length = 0,
            a.__callAsyncThisList.length = 0,
            e = a.__callAsyncArgsList.length = 0; e < b.length; e++)
                f = b[e],
                null  != f && f.apply(c[e], d[e])
        }
        ,
        c.deviceType = null ,
        c.DEVICE_PC = "web",
        c.DEVICE_MOBILE = "native",
        c.RUNTIME_HTML5 = "runtime_html5",
        c.RUNTIME_NATIVE = "runtime_native",
        c.__DRAW_COMMAND_LIST = [],
        c.__use_new_draw = !0,
        c.cachedEvent = new a.Event(""),
        c
    }
    (a.EventDispatcher);
    a.MainContext = b,
    b.prototype.__class__ = "egret.MainContext"
}
(egret || (egret = {})),
testDeviceType = function() {
    if (!this.navigator)
        return !0;
    var a = navigator.userAgent.toLowerCase();
    return -1 != a.indexOf("mobile") || -1 != a.indexOf("android")
}
,
testRuntimeType = function() {
    return this.navigator ? !0 : !1
}
,
egret.MainContext.instance = new egret.MainContext,
egret.MainContext.deviceType = testDeviceType() ? egret.MainContext.DEVICE_MOBILE : egret.MainContext.DEVICE_PC,
egret.MainContext.runtimeType = testRuntimeType() ? egret.MainContext.RUNTIME_HTML5 : egret.MainContext.RUNTIME_NATIVE,
delete testDeviceType,
delete testRuntimeType,
function(a) {
    var b = function() {
        function b() {
            this._preDrawCount = this._updateTransformPerformanceCost = this._renderPerformanceCost = this._logicPerformanceCost = this._lastTime = 0,
            this._txt = null ,
            this._tick = 0,
            this._maxDeltaTime = 500,
            this._totalDeltaTime = 0,
            this._isRunning = !1
        }
        return b.getInstance = function() {
            return null  == b.instance && (b.instance = new b),
            b.instance
        }
        ,
        b.prototype.stop = function() {
            if (this._isRunning) {
                this._isRunning = !1,
                a.Ticker.getInstance().unregister(this.update, this);
                var b = a.MainContext.instance;
                b.removeEventListener(a.Event.ENTER_FRAME, this.onEnterFrame, this),
                b.removeEventListener(a.Event.RENDER, this.onStartRender, this),
                b.removeEventListener(a.Event.FINISH_RENDER, this.onFinishRender, this),
                b.removeEventListener(a.Event.FINISH_UPDATE_TRANSFORM, this.onFinishUpdateTransform, this)
            }
        }
        ,
        b.prototype.run = function() {
            if (null  == this._txt && (this._txt = new a.TextField,
            this._txt.size = 28,
            this._txt.multiline = !0,
            this._txt._parent = new a.DisplayObjectContainer),
            !this._isRunning) {
                this._isRunning = !0,
                a.Ticker.getInstance().register(this.update, this);
                var b = a.MainContext.instance;
                b.addEventListener(a.Event.ENTER_FRAME, this.onEnterFrame, this),
                b.addEventListener(a.Event.RENDER, this.onStartRender, this),
                b.addEventListener(a.Event.FINISH_RENDER, this.onFinishRender, this),
                b.addEventListener(a.Event.FINISH_UPDATE_TRANSFORM, this.onFinishUpdateTransform, this)
            }
        }
        ,
        b.prototype._drawProfiler = function() {
            this._txt._updateTransform(),
            this._txt._draw(a.MainContext.instance.rendererContext)
        }
        ,
        b.prototype._setTxtFontSize = function(a) {
            this._txt.size = a
        }
        ,
        b.prototype.onEnterFrame = function() {
            this._lastTime = a.getTimer()
        }
        ,
        b.prototype.onStartRender = function(b) {
            b = a.getTimer(),
            this._logicPerformanceCost = b - this._lastTime,
            this._lastTime = b
        }
        ,
        b.prototype.onFinishUpdateTransform = function(b) {
            b = a.getTimer(),
            this._updateTransformPerformanceCost = b - this._lastTime,
            this._lastTime = b
        }
        ,
        b.prototype.onFinishRender = function(b) {
            b = a.getTimer(),
            this._renderPerformanceCost = b - this._lastTime,
            this._lastTime = b
        }
        ,
        b.prototype.update = function(b) {
            if (this._tick++,
            this._totalDeltaTime += b,
            this._totalDeltaTime >= this._maxDeltaTime) {
                b = (this._preDrawCount - 3).toString();
                var c = Math.ceil(this._logicPerformanceCost).toString() + "," + Math.ceil(this._updateTransformPerformanceCost).toString() + "," + Math.ceil(this._renderPerformanceCost).toString() + "," + Math.ceil(a.MainContext.instance.rendererContext.renderCost).toString();
                this._txt.text = "draw:" + b + "\ncost:" + c + "\nFPS:" + Math.floor(1e3 * this._tick / this._totalDeltaTime).toString(),
                this._tick = this._totalDeltaTime = 0
            }
            this._preDrawCount = 0
        }
        ,
        b.prototype.onDrawImage = function() {
            this._preDrawCount++
        }
        ,
        b
    }
    ();
    a.Profiler = b,
    b.prototype.__class__ = "egret.Profiler"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this._timeScale = 1,
            this._paused = !1,
            this.callBackList = [],
            null  != c.instance && a.Logger.fatalWithErrorId(1002)
        }
        return __extends(c, b),
        c.prototype.run = function() {
            a.__START_TIME = (new Date).getTime(),
            a.MainContext.instance.deviceContext.executeMainLoop(this.update, this)
        }
        ,
        c.prototype.update = function(a) {
            var b, c, d, e;
            if (!this._paused)
                for (b = this.callBackList.concat(),
                c = b.length,
                a *= this._timeScale,
                a *= this._timeScale,
                d = 0; c > d; d++)
                    e = b[d],
                    e.listener.call(e.thisObject, a)
        }
        ,
        c.prototype.register = function(a, b, c) {
            void 0 === c && (c = 0),
            this._insertEventBin(this.callBackList, a, b, c)
        }
        ,
        c.prototype.unregister = function(a, b) {
            this._removeEventBin(this.callBackList, a, b)
        }
        ,
        c.prototype.setTimeout = function(b, c, d) {
            for (var e = [], f = 3; f < arguments.length; f++)
                e[f - 3] = arguments[f];
            a.Logger.warningWithErrorId(1003),
            a.setTimeout.apply(null , [b, c, d].concat(e))
        }
        ,
        c.prototype.setTimeScale = function(a) {
            this._timeScale = a
        }
        ,
        c.prototype.getTimeScale = function() {
            return this._timeScale
        }
        ,
        c.prototype.pause = function() {
            this._paused = !0
        }
        ,
        c.prototype.resume = function() {
            this._paused = !1
        }
        ,
        c.getInstance = function() {
            return null  == c.instance && (c.instance = new c),
            c.instance
        }
        ,
        c
    }
    (a.EventDispatcher);
    a.Ticker = b,
    b.prototype.__class__ = "egret.Ticker"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function a() {}
        return a.LEFT = "left",
        a.RIGHT = "right",
        a.CENTER = "center",
        a.JUSTIFY = "justify",
        a.CONTENT_JUSTIFY = "contentJustify",
        a
    }
    ();
    a.HorizontalAlign = b,
    b.prototype.__class__ = "egret.HorizontalAlign"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function a() {}
        return a.TOP = "top",
        a.BOTTOM = "bottom",
        a.MIDDLE = "middle",
        a.JUSTIFY = "justify",
        a.CONTENT_JUSTIFY = "contentJustify",
        a
    }
    ();
    a.VerticalAlign = b,
    b.prototype.__class__ = "egret.VerticalAlign"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(a, c) {
            void 0 === c && (c = 0),
            b.call(this),
            this._currentCount = 0,
            this._running = !1,
            this.lastTime = 0,
            this.delay = a,
            this.repeatCount = c
        }
        return __extends(c, b),
        Object.defineProperty(c.prototype, "currentCount", {
            get: function() {
                return this._currentCount
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "running", {
            get: function() {
                return this._running
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype.reset = function() {
            this.stop(),
            this._currentCount = 0
        }
        ,
        c.prototype.start = function() {
            this._running || (this.lastTime = a.getTimer(),
            a.Ticker.getInstance().register(this.onEnterFrame, this),
            this._running = !0)
        }
        ,
        c.prototype.stop = function() {
            this._running && (a.Ticker.getInstance().unregister(this.onEnterFrame, this),
            this._running = !1)
        }
        ,
        c.prototype.onEnterFrame = function(b) {
            b = a.getTimer(),
            b - this.lastTime > this.delay && (this.lastTime = b,
            this._currentCount++,
            a.TimerEvent.dispatchTimerEvent(this, a.TimerEvent.TIMER),
            0 < this.repeatCount && this._currentCount >= this.repeatCount && (this.stop(),
            a.TimerEvent.dispatchTimerEvent(this, a.TimerEvent.TIMER_COMPLETE)))
        }
        ,
        c
    }
    (a.EventDispatcher);
    a.Timer = b,
    b.prototype.__class__ = "egret.Timer"
}
(egret || (egret = {})),
function(a) {
    function b(a) {
        if (a = a.prototype ? a.prototype : Object.getPrototypeOf(a),
        a.hasOwnProperty("__class__"))
            return a.__class__;
        var b = a.constructor.toString()
          , c = b.indexOf("(")
          , b = b.substring(9, c);
        return Object.defineProperty(a, "__class__", {
            value: b,
            enumerable: !1,
            writable: !0
        }),
        b
    }
    a.getQualifiedClassName = b,
    a.getQualifiedSuperclassName = function(a) {
        if (a = a.prototype ? a.prototype : Object.getPrototypeOf(a),
        a.hasOwnProperty("__superclass__"))
            return a.__superclass__;
        var c = Object.getPrototypeOf(a);
        return null  == c ? null  : (c = b(c.constructor)) ? (Object.defineProperty(a, "__superclass__", {
            value: c,
            enumerable: !1,
            writable: !0
        }),
        c) : null 
    }
}
(egret || (egret = {})),
function(a) {
    var b = {};
    a.getDefinitionByName = function(a) {
        var c, d, e, f;
        if (!a)
            return null ;
        if (c = b[a])
            return c;
        for (d = a.split("."),
        e = d.length,
        c = __global,
        f = 0; e > f; f++)
            if (c = c[d[f]],
            !c)
                return null ;
        return b[a] = c
    }
}
(egret || (egret = {})),
__global = __global || this,
function(a) {
    function b(a) {
        var b, d;
        for (b in c)
            d = c[b],
            d.delay -= a,
            0 >= d.delay && (d.listener.apply(d.thisObject, d.params),
            delete c[b])
    }
    var c = {}
      , d = 0;
    a.setTimeout = function(e, f, g) {
        for (var h = [], i = 3; i < arguments.length; i++)
            h[i - 3] = arguments[i];
        return h = {
            listener: e,
            thisObject: f,
            delay: g,
            params: h
        },
        0 == d && a.Ticker.getInstance().register(b, null ),
        d++,
        c[d] = h,
        d
    }
    ,
    a.clearTimeout = function(a) {
        delete c[a]
    }
}
(egret || (egret = {})),
function(a) {
    a.hasDefinition = function(b) {
        return a.getDefinitionByName(b) ? !0 : !1
    }
}
(egret || (egret = {})),
function(a) {
    a.toColorString = function(a) {
        for ((isNaN(a) || 0 > a) && (a = 0),
        a > 16777215 && (a = 16777215),
        a = a.toString(16).toUpperCase(); 6 > a.length; )
            a = "0" + a;
        return "#" + a
    }
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(a, c, d, e, f, g) {
            void 0 === a && (a = 1),
            void 0 === c && (c = 0),
            void 0 === d && (d = 0),
            void 0 === e && (e = 1),
            void 0 === f && (f = 0),
            void 0 === g && (g = 0),
            b.call(this),
            this.a = a,
            this.b = c,
            this.c = d,
            this.d = e,
            this.tx = f,
            this.ty = g
        }
        return __extends(c, b),
        c.prototype.prepend = function(a, b, c, d, e, f) {
            var h, i, g = this.tx;
            return (1 != a || 0 != b || 0 != c || 1 != d) && (h = this.a,
            i = this.c,
            this.a = h * a + this.b * c,
            this.b = h * b + this.b * d,
            this.c = i * a + this.d * c,
            this.d = i * b + this.d * d),
            this.tx = g * a + this.ty * c + e,
            this.ty = g * b + this.ty * d + f,
            this
        }
        ,
        c.prototype.append = function(a, b, c, d, e, f) {
            var g = this.a
              , h = this.b
              , i = this.c
              , j = this.d;
            return (1 != a || 0 != b || 0 != c || 1 != d) && (this.a = a * g + b * i,
            this.b = a * h + b * j,
            this.c = c * g + d * i,
            this.d = c * h + d * j),
            this.tx = e * g + f * i + this.tx,
            this.ty = e * h + f * j + this.ty,
            this
        }
        ,
        c.prototype.prependTransform = function(b, c, d, e, f, g, h, i, j) {
            if (f % 360) {
                var k = a.NumberUtils.cos(f);
                f = a.NumberUtils.sin(f)
            } else
                k = 1,
                f = 0;
            return (i || j) && (this.tx -= i,
            this.ty -= j),
            g || h ? (this.prepend(k * d, f * d, -f * e, k * e, 0, 0),
            this.prepend(a.NumberUtils.cos(h), a.NumberUtils.sin(h), -a.NumberUtils.sin(g), a.NumberUtils.cos(g), b, c)) : this.prepend(k * d, f * d, -f * e, k * e, b, c),
            this
        }
        ,
        c.prototype.appendTransform = function(b, c, d, e, f, g, h, i, j) {
            if (f % 360) {
                var k = a.NumberUtils.cos(f);
                f = a.NumberUtils.sin(f)
            } else
                k = 1,
                f = 0;
            return g || h ? (this.append(a.NumberUtils.cos(h), a.NumberUtils.sin(h), -a.NumberUtils.sin(g), a.NumberUtils.cos(g), b, c),
            this.append(k * d, f * d, -f * e, k * e, 0, 0)) : this.append(k * d, f * d, -f * e, k * e, b, c),
            (i || j) && (this.tx -= i * this.a + j * this.c,
            this.ty -= i * this.b + j * this.d),
            this
        }
        ,
        c.prototype.rotate = function(a) {
            var c, d, e, b = Math.cos(a);
            return a = Math.sin(a),
            c = this.a,
            d = this.c,
            e = this.tx,
            this.a = c * b - this.b * a,
            this.b = c * a + this.b * b,
            this.c = d * b - this.d * a,
            this.d = d * a + this.d * b,
            this.tx = e * b - this.ty * a,
            this.ty = e * a + this.ty * b,
            this
        }
        ,
        c.prototype.skew = function(b, c) {
            return this.append(a.NumberUtils.cos(c), a.NumberUtils.sin(c), -a.NumberUtils.sin(b), a.NumberUtils.cos(b), 0, 0),
            this
        }
        ,
        c.prototype.scale = function(a, b) {
            return this.a *= a,
            this.d *= b,
            this.c *= a,
            this.b *= b,
            this.tx *= a,
            this.ty *= b,
            this
        }
        ,
        c.prototype.translate = function(a, b) {
            return this.tx += a,
            this.ty += b,
            this
        }
        ,
        c.prototype.identity = function() {
            return this.a = this.d = 1,
            this.b = this.c = this.tx = this.ty = 0,
            this
        }
        ,
        c.prototype.identityMatrix = function(a) {
            return this.a = a.a,
            this.b = a.b,
            this.c = a.c,
            this.d = a.d,
            this.tx = a.tx,
            this.ty = a.ty,
            this
        }
        ,
        c.prototype.invert = function() {
            var a = this.a
              , b = this.b
              , c = this.c
              , d = this.d
              , e = this.tx
              , f = a * d - b * c;
            return this.a = d / f,
            this.b = -b / f,
            this.c = -c / f,
            this.d = a / f,
            this.tx = (c * this.ty - d * e) / f,
            this.ty = -(a * this.ty - b * e) / f,
            this
        }
        ,
        c.transformCoords = function(b, c, d) {
            var e = a.Point.identity;
            return e.x = b.a * c + b.c * d + b.tx,
            e.y = b.d * d + b.b * c + b.ty,
            e
        }
        ,
        c.prototype.toArray = function(a) {
            return this.array || (this.array = new Float32Array(9)),
            a ? (this.array[0] = this.a,
            this.array[1] = this.b,
            this.array[2] = 0,
            this.array[3] = this.c,
            this.array[4] = this.d,
            this.array[5] = 0,
            this.array[6] = this.tx,
            this.array[7] = this.ty) : (this.array[0] = this.a,
            this.array[1] = this.b,
            this.array[2] = this.tx,
            this.array[3] = this.c,
            this.array[4] = this.d,
            this.array[5] = this.ty,
            this.array[6] = 0,
            this.array[7] = 0),
            this.array[8] = 1,
            this.array
        }
        ,
        c.identity = new c,
        c.DEG_TO_RAD = Math.PI / 180,
        c
    }
    (a.HashObject);
    a.Matrix = b,
    b.prototype.__class__ = "egret.Matrix"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b(b, c) {
            void 0 === b && (b = 0),
            void 0 === c && (c = 0),
            a.call(this),
            this.x = b,
            this.y = c
        }
        return __extends(b, a),
        b.prototype.clone = function() {
            return new b(this.x,this.y)
        }
        ,
        b.prototype.equals = function(a) {
            return this.x == a.x && this.y == a.y
        }
        ,
        b.distance = function(a, b) {
            return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y))
        }
        ,
        b.identity = new b(0,0),
        b
    }
    (a.HashObject);
    a.Point = b,
    b.prototype.__class__ = "egret.Point"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b(b, c, d, e) {
            void 0 === b && (b = 0),
            void 0 === c && (c = 0),
            void 0 === d && (d = 0),
            void 0 === e && (e = 0),
            a.call(this),
            this.x = b,
            this.y = c,
            this.width = d,
            this.height = e
        }
        return __extends(b, a),
        Object.defineProperty(b.prototype, "right", {
            get: function() {
                return this.x + this.width
            },
            set: function(a) {
                this.width = a - this.x
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(b.prototype, "bottom", {
            get: function() {
                return this.y + this.height
            },
            set: function(a) {
                this.height = a - this.y
            },
            enumerable: !0,
            configurable: !0
        }),
        b.prototype.initialize = function(a, b, c, d) {
            return this.x = a,
            this.y = b,
            this.width = c,
            this.height = d,
            this
        }
        ,
        b.prototype.contains = function(a, b) {
            return this.x <= a && this.x + this.width >= a && this.y <= b && this.y + this.height >= b
        }
        ,
        b.prototype.intersects = function(a) {
            return Math.max(this.x, a.x) <= Math.min(this.right, a.right) && Math.max(this.y, a.y) <= Math.min(this.bottom, a.bottom)
        }
        ,
        b.prototype.setEmpty = function() {
            this.height = this.width = this.y = this.x = 0
        }
        ,
        b.prototype.clone = function() {
            return new b(this.x,this.y,this.width,this.height)
        }
        ,
        b.prototype.containsPoint = function(a) {
            return this.x < a.x && this.x + this.width > a.x && this.y < a.y && this.y + this.height > a.y ? !0 : !1
        }
        ,
        b.identity = new b(0,0,0,0),
        b
    }
    (a.HashObject);
    a.Rectangle = b,
    b.prototype.__class__ = "egret.Rectangle"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this._isSupportDOMParser = this._xmlDict = this._parser = null ,
            this._xmlDict = {},
            window.DOMParser ? (this._isSupportDOMParser = !0,
            this._parser = new DOMParser) : this._isSupportDOMParser = !1
        }
        return __extends(c, b),
        c.getInstance = function() {
            return c._instance || (c._instance = new c),
            c._instance
        }
        ,
        c.prototype.parserXML = function(b) {
            for (var c = 0; "\n" == b.charAt(c) || "	" == b.charAt(c) || "\r" == b.charAt(c) || " " == b.charAt(c); )
                c++;
            return 0 != c && (b = b.substring(c, b.length)),
            this._isSupportDOMParser ? c = this._parser.parseFromString(b, "text/xml") : (c = new ActiveXObject("Microsoft.XMLDOM"),
            c.async = "false",
            c.loadXML(b)),
            null  == c && a.Logger.infoWithErrorId(1015),
            c
        }
        ,
        c._instance = null ,
        c
    }
    (a.HashObject);
    a.SAXParser = b,
    b.prototype.__class__ = "egret.SAXParser"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var c, d, e, f, b = function(b) {
        function c() {
            b.call(this),
            this._designHeight = this._designWidth = 0,
            this._scaleY = this._scaleX = 1,
            this._stageHeight = this._stageWidth = this._offSetY = 0
        }
        return __extends(c, b),
        c.getInstance = function() {
            return null  == c.instance && (d.initialize(),
            c.instance = new c),
            c.instance
        }
        ,
        c.prototype.setDesignSize = function(b, c, d) {
            this._designWidth = b,
            this._designHeight = c,
            d && (a.Logger.warningWithErrorId(1001),
            this._setResolutionPolicy(d))
        }
        ,
        c.prototype._setResolutionPolicy = function(a) {
            this._resolutionPolicy = a,
            a.init(this),
            a._apply(this, this._designWidth, this._designHeight)
        }
        ,
        c.prototype.getScaleX = function() {
            return this._scaleX
        }
        ,
        c.prototype.getScaleY = function() {
            return this._scaleY
        }
        ,
        c.prototype.getOffSetY = function() {
            return this._offSetY
        }
        ,
        c.canvas_name = "egretCanvas",
        c.canvas_div_name = "gameDiv",
        c
    }
    (a.HashObject);
    a.StageDelegate = b,
    b.prototype.__class__ = "egret.StageDelegate",
    c = function() {
        function a(a, b) {
            this._containerStrategy = a,
            this._contentStrategy = b
        }
        return a.prototype.init = function(a) {
            this._containerStrategy.init(a),
            this._contentStrategy.init(a)
        }
        ,
        a.prototype._apply = function(a, b, c) {
            this._containerStrategy._apply(a, b, c),
            this._contentStrategy._apply(a, b, c)
        }
        ,
        a
    }
    (),
    a.ResolutionPolicy = c,
    c.prototype.__class__ = "egret.ResolutionPolicy",
    d = function() {
        function a() {}
        return a.initialize = function() {
            a.EQUAL_TO_FRAME = new e
        }
        ,
        a.prototype.init = function() {}
        ,
        a.prototype._apply = function() {}
        ,
        a.prototype._setupContainer = function() {
            var b, a = document.body;
            a && (b = a.style) && (b.paddingTop = b.paddingTop || "0px",
            b.paddingRight = b.paddingRight || "0px",
            b.paddingBottom = b.paddingBottom || "0px",
            b.paddingLeft = b.paddingLeft || "0px",
            b.borderTop = b.borderTop || "0px",
            b.borderRight = b.borderRight || "0px",
            b.borderBottom = b.borderBottom || "0px",
            b.borderLeft = b.borderLeft || "0px",
            b.marginTop = b.marginTop || "0px",
            b.marginRight = b.marginRight || "0px",
            b.marginBottom = b.marginBottom || "0px",
            b.marginLeft = b.marginLeft || "0px")
        }
        ,
        a
    }
    (),
    a.ContainerStrategy = d,
    d.prototype.__class__ = "egret.ContainerStrategy",
    e = function(a) {
        function b() {
            a.apply(this, arguments)
        }
        return __extends(b, a),
        b.prototype._apply = function() {
            this._setupContainer()
        }
        ,
        b
    }
    (d),
    a.EqualToFrame = e,
    e.prototype.__class__ = "egret.EqualToFrame",
    c = function() {
        function c() {}
        return c.prototype.init = function() {}
        ,
        c.prototype._apply = function() {}
        ,
        c.prototype.setEgretSize = function(c, d, e, f, g, h) {
            void 0 === h && (h = 0),
            a.StageDelegate.getInstance()._stageWidth = Math.round(c),
            a.StageDelegate.getInstance()._stageHeight = Math.round(d),
            c = document.getElementById(b.canvas_div_name),
            c.style.width = e + "px",
            c.style.height = f + "px",
            c.style.top = h + "px"
        }
        ,
        c.prototype._getClientWidth = function() {
            return document.documentElement.clientWidth
        }
        ,
        c.prototype._getClientHeight = function() {
            return document.documentElement.clientHeight
        }
        ,
        c
    }
    (),
    a.ContentStrategy = c,
    c.prototype.__class__ = "egret.ContentStrategy",
    f = function(a) {
        function b(b) {
            void 0 === b && (b = 0),
            a.call(this),
            this.minWidth = 0 / 0,
            this.minWidth = b
        }
        return __extends(b, a),
        b.prototype._apply = function(a, b, c) {
            b = this._getClientWidth();
            var d = this._getClientHeight()
              , e = d / c
              , f = b / e
              , g = 1;
            0 != this.minWidth && (g = Math.min(1, f / this.minWidth)),
            this.setEgretSize(f / g, c, b, d * g),
            a._scaleX = e * g,
            a._scaleY = e * g
        }
        ,
        b
    }
    (c),
    a.FixedHeight = f,
    f.prototype.__class__ = "egret.FixedHeight",
    f = function(a) {
        function b(b) {
            void 0 === b && (b = 0),
            a.call(this),
            this.minHeight = 0 / 0,
            this.minHeight = b
        }
        return __extends(b, a),
        b.prototype._apply = function(a, b, c) {
            c = this._getClientWidth();
            var d = this._getClientHeight()
              , e = c / b
              , f = d / e
              , g = 1;
            0 != this.minHeight && (g = Math.min(1, f / this.minHeight)),
            this.setEgretSize(b, f / g, c * g, d, c * (1 - g) / 2),
            a._scaleX = e * g,
            a._scaleY = e * g
        }
        ,
        b
    }
    (c),
    a.FixedWidth = f,
    f.prototype.__class__ = "egret.FixedWidth",
    f = function(a) {
        function b(b, c) {
            a.call(this),
            this.width = b,
            this.height = c
        }
        return __extends(b, a),
        b.prototype._apply = function(a, b, c) {
            c = this.width;
            var d = this.height
              , e = c / b;
            this.setEgretSize(b, d / e, c, d),
            a._scaleX = e,
            a._scaleY = e
        }
        ,
        b
    }
    (c),
    a.FixedSize = f,
    f.prototype.__class__ = "egret.FixedSize",
    f = function(a) {
        function b() {
            a.call(this)
        }
        return __extends(b, a),
        b.prototype._apply = function(a, b, c) {
            this.setEgretSize(b, c, b, c, Math.floor((b - b) / 2)),
            a._scaleX = 1,
            a._scaleY = 1
        }
        ,
        b
    }
    (c),
    a.NoScale = f,
    f.prototype.__class__ = "egret.NoScale",
    f = function(a) {
        function b() {
            a.call(this)
        }
        return __extends(b, a),
        b.prototype._apply = function(a, b, c) {
            var d = this._getClientWidth()
              , e = this._getClientHeight()
              , f = d
              , g = e
              , h = g / c > f / b ? f / b : g / c
              , f = b * h
              , g = c * h
              , d = Math.floor((d - f) / 2);
            a._offSetY = Math.floor((e - g) / 2),
            this.setEgretSize(b, c / 1, 1 * f, g, d, a._offSetY),
            a._scaleX = 1 * h,
            a._scaleY = 1 * h
        }
        ,
        b
    }
    (c),
    a.ShowAll = f,
    f.prototype.__class__ = "egret.ShowAll",
    c = function(a) {
        function b() {
            a.call(this)
        }
        return __extends(b, a),
        b.prototype._apply = function(a, b, c) {
            var d = this._getClientWidth()
              , e = this._getClientHeight()
              , d = d / b
              , e = e / c;
            this.setEgretSize(b, c, b * d, c * e),
            a._scaleX = d,
            a._scaleY = e
        }
        ,
        b
    }
    (c),
    a.FullScreen = c,
    c.prototype.__class__ = "egret.FullScreen"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this._originalData = {},
            this._drawAreaList = []
        }
        return __extends(c, b),
        c.getInstance = function() {
            return null  == c.instance && (c.instance = new c),
            c.instance
        }
        ,
        c.prototype.addDrawArea = function(a) {
            this._drawAreaList.push(a)
        }
        ,
        c.prototype.clearDrawArea = function() {
            this._drawAreaList = []
        }
        ,
        c.prototype.drawImage = function(b, d, e, f, g, h, i, j, k, l, m) {
            var n, o, p, q;
            if (void 0 === m && (m = void 0),
            i = i || 0,
            j = j || 0,
            n = d._texture_to_render,
            null  != n && 0 != h && 0 != g && 0 != k && 0 != l)
                if (o = a.MainContext.instance.rendererContext._texture_scale_factor,
                g /= o,
                h /= o,
                0 != this._drawAreaList.length && a.MainContext.instance.rendererContext._cacheCanvasContext) {
                    for (o = a.DisplayObject.getTransformBounds(d._getSize(c.identityRectangle), d._worldTransform),
                    d._worldBounds.initialize(o.x, o.y, o.width, o.height),
                    o = this._originalData,
                    o.sourceX = e,
                    o.sourceY = f,
                    o.sourceWidth = g,
                    o.sourceHeight = h,
                    o.destX = i,
                    o.destY = j,
                    o.destWidth = k,
                    o.destHeight = l,
                    p = this.getDrawAreaList(),
                    q = 0; q < p.length; q++)
                        if (!this.ignoreRender(d, p[q], o.destX, o.destY)) {
                            b.drawImage(n, e, f, g, h, i, j, k, l, m);
                            break
                        }
                } else
                    b.drawImage(n, e, f, g, h, i, j, k, l, m)
        }
        ,
        c.prototype.ignoreRender = function(a, b, c, d) {
            var e = a._worldBounds;
            return c *= a._worldTransform.a,
            d *= a._worldTransform.d,
            e.x + e.width + c <= b.x || e.x + c >= b.x + b.width || e.y + e.height + d <= b.y || e.y + d >= b.y + b.height ? !0 : !1
        }
        ,
        c.prototype.getDrawAreaList = function() {
            var b;
            return 0 == this._drawAreaList.length ? (this._defaultDrawAreaList || (this._defaultDrawAreaList = [new a.Rectangle(0,0,a.MainContext.instance.stage.stageWidth,a.MainContext.instance.stage.stageHeight)],
            a.MainContext.instance.stage.addEventListener(a.Event.RESIZE, this.onResize, this)),
            b = this._defaultDrawAreaList) : b = this._drawAreaList,
            b
        }
        ,
        c.prototype.onResize = function() {
            a.MainContext.instance.stage.removeEventListener(a.Event.RESIZE, this.onResize, this),
            this._defaultDrawAreaList = null 
        }
        ,
        c.identityRectangle = new a.Rectangle,
        c
    }
    (a.HashObject);
    a.RenderFilter = b,
    b.prototype.__class__ = "egret.RenderFilter"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function b() {}
        return b.mapClass = function(a, b, c) {
            void 0 === c && (c = ""),
            a = this.getKey(a) + "#" + c,
            this.mapClassDic[a] = b
        }
        ,
        b.getKey = function(b) {
            return "string" == typeof b ? b : a.getQualifiedClassName(b)
        }
        ,
        b.mapValue = function(a, b, c) {
            void 0 === c && (c = ""),
            a = this.getKey(a) + "#" + c,
            this.mapValueDic[a] = b
        }
        ,
        b.hasMapRule = function(a, b) {
            void 0 === b && (b = "");
            var c = this.getKey(a) + "#" + b;
            return this.mapValueDic[c] || this.mapClassDic[c] ? !0 : !1
        }
        ,
        b.getInstance = function(b, c) {
            var d, e;
            if (void 0 === c && (c = ""),
            d = this.getKey(b) + "#" + c,
            this.mapValueDic[d])
                return this.mapValueDic[d];
            if (e = this.mapClassDic[d])
                return e = new e,
                this.mapValueDic[d] = e,
                delete this.mapClassDic[d],
                e;
            throw Error(a.getString(1028, d))
        }
        ,
        b.mapClassDic = {},
        b.mapValueDic = {},
        b
    }
    ();
    a.Injector = b,
    b.prototype.__class__ = "egret.Injector"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        return function() {
            this.type = null 
        }
    }
    ();
    a.Filter = b,
    b.prototype.__class__ = "egret.Filter"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b(b, c) {
            a.call(this),
            this.blurX = b,
            this.blurY = c,
            this.type = "blur"
        }
        return __extends(b, a),
        b
    }
    (a.Filter);
    a.BlurFilter = b,
    b.prototype.__class__ = "egret.BlurFilter"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function a() {}
        return a.NORMAL = "normal",
        a.ADD = "add",
        a
    }
    ();
    a.BlendMode = b,
    b.prototype.__class__ = "egret.BlendMode"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this.__hack_local_matrix = null ,
            this._sizeDirty = this._normalDirty = !0,
            this._parent = this._texture_to_render = this.name = this._sizeChangeCallTarget = this._sizeChangeCallBack = null ,
            this._y = this._x = 0,
            this._scaleY = this._scaleX = 1,
            this._anchorY = this._anchorX = this._anchorOffsetY = this._anchorOffsetX = 0,
            this._visible = !0,
            this._rotation = 0,
            this._alpha = 1,
            this._skewY = this._skewX = 0,
            this._touchEnabled = !1,
            this._scrollRect = this.blendMode = null ,
            this._explicitHeight = this._explicitWidth = 0 / 0,
            this._hasHeightSet = this._hasWidthSet = !1,
            this._worldBounds = this.mask = null ,
            this.worldAlpha = 1,
            this.needDraw = this._isContainer = !1,
            this._hitTestPointTexture = null ,
            this._rectH = this._rectW = 0,
            this._stage = null ,
            this._cacheAsBitmap = !1,
            this.renderTexture = null ,
            this._cacheDirty = !1,
            this._filter = this._colorTransform = null ,
            this._worldTransform = new a.Matrix,
            this._worldBounds = new a.Rectangle(0,0,0,0),
            this._cacheBounds = new a.Rectangle(0,0,0,0)
        }
        return __extends(c, b),
        c.prototype._setDirty = function() {
            this._normalDirty = !0
        }
        ,
        c.prototype.getDirty = function() {
            return this._normalDirty || this._sizeDirty
        }
        ,
        c.prototype._setParentSizeDirty = function() {
            var a = this._parent;
            !a || a._hasWidthSet || a._hasHeightSet || a._setSizeDirty()
        }
        ,
        c.prototype._setSizeDirty = function() {
            this._sizeDirty || (this._sizeDirty = !0,
            this._setDirty(),
            this._setCacheDirty(),
            this._setParentSizeDirty(),
            null  != this._sizeChangeCallBack && (this._sizeChangeCallTarget == this._parent ? this._sizeChangeCallBack.call(this._sizeChangeCallTarget) : this._sizeChangeCallTarget = this._sizeChangeCallBack = null ))
        }
        ,
        c.prototype._clearDirty = function() {
            this._normalDirty = !1
        }
        ,
        c.prototype._clearSizeDirty = function() {
            this._sizeDirty = !1
        }
        ,
        Object.defineProperty(c.prototype, "parent", {
            get: function() {
                return this._parent
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._parentChanged = function(a) {
            this._parent = a
        }
        ,
        Object.defineProperty(c.prototype, "x", {
            get: function() {
                return this._x
            },
            set: function(a) {
                this._setX(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setX = function(b) {
            a.NumberUtils.isNumber(b) && this._x != b && (this._x = b,
            this._setDirty(),
            this._setParentSizeDirty())
        }
        ,
        Object.defineProperty(c.prototype, "y", {
            get: function() {
                return this._y
            },
            set: function(a) {
                this._setY(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setY = function(b) {
            a.NumberUtils.isNumber(b) && this._y != b && (this._y = b,
            this._setDirty(),
            this._setParentSizeDirty())
        }
        ,
        Object.defineProperty(c.prototype, "scaleX", {
            get: function() {
                return this._scaleX
            },
            set: function(b) {
                a.NumberUtils.isNumber(b) && this._scaleX != b && (this._scaleX = b,
                this._setDirty(),
                this._setParentSizeDirty())
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "scaleY", {
            get: function() {
                return this._scaleY
            },
            set: function(b) {
                a.NumberUtils.isNumber(b) && this._scaleY != b && (this._scaleY = b,
                this._setDirty(),
                this._setParentSizeDirty())
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "anchorOffsetX", {
            get: function() {
                return this._anchorOffsetX
            },
            set: function(b) {
                a.NumberUtils.isNumber(b) && this._anchorOffsetX != b && (this._anchorOffsetX = b,
                this._setDirty(),
                this._setParentSizeDirty())
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "anchorOffsetY", {
            get: function() {
                return this._anchorOffsetY
            },
            set: function(b) {
                a.NumberUtils.isNumber(b) && this._anchorOffsetY != b && (this._anchorOffsetY = b,
                this._setDirty(),
                this._setParentSizeDirty())
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "anchorX", {
            get: function() {
                return this._anchorX
            },
            set: function(a) {
                this._setAnchorX(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setAnchorX = function(b) {
            a.NumberUtils.isNumber(b) && this._anchorX != b && (this._anchorX = b,
            this._setDirty(),
            this._setParentSizeDirty())
        }
        ,
        Object.defineProperty(c.prototype, "anchorY", {
            get: function() {
                return this._anchorY
            },
            set: function(a) {
                this._setAnchorY(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setAnchorY = function(b) {
            a.NumberUtils.isNumber(b) && this._anchorY != b && (this._anchorY = b,
            this._setDirty(),
            this._setParentSizeDirty())
        }
        ,
        Object.defineProperty(c.prototype, "visible", {
            get: function() {
                return this._visible
            },
            set: function(a) {
                this._setVisible(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setVisible = function(a) {
            this._visible != a && (this._visible = a,
            this._setSizeDirty())
        }
        ,
        Object.defineProperty(c.prototype, "rotation", {
            get: function() {
                return this._rotation
            },
            set: function(b) {
                a.NumberUtils.isNumber(b) && this._rotation != b && (this._rotation = b,
                this._setParentSizeDirty())
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "alpha", {
            get: function() {
                return this._alpha
            },
            set: function(b) {
                a.NumberUtils.isNumber(b) && this._alpha != b && (this._alpha = b,
                this._setDirty(),
                this._setCacheDirty())
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "skewX", {
            get: function() {
                return this._skewX
            },
            set: function(b) {
                a.NumberUtils.isNumber(b) && this._skewX != b && (this._skewX = b,
                this._setParentSizeDirty())
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "skewY", {
            get: function() {
                return this._skewY
            },
            set: function(b) {
                a.NumberUtils.isNumber(b) && this._skewY != b && (this._skewY = b,
                this._setParentSizeDirty())
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "touchEnabled", {
            get: function() {
                return this._touchEnabled
            },
            set: function(a) {
                this._setTouchEnabled(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setTouchEnabled = function(a) {
            this._touchEnabled = a
        }
        ,
        Object.defineProperty(c.prototype, "scrollRect", {
            get: function() {
                return this._scrollRect
            },
            set: function(a) {
                this._setScrollRect(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setScrollRect = function(a) {
            this._scrollRect = a,
            this._setSizeDirty()
        }
        ,
        Object.defineProperty(c.prototype, "measuredWidth", {
            get: function() {
                return this._measureBounds().width
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "measuredHeight", {
            get: function() {
                return this._measureBounds().height
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "explicitWidth", {
            get: function() {
                return this._explicitWidth
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "explicitHeight", {
            get: function() {
                return this._explicitHeight
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "width", {
            get: function() {
                return this._getSize(a.Rectangle.identity).width
            },
            set: function(a) {
                this._setWidth(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "height", {
            get: function() {
                return this._getSize(a.Rectangle.identity).height
            },
            set: function(a) {
                this._setHeight(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setWidth = function(b) {
            this._setSizeDirty(),
            this._setCacheDirty(),
            this._explicitWidth = b,
            this._hasWidthSet = a.NumberUtils.isNumber(b)
        }
        ,
        c.prototype._setHeight = function(b) {
            this._setSizeDirty(),
            this._setCacheDirty(),
            this._explicitHeight = b,
            this._hasHeightSet = a.NumberUtils.isNumber(b)
        }
        ,
        c.prototype._draw = function(b) {
            var c, d;
            this._visible && !this.drawCacheTexture(b) && (c = a.MainContext.__use_new_draw && this._isContainer,
            this._filter && !c && b.setGlobalFilter(this._filter),
            this._colorTransform && !c && b.setGlobalColorTransform(this._colorTransform.matrix),
            b.setAlpha(this.worldAlpha, this.blendMode),
            b.setTransform(this._worldTransform),
            d = this.mask || this._scrollRect,
            d && !c && b.pushMask(d),
            this._render(b),
            d && !c && b.popMask(),
            this._colorTransform && !c && b.setGlobalColorTransform(null ),
            this._filter && !c && b.setGlobalFilter(null )),
            this.destroyCacheBounds()
        }
        ,
        c.prototype._setGlobalFilter = function(a) {
            a.setGlobalFilter(this._filter)
        }
        ,
        c.prototype._removeGlobalFilter = function(a) {
            a.setGlobalFilter(null )
        }
        ,
        c.prototype._setGlobalColorTransform = function(a) {
            a.setGlobalColorTransform(this._colorTransform.matrix)
        }
        ,
        c.prototype._removeGlobalColorTransform = function(a) {
            a.setGlobalColorTransform(null )
        }
        ,
        c.prototype._pushMask = function(a) {
            a.setTransform(this._worldTransform);
            var b = this.mask || this._scrollRect;
            b && a.pushMask(b)
        }
        ,
        c.prototype._popMask = function(a) {
            a.popMask()
        }
        ,
        c.prototype.drawCacheTexture = function(b) {
            var c, d, e, f;
            return 0 == this._cacheAsBitmap ? !1 : (c = this.getBounds(a.Rectangle.identity),
            d = a.MainContext.instance.rendererContext._texture_scale_factor,
            (this._cacheDirty || null  == this._texture_to_render || Math.round(c.width) != Math.round(this._texture_to_render._sourceWidth * d) || Math.round(c.height) != Math.round(this._texture_to_render._sourceHeight * d)) && (this._cacheDirty = !this._makeBitmapCache()),
            null  == this._texture_to_render ? !1 : (e = this._texture_to_render,
            c = e._offsetX,
            d = e._offsetY,
            f = e._textureWidth,
            e = e._textureHeight,
            this._updateTransform(),
            b.setAlpha(this.worldAlpha, this.blendMode),
            b.setTransform(this._worldTransform),
            a.RenderFilter.getInstance().drawImage(b, this, 0, 0, f, e, c, d, f, e),
            !0))
        }
        ,
        c.prototype._updateTransform = function() {
            this._calculateWorldTransform(),
            "updateTransform" == a.MainContext._renderLoopPhase && (this.needDraw || this._texture_to_render || this._cacheAsBitmap) && a.RenderCommand.push(this._draw, this)
        }
        ,
        c.prototype._calculateWorldTransform = function() {
            var c, a = this._worldTransform, b = this._parent;
            a.identityMatrix(b._worldTransform),
            this._getMatrix(a),
            c = this._scrollRect,
            c && a.append(1, 0, 0, 1, -c.x, -c.y),
            this.worldAlpha = b.worldAlpha * this._alpha
        }
        ,
        c.prototype._render = function() {}
        ,
        c.prototype.getBounds = function(b, c) {
            var d, e, f, g, h, i;
            return void 0 === c && (c = !0),
            d = this._measureBounds(),
            e = this._hasWidthSet ? this._explicitWidth : d.width,
            f = this._hasHeightSet ? this._explicitHeight : d.height,
            this._rectW = d.width,
            this._rectH = d.height,
            this._clearSizeDirty(),
            g = d.x,
            d = d.y,
            h = 0,
            i = 0,
            c && (0 != this._anchorX || 0 != this._anchorY ? (h = e * this._anchorX,
            i = f * this._anchorY) : (h = this._anchorOffsetX,
            i = this._anchorOffsetY)),
            this._cacheBounds.initialize(g - h, d - i, e, f),
            e = this._cacheBounds,
            b || (b = new a.Rectangle),
            b.initialize(e.x, e.y, e.width, e.height)
        }
        ,
        c.prototype.destroyCacheBounds = function() {
            this._cacheBounds.x = 0,
            this._cacheBounds.y = 0,
            this._cacheBounds.width = 0,
            this._cacheBounds.height = 0
        }
        ,
        c.prototype._getConcatenatedMatrix = function() {
            var b, d, e;
            for (b = c.identityMatrixForGetConcatenated.identity(),
            d = this; null  != d; )
                0 != d._anchorX || 0 != d._anchorY ? (e = d._getSize(a.Rectangle.identity),
                b.prependTransform(d._x, d._y, d._scaleX, d._scaleY, d._rotation, d._skewX, d._skewY, e.width * d._anchorX, e.height * d._anchorY)) : b.prependTransform(d._x, d._y, d._scaleX, d._scaleY, d._rotation, d._skewX, d._skewY, d._anchorOffsetX, d._anchorOffsetY),
                d._scrollRect && b.prepend(1, 0, 0, 1, -d._scrollRect.x, -d._scrollRect.y),
                d = d._parent;
            return b
        }
        ,
        c.prototype.localToGlobal = function(b, c, d) {
            void 0 === b && (b = 0),
            void 0 === c && (c = 0);
            var e = this._getConcatenatedMatrix();
            return e.append(1, 0, 0, 1, b, c),
            d || (d = new a.Point),
            d.x = e.tx,
            d.y = e.ty,
            d
        }
        ,
        c.prototype.globalToLocal = function(b, c, d) {
            void 0 === b && (b = 0),
            void 0 === c && (c = 0);
            var e = this._getConcatenatedMatrix();
            return e.invert(),
            e.append(1, 0, 0, 1, b, c),
            d || (d = new a.Point),
            d.x = e.tx,
            d.y = e.ty,
            d
        }
        ,
        c.prototype.hitTest = function(b, c, d) {
            return void 0 === d && (d = !1),
            this._visible && (d || this._touchEnabled) ? (d = this.getBounds(a.Rectangle.identity, !1),
            b -= d.x,
            c -= d.y,
            b >= 0 && b < d.width && c >= 0 && c < d.height ? this.mask || this._scrollRect ? this._scrollRect && b > this._scrollRect.x && c > this._scrollRect.y && b < this._scrollRect.x + this._scrollRect.width && c < this._scrollRect.y + this._scrollRect.height || this.mask && this.mask.x <= b && b < this.mask.x + this.mask.width && this.mask.y <= c && c < this.mask.y + this.mask.height ? this : null  : this : null ) : null 
        }
        ,
        c.prototype.hitTestPoint = function(b, c, d) {
            return b = this.globalToLocal(b, c),
            d ? (this._hitTestPointTexture || (this._hitTestPointTexture = new a.RenderTexture),
            d = this._hitTestPointTexture,
            d.drawToTexture(this),
            0 != d.getPixel32(b.x - this._hitTestPointTexture._offsetX, b.y - this._hitTestPointTexture._offsetY)[3] ? !0 : !1) : !!this.hitTest(b.x, b.y, !0)
        }
        ,
        c.prototype._getMatrix = function(b) {
            var c, d, e;
            return b || (b = a.Matrix.identity.identity()),
            d = this._getOffsetPoint(),
            c = d.x,
            d = d.y,
            e = this.__hack_local_matrix,
            e ? (b.append(e.a, e.b, e.c, e.d, e.tx, e.ty),
            b.append(1, 0, 0, 1, -c, -d)) : b.appendTransform(this._x, this._y, this._scaleX, this._scaleY, this._rotation, this._skewX, this._skewY, c, d),
            b
        }
        ,
        c.prototype._getSize = function(a) {
            return this._hasHeightSet && this._hasWidthSet ? (this._clearSizeDirty(),
            a.initialize(0, 0, this._explicitWidth, this._explicitHeight)) : (this._measureSize(a),
            this._hasWidthSet && (a.width = this._explicitWidth),
            this._hasHeightSet && (a.height = this._explicitHeight),
            a)
        }
        ,
        c.prototype._measureSize = function(a) {
            return this._sizeDirty ? (a = this._measureBounds(),
            this._rectW = a.width,
            this._rectH = a.height,
            this._clearSizeDirty()) : (a.width = this._rectW,
            a.height = this._rectH),
            a.x = 0,
            a.y = 0,
            a
        }
        ,
        c.prototype._measureBounds = function() {
            return a.Rectangle.identity.initialize(0, 0, 0, 0)
        }
        ,
        c.prototype._getOffsetPoint = function() {
            var d, b = this._anchorOffsetX, c = this._anchorOffsetY;
            return (0 != this._anchorX || 0 != this._anchorY) && (c = this._getSize(a.Rectangle.identity),
            b = this._anchorX * c.width,
            c = this._anchorY * c.height),
            d = a.Point.identity,
            d.x = b,
            d.y = c,
            d
        }
        ,
        c.prototype._onAddToStage = function() {
            this._stage = a.MainContext.instance.stage,
            a.DisplayObjectContainer.__EVENT__ADD_TO_STAGE_LIST.push(this)
        }
        ,
        c.prototype._onRemoveFromStage = function() {
            a.DisplayObjectContainer.__EVENT__REMOVE_FROM_STAGE_LIST.push(this)
        }
        ,
        Object.defineProperty(c.prototype, "stage", {
            get: function() {
                return this._stage
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype.addEventListener = function(d, e, f, g, h) {
            void 0 === g && (g = !1),
            void 0 === h && (h = 0),
            b.prototype.addEventListener.call(this, d, e, f, g, h),
            ((g = d == a.Event.ENTER_FRAME) || d == a.Event.RENDER) && this._insertEventBin(g ? c._enterFrameCallBackList : c._renderCallBackList, e, f, h, this)
        }
        ,
        c.prototype.removeEventListener = function(d, e, f, g) {
            void 0 === g && (g = !1),
            b.prototype.removeEventListener.call(this, d, e, f, g),
            ((g = d == a.Event.ENTER_FRAME) || d == a.Event.RENDER) && this._removeEventBin(g ? c._enterFrameCallBackList : c._renderCallBackList, e, f, this)
        }
        ,
        c.prototype.dispatchEvent = function(a) {
            if (!a._bubbles)
                return b.prototype.dispatchEvent.call(this, a);
            for (var c = [], d = this; d; )
                c.push(d),
                d = d._parent;
            return a._reset(),
            this._dispatchPropagationEvent(a, c),
            !a._isDefaultPrevented
        }
        ,
        c.prototype._dispatchPropagationEvent = function(a, b, c) {
            var d, e, f;
            for (c = b.length,
            d = 1,
            e = c - 1; e >= 0; e--)
                if (f = b[e],
                a._currentTarget = f,
                a._target = this,
                a._eventPhase = d,
                f._notifyListener(a),
                a._isPropagationStopped || a._isPropagationImmediateStopped)
                    return;
            if (f = b[0],
            a._currentTarget = f,
            a._target = this,
            a._eventPhase = 2,
            f._notifyListener(a),
            !a._isPropagationStopped && !a._isPropagationImmediateStopped)
                for (d = 3,
                e = 1; c > e && (f = b[e],
                a._currentTarget = f,
                a._target = this,
                a._eventPhase = d,
                f._notifyListener(a),
                !a._isPropagationStopped && !a._isPropagationImmediateStopped); e++)
                    ;
        }
        ,
        c.prototype.willTrigger = function(a) {
            for (var b = this; b; ) {
                if (b.hasEventListener(a))
                    return !0;
                b = b._parent
            }
            return !1
        }
        ,
        Object.defineProperty(c.prototype, "cacheAsBitmap", {
            get: function() {
                return this._cacheAsBitmap
            },
            set: function(b) {
                (this._cacheAsBitmap = b) ? a.callLater(this._makeBitmapCache, this) : this._texture_to_render = null 
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._makeBitmapCache = function() {
            this.renderTexture || (this.renderTexture = new a.RenderTexture);
            var b = this.renderTexture.drawToTexture(this);
            return this._texture_to_render = b ? this.renderTexture : null ,
            b
        }
        ,
        c.prototype._setCacheDirty = function(a) {
            void 0 === a && (a = !0),
            this._cacheDirty = a
        }
        ,
        c.getTransformBounds = function(a, b) {
            var g, h, i, j, k, l, m, n, c = a.x, d = a.y, e = a.width, f = a.height;
            return (c || d) && b.appendTransform(0, 0, 1, 1, 0, 0, 0, -c, -d),
            g = e * b.a,
            e *= b.b,
            h = f * b.c,
            f *= b.d,
            i = b.tx,
            j = b.ty,
            k = i,
            l = i,
            m = j,
            n = j,
            (c = g + i) < k ? k = c : c > l && (l = c),
            (c = g + h + i) < k ? k = c : c > l && (l = c),
            (c = h + i) < k ? k = c : c > l && (l = c),
            (d = e + j) < m ? m = d : d > n && (n = d),
            (d = e + f + j) < m ? m = d : d > n && (n = d),
            (d = f + j) < m ? m = d : d > n && (n = d),
            a.initialize(k, m, l - k, n - m)
        }
        ,
        Object.defineProperty(c.prototype, "colorTransform", {
            get: function() {
                return this._colorTransform
            },
            set: function(a) {
                this._colorTransform = a
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "filter", {
            get: function() {
                return this._filter
            },
            set: function(a) {
                this._filter = a
            },
            enumerable: !0,
            configurable: !0
        }),
        c.identityMatrixForGetConcatenated = new a.Matrix,
        c._enterFrameCallBackList = [],
        c._renderCallBackList = [],
        c
    }
    (a.EventDispatcher);
    a.DisplayObject = b,
    b.prototype.__class__ = "egret.DisplayObject",
    b = function() {
        function a() {
            this.matrix = null 
        }
        return a.prototype.updateColor = function() {}
        ,
        a
    }
    (),
    a.ColorTransform = b,
    b.prototype.__class__ = "egret.ColorTransform"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this._touchChildren = !0,
            this._children = [],
            this._isContainer = !0
        }
        return __extends(c, b),
        Object.defineProperty(c.prototype, "touchChildren", {
            get: function() {
                return this._touchChildren
            },
            set: function(a) {
                this._touchChildren = a
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "numChildren", {
            get: function() {
                return this._children.length
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype.setChildIndex = function(a, b) {
            this.doSetChildIndex(a, b)
        }
        ,
        c.prototype.doSetChildIndex = function(b, c) {
            var d = this._children.indexOf(b);
            0 > d && a.Logger.fatalWithErrorId(1006),
            this._children.splice(d, 1),
            0 > c || this._children.length <= c ? this._children.push(b) : this._children.splice(c, 0, b)
        }
        ,
        c.prototype.addChild = function(a) {
            var b = this._children.length;
            return a._parent == this && b--,
            this._doAddChild(a, b)
        }
        ,
        c.prototype.addChildAt = function(a, b) {
            return this._doAddChild(a, b)
        }
        ,
        c.prototype._doAddChild = function(b, d, e) {
            var f, g;
            if (void 0 === e && (e = !0),
            b == this)
                return b;
            if (0 > d || d > this._children.length)
                return a.Logger.fatalWithErrorId(1007),
                b;
            if (f = b._parent,
            f == this)
                return this.doSetChildIndex(b, d),
                b;
            if (f && (g = f._children.indexOf(b),
            g >= 0 && f._doRemoveChild(g)),
            this._children.splice(d, 0, b),
            b._parentChanged(this),
            e && b.dispatchEventWith(a.Event.ADDED, !0),
            this._stage)
                for (b._onAddToStage(),
                d = c.__EVENT__ADD_TO_STAGE_LIST; 0 < d.length; )
                    d.shift().dispatchEventWith(a.Event.ADDED_TO_STAGE);
            return b._setDirty(),
            this._setSizeDirty(),
            b
        }
        ,
        c.prototype.removeChild = function(b) {
            return b = this._children.indexOf(b),
            b >= 0 ? this._doRemoveChild(b) : (a.Logger.fatalWithErrorId(1008),
            null )
        }
        ,
        c.prototype.removeChildAt = function(b) {
            return b >= 0 && b < this._children.length ? this._doRemoveChild(b) : (a.Logger.fatalWithErrorId(1007),
            null )
        }
        ,
        c.prototype._doRemoveChild = function(b, d) {
            var e, f, g, h;
            if (void 0 === d && (d = !0),
            e = this._children,
            f = e[b],
            d && f.dispatchEventWith(a.Event.REMOVED, !0),
            this._stage)
                for (f._onRemoveFromStage(),
                g = c.__EVENT__REMOVE_FROM_STAGE_LIST; 0 < g.length; )
                    h = g.shift(),
                    h.dispatchEventWith(a.Event.REMOVED_FROM_STAGE),
                    h._stage = null ;
            return f._parentChanged(null ),
            e.splice(b, 1),
            this._setSizeDirty(),
            f
        }
        ,
        c.prototype.getChildAt = function(b) {
            return b >= 0 && b < this._children.length ? this._children[b] : (a.Logger.fatalWithErrorId(1007),
            null )
        }
        ,
        c.prototype.contains = function(a) {
            for (; a; ) {
                if (a == this)
                    return !0;
                a = a._parent
            }
            return !1
        }
        ,
        c.prototype.swapChildrenAt = function(b, c) {
            b >= 0 && b < this._children.length && c >= 0 && c < this._children.length ? this._swapChildrenAt(b, c) : a.Logger.fatalWithErrorId(1007)
        }
        ,
        c.prototype.swapChildren = function(b, c) {
            var d = this._children.indexOf(b)
              , e = this._children.indexOf(c);
            -1 == d || -1 == e ? a.Logger.fatalWithErrorId(1008) : this._swapChildrenAt(d, e)
        }
        ,
        c.prototype._swapChildrenAt = function(a, b) {
            if (a != b) {
                var c = this._children
                  , d = c[a];
                c[a] = c[b],
                c[b] = d
            }
        }
        ,
        c.prototype.getChildIndex = function(a) {
            return this._children.indexOf(a)
        }
        ,
        c.prototype.removeChildren = function() {
            for (var a = this._children.length - 1; a >= 0; a--)
                this._doRemoveChild(a)
        }
        ,
        c.prototype._updateTransform = function() {
            var c, d, e;
            if (this._visible) {
                if (this._filter && a.RenderCommand.push(this._setGlobalFilter, this),
                this._colorTransform && a.RenderCommand.push(this._setGlobalColorTransform, this),
                c = this.mask || this._scrollRect,
                c && a.RenderCommand.push(this._pushMask, this),
                b.prototype._updateTransform.call(this),
                !this._cacheAsBitmap || !this._texture_to_render)
                    for (d = 0,
                    e = this._children.length; e > d; d++)
                        this._children[d]._updateTransform();
                c && a.RenderCommand.push(this._popMask, this),
                this._colorTransform && a.RenderCommand.push(this._removeGlobalColorTransform, this),
                this._filter && a.RenderCommand.push(this._removeGlobalFilter, this)
            }
        }
        ,
        c.prototype._render = function(b) {
            if (!a.MainContext.__use_new_draw)
                for (var c = 0, d = this._children.length; d > c; c++)
                    this._children[c]._draw(b)
        }
        ,
        c.prototype._measureBounds = function() {
            var b, c, d, e, f, g, h, i, j, k, l;
            for (b = 0,
            c = 0,
            d = 0,
            e = 0,
            f = this._children.length,
            g = 0; f > g; g++)
                h = this._children[g],
                h._visible && (i = h.getBounds(a.Rectangle.identity, !1),
                j = i.x,
                k = i.y,
                l = i.width,
                i = i.height,
                h = h._getMatrix(),
                h = a.DisplayObject.getTransformBounds(a.Rectangle.identity.initialize(j, k, l, i), h),
                j = h.x,
                k = h.y,
                l = h.width + h.x,
                h = h.height + h.y,
                (b > j || 0 == g) && (b = j),
                (l > c || 0 == g) && (c = l),
                (d > k || 0 == g) && (d = k),
                (h > e || 0 == g) && (e = h));
            return a.Rectangle.identity.initialize(b, d, c - b, e - d)
        }
        ,
        c.prototype.hitTest = function(c, d, e) {
            var f, g, h, i, j, k, l;
            if (void 0 === e && (e = !1),
            !this._visible)
                return null ;
            if (this._scrollRect) {
                if (c < this._scrollRect.x || d < this._scrollRect.y || c > this._scrollRect.x + this._scrollRect.width || d > this._scrollRect.y + this._scrollRect.height)
                    return null 
            } else if (this.mask && (this.mask.x > c || c > this.mask.x + this.mask.width || this.mask.y > d || d > this.mask.y + this.mask.height))
                return null ;
            for (g = this._children,
            h = this._touchChildren,
            i = g.length - 1; i >= 0; i--)
                if (j = g[i],
                k = j._getMatrix(),
                l = j._scrollRect,
                l && k.append(1, 0, 0, 1, -l.x, -l.y),
                k.invert(),
                k = a.Matrix.transformCoords(k, c, d),
                j = j.hitTest(k.x, k.y, !0)) {
                    if (!h)
                        return this;
                    if (j._touchEnabled && h)
                        return j;
                    f = this
                }
            return f ? f : this._texture_to_render ? b.prototype.hitTest.call(this, c, d, e) : null 
        }
        ,
        c.prototype._onAddToStage = function() {
            b.prototype._onAddToStage.call(this);
            for (var a = this._children.length, c = 0; a > c; c++)
                this._children[c]._onAddToStage()
        }
        ,
        c.prototype._onRemoveFromStage = function() {
            b.prototype._onRemoveFromStage.call(this);
            for (var a = this._children.length, c = 0; a > c; c++)
                this._children[c]._onRemoveFromStage()
        }
        ,
        c.prototype.getChildByName = function(a) {
            for (var d, b = this._children, c = b.length, e = 0; c > e; e++)
                if (d = b[e],
                d.name == a)
                    return d;
            return null 
        }
        ,
        c.__EVENT__ADD_TO_STAGE_LIST = [],
        c.__EVENT__REMOVE_FROM_STAGE_LIST = [],
        c
    }
    (a.DisplayObject);
    a.DisplayObjectContainer = b,
    b.prototype.__class__ = "egret.DisplayObjectContainer"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function a() {}
        return a.NO_BORDER = "noBorder",
        a.NO_SCALE = "noScale",
        a.SHOW_ALL = "showAll",
        a.EXACT_FIT = "exactFit",
        a
    }
    ();
    a.StageScaleMode = b,
    b.prototype.__class__ = "egret.StageScaleMode",
    b = function() {
        function a() {}
        return a.FIXED_WIDTH = 1,
        a.FIXED_HEIGHT = 2,
        a
    }
    (),
    a.NoBorderMode = b,
    b.prototype.__class__ = "egret.NoBorderMode"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(a, c) {
            void 0 === a && (a = 480),
            void 0 === c && (c = 800),
            b.call(this),
            this._changeSizeDispatchFlag = !0,
            this._scaleMode = "",
            this._stageHeight = this._stageWidth = 0 / 0,
            this.touchEnabled = !0,
            this._stage = this,
            this._stageWidth = a,
            this._stageHeight = c
        }
        return __extends(c, b),
        c.prototype.invalidate = function() {
            c._invalidateRenderFlag = !0
        }
        ,
        Object.defineProperty(c.prototype, "scaleMode", {
            get: function() {
                return this._scaleMode
            },
            set: function(a) {
                this._scaleMode != a && (this._scaleMode = a,
                this.setResolutionPolicy())
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype.changeSize = function() {
            this._changeSizeDispatchFlag && (this.setResolutionPolicy(),
            this.dispatchEventWith(a.Event.RESIZE))
        }
        ,
        c.prototype.setResolutionPolicy = function() {
            var d, b = c.SCALE_MODE_ENUM[this._scaleMode];
            if (!b)
                throw Error(a.getString(1024));
            d = new a.EqualToFrame,
            b = new a.ResolutionPolicy(d,b),
            a.StageDelegate.getInstance()._setResolutionPolicy(b),
            this._stageWidth = a.StageDelegate.getInstance()._stageWidth,
            this._stageHeight = a.StageDelegate.getInstance()._stageHeight
        }
        ,
        Object.defineProperty(c.prototype, "stageWidth", {
            get: function() {
                return this._stageWidth
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "stageHeight", {
            get: function() {
                return this._stageHeight
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype.hitTest = function(b, c, d) {
            var e, f, g, h;
            if (!this._touchEnabled)
                return null ;
            if (!this._touchChildren)
                return this;
            for (d = this._children,
            f = d.length - 1; f >= 0; f--)
                if (e = d[f],
                g = e._getMatrix(),
                h = e._scrollRect,
                h && g.append(1, 0, 0, 1, -h.x, -h.y),
                g.invert(),
                g = a.Matrix.transformCoords(g, b, c),
                (e = e.hitTest(g.x, g.y, !0)) && e._touchEnabled)
                    return e;
            return this
        }
        ,
        c.prototype.getBounds = function(b) {
            return b || (b = new a.Rectangle),
            b.initialize(0, 0, this._stageWidth, this._stageHeight)
        }
        ,
        c.prototype._updateTransform = function() {
            for (var a = 0, b = this._children.length; b > a; a++)
                this._children[a]._updateTransform()
        }
        ,
        Object.defineProperty(c.prototype, "focus", {
            get: function() {
                return null 
            },
            enumerable: !0,
            configurable: !0
        }),
        c.registerScaleMode = function(b, d, e) {
            c.SCALE_MODE_ENUM[b] && !e ? a.Logger.warningWithErrorId(1009, b) : c.SCALE_MODE_ENUM[b] = d
        }
        ,
        c._invalidateRenderFlag = !1,
        c.SCALE_MODE_ENUM = {},
        c
    }
    (a.DisplayObjectContainer);
    a.Stage = b,
    b.prototype.__class__ = "egret.Stage"
}
(egret || (egret = {})),
egret.Stage.SCALE_MODE_ENUM[egret.StageScaleMode.NO_SCALE] = new egret.NoScale,
egret.Stage.SCALE_MODE_ENUM[egret.StageScaleMode.SHOW_ALL] = new egret.ShowAll,
egret.Stage.SCALE_MODE_ENUM[egret.StageScaleMode.NO_BORDER] = new egret.FixedWidth,
egret.Stage.SCALE_MODE_ENUM[egret.StageScaleMode.EXACT_FIT] = new egret.FullScreen,
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(c) {
            void 0 === c && (c = null ),
            b.call(this),
            this._lastTouchPosition = new a.Point(0,0),
            this._touchStartPosition = new a.Point(0,0),
            this._scrollStarted = !1,
            this._lastTouchTime = 0,
            this._lastTouchEvent = null ,
            this._velocitys = [],
            this._isVTweenPlaying = this._isHTweenPlaying = !1,
            this._vScrollTween = this._hScrollTween = null ,
            this.scrollBeginThreshold = 10,
            this.scrollSpeed = 1,
            this._content = null ,
            this._horizontalScrollPolicy = this._verticalScrollPolicy = "auto",
            this._scrollTop = this._scrollLeft = 0,
            this._vCanScroll = this._hCanScroll = !1,
            this.touchBeginTimer = this.delayTouchBeginEvent = null ,
            this.touchEnabled = !0,
            c && this.setContent(c)
        }
        return __extends(c, b),
        c.prototype.setContent = function(a) {
            this._content !== a && (this.removeContent(),
            a && (this._content = a,
            b.prototype.addChild.call(this, a),
            this._addEvents()))
        }
        ,
        c.prototype.removeContent = function() {
            this._content && (this._removeEvents(),
            b.prototype.removeChildAt.call(this, 0)),
            this._content = null 
        }
        ,
        Object.defineProperty(c.prototype, "verticalScrollPolicy", {
            get: function() {
                return this._verticalScrollPolicy
            },
            set: function(a) {
                a != this._verticalScrollPolicy && (this._verticalScrollPolicy = a)
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "horizontalScrollPolicy", {
            get: function() {
                return this._horizontalScrollPolicy
            },
            set: function(a) {
                a != this._horizontalScrollPolicy && (this._horizontalScrollPolicy = a)
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "scrollLeft", {
            get: function() {
                return this._scrollLeft
            },
            set: function(a) {
                a != this._scrollLeft && (this._scrollLeft = a,
                this._validatePosition(!1, !0),
                this._updateContentPosition())
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "scrollTop", {
            get: function() {
                return this._scrollTop
            },
            set: function(a) {
                a != this._scrollTop && (this._scrollTop = a,
                this._validatePosition(!0, !1),
                this._updateContentPosition())
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype.setScrollPosition = function(a, b, c) {
            if (void 0 === c && (c = !1),
            !(c && 0 == a && 0 == b || !c && this._scrollTop == a && this._scrollLeft == b)) {
                if (c) {
                    c = this._isOnTheEdge(!0);
                    var d = this._isOnTheEdge(!1);
                    this._scrollTop += c ? a / 2 : a,
                    this._scrollLeft += d ? b / 2 : b
                } else
                    this._scrollTop = a,
                    this._scrollLeft = b;
                this._validatePosition(!0, !0),
                this._updateContentPosition()
            }
        }
        ,
        c.prototype._isOnTheEdge = function(a) {
            void 0 === a && (a = !0);
            var b = this._scrollTop
              , c = this._scrollLeft;
            return a ? 0 > b || b > this.getMaxScrollTop() : 0 > c || c > this.getMaxScrollLeft()
        }
        ,
        c.prototype._validatePosition = function(a, b) {
            if (void 0 === a && (a = !1),
            void 0 === b && (b = !1),
            a) {
                var c = this.height
                  , d = this._getContentHeight();
                this._scrollTop = Math.max(this._scrollTop, (0 - c) / 2),
                this._scrollTop = Math.min(this._scrollTop, d > c ? d - c / 2 : c / 2)
            }
            b && (c = this.width,
            d = this._getContentWidth(),
            this._scrollLeft = Math.max(this._scrollLeft, (0 - c) / 2),
            this._scrollLeft = Math.min(this._scrollLeft, d > c ? d - c / 2 : c / 2))
        }
        ,
        c.prototype._setWidth = function(a) {
            this._explicitWidth != a && (b.prototype._setWidth.call(this, a),
            this._updateContentPosition())
        }
        ,
        c.prototype._setHeight = function(a) {
            this._explicitHeight != a && (b.prototype._setHeight.call(this, a),
            this._updateContentPosition())
        }
        ,
        c.prototype._updateContentPosition = function() {
            var b = this.getBounds(a.Rectangle.identity);
            this.scrollRect = new a.Rectangle(this._scrollLeft,this._scrollTop,b.width,b.height),
            this.dispatchEvent(new a.Event(a.Event.CHANGE))
        }
        ,
        c.prototype._checkScrollPolicy = function() {
            var b, a = this.__checkScrollPolicy(this._horizontalScrollPolicy, this._getContentWidth(), this.width);
            return this._hCanScroll = a,
            b = this.__checkScrollPolicy(this._verticalScrollPolicy, this._getContentHeight(), this.height),
            this._vCanScroll = b,
            a || b
        }
        ,
        c.prototype.__checkScrollPolicy = function(a, b, c) {
            return "on" == a ? !0 : "off" == a ? !1 : b > c
        }
        ,
        c.prototype._addEvents = function() {
            this.addEventListener(a.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this),
            this.addEventListener(a.TouchEvent.TOUCH_BEGIN, this._onTouchBeginCapture, this, !0),
            this.addEventListener(a.TouchEvent.TOUCH_END, this._onTouchEndCapture, this, !0)
        }
        ,
        c.prototype._removeEvents = function() {
            this.removeEventListener(a.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this),
            this.removeEventListener(a.TouchEvent.TOUCH_BEGIN, this._onTouchBeginCapture, this, !0),
            this.removeEventListener(a.TouchEvent.TOUCH_END, this._onTouchEndCapture, this, !0)
        }
        ,
        c.prototype._onTouchBegin = function(b) {
            !b._isDefaultPrevented && this._checkScrollPolicy() && (this._touchStartPosition.x = b.stageX,
            this._touchStartPosition.y = b.stageY,
            (this._isHTweenPlaying || this._isVTweenPlaying) && this._onScrollFinished(),
            this.stage.addEventListener(a.TouchEvent.TOUCH_MOVE, this._onTouchMove, this),
            this.stage.addEventListener(a.TouchEvent.TOUCH_END, this._onTouchEnd, this),
            this.stage.addEventListener(a.TouchEvent.LEAVE_STAGE, this._onTouchEnd, this),
            this.addEventListener(a.Event.ENTER_FRAME, this._onEnterFrame, this),
            this._logTouchEvent(b),
            b.preventDefault())
        }
        ,
        c.prototype._onTouchBeginCapture = function(b) {
            var e, d = this._checkScrollPolicy();
            if (d) {
                for (e = b.target; e != this; ) {
                    if (e instanceof c && (d = e._checkScrollPolicy()))
                        return;
                    e = e.parent
                }
                b.stopPropagation(),
                this.delayTouchBeginEvent = this.cloneTouchEvent(b),
                this.touchBeginTimer || (this.touchBeginTimer = new a.Timer(100,1),
                this.touchBeginTimer.addEventListener(a.TimerEvent.TIMER_COMPLETE, this._onTouchBeginTimer, this)),
                this.touchBeginTimer.start(),
                this._onTouchBegin(b)
            }
        }
        ,
        c.prototype._onTouchEndCapture = function() {
            this.delayTouchBeginEvent && this._onTouchBeginTimer()
        }
        ,
        c.prototype._onTouchBeginTimer = function() {
            this.touchBeginTimer.stop();
            var a = this.delayTouchBeginEvent;
            this.delayTouchBeginEvent = null ,
            this.stage && this.dispatchPropagationEvent(a)
        }
        ,
        c.prototype.dispatchPropagationEvent = function(a) {
            var b, c, d, e;
            for (b = [],
            c = a._target; c; )
                b.push(c),
                c = c.parent;
            for (d = this._content,
            e = 1; c = b[e],
            c && c !== d; e += 2)
                b.unshift(c);
            this._dispatchPropagationEvent(a, b)
        }
        ,
        c.prototype._dispatchPropagationEvent = function(a, b, c) {
            var d, e, f;
            for (d = b.length,
            e = 0; d > e && (f = b[e],
            a._currentTarget = f,
            a._target = this,
            a._eventPhase = c > e ? 1 : e == c ? 2 : 3,
            f._notifyListener(a),
            !a._isPropagationStopped && !a._isPropagationImmediateStopped); e++)
                ;
        }
        ,
        c.prototype._onTouchMove = function(a) {
            if (this._lastTouchPosition.x != a.stageX || this._lastTouchPosition.y != a.stageY) {
                if (!this._scrollStarted) {
                    var b = a.stageX - this._touchStartPosition.x
                      , c = a.stageY - this._touchStartPosition.y;
                    if (Math.sqrt(b * b + c * c) < this.scrollBeginThreshold)
                        return this._logTouchEvent(a),
                        void 0
                }
                this._scrollStarted = !0,
                this.delayTouchBeginEvent && (this.delayTouchBeginEvent = null ,
                this.touchBeginTimer.stop()),
                this.touchChildren = !1,
                b = this._getPointChange(a),
                this.setScrollPosition(b.y, b.x, !0),
                this._calcVelocitys(a),
                this._logTouchEvent(a)
            }
        }
        ,
        c.prototype._onTouchEnd = function() {
            this.touchChildren = !0,
            this._scrollStarted = !1,
            a.MainContext.instance.stage.removeEventListener(a.TouchEvent.TOUCH_MOVE, this._onTouchMove, this),
            a.MainContext.instance.stage.removeEventListener(a.TouchEvent.TOUCH_END, this._onTouchEnd, this),
            a.MainContext.instance.stage.removeEventListener(a.TouchEvent.LEAVE_STAGE, this._onTouchEnd, this),
            this.removeEventListener(a.Event.ENTER_FRAME, this._onEnterFrame, this),
            this._moveAfterTouchEnd()
        }
        ,
        c.prototype._onEnterFrame = function(b) {
            b = a.getTimer(),
            100 < b - this._lastTouchTime && 300 > b - this._lastTouchTime && this._calcVelocitys(this._lastTouchEvent)
        }
        ,
        c.prototype._logTouchEvent = function(b) {
            this._lastTouchPosition.x = b.stageX,
            this._lastTouchPosition.y = b.stageY,
            this._lastTouchEvent = this.cloneTouchEvent(b),
            this._lastTouchTime = a.getTimer()
        }
        ,
        c.prototype._getPointChange = function(a) {
            return {
                x: !1 === this._hCanScroll ? 0 : this._lastTouchPosition.x - a.stageX,
                y: !1 === this._vCanScroll ? 0 : this._lastTouchPosition.y - a.stageY
            }
        }
        ,
        c.prototype._calcVelocitys = function(b) {
            var d, c = a.getTimer();
            0 == this._lastTouchTime ? this._lastTouchTime = c : (d = this._getPointChange(b),
            c -= this._lastTouchTime,
            d.x /= c,
            d.y /= c,
            this._velocitys.push(d),
            5 < this._velocitys.length && this._velocitys.shift(),
            this._lastTouchPosition.x = b.stageX,
            this._lastTouchPosition.y = b.stageY)
        }
        ,
        c.prototype._getContentWidth = function() {
            return this._content.explicitWidth || this._content.width
        }
        ,
        c.prototype._getContentHeight = function() {
            return this._content.explicitHeight || this._content.height
        }
        ,
        c.prototype.getMaxScrollLeft = function() {
            var a = this._getContentWidth() - this.width;
            return Math.max(0, a)
        }
        ,
        c.prototype.getMaxScrollTop = function() {
            var a = this._getContentHeight() - this.height;
            return Math.max(0, a)
        }
        ,
        c.prototype._moveAfterTouchEnd = function() {
            var a, b, d, e, f, g;
            if (0 != this._velocitys.length) {
                for (a = 0,
                b = 0,
                d = 0,
                e = 0; e < this._velocitys.length; e++)
                    f = this._velocitys[e],
                    g = c.weight[e],
                    a += f.x * g,
                    b += f.y * g,
                    d += g;
                this._velocitys.length = 0,
                0 >= this.scrollSpeed && (this.scrollSpeed = 1),
                a = a / d * this.scrollSpeed,
                b = b / d * this.scrollSpeed,
                f = Math.abs(a),
                d = Math.abs(b),
                g = this.getMaxScrollLeft(),
                e = this.getMaxScrollTop(),
                a = f > .02 ? this.getAnimationDatas(a, this._scrollLeft, g) : {
                    position: this._scrollLeft,
                    duration: 1
                },
                b = d > .02 ? this.getAnimationDatas(b, this._scrollTop, e) : {
                    position: this._scrollTop,
                    duration: 1
                },
                this.setScrollLeft(a.position, a.duration),
                this.setScrollTop(b.position, b.duration)
            }
        }
        ,
        c.prototype._onTweenFinished = function(a) {
            a == this._vScrollTween && (this._isVTweenPlaying = !1),
            a == this._hScrollTween && (this._isHTweenPlaying = !1),
            0 == this._isHTweenPlaying && 0 == this._isVTweenPlaying && this._onScrollFinished()
        }
        ,
        c.prototype._onScrollStarted = function() {}
        ,
        c.prototype._onScrollFinished = function() {
            a.Tween.removeTweens(this),
            this._vScrollTween = this._hScrollTween = null ,
            this._isVTweenPlaying = this._isHTweenPlaying = !1,
            this.dispatchEvent(new a.Event(a.Event.COMPLETE))
        }
        ,
        c.prototype.setScrollTop = function(b, c) {
            var d, e;
            return void 0 === c && (c = 0),
            d = Math.min(this.getMaxScrollTop(), Math.max(b, 0)),
            0 == c ? (this.scrollTop = d,
            null ) : (e = a.Tween.get(this).to({
                scrollTop: b
            }, c, a.Ease.quartOut),
            d != b && e.to({
                scrollTop: d
            }, 300, a.Ease.quintOut),
            this._isVTweenPlaying = !0,
            this._vScrollTween = e,
            e.call(this._onTweenFinished, this, [e]),
            this._isHTweenPlaying || this._onScrollStarted(),
            e)
        }
        ,
        c.prototype.setScrollLeft = function(b, c) {
            var d, e;
            return void 0 === c && (c = 0),
            d = Math.min(this.getMaxScrollLeft(), Math.max(b, 0)),
            0 == c ? (this.scrollLeft = d,
            null ) : (e = a.Tween.get(this).to({
                scrollLeft: b
            }, c, a.Ease.quartOut),
            d != b && e.to({
                scrollLeft: d
            }, 300, a.Ease.quintOut),
            this._isHTweenPlaying = !0,
            this._hScrollTween = e,
            e.call(this._onTweenFinished, this, [e]),
            this._isVTweenPlaying || this._onScrollStarted(),
            e)
        }
        ,
        c.prototype.getAnimationDatas = function(a, b, c) {
            var d = Math.abs(a)
              , e = 0
              , f = b + 500 * a;
            if (0 > f || f > c)
                for (f = b; 1 / 0 != Math.abs(a) && .02 < Math.abs(a); )
                    f += a,
                    a = 0 > f || f > c ? .95 * .998 * a : .998 * a,
                    e++;
            else
                e = 500 * -Math.log(.02 / d);
            return {
                position: Math.min(c + 50, Math.max(f, -50)),
                duration: e
            }
        }
        ,
        c.prototype.cloneTouchEvent = function(b) {
            var c = new a.TouchEvent(b._type,b._bubbles,b.cancelable);
            return c.touchPointID = b.touchPointID,
            c._stageX = b._stageX,
            c._stageY = b._stageY,
            c.ctrlKey = b.ctrlKey,
            c.altKey = b.altKey,
            c.shiftKey = b.shiftKey,
            c.touchDown = b.touchDown,
            c._isDefaultPrevented = !1,
            c._target = b._target,
            c
        }
        ,
        c.prototype.throwNotSupportedError = function() {
            throw Error(a.getString(1023))
        }
        ,
        c.prototype.addChild = function() {
            return this.throwNotSupportedError(),
            null 
        }
        ,
        c.prototype.addChildAt = function() {
            return this.throwNotSupportedError(),
            null 
        }
        ,
        c.prototype.removeChild = function() {
            return this.throwNotSupportedError(),
            null 
        }
        ,
        c.prototype.removeChildAt = function() {
            return this.throwNotSupportedError(),
            null 
        }
        ,
        c.prototype.setChildIndex = function() {
            this.throwNotSupportedError()
        }
        ,
        c.prototype.swapChildren = function() {
            this.throwNotSupportedError()
        }
        ,
        c.prototype.swapChildrenAt = function() {
            this.throwNotSupportedError()
        }
        ,
        c.prototype.hitTest = function(c, d, e) {
            void 0 === e && (e = !1);
            var f = b.prototype.hitTest.call(this, c, d, e);
            return f ? f : a.DisplayObject.prototype.hitTest.call(this, c, d, e)
        }
        ,
        c.weight = [1, 1.33, 1.66, 2, 2.33],
        c
    }
    (a.DisplayObjectContainer);
    a.ScrollView = b,
    b.prototype.__class__ = "egret.ScrollView"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function a() {}
        return a.REPEAT = "repeat",
        a.SCALE = "scale",
        a
    }
    ();
    a.BitmapFillMode = b,
    b.prototype.__class__ = "egret.BitmapFillMode"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(a) {
            b.call(this),
            this.debug = !1,
            this.debugColor = 16711680,
            this.scale9Grid = this._texture = null ,
            this.fillMode = "scale",
            a && (this._texture = a,
            this._setSizeDirty()),
            this.needDraw = !0
        }
        return __extends(c, b),
        Object.defineProperty(c.prototype, "texture", {
            get: function() {
                return this._texture
            },
            set: function(a) {
                a != this._texture && (this._setSizeDirty(),
                this._texture = a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._render = function(a) {
            var b = this._texture;
            b ? (this._texture_to_render = b,
            c._drawBitmap(a, this._hasWidthSet ? this._explicitWidth : b._textureWidth, this._hasHeightSet ? this._explicitHeight : b._textureHeight, this)) : this._texture_to_render = null 
        }
        ,
        c._drawBitmap = function(a, b, d, e) {
            var g, h, i, j, k, l, f = e._texture_to_render;
            f && (g = f._textureWidth,
            h = f._textureHeight,
            "scale" == e.fillMode ? (i = e.scale9Grid || f.scale9Grid,
            i && g - i.width < b && h - i.height < d ? c.drawScale9GridImage(a, e, i, b, d) : (i = f._offsetX,
            j = f._offsetY,
            k = f._bitmapWidth || g,
            l = f._bitmapHeight || h,
            b /= g,
            i = Math.round(i * b),
            b = Math.round(k * b),
            d /= h,
            j = Math.round(j * d),
            d = Math.round(l * d),
            c.renderFilter.drawImage(a, e, f._bitmapX, f._bitmapY, k, l, i, j, b, d))) : c.drawRepeatImage(a, e, b, d, e.fillMode))
        }
        ,
        c.drawRepeatImage = function(b, c, d, e, f) {
            var h, i, j, k, l, g = c._texture_to_render;
            g && (h = g._textureWidth,
            i = g._textureHeight,
            j = g._bitmapX,
            k = g._bitmapY,
            h = g._bitmapWidth || h,
            i = g._bitmapHeight || i,
            l = g._offsetX,
            g = g._offsetY,
            a.RenderFilter.getInstance().drawImage(b, c, j, k, h, i, l, g, d, e, f))
        }
        ,
        c.drawScale9GridImage = function(b, c, d, e, f) {
            var i, j, k, l, m, n, o, p, q, r, s, t, u, g = a.MainContext.instance.rendererContext._texture_scale_factor, h = c._texture_to_render;
            h && d && (i = h._textureWidth,
            j = h._textureHeight,
            k = h._bitmapX,
            l = h._bitmapY,
            m = h._bitmapWidth || i,
            n = h._bitmapHeight || j,
            e -= i - m,
            f -= j - n,
            b.drawImageScale9(h, k, l, m, n, h._offsetX, h._offsetY, e, f, d) || (i = h._offsetX / g,
            j = h._offsetY / g,
            h = a.RenderFilter.getInstance(),
            d = a.Rectangle.identity.initialize(d.x - Math.round(i), d.y - Math.round(i), d.width, d.height),
            i = Math.round(i),
            j = Math.round(j),
            d.y == d.bottom && (d.bottom < n ? d.bottom++ : d.y--),
            d.x == d.right && (d.right < m ? d.right++ : d.x--),
            o = k + d.x / g,
            p = k + d.right / g,
            q = m - d.right,
            r = l + d.y / g,
            g = l + d.bottom / g,
            s = n - d.bottom,
            t = i + d.x,
            u = j + d.y,
            n = f - (n - d.bottom),
            m = e - (m - d.right),
            h.drawImage(b, c, k, l, d.x, d.y, i, j, d.x, d.y),
            h.drawImage(b, c, o, l, d.width, d.y, t, j, m - d.x, d.y),
            h.drawImage(b, c, p, l, q, d.y, i + m, j, e - m, d.y),
            h.drawImage(b, c, k, r, d.x, d.height, i, u, d.x, n - d.y),
            h.drawImage(b, c, o, r, d.width, d.height, t, u, m - d.x, n - d.y),
            h.drawImage(b, c, p, r, q, d.height, i + m, u, e - m, n - d.y),
            h.drawImage(b, c, k, g, d.x, s, i, j + n, d.x, f - n),
            h.drawImage(b, c, o, g, d.width, s, t, j + n, m - d.x, f - n),
            h.drawImage(b, c, p, g, q, s, i + m, j + n, e - m, f - n)))
        }
        ,
        c.prototype._measureBounds = function() {
            var c = this._texture;
            return c ? a.Rectangle.identity.initialize(c._offsetX, c._offsetY, c._textureWidth, c._textureHeight) : b.prototype._measureBounds.call(this)
        }
        ,
        c.debug = !1,
        c.renderFilter = a.RenderFilter.getInstance(),
        c
    }
    (a.DisplayObject);
    a.Bitmap = b,
    b.prototype.__class__ = "egret.Bitmap"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this._text = "",
            this._textChanged = !1,
            this._font = null ,
            this._fontChanged = !1,
            this._textOffsetY = this._textOffsetX = this._textHeight = this._textWidth = 0,
            this.textLinesChange = !0,
            this._lineHeights = [],
            this.cacheAsBitmap = !0
        }
        return __extends(c, b),
        Object.defineProperty(c.prototype, "text", {
            get: function() {
                return this._text
            },
            set: function(a) {
                this._text != a && (this._textChanged = !0,
                this._text = a,
                this._setSizeDirty())
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "font", {
            get: function() {
                return this._font
            },
            set: function(a) {
                this._font != a && (this._font = a,
                this._fontChanged = !0,
                this._setSizeDirty())
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "spriteSheet", {
            get: function() {
                return this._font
            },
            set: function(a) {
                this.font = a
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setSizeDirty = function() {
            b.prototype._setSizeDirty.call(this),
            this.textLinesChange = !0
        }
        ,
        c.prototype._render = function(b) {
            var f, g, h, i, j, k, l, m, n, o, p, q, r, s, d = this.getTextLines(), e = d.length;
            if (0 != e) {
                for (f = this._font,
                g = f._getFirstCharHeight(),
                g = Math.ceil(g * c.EMPTY_FACTOR),
                h = 0,
                i = this._hasHeightSet ? this._explicitHeight : Number.POSITIVE_INFINITY,
                j = this._lineHeights,
                k = 0; e > k && (l = j[k],
                !(k > 0 && h + l > i)); k++) {
                    for (m = d[k],
                    n = m.length,
                    o = 0,
                    p = 0; n > p; p++)
                        q = m.charAt(p),
                        r = f.getTexture(q),
                        r ? (q = r._bitmapWidth || r._textureWidth,
                        s = r._bitmapHeight || r._textureHeight,
                        this._texture_to_render = r,
                        a.RenderFilter.getInstance().drawImage(b, this, r._bitmapX, r._bitmapY, q, s, o + r._offsetX, h + r._offsetY, q, s),
                        o += r._textureWidth) : " " == q ? o += g : a.Logger.warningWithErrorId(1011, q);
                    h += l
                }
                this._texture_to_render = null 
            }
        }
        ,
        c.prototype._measureBounds = function() {
            return 0 == this.getTextLines().length ? a.Rectangle.identity.initialize(0, 0, 0, 0) : a.Rectangle.identity.initialize(this._textOffsetX, this._textOffsetY, this._textWidth - this._textOffsetX, this._textHeight - this._textOffsetY)
        }
        ,
        c.prototype.getTextLines = function() {
            var b, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, y, x, z, A, B;
            if (!this.textLinesChange)
                return this._textLines;
            if (b = [],
            this._textLines = b,
            this.textLinesChange = !1,
            d = [],
            this._lineHeights = d,
            !this._text || !this._font)
                return b;
            for (e = 0,
            f = 0,
            g = 0,
            h = 0,
            i = this._hasWidthSet,
            j = this._hasWidthSet ? this._explicitWidth : Number.POSITIVE_INFINITY,
            k = this._font,
            l = k._getFirstCharHeight(),
            m = Math.ceil(l * c.EMPTY_FACTOR),
            n = this._text.split(/(?:\r\n|\r|\n)/),
            o = n.length,
            p = !0,
            q = 0; o > q; q++) {
                for (r = n[q],
                s = r.length,
                t = 0,
                u = 0,
                v = !0,
                w = 0; s > w; w++) {
                    if (x = r.charAt(w),
                    z = 0,
                    A = 0,
                    B = k.getTexture(x),
                    B)
                        x = B._textureWidth,
                        y = B._textureHeight,
                        z = B._offsetX,
                        A = B._offsetY;
                    else {
                        if (" " != x) {
                            a.Logger.warningWithErrorId(1011, x),
                            v && (v = !1);
                            continue
                        }
                        x = m,
                        y = l
                    }
                    v && (v = !1,
                    g = Math.min(z, g)),
                    p && (h = Math.min(A, h)),
                    i && w > 0 && u + x > j ? (b.push(r.substring(0, w)),
                    d.push(t),
                    f += t,
                    e = Math.max(u, e),
                    r = r.substring(w),
                    s = r.length,
                    w = 0,
                    u = x,
                    t = y) : (u += x,
                    t = Math.max(y, t))
                }
                p && (p = !1),
                b.push(r),
                d.push(t),
                f += t,
                e = Math.max(u, e)
            }
            return this._textWidth = e,
            this._textHeight = f,
            this._textOffsetX = g,
            this._textOffsetY = h,
            b
        }
        ,
        c.EMPTY_FACTOR = .33,
        c
    }
    (a.DisplayObject);
    a.BitmapText = b,
    b.prototype.__class__ = "egret.BitmapText"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function b() {
            this.fillStyleColor = this.strokeStyleColor = this.renderContext = this.commandQueue = this.canvasContext = null ,
            this._dirty = !1,
            this._lastY = this._lastX = this._maxY = this._maxX = this._minY = this._minX = 0,
            this.commandQueue = []
        }
        return b.prototype.beginFill = function() {}
        ,
        b.prototype._setStyle = function() {}
        ,
        b.prototype.drawRect = function(a, b, c, d) {
            this.checkRect(a, b, c, d)
        }
        ,
        b.prototype.drawCircle = function(a, b, c) {
            this.checkRect(a - c, b - c, 2 * c, 2 * c)
        }
        ,
        b.prototype.drawRoundRect = function(a, b, c, d) {
            this.checkRect(a, b, c, d)
        }
        ,
        b.prototype.drawEllipse = function(a, b, c, d) {
            this.checkRect(a - c, b - d, 2 * c, 2 * d)
        }
        ,
        b.prototype.lineStyle = function() {}
        ,
        b.prototype.lineTo = function(a, b) {
            this.checkPoint(a, b)
        }
        ,
        b.prototype.curveTo = function(a, b, c, d) {
            this.checkPoint(a, b),
            this.checkPoint(c, d)
        }
        ,
        b.prototype.moveTo = function(a, b) {
            this.checkPoint(a, b)
        }
        ,
        b.prototype.clear = function() {
            this._maxY = this._maxX = this._minY = this._minX = 0
        }
        ,
        b.prototype.endFill = function() {}
        ,
        b.prototype._draw = function() {}
        ,
        b.prototype.checkRect = function(a, b, c, d) {
            this._minX = Math.min(this._minX, a),
            this._minY = Math.min(this._minY, b),
            this._maxX = Math.max(this._maxX, a + c),
            this._maxY = Math.max(this._maxY, b + d)
        }
        ,
        b.prototype.checkPoint = function(a, b) {
            this._minX = Math.min(this._minX, a),
            this._minY = Math.min(this._minY, b),
            this._maxX = Math.max(this._maxX, a),
            this._maxY = Math.max(this._maxY, b),
            this._lastX = a,
            this._lastY = b
        }
        ,
        b.prototype._measureBounds = function() {
            return a.Rectangle.identity.initialize(this._minX, this._minY, this._maxX - this._minX, this._maxY - this._minY)
        }
        ,
        b
    }
    ();
    a.Graphics = b,
    b.prototype.__class__ = "egret.Graphics",
    function() {
        return function(a, b, c) {
            this.method = a,
            this.thisObject = b,
            this.args = c
        }
    }
    ().prototype.__class__ = "egret.Command"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this._graphics = null 
        }
        return __extends(c, b),
        Object.defineProperty(c.prototype, "graphics", {
            get: function() {
                return this._graphics || (this._graphics = new a.Graphics,
                this.needDraw = !0),
                this._graphics
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._render = function(a) {
            this._graphics && this._graphics._draw(a)
        }
        ,
        c.prototype._measureBounds = function() {
            var a = this._graphics;
            return a ? a._measureBounds() : b.prototype._measureBounds.call(this)
        }
        ,
        c
    }
    (a.DisplayObject);
    a.Shape = b,
    b.prototype.__class__ = "egret.Shape"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this._graphics = null 
        }
        return __extends(c, b),
        Object.defineProperty(c.prototype, "graphics", {
            get: function() {
                return this._graphics || (this._graphics = new a.Graphics,
                this.needDraw = !0),
                this._graphics
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._render = function(a) {
            this._graphics && this._graphics._draw(a),
            b.prototype._render.call(this, a)
        }
        ,
        c.prototype._measureBounds = function() {
            var b, c, d, e, f, g, h, i, j, k, l;
            for (b = 0,
            c = 0,
            d = 0,
            e = 0,
            f = this._children.length,
            g = 0; f > g; g++)
                h = this._children[g],
                h._visible && (i = h.getBounds(a.Rectangle.identity, !1),
                j = i.x,
                k = i.y,
                l = i.width,
                i = i.height,
                h = h._getMatrix(),
                h = a.DisplayObject.getTransformBounds(a.Rectangle.identity.initialize(j, k, l, i), h),
                j = h.x,
                k = h.y,
                l = h.width + h.x,
                h = h.height + h.y,
                (b > j || 0 == g) && (b = j),
                (l > c || 0 == g) && (c = l),
                (d > k || 0 == g) && (d = k),
                (h > e || 0 == g) && (e = h));
            return this._graphics && (f = this._graphics._measureBounds(),
            j = f.x,
            k = f.y,
            l = f.width + f.x,
            h = f.height + f.y,
            (b > j || 0 == g) && (b = j),
            (l > c || 0 == g) && (c = l),
            (d > k || 0 == g) && (d = k),
            (h > e || 0 == g) && (e = h)),
            a.Rectangle.identity.initialize(b, d, c - b, e - d)
        }
        ,
        c
    }
    (a.DisplayObjectContainer);
    a.Sprite = b,
    b.prototype.__class__ = "egret.Sprite"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this._inputEnabled = !1,
            this._type = "",
            this._inputUtils = null ,
            this._text = "",
            this._displayAsPassword = !1,
            this._fontFamily = c.default_fontFamily,
            this._size = 30,
            this._bold = this._italic = !1,
            this._textColorString = "#FFFFFF",
            this._textColor = 16777215,
            this._strokeColorString = "#000000",
            this._stroke = this._strokeColor = 0,
            this._textAlign = "left",
            this._verticalAlign = "top",
            this._maxChars = 0,
            this._scrollV = -1,
            this._numLines = this._lineSpacing = this._maxScrollV = 0,
            this._isFlow = this._multiline = !1,
            this._textArr = [],
            this._isArrayChanged = !1,
            this._textMaxHeight = this._textMaxWidth = 0,
            this._linesArr = [],
            this.needDraw = !0
        }
        return __extends(c, b),
        c.prototype.isInput = function() {
            return this._type == a.TextFieldType.INPUT
        }
        ,
        c.prototype._setTouchEnabled = function(a) {
            b.prototype._setTouchEnabled.call(this, a),
            this.isInput() && (this._inputEnabled = !0)
        }
        ,
        Object.defineProperty(c.prototype, "type", {
            get: function() {
                return this._type
            },
            set: function(a) {
                this._setType(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setType = function(b) {
            this._type != b && (this._type = b,
            this._type == a.TextFieldType.INPUT ? (this._hasWidthSet || this._setWidth(100),
            this._hasHeightSet || this._setHeight(30),
            null  == this._inputUtils && (this._inputUtils = new a.InputController),
            this._inputUtils.init(this),
            this._setDirty(),
            this._stage && this._inputUtils._addStageText()) : this._inputUtils && (this._inputUtils._removeStageText(),
            this._inputUtils = null ))
        }
        ,
        Object.defineProperty(c.prototype, "text", {
            get: function() {
                return this._getText()
            },
            set: function(a) {
                this._setText(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._getText = function() {
            return this._type == a.TextFieldType.INPUT ? this._inputUtils._getText() : this._text
        }
        ,
        c.prototype._setSizeDirty = function() {
            b.prototype._setSizeDirty.call(this),
            this._isArrayChanged = !0
        }
        ,
        c.prototype._setTextDirty = function() {
            this._setSizeDirty()
        }
        ,
        c.prototype._setBaseText = function(a) {
            null  == a && (a = ""),
            this._isFlow = !1,
            this._text != a && (this._setTextDirty(),
            this._text = a,
            a = "",
            a = this._displayAsPassword ? this.changeToPassText(this._text) : this._text,
            this.setMiddleStyle([{
                text: a
            }]))
        }
        ,
        c.prototype._setText = function(a) {
            null  == a && (a = ""),
            this._setBaseText(a),
            this._inputUtils && this._inputUtils._setText(this._text)
        }
        ,
        Object.defineProperty(c.prototype, "displayAsPassword", {
            get: function() {
                return this._displayAsPassword
            },
            set: function(a) {
                this._setDisplayAsPassword(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setDisplayAsPassword = function(a) {
            this._displayAsPassword != a && (this._displayAsPassword = a,
            this._setTextDirty(),
            a = "",
            a = this._displayAsPassword ? this.changeToPassText(this._text) : this._text,
            this.setMiddleStyle([{
                text: a
            }]))
        }
        ,
        Object.defineProperty(c.prototype, "fontFamily", {
            get: function() {
                return this._fontFamily
            },
            set: function(a) {
                this._setFontFamily(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setFontFamily = function(a) {
            this._fontFamily != a && (this._setTextDirty(),
            this._fontFamily = a)
        }
        ,
        Object.defineProperty(c.prototype, "size", {
            get: function() {
                return this._size
            },
            set: function(a) {
                this._setSize(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setSize = function(a) {
            this._size != a && (this._setTextDirty(),
            this._size = a)
        }
        ,
        Object.defineProperty(c.prototype, "italic", {
            get: function() {
                return this._italic
            },
            set: function(a) {
                this._setItalic(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setItalic = function(a) {
            this._italic != a && (this._setTextDirty(),
            this._italic = a)
        }
        ,
        Object.defineProperty(c.prototype, "bold", {
            get: function() {
                return this._bold
            },
            set: function(a) {
                this._setBold(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setBold = function(a) {
            this._bold != a && (this._setTextDirty(),
            this._bold = a)
        }
        ,
        Object.defineProperty(c.prototype, "textColor", {
            get: function() {
                return this._textColor
            },
            set: function(a) {
                this._setTextColor(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setTextColor = function(b) {
            this._textColor != b && (this._setTextDirty(),
            this._textColor = b,
            this._textColorString = a.toColorString(b))
        }
        ,
        Object.defineProperty(c.prototype, "strokeColor", {
            get: function() {
                return this._strokeColor
            },
            set: function(a) {
                this._setStrokeColor(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setStrokeColor = function(b) {
            this._strokeColor != b && (this._setTextDirty(),
            this._strokeColor = b,
            this._strokeColorString = a.toColorString(b))
        }
        ,
        Object.defineProperty(c.prototype, "stroke", {
            get: function() {
                return this._stroke
            },
            set: function(a) {
                this._setStroke(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setStroke = function(a) {
            this._stroke != a && (this._setTextDirty(),
            this._stroke = a)
        }
        ,
        Object.defineProperty(c.prototype, "textAlign", {
            get: function() {
                return this._textAlign
            },
            set: function(a) {
                this._setTextAlign(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setTextAlign = function(a) {
            this._textAlign != a && (this._setTextDirty(),
            this._textAlign = a)
        }
        ,
        Object.defineProperty(c.prototype, "verticalAlign", {
            get: function() {
                return this._verticalAlign
            },
            set: function(a) {
                this._setVerticalAlign(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setVerticalAlign = function(a) {
            this._verticalAlign != a && (this._setTextDirty(),
            this._verticalAlign = a)
        }
        ,
        Object.defineProperty(c.prototype, "maxChars", {
            get: function() {
                return this._maxChars
            },
            set: function(a) {
                this._setMaxChars(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setMaxChars = function(a) {
            this._maxChars != a && (this._maxChars = a)
        }
        ,
        Object.defineProperty(c.prototype, "scrollV", {
            set: function(a) {
                this._scrollV = a,
                this._setDirty()
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "maxScrollV", {
            get: function() {
                return this._maxScrollV
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "selectionBeginIndex", {
            get: function() {
                return 0
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "selectionEndIndex", {
            get: function() {
                return 0
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "caretIndex", {
            get: function() {
                return 0
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setSelection = function() {}
        ,
        Object.defineProperty(c.prototype, "lineSpacing", {
            get: function() {
                return this._lineSpacing
            },
            set: function(a) {
                this._setLineSpacing(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setLineSpacing = function(a) {
            this._lineSpacing != a && (this._setTextDirty(),
            this._lineSpacing = a)
        }
        ,
        c.prototype._getLineHeight = function() {
            return this._lineSpacing + this._size
        }
        ,
        Object.defineProperty(c.prototype, "numLines", {
            get: function() {
                return this._numLines
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "multiline", {
            get: function() {
                return this._multiline
            },
            set: function(a) {
                this._setMultiline(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setMultiline = function(a) {
            this._multiline = a,
            this._setDirty()
        }
        ,
        c.prototype.setFocus = function() {
            a.Logger.warningWithErrorId(1013)
        }
        ,
        c.prototype._onRemoveFromStage = function() {
            b.prototype._onRemoveFromStage.call(this),
            this._type == a.TextFieldType.INPUT && this._inputUtils._removeStageText()
        }
        ,
        c.prototype._onAddToStage = function() {
            b.prototype._onAddToStage.call(this),
            this._type == a.TextFieldType.INPUT && this._inputUtils._addStageText()
        }
        ,
        c.prototype._updateBaseTransform = function() {
            b.prototype._updateTransform.call(this)
        }
        ,
        c.prototype._updateTransform = function() {
            this._type == a.TextFieldType.INPUT ? this._normalDirty ? this._inputUtils._updateProperties() : this._inputUtils._updateTransform() : this._updateBaseTransform()
        }
        ,
        c.prototype._render = function(a) {
            this.drawText(a),
            this._clearDirty()
        }
        ,
        c.prototype._measureBounds = function() {
            return this._getLinesArr() ? a.Rectangle.identity.initialize(0, 0, this._textMaxWidth, this._textMaxHeight + (this._numLines - 1) * this._lineSpacing) : a.Rectangle.identity.initialize(0, 0, 0, 0)
        }
        ,
        Object.defineProperty(c.prototype, "textFlow", {
            get: function() {
                return this._textArr
            },
            set: function(a) {
                var b, c;
                for (this._isFlow = !0,
                b = "",
                null  == a && (a = []),
                c = 0; c < a.length; c++)
                    b += a[c].text;
                this._displayAsPassword ? this._setBaseText(b) : (this._text = b,
                this.setMiddleStyle(a))
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype.changeToPassText = function(a) {
            if (this._displayAsPassword) {
                for (var b = "", c = 0, d = a.length; d > c; c++)
                    switch (a.charAt(c)) {
                    case "\n":
                        b += "\n";
                        break;
                    case "\r":
                        break;
                    default:
                        b += "*"
                    }
                return b
            }
            return a
        }
        ,
        c.prototype.setMiddleStyle = function(a) {
            this._isArrayChanged = !0,
            this._textArr = a,
            this._setSizeDirty()
        }
        ,
        Object.defineProperty(c.prototype, "textWidth", {
            get: function() {
                return this._textMaxWidth
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "textHeight", {
            get: function() {
                return this._textMaxHeight
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype.appendText = function(a) {
            this.appendElement({
                text: a
            })
        }
        ,
        c.prototype.appendElement = function(a) {
            this._textArr.push(a),
            this.setMiddleStyle(this._textArr)
        }
        ,
        c.prototype._getLinesArr = function() {
            var b, c, h, d, e, f, g, i, j, k, l, m, n, o, p, q;
            if (!this._isArrayChanged)
                return this._linesArr;
            if (this._isArrayChanged = !1,
            b = this._textArr,
            c = a.MainContext.instance.rendererContext,
            this._linesArr = [],
            this._textMaxWidth = this._textMaxHeight = 0,
            this._hasWidthSet && 0 == this._explicitWidth)
                return this._numLines = 0,
                [{
                    width: 0,
                    height: 0,
                    elements: []
                }];
            for (d = this._linesArr,
            e = 0,
            f = 0,
            g = 0,
            this._isFlow || c.setupFont(this),
            i = 0; i < b.length; i++) {
                for (j = b[i],
                j.style = j.style || {},
                k = j.text.toString().split(/(?:\r\n|\r|\n)/),
                l = 0; l < k.length; l++) {
                    if (null  == d[g] && (h = {
                        width: 0,
                        height: 0,
                        elements: []
                    },
                    d[g] = h,
                    f = e = 0),
                    f = this._type == a.TextFieldType.INPUT ? this._size : Math.max(f, j.style.size || this._size),
                    "" != k[l])
                        if (this._isFlow && c.setupFont(this, j.style),
                        m = c.measureText(k[l]),
                        this._hasWidthSet)
                            if (e + m <= this._explicitWidth)
                                h.elements.push({
                                    width: m,
                                    text: k[l],
                                    style: j.style
                                }),
                                e += m;
                            else {
                                for (n = 0,
                                o = 0,
                                p = k[l],
                                q = p.length; q > n && (m = c.measureText(p.charAt(n)),
                                !(e + m > this._explicitWidth && 0 != e + n)); n++)
                                    o += m,
                                    e += m;
                                n > 0 && (h.elements.push({
                                    width: o,
                                    text: p.substring(0, n),
                                    style: j.style
                                }),
                                k[l] = p.substring(n)),
                                l--
                            }
                        else
                            e += m,
                            h.elements.push({
                                width: m,
                                text: k[l],
                                style: j.style
                            });
                    if (l < k.length - 1) {
                        if (h.width = e,
                        h.height = f,
                        this._textMaxWidth = Math.max(this._textMaxWidth, e),
                        this._textMaxHeight += f,
                        this._type == a.TextFieldType.INPUT && !this._multiline)
                            return this._numLines = d.length,
                            d;
                        g++
                    }
                }
                i == b.length - 1 && h && (h.width = e,
                h.height = f,
                this._textMaxWidth = Math.max(this._textMaxWidth, e),
                this._textMaxHeight += f)
            }
            return this._numLines = d.length,
            d
        }
        ,
        c.prototype.drawText = function(b) {
            var d, e, f, g, h, i, j, k, l, m, c = this._getLinesArr();
            if (c)
                for (this._isFlow || b.setupFont(this),
                d = this._hasWidthSet ? this._explicitWidth : this._textMaxWidth,
                e = this._textMaxHeight + (this._numLines - 1) * this._lineSpacing,
                f = 0,
                g = 0,
                this._hasHeightSet && (e < this._explicitHeight ? (h = 0,
                this._verticalAlign == a.VerticalAlign.MIDDLE ? h = .5 : this._verticalAlign == a.VerticalAlign.BOTTOM && (h = 1),
                f += h * (this._explicitHeight - e)) : e > this._explicitHeight && (g = Math.max(this._scrollV - 1, 0),
                g = Math.min(this._numLines - 1, g))),
                f = Math.round(f),
                e = 0,
                this._textAlign == a.HorizontalAlign.CENTER ? e = .5 : this._textAlign == a.HorizontalAlign.RIGHT && (e = 1),
                h = 0; g < this._numLines && (i = c[g],
                j = i.height,
                f += j / 2,
                !(0 != g && this._hasHeightSet && f > this._explicitHeight)); g++) {
                    for (h = Math.round((d - i.width) * e),
                    k = 0; k < i.elements.length; k++)
                        l = i.elements[k],
                        m = l.style.size || this._size,
                        this._type == a.TextFieldType.INPUT ? b.drawText(this, l.text, h, f + (j - m) / 2, l.width) : (this._isFlow && b.setupFont(this, l.style),
                        b.drawText(this, l.text, h, f + (j - m) / 2, l.width, l.style)),
                        h += l.width;
                    f += j / 2 + this._lineSpacing
                }
        }
        ,
        c.default_fontFamily = "Arial",
        c
    }
    (a.DisplayObject);
    a.TextField = b,
    b.prototype.__class__ = "egret.TextField"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function a() {
            this.resutlArr = []
        }
        return a.prototype.parser = function(a) {
            var b, c, d;
            for (this.stackArray = [],
            this.resutlArr = [],
            b = 0,
            c = a.length; c > b; )
                d = a.indexOf("<", b),
                0 > d ? (this.addToResultArr(a.substring(b)),
                b = c) : (this.addToResultArr(a.substring(b, d)),
                b = a.indexOf(">", d),
                "/" == a.charAt(d + 1) ? this.stackArray.pop() : this.addToArray(a.substring(d + 1, b)),
                b += 1);
            return this.resutlArr
        }
        ,
        a.prototype.addToResultArr = function(a) {
            var b, c;
            if ("" != a) {
                for (b = [],
                b.push(["&lt;", "<"]),
                b.push(["&gt;", ">"]),
                b.push(["&amp;", "&"]),
                b.push(["&quot;", '"']),
                b.push(["&apos;;", "'"]),
                c = 0; c < b.length; c++)
                    a.replace(new RegExp(b[c][0],"g"), b[c][1]);
                0 < this.stackArray.length ? this.resutlArr.push({
                    text: a,
                    style: this.stackArray[this.stackArray.length - 1]
                }) : this.resutlArr.push({
                    text: a
                })
            }
        }
        ,
        a.prototype.changeStringToObject = function(a) {
            var c, b = {};
            for (a = a.replace(/( )+/g, " ").split(" "),
            c = 0; c < a.length; c++)
                this.addProperty(b, a[c]);
            return b
        }
        ,
        a.prototype.addProperty = function(a, b) {
            var c = b.replace(/( )*=( )*/g, "=").split("=");
            switch (c[1] && (c[1] = c[1].replace(/(\"|\')/g, "")),
            c[0].toLowerCase()) {
            case "color":
                a.textColor = parseInt(c[1]);
                break;
            case "b":
                a.bold = "true" == (c[1] || "true");
                break;
            case "i":
                a.italic = "true" == (c[1] || "true");
                break;
            case "size":
                a.size = parseInt(c[1]);
                break;
            case "fontFamily":
                a.fontFamily = c[1]
            }
        }
        ,
        a.prototype.addToArray = function(a) {
            if (a = this.changeStringToObject(a),
            0 != this.stackArray.length) {
                var c, b = this.stackArray[this.stackArray.length - 1];
                for (c in b)
                    null  == a[c] && (a[c] = b[c])
            }
            this.stackArray.push(a)
        }
        ,
        a
    }
    ();
    a.HtmlTextParser = b,
    b.prototype.__class__ = "egret.HtmlTextParser"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function a() {}
        return a.DYNAMIC = "dynamic",
        a.INPUT = "input",
        a
    }
    ();
    a.TextFieldType = b,
    b.prototype.__class__ = "egret.TextFieldType"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(a) {
            b.call(this),
            this.bitmapData = this._bitmapY = this._bitmapX = this._sourceHeight = this._sourceWidth = 0,
            this._textureMap = {};
            var c = a.bitmapData;
            this.bitmapData = c,
            this._sourceWidth = c.width,
            this._sourceHeight = c.height,
            this._bitmapX = a._bitmapX - a._offsetX,
            this._bitmapY = a._bitmapY - a._offsetY
        }
        return __extends(c, b),
        c.prototype.getTexture = function(a) {
            return this._textureMap[a]
        }
        ,
        c.prototype.createTexture = function(b, c, d, e, f, g, h, i, j) {
            void 0 === g && (g = 0),
            void 0 === h && (h = 0),
            "undefined" == typeof i && (i = g + e),
            "undefined" == typeof j && (j = h + f);
            var k = new a.Texture
              , l = a.MainContext.instance.rendererContext._texture_scale_factor;
            return k._bitmapData = this.bitmapData,
            k._bitmapX = this._bitmapX + c,
            k._bitmapY = this._bitmapY + d,
            k._bitmapWidth = e * l,
            k._bitmapHeight = f * l,
            k._offsetX = g,
            k._offsetY = h,
            k._textureWidth = i * l,
            k._textureHeight = j * l,
            k._sourceWidth = this._sourceWidth,
            k._sourceHeight = this._sourceHeight,
            this._textureMap[b] = k
        }
        ,
        c
    }
    (a.HashObject);
    a.SpriteSheet = b,
    b.prototype.__class__ = "egret.SpriteSheet"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this._isFocus = !1,
            this._text = null ,
            this._isFirst = this._isFirst = !0
        }
        return __extends(c, b),
        c.prototype.init = function(b) {
            this._text = b,
            this.stageText = a.StageText.create(),
            b = this._text.localToGlobal(),
            this.stageText._open(b.x, b.y, this._text._explicitWidth, this._text._explicitHeight)
        }
        ,
        c.prototype._addStageText = function() {
            this._text._inputEnabled || (this._text._touchEnabled = !0),
            this.stageText._add(),
            this.stageText._addListeners(),
            this.stageText.addEventListener("blur", this.onBlurHandler, this),
            this.stageText.addEventListener("focus", this.onFocusHandler, this),
            this.stageText.addEventListener("updateText", this.updateTextHandler, this),
            this._text.addEventListener(a.TouchEvent.TOUCH_TAP, this.onMouseDownHandler, this),
            a.MainContext.instance.stage.addEventListener(a.TouchEvent.TOUCH_TAP, this.onStageDownHandler, this),
            a.MainContext.instance.stage.addEventListener(a.Event.RESIZE, this.onResize, this)
        }
        ,
        c.prototype._removeStageText = function() {
            this.stageText._remove(),
            this.stageText._removeListeners(),
            this._text._inputEnabled || (this._text._touchEnabled = !1),
            this.stageText.removeEventListener("blur", this.onBlurHandler, this),
            this.stageText.removeEventListener("focus", this.onFocusHandler, this),
            this.stageText.removeEventListener("updateText", this.updateTextHandler, this),
            this._text.removeEventListener(a.TouchEvent.TOUCH_TAP, this.onMouseDownHandler, this),
            a.MainContext.instance.stage.removeEventListener(a.TouchEvent.TOUCH_TAP, this.onStageDownHandler, this),
            a.MainContext.instance.stage.removeEventListener(a.Event.RESIZE, this.onResize, this)
        }
        ,
        c.prototype.onResize = function() {
            this._isFirst = !0
        }
        ,
        c.prototype._getText = function() {
            return this.stageText._getText()
        }
        ,
        c.prototype._setText = function(a) {
            this.stageText._setText(a)
        }
        ,
        c.prototype.onFocusHandler = function() {
            this.hideText()
        }
        ,
        c.prototype.onBlurHandler = function() {
            this.showText()
        }
        ,
        c.prototype.onMouseDownHandler = function(a) {
            a.stopPropagation(),
            this._text._visible && this.stageText._show()
        }
        ,
        c.prototype.onStageDownHandler = function() {
            this.stageText._hide(),
            this.showText()
        }
        ,
        c.prototype.showText = function() {
            this._isFocus && (this._isFocus = !1,
            this.resetText())
        }
        ,
        c.prototype.hideText = function() {
            this._isFocus || (this._text._setBaseText(""),
            this._isFocus = !0)
        }
        ,
        c.prototype.updateTextHandler = function() {
            this.resetText(),
            this._text.dispatchEvent(new a.Event(a.Event.CHANGE))
        }
        ,
        c.prototype.resetText = function() {
            this._text._setBaseText(this.stageText._getText())
        }
        ,
        c.prototype._updateTransform = function() {
            var h, i, b = this._text._worldTransform.a, c = this._text._worldTransform.b, d = this._text._worldTransform.c, e = this._text._worldTransform.d, f = this._text._worldTransform.tx, g = this._text._worldTransform.ty;
            this._text._updateBaseTransform(),
            h = this._text._worldTransform,
            (this._isFirst || b != h.a || c != h.b || d != h.c || e != h.d || f != h.tx || g != h.ty) && (this._isFirst = !1,
            b = this._text.localToGlobal(),
            this.stageText.changePosition(b.x, b.y),
            i = this,
            a.callLater(function() {
                i.stageText._setScale(i._text._worldTransform.a, i._text._worldTransform.d)
            }
            , this))
        }
        ,
        c.prototype._updateProperties = function() {
            var c, d, b = this._text._stage;
            if (null  == b)
                this.stageText._setVisible(!1);
            else {
                for (c = this._text,
                d = c._visible; d && (c = c.parent,
                c != b); )
                    d = c._visible;
                this.stageText._setVisible(d)
            }
            this.stageText._setMultiline(this._text._multiline),
            this.stageText._setMaxChars(this._text._maxChars),
            this.stageText._setSize(this._text._size),
            this.stageText._setTextColor(this._text._textColorString),
            this.stageText._setTextFontFamily(this._text._fontFamily),
            this.stageText._setBold(this._text._bold),
            this.stageText._setItalic(this._text._italic),
            this.stageText._setTextAlign(this._text._textAlign),
            this.stageText._setWidth(this._text._getSize(a.Rectangle.identity).width),
            this.stageText._setHeight(this._text._getSize(a.Rectangle.identity).height),
            this.stageText._setTextType(this._text._displayAsPassword ? "password" : "text"),
            this.stageText._setText(this._text._text),
            this.stageText._resetStageText(),
            this._updateTransform()
        }
        ,
        c
    }
    (a.HashObject);
    a.InputController = b,
    b.prototype.__class__ = "egret.InputController"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b(b, c) {
            a.call(this, b),
            this.firstCharHeight = 0,
            this.charList = "string" == typeof c ? this.parseConfig(c) : c && c.hasOwnProperty("frames") ? c.frames : {}
        }
        return __extends(b, a),
        b.prototype.getTexture = function(a) {
            var b = this._textureMap[a];
            if (!b) {
                if (b = this.charList[a],
                !b)
                    return null ;
                b = this.createTexture(a, b.x, b.y, b.w, b.h, b.offX, b.offY, b.sourceW, b.sourceH),
                this._textureMap[a] = b
            }
            return b
        }
        ,
        b.prototype._getFirstCharHeight = function() {
            var a, b, c;
            if (0 == this.firstCharHeight)
                for (a in this.charList)
                    if (b = this.charList[a],
                    b && (c = b.sourceH,
                    void 0 === c && (c = b.h,
                    void 0 === c && (c = 0),
                    b = b.offY,
                    void 0 === b && (b = 0),
                    c += b),
                    !(0 >= c))) {
                        this.firstCharHeight = c;
                        break
                    }
            return this.firstCharHeight
        }
        ,
        b.prototype.parseConfig = function(a) {
            var b, c, d, e, f, g;
            for (a = a.split("\r\n").join("\n"),
            a = a.split("\n"),
            b = this.getConfigByKey(a[3], "count"),
            c = {},
            d = 4; 4 + b > d; d++)
                e = a[d],
                f = String.fromCharCode(this.getConfigByKey(e, "id")),
                g = {},
                c[f] = g,
                g.x = this.getConfigByKey(e, "x"),
                g.y = this.getConfigByKey(e, "y"),
                g.w = this.getConfigByKey(e, "width"),
                g.h = this.getConfigByKey(e, "height"),
                g.offX = this.getConfigByKey(e, "xoffset"),
                g.offY = this.getConfigByKey(e, "yoffset");
            return c
        }
        ,
        b.prototype.getConfigByKey = function(a, b) {
            var c, d, e, f;
            for (c = a.split(" "),
            d = 0,
            e = c.length; e > d; d++)
                if (f = c[d],
                b == f.substring(0, b.length))
                    return c = f.substring(b.length + 1),
                    parseInt(c);
            return 0
        }
        ,
        b
    }
    (a.SpriteSheet);
    a.BitmapFont = b,
    b.prototype.__class__ = "egret.BitmapFont"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(c, d) {
            b.call(this, c, d),
            a.Logger.warningWithErrorId(1012)
        }
        return __extends(c, b),
        c
    }
    (a.BitmapFont);
    a.BitmapTextSpriteSheet = b,
    b.prototype.__class__ = "egret.BitmapTextSpriteSheet"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(a) {
            b.call(this),
            this._isAddedToStage = !1,
            this._frames = this._movieClipData = this._textureToRender = null ,
            this._totalFrames = 0,
            this._frameLabels = null ,
            this._frameIntervalTime = 0,
            this._eventPool = null ,
            this._isPlaying = !1,
            this._isStopped = !0,
            this._passedTime = this._displayedKeyFrameNum = this._nextFrameNum = this._currentFrameNum = this._playTimes = 0,
            this._setMovieClipData(a),
            this.needDraw = !0
        }
        return __extends(c, b),
        c.prototype._init = function() {
            this._reset();
            var a = this._movieClipData;
            a && a._isDataValid() && (this._frames = a.frames,
            this._totalFrames = a.numFrames,
            this._frameLabels = a.labels,
            this._frameIntervalTime = 1e3 / a.frameRate,
            this._initFrame())
        }
        ,
        c.prototype._reset = function() {
            this._frames = null ,
            this._playTimes = 0,
            this._isPlaying = !1,
            this.setIsStopped(!0),
            this._currentFrameNum = 0,
            this._nextFrameNum = 1,
            this._passedTime = this._displayedKeyFrameNum = 0,
            this._eventPool = []
        }
        ,
        c.prototype._initFrame = function() {
            this._movieClipData._isTextureValid() && (this._advanceFrame(),
            this._constructFrame())
        }
        ,
        c.prototype._render = function(a) {
            var d, e, f, g, h, i, b = this._textureToRender;
            (this._texture_to_render = b) && (d = Math.round(b._offsetX),
            e = Math.round(b._offsetY),
            f = b._bitmapWidth || b._textureWidth,
            g = b._bitmapHeight || b._textureHeight,
            h = Math.round(f),
            i = Math.round(g),
            c.renderFilter.drawImage(a, this, b._bitmapX, b._bitmapY, f, g, d, e, h, i))
        }
        ,
        c.prototype._measureBounds = function() {
            var c = this._textureToRender;
            return c ? a.Rectangle.identity.initialize(c._offsetX, c._offsetY, c._textureWidth, c._textureHeight) : b.prototype._measureBounds.call(this)
        }
        ,
        c.prototype._onAddToStage = function() {
            b.prototype._onAddToStage.call(this),
            this._isAddedToStage = !0,
            this._isPlaying && 1 < this._totalFrames && this.setIsStopped(!1)
        }
        ,
        c.prototype._onRemoveFromStage = function() {
            b.prototype._onRemoveFromStage.call(this),
            this._isAddedToStage = !1,
            this.setIsStopped(!0)
        }
        ,
        c.prototype._getFrameLabelByName = function(a, b) {
            var c, d, e;
            if (void 0 === b && (b = !1),
            b && (a = a.toLowerCase()),
            c = this._frameLabels)
                for (d = null ,
                e = 0; e < c.length; e++)
                    if (d = c[e],
                    b ? d.name.toLowerCase() === a : d.name === a)
                        return d;
            return null 
        }
        ,
        c.prototype._getFrameLabelByFrame = function(a) {
            var c, d, b = this._frameLabels;
            if (b)
                for (c = null ,
                d = 0; d < b.length; d++)
                    if (c = b[d],
                    c.frame === a)
                        return c;
            return null 
        }
        ,
        c.prototype._getFrameLabelForFrame = function(a) {
            var e, b = null , c = null , d = this._frameLabels;
            if (d)
                for (e = 0; e < d.length && (c = d[e],
                !(c.frame > a)); e++)
                    b = c;
            return b
        }
        ,
        c.prototype.play = function(a) {
            void 0 === a && (a = 0),
            this._isPlaying = !0,
            this.setPlayTimes(a),
            1 < this._totalFrames && this._isAddedToStage && this.setIsStopped(!1)
        }
        ,
        c.prototype.stop = function() {
            this._isPlaying = !1,
            this.setIsStopped(!0)
        }
        ,
        c.prototype.prevFrame = function() {
            this.gotoAndStop(this._currentFrameNum - 1)
        }
        ,
        c.prototype.nextFrame = function() {
            this.gotoAndStop(this._currentFrameNum + 1)
        }
        ,
        c.prototype.gotoAndPlay = function(b, c) {
            if (void 0 === c && (c = 0),
            0 === arguments.length || 2 < arguments.length)
                throw Error(a.getString(1022, "MovieClip.gotoAndPlay()"));
            this.play(c),
            this._gotoFrame(b)
        }
        ,
        c.prototype.gotoAndStop = function(b) {
            if (1 != arguments.length)
                throw Error(a.getString(1022, "MovieClip.gotoAndStop()"));
            this.stop(),
            this._gotoFrame(b)
        }
        ,
        c.prototype._gotoFrame = function(b) {
            var c;
            if ("string" == typeof b)
                c = this._getFrameLabelByName(b).frame;
            else if (c = parseInt(b + "", 10),
            c != b)
                throw Error(a.getString(1022, "Frame Label Not Found"));
            1 > c ? c = 1 : c > this._totalFrames && (c = this._totalFrames),
            c !== this._nextFrameNum && (this._nextFrameNum = c,
            this._advanceFrame(),
            this._constructFrame(),
            this._handlePendingEvent())
        }
        ,
        c.prototype._advanceTime = function(b) {
            var c = this._frameIntervalTime;
            if (b = this._passedTime + b,
            this._passedTime = b % c,
            c = b / c,
            !(1 > c)) {
                for (; c >= 1; ) {
                    if (c--,
                    this._nextFrameNum++,
                    this._nextFrameNum > this._totalFrames)
                        if (-1 == this._playTimes)
                            this._eventPool.push(a.Event.LOOP_COMPLETE),
                            this._nextFrameNum = 1;
                        else {
                            if (this._playTimes--,
                            !(0 < this._playTimes)) {
                                this._nextFrameNum = this._totalFrames,
                                this._eventPool.push(a.Event.COMPLETE),
                                this.stop();
                                break
                            }
                            this._eventPool.push(a.Event.LOOP_COMPLETE),
                            this._nextFrameNum = 1
                        }
                    this._advanceFrame()
                }
                this._constructFrame(),
                this._handlePendingEvent()
            }
        }
        ,
        c.prototype._advanceFrame = function() {
            this._currentFrameNum = this._nextFrameNum
        }
        ,
        c.prototype._constructFrame = function() {
            var a = this._currentFrameNum;
            this._displayedKeyFrameNum != a && (this._textureToRender = this._movieClipData.getTextureByFrame(a),
            this._displayedKeyFrameNum = a)
        }
        ,
        c.prototype._handlePendingEvent = function() {
            var b, c, d, e, f, g;
            if (0 != this._eventPool.length) {
                for (this._eventPool.reverse(),
                b = this._eventPool,
                c = b.length,
                d = !1,
                e = !1,
                f = 0; c > f; f++)
                    g = b.pop(),
                    g == a.Event.LOOP_COMPLETE ? e = !0 : g == a.Event.COMPLETE ? d = !0 : this.dispatchEventWith(g);
                e && this.dispatchEventWith(a.Event.LOOP_COMPLETE),
                d && this.dispatchEventWith(a.Event.COMPLETE)
            }
        }
        ,
        Object.defineProperty(c.prototype, "totalFrames", {
            get: function() {
                return this._totalFrames
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "currentFrame", {
            get: function() {
                return this._currentFrameNum
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "currentFrameLabel", {
            get: function() {
                var a = this._getFrameLabelByFrame(this._currentFrameNum);
                return a && a.name
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "currentLabel", {
            get: function() {
                var a = this._getFrameLabelForFrame(this._currentFrameNum);
                return a ? a.name : null 
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "frameRate", {
            get: function() {
                return this.movieClipData.frameRate
            },
            set: function(a) {
                a != this._movieClipData.frameRate && (this._movieClipData.frameRate = a,
                this._frameIntervalTime = 1e3 / this._movieClipData.frameRate)
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "isPlaying", {
            get: function() {
                return this._isPlaying
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "movieClipData", {
            get: function() {
                return this._movieClipData
            },
            set: function(a) {
                this._setMovieClipData(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setMovieClipData = function(a) {
            this._movieClipData != a && (this._movieClipData = a,
            this._init())
        }
        ,
        c.prototype.setPlayTimes = function(a) {
            (0 > a || a >= 1) && (this._playTimes = 0 > a ? -1 : Math.floor(a))
        }
        ,
        c.prototype.setIsStopped = function(b) {
            this._isStopped != b && ((this._isStopped = b) ? (this._playTimes = 0,
            a.Ticker.getInstance().unregister(this._advanceTime, this)) : (this._playTimes = 0 == this._playTimes ? 1 : this._playTimes,
            a.Ticker.getInstance().register(this._advanceTime, this)))
        }
        ,
        c.renderFilter = a.RenderFilter.getInstance(),
        c
    }
    (a.DisplayObject);
    a.MovieClip = b,
    b.prototype.__class__ = "egret.MovieClip"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b(b, c) {
            a.call(this),
            this._name = b,
            this._frame = 0 | c
        }
        return __extends(b, a),
        Object.defineProperty(b.prototype, "name", {
            get: function() {
                return this._name
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(b.prototype, "frame", {
            get: function() {
                return this._frame
            },
            enumerable: !0,
            configurable: !0
        }),
        b.prototype.clone = function() {
            return new b(this._name,this._frame)
        }
        ,
        b
    }
    (a.EventDispatcher);
    a.FrameLabel = b,
    b.prototype.__class__ = "egret.FrameLabel"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this._mcData = null ,
            this.numFrames = 1,
            this.frames = [],
            this.labels = null ,
            this.frameRate = 0,
            this.spriteSheet = this.textureData = null 
        }
        return __extends(c, b),
        c.prototype._init = function(a, b, c) {
            this.textureData = b,
            this.spriteSheet = c,
            this._setMCData(a)
        }
        ,
        c.prototype.getKeyFrameData = function(a) {
            return a = this.frames[a - 1],
            a.frame && (a = this.frames[a.frame - 1]),
            a
        }
        ,
        c.prototype.getTextureByFrame = function(a) {
            if (a = this.getKeyFrameData(a),
            a.res) {
                var b = this.getTextureByResName(a.res);
                return b._offsetX = 0 | a.x,
                b._offsetY = 0 | a.y,
                b
            }
            return null 
        }
        ,
        c.prototype.getTextureByResName = function(a) {
            var b = this.spriteSheet.getTexture(a);
            return b || (b = this.textureData[a],
            b = this.spriteSheet.createTexture(a, b.x, b.y, b.w, b.h)),
            b
        }
        ,
        c.prototype._isDataValid = function() {
            return 0 < this.frames.length
        }
        ,
        c.prototype._isTextureValid = function() {
            return null  != this.textureData && null  != this.spriteSheet
        }
        ,
        c.prototype._fillMCData = function(a) {
            this.frameRate = a.frameRate || 24,
            this._fillFramesData(a.frames),
            this._fillFrameLabelsData(a.labels)
        }
        ,
        c.prototype._fillFramesData = function(a) {
            var d, b, c, e, f, g;
            for (b = this.frames,
            c = a ? a.length : 0,
            e = 0; c > e; e++)
                if (d = a[e],
                b.push(d),
                d.duration && (f = parseInt(d.duration),
                f > 1))
                    for (d = b.length,
                    g = 1; f > g; g++)
                        b.push({
                            frame: d
                        });
            this.numFrames = b.length
        }
        ,
        c.prototype._fillFrameLabelsData = function(b) {
            var c, d, e;
            if (b && (c = b.length,
            c > 0))
                for (this.labels = [],
                d = 0; c > d; d++)
                    e = b[d],
                    this.labels.push(new a.FrameLabel(e.name,e.frame))
        }
        ,
        Object.defineProperty(c.prototype, "mcData", {
            get: function() {
                return this._mcData
            },
            set: function(a) {
                this._setMCData(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setMCData = function(a) {
            this._mcData != a && (this._mcData = a) && this._fillMCData(a)
        }
        ,
        c
    }
    (a.HashObject);
    a.MovieClipData = b,
    b.prototype.__class__ = "egret.MovieClipData"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(a, c) {
            b.call(this),
            this.enableCache = !0,
            this._mcDataCache = {},
            this._mcDataSet = a,
            this.setTexture(c)
        }
        return __extends(c, b),
        c.prototype.clearCache = function() {
            this._mcDataCache = {}
        }
        ,
        c.prototype.generateMovieClipData = function(b) {
            if (void 0 === b && (b = ""),
            "" == b && this._mcDataSet)
                for (b in this._mcDataSet.mc)
                    break;
            if ("" == b)
                return null ;
            var c = this._findFromCache(b, this._mcDataCache);
            return c || (c = new a.MovieClipData,
            this._fillData(b, c, this._mcDataCache)),
            c
        }
        ,
        c.prototype._findFromCache = function(a, b) {
            return this.enableCache && b[a] ? b[a] : null 
        }
        ,
        c.prototype._fillData = function(a, b, c) {
            if (this._mcDataSet) {
                var d = this._mcDataSet.mc[a];
                d && (b._init(d, this._mcDataSet.res, this._spriteSheet),
                this.enableCache && (c[a] = b))
            }
        }
        ,
        Object.defineProperty(c.prototype, "mcDataSet", {
            get: function() {
                return this._mcDataSet
            },
            set: function(a) {
                this._mcDataSet = a
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "texture", {
            set: function(a) {
                this.setTexture(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "spriteSheet", {
            get: function() {
                return this._spriteSheet
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype.setTexture = function(b) {
            this._spriteSheet = b ? new a.SpriteSheet(b) : null 
        }
        ,
        c
    }
    (a.EventDispatcher);
    a.MovieClipDataFactory = b,
    b.prototype.__class__ = "egret.MovieClipDataFactory"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b() {
            a.call(this),
            this._scaleY = this._scaleX = 1,
            this._size = 30,
            this._color = "#FFFFFF",
            this._fontFamily = "Arial",
            this._italic = this._bold = !1,
            this._textAlign = "left",
            this._multiline = this._visible = !1,
            this._maxChars = 0
        }
        return __extends(b, a),
        b.prototype._getText = function() {
            return null 
        }
        ,
        b.prototype._setText = function() {}
        ,
        b.prototype._setTextType = function() {}
        ,
        b.prototype._getTextType = function() {
            return null 
        }
        ,
        b.prototype._open = function() {}
        ,
        b.prototype._show = function() {}
        ,
        b.prototype._add = function() {}
        ,
        b.prototype._remove = function() {}
        ,
        b.prototype._hide = function() {}
        ,
        b.prototype._addListeners = function() {}
        ,
        b.prototype._removeListeners = function() {}
        ,
        b.prototype._setScale = function(a, b) {
            this._scaleX = a,
            this._scaleY = b
        }
        ,
        b.prototype.changePosition = function() {}
        ,
        b.prototype._setSize = function(a) {
            this._size = a
        }
        ,
        b.prototype._setTextColor = function(a) {
            this._color = a
        }
        ,
        b.prototype._setTextFontFamily = function(a) {
            this._fontFamily = a
        }
        ,
        b.prototype._setBold = function(a) {
            this._bold = a
        }
        ,
        b.prototype._setItalic = function(a) {
            this._italic = a
        }
        ,
        b.prototype._setTextAlign = function(a) {
            this._textAlign = a
        }
        ,
        b.prototype._setVisible = function(a) {
            this._visible = a
        }
        ,
        b.prototype._setWidth = function() {}
        ,
        b.prototype._setHeight = function() {}
        ,
        b.prototype._setMultiline = function(a) {
            this._multiline = a
        }
        ,
        b.prototype._setMaxChars = function(a) {
            this._maxChars = a
        }
        ,
        b.prototype._resetStageText = function() {}
        ,
        b.create = function() {
            return null 
        }
        ,
        b
    }
    (a.EventDispatcher);
    a.StageText = b,
    b.prototype.__class__ = "egret.StageText"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function a() {}
        return a.GET = "get",
        a.POST = "post",
        a
    }
    ();
    a.URLRequestMethod = b,
    b.prototype.__class__ = "egret.URLRequestMethod"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function a() {}
        return a.BINARY = "binary",
        a.TEXT = "text",
        a.VARIABLES = "variables",
        a.TEXTURE = "texture",
        a.SOUND = "sound",
        a
    }
    ();
    a.URLLoaderDataFormat = b,
    b.prototype.__class__ = "egret.URLLoaderDataFormat"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b(b) {
            void 0 === b && (b = null ),
            a.call(this),
            this.variables = null ,
            null  !== b && this.decode(b)
        }
        return __extends(b, a),
        b.prototype.decode = function(a) {
            var b, c, d, e;
            for (this.variables || (this.variables = {}),
            a = a.split("+").join(" "),
            c = /[?&]?([^=]+)=([^&]*)/g; b = c.exec(a); )
                d = decodeURIComponent(b[1]),
                b = decodeURIComponent(b[2]),
                0 == d in this.variables ? this.variables[d] = b : (e = this.variables[d],
                e instanceof Array ? e.push(b) : this.variables[d] = [e, b])
        }
        ,
        b.prototype.toString = function() {
            if (!this.variables)
                return "";
            var c, a = this.variables, b = [];
            for (c in a)
                b.push(this.encodeValue(c, a[c]));
            return b.join("&")
        }
        ,
        b.prototype.encodeValue = function(a, b) {
            return b instanceof Array ? this.encodeArray(a, b) : encodeURIComponent(a) + "=" + encodeURIComponent(b)
        }
        ,
        b.prototype.encodeArray = function(a, b) {
            return a ? 0 == b.length ? encodeURIComponent(a) + "=" : b.map(function(b) {
                return encodeURIComponent(a) + "=" + encodeURIComponent(b)
            }
            ).join("&") : ""
        }
        ,
        b
    }
    (a.HashObject);
    a.URLVariables = b,
    b.prototype.__class__ = "egret.URLVariables"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        return function(a, b) {
            this.value = this.name = "",
            this.name = a,
            this.value = b
        }
    }
    ();
    a.URLRequestHeader = b,
    b.prototype.__class__ = "egret.URLRequestHeader"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(c) {
            void 0 === c && (c = null ),
            b.call(this),
            this.data = null ,
            this.method = a.URLRequestMethod.GET,
            this.url = "",
            this.url = c
        }
        return __extends(c, b),
        c
    }
    (a.HashObject);
    a.URLRequest = b,
    b.prototype.__class__ = "egret.URLRequest"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(c) {
            void 0 === c && (c = null ),
            b.call(this),
            this.dataFormat = a.URLLoaderDataFormat.TEXT,
            this._request = this.data = null ,
            this._status = -1,
            c && this.load(c)
        }
        return __extends(c, b),
        c.prototype.load = function(b) {
            this._request = b,
            this.data = null ,
            a.MainContext.instance.netContext.proceed(this)
        }
        ,
        c
    }
    (a.EventDispatcher);
    a.URLLoader = b,
    b.prototype.__class__ = "egret.URLLoader"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this._sourceHeight = this._sourceWidth = this._textureHeight = this._textureWidth = this._offsetY = this._offsetX = this._bitmapHeight = this._bitmapWidth = this._bitmapY = this._bitmapX = 0,
            this._bitmapData = null 
        }
        return __extends(c, b),
        Object.defineProperty(c.prototype, "textureWidth", {
            get: function() {
                return this._textureWidth
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "textureHeight", {
            get: function() {
                return this._textureHeight
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "bitmapData", {
            get: function() {
                return this._bitmapData
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setBitmapData = function(b) {
            var c = a.MainContext.instance.rendererContext._texture_scale_factor;
            this._bitmapData = b,
            this._sourceWidth = b.width,
            this._sourceHeight = b.height,
            this._textureWidth = this._sourceWidth * c,
            this._textureHeight = this._sourceHeight * c,
            this._bitmapWidth = this._textureWidth,
            this._bitmapHeight = this._textureHeight,
            this._offsetX = this._offsetY = this._bitmapX = this._bitmapY = 0
        }
        ,
        c.prototype.getPixel32 = function(a, b) {
            return this._bitmapData.getContext("2d").getImageData(a, b, 1, 1).data
        }
        ,
        c
    }
    (a.HashObject);
    a.Texture = b,
    b.prototype.__class__ = "egret.Texture"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this)
        }
        return __extends(c, b),
        c.prototype.init = function() {
            this._bitmapData = document.createElement("canvas"),
            this.renderContext = a.RendererContext.createRendererContext(this._bitmapData)
        }
        ,
        c.prototype.drawToTexture = function(b, d, e) {
            var g, h, i, j, f = d || b.getBounds(a.Rectangle.identity);
            if (0 == f.width || 0 == f.height)
                return !1;
            if (this._bitmapData || this.init(),
            g = f.x,
            h = f.y,
            d = f.width,
            f = f.height,
            i = a.MainContext.instance.rendererContext._texture_scale_factor,
            f /= i,
            d = Math.round(d / i),
            f = Math.round(f),
            this.setSize(d, f),
            this.begin(),
            b._worldTransform.identity(),
            b._worldTransform.a = 1 / i,
            b._worldTransform.d = 1 / i,
            e && (b._worldTransform.a *= e,
            b._worldTransform.d *= e),
            e = b._anchorOffsetX,
            j = b._anchorOffsetY,
            (0 != b._anchorX || 0 != b._anchorY) && (e = b._anchorX * d,
            j = b._anchorY * f),
            this._offsetX = g + e,
            this._offsetY = h + j,
            b._worldTransform.append(1, 0, 0, 1, -this._offsetX, -this._offsetY),
            b.worldAlpha = 1,
            b instanceof a.DisplayObjectContainer)
                for (g = b._children,
                h = 0,
                e = g.length; e > h; h++)
                    g[h]._updateTransform();
            return this.renderContext.setTransform(b._worldTransform),
            g = a.RenderFilter.getInstance(),
            h = g._drawAreaList.concat(),
            g._drawAreaList.length = 0,
            this.renderContext.clearScreen(),
            this.renderContext.onRenderStart(),
            a.RendererContext.deleteTexture(this),
            b._filter && this.renderContext.setGlobalFilter(b._filter),
            b._colorTransform && this.renderContext.setGlobalColorTransform(b._colorTransform.matrix),
            (e = b.mask || b._scrollRect) && this.renderContext.pushMask(e),
            j = a.MainContext.__use_new_draw,
            a.MainContext.__use_new_draw = !1,
            b._render(this.renderContext),
            a.MainContext.__use_new_draw = j,
            e && this.renderContext.popMask(),
            b._colorTransform && this.renderContext.setGlobalColorTransform(null ),
            b._filter && this.renderContext.setGlobalFilter(null ),
            c.identityRectangle.width = d,
            c.identityRectangle.height = f,
            g.addDrawArea(c.identityRectangle),
            this.renderContext.onRenderFinish(),
            g._drawAreaList = h,
            this._sourceWidth = d,
            this._sourceHeight = f,
            this._textureWidth = this._sourceWidth * i,
            this._textureHeight = this._sourceHeight * i,
            this.end(),
            !0
        }
        ,
        c.prototype.setSize = function(a, b) {
            var c = this._bitmapData;
            c.width = a,
            c.height = b,
            c.style.width = a + "px",
            c.style.height = b + "px",
            this.renderContext._cacheCanvas && (this.renderContext._cacheCanvas.width = a,
            this.renderContext._cacheCanvas.height = b)
        }
        ,
        c.prototype.begin = function() {}
        ,
        c.prototype.end = function() {}
        ,
        c.prototype.dispose = function() {
            this._bitmapData && (this.renderContext = this._bitmapData = null )
        }
        ,
        c.identityRectangle = new a.Rectangle,
        c
    }
    (a.Texture);
    a.RenderTexture = b,
    b.prototype.__class__ = "egret.RenderTexture"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this.renderCost = 0,
            this._texture_scale_factor = 1,
            this.profiler = a.Profiler.getInstance(),
            c.blendModesForGL || c.initBlendMode()
        }
        return __extends(c, b),
        Object.defineProperty(c.prototype, "texture_scale_factor", {
            get: function() {
                return this._texture_scale_factor
            },
            set: function(a) {
                this._setTextureScaleFactor(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._setTextureScaleFactor = function(a) {
            this._texture_scale_factor = a
        }
        ,
        c.prototype.clearScreen = function() {}
        ,
        c.prototype.clearRect = function() {}
        ,
        c.prototype.drawImage = function() {
            this.profiler.onDrawImage()
        }
        ,
        c.prototype.drawImageScale9 = function() {
            return !1
        }
        ,
        c.prototype._addOneDraw = function() {
            this.profiler.onDrawImage()
        }
        ,
        c.prototype.setTransform = function() {}
        ,
        c.prototype.setAlpha = function() {}
        ,
        c.prototype.setupFont = function() {}
        ,
        c.prototype.measureText = function() {
            return 0
        }
        ,
        c.prototype.drawText = function() {
            this.profiler.onDrawImage()
        }
        ,
        c.prototype.strokeRect = function() {}
        ,
        c.prototype.pushMask = function() {}
        ,
        c.prototype.popMask = function() {}
        ,
        c.prototype.onRenderStart = function() {}
        ,
        c.prototype.onRenderFinish = function() {}
        ,
        c.prototype.setGlobalColorTransform = function() {}
        ,
        c.prototype.setGlobalFilter = function() {}
        ,
        c.createRendererContext = function() {
            return null 
        }
        ,
        c.deleteTexture = function(b) {
            var d, e, c = a.MainContext.instance.rendererContext.gl;
            if (b = b._bitmapData) {
                if (d = b.webGLTexture,
                d && c)
                    for (e in d)
                        c.deleteTexture(d[e]);
                b.webGLTexture = null 
            }
        }
        ,
        c.initBlendMode = function() {
            c.blendModesForGL = {},
            c.blendModesForGL[a.BlendMode.NORMAL] = [1, 771],
            c.blendModesForGL[a.BlendMode.ADD] = [770, 1]
        }
        ,
        c.registerBlendModeForGL = function(b, d, e, f) {
            c.blendModesForGL[b] && !f ? a.Logger.warningWithErrorId(1005, b) : c.blendModesForGL[b] = [d, e]
        }
        ,
        c.imageSmoothingEnabled = !0,
        c.blendModesForGL = null ,
        c
    }
    (a.HashObject);
    a.RendererContext = b,
    b.prototype.__class__ = "egret.RendererContext"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function a() {}
        return a.MOUSE = "mouse",
        a.TOUCH = "touch",
        a.mode = "touch",
        a
    }
    ();
    a.InteractionMode = b,
    b.prototype.__class__ = "egret.InteractionMode"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this._currentTouchTarget = {},
            this.maxTouches = 2,
            this.touchDownTarget = {},
            this.touchingIdentifiers = [],
            this.lastTouchY = this.lastTouchX = -1
        }
        return __extends(c, b),
        c.prototype.run = function() {}
        ,
        c.prototype.getTouchData = function(a, b, c) {
            var d = this._currentTouchTarget[a];
            return null  == d && (d = {},
            this._currentTouchTarget[a] = d),
            d.stageX = b,
            d.stageY = c,
            d.identifier = a,
            d
        }
        ,
        c.prototype.dispatchEvent = function(b, c) {
            a.TouchEvent.dispatchTouchEvent(c.target, b, c.identifier, c.stageX, c.stageY, !1, !1, !1, 1 == this.touchDownTarget[c.identifier])
        }
        ,
        c.prototype.onTouchBegan = function(b, c, d) {
            if (this.touchingIdentifiers.length != this.maxTouches) {
                var e = a.MainContext.instance.stage.hitTest(b, c);
                e && (b = this.getTouchData(d, b, c),
                this.touchDownTarget[d] = !0,
                b.target = e,
                b.beginTarget = e,
                this.dispatchEvent(a.TouchEvent.TOUCH_BEGIN, b)),
                this.touchingIdentifiers.push(d)
            }
        }
        ,
        c.prototype.onTouchMove = function(b, c, d) {
            if (-1 != this.touchingIdentifiers.indexOf(d) && (b != this.lastTouchX || c != this.lastTouchY)) {
                this.lastTouchX = b,
                this.lastTouchY = c;
                var e = a.MainContext.instance.stage.hitTest(b, c);
                e && (b = this.getTouchData(d, b, c),
                b.target = e,
                this.dispatchEvent(a.TouchEvent.TOUCH_MOVE, b))
            }
        }
        ,
        c.prototype.onTouchEnd = function(b, c, d) {
            var e = this.touchingIdentifiers.indexOf(d);
            -1 != e && (this.touchingIdentifiers.splice(e, 1),
            e = a.MainContext.instance.stage.hitTest(b, c)) && (b = this.getTouchData(d, b, c),
            delete this.touchDownTarget[d],
            d = b.beginTarget,
            b.target = e,
            this.dispatchEvent(a.TouchEvent.TOUCH_END, b),
            d == e ? this.dispatchEvent(a.TouchEvent.TOUCH_TAP, b) : b.beginTarget && (b.target = b.beginTarget,
            this.dispatchEvent(a.TouchEvent.TOUCH_RELEASE_OUTSIDE, b)),
            delete this._currentTouchTarget[b.identifier])
        }
        ,
        c
    }
    (a.HashObject);
    a.TouchContext = b,
    b.prototype.__class__ = "egret.TouchContext"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this)
        }
        return __extends(c, b),
        c.prototype.proceed = function() {}
        ,
        c._getUrl = function(b) {
            var c = b.url;
            return -1 == c.indexOf("?") && b.method == a.URLRequestMethod.GET && b.data && b.data instanceof a.URLVariables && (c = c + "?" + b.data.toString()),
            c
        }
        ,
        c.prototype.getChangeList = function() {
            return []
        }
        ,
        c
    }
    (a.HashObject);
    a.NetContext = b,
    b.prototype.__class__ = "egret.NetContext"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b() {
            a.call(this),
            this.frameRate = 60
        }
        return __extends(b, a),
        b.prototype.executeMainLoop = function() {}
        ,
        b
    }
    (a.HashObject);
    a.DeviceContext = b,
    b.prototype.__class__ = "egret.DeviceContext"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function a() {}
        return a.call = function() {}
        ,
        a.addCallback = function() {}
        ,
        a
    }
    ();
    a.ExternalInterface = b,
    b.prototype.__class__ = "egret.ExternalInterface"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this.trans = null ,
            this.ua = navigator.userAgent.toLowerCase(),
            this.trans = this._getTrans()
        }
        return __extends(c, b),
        c.getInstance = function() {
            return null  == c.instance && (c.instance = new c),
            c.instance
        }
        ,
        Object.defineProperty(c.prototype, "isMobile", {
            get: function() {
                return a.Logger.warningWithErrorId(1e3),
                a.MainContext.deviceType == a.MainContext.DEVICE_MOBILE
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype._getHeader = function(a) {
            if ("transform" in a)
                return "";
            for (var b = ["webkit", "ms", "Moz", "O"], c = 0; c < b.length; c++)
                if (b[c] + "Transform" in a)
                    return b[c];
            return ""
        }
        ,
        c.prototype._getTrans = function() {
            var a = document.createElement("div").style
              , a = this._getHeader(a);
            return "" == a ? "transform" : a + "Transform"
        }
        ,
        c.prototype.$new = function(a) {
            return this.$(document.createElement(a))
        }
        ,
        c.prototype.$ = function(b) {
            var d = document;
            return (b = b instanceof HTMLElement ? b : d.querySelector(b)) && (b.find = b.find || this.$,
            b.hasClass = b.hasClass || function(a) {
                return this.className.match(new RegExp("(\\s|^)" + a + "(\\s|$)"))
            }
            ,
            b.addClass = b.addClass || function(a) {
                return this.hasClass(a) || (this.className && (this.className += " "),
                this.className += a),
                this
            }
            ,
            b.removeClass = b.removeClass || function(a) {
                return this.hasClass(a) && (this.className = this.className.replace(a, "")),
                this
            }
            ,
            b.remove = b.remove || function() {}
            ,
            b.appendTo = b.appendTo || function(a) {
                return a.appendChild(this),
                this
            }
            ,
            b.prependTo = b.prependTo || function(a) {
                return a.childNodes[0] ? a.insertBefore(this, a.childNodes[0]) : a.appendChild(this),
                this
            }
            ,
            b.transforms = b.transforms || function() {
                return this.style[c.getInstance().trans] = c.getInstance().translate(this.position) + c.getInstance().rotate(this.rotation) + c.getInstance().scale(this.scale) + c.getInstance().skew(this.skew),
                this
            }
            ,
            b.position = b.position || {
                x: 0,
                y: 0
            },
            b.rotation = b.rotation || 0,
            b.scale = b.scale || {
                x: 1,
                y: 1
            },
            b.skew = b.skew || {
                x: 0,
                y: 0
            },
            b.translates = function(b, c) {
                return this.position.x = b,
                this.position.y = c - a.MainContext.instance.stage.stageHeight,
                this.transforms(),
                this
            }
            ,
            b.rotate = function(a) {
                return this.rotation = a,
                this.transforms(),
                this
            }
            ,
            b.resize = function(a, b) {
                return this.scale.x = a,
                this.scale.y = b,
                this.transforms(),
                this
            }
            ,
            b.setSkew = function(a, b) {
                return this.skew.x = a,
                this.skew.y = b,
                this.transforms(),
                this
            }
            ),
            b
        }
        ,
        c.prototype.translate = function(a) {
            return "translate(" + a.x + "px, " + a.y + "px) "
        }
        ,
        c.prototype.rotate = function(a) {
            return "rotate(" + a + "deg) "
        }
        ,
        c.prototype.scale = function(a) {
            return "scale(" + a.x + ", " + a.y + ") "
        }
        ,
        c.prototype.skew = function(a) {
            return "skewX(" + -a.x + "deg) skewY(" + a.y + "deg)"
        }
        ,
        c
    }
    (a.HashObject);
    a.Browser = b,
    b.prototype.__class__ = "egret.Browser"
}
(egret || (egret = {})),
function(a) {
    !function(a) {
        a.getItem = function() {
            return null 
        }
        ,
        a.setItem = function() {
            return !1
        }
        ,
        a.removeItem = function() {}
        ,
        a.clear = function() {}
    }
    (a.localStorage || (a.localStorage = {}))
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function b() {}
        return b.parse = function(c) {
            var d, e, f, g;
            if (c = a.SAXParser.getInstance().parserXML(c),
            !c || !c.childNodes)
                return null ;
            for (d = c.childNodes.length,
            e = !1,
            f = 0; d > f; f++)
                if (g = c.childNodes[f],
                1 == g.nodeType) {
                    e = !0;
                    break
                }
            return e ? b.parseNode(g) : null 
        }
        ,
        b.parseNode = function(a) {
            var c, d, e, f, g, h;
            if (!a || 1 != a.nodeType)
                return null ;
            for (c = {},
            c.localName = a.localName,
            c.name = a.nodeName,
            a.namespaceURI && (c.namespace = a.namespaceURI),
            a.prefix && (c.prefix = a.prefix),
            d = a.attributes,
            e = d.length,
            f = 0; e > f; f++)
                g = d[f],
                h = g.name,
                0 != h.indexOf("xmlns:") && (c["$" + h] = g.value);
            for (d = a.childNodes,
            e = d.length,
            f = 0; e > f; f++)
                (g = b.parseNode(d[f])) && (c.children || (c.children = []),
                g.parent = c,
                c.children.push(g));
            return !c.children && (a = a.textContent.trim()) && (c.text = a),
            c
        }
        ,
        b.findChildren = function(a, c, d) {
            return d ? d.length = 0 : d = [],
            b.findByPath(a, c, d),
            d
        }
        ,
        b.findByPath = function(a, c, d) {
            var f, g, h, i, e = c.indexOf(".");
            if (-1 == e ? (f = c,
            e = !0) : (f = c.substring(0, e),
            c = c.substring(e + 1),
            e = !1),
            a = a.children)
                for (g = a.length,
                h = 0; g > h; h++)
                    i = a[h],
                    i.localName == f && (e ? d.push(i) : b.findByPath(i, c, d))
        }
        ,
        b.getAttributes = function(a, b) {
            b ? b.length = 0 : b = [];
            for (var c in a)
                "$" == c.charAt(0) && b.push(c.substring(1));
            return b
        }
        ,
        b
    }
    ();
    a.XML = b,
    b.prototype.__class__ = "egret.XML"
}
(egret || (egret = {})),
function(a) {
    var c, b = function() {
        function a() {}
        return a.LITTLE_ENDIAN = "LITTLE_ENDIAN",
        a.BIG_ENDIAN = "BIG_ENDIAN",
        a
    }
    ();
    a.Endian = b,
    b.prototype.__class__ = "egret.Endian",
    c = function() {
        function c(a) {
            this.BUFFER_EXT_SIZE = 0,
            this.EOF_code_point = this.EOF_byte = -1,
            this._setArrayBuffer(a || new ArrayBuffer(this.BUFFER_EXT_SIZE)),
            this.endian = b.BIG_ENDIAN
        }
        return c.prototype._setArrayBuffer = function(a) {
            this.write_position = a.byteLength,
            this.data = new DataView(a,0,a.byteLength),
            this._position = 0
        }
        ,
        c.prototype.setArrayBuffer = function() {}
        ,
        Object.defineProperty(c.prototype, "buffer", {
            get: function() {
                return this.data.buffer
            },
            set: function(a) {
                this.data = new DataView(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "dataView", {
            get: function() {
                return this.data
            },
            set: function(a) {
                this.data = a,
                this.write_position = a.byteLength
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "bufferOffset", {
            get: function() {
                return this.data.byteOffset
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "position", {
            get: function() {
                return this._position
            },
            set: function(a) {
                this._position < a && !this.validate(this._position - a) || (this._position = a,
                this.write_position = a > this.write_position ? a : this.write_position)
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "length", {
            get: function() {
                return this.write_position
            },
            set: function(a) {
                this.validateBuffer(a)
            },
            enumerable: !0,
            configurable: !0
        }),
        Object.defineProperty(c.prototype, "bytesAvailable", {
            get: function() {
                return this.data.byteLength - this._position
            },
            enumerable: !0,
            configurable: !0
        }),
        c.prototype.clear = function() {
            this._setArrayBuffer(new ArrayBuffer(this.BUFFER_EXT_SIZE))
        }
        ,
        c.prototype.readBoolean = function() {
            return this.validate(c.SIZE_OF_BOOLEAN) ? 0 != this.data.getUint8(this.position++) : null 
        }
        ,
        c.prototype.readByte = function() {
            return this.validate(c.SIZE_OF_INT8) ? this.data.getInt8(this.position++) : null 
        }
        ,
        c.prototype.readBytes = function(a, b, c) {
            if (void 0 === c && (c = 0),
            0 == c)
                c = this.bytesAvailable;
            else if (!this.validate(c))
                return null ;
            a.dataView = new DataView(this.data.buffer,this.bufferOffset + this.position,c),
            this.position += c
        }
        ,
        c.prototype.readDouble = function() {
            if (!this.validate(c.SIZE_OF_FLOAT64))
                return null ;
            var a = this.data.getFloat64(this.position, this.endian == b.LITTLE_ENDIAN);
            return this.position += c.SIZE_OF_FLOAT64,
            a
        }
        ,
        c.prototype.readFloat = function() {
            if (!this.validate(c.SIZE_OF_FLOAT32))
                return null ;
            var a = this.data.getFloat32(this.position, this.endian == b.LITTLE_ENDIAN);
            return this.position += c.SIZE_OF_FLOAT32,
            a
        }
        ,
        c.prototype.readInt = function() {
            if (!this.validate(c.SIZE_OF_INT32))
                return null ;
            var a = this.data.getInt32(this.position, this.endian == b.LITTLE_ENDIAN);
            return this.position += c.SIZE_OF_INT32,
            a
        }
        ,
        c.prototype.readMultiByte = function(a) {
            return this.validate(a) ? "" : null 
        }
        ,
        c.prototype.readShort = function() {
            if (!this.validate(c.SIZE_OF_INT16))
                return null ;
            var a = this.data.getInt16(this.position, this.endian == b.LITTLE_ENDIAN);
            return this.position += c.SIZE_OF_INT16,
            a
        }
        ,
        c.prototype.readUnsignedByte = function() {
            return this.validate(c.SIZE_OF_UINT8) ? this.data.getUint8(this.position++) : null 
        }
        ,
        c.prototype.readUnsignedInt = function() {
            if (!this.validate(c.SIZE_OF_UINT32))
                return null ;
            var a = this.data.getUint32(this.position, this.endian == b.LITTLE_ENDIAN);
            return this.position += c.SIZE_OF_UINT32,
            a
        }
        ,
        c.prototype.readUnsignedShort = function() {
            if (!this.validate(c.SIZE_OF_UINT16))
                return null ;
            var a = this.data.getUint16(this.position, this.endian == b.LITTLE_ENDIAN);
            return this.position += c.SIZE_OF_UINT16,
            a
        }
        ,
        c.prototype.readUTF = function() {
            if (!this.validate(c.SIZE_OF_UINT16))
                return null ;
            var a = this.data.getUint16(this.position, this.endian == b.LITTLE_ENDIAN);
            return this.position += c.SIZE_OF_UINT16,
            a > 0 ? this.readUTFBytes(a) : ""
        }
        ,
        c.prototype.readUTFBytes = function(a) {
            if (!this.validate(a))
                return null ;
            var b = new Uint8Array(this.buffer,this.bufferOffset + this.position,a);
            return this.position += a,
            this.decodeUTF8(b)
        }
        ,
        c.prototype.writeBoolean = function(a) {
            this.validateBuffer(c.SIZE_OF_BOOLEAN),
            this.data.setUint8(this.position++, a ? 1 : 0)
        }
        ,
        c.prototype.writeByte = function(a) {
            this.validateBuffer(c.SIZE_OF_INT8),
            this.data.setInt8(this.position++, a)
        }
        ,
        c.prototype.writeBytes = function(a, b, c) {
            for (void 0 === c && (c = 0),
            this.validateBuffer(c),
            b = new DataView(a.buffer),
            c = 0; c < a.length; c++)
                this.data.setUint8(this.position++, b.getUint8(c))
        }
        ,
        c.prototype.writeDouble = function(a) {
            this.validateBuffer(c.SIZE_OF_FLOAT64),
            this.data.setFloat64(this.position, a, this.endian == b.LITTLE_ENDIAN),
            this.position += c.SIZE_OF_FLOAT64
        }
        ,
        c.prototype.writeFloat = function(a) {
            this.validateBuffer(c.SIZE_OF_FLOAT32),
            this.data.setFloat32(this.position, a, this.endian == b.LITTLE_ENDIAN),
            this.position += c.SIZE_OF_FLOAT32
        }
        ,
        c.prototype.writeInt = function(a) {
            this.validateBuffer(c.SIZE_OF_INT32),
            this.data.setInt32(this.position, a, this.endian == b.LITTLE_ENDIAN),
            this.position += c.SIZE_OF_INT32
        }
        ,
        c.prototype.writeShort = function(a) {
            this.validateBuffer(c.SIZE_OF_INT16),
            this.data.setInt16(this.position, a, this.endian == b.LITTLE_ENDIAN),
            this.position += c.SIZE_OF_INT16
        }
        ,
        c.prototype.writeUnsignedInt = function(a) {
            this.validateBuffer(c.SIZE_OF_UINT32),
            this.data.setUint32(this.position, a, this.endian == b.LITTLE_ENDIAN),
            this.position += c.SIZE_OF_UINT32
        }
        ,
        c.prototype.writeUTF = function(a) {
            a = this.encodeUTF8(a);
            var d = a.length;
            this.validateBuffer(c.SIZE_OF_UINT16 + d),
            this.data.setUint16(this.position, d, this.endian === b.LITTLE_ENDIAN),
            this.position += c.SIZE_OF_UINT16,
            this._writeUint8Array(a)
        }
        ,
        c.prototype.writeUTFBytes = function(a) {
            this._writeUint8Array(this.encodeUTF8(a))
        }
        ,
        c.prototype.toString = function() {
            return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable
        }
        ,
        c.prototype._writeUint8Array = function(a) {
            this.validateBuffer(this.position + a.length);
            for (var b = 0; b < a.length; b++)
                this.data.setUint8(this.position++, a[b])
        }
        ,
        c.prototype.validate = function(b) {
            if (0 < this.data.byteLength && this._position + b <= this.data.byteLength)
                return !0;
            throw a.getString(1025)
        }
        ,
        c.prototype.validateBuffer = function(a) {
            this.write_position = a > this.write_position ? a : this.write_position,
            a += this._position,
            this.data.byteLength < a && (a = new Uint8Array(new ArrayBuffer(a + this.BUFFER_EXT_SIZE)),
            a.set(new Uint8Array(this.data.buffer)),
            this.buffer = a.buffer)
        }
        ,
        c.prototype.encodeUTF8 = function(a) {
            var c, d, e, f, g, b = 0;
            for (a = this.stringToCodePoints(a),
            c = []; a.length > b; )
                if (d = a[b++],
                this.inRange(d, 55296, 57343))
                    this.encoderError(d);
                else if (this.inRange(d, 0, 127))
                    c.push(d);
                else
                    for (this.inRange(d, 128, 2047) ? (e = 1,
                    f = 192) : this.inRange(d, 2048, 65535) ? (e = 2,
                    f = 224) : this.inRange(d, 65536, 1114111) && (e = 3,
                    f = 240),
                    c.push(this.div(d, Math.pow(64, e)) + f); e > 0; )
                        g = this.div(d, Math.pow(64, e - 1)),
                        c.push(128 + g % 64),
                        e -= 1;
            return new Uint8Array(c)
        }
        ,
        c.prototype.decodeUTF8 = function(a) {
            var d, b, c, e, f, g, h, i, j;
            for (b = 0,
            c = "",
            e = 0,
            f = 0,
            g = 0,
            h = 0; a.length > b; )
                d = a[b++],
                d === this.EOF_byte ? d = 0 !== f ? this.decoderError(!1) : this.EOF_code_point : 0 === f ? this.inRange(d, 0, 127) || (this.inRange(d, 194, 223) ? (f = 1,
                h = 128,
                e = d - 192) : this.inRange(d, 224, 239) ? (f = 2,
                h = 2048,
                e = d - 224) : this.inRange(d, 240, 244) ? (f = 3,
                h = 65536,
                e = d - 240) : this.decoderError(!1),
                e *= Math.pow(64, f),
                d = null ) : this.inRange(d, 128, 191) ? (g += 1,
                e += (d - 128) * Math.pow(64, f - g),
                g !== f ? d = null  : (i = e,
                j = h,
                h = g = f = e = 0,
                d = this.inRange(i, j, 1114111) && !this.inRange(i, 55296, 57343) ? i : this.decoderError(!1, d))) : (h = g = f = e = 0,
                b--,
                d = this.decoderError(!1, d)),
                null  !== d && d !== this.EOF_code_point && (65535 >= d ? d > 0 && (c += String.fromCharCode(d)) : (d -= 65536,
                c += String.fromCharCode(55296 + (1023 & d >> 10)),
                c += String.fromCharCode(56320 + (1023 & d))));
            return c
        }
        ,
        c.prototype.encoderError = function(b) {
            throw a.getString(1026, b)
        }
        ,
        c.prototype.decoderError = function(b, c) {
            if (b)
                throw a.getString(1027);
            return c || 65533
        }
        ,
        c.prototype.inRange = function(a, b, c) {
            return a >= b && c >= a
        }
        ,
        c.prototype.div = function(a, b) {
            return Math.floor(a / b)
        }
        ,
        c.prototype.stringToCodePoints = function(a) {
            var b, c, d, e, f;
            for (b = [],
            c = 0,
            d = a.length; c < a.length; )
                e = a.charCodeAt(c),
                this.inRange(e, 55296, 57343) ? this.inRange(e, 56320, 57343) ? b.push(65533) : c === d - 1 ? b.push(65533) : (f = a.charCodeAt(c + 1),
                this.inRange(f, 56320, 57343) ? (e &= 1023,
                f &= 1023,
                c += 1,
                b.push(65536 + (e << 10) + f)) : b.push(65533)) : b.push(e),
                c += 1;
            return b
        }
        ,
        c.SIZE_OF_BOOLEAN = 1,
        c.SIZE_OF_INT8 = 1,
        c.SIZE_OF_INT16 = 2,
        c.SIZE_OF_INT32 = 4,
        c.SIZE_OF_UINT8 = 1,
        c.SIZE_OF_UINT16 = 2,
        c.SIZE_OF_UINT32 = 4,
        c.SIZE_OF_FLOAT32 = 4,
        c.SIZE_OF_FLOAT64 = 8,
        c
    }
    (),
    a.ByteArray = c,
    c.prototype.__class__ = "egret.ByteArray"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(a, c, d) {
            b.call(this),
            this._target = null ,
            this.loop = this.ignoreGlobalPause = this._useTicks = !1,
            this._actions = this._steps = this.pluginData = null ,
            this.paused = !1,
            this.duration = 0,
            this._prevPos = -1,
            this.position = null ,
            this._stepPosition = this._prevPosition = 0,
            this.passive = !1,
            this.initialize(a, c, d)
        }
        return __extends(c, b),
        c.get = function(a, b, d, e) {
            return void 0 === b && (b = null ),
            void 0 === d && (d = null ),
            void 0 === e && (e = !1),
            e && c.removeTweens(a),
            new c(a,b,d)
        }
        ,
        c.removeTweens = function(a) {
            if (a.tween_count) {
                for (var b = c._tweens, d = b.length - 1; d >= 0; d--)
                    b[d]._target == a && (b[d].paused = !0,
                    b.splice(d, 1));
                a.tween_count = 0
            }
        }
        ,
        c.pauseTweens = function(b) {
            if (b.tween_count)
                for (var c = a.Tween._tweens, d = c.length - 1; d >= 0; d--)
                    c[d]._target == b && (c[d].paused = !0)
        }
        ,
        c.resumeTweens = function(b) {
            if (b.tween_count)
                for (var c = a.Tween._tweens, d = c.length - 1; d >= 0; d--)
                    c[d]._target == b && (c[d].paused = !1)
        }
        ,
        c.tick = function(a, b) {
            var d, e, f;
            for (void 0 === b && (b = !1),
            d = c._tweens.concat(),
            e = d.length - 1; e >= 0; e--)
                f = d[e],
                b && !f.ignoreGlobalPause || f.paused || f.tick(f._useTicks ? 1 : a)
        }
        ,
        c._register = function(b, d) {
            var e = b._target
              , f = c._tweens;
            if (d)
                e && (e.tween_count = 0 < e.tween_count ? e.tween_count + 1 : 1),
                f.push(b),
                c._inited || (a.Ticker.getInstance().register(c.tick, null ),
                c._inited = !0);
            else
                for (e && e.tween_count--,
                e = f.length; e--; )
                    if (f[e] == b) {
                        f.splice(e, 1);
                        break
                    }
        }
        ,
        c.removeAllTweens = function() {
            var a, b, d, e;
            for (a = c._tweens,
            b = 0,
            d = a.length; d > b; b++)
                e = a[b],
                e.paused = !0,
                e._target.tweenjs_count = 0;
            a.length = 0
        }
        ,
        c.prototype.initialize = function(a, b, d) {
            this._target = a,
            b && (this._useTicks = b.useTicks,
            this.ignoreGlobalPause = b.ignoreGlobalPause,
            this.loop = b.loop,
            b.onChange && this.addEventListener("change", b.onChange, b.onChangeObj),
            b.override && c.removeTweens(a)),
            this.pluginData = d || {},
            this._curQueueProps = {},
            this._initQueueProps = {},
            this._steps = [],
            this._actions = [],
            b && b.paused ? this.paused = !0 : c._register(this, !0),
            b && null  != b.position && this.setPosition(b.position, c.NONE)
        }
        ,
        c.prototype.setPosition = function(a, b) {
            var c, d, e, f, g;
            if (void 0 === b && (b = 1),
            0 > a && (a = 0),
            c = a,
            d = !1,
            c >= this.duration && (this.loop ? c %= this.duration : (c = this.duration,
            d = !0)),
            c == this._prevPos)
                return d;
            if (e = this._prevPos,
            this.position = this._prevPos = c,
            this._prevPosition = a,
            this._target)
                if (d)
                    this._updateTargetProps(null , 1);
                else if (0 < this._steps.length) {
                    for (f = 0,
                    g = this._steps.length; g > f && !(this._steps[f].t > c); f++)
                        ;
                    f = this._steps[f - 1],
                    this._updateTargetProps(f, (this._stepPosition = c - f.t) / f.d)
                }
            return 0 != b && 0 < this._actions.length && (this._useTicks ? this._runActions(c, c) : 1 == b && e > c ? (e != this.duration && this._runActions(e, this.duration),
            this._runActions(0, c, !0)) : this._runActions(e, c)),
            d && this.setPaused(!0),
            this.dispatchEventWith("change"),
            d
        }
        ,
        c.prototype._runActions = function(a, b, c) {
            var d, e, f, g, h, i;
            for (void 0 === c && (c = !1),
            d = a,
            e = b,
            f = -1,
            g = this._actions.length,
            h = 1,
            a > b && (d = b,
            e = a,
            f = g,
            g = h = -1); (f += h) != g; )
                b = this._actions[f],
                i = b.t,
                (i == e || i > d && e > i || c && i == a) && b.f.apply(b.o, b.p)
        }
        ,
        c.prototype._updateTargetProps = function(a, b) {
            var d, e, f, g, h, i, j, k, l;
            if (a || 1 != b) {
                if (this.passive = !!a.v)
                    return;
                a.e && (b = a.e(b, 0, 1, 1)),
                d = a.p0,
                e = a.p1
            } else
                this.passive = !1,
                d = e = this._curQueueProps;
            for (h in this._initQueueProps) {
                if (null  == (f = d[h]) && (d[h] = f = this._initQueueProps[h]),
                null  == (g = e[h]) && (e[h] = g = f),
                f = f == g || 0 == b || 1 == b || "number" != typeof f ? 1 == b ? g : f : f + (g - f) * b,
                i = !1,
                g = c._plugins[h])
                    for (j = 0,
                    k = g.length; k > j; j++)
                        l = g[j].tween(this, h, f, d, e, b, !!a && d == e, !a),
                        l == c.IGNORE ? i = !0 : f = l;
                i || (this._target[h] = f)
            }
        }
        ,
        c.prototype.setPaused = function(a) {
            return this.paused = a,
            c._register(this, !a),
            this
        }
        ,
        c.prototype._cloneProps = function(a) {
            var c, b = {};
            for (c in a)
                b[c] = a[c];
            return b
        }
        ,
        c.prototype._addStep = function(a) {
            return 0 < a.d && (this._steps.push(a),
            a.t = this.duration,
            this.duration += a.d),
            this
        }
        ,
        c.prototype._appendQueueProps = function(a) {
            var b, d, e, f, g, h;
            for (h in a)
                if (void 0 === this._initQueueProps[h]) {
                    if (d = this._target[h],
                    b = c._plugins[h])
                        for (e = 0,
                        f = b.length; f > e; e++)
                            d = b[e].init(this, h, d);
                    this._initQueueProps[h] = this._curQueueProps[h] = void 0 === d ? null  : d
                }
            for (h in a) {
                if (d = this._curQueueProps[h],
                b = c._plugins[h])
                    for (g = g || {},
                    e = 0,
                    f = b.length; f > e; e++)
                        b[e].step && b[e].step(this, h, d, a[h], g);
                this._curQueueProps[h] = a[h]
            }
            return g && this._appendQueueProps(g),
            this._curQueueProps
        }
        ,
        c.prototype._addAction = function(a) {
            return a.t = this.duration,
            this._actions.push(a),
            this
        }
        ,
        c.prototype._set = function(a, b) {
            for (var c in a)
                b[c] = a[c]
        }
        ,
        c.prototype.wait = function(a, b) {
            if (null  == a || 0 >= a)
                return this;
            var c = this._cloneProps(this._curQueueProps);
            return this._addStep({
                d: a,
                p0: c,
                p1: c,
                v: b
            })
        }
        ,
        c.prototype.to = function(a, b, c) {
            return void 0 === c && (c = void 0),
            (isNaN(b) || 0 > b) && (b = 0),
            this._addStep({
                d: b || 0,
                p0: this._cloneProps(this._curQueueProps),
                e: c,
                p1: this._cloneProps(this._appendQueueProps(a))
            })
        }
        ,
        c.prototype.call = function(a, b, c) {
            return void 0 === b && (b = void 0),
            void 0 === c && (c = void 0),
            this._addAction({
                f: a,
                p: c ? c : [],
                o: b ? b : this._target
            })
        }
        ,
        c.prototype.set = function(a, b) {
            return void 0 === b && (b = null ),
            this._addAction({
                f: this._set,
                o: this,
                p: [a, b ? b : this._target]
            })
        }
        ,
        c.prototype.play = function(a) {
            return a || (a = this),
            this.call(a.setPaused, a, [!1])
        }
        ,
        c.prototype.pause = function(a) {
            return a || (a = this),
            this.call(a.setPaused, a, [!0])
        }
        ,
        c.prototype.tick = function(a) {
            this.paused || this.setPosition(this._prevPosition + a)
        }
        ,
        c.NONE = 0,
        c.LOOP = 1,
        c.REVERSE = 2,
        c._tweens = [],
        c.IGNORE = {},
        c._plugins = {},
        c._inited = !1,
        c
    }
    (a.EventDispatcher);
    a.Tween = b,
    b.prototype.__class__ = "egret.Tween"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function b() {
            a.Logger.fatalWithErrorId(1014)
        }
        return b.get = function(a) {
            return -1 > a && (a = -1),
            a > 1 && (a = 1),
            function(b) {
                return 0 == a ? b : 0 > a ? b * (b * -a + 1 + a) : b * ((2 - b) * a + (1 - a))
            }
        }
        ,
        b.getPowIn = function(a) {
            return function(b) {
                return Math.pow(b, a)
            }
        }
        ,
        b.getPowOut = function(a) {
            return function(b) {
                return 1 - Math.pow(1 - b, a)
            }
        }
        ,
        b.getPowInOut = function(a) {
            return function(b) {
                return 1 > (b *= 2) ? .5 * Math.pow(b, a) : 1 - .5 * Math.abs(Math.pow(2 - b, a))
            }
        }
        ,
        b.sineIn = function(a) {
            return 1 - Math.cos(a * Math.PI / 2)
        }
        ,
        b.sineOut = function(a) {
            return Math.sin(a * Math.PI / 2)
        }
        ,
        b.sineInOut = function(a) {
            return -.5 * (Math.cos(Math.PI * a) - 1)
        }
        ,
        b.getBackIn = function(a) {
            return function(b) {
                return b * b * ((a + 1) * b - a)
            }
        }
        ,
        b.getBackOut = function(a) {
            return function(b) {
                return --b * b * ((a + 1) * b + a) + 1
            }
        }
        ,
        b.getBackInOut = function(a) {
            return a *= 1.525,
            function(b) {
                return 1 > (b *= 2) ? .5 * b * b * ((a + 1) * b - a) : .5 * ((b -= 2) * b * ((a + 1) * b + a) + 2)
            }
        }
        ,
        b.circIn = function(a) {
            return -(Math.sqrt(1 - a * a) - 1)
        }
        ,
        b.circOut = function(a) {
            return Math.sqrt(1 - --a * a)
        }
        ,
        b.circInOut = function(a) {
            return 1 > (a *= 2) ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
        }
        ,
        b.bounceIn = function(a) {
            return 1 - b.bounceOut(1 - a)
        }
        ,
        b.bounceOut = function(a) {
            return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
        }
        ,
        b.bounceInOut = function(a) {
            return .5 > a ? .5 * b.bounceIn(2 * a) : .5 * b.bounceOut(2 * a - 1) + .5
        }
        ,
        b.getElasticIn = function(a, b) {
            var c = 2 * Math.PI;
            return function(d) {
                if (0 == d || 1 == d)
                    return d;
                var e = b / c * Math.asin(1 / a);
                return -(a * Math.pow(2, 10 * (d -= 1)) * Math.sin((d - e) * c / b))
            }
        }
        ,
        b.getElasticOut = function(a, b) {
            var c = 2 * Math.PI;
            return function(d) {
                if (0 == d || 1 == d)
                    return d;
                var e = b / c * Math.asin(1 / a);
                return a * Math.pow(2, -10 * d) * Math.sin((d - e) * c / b) + 1
            }
        }
        ,
        b.getElasticInOut = function(a, b) {
            var c = 2 * Math.PI;
            return function(d) {
                var e = b / c * Math.asin(1 / a);
                return 1 > (d *= 2) ? -.5 * a * Math.pow(2, 10 * (d -= 1)) * Math.sin((d - e) * c / b) : .5 * a * Math.pow(2, -10 * (d -= 1)) * Math.sin((d - e) * c / b) + 1
            }
        }
        ,
        b.quadIn = b.getPowIn(2),
        b.quadOut = b.getPowOut(2),
        b.quadInOut = b.getPowInOut(2),
        b.cubicIn = b.getPowIn(3),
        b.cubicOut = b.getPowOut(3),
        b.cubicInOut = b.getPowInOut(3),
        b.quartIn = b.getPowIn(4),
        b.quartOut = b.getPowOut(4),
        b.quartInOut = b.getPowInOut(4),
        b.quintIn = b.getPowIn(5),
        b.quintOut = b.getPowOut(5),
        b.quintInOut = b.getPowInOut(5),
        b.backIn = b.getBackIn(1.7),
        b.backOut = b.getBackOut(1.7),
        b.backInOut = b.getBackInOut(1.7),
        b.elasticIn = b.getElasticIn(1, .3),
        b.elasticOut = b.getElasticOut(1, .3),
        b.elasticInOut = b.getElasticInOut(1, .3 * 1.5),
        b
    }
    ();
    a.Ease = b,
    b.prototype.__class__ = "egret.Ease"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function a() {
            this.path = "",
            this.audio = null ,
            this.type = a.EFFECT
        }
        return a.prototype.play = function(a) {
            void 0 === a && (a = !1);
            var b = this.audio;
            b && (isNaN(b.duration) || (b.currentTime = 0),
            b.loop = a,
            b.play())
        }
        ,
        a.prototype.pause = function() {
            var a = this.audio;
            a && a.pause()
        }
        ,
        a.prototype.load = function() {
            var a = this.audio;
            a && a.load()
        }
        ,
        a.prototype.addEventListener = function(a, b) {
            this.audio && this.audio.addEventListener(a, b, !1)
        }
        ,
        a.prototype.removeEventListener = function(a, b) {
            this.audio && this.audio.removeEventListener(a, b, !1)
        }
        ,
        a.prototype.setVolume = function(a) {
            var b = this.audio;
            b && (b.volume = a)
        }
        ,
        a.prototype.getVolume = function() {
            return this.audio ? this.audio.volume : 0
        }
        ,
        a.prototype.preload = function(a) {
            this.type = a
        }
        ,
        a.prototype._setAudio = function(a) {
            this.audio = a
        }
        ,
        a.MUSIC = "music",
        a.EFFECT = "effect",
        a
    }
    ();
    a.Sound = b,
    b.prototype.__class__ = "egret.Sound"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function a() {}
        return a.isNumber = function(a) {
            return "number" == typeof a && !isNaN(a)
        }
        ,
        a.sin = function(a) {
            return a = Math.round(a),
            a %= 360,
            0 > a && (a += 360),
            90 > a ? egret_sin_map[a] : 180 > a ? egret_cos_map[a - 90] : 270 > a ? -egret_sin_map[a - 180] : -egret_cos_map[a - 270]
        }
        ,
        a.cos = function(a) {
            return a = Math.round(a),
            a %= 360,
            0 > a && (a += 360),
            90 > a ? egret_cos_map[a] : 180 > a ? -egret_sin_map[a - 90] : 270 > a ? -egret_cos_map[a - 180] : egret_sin_map[a - 270]
        }
        ,
        a
    }
    ();
    a.NumberUtils = b,
    b.prototype.__class__ = "egret.NumberUtils"
}
(egret || (egret = {}));
for (egret_sin_map = {},
egret_cos_map = {},
i = 0; 90 >= i; i++)
    egret_sin_map[i] = Math.sin(i * egret.Matrix.DEG_TO_RAD),
    egret_cos_map[i] = Math.cos(i * egret.Matrix.DEG_TO_RAD);
Function.prototype.bind || (Function.prototype.bind = function(a) {
    if ("function" != typeof this)
        throw new TypeError(egret.getString(1029));
    var b = Array.prototype.slice.call(arguments, 1)
      , c = this
      , d = function() {}
      , e = function() {
        return c.apply(this instanceof d && a ? this : a, b.concat(Array.prototype.slice.call(arguments)))
    }
    ;
    return d.prototype = this.prototype,
    e.prototype = new d,
    e
}
),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b(b, c, d) {
            void 0 === c && (c = !1),
            void 0 === d && (d = !1),
            a.call(this, b, c, d),
            this.itemsTotal = this.itemsLoaded = 0,
            this.groupName = "",
            this.resItem = null 
        }
        return __extends(b, a),
        b.dispatchResourceEvent = function(a, c, d, e, f, g) {
            void 0 === d && (d = ""),
            void 0 === e && (e = null ),
            void 0 === f && (f = 0),
            void 0 === g && (g = 0);
            var h = egret.Event._getPropertyData(b);
            h.groupName = d,
            h.resItem = e,
            h.itemsLoaded = f,
            h.itemsTotal = g,
            egret.Event._dispatchByTarget(b, a, c, h)
        }
        ,
        b.ITEM_LOAD_ERROR = "itemLoadError",
        b.CONFIG_COMPLETE = "configComplete",
        b.CONFIG_LOAD_ERROR = "configLoadError",
        b.GROUP_PROGRESS = "groupProgress",
        b.GROUP_COMPLETE = "groupComplete",
        b.GROUP_LOAD_ERROR = "groupLoadError",
        b
    }
    (egret.Event);
    a.ResourceEvent = b,
    b.prototype.__class__ = "RES.ResourceEvent"
}
(RES || (RES = {})),
function(a) {
    var b = function() {
        function a(a, b, c) {
            this.groupName = "",
            this.data = null ,
            this._loaded = !1,
            this.name = a,
            this.url = b,
            this.type = c
        }
        return Object.defineProperty(a.prototype, "loaded", {
            get: function() {
                return this.data ? this.data.loaded : this._loaded
            },
            set: function(a) {
                this.data && (this.data.loaded = a),
                this._loaded = a
            },
            enumerable: !0,
            configurable: !0
        }),
        a.prototype.toString = function() {
            return '[ResourceItem name="' + this.name + '" url="' + this.url + '" type="' + this.type + '"]'
        }
        ,
        a.TYPE_XML = "xml",
        a.TYPE_IMAGE = "image",
        a.TYPE_BIN = "bin",
        a.TYPE_TEXT = "text",
        a.TYPE_JSON = "json",
        a.TYPE_SHEET = "sheet",
        a.TYPE_FONT = "font",
        a.TYPE_SOUND = "sound",
        a
    }
    ();
    a.ResourceItem = b,
    b.prototype.__class__ = "RES.ResourceItem"
}
(RES || (RES = {})),
function(a) {
    var b = function() {
        function b() {
            this.keyMap = {},
            this.groupDic = {},
            a.configInstance = this
        }
        return b.prototype.getGroupByName = function(a) {
            var c, d, b = [];
            if (!this.groupDic[a])
                return b;
            for (a = this.groupDic[a],
            c = a.length,
            d = 0; c > d; d++)
                b.push(this.parseResourceItem(a[d]));
            return b
        }
        ,
        b.prototype.getRawGroupByName = function(a) {
            return this.groupDic[a] ? this.groupDic[a] : []
        }
        ,
        b.prototype.createGroup = function(a, b, c) {
            var d, e, f, g, h, i, j;
            if (void 0 === c && (c = !1),
            !c && this.groupDic[a] || !b || 0 == b.length)
                return !1;
            for (c = this.groupDic,
            d = [],
            e = b.length,
            f = 0; e > f; f++)
                if (g = b[f],
                h = c[g])
                    for (g = h.length,
                    i = 0; g > i; i++)
                        j = h[i],
                        -1 == d.indexOf(j) && d.push(j);
                else
                    (j = this.keyMap[g]) ? -1 == d.indexOf(j) && d.push(j) : egret.Logger.warningWithErrorId(2e3, g);
            return 0 == d.length ? !1 : (this.groupDic[a] = d,
            !0)
        }
        ,
        b.prototype.parseConfig = function(a, b) {
            var c, d, e, f, g, h, i, j, k;
            if (a) {
                if (c = a.resources)
                    for (d = c.length,
                    e = 0; d > e; e++)
                        f = c[e],
                        g = f.url,
                        g && -1 == g.indexOf("://") && (f.url = b + g),
                        this.addItemToKeyMap(f);
                if (c = a.groups)
                    for (d = c.length,
                    e = 0; d > e; e++) {
                        for (g = c[e],
                        h = [],
                        i = g.keys.split(","),
                        j = i.length,
                        k = 0; j > k; k++)
                            f = i[k].trim(),
                            (f = this.keyMap[f]) && -1 == h.indexOf(f) && h.push(f);
                        this.groupDic[g.name] = h
                    }
            }
        }
        ,
        b.prototype.addSubkey = function(a, b) {
            var c = this.keyMap[b];
            c && !this.keyMap[a] && (this.keyMap[a] = c)
        }
        ,
        b.prototype.addItemToKeyMap = function(a) {
            var b, c, d, e;
            if (this.keyMap[a.name] || (this.keyMap[a.name] = a),
            a.hasOwnProperty("subkeys"))
                for (b = a.subkeys.split(","),
                a.subkeys = b,
                c = b.length,
                d = 0; c > d; d++)
                    e = b[d],
                    null  == this.keyMap[e] && (this.keyMap[e] = a)
        }
        ,
        b.prototype.getName = function(a) {
            return (a = this.keyMap[a]) ? a.name : ""
        }
        ,
        b.prototype.getType = function(a) {
            return (a = this.keyMap[a]) ? a.type : ""
        }
        ,
        b.prototype.getRawResourceItem = function(a) {
            return this.keyMap[a]
        }
        ,
        b.prototype.getResourceItem = function(a) {
            return (a = this.keyMap[a]) ? this.parseResourceItem(a) : null 
        }
        ,
        b.prototype.parseResourceItem = function(b) {
            var c = new a.ResourceItem(b.name,b.url,b.type);
            return c.data = b,
            c
        }
        ,
        b
    }
    ();
    a.ResourceConfig = b,
    b.prototype.__class__ = "RES.ResourceConfig"
}
(RES || (RES = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this.thread = 2,
            this.loadingCount = 0,
            this.resInstance = this.callBack = null ,
            this.groupTotalDic = {},
            this.numLoadedDic = {},
            this.itemListDic = {},
            this.groupErrorDic = {},
            this.retryTimesDic = {},
            this.maxRetryTimes = 3,
            this.failedList = [],
            this.priorityQueue = {},
            this.lazyLoadList = [],
            this.analyzerDic = {},
            this.queueIndex = 0
        }
        return __extends(c, b),
        c.prototype.isGroupInLoading = function(a) {
            return void 0 !== this.itemListDic[a]
        }
        ,
        c.prototype.loadGroup = function(b, c, d) {
            if (void 0 === d && (d = 0),
            !this.itemListDic[c] && c)
                if (b && 0 != b.length) {
                    this.priorityQueue[d] ? this.priorityQueue[d].push(c) : this.priorityQueue[d] = [c],
                    this.itemListDic[c] = b,
                    d = b.length;
                    for (var e = 0; d > e; e++)
                        b[e].groupName = c;
                    this.groupTotalDic[c] = b.length,
                    this.numLoadedDic[c] = 0,
                    this.next()
                } else
                    egret.Logger.warningWithErrorId(2001, c),
                    b = new a.ResourceEvent(a.ResourceEvent.GROUP_LOAD_ERROR),
                    b.groupName = c,
                    this.dispatchEvent(b)
        }
        ,
        c.prototype.loadItem = function(a) {
            this.lazyLoadList.push(a),
            a.groupName = "",
            this.next()
        }
        ,
        c.prototype.next = function() {
            for (var b, c; this.loadingCount < this.thread && (b = this.getOneResourceItem(),
            b); )
                this.loadingCount++,
                b.loaded ? this.onItemComplete(b) : (c = this.analyzerDic[b.type],
                c || (c = this.analyzerDic[b.type] = egret.Injector.getInstance(a.AnalyzerBase, b.type)),
                c.loadFile(b, this.onItemComplete, this))
        }
        ,
        c.prototype.getOneResourceItem = function() {
            var b, a, c, d;
            if (0 < this.failedList.length)
                return this.failedList.shift();
            a = Number.NEGATIVE_INFINITY;
            for (b in this.priorityQueue)
                a = Math.max(a, b);
            if (a = this.priorityQueue[a],
            !a || 0 == a.length)
                return 0 == this.lazyLoadList.length ? null  : this.lazyLoadList.pop();
            for (b = a.length,
            d = 0; b > d && (this.queueIndex >= b && (this.queueIndex = 0),
            c = this.itemListDic[a[this.queueIndex]],
            !(0 < c.length)); d++)
                this.queueIndex++;
            return 0 == c.length ? null  : c.shift()
        }
        ,
        c.prototype.onItemComplete = function(b) {
            var c, d, e;
            if (this.loadingCount--,
            c = b.groupName,
            !b.loaded) {
                if (d = this.retryTimesDic[b.name] || 1,
                !(d > this.maxRetryTimes))
                    return this.retryTimesDic[b.name] = d + 1,
                    this.failedList.push(b),
                    this.next(),
                    void 0;
                delete this.retryTimesDic[b.name],
                a.ResourceEvent.dispatchResourceEvent(this.resInstance, a.ResourceEvent.ITEM_LOAD_ERROR, c, b)
            }
            c ? (this.numLoadedDic[c]++,
            d = this.numLoadedDic[c],
            e = this.groupTotalDic[c],
            b.loaded || (this.groupErrorDic[c] = !0),
            a.ResourceEvent.dispatchResourceEvent(this.resInstance, a.ResourceEvent.GROUP_PROGRESS, c, b, d, e),
            d == e && (b = this.groupErrorDic[c],
            this.removeGroupName(c),
            delete this.groupTotalDic[c],
            delete this.numLoadedDic[c],
            delete this.itemListDic[c],
            delete this.groupErrorDic[c],
            b ? a.ResourceEvent.dispatchResourceEvent(this, a.ResourceEvent.GROUP_LOAD_ERROR, c) : a.ResourceEvent.dispatchResourceEvent(this, a.ResourceEvent.GROUP_COMPLETE, c))) : this.callBack.call(this.resInstance, b),
            this.next()
        }
        ,
        c.prototype.removeGroupName = function(a) {
            var b, c, d, e, f, g;
            for (b in this.priorityQueue) {
                for (c = this.priorityQueue[b],
                d = c.length,
                e = 0,
                f = !1,
                d = c.length,
                g = 0; d > g; g++) {
                    if (c[g] == a) {
                        c.splice(e, 1),
                        f = !0;
                        break
                    }
                    e++
                }
                if (f) {
                    0 == c.length && delete this.priorityQueue[b];
                    break
                }
            }
        }
        ,
        c
    }
    (egret.EventDispatcher);
    a.ResourceLoader = b,
    b.prototype.__class__ = "RES.ResourceLoader"
}
(RES || (RES = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this.resourceConfig = null ,
            this.resourceConfig = a.configInstance
        }
        return __extends(c, b),
        c.prototype.addSubkey = function(a, b) {
            this.resourceConfig.addSubkey(a, b)
        }
        ,
        c.prototype.loadFile = function() {}
        ,
        c.prototype.getRes = function() {}
        ,
        c.prototype.destroyRes = function() {
            return !1
        }
        ,
        c.getStringPrefix = function(a) {
            if (!a)
                return "";
            var b = a.indexOf(".");
            return -1 != b ? a.substring(0, b) : ""
        }
        ,
        c.getStringTail = function(a) {
            if (!a)
                return "";
            var b = a.indexOf(".");
            return -1 != b ? a.substring(b + 1) : ""
        }
        ,
        c
    }
    (egret.HashObject);
    a.AnalyzerBase = b,
    b.prototype.__class__ = "RES.AnalyzerBase"
}
(RES || (RES = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b() {
            a.call(this),
            this.fileDic = {},
            this.resItemDic = [],
            this._dataFormat = egret.URLLoaderDataFormat.BINARY,
            this.recycler = new egret.Recycler
        }
        return __extends(b, a),
        b.prototype.loadFile = function(a, b, c) {
            if (this.fileDic[a.name])
                b.call(c, a);
            else {
                var d = this.getLoader();
                this.resItemDic[d.hashCode] = {
                    item: a,
                    func: b,
                    thisObject: c
                },
                d.load(new egret.URLRequest(a.url))
            }
        }
        ,
        b.prototype.getLoader = function() {
            var a = this.recycler.pop();
            return a || (a = new egret.URLLoader,
            a.addEventListener(egret.Event.COMPLETE, this.onLoadFinish, this),
            a.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadFinish, this)),
            a.dataFormat = this._dataFormat,
            a
        }
        ,
        b.prototype.onLoadFinish = function(a) {
            var d, e, b = a.target, c = this.resItemDic[b.hashCode];
            delete this.resItemDic[b.hashCode],
            this.recycler.push(b),
            d = c.item,
            e = c.func,
            d.loaded = a.type == egret.Event.COMPLETE,
            d.loaded && this.analyzeData(d, b.data),
            e.call(c.thisObject, d)
        }
        ,
        b.prototype.analyzeData = function(a, b) {
            var c = a.name;
            !this.fileDic[c] && b && (this.fileDic[c] = b)
        }
        ,
        b.prototype.getRes = function(a) {
            return this.fileDic[a]
        }
        ,
        b.prototype.hasRes = function(a) {
            return null  != this.getRes(a)
        }
        ,
        b.prototype.destroyRes = function(a) {
            return this.fileDic[a] ? (delete this.fileDic[a],
            !0) : !1
        }
        ,
        b
    }
    (a.AnalyzerBase);
    a.BinAnalyzer = b,
    b.prototype.__class__ = "RES.BinAnalyzer"
}
(RES || (RES = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b() {
            a.call(this),
            this._dataFormat = egret.URLLoaderDataFormat.TEXTURE
        }
        return __extends(b, a),
        b.prototype.analyzeData = function(a, b) {
            var c = a.name;
            !this.fileDic[c] && b && (this.fileDic[c] = b,
            (c = a.data) && c.scale9grid && (c = c.scale9grid.split(","),
            b.scale9Grid = new egret.Rectangle(parseInt(c[0]),parseInt(c[1]),parseInt(c[2]),parseInt(c[3]))))
        }
        ,
        b
    }
    (a.BinAnalyzer);
    a.ImageAnalyzer = b,
    b.prototype.__class__ = "RES.ImageAnalyzer"
}
(RES || (RES = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b() {
            a.call(this),
            this._dataFormat = egret.URLLoaderDataFormat.TEXT
        }
        return __extends(b, a),
        b.prototype.analyzeData = function(a, b) {
            var c = a.name;
            if (!this.fileDic[c] && b)
                try {
                    this.fileDic[c] = JSON.parse(b)
                } catch (d) {
                    egret.Logger.warningWithErrorId(1017, a.url, b)
                }
        }
        ,
        b
    }
    (a.BinAnalyzer);
    a.JsonAnalyzer = b,
    b.prototype.__class__ = "RES.JsonAnalyzer"
}
(RES || (RES = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b() {
            a.call(this),
            this._dataFormat = egret.URLLoaderDataFormat.TEXT
        }
        return __extends(b, a),
        b
    }
    (a.BinAnalyzer);
    a.TextAnalyzer = b,
    b.prototype.__class__ = "RES.TextAnalyzer"
}
(RES || (RES = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this.sheetMap = {},
            this.textureMap = {},
            this._dataFormat = egret.URLLoaderDataFormat.TEXT
        }
        return __extends(c, b),
        c.prototype.getRes = function(b) {
            var c = this.fileDic[b];
            return c || (c = this.textureMap[b]),
            !c && (c = a.AnalyzerBase.getStringPrefix(b),
            c = this.fileDic[c]) && (b = a.AnalyzerBase.getStringTail(b),
            c = c.getTexture(b)),
            c
        }
        ,
        c.prototype.onLoadFinish = function(a) {
            var d, e, b = a.target, c = this.resItemDic[b.hashCode];
            if (delete this.resItemDic[b.hashCode],
            this.recycler.push(b),
            d = c.item,
            e = c.func,
            d.loaded = a.type == egret.Event.COMPLETE,
            d.loaded)
                if ("string" == typeof b.data) {
                    if (d.loaded = !1,
                    a = this.analyzeConfig(d, b.data))
                        return d.url = a,
                        this._dataFormat = egret.URLLoaderDataFormat.TEXTURE,
                        this.loadFile(d, e, c.thisObject),
                        this._dataFormat = egret.URLLoaderDataFormat.TEXT,
                        void 0
                } else
                    this.analyzeBitmap(d, b.data);
            d.url = d.data.url,
            e.call(c.thisObject, d)
        }
        ,
        c.prototype.analyzeConfig = function(a, b) {
            var d, c = a.name, e = "";
            try {
                d = JSON.parse(b)
            } catch (f) {
                egret.Logger.warningWithErrorId(1017, a.url, b)
            }
            return d && (this.sheetMap[c] = d,
            e = this.getRelativePath(a.url, d.file)),
            e
        }
        ,
        c.prototype.analyzeBitmap = function(a, b) {
            var d, c = a.name;
            !this.fileDic[c] && b && (d = this.sheetMap[c],
            delete this.sheetMap[c],
            d = this.parseSpriteSheet(b, d, a.data && a.data.subkeys ? "" : c),
            this.fileDic[c] = d)
        }
        ,
        c.prototype.getRelativePath = function(a, b) {
            a = a.split("\\").join("/");
            var c = a.lastIndexOf("/");
            return a = -1 != c ? a.substring(0, c + 1) + b : b
        }
        ,
        c.prototype.parseSpriteSheet = function(a, b, c) {
            var f, d, e, g;
            if (b = b.frames,
            !b)
                return null ;
            d = new egret.SpriteSheet(a),
            e = this.textureMap;
            for (f in b)
                g = b[f],
                a = d.createTexture(f, g.x, g.y, g.w, g.h, g.offX, g.offY, g.sourceW, g.sourceH),
                g.scale9grid && (g = g.scale9grid.split(","),
                a.scale9Grid = new egret.Rectangle(parseInt(g[0]),parseInt(g[1]),parseInt(g[2]),parseInt(g[3]))),
                null  == e[f] && (e[f] = a,
                c && this.addSubkey(f, c));
            return d
        }
        ,
        c.prototype.destroyRes = function(a) {
            var c, b = this.fileDic[a];
            if (b) {
                delete this.fileDic[a];
                for (c in b._textureMap)
                    this.textureMap[c] && delete this.textureMap[c];
                return !0
            }
            return !1
        }
        ,
        c
    }
    (a.BinAnalyzer);
    a.SheetAnalyzer = b,
    b.prototype.__class__ = "RES.SheetAnalyzer"
}
(RES || (RES = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b() {
            a.call(this)
        }
        return __extends(b, a),
        b.prototype.analyzeConfig = function(a, b) {
            var d, c = a.name, e = "";
            try {
                d = JSON.parse(b)
            } catch (f) {}
            return d ? e = this.getRelativePath(a.url, d.file) : (d = b,
            e = this.getTexturePath(a.url, d)),
            this.sheetMap[c] = d,
            e
        }
        ,
        b.prototype.analyzeBitmap = function(a, b) {
            var d, c = a.name;
            !this.fileDic[c] && b && (d = this.sheetMap[c],
            delete this.sheetMap[c],
            d = new egret.BitmapFont(b,d),
            this.fileDic[c] = d)
        }
        ,
        b.prototype.getTexturePath = function(a, b) {
            var c = ""
              , d = b.split("\n")[2]
              , e = d.indexOf('file="');
            return -1 != e && (d = d.substring(e + 6),
            e = d.indexOf('"'),
            c = d.substring(0, e)),
            a = a.split("\\").join("/"),
            e = a.lastIndexOf("/"),
            a = -1 != e ? a.substring(0, e + 1) + c : c
        }
        ,
        b.prototype.destroyRes = function(a) {
            return this.fileDic[a] ? (delete this.fileDic[a],
            !0) : !1
        }
        ,
        b
    }
    (a.SheetAnalyzer);
    a.FontAnalyzer = b,
    b.prototype.__class__ = "RES.FontAnalyzer"
}
(RES || (RES = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b() {
            a.call(this),
            this._dataFormat = egret.URLLoaderDataFormat.SOUND
        }
        return __extends(b, a),
        b.prototype.analyzeData = function(a, b) {
            var c = a.name;
            !this.fileDic[c] && b && (this.fileDic[c] = b,
            (c = a.data) && c.soundType ? b.preload(c.soundType) : b.preload(egret.Sound.EFFECT))
        }
        ,
        b
    }
    (a.BinAnalyzer);
    a.SoundAnalyzer = b,
    b.prototype.__class__ = "RES.SoundAnalyzer"
}
(RES || (RES = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b() {
            a.call(this),
            this._dataFormat = egret.URLLoaderDataFormat.TEXT
        }
        return __extends(b, a),
        b.prototype.analyzeData = function(a, b) {
            var d, c = a.name;
            if (!this.fileDic[c] && b)
                try {
                    d = egret.XML.parse(b),
                    this.fileDic[c] = d
                } catch (e) {}
        }
        ,
        b
    }
    (a.BinAnalyzer);
    a.XMLAnalyzer = b,
    b.prototype.__class__ = "RES.XMLAnalyzer"
}
(RES || (RES = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b, c;
    a.loadConfig = function(a, b, d) {
        void 0 === b && (b = ""),
        void 0 === d && (d = "json"),
        c.loadConfig(a, b, d)
    }
    ,
    a.loadGroup = function(a, b) {
        void 0 === b && (b = 0),
        c.loadGroup(a, b)
    }
    ,
    a.isGroupLoaded = function(a) {
        return c.isGroupLoaded(a)
    }
    ,
    a.getGroupByName = function(a) {
        return c.getGroupByName(a)
    }
    ,
    a.createGroup = function(a, b, d) {
        return void 0 === d && (d = !1),
        c.createGroup(a, b, d)
    }
    ,
    a.hasRes = function(a) {
        return c.hasRes(a)
    }
    ,
    a.parseConfig = function(a, b) {
        void 0 === b && (b = ""),
        c.parseConfig(a, b)
    }
    ,
    a.getRes = function(a) {
        return c.getRes(a)
    }
    ,
    a.getResAsync = function(a, b, d) {
        c.getResAsync(a, b, d)
    }
    ,
    a.getResByUrl = function(a, b, d, e) {
        void 0 === e && (e = ""),
        c.getResByUrl(a, b, d, e)
    }
    ,
    a.destroyRes = function(a) {
        return c.destroyRes(a)
    }
    ,
    a.setMaxLoadingThread = function(a) {
        c.setMaxLoadingThread(a)
    }
    ,
    a.addEventListener = function(a, b, d, e, f) {
        void 0 === e && (e = !1),
        void 0 === f && (f = 0),
        c.addEventListener(a, b, d, e, f)
    }
    ,
    a.removeEventListener = function(a, b, d, e) {
        void 0 === e && (e = !1),
        c.removeEventListener(a, b, d, e)
    }
    ,
    b = function(b) {
        function c() {
            b.call(this),
            this.analyzerDic = {},
            this.configItemList = [],
            this.configComplete = this.callLaterFlag = !1,
            this.loadedGroups = [],
            this.groupNameList = [],
            this.asyncDic = {},
            this.init()
        }
        return __extends(c, b),
        c.prototype.getAnalyzerByType = function(b) {
            var c = this.analyzerDic[b];
            return c || (c = this.analyzerDic[b] = egret.Injector.getInstance(a.AnalyzerBase, b)),
            c
        }
        ,
        c.prototype.init = function() {
            egret.Injector.hasMapRule(a.AnalyzerBase, a.ResourceItem.TYPE_BIN) || egret.Injector.mapClass(a.AnalyzerBase, a.BinAnalyzer, a.ResourceItem.TYPE_BIN),
            egret.Injector.hasMapRule(a.AnalyzerBase, a.ResourceItem.TYPE_IMAGE) || egret.Injector.mapClass(a.AnalyzerBase, a.ImageAnalyzer, a.ResourceItem.TYPE_IMAGE),
            egret.Injector.hasMapRule(a.AnalyzerBase, a.ResourceItem.TYPE_TEXT) || egret.Injector.mapClass(a.AnalyzerBase, a.TextAnalyzer, a.ResourceItem.TYPE_TEXT),
            egret.Injector.hasMapRule(a.AnalyzerBase, a.ResourceItem.TYPE_JSON) || egret.Injector.mapClass(a.AnalyzerBase, a.JsonAnalyzer, a.ResourceItem.TYPE_JSON),
            egret.Injector.hasMapRule(a.AnalyzerBase, a.ResourceItem.TYPE_SHEET) || egret.Injector.mapClass(a.AnalyzerBase, a.SheetAnalyzer, a.ResourceItem.TYPE_SHEET),
            egret.Injector.hasMapRule(a.AnalyzerBase, a.ResourceItem.TYPE_FONT) || egret.Injector.mapClass(a.AnalyzerBase, a.FontAnalyzer, a.ResourceItem.TYPE_FONT),
            egret.Injector.hasMapRule(a.AnalyzerBase, a.ResourceItem.TYPE_SOUND) || egret.Injector.mapClass(a.AnalyzerBase, a.SoundAnalyzer, a.ResourceItem.TYPE_SOUND),
            egret.Injector.hasMapRule(a.AnalyzerBase, a.ResourceItem.TYPE_XML) || egret.Injector.mapClass(a.AnalyzerBase, a.XMLAnalyzer, a.ResourceItem.TYPE_XML),
            this.resConfig = new a.ResourceConfig,
            this.resLoader = new a.ResourceLoader,
            this.resLoader.callBack = this.onResourceItemComp,
            this.resLoader.resInstance = this,
            this.resLoader.addEventListener(a.ResourceEvent.GROUP_COMPLETE, this.onGroupComp, this),
            this.resLoader.addEventListener(a.ResourceEvent.GROUP_LOAD_ERROR, this.onGroupError, this)
        }
        ,
        c.prototype.loadConfig = function(a, b, c) {
            void 0 === c && (c = "json"),
            this.configItemList.push({
                url: a,
                resourceRoot: b,
                type: c
            }),
            this.callLaterFlag || (egret.callLater(this.startLoadConfig, this),
            this.callLaterFlag = !0)
        }
        ,
        c.prototype.startLoadConfig = function() {
            var b, d, e, f, g;
            for (this.callLaterFlag = !1,
            b = this.configItemList,
            this.configItemList = [],
            this.loadingConfigList = b,
            d = b.length,
            e = [],
            f = 0; d > f; f++)
                g = b[f],
                g = new a.ResourceItem(g.url,g.url,g.type),
                e.push(g);
            this.resLoader.loadGroup(e, c.GROUP_CONFIG, Number.MAX_VALUE)
        }
        ,
        c.prototype.isGroupLoaded = function(a) {
            return -1 != this.loadedGroups.indexOf(a)
        }
        ,
        c.prototype.getGroupByName = function(a) {
            return this.resConfig.getGroupByName(a)
        }
        ,
        c.prototype.loadGroup = function(b, c) {
            if (void 0 === c && (c = 0),
            -1 != this.loadedGroups.indexOf(b))
                a.ResourceEvent.dispatchResourceEvent(this, a.ResourceEvent.GROUP_COMPLETE, b);
            else if (!this.resLoader.isGroupInLoading(b))
                if (this.configComplete) {
                    var d = this.resConfig.getGroupByName(b);
                    this.resLoader.loadGroup(d, b, c)
                } else
                    this.groupNameList.push({
                        name: b,
                        priority: c
                    })
        }
        ,
        c.prototype.createGroup = function(a, b, c) {
            if (void 0 === c && (c = !1),
            c) {
                var d = this.loadedGroups.indexOf(a);
                -1 != d && this.loadedGroups.splice(d, 1)
            }
            return this.resConfig.createGroup(a, b, c)
        }
        ,
        c.prototype.onGroupComp = function(b) {
            var d, e, f, g;
            if (b.groupName == c.GROUP_CONFIG) {
                for (b = this.loadingConfigList.length,
                d = 0; b > d; d++)
                    e = this.loadingConfigList[d],
                    f = this.getAnalyzerByType(e.type),
                    g = f.getRes(e.url),
                    f.destroyRes(e.url),
                    this.resConfig.parseConfig(g, e.resourceRoot);
                this.configComplete = !0,
                this.loadingConfigList = null ,
                a.ResourceEvent.dispatchResourceEvent(this, a.ResourceEvent.CONFIG_COMPLETE),
                this.loadDelayGroups()
            } else
                this.loadedGroups.push(b.groupName),
                this.dispatchEvent(b)
        }
        ,
        c.prototype.loadDelayGroups = function() {
            var b, c, d, a = this.groupNameList;
            for (this.groupNameList = [],
            b = a.length,
            c = 0; b > c; c++)
                d = a[c],
                this.loadGroup(d.name, d.priority)
        }
        ,
        c.prototype.onGroupError = function(b) {
            b.groupName == c.GROUP_CONFIG ? (this.loadingConfigList = null ,
            a.ResourceEvent.dispatchResourceEvent(this, a.ResourceEvent.CONFIG_LOAD_ERROR)) : this.dispatchEvent(b)
        }
        ,
        c.prototype.hasRes = function(b) {
            var c = this.resConfig.getType(b);
            return "" == c && (b = a.AnalyzerBase.getStringPrefix(b),
            c = this.resConfig.getType(b),
            "" == c) ? !1 : !0
        }
        ,
        c.prototype.parseConfig = function(a, b) {
            this.resConfig.parseConfig(a, b),
            this.configComplete || this.loadingConfigList || (this.configComplete = !0,
            this.loadDelayGroups())
        }
        ,
        c.prototype.getRes = function(b) {
            var c = this.resConfig.getType(b);
            return "" == c && (c = a.AnalyzerBase.getStringPrefix(b),
            c = this.resConfig.getType(c),
            "" == c) ? null  : this.getAnalyzerByType(c).getRes(b)
        }
        ,
        c.prototype.getResAsync = function(b, c, d) {
            var e = this.resConfig.getType(b)
              , f = this.resConfig.getName(b);
            return "" == e && (f = a.AnalyzerBase.getStringPrefix(b),
            e = this.resConfig.getType(f),
            "" == e) ? (c.call(d, null ),
            void 0) : ((e = this.getAnalyzerByType(e).getRes(b)) ? c.call(d, e) : (b = {
                key: b,
                compFunc: c,
                thisObject: d
            },
            this.asyncDic[f] ? this.asyncDic[f].push(b) : (this.asyncDic[f] = [b],
            f = this.resConfig.getResourceItem(f),
            this.resLoader.loadItem(f))),
            void 0)
        }
        ,
        c.prototype.getResByUrl = function(b, c, d, e) {
            if (void 0 === e && (e = ""),
            b) {
                e || (e = this.getTypeByUrl(b));
                var f = this.getAnalyzerByType(e).getRes(b);
                f ? c.call(d, f) : (c = {
                    key: b,
                    compFunc: c,
                    thisObject: d
                },
                this.asyncDic[b] ? this.asyncDic[b].push(c) : (this.asyncDic[b] = [c],
                b = new a.ResourceItem(b,b,e),
                this.resLoader.loadItem(b)))
            } else
                c.call(d, null )
        }
        ,
        c.prototype.getTypeByUrl = function(b) {
            switch ((b = b.substr(b.lastIndexOf(".") + 1)) && (b = b.toLowerCase()),
            b) {
            case a.ResourceItem.TYPE_XML:
            case a.ResourceItem.TYPE_JSON:
            case a.ResourceItem.TYPE_SHEET:
                break;
            case "png":
            case "jpg":
            case "gif":
            case "jpeg":
            case "bmp":
                b = a.ResourceItem.TYPE_IMAGE;
                break;
            case "fnt":
                b = a.ResourceItem.TYPE_FONT;
                break;
            case "txt":
                b = a.ResourceItem.TYPE_TEXT;
                break;
            case "mp3":
            case "ogg":
            case "mpeg":
            case "wav":
            case "m4a":
            case "mp4":
            case "aiff":
            case "wma":
            case "mid":
                b = a.ResourceItem.TYPE_SOUND;
                break;
            default:
                b = a.ResourceItem.TYPE_BIN
            }
            return b
        }
        ,
        c.prototype.onResourceItemComp = function(a) {
            var c, d, e, f, b = this.asyncDic[a.name];
            for (delete this.asyncDic[a.name],
            a = this.getAnalyzerByType(a.type),
            c = b.length,
            d = 0; c > d; d++)
                e = b[d],
                f = a.getRes(e.key),
                e.compFunc.call(e.thisObject, f, e.key)
        }
        ,
        c.prototype.destroyRes = function(a) {
            var c, d, e, b = this.resConfig.getRawGroupByName(a);
            if (b) {
                for (c = this.loadedGroups.indexOf(a),
                -1 != c && this.loadedGroups.splice(c, 1),
                a = b.length,
                d = 0; a > d; d++)
                    c = b[d],
                    c.loaded = !1,
                    e = this.getAnalyzerByType(c.type),
                    e.destroyRes(c.name);
                return !0
            }
            return b = this.resConfig.getType(a),
            "" == b ? !1 : (c = this.resConfig.getRawResourceItem(a),
            c.loaded = !1,
            e = this.getAnalyzerByType(b),
            e.destroyRes(a))
        }
        ,
        c.prototype.setMaxLoadingThread = function(a) {
            1 > a && (a = 1),
            this.resLoader.thread = a
        }
        ,
        c.GROUP_CONFIG = "RES__CONFIG",
        c
    }
    (egret.EventDispatcher),
    b.prototype.__class__ = "RES.Resource",
    c = new b
}
(RES || (RES = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(a) {
            void 0 === a && (a = 60),
            b.call(this),
            this.frameRate = a,
            this._time = 0,
            this._requestAnimationId = 0 / 0,
            this._isActivate = !0,
            60 == a && (c.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame,
            c.cancelAnimationFrame = window.cancelAnimationFrame || window.msCancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.oCancelAnimationFrame || window.cancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame),
            c.requestAnimationFrame || (c.requestAnimationFrame = function(b) {
                return window.setTimeout(b, 1e3 / a)
            }
            ),
            c.cancelAnimationFrame || (c.cancelAnimationFrame = function(a) {
                return window.clearTimeout(a)
            }
            ),
            c.instance = this,
            this.registerListener()
        }
        return __extends(c, b),
        c.prototype.enterFrame = function() {
            var b = c.instance
              , d = c._thisObject
              , e = c._callback
              , f = a.getTimer()
              , g = f - b._time;
            b._requestAnimationId = c.requestAnimationFrame.call(window, c.prototype.enterFrame),
            e.call(d, g),
            b._time = f
        }
        ,
        c.prototype.executeMainLoop = function(a, b) {
            c._callback = a,
            c._thisObject = b,
            this.enterFrame()
        }
        ,
        c.prototype.reset = function() {
            var b = c.instance;
            b._requestAnimationId && (b._time = a.getTimer(),
            c.cancelAnimationFrame.call(window, b._requestAnimationId),
            b.enterFrame())
        }
        ,
        c.prototype.registerListener = function() {
            var g, h, b = this, d = function() {
                b._isActivate && (b._isActivate = !1,
                a.MainContext.instance.stage.dispatchEvent(new a.Event(a.Event.DEACTIVATE)))
            }
            , e = function() {
                b._isActivate || (b._isActivate = !0,
                c.instance.reset(),
                a.MainContext.instance.stage.dispatchEvent(new a.Event(a.Event.ACTIVATE)))
            }
            , f = function() {
                document[g] ? d() : e()
            }
            ;
            window.addEventListener("focus", e, !1),
            window.addEventListener("blur", d, !1),
            "undefined" != typeof document.hidden ? (g = "hidden",
            h = "visibilitychange") : "undefined" != typeof document.mozHidden ? (g = "mozHidden",
            h = "mozvisibilitychange") : "undefined" != typeof document.msHidden ? (g = "msHidden",
            h = "msvisibilitychange") : "undefined" != typeof document.webkitHidden ? (g = "webkitHidden",
            h = "webkitvisibilitychange") : "undefined" != typeof document.oHidden && (g = "oHidden",
            h = "ovisibilitychange"),
            "onpageshow" in window && "onpagehide" in window && (window.addEventListener("pageshow", e, !1),
            window.addEventListener("pagehide", d, !1)),
            g && h && document.addEventListener(h, f, !1)
        }
        ,
        c.instance = null ,
        c.requestAnimationFrame = null ,
        c.cancelAnimationFrame = null ,
        c._thisObject = null ,
        c._callback = null ,
        c
    }
    (a.DeviceContext);
    a.HTML5DeviceContext = b,
    b.prototype.__class__ = "egret.HTML5DeviceContext"
}
(egret || (egret = {})),
function(a) {
    a.getItem = function(a) {
        return window.localStorage.getItem(a)
    }
    ,
    a.setItem = function(a, b) {
        try {
            return window.localStorage.setItem(a, b),
            !0
        } catch (c) {
            return egret.Logger.infoWithErrorId(1018, a, b),
            !1
        }
    }
    ,
    a.removeItem = function(a) {
        window.localStorage.removeItem(a)
    }
    ,
    a.clear = function() {
        window.localStorage.clear()
    }
    ,
    a.init = function() {
        for (var b in a)
            egret.localStorage[b] = a[b]
    }
}
(egret_html5_localStorage || (egret_html5_localStorage = {})),
egret_html5_localStorage.init(),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(a, c) {
            void 0 === c && (c = !0),
            b.call(this),
            this.globalAlpha = 1,
            this.useCacheCanvas = c,
            this.canvas = a || this.createCanvas(),
            this.canvasContext = this.canvas.getContext("2d"),
            c ? (this._cacheCanvas = document.createElement("canvas"),
            this._cacheCanvas.width = this.canvas.width,
            this._cacheCanvas.height = this.canvas.height,
            this.drawCanvasContext = this._cacheCanvasContext = this._cacheCanvas.getContext("2d")) : this.drawCanvasContext = this.canvasContext,
            this.onResize();
            var d = this.drawCanvasContext.setTransform
              , e = this;
            this.drawCanvasContext.setTransform = function(a, b, c, f, g, h) {
                e._matrixA = a,
                e._matrixB = b,
                e._matrixC = c,
                e._matrixD = f,
                e._matrixTx = g,
                e._matrixTy = h,
                d.call(e.drawCanvasContext, a, b, c, f, g, h)
            }
            ,
            this._matrixA = 1,
            this._matrixC = this._matrixB = 0,
            this._matrixD = 1,
            this._transformTy = this._transformTx = this._matrixTy = this._matrixTx = 0,
            this.initBlendMode()
        }
        return __extends(c, b),
        c.prototype.createCanvas = function() {
            var c, b = a.Browser.getInstance().$("#egretCanvas");
            return b || (c = document.getElementById(a.StageDelegate.canvas_div_name),
            b = a.Browser.getInstance().$new("canvas"),
            b.id = "egretCanvas",
            c.appendChild(b)),
            a.MainContext.instance.stage.addEventListener(a.Event.RESIZE, this.onResize, this),
            b
        }
        ,
        c.prototype.onResize = function() {
            if (this.canvas) {
                var b = document.getElementById(a.StageDelegate.canvas_div_name);
                this.canvas.width = a.MainContext.instance.stage.stageWidth,
                this.canvas.height = a.MainContext.instance.stage.stageHeight,
                this.canvas.style.width = b.style.width,
                this.canvas.style.height = b.style.height,
                this.useCacheCanvas && (this._cacheCanvas.width = this.canvas.width,
                this._cacheCanvas.height = this.canvas.height),
                this.drawCanvasContext.imageSmoothingEnabled = a.RendererContext.imageSmoothingEnabled,
                this.drawCanvasContext.webkitImageSmoothingEnabled = a.RendererContext.imageSmoothingEnabled,
                this.drawCanvasContext.mozImageSmoothingEnabled = a.RendererContext.imageSmoothingEnabled,
                this.drawCanvasContext.msImageSmoothingEnabled = a.RendererContext.imageSmoothingEnabled
            }
        }
        ,
        c.prototype.clearScreen = function() {
            var b, c, d, e;
            for (b = a.RenderFilter.getInstance().getDrawAreaList(),
            c = 0,
            d = b.length; d > c; c++)
                e = b[c],
                this.clearRect(e.x, e.y, e.width, e.height);
            b = a.MainContext.instance.stage,
            this.useCacheCanvas && this._cacheCanvasContext.clearRect(0, 0, b.stageWidth, b.stageHeight),
            this.renderCost = 0
        }
        ,
        c.prototype.clearRect = function(a, b, c, d) {
            this.canvasContext.clearRect(a, b, c, d)
        }
        ,
        c.prototype.drawImage = function(c, d, e, f, g, h, i, j, k, l) {
            var m, n;
            void 0 === l && (l = void 0),
            m = c._bitmapData,
            h += this._transformTx,
            i += this._transformTy,
            n = a.getTimer(),
            void 0 === l ? this.drawCanvasContext.drawImage(m, d, e, f, g, h, i, j, k) : this.drawRepeatImage(c, d, e, f, g, h, i, j, k, l),
            b.prototype.drawImage.call(this, c, d, e, f, g, h, i, j, k, l),
            this.renderCost += a.getTimer() - n
        }
        ,
        c.prototype.drawRepeatImage = function(b, c, d, e, f, g, h, i, j, k) {
            if (void 0 === b.pattern) {
                var l = a.MainContext.instance.rendererContext._texture_scale_factor
                  , m = b._bitmapData
                  , n = m;
                (m.width != e || m.height != f || 1 != l) && (n = document.createElement("canvas"),
                n.width = e * l,
                n.height = f * l,
                n.getContext("2d").drawImage(m, c, d, e, f, 0, 0, e * l, f * l)),
                c = this.drawCanvasContext.createPattern(n, k),
                b.pattern = c
            }
            this.drawCanvasContext.fillStyle = b.pattern,
            this.drawCanvasContext.translate(g, h),
            this.drawCanvasContext.fillRect(0, 0, i, j),
            this.drawCanvasContext.translate(-g, -h)
        }
        ,
        c.prototype.setTransform = function(a) {
            1 == a.a && 0 == a.b && 0 == a.c && 1 == a.d && 1 == this._matrixA && 0 == this._matrixB && 0 == this._matrixC && 1 == this._matrixD ? (this._transformTx = a.tx - this._matrixTx,
            this._transformTy = a.ty - this._matrixTy) : (this._transformTx = this._transformTy = 0,
            this._matrixA == a.a && this._matrixB == a.b && this._matrixC == a.c && this._matrixD == a.d && this._matrixTx == a.tx && this._matrixTy == a.ty || this.drawCanvasContext.setTransform(a.a, a.b, a.c, a.d, a.tx, a.ty))
        }
        ,
        c.prototype.setAlpha = function(b, c) {
            b != this.globalAlpha && (this.drawCanvasContext.globalAlpha = this.globalAlpha = b),
            c ? (this.blendValue = this.blendModes[c],
            this.drawCanvasContext.globalCompositeOperation = this.blendValue) : this.blendValue != a.BlendMode.NORMAL && (this.blendValue = this.blendModes[a.BlendMode.NORMAL],
            this.drawCanvasContext.globalCompositeOperation = this.blendValue)
        }
        ,
        c.prototype.initBlendMode = function() {
            this.blendModes = {},
            this.blendModes[a.BlendMode.NORMAL] = "source-over",
            this.blendModes[a.BlendMode.ADD] = "lighter"
        }
        ,
        c.prototype.setupFont = function(a, b) {
            void 0 === b && (b = null ),
            b = b || {};
            var c = null  == b.size ? a._size : b.size
              , d = null  == b.fontFamily ? a._fontFamily : b.fontFamily
              , e = this.drawCanvasContext
              , f = (null  == b.italic ? a._italic : b.italic) ? "italic " : "normal "
              , f = f + ((null  == b.bold ? a._bold : b.bold) ? "bold " : "normal ");
            e.font = f + (c + "px " + d),
            e.textAlign = "left",
            e.textBaseline = "middle"
        }
        ,
        c.prototype.measureText = function(a) {
            return this.drawCanvasContext.measureText(a).width
        }
        ,
        c.prototype.drawText = function(c, d, e, f, g, h) {
            var i, j, k, l;
            void 0 === h && (h = null ),
            this.setupFont(c, h),
            h = h || {},
            i = null  != h.textColor ? a.toColorString(h.textColor) : c._textColorString,
            j = null  != h.strokeColor ? a.toColorString(h.strokeColor) : c._strokeColorString,
            k = null  != h.stroke ? h.stroke : c._stroke,
            l = this.drawCanvasContext,
            l.fillStyle = i,
            l.strokeStyle = j,
            k && (l.lineWidth = 2 * k,
            l.strokeText(d, e + this._transformTx, f + this._transformTy, g || 65535)),
            l.fillText(d, e + this._transformTx, f + this._transformTy, g || 65535),
            b.prototype.drawText.call(this, c, d, e, f, g, h)
        }
        ,
        c.prototype.strokeRect = function(a, b, c, d, e) {
            this.drawCanvasContext.strokeStyle = e,
            this.drawCanvasContext.strokeRect(a, b, c, d)
        }
        ,
        c.prototype.pushMask = function(a) {
            this.drawCanvasContext.save(),
            this.drawCanvasContext.beginPath(),
            this.drawCanvasContext.rect(a.x + this._transformTx, a.y + this._transformTy, a.width, a.height),
            this.drawCanvasContext.clip(),
            this.drawCanvasContext.closePath()
        }
        ,
        c.prototype.popMask = function() {
            this.drawCanvasContext.restore(),
            this.drawCanvasContext.setTransform(1, 0, 0, 1, 0, 0)
        }
        ,
        c.prototype.onRenderStart = function() {
            this.drawCanvasContext.save()
        }
        ,
        c.prototype.onRenderFinish = function() {
            var b, c, d, e, f, g, h, i, j;
            if (this.drawCanvasContext.restore(),
            this.drawCanvasContext.setTransform(1, 0, 0, 1, 0, 0),
            this.useCacheCanvas)
                for (b = this._cacheCanvas.width,
                c = this._cacheCanvas.height,
                d = a.RenderFilter.getInstance().getDrawAreaList(),
                e = 0,
                f = d.length; f > e; e++)
                    g = d[e],
                    h = g.x,
                    i = g.y,
                    j = g.width,
                    g = g.height,
                    h + j > b && (j = b - h),
                    i + g > c && (g = c - i),
                    j > 0 && g > 0 && this.canvasContext.drawImage(this._cacheCanvas, h, i, j, g, h, i, j, g)
        }
        ,
        c
    }
    (a.RendererContext);
    a.HTML5CanvasRenderer = b,
    b.prototype.__class__ = "egret.HTML5CanvasRenderer"
}
(egret || (egret = {})),
function(a) {
    a.beginFill = function(a, c) {
        void 0 === c && (c = 1);
        var d = "rgba(" + (a >> 16) + "," + ((65280 & a) >> 8) + "," + (255 & a) + "," + c + ")";
        this.fillStyleColor = d,
        this._pushCommand(new b(this._setStyle,this,[d]))
    }
    ,
    a.drawRect = function(a, c, d, e) {
        this._pushCommand(new b(function(a, b, c, d) {
            var e = this.renderContext;
            this.canvasContext.beginPath(),
            this.canvasContext.rect(e._transformTx + a, e._transformTy + b, c, d),
            this.canvasContext.closePath()
        }
        ,this,[a, c, d, e])),
        this._fill(),
        this.checkRect(a, c, d, e)
    }
    ,
    a.drawCircle = function(a, c, d) {
        this._pushCommand(new b(function(a, b, c) {
            var d = this.renderContext;
            this.canvasContext.beginPath(),
            this.canvasContext.arc(d._transformTx + a, d._transformTy + b, c, 0, 2 * Math.PI),
            this.canvasContext.closePath()
        }
        ,this,[a, c, d])),
        this._fill(),
        this.checkRect(a - d, c - d, 2 * d, 2 * d)
    }
    ,
    a.drawRoundRect = function(a, c, d, e, f, g) {
        this._pushCommand(new b(function(a, b, c, d, e, f) {
            var g = this.renderContext;
            a = g._transformTx + a,
            b = g._transformTy + b,
            e /= 2,
            f = f ? f / 2 : e,
            c = a + c,
            d = b + d,
            g = d - f,
            this.canvasContext.beginPath(),
            this.canvasContext.moveTo(c, g),
            this.canvasContext.quadraticCurveTo(c, d, c - e, d),
            this.canvasContext.lineTo(a + e, d),
            this.canvasContext.quadraticCurveTo(a, d, a, d - f),
            this.canvasContext.lineTo(a, b + f),
            this.canvasContext.quadraticCurveTo(a, b, a + e, b),
            this.canvasContext.lineTo(c - e, b),
            this.canvasContext.quadraticCurveTo(c, b, c, b + f),
            this.canvasContext.lineTo(c, g),
            this.canvasContext.closePath()
        }
        ,this,[a, c, d, e, f, g])),
        this._fill(),
        this.checkRect(a, c, d, e)
    }
    ,
    a.drawEllipse = function(a, c, d, e) {
        this._pushCommand(new b(function(a, b, c, d) {
            var f, e = this.renderContext;
            this.canvasContext.save(),
            a = e._transformTx + a,
            b = e._transformTy + b,
            e = c > d ? c : d,
            f = c / e,
            d /= e,
            this.canvasContext.scale(f, d),
            this.canvasContext.beginPath(),
            this.canvasContext.moveTo((a + c) / f, b / d),
            this.canvasContext.arc(a / f, b / d, e, 0, 2 * Math.PI),
            this.canvasContext.closePath(),
            this.canvasContext.restore(),
            this.canvasContext.stroke()
        }
        ,this,[a, c, d, e])),
        this._fill(),
        this.checkRect(a - d, c - e, 2 * d, 2 * e)
    }
    ,
    a.lineStyle = function(a, c, d, e, f, g, h, i) {
        void 0 === a && (a = 0 / 0),
        void 0 === c && (c = 0),
        void 0 === d && (d = 1),
        void 0 === e && (e = !1),
        void 0 === f && (f = "normal"),
        void 0 === g && (g = null ),
        void 0 === h && (h = null ),
        void 0 === i && (i = 3),
        this.strokeStyleColor && (this.createEndLineCommand(),
        this._pushCommand(this.endLineCommand)),
        this.strokeStyleColor = c = "rgba(" + (c >> 16) + "," + ((65280 & c) >> 8) + "," + (255 & c) + "," + d + ")",
        this._pushCommand(new b(function(a, b) {
            this.canvasContext.lineWidth = a,
            this.canvasContext.strokeStyle = b,
            this.canvasContext.beginPath()
        }
        ,this,[a, c])),
        "undefined" == typeof this.lineX && (this.lineY = this.lineX = 0),
        this.moveTo(this.lineX, this.lineY)
    }
    ,
    a.lineTo = function(a, c) {
        this._pushCommand(new b(function(a, b) {
            var c = this.renderContext;
            this.canvasContext.lineTo(c._transformTx + a, c._transformTy + b)
        }
        ,this,[a, c])),
        this.lineX = a,
        this.lineY = c,
        this.checkPoint(a, c)
    }
    ,
    a.curveTo = function(a, c, d, e) {
        this._pushCommand(new b(function(a, b, c, d) {
            var e = this.renderContext;
            this.canvasContext.quadraticCurveTo(e._transformTx + a, e._transformTy + b, e._transformTx + c, e._transformTy + d)
        }
        ,this,[a, c, d, e])),
        this.lineX = d,
        this.lineY = e,
        this.checkPoint(a, c),
        this.checkPoint(d, e)
    }
    ,
    a.moveTo = function(a, c) {
        this._pushCommand(new b(function(a, b) {
            var c = this.renderContext;
            this.canvasContext.moveTo(c._transformTx + a, c._transformTy + b)
        }
        ,this,[a, c])),
        this.checkPoint(a, c)
    }
    ,
    a.clear = function() {
        this.lineY = this.lineX = this.commandQueue.length = 0,
        this.fillStyleColor = this.strokeStyleColor = null ,
        this._dirty = !1,
        this._maxY = this._maxX = this._minY = this._minX = 0
    }
    ,
    a.createEndFillCommand = function() {
        this.endFillCommand || (this.endFillCommand = new b(function() {
            this.canvasContext.fill(),
            this.canvasContext.closePath()
        }
        ,this,null ))
    }
    ,
    a.endFill = function() {
        null  != this.fillStyleColor && this._fill()
    }
    ,
    a._fill = function() {
        this.fillStyleColor && (this.createEndFillCommand(),
        this._pushCommand(this.endFillCommand),
        this.fillStyleColor = null )
    }
    ,
    a.createEndLineCommand = function() {
        this.endLineCommand || (this.endLineCommand = new b(function() {
            this.canvasContext.stroke(),
            this.canvasContext.closePath()
        }
        ,this,null ))
    }
    ,
    a._pushCommand = function(a) {
        this.commandQueue.push(a),
        this._dirty = !0
    }
    ,
    a._draw = function(a) {
        var c, d, b = this.commandQueue.length;
        if (0 != b) {
            for (this.renderContext = a,
            a = this.canvasContext = this.renderContext.drawCanvasContext,
            a.save(),
            this.strokeStyleColor && b > 0 && this.commandQueue[b - 1] != this.endLineCommand && (this.createEndLineCommand(),
            this._pushCommand(this.endLineCommand),
            b = this.commandQueue.length),
            c = 0; b > c; c++)
                d = this.commandQueue[c],
                d.method.apply(d.thisObject, d.args);
            a.restore(),
            this._dirty = !1
        }
    }
    ;
    var b = function() {
        return function(a, b, c) {
            this.method = a,
            this.thisObject = b,
            this.args = c
        }
    }
    ();
    b.prototype.__class__ = "egret_h5_graphics.Command",
    a._setStyle = function(a) {
        this.canvasContext.fillStyle = a,
        this.canvasContext.beginPath()
    }
    ,
    a.init = function() {
        for (var b in a)
            egret.Graphics.prototype[b] = a[b];
        egret.RendererContext.createRendererContext = function(a) {
            return new egret.HTML5CanvasRenderer(a,!1)
        }
    }
}
(egret_h5_graphics || (egret_h5_graphics = {})),
egret_h5_graphics.init(),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c(c) {
            b.call(this),
            this.glID = this.gl = this.canvas = null ,
            this.size = 2e3,
            this.vertices = null ,
            this.vertSize = 5,
            this.indices = null ,
            this.projectionY = this.projectionX = 0 / 0,
            this.shaderManager = null ,
            this.contextLost = !1,
            this.glContextId = 0,
            this.currentBlendMode = "",
            this.currentBaseTexture = null ,
            this.currentBatchSize = 0,
            this.worldTransform = null ,
            this.worldAlpha = 1,
            this.maskList = [],
            this.maskDataFreeList = [],
            this.graphicsIndexBuffer = this.graphicsBuffer = this.graphicsIndices = this.graphicsPoints = this.filterType = this.colorTransformMatrix = null ,
            this.graphicsStyle = {},
            this.canvas = c || this.createCanvas(),
            this.canvas.addEventListener("webglcontextlost", this.handleContextLost.bind(this), !1),
            this.canvas.addEventListener("webglcontextrestored", this.handleContextRestored.bind(this), !1),
            this.html5Canvas = document.createElement("canvas"),
            this.canvasContext = new a.HTML5CanvasRenderer(this.html5Canvas),
            this.onResize(),
            this.projectionX = this.canvas.width / 2,
            this.projectionY = -this.canvas.height / 2,
            c = 6 * this.size,
            this.vertices = new Float32Array(4 * this.size * this.vertSize),
            this.indices = new Uint16Array(c);
            for (var d = 0, e = 0; c > d; d += 6,
            e += 4)
                this.indices[d + 0] = e + 0,
                this.indices[d + 1] = e + 1,
                this.indices[d + 2] = e + 2,
                this.indices[d + 3] = e + 0,
                this.indices[d + 4] = e + 2,
                this.indices[d + 5] = e + 3;
            this.initWebGL(),
            this.shaderManager = new a.WebGLShaderManager(this.gl),
            this.worldTransform = new a.Matrix,
            this.initAll()
        }
        return __extends(c, b),
        c.prototype.onRenderFinish = function() {
            this._draw()
        }
        ,
        c.prototype.initAll = function() {
            c.isInit || (c.isInit = !0,
            egret_webgl_graphics.init(),
            a.TextField.prototype._makeBitmapCache = function() {
                var b, c, d, e, f, g;
                return this.renderTexture || (this.renderTexture = new a.RenderTexture),
                b = this.getBounds(a.Rectangle.identity),
                0 == b.width || 0 == b.height ? (this._texture_to_render = null ,
                !1) : (this._bitmapData || (this._bitmapData = document.createElement("canvas"),
                this.renderContext = a.RendererContext.createRendererContext(this._bitmapData)),
                c = b.width,
                b = b.height,
                d = a.MainContext.instance.rendererContext._texture_scale_factor,
                b /= d,
                c = Math.round(c / d),
                b = Math.round(b),
                e = this._bitmapData,
                e.width = c,
                e.height = b,
                e.style.width = c + "px",
                e.style.height = b + "px",
                this.renderContext._cacheCanvas && (this.renderContext._cacheCanvas.width = c,
                this.renderContext._cacheCanvas.height = b),
                this._worldTransform.identity(),
                this._worldTransform.a = 1 / d,
                this._worldTransform.d = 1 / d,
                this.renderContext.setTransform(this._worldTransform),
                this.worldAlpha = 1,
                e = a.RenderFilter.getInstance(),
                f = e._drawAreaList.concat(),
                e._drawAreaList.length = 0,
                this.renderContext.clearScreen(),
                this.renderContext.onRenderStart(),
                a.RendererContext.deleteTexture(this.renderTexture),
                this._colorTransform && this.renderContext.setGlobalColorTransform(this._colorTransform.matrix),
                g = this.mask || this._scrollRect,
                g && this.renderContext.pushMask(g),
                this._render(this.renderContext),
                g && this.renderContext.popMask(),
                this._colorTransform && this.renderContext.setGlobalColorTransform(null ),
                a.RenderTexture.identityRectangle.width = c,
                a.RenderTexture.identityRectangle.height = b,
                e.addDrawArea(a.RenderTexture.identityRectangle),
                this.renderContext.onRenderFinish(),
                e._drawAreaList = f,
                this.renderTexture._bitmapData = this._bitmapData,
                this.renderTexture._sourceWidth = c,
                this.renderTexture._sourceHeight = b,
                this.renderTexture._textureWidth = this.renderTexture._sourceWidth * d,
                this.renderTexture._textureHeight = this.renderTexture._sourceHeight * d,
                this._texture_to_render = this.renderTexture,
                !0)
            }
            ,
            a.TextField.prototype._draw = function(b) {
                this.getDirty() && (this._texture_to_render = this.renderTexture,
                this._cacheAsBitmap = !0),
                a.DisplayObject.prototype._draw.call(this, b)
            }
            ,
            a.RenderTexture.prototype.init = function() {
                this._bitmapData = document.createElement("canvas"),
                this.canvasContext = this._bitmapData.getContext("2d"),
                this._webglBitmapData = document.createElement("canvas"),
                this.renderContext = new a.WebGLRenderer(this._webglBitmapData)
            }
            ,
            a.RenderTexture.prototype.setSize = function(b, c) {
                if (this._webglBitmapData) {
                    var d = this._webglBitmapData;
                    d.width = b,
                    d.height = c,
                    d.style.width = b + "px",
                    d.style.height = c + "px",
                    this.renderContext.projectionX = b / 2,
                    this.renderContext.projectionY = -c / 2,
                    this.renderContext.viewportScale = a.MainContext.instance.rendererContext._texture_scale_factor
                }
            }
            ,
            a.RenderTexture.prototype.end = function() {}
            ,
            a.RenderTexture.prototype.drawToTexture = function(b, c, d) {
                var f, g, h, i, j, k, e = c || b.getBounds(a.Rectangle.identity);
                if (0 == e.width || 0 == e.height || c && (0 == c.width || 0 == c.height))
                    return !1;
                if ("undefined" == typeof d && (d = 1),
                this._bitmapData || (this._bitmapData = document.createElement("canvas"),
                this.canvasContext = this._bitmapData.getContext("2d"),
                a.RenderTexture.WebGLCanvas || (a.RenderTexture.WebGLCanvas = document.createElement("canvas"),
                a.RenderTexture.WebGLRenderer = new a.WebGLRenderer(a.RenderTexture.WebGLCanvas)),
                this._webglBitmapData = a.RenderTexture.WebGLCanvas,
                this.renderContext = a.RenderTexture.WebGLRenderer),
                f = e.x,
                g = e.y,
                c = e.width,
                e = e.height,
                e /= d,
                h = a.MainContext.instance.rendererContext._texture_scale_factor,
                c = Math.round(c / d),
                e = Math.round(e),
                this.setSize(c, e),
                i = this._bitmapData,
                j = c / h * d,
                k = e / h * d,
                i.width = j,
                i.height = k,
                i.style.width = j + "px",
                i.style.height = k + "px",
                this.begin(),
                b._worldTransform.identity(),
                i = b._anchorOffsetX,
                j = b._anchorOffsetY,
                (0 != b._anchorX || 0 != b._anchorY) && (i = b._anchorX * c,
                j = b._anchorY * e),
                this._offsetX = f + i,
                this._offsetY = g + j,
                b._worldTransform.append(1, 0, 0, 1, -this._offsetX, -this._offsetY),
                b.worldAlpha = 1,
                f = a.MainContext.__use_new_draw,
                a.MainContext.__use_new_draw = !1,
                b instanceof a.DisplayObjectContainer)
                    for (g = b._children,
                    i = 0,
                    j = g.length; j > i; i++)
                        g[i]._updateTransform();
                return this.renderContext.setTransform(b._worldTransform),
                g = a.RenderFilter.getInstance(),
                i = g._drawAreaList.concat(),
                g._drawAreaList.length = 0,
                j = this.renderContext.gl,
                j.viewport(0, 0, c, e),
                j.bindFramebuffer(j.FRAMEBUFFER, null ),
                j.clearColor(0, 0, 0, 0),
                j.clear(j.COLOR_BUFFER_BIT),
                this.renderContext.onRenderStart(),
                a.RendererContext.deleteTexture(this),
                b._filter && this.renderContext.setGlobalFilter(b._filter),
                b._colorTransform && this.renderContext.setGlobalColorTransform(b._colorTransform.matrix),
                (j = b.mask || b._scrollRect) && this.renderContext.pushMask(j),
                b._render(this.renderContext),
                this.renderContext._draw(),
                a.MainContext.__use_new_draw = f,
                j && this.renderContext.popMask(),
                b._colorTransform && this.renderContext.setGlobalColorTransform(null ),
                b._filter && this.renderContext.setGlobalFilter(null ),
                a.RenderTexture.identityRectangle.width = c,
                a.RenderTexture.identityRectangle.height = e,
                g.addDrawArea(a.RenderTexture.identityRectangle),
                this.renderContext.onRenderFinish(),
                g._drawAreaList = i,
                this._sourceWidth = c / h * d,
                this._sourceHeight = e / h * d,
                this._textureWidth = c * d,
                this._textureHeight = e * d,
                this.canvasContext.drawImage(this._webglBitmapData, 0, 0, c, e, 0, 0, this._sourceWidth, this._sourceHeight),
                !0
            }
            )
        }
        ,
        c.prototype.createCanvas = function() {
            var c, b = a.Browser.getInstance().$("#egretCanvas");
            return b || (c = document.getElementById(a.StageDelegate.canvas_div_name),
            b = a.Browser.getInstance().$new("canvas"),
            b.id = "egretCanvas",
            c.appendChild(b)),
            a.MainContext.instance.stage.addEventListener(a.Event.RESIZE, this.onResize, this),
            b
        }
        ,
        c.prototype.onResize = function() {
            var b = document.getElementById(a.StageDelegate.canvas_div_name);
            this.canvas && (this.canvas.width = a.MainContext.instance.stage.stageWidth,
            this.canvas.height = a.MainContext.instance.stage.stageHeight,
            this.canvas.style.width = b.style.width,
            this.canvas.style.height = b.style.height,
            this.projectionX = this.canvas.width / 2,
            this.projectionY = -this.canvas.height / 2),
            this.html5Canvas && (this.html5Canvas.width = a.MainContext.instance.stage.stageWidth,
            this.html5Canvas.height = a.MainContext.instance.stage.stageHeight,
            this.html5Canvas.style.width = b.style.width,
            this.html5Canvas.style.height = b.style.height)
        }
        ,
        c.prototype.handleContextLost = function() {
            this.contextLost = !0
        }
        ,
        c.prototype.handleContextRestored = function() {
            this.initWebGL(),
            this.shaderManager.setContext(this.gl),
            this.contextLost = !1
        }
        ,
        c.prototype.initWebGL = function() {
            for (var d, b = {}, e = ["experimental-webgl", "webgl"], f = 0; f < e.length; f++) {
                try {
                    d = this.canvas.getContext(e[f], b)
                } catch (g) {}
                if (d)
                    break
            }
            if (!d)
                throw Error(a.getString(1021));
            c.glID++,
            this.glID = c.glID,
            this.setContext(d)
        }
        ,
        c.prototype.setContext = function(a) {
            this.gl = a,
            a.id = this.glContextId++,
            this.vertexBuffer = a.createBuffer(),
            this.indexBuffer = a.createBuffer(),
            a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.indexBuffer),
            a.bufferData(a.ELEMENT_ARRAY_BUFFER, this.indices, a.STATIC_DRAW),
            a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer),
            a.bufferData(a.ARRAY_BUFFER, this.vertices, a.DYNAMIC_DRAW),
            a.disable(a.DEPTH_TEST),
            a.disable(a.CULL_FACE),
            a.enable(a.BLEND),
            a.colorMask(!0, !0, !0, !0)
        }
        ,
        c.prototype.start = function() {
            var a, b, c;
            this.contextLost || (a = this.gl,
            a.activeTexture(a.TEXTURE0),
            a.bindBuffer(a.ARRAY_BUFFER, this.vertexBuffer),
            a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, this.indexBuffer),
            b = this.colorTransformMatrix ? this.shaderManager.colorTransformShader : "blur" == this.filterType ? this.shaderManager.blurShader : this.shaderManager.defaultShader,
            this.shaderManager.activateShader(b),
            b.syncUniforms(),
            a.uniform2f(b.projectionVector, this.projectionX, this.projectionY),
            c = 4 * this.vertSize,
            a.vertexAttribPointer(b.aVertexPosition, 2, a.FLOAT, !1, c, 0),
            a.vertexAttribPointer(b.aTextureCoord, 2, a.FLOAT, !1, c, 8),
            a.vertexAttribPointer(b.colorAttribute, 2, a.FLOAT, !1, c, 16))
        }
        ,
        c.prototype.clearScreen = function() {
            var c, d, e, f, b = this.gl;
            for (b.colorMask(!0, !0, !0, !0),
            c = a.RenderFilter.getInstance().getDrawAreaList(),
            d = 0,
            e = c.length; e > d; d++)
                f = c[d],
                b.viewport(f.x, f.y, f.width, f.height),
                b.bindFramebuffer(b.FRAMEBUFFER, null ),
                b.clearColor(0, 0, 0, 0),
                b.clear(b.COLOR_BUFFER_BIT);
            c = a.MainContext.instance.stage,
            b.viewport(0, 0, c.stageWidth, c.stageHeight),
            this.renderCost = 0
        }
        ,
        c.prototype.setBlendMode = function(b) {
            if (b || (b = a.BlendMode.NORMAL),
            this.currentBlendMode != b) {
                var c = a.RendererContext.blendModesForGL[b];
                c && (this._draw(),
                this.gl.blendFunc(c[0], c[1]),
                this.currentBlendMode = b)
            }
        }
        ,
        c.prototype.drawRepeatImage = function(b, c, d, e, f, g, h, i, j, k) {
            var l, m, n;
            for (k = a.MainContext.instance.rendererContext._texture_scale_factor,
            e *= k,
            f *= k; i > g; g += e)
                for (l = h; j > l; l += f)
                    m = Math.min(e, i - g),
                    n = Math.min(f, j - l),
                    this.drawImage(b, c, d, m / k, n / k, g, l, m, n)
        }
        ,
        c.prototype.drawImage = function(a, b, c, d, e, f, g, h, i, j) {
            var k, l, m, n, o, p, q, r;
            void 0 === j && (j = void 0),
            this.contextLost || (void 0 !== j ? this.drawRepeatImage(a, b, c, d, e, f, g, h, i, j) : (this.createWebGLTexture(a),
            j = a._bitmapData.webGLTexture[this.glID],
            (j !== this.currentBaseTexture || this.currentBatchSize >= this.size - 1) && (this._draw(),
            this.currentBaseTexture = j),
            k = this.worldTransform,
            l = k.a,
            m = k.b,
            n = k.c,
            o = k.d,
            p = k.tx,
            q = k.ty,
            0 == f && 0 == g || k.append(1, 0, 0, 1, f, g),
            1 == d / h && 1 == e / i || k.append(h / d, 0, 0, i / e, 0, 0),
            f = k.a,
            g = k.b,
            h = k.c,
            i = k.d,
            j = k.tx,
            r = k.ty,
            k.a = l,
            k.b = m,
            k.c = n,
            k.d = o,
            k.tx = p,
            k.ty = q,
            l = a._sourceWidth,
            m = a._sourceHeight,
            a = d,
            k = e,
            b /= l,
            c /= m,
            d /= l,
            e /= m,
            l = this.vertices,
            m = 4 * this.currentBatchSize * this.vertSize,
            n = this.worldAlpha,
            l[m++] = j,
            l[m++] = r,
            l[m++] = b,
            l[m++] = c,
            l[m++] = n,
            l[m++] = f * a + j,
            l[m++] = g * a + r,
            l[m++] = d + b,
            l[m++] = c,
            l[m++] = n,
            l[m++] = f * a + h * k + j,
            l[m++] = i * k + g * a + r,
            l[m++] = d + b,
            l[m++] = e + c,
            l[m++] = n,
            l[m++] = h * k + j,
            l[m++] = i * k + r,
            l[m++] = b,
            l[m++] = e + c,
            l[m++] = n,
            this.currentBatchSize++))
        }
        ,
        c.prototype._draw = function() {
            var b, c, d;
            0 == this.currentBatchSize || this.contextLost || (b = a.getTimer(),
            this.start(),
            c = this.gl,
            c.bindTexture(c.TEXTURE_2D, this.currentBaseTexture),
            d = this.vertices.subarray(0, 4 * this.currentBatchSize * this.vertSize),
            c.bufferSubData(c.ARRAY_BUFFER, 0, d),
            c.drawElements(c.TRIANGLES, 6 * this.currentBatchSize, c.UNSIGNED_SHORT, 0),
            this.currentBatchSize = 0,
            this.renderCost += a.getTimer() - b,
            a.Profiler.getInstance().onDrawImage())
        }
        ,
        c.prototype.setTransform = function(a) {
            var b = this.worldTransform;
            b.a = a.a,
            b.b = a.b,
            b.c = a.c,
            b.d = a.d,
            b.tx = a.tx,
            b.ty = a.ty
        }
        ,
        c.prototype.setAlpha = function(a, b) {
            this.worldAlpha = a,
            this.setBlendMode(b)
        }
        ,
        c.prototype.createWebGLTexture = function(a) {
            if (a = a._bitmapData,
            a.webGLTexture || (a.webGLTexture = {}),
            !a.webGLTexture[this.glID]) {
                var b = this.gl;
                a.webGLTexture[this.glID] = b.createTexture(),
                b.bindTexture(b.TEXTURE_2D, a.webGLTexture[this.glID]),
                b.pixelStorei(b.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0),
                b.texImage2D(b.TEXTURE_2D, 0, b.RGBA, b.RGBA, b.UNSIGNED_BYTE, a),
                b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.LINEAR),
                b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.LINEAR),
                b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE),
                b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE),
                b.bindTexture(b.TEXTURE_2D, null )
            }
        }
        ,
        c.prototype.pushMask = function(a) {
            this._draw();
            var b = this.gl;
            0 == this.maskList.length && b.enable(b.SCISSOR_TEST),
            a = this.getScissorRect(a),
            this.maskList.push(a),
            this.scissor(a.x, a.y, a.width, a.height)
        }
        ,
        c.prototype.getScissorRect = function(b) {
            var d, e, f, c = this.maskList[this.maskList.length - 1];
            return c ? c.intersects(c) ? (d = Math.max(b.x + this.worldTransform.tx, c.x),
            e = Math.max(b.y + this.worldTransform.ty, c.y),
            f = Math.min(b.x + this.worldTransform.tx + b.width, c.x + c.width) - d,
            b = Math.min(b.y + this.worldTransform.ty + b.height, c.y + c.height) - e) : b = f = e = d = 0 : (d = b.x + this.worldTransform.tx,
            e = b.y + this.worldTransform.ty,
            f = b.width,
            b = b.height),
            (c = this.maskDataFreeList.pop()) ? (c.x = d,
            c.y = e,
            c.width = f,
            c.height = b) : c = new a.Rectangle(d,e,f,b),
            c
        }
        ,
        c.prototype.popMask = function() {
            this._draw();
            var a = this.gl
              , b = this.maskList.pop();
            this.maskDataFreeList.push(b),
            b = this.maskList.length,
            0 != b ? (b = this.maskList[b - 1],
            (0 < b.width || 0 < b.height) && this.scissor(b.x, b.y, b.width, b.height)) : a.disable(a.SCISSOR_TEST)
        }
        ,
        c.prototype.scissor = function(b, c, d, e) {
            var f = this.gl;
            0 > d && (d = 0),
            0 > e && (e = 0),
            f.scissor(b, -c + a.MainContext.instance.stage.stageHeight - e, d, e)
        }
        ,
        c.prototype.setGlobalColorTransform = function(a) {
            if (this.colorTransformMatrix != a && (this._draw(),
            this.colorTransformMatrix = a)) {
                a = a.concat();
                var b = this.shaderManager.colorTransformShader;
                b.uniforms.colorAdd.value.w = a.splice(19, 1)[0] / 255,
                b.uniforms.colorAdd.value.z = a.splice(14, 1)[0] / 255,
                b.uniforms.colorAdd.value.y = a.splice(9, 1)[0] / 255,
                b.uniforms.colorAdd.value.x = a.splice(4, 1)[0] / 255,
                b.uniforms.matrix.value = a
            }
        }
        ,
        c.prototype.setGlobalFilter = function(a) {
            this._draw(),
            this.setFilterProperties(a)
        }
        ,
        c.prototype.setFilterProperties = function(a) {
            if (a)
                switch (this.filterType = a.type,
                a.type) {
                case "blur":
                    var b = this.shaderManager.blurShader;
                    b.uniforms.blur.value.x = a.blurX,
                    b.uniforms.blur.value.y = a.blurY
                }
            else
                this.filterType = null 
        }
        ,
        c.prototype.setupFont = function(a, b) {
            void 0 === b && (b = null ),
            this.canvasContext.setupFont(a, b)
        }
        ,
        c.prototype.measureText = function(a) {
            return this.canvasContext.measureText(a)
        }
        ,
        c.prototype.renderGraphics = function(a) {
            this._draw();
            var b = this.gl
              , c = this.shaderManager.primitiveShader;
            this.graphicsPoints ? (this.graphicsPoints.length = 0,
            this.graphicsIndices.length = 0) : (this.graphicsPoints = [],
            this.graphicsIndices = [],
            this.graphicsBuffer = b.createBuffer(),
            this.graphicsIndexBuffer = b.createBuffer()),
            this.updateGraphics(a),
            this.shaderManager.activateShader(c),
            b.blendFunc(b.ONE, b.ONE_MINUS_SRC_ALPHA),
            b.uniformMatrix3fv(c.translationMatrix, !1, this.worldTransform.toArray(!0)),
            b.uniform2f(c.projectionVector, this.projectionX, -this.projectionY),
            b.uniform2f(c.offsetVector, 0, 0),
            b.uniform3fv(c.tintColor, [1, 1, 1]),
            b.uniform1f(c.alpha, this.worldAlpha),
            b.bindBuffer(b.ARRAY_BUFFER, this.graphicsBuffer),
            b.vertexAttribPointer(c.aVertexPosition, 2, b.FLOAT, !1, 24, 0),
            b.vertexAttribPointer(c.colorAttribute, 4, b.FLOAT, !1, 24, 8),
            b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, this.graphicsIndexBuffer),
            b.drawElements(b.TRIANGLE_STRIP, this.graphicsIndices.length, b.UNSIGNED_SHORT, 0),
            this.shaderManager.activateShader(this.shaderManager.defaultShader)
        }
        ,
        c.prototype.updateGraphics = function(a) {
            var b = this.gl;
            this.buildRectangle(a),
            b.bindBuffer(b.ARRAY_BUFFER, this.graphicsBuffer),
            b.bufferData(b.ARRAY_BUFFER, new Float32Array(this.graphicsPoints), b.STATIC_DRAW),
            b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, this.graphicsIndexBuffer),
            b.bufferData(b.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.graphicsIndices), b.STATIC_DRAW)
        }
        ,
        c.prototype.buildRectangle = function(a) {
            var e, f, g, h, i, j, k, b = a.x, c = a.y, d = a.w;
            a = a.h,
            e = this.graphicsStyle.a,
            f = this.graphicsStyle.r * e,
            g = this.graphicsStyle.g * e,
            h = this.graphicsStyle.b * e,
            i = this.graphicsPoints,
            j = this.graphicsIndices,
            k = i.length / 6,
            i.push(b, c),
            i.push(f, g, h, e),
            i.push(b + d, c),
            i.push(f, g, h, e),
            i.push(b, c + a),
            i.push(f, g, h, e),
            i.push(b + d, c + a),
            i.push(f, g, h, e),
            j.push(k, k, k + 1, k + 2, k + 3, k + 3)
        }
        ,
        c.prototype.setGraphicsStyle = function(a, b, c, d) {
            this.graphicsStyle.r = a,
            this.graphicsStyle.g = b,
            this.graphicsStyle.b = c,
            this.graphicsStyle.a = d
        }
        ,
        c.glID = 0,
        c.isInit = !1,
        c
    }
    (a.RendererContext);
    a.WebGLRenderer = b,
    b.prototype.__class__ = "egret.WebGLRenderer"
}
(egret || (egret = {})),
function(a) {
    a.beginFill = function(a, c) {
        void 0 === c && (c = 1),
        this._pushCommand(new b(this._setStyle,this,[(a >> 16) / 255, ((65280 & a) >> 8) / 255, (255 & a) / 255, c]))
    }
    ,
    a.drawRect = function(a, c, d, e) {
        this._pushCommand(new b(function(a) {
            this.renderContext.renderGraphics(a)
        }
        ,this,[{
            x: a,
            y: c,
            w: d,
            h: e
        }])),
        this.checkRect(a, c, d, e)
    }
    ,
    a.drawCircle = function() {}
    ,
    a.drawRoundRect = function() {}
    ,
    a.drawEllipse = function() {}
    ,
    a.lineStyle = function() {}
    ,
    a.lineTo = function() {}
    ,
    a.curveTo = function() {}
    ,
    a.moveTo = function() {}
    ,
    a.clear = function() {
        this._maxY = this._maxX = this._minY = this._minX = this.commandQueue.length = 0
    }
    ,
    a.endFill = function() {}
    ,
    a._pushCommand = function(a) {
        this.commandQueue.push(a)
    }
    ,
    a._draw = function(a) {
        var c, b = this.commandQueue.length;
        if (0 != b)
            for (this.renderContext = a,
            a = 0; b > a; a++)
                c = this.commandQueue[a],
                c.method.apply(c.thisObject, c.args)
    }
    ;
    var b = function() {
        return function(a, b, c) {
            this.method = a,
            this.thisObject = b,
            this.args = c
        }
    }
    ();
    b.prototype.__class__ = "egret_webgl_graphics.Command",
    a._setStyle = function(a, b, c, d) {
        this.renderContext.setGraphicsStyle(a, b, c, d)
    }
    ,
    a.init = function() {
        for (var b in a)
            egret.Graphics.prototype[b] = a[b]
    }
}
(egret_webgl_graphics || (egret_webgl_graphics = {})),
function(a) {
    var b = function() {
        function b() {}
        return b.compileProgram = function(c, d, e) {
            e = b.compileFragmentShader(c, e),
            d = b.compileVertexShader(c, d);
            var f = c.createProgram();
            return c.attachShader(f, d),
            c.attachShader(f, e),
            c.linkProgram(f),
            c.getProgramParameter(f, c.LINK_STATUS) || a.Logger.infoWithErrorId(1020),
            f
        }
        ,
        b.compileFragmentShader = function(a, c) {
            return b._compileShader(a, c, a.FRAGMENT_SHADER)
        }
        ,
        b.compileVertexShader = function(a, c) {
            return b._compileShader(a, c, a.VERTEX_SHADER)
        }
        ,
        b._compileShader = function(b, c, d) {
            return d = b.createShader(d),
            b.shaderSource(d, c),
            b.compileShader(d),
            b.getShaderParameter(d, b.COMPILE_STATUS) ? d : (a.Logger.info(b.getShaderInfoLog(d)),
            null )
        }
        ,
        b.checkCanUseWebGL = function() {
            if (void 0 == b.canUseWebGL)
                try {
                    var a = document.createElement("canvas");
                    b.canUseWebGL = !(!window.WebGLRenderingContext || !a.getContext("webgl") && !a.getContext("experimental-webgl"))
                } catch (c) {
                    b.canUseWebGL = !1
                }
            return b.canUseWebGL
        }
        ,
        b
    }
    ();
    a.WebGLUtils = b,
    b.prototype.__class__ = "egret.WebGLUtils"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function b(a) {
            this.defaultVertexSrc = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec2 aColor;\nuniform vec2 projectionVector;\nuniform vec2 offsetVector;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nconst vec2 center = vec2(-1.0, 1.0);\nvoid main(void) {\n   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);\n   vTextureCoord = aTextureCoord;\n   vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n}",
            this.program = this.gl = null ,
            this.fragmentSrc = "precision lowp float;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nuniform sampler2D uSampler;\nvoid main(void) {\ngl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;\n}",
            this.uniforms = null ,
            this.gl = a,
            this.init()
        }
        return b.prototype.init = function() {
            var d, b = this.gl, c = a.WebGLUtils.compileProgram(b, this.defaultVertexSrc, this.fragmentSrc);
            b.useProgram(c),
            this.uSampler = b.getUniformLocation(c, "uSampler"),
            this.projectionVector = b.getUniformLocation(c, "projectionVector"),
            this.offsetVector = b.getUniformLocation(c, "offsetVector"),
            this.dimensions = b.getUniformLocation(c, "dimensions"),
            this.aVertexPosition = b.getAttribLocation(c, "aVertexPosition"),
            this.aTextureCoord = b.getAttribLocation(c, "aTextureCoord"),
            this.colorAttribute = b.getAttribLocation(c, "aColor"),
            -1 === this.colorAttribute && (this.colorAttribute = 2),
            this.attributes = [this.aVertexPosition, this.aTextureCoord, this.colorAttribute];
            for (d in this.uniforms)
                this.uniforms[d].uniformLocation = b.getUniformLocation(c, d);
            this.initUniforms(),
            this.program = c
        }
        ,
        b.prototype.initUniforms = function() {
            var b, c, a, d;
            if (this.uniforms) {
                a = this.gl;
                for (c in this.uniforms)
                    b = this.uniforms[c],
                    d = b.type,
                    "mat2" === d || "mat3" === d || "mat4" === d ? (b.glMatrix = !0,
                    b.glValueLength = 1,
                    "mat2" === d ? b.glFunc = a.uniformMatrix2fv : "mat3" === d ? b.glFunc = a.uniformMatrix3fv : "mat4" === d && (b.glFunc = a.uniformMatrix4fv)) : (b.glFunc = a["uniform" + d],
                    b.glValueLength = "2f" === d || "2i" === d ? 2 : "3f" === d || "3i" === d ? 3 : "4f" === d || "4i" === d ? 4 : 1)
            }
        }
        ,
        b.prototype.syncUniforms = function() {
            if (this.uniforms) {
                var a, c, b = this.gl;
                for (c in this.uniforms)
                    a = this.uniforms[c],
                    1 === a.glValueLength ? !0 === a.glMatrix ? a.glFunc.call(b, a.uniformLocation, a.transpose, a.value) : a.glFunc.call(b, a.uniformLocation, a.value) : 2 === a.glValueLength ? a.glFunc.call(b, a.uniformLocation, a.value.x, a.value.y) : 3 === a.glValueLength ? a.glFunc.call(b, a.uniformLocation, a.value.x, a.value.y, a.value.z) : 4 === a.glValueLength && a.glFunc.call(b, a.uniformLocation, a.value.x, a.value.y, a.value.z, a.value.w)
            }
        }
        ,
        b
    }
    ();
    a.EgretShader = b,
    b.prototype.__class__ = "egret.EgretShader"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b(b) {
            a.call(this, b),
            this.fragmentSrc = "precision mediump float;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nuniform float invert;\nuniform mat4 matrix;\nuniform vec4 colorAdd;\nuniform sampler2D uSampler;\nvoid main(void) {\nvec4 locColor = texture2D(uSampler, vTextureCoord) * matrix;\nif(locColor.a != 0.0){\nlocColor += colorAdd;\n}\ngl_FragColor = locColor;\n}",
            this.uniforms = {
                matrix: {
                    type: "mat4",
                    value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
                },
                colorAdd: {
                    type: "4f",
                    value: {
                        x: 0,
                        y: 0,
                        z: 0,
                        w: 0
                    }
                }
            },
            this.init()
        }
        return __extends(b, a),
        b
    }
    (a.EgretShader);
    a.ColorTransformShader = b,
    b.prototype.__class__ = "egret.ColorTransformShader"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(a) {
        function b(b) {
            a.call(this, b),
            this.fragmentSrc = "precision mediump float;uniform vec2 blur;uniform sampler2D uSampler;varying vec2 vTextureCoord;void main(){gl_FragColor = vec4(0.0);gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2(-0.028 * blur.x, -0.028 * blur.y))) * 0.0044299121055113265;gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2(-0.024 * blur.x, -0.024 * blur.y))) * 0.00895781211794;gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2(-0.020 * blur.x, -0.020 * blur.y))) * 0.0215963866053;gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2(-0.016 * blur.x, -0.016 * blur.y))) * 0.0443683338718;gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2(-0.012 * blur.x, -0.012 * blur.y))) * 0.0776744219933;gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2(-0.008 * blur.x, -0.008 * blur.y))) * 0.115876621105;gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2(-0.004 * blur.x, -0.004 * blur.y))) * 0.147308056121;gl_FragColor += texture2D(uSampler, vTextureCoord) * 0.159576912161;gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2( 0.004 * blur.x,  0.004 * blur.y))) * 0.147308056121;gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2( 0.008 * blur.x,  0.008 * blur.y))) * 0.115876621105;gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2( 0.012 * blur.x,  0.012 * blur.y))) * 0.0776744219933;gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2( 0.016 * blur.x,  0.016 * blur.y))) * 0.0443683338718;gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2( 0.020 * blur.x,  0.020 * blur.y))) * 0.0215963866053;gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2( 0.024 * blur.x,  0.024 * blur.y))) * 0.00895781211794;gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2( 0.028 * blur.x,  0.028 * blur.y))) * 0.0044299121055113265;}",
            this.uniforms = {
                blur: {
                    type: "2f",
                    value: {
                        x: 2,
                        y: 2
                    }
                }
            },
            this.init()
        }
        return __extends(b, a),
        b
    }
    (a.EgretShader);
    a.BlurShader = b,
    b.prototype.__class__ = "egret.BlurShader"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function b(a) {
            this.alpha = this.translationMatrix = this.attributes = this.colorAttribute = this.aVertexPosition = this.tintColor = this.offsetVector = this.projectionVector = this.program = this.gl = null ,
            this.fragmentSrc = "precision mediump float;\nvarying vec4 vColor;\nvoid main(void) {\n   gl_FragColor = vColor;\n}",
            this.vertexSrc = "attribute vec2 aVertexPosition;\nattribute vec4 aColor;\nuniform mat3 translationMatrix;\nuniform vec2 projectionVector;\nuniform vec2 offsetVector;\nuniform float alpha;\nuniform vec3 tint;\nvarying vec4 vColor;\nvoid main(void) {\n   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);\n   v -= offsetVector.xyx;\n   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);\n   vColor = aColor * vec4(tint * alpha, alpha);\n}",
            this.gl = a,
            this.init()
        }
        return b.prototype.init = function() {
            var b = this.gl
              , c = a.WebGLUtils.compileProgram(b, this.vertexSrc, this.fragmentSrc);
            b.useProgram(c),
            this.projectionVector = b.getUniformLocation(c, "projectionVector"),
            this.offsetVector = b.getUniformLocation(c, "offsetVector"),
            this.tintColor = b.getUniformLocation(c, "tint"),
            this.aVertexPosition = b.getAttribLocation(c, "aVertexPosition"),
            this.colorAttribute = b.getAttribLocation(c, "aColor"),
            this.attributes = [this.aVertexPosition, this.colorAttribute],
            this.translationMatrix = b.getUniformLocation(c, "translationMatrix"),
            this.alpha = b.getUniformLocation(c, "alpha"),
            this.program = c
        }
        ,
        b
    }
    ();
    a.PrimitiveShader = b,
    b.prototype.__class__ = "egret.PrimitiveShader"
}
(egret || (egret = {})),
function(a) {
    var b = function() {
        function b(a) {
            this.gl = null ,
            this.maxAttibs = 10,
            this.attribState = [],
            this.tempAttribState = [],
            this.blurShader = this.colorTransformShader = this.primitiveShader = this.defaultShader = this.currentShader = null ;
            for (var b = 0; b < this.maxAttibs; b++)
                this.attribState[b] = !1;
            this.setContext(a)
        }
        return b.prototype.setContext = function(b) {
            this.gl = b,
            this.primitiveShader = new a.PrimitiveShader(b),
            this.defaultShader = new a.EgretShader(b),
            this.colorTransformShader = new a.ColorTransformShader(b),
            this.blurShader = new a.BlurShader(b),
            this.activateShader(this.defaultShader)
        }
        ,
        b.prototype.activateShader = function(a) {
            this.currentShader != a && (this.gl.useProgram(a.program),
            this.setAttribs(a.attributes),
            this.currentShader = a)
        }
        ,
        b.prototype.setAttribs = function(a) {
            var b, c;
            for (c = this.tempAttribState.length,
            b = 0; c > b; b++)
                this.tempAttribState[b] = !1;
            for (c = a.length,
            b = 0; c > b; b++)
                this.tempAttribState[a[b]] = !0;
            for (a = this.gl,
            c = this.attribState.length,
            b = 0; c > b; b++)
                this.attribState[b] !== this.tempAttribState[b] && (this.attribState[b] = this.tempAttribState[b],
                this.tempAttribState[b] ? a.enableVertexAttribArray(b) : a.disableVertexAttribArray(b))
        }
        ,
        b
    }
    ();
    a.WebGLShaderManager = b,
    b.prototype.__class__ = "egret.WebGLShaderManager"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this)
        }
        return __extends(c, b),
        c.prototype.proceed = function(b) {
            function c() {
                if (4 == e.readyState)
                    if (e.status != b._status && (b._status = e.status,
                    a.HTTPStatusEvent.dispatchHTTPStatusEvent(b, e.status)),
                    400 <= e.status || 0 == e.status)
                        a.IOErrorEvent.dispatchIOErrorEvent(b);
                    else {
                        switch (b.dataFormat) {
                        case a.URLLoaderDataFormat.TEXT:
                            b.data = e.responseText;
                            break;
                        case a.URLLoaderDataFormat.VARIABLES:
                            b.data = new a.URLVariables(e.responseText);
                            break;
                        case a.URLLoaderDataFormat.BINARY:
                            b.data = e.response;
                            break;
                        default:
                            b.data = e.responseText
                        }
                        a.__callAsync(a.Event.dispatchEvent, a.Event, b, a.Event.COMPLETE)
                    }
            }
            var d, e, f;
            b.dataFormat == a.URLLoaderDataFormat.TEXTURE ? this.loadTexture(b) : b.dataFormat == a.URLLoaderDataFormat.SOUND ? this.loadSound(b) : (d = b._request,
            e = this.getXHR(),
            e.onreadystatechange = c,
            f = a.NetContext._getUrl(d),
            e.open(d.method, f, !0),
            this.setResponseType(e, b.dataFormat),
            d.method != a.URLRequestMethod.GET && d.data ? d.data instanceof a.URLVariables ? (e.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
            e.send(d.data.toString())) : (e.setRequestHeader("Content-Type", "multipart/form-data"),
            e.send(d.data)) : e.send())
        }
        ,
        c.prototype.loadSound = function(b) {
            function c(f) {
                a.clearTimeout(e.__timeoutId),
                e.removeEventListener("canplaythrough", c, !1),
                e.removeEventListener("error", d, !1),
                f = new a.Sound,
                f._setAudio(e),
                b.data = f,
                a.__callAsync(a.Event.dispatchEvent, a.Event, b, a.Event.COMPLETE)
            }
            function d() {
                a.clearTimeout(e.__timeoutId),
                e.removeEventListener("canplaythrough", c, !1),
                e.removeEventListener("error", d, !1),
                a.IOErrorEvent.dispatchIOErrorEvent(b)
            }
            var e = new Audio(b._request.url);
            e.__timeoutId = a.setTimeout(c, this, 100),
            e.addEventListener("canplaythrough", c, !1),
            e.addEventListener("error", d, !1),
            e.load()
        }
        ,
        c.prototype.getXHR = function() {
            return window.XMLHttpRequest ? new window.XMLHttpRequest : new ActiveXObject("MSXML2.XMLHTTP")
        }
        ,
        c.prototype.setResponseType = function(b, c) {
            switch (c) {
            case a.URLLoaderDataFormat.TEXT:
            case a.URLLoaderDataFormat.VARIABLES:
                b.responseType = a.URLLoaderDataFormat.TEXT;
                break;
            case a.URLLoaderDataFormat.BINARY:
                b.responseType = "arraybuffer";
                break;
            default:
                b.responseType = c
            }
        }
        ,
        c.prototype.loadTexture = function(b) {
            var c = b._request
              , d = new Image;
            d.onload = function(c) {
                d.onerror = null ,
                d.onload = null ,
                c = new a.Texture,
                c._setBitmapData(d),
                b.data = c,
                a.__callAsync(a.Event.dispatchEvent, a.Event, b, a.Event.COMPLETE)
            }
            ,
            d.onerror = function() {
                d.onerror = null ,
                d.onload = null ,
                a.IOErrorEvent.dispatchIOErrorEvent(b)
            }
            ,
            d.src = c.url
        }
        ,
        c
    }
    (a.NetContext);
    a.HTML5NetContext = b,
    b.prototype.__class__ = "egret.HTML5NetContext"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this._isTouchDown = !1,
            this.rootDiv = null ,
            this.rootDiv = document.getElementById(a.StageDelegate.canvas_div_name)
        }
        return __extends(c, b),
        c.prototype.prevent = function(a) {
            a.stopPropagation(),
            1 != a.isScroll && a.preventDefault()
        }
        ,
        c.prototype.run = function() {
            var b = this;
            window.navigator.msPointerEnabled ? (this.rootDiv.addEventListener("MSPointerDown", function(a) {
                b._onTouchBegin(a),
                b.prevent(a)
            }
            , !1),
            this.rootDiv.addEventListener("MSPointerMove", function(a) {
                b._onTouchMove(a),
                b.prevent(a)
            }
            , !1),
            this.rootDiv.addEventListener("MSPointerUp", function(a) {
                b._onTouchEnd(a),
                b.prevent(a)
            }
            , !1)) : a.MainContext.deviceType == a.MainContext.DEVICE_MOBILE ? this.addTouchListener() : a.MainContext.deviceType == a.MainContext.DEVICE_PC && (this.addTouchListener(),
            this.addMouseListener()),
            window.addEventListener("mousedown", function(a) {
                b.inOutOfCanvas(a) ? b.dispatchLeaveStageEvent() : b._isTouchDown = !0
            }
            ),
            window.addEventListener("mouseup", function(a) {
                b._isTouchDown && (b.inOutOfCanvas(a) ? b.dispatchLeaveStageEvent() : b._onTouchEnd(a)),
                b._isTouchDown = !1
            }
            )
        }
        ,
        c.prototype.addMouseListener = function() {
            var a = this;
            this.rootDiv.addEventListener("mousedown", function(b) {
                a._onTouchBegin(b)
            }
            ),
            this.rootDiv.addEventListener("mousemove", function(b) {
                a._onTouchMove(b)
            }
            ),
            this.rootDiv.addEventListener("mouseup", function(b) {
                a._onTouchEnd(b)
            }
            )
        }
        ,
        c.prototype.addTouchListener = function() {
            var a = this;
            this.rootDiv.addEventListener("touchstart", function(b) {
                for (var c = b.changedTouches.length, d = 0; c > d; d++)
                    a._onTouchBegin(b.changedTouches[d]);
                a.prevent(b)
            }
            , !1),
            this.rootDiv.addEventListener("touchmove", function(b) {
                for (var c = b.changedTouches.length, d = 0; c > d; d++)
                    a._onTouchMove(b.changedTouches[d]);
                a.prevent(b)
            }
            , !1),
            this.rootDiv.addEventListener("touchend", function(b) {
                for (var c = b.changedTouches.length, d = 0; c > d; d++)
                    a._onTouchEnd(b.changedTouches[d]);
                a.prevent(b)
            }
            , !1),
            this.rootDiv.addEventListener("touchcancel", function(b) {
                for (var c = b.changedTouches.length, d = 0; c > d; d++)
                    a._onTouchEnd(b.changedTouches[d]);
                a.prevent(b)
            }
            , !1)
        }
        ,
        c.prototype.inOutOfCanvas = function(b) {
            var d, c = this.getLocation(this.rootDiv, b);
            return b = c.x,
            c = c.y,
            d = a.MainContext.instance.stage,
            0 > b || 0 > c || b > d.stageWidth || c > d.stageHeight ? !0 : !1
        }
        ,
        c.prototype.dispatchLeaveStageEvent = function() {
            this.touchingIdentifiers.length = 0,
            a.MainContext.instance.stage.dispatchEventWith(a.Event.LEAVE_STAGE)
        }
        ,
        c.prototype._onTouchBegin = function(a) {
            var b = this.getLocation(this.rootDiv, a)
              , c = -1;
            a.hasOwnProperty("identifier") && (c = a.identifier),
            this.onTouchBegan(b.x, b.y, c)
        }
        ,
        c.prototype._onTouchMove = function(a) {
            var b = this.getLocation(this.rootDiv, a)
              , c = -1;
            a.hasOwnProperty("identifier") && (c = a.identifier),
            this.onTouchMove(b.x, b.y, c)
        }
        ,
        c.prototype._onTouchEnd = function(a) {
            var b = this.getLocation(this.rootDiv, a)
              , c = -1;
            a.hasOwnProperty("identifier") && (c = a.identifier),
            this.onTouchEnd(b.x, b.y, c)
        }
        ,
        c.prototype.getLocation = function(b, c) {
            var f, g, h, d = document.documentElement, e = window;
            return "function" == typeof b.getBoundingClientRect ? (g = b.getBoundingClientRect(),
            f = g.left,
            g = g.top) : g = f = 0,
            f += e.pageXOffset - d.clientLeft,
            g += e.pageYOffset - d.clientTop,
            null  != c.pageX ? (d = c.pageX,
            e = c.pageY) : (f -= document.body.scrollLeft,
            g -= document.body.scrollTop,
            d = c.clientX,
            e = c.clientY),
            h = a.Point.identity,
            h.x = (d - f) / a.StageDelegate.getInstance().getScaleX(),
            h.y = (e - g) / a.StageDelegate.getInstance().getScaleY(),
            h
        }
        ,
        c
    }
    (a.TouchContext);
    a.HTML5TouchContext = b,
    b.prototype.__class__ = "egret.HTML5TouchContext"
}
(egret || (egret = {})),
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
function(a) {
    var b = function(b) {
        function c() {
            b.call(this),
            this.inputElement = this.div = null ,
            this._hasListeners = !1,
            this._inputType = "",
            this._isShow = !1,
            this.textValue = "",
            this._height = this._width = 0,
            this._styleInfoes = {};
            var c = a.StageDelegate.getInstance().getScaleX()
              , d = a.StageDelegate.getInstance().getScaleY()
              , e = a.Browser.getInstance().$new("div");
            e.position.x = 0,
            e.position.y = 0,
            e.scale.x = c,
            e.scale.y = d,
            e.transforms(),
            e.style[egret_dom.getTrans("transformOrigin")] = "0% 0% 0px",
            this.div = e,
            d = a.MainContext.instance.stage,
            c = d.stageWidth,
            d = d.stageHeight,
            e = new a.Shape,
            e.width = c,
            e.height = d,
            e.touchEnabled = !0,
            this._shape = e,
            this.getStageDelegateDiv().appendChild(this.div)
        }
        return __extends(c, b),
        c.prototype.getStageDelegateDiv = function() {
            var b = a.Browser.getInstance().$("#StageDelegateDiv");
            return b || (b = a.Browser.getInstance().$new("div"),
            b.id = "StageDelegateDiv",
            document.getElementById(a.StageDelegate.canvas_div_name).appendChild(b),
            b.transforms()),
            b
        }
        ,
        c.prototype._setMultiline = function(a) {
            b.prototype._setMultiline.call(this, a),
            this.createInput()
        }
        ,
        c.prototype.callHandler = function(a) {
            a.stopPropagation()
        }
        ,
        c.prototype._add = function() {
            this.div && null  == this.div.parentNode && this.getStageDelegateDiv().appendChild(this.div)
        }
        ,
        c.prototype._remove = function() {
            this._shape && this._shape.parent && this._shape.parent.removeChild(this._shape),
            this.div && this.div.parentNode && this.div.parentNode.removeChild(this.div)
        }
        ,
        c.prototype._addListeners = function() {
            this.inputElement && !this._hasListeners && (this._hasListeners = !0,
            this.inputElement.addEventListener("mousedown", this.callHandler),
            this.inputElement.addEventListener("touchstart", this.callHandler),
            this.inputElement.addEventListener("MSPointerDown", this.callHandler))
        }
        ,
        c.prototype._removeListeners = function() {
            this.inputElement && this._hasListeners && (this._hasListeners = !1,
            this.inputElement.removeEventListener("mousedown", this.callHandler),
            this.inputElement.removeEventListener("touchstart", this.callHandler),
            this.inputElement.removeEventListener("MSPointerDown", this.callHandler))
        }
        ,
        c.prototype.createInput = function() {
            var a = this._multiline ? "textarea" : "input";
            this._inputType != a && (this._inputType = a,
            null  != this.inputElement && (this._removeListeners(),
            this.div.removeChild(this.inputElement)),
            this._multiline ? (a = document.createElement("textarea"),
            a.style.resize = "none") : a = document.createElement("input"),
            this._styleInfoes = {},
            a.type = "text",
            this.inputElement = a,
            this.inputElement.value = "",
            this.div.appendChild(a),
            this._addListeners(),
            this.setElementStyle("width", "0px"),
            this.setElementStyle("border", "none"),
            this.setElementStyle("margin", "0"),
            this.setElementStyle("padding", "0"),
            this.setElementStyle("outline", "medium"),
            this.setElementStyle("verticalAlign", "top"),
            this.setElementStyle("wordBreak", "break-all"),
            this.setElementStyle("overflow", "hidden"))
        }
        ,
        c.prototype._open = function() {}
        ,
        c.prototype._setScale = function(c, d) {
            b.prototype._setScale.call(this, c, d);
            var e = a.StageDelegate.getInstance().getScaleX()
              , f = a.StageDelegate.getInstance().getScaleY();
            this.div.scale.x = e * c,
            this.div.scale.y = f * d,
            this.div.transforms()
        }
        ,
        c.prototype.changePosition = function(b, c) {
            var d = a.StageDelegate.getInstance().getScaleX()
              , e = a.StageDelegate.getInstance().getScaleY();
            this.div.position.x = b * d,
            this.div.position.y = c * e,
            this.div.transforms()
        }
        ,
        c.prototype.setStyles = function() {
            this.setElementStyle("fontStyle", this._italic ? "italic" : "normal"),
            this.setElementStyle("fontWeight", this._bold ? "bold" : "normal"),
            this.setElementStyle("textAlign", this._textAlign),
            this.setElementStyle("fontSize", this._size + "px"),
            this.setElementStyle("color", "#000000"),
            this.setElementStyle("width", this._width + "px"),
            this.setElementStyle("height", this._height + "px"),
            this.setElementStyle("display", "block")
        }
        ,
        c.prototype._show = function() {
            var b, c;
            a.MainContext.instance.stage._changeSizeDispatchFlag = !1,
            0 < this._maxChars ? this.inputElement.setAttribute("maxlength", this._maxChars) : this.inputElement.removeAttribute("maxlength"),
            this._isShow = !0,
            b = this._getText(),
            this.inputElement.value = b,
            c = this,
            this.inputElement.oninput = function() {
                c.textValue = c.inputElement.value,
                c.dispatchEvent(new a.Event("updateText"))
            }
            ,
            this.setStyles(),
            this.inputElement.focus(),
            this.inputElement.selectionStart = b.length,
            this.inputElement.selectionEnd = b.length,
            this._shape && null  == this._shape.parent && a.MainContext.instance.stage.addChild(this._shape)
        }
        ,
        c.prototype._hide = function() {
            if (a.MainContext.instance.stage._changeSizeDispatchFlag = !0,
            null  != this.inputElement) {
                this._isShow = !1,
                this.inputElement.oninput = function() {}
                ,
                this.setElementStyle("border", "none"),
                this.setElementStyle("display", "none"),
                this.inputElement.value = "",
                this.setElementStyle("width", "0px"),
                window.scrollTo(0, 0);
                var b = this;
                a.setTimeout(function() {
                    b.inputElement.blur(),
                    window.scrollTo(0, 0)
                }
                , this, 50),
                this._shape && this._shape.parent && this._shape.parent.removeChild(this._shape)
            }
        }
        ,
        c.prototype._getText = function() {
            return this.textValue || (this.textValue = ""),
            this.textValue
        }
        ,
        c.prototype._setText = function(a) {
            this.textValue = a,
            this.resetText()
        }
        ,
        c.prototype.resetText = function() {
            this.inputElement && (this.inputElement.value = this.textValue)
        }
        ,
        c.prototype._setWidth = function(a) {
            this._width = a
        }
        ,
        c.prototype._setHeight = function(a) {
            this._height = a
        }
        ,
        c.prototype.setElementStyle = function(a, b) {
            this.inputElement && this._styleInfoes[a] != b && (this.inputElement.style[a] = b,
            this._styleInfoes[a] = b)
        }
        ,
        c
    }
    (a.StageText);
    a.HTML5StageText = b,
    b.prototype.__class__ = "egret.HTML5StageText"
}
(egret || (egret = {})),
egret.StageText.create = function() {
    return new egret.HTML5StageText
}
,
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
GamePanel = function(a) {
    function b() {
        var b, c;
        a.call(this),
        b = new egret.Bitmap,
        b.texture = RES.getRes("game_bg"),
        b.width = Main.stageW,
        b.height = Main.stageH,
        this.addChild(b),
        b = new egret.Sprite,
        b.width = 290 * Main.sFactor,
        b.height = 100 * Main.sFactor,
        c = new egret.Bitmap,
        c.texture = RES.getRes("btn_time"),
        b.addChild(c),
        this.timer = new egret.TextField,
        this.timer.text = "60.0",
        this.timer.textColor = 16777215,
        this.timer.size = 68 * Main.sFactor,
        this.timer.fontFamily = "微软雅黑",
        this.timer.width = b.width,
        this.timer.textAlign = "center",
        this.timer.y = 15 * Main.sFactor,
        c = new egret.TextField,
        c.text = "s",
        c.textColor = 16777215,
        c.size = 48 * Main.sFactor,
        c.fontFamily = "微软雅黑",
        c.x = b.width - 40 * Main.sFactor,
        c.y = 35 * Main.sFactor,
        b.addChild(c),
        b.addChild(this.timer),
        b.x = 30 * Main.sFactor,
        b.y = 30 * Main.sFactor,
        this.addChild(b),
        this.btn_pause = new egret.Bitmap,
        this.btn_pause.texture = RES.getRes("btn_pause"),
        this.btn_pause.anchorX = this.btn_pause.anchorY = .5,
        this.btn_pause.y = 30 * Main.sFactor + this.btn_pause.width / 2,
        this.btn_pause.x = Main.stageW - 30 * Main.sFactor - this.btn_pause.width / 2,
        this.btn_pause.touchEnabled = !0,
        this.btn_pause.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.pauseGame, this),
        this.addChild(this.btn_pause),
        b = new egret.Sprite,
        b.width = 260 * Main.sFactor,
        b.height = 260 * Main.sFactor,
        c = new egret.Shape,
        c.graphics.beginFill(16777215, .6),
        c.graphics.drawCircle(0, 0, b.width / 2),
        c.graphics.endFill(),
        b.addChild(c),
        b.x = Main.stageW / 2,
        b.y = 356 * Main.sFactor + b.height / 2,
        this.score = new egret.BitmapText,
        this.score.spriteSheet = RES.getRes("number-export_fnt"),
        this.score.text = "0",
        this.score.x = -35 * Main.sFactor,
        this.score.y = -25 * Main.sFactor,
        this.score.scaleX = this.score.scaleY = Main.sFactor,
        b.addChild(this.score),
        this.addChild(b),
        this.hand = new egret.Bitmap,
        this.hand.texture = RES.getRes("hand"),
        this.hand.x = -100 * Main.sFactor,
        this.hand.y = .7 * Main.stageH,
        this.addChild(this.hand),
        this.dao = new egret.Bitmap,
        this.dao.texture = RES.getRes("dao"),
        this.dao.anchorX = this.dao.anchorY = .5,
        this.dao.x = 470 * Main.sFactor,
        this.dao.y = .813 * Main.stageH,
        this.dao.skewY = 0,
        this.addChild(this.dao),
        this.btn_click = new egret.Bitmap,
        this.btn_click.texture = RES.getRes("btn_cut"),
        this.btn_click.y = Main.stageH - this.btn_click.height - 22 * Main.sFactor,
        this.btn_click.x = Main.stageW / 2 - this.btn_click.width / 2,
        this.btn_click.touchEnabled = !0,
        this.addChild(this.btn_click),
        this.addEventListener("showOverPanel_win", this.showWinOverPanel, this),
        this.addEventListener("showOverPanel_fail", this.showFailOverPanel, this),
        this.fruit = new egret.Bitmap;
    }
    return __extends(b, a),
    b.prototype.pauseGame = function(a) {
        var b = this;
        a.target.touchEnabled = !1,
        this.btn_click.touchEnabled = !1,
        egret.Tween.get(a.target).to({
            scaleX: 1.1,
            scaleY: 1.1
        }, 80).wait(100).to({
            scaleX: 1,
            scaleY: 1
        }, 80).call(function() {
            b.dispatchEvent(new egret.Event("pauseGame"));
            var a = new PausePanel;
            a.addEventListener("continuous", b.continuous, b),
            a.addEventListener("backHome", b.backHome, b),
            a.addEventListener("refreshGame", b.refreshGame, b),
            b.addChild(a)
        }
        )
    }
    ,
    b.prototype.continuous = function(a) {
        a.target.removeEventListener("continuous", this.continuous, this),
        this.removeChild(a.target),
        this.btn_click.touchEnabled = !0,
        this.btn_pause.touchEnabled = !0,
        this.dispatchEvent(new egret.Event("continuousGame"))
    }
    ,
    b.prototype.showWinOverPanel = function() {
        this.removeEventListener("showWinOverPanel", this.showWinOverPanel, this),
        this.btn_pause.touchEnabled = !1,
        this.btn_click.touchEnabled = !1;
        var a = new OverPanel("win");
        a.addEventListener("restartDoGame", this.restartDoGame, this),
        this.addChild(a)
    }
    ,
    b.prototype.showFailOverPanel = function() {
        this.removeEventListener("showFailOverPanel", this.showWinOverPanel, this),
        this.btn_pause.touchEnabled = !1,
        this.btn_click.touchEnabled = !1;
        var a = new OverPanel("fail");
        a.addEventListener("restartDoGame", this.restartDoGame, this),
        this.addChild(a)
    }
    ,
    b.prototype.backHome = function(a) {
        a.target.removeEventListener("backHome", this.backHome, this),
        this.removeChildren(),
        a = new StartPanel,
        this.addChild(a)
    }
    ,
    b.prototype.refreshGame = function() {
        this.removeChildren(),
        Logic.score = 0,
        this.timer.text = "60";
        var a = new Logic;
        this.addChild(a)
    }
    ,
    b.prototype.restartDoGame = function() {
        this.removeChildren();
        var a = new StartPanel;
        this.addChild(a)
    }
    ,
    b
}
(egret.DisplayObjectContainer),
GamePanel.prototype.__class__ = "GamePanel",
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
StartPanel = function(a) {
    function b() {
        var b, c, d, e, f;
        a.call(this),
        b = new egret.Bitmap,
        b.texture = RES.getRes("start_bg"),
        b.width = Main.stageW,
        b.height = Main.stageH,
        this.addChild(b),
        c = new egret.Bitmap,
        c.texture = RES.getRes("title"),
        c.x = Main.stageW / 2 - c.width / 2,
        c.y = 76 * Main.sFactor,
        this.addChild(c),
        b = new egret.Sprite,
        b.width = 500 * Main.sFactor,
        b.height = 360 * Main.sFactor,
        d = new egret.Shape,
        d.graphics.beginFill(16777215, 1),
        d.graphics.drawRoundRect(0, 0, b.width, b.height, 20),
        d.graphics.endFill(),
        b.addChild(d),
        d = new egret.Bitmap,
        d.texture = RES.getRes("tieshi"),
        d.y = 22 * Main.sFactor,
        b.addChild(d),
        e = new egret.TextField,
        e.text = "连续快速点击按钮,以最快的速度\n切完菜",
        e.fontFamily = "微软雅黑",
        e.size = 30 * Main.sFactor,
        e.textColor = 15687986,
        e.x = 40 * Main.sFactor,
        e.y = 60 * Main.sFactor + d.height,
        b.addChild(e),
        f = new egret.TextField,
        f.text = "偷偷教你一招,用两只手指,唰唰唰,\n中华小当家切菜陈浩南削人的速度都\n没你快,感谢你对黑暗料理界的杰出贡\n献",
        f.fontFamily = "微软雅黑",
        f.size = 24 * Main.sFactor,
        f.textColor = 10263708,
        f.x = 40 * Main.sFactor,
        f.y = 82 * Main.sFactor + d.height + e.height,
        b.addChild(f),
        b.x = Main.stageW / 2 - b.width / 2,
        b.y = c.y + c.height + 85 * Main.sFactor,
        this.addChild(b),
        c = new egret.Bitmap,
        d = new egret.Bitmap,
        c.texture = RES.getRes("btn_start"),
        d.texture = RES.getRes("btn_more"),
        c.anchorX = c.anchorY = .5,
        d.anchorX = d.anchorY = .5,
        c.x = d.x = Main.stageW / 2,
        c.touchEnabled = d.touchEnabled = !0,
        c.y = b.y + b.height + c.height / 2 + 64 * Main.sFactor,
        d.y = c.y + c.height + 12 * Main.sFactor,
        c.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onLoadGame, this),
        d.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onLoadMorGame, this),
        this.addChild(c),
        this.addChild(d),
        d.visible = !window.haveShare && window.haveGamelist ? !0 : !1
    }
    return __extends(b, a),
    b.prototype.onLoadGame = function(a) {
        var b = this;
        egret.Tween.get(a.target).to({
            scaleX: 1.1,
            scaleY: 1.1
        }, 80).wait(100).to({
            scaleX: 1,
            scaleY: 1
        }, 80).call(function() {
            b.removeChildren();
            var a = new Logic;
            b.addChild(a),
            window.cb_start()
        }
        )
    }
    ,
    b.prototype.onLoadMorGame = function() {
        window.cb_more()
    }
    ,
    b
}
(egret.DisplayObjectContainer),
StartPanel.prototype.__class__ = "StartPanel",
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
Main = function(a) {
    function b() {
        a.call(this),
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this),
        window.startGame = this.startGame,
        window.context = this
    }
    return __extends(b, a),
    b.prototype.onAddToStage = function() {
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this),
        /iPhone/i.test(navigator.userAgent) ? (RES.loadConfig("resource/assets/640/resource.json", "resource/assets/640/"),
        b.sFactor = 1) : (RES.loadConfig("resource/assets/320/resource.json", "resource/assets/320/"),
        b.sFactor = .5)
    }
    ,
    b.prototype.onConfigComplete = function() {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this),
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this),
        RES.loadGroup("preload")
    }
    ,
    b.prototype.onResourceLoadComplete = function(a) {
        "preload" == a.groupName && (b.stageW = this.stage.stageWidth,
        b.stageH = this.stage.stageHeight,
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this),
        this.createGameScene())
    }
    ,
    b.prototype.createGameScene = function() {
        var a = new StartPanel;
        this.addChild(a),
        window.cb_finishload()
    }
    ,
    b.prototype.startGame = function() {
        this.removeChildren(),
        this.createGameScene()
    }
    ,
    b
}
(egret.DisplayObjectContainer),
Main.prototype.__class__ = "Main",
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
Greens = function(a) {
    function b(b) {
        a.call(this);
        var c = new egret.Bitmap;
        return c.texture = RES.getRes(b),
        c
    }
    return __extends(b, a),
    b
}
(egret.Bitmap),
Greens.prototype.__class__ = "Greens",
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
Logic = function(a) {
    function b() {
        a.call(this),
        this.num = 0,
        this.eggplant_item = this.cucumber_item = this.long_onion = this.short_onion = this.long_carrot = this.short_carrot = this.whenLoadGame = !1,
        this.limit_value = 0,
        this.fragments = [],
        this.dao_x = this.dao.x,
        this.btn_click.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.fuckIt, this),
        this.btn_click.addEventListener(egret.TouchEvent.TOUCH_END, this.moveIt, this),
        this.time = new egret.Timer(500,1),
        this.time.addEventListener(egret.TimerEvent.TIMER, this.tryCatch, this),
        this.calcTime(),
        this.whenLoadGame = !0,
        a.prototype.addEventListener.call(this, "pauseGame", this.pauseGameInLogin, this),
        a.prototype.addEventListener.call(this, "continuousGame", this.continuousGameInLogin, this)
    }
    return __extends(b, a),
    b.prototype.pauseGameInLogin = function() {
        this.gameTimer.stop()
    }
    ,
    b.prototype.continuousGameInLogin = function() {
        this.gameTimer.start()
    }
    ,
    b.prototype.monitorGame = function() {
        this.whenLoadGame && (this.whenLoadGame = !1,
        this.discoverGreens())
    }
    ,
    b.prototype.tryCatch = function() {
    	if(this.num == this.limit_value)
    	{ 
    		b.score += 1;
    		this.score.text = String(b.score);
    		sendCurrentScore(b.score);
    		window.playSound();
    		this.refresh();
    	}
    	else
    	{
    		if(this.num > this.limit_value)
    		{
    			window.playPainSound();
    			this.twinkle();
    		}
    	}
    }
    ,
    b.prototype.fuckIt = function() {
        this.num += 1,
        this.fragment(this.num)
    }
    ,
    b.prototype.fragment = function(a) {
        this.short_carrot && this.showFragment("short_carrot", a, 3),
        this.long_carrot && this.showFragment("long_carrot", a, 7),
        this.eggplant_item && this.showFragment("eggplant", a, 6),
        this.short_onion && this.showFragment("short_onion", a, 9),
        this.cucumber_item && this.showFragment("cucumber", a, 13),
        this.long_onion && this.showFragment("long_onion", a, 17)
    }
    ,
    b.prototype.showFragment = function(a, b, c) {
        if ("short_carrot" == a)
            switch (b) {
            case 1:
                this.greensFragment = new Greens("cut_carrotwei"),
                this.rect_1.width -= 30 * Main.sFactor,
                this.dao.x -= 30 * Main.sFactor,
                this.greensFragment.x = this.dao.x;
                break;
            case 2:
                this.greensFragment = new Greens("cut_carrot"),
                this.rect_1.width -= 45 * Main.sFactor,
                this.dao.x -= 45 * Main.sFactor,
                this.greensFragment.scaleX = this.greensFragment.scaleY = .8,
                this.greensFragment.x = this.dao.x - 10 * Main.sFactor;
                break;
            case 3:
                this.rect_1.width -= 65 * Main.sFactor,
                this.dao.x -= 65 * Main.sFactor,
                this.greensFragment = new Greens("cut_carrot"),
                this.greensFragment.x = this.dao.x - 10 * Main.sFactor;
                break;
            case 4:
                this.dao.x -= 65 * Main.sFactor,
                this.btn_click.touchEnabled = !1
            }
        if ("short_onion" == a)
            switch (b) {
            case 1:
                this.greensFragment = new Greens("cut_onionwei"),
                this.rect_1.width -= 15 * Main.sFactor,
                this.dao.x -= 15 * Main.sFactor,
                this.greensFragment.x = this.dao.x;
                break;
            case 2:
                this.greensFragment = new Greens("cut_onionwei"),
                this.rect_1.width -= 15 * Main.sFactor,
                this.dao.x -= 15 * Main.sFactor,
                this.greensFragment.x = this.dao.x;
                break;
            case 3:
                this.greensFragment = new Greens("cut_onionwei"),
                this.rect_1.width -= 15 * Main.sFactor,
                this.dao.x -= 15 * Main.sFactor,
                this.greensFragment.x = this.dao.x;
                break;
            case 4:
                this.greensFragment = new Greens("cut_onionwei"),
                this.rect_1.width -= 15 * Main.sFactor,
                this.dao.x -= 15 * Main.sFactor,
                this.greensFragment.x = this.dao.x;
                break;
            case 5:
                this.greensFragment = new Greens("cut_onionbai"),
                this.rect_1.width -= 19 * Main.sFactor,
                this.dao.x -= 19 * Main.sFactor,
                this.greensFragment.x = this.dao.x;
                break;
            case 6:
                this.greensFragment = new Greens("cut_onionbai"),
                this.rect_1.width -= 19 * Main.sFactor,
                this.dao.x -= 19 * Main.sFactor,
                this.greensFragment.x = this.dao.x;
                break;
            case 7:
                this.greensFragment = new Greens("cut_onionbai"),
                this.rect_1.width -= 19 * Main.sFactor,
                this.dao.x -= 19 * Main.sFactor,
                this.greensFragment.x = this.dao.x;
                break;
            case 8:
                this.greensFragment = new Greens("cut_onionbai"),
                this.rect_1.width -= 19 * Main.sFactor,
                this.dao.x -= 19 * Main.sFactor,
                this.greensFragment.x = this.dao.x;
                break;
            case 9:
                this.greensFragment = new Greens("cut_onionbai"),
                this.rect_1.width -= 19 * Main.sFactor,
                this.dao.x -= 19 * Main.sFactor,
                this.greensFragment.x = this.dao.x;
                break;
            case 10:
                this.dao.x -= 25 * Main.sFactor,
                this.btn_click.touchEnabled = !1
            }
        if ("eggplant" == a && (7 > b ? (this.greensFragment = new Greens("cut_eggplant"),
        this.greensFragment.scaleX = this.greensFragment.scaleY = 1.5,
        this.rect_1.width -= 26 * Main.sFactor,
        this.dao.x -= 26 * Main.sFactor,
        this.greensFragment.x = this.dao.x - 5 * Main.sFactor) : (this.dao.x -= 35 * Main.sFactor,
        this.btn_click.touchEnabled = !1)),
        "cucumber" == a && (14 > b ? (this.greensFragment = new Greens("cut_cucumber"),
        this.rect_1.width -= 13 * Main.sFactor,
        this.dao.x -= 13 * Main.sFactor,
        this.greensFragment.x = this.dao.x - 10 * Main.sFactor) : (this.dao.x -= 20 * Main.sFactor,
        this.btn_click.touchEnabled = !1)),
        "long_carrot" == a)
            switch (b) {
            case 1:
                this.greensFragment = new Greens("cut_carrot"),
                this.rect_1.width -= 22 * Main.sFactor,
                this.dao.x -= 22 * Main.sFactor,
                this.greensFragment.scaleX = this.greensFragment.scaleY = .5,
                this.greensFragment.x = this.dao.x - 20 * Main.sFactor;
                break;
            case 2:
                this.greensFragment = new Greens("cut_carrot"),
                this.rect_1.width -= 22 * Main.sFactor,
                this.dao.x -= 22 * Main.sFactor,
                this.greensFragment.scaleX = this.greensFragment.scaleY = .6,
                this.greensFragment.x = this.dao.x - 20 * Main.sFactor;
                break;
            case 3:
                this.greensFragment = new Greens("cut_carrot"),
                this.rect_1.width -= 22 * Main.sFactor,
                this.dao.x -= 22 * Main.sFactor,
                this.greensFragment.scaleX = this.greensFragment.scaleY = .7,
                this.greensFragment.x = this.dao.x - 20 * Main.sFactor;
                break;
            case 4:
                this.greensFragment = new Greens("cut_carrot"),
                this.rect_1.width -= 22 * Main.sFactor,
                this.dao.x -= 22 * Main.sFactor,
                this.greensFragment.scaleX = this.greensFragment.scaleY = .8,
                this.greensFragment.x = this.dao.x - 20 * Main.sFactor;
                break;
            case 5:
                this.greensFragment = new Greens("cut_carrot"),
                this.rect_1.width -= 22 * Main.sFactor,
                this.dao.x -= 22 * Main.sFactor,
                this.greensFragment.scaleX = this.greensFragment.scaleY = .9,
                this.greensFragment.x = this.dao.x - 20 * Main.sFactor;
                break;
            case 6:
                this.greensFragment = new Greens("cut_carrot"),
                this.rect_1.width -= 22 * Main.sFactor,
                this.dao.x -= 22 * Main.sFactor,
                this.greensFragment.scaleX = this.greensFragment.scaleY = 1,
                this.greensFragment.x = this.dao.x - 20 * Main.sFactor;
                break;
            case 7:
                this.greensFragment = new Greens("cut_carrot"),
                this.rect_1.width -= 22 * Main.sFactor,
                this.dao.x -= 22 * Main.sFactor,
                this.greensFragment.scaleX = this.greensFragment.scaleY = 1.1,
                this.greensFragment.x = this.dao.x - 20 * Main.sFactor;
                break;
            case 8:
                this.dao.x -= 45 * Main.sFactor,
                this.btn_click.touchEnabled = !1
            }
        "long_onion" == a && (9 > b ? (this.greensFragment = new Greens("cut_onionwei"),
        this.rect_1.width -= 10 * Main.sFactor,
        this.dao.x -= 10 * Main.sFactor,
        this.greensFragment.x = this.dao.x) : 18 > b ? (this.greensFragment = new Greens("cut_onionbai"),
        this.rect_1.width -= 8 * Main.sFactor,
        this.dao.x -= 8 * Main.sFactor,
        this.greensFragment.x = this.dao.x) : (this.dao.x -= 25 * Main.sFactor,
        this.btn_click.touchEnabled = !1)),
        this.greensFragment.y = this.fruit.y,
        this.addChildAt(this.greensFragment, this.numChildren - 2),
        this.fragments.push(this.greensFragment),
        this.dao.skewY = 45,
        b == c && (this.limit_value = c,
        this.time.start())
    }
    ,
    b.prototype.calcTime = function() {
        this.timeCount = 60,
        this.gameTimer = new egret.Timer(100,610),
        this.gameTimer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this),
        this.gameTimer.start()
    }
    ,
    b.prototype.onTimer = function() {
        0 < this.timeCount && (this.timeCount -= .1),
        this.timer.text = this.timeCount.toFixed(1),
        0 >= this.timeCount && (this.gameTimer.stop(),
        this.gameTimer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this),
        this.timeCount = 0,
        this.timer.text = this.timeCount.toFixed(1),
        this.popPupWindow(!0)),
        this.addEventListener(egret.Event.ENTER_FRAME, this.monitorGame, this)
    }
    ,
    b.prototype.moveIt = function() {
        this.dao.skewY = 0
    }
    ,
    b.prototype.refresh = function() {
        for (var a = 0, b = this.fragments.length; b > a; a++)
            this.removeChild(this.fragments[a]);
        this.fragments = [],
        this.dao.x = this.dao_x,
        this.limit_value = this.num = 0,
        this.eggplant_item = this.cucumber_item = this.long_onion = this.short_onion = this.long_carrot = this.short_carrot = !1,
        this.discoverGreens()
    }
    ,
    b.prototype.discoverGreens = function() {
        var a = this.timeCount.toFixed(1);
        a >= 40 ? this.period_mei() : a >= 20 ? this.period_ri() : this.period_Q()
    }
    ,
    b.prototype.popPupWindow = function(b) {
        b ? a.prototype.dispatchEvent.call(this, new egret.Event("showOverPanel_win")) : a.prototype.dispatchEvent.call(this, new egret.Event("showOverPanel_fail"))
    }
    ,
    b.prototype.period_mei = function() {
        var a = this.getProbability();
        .35 >= a ? (this.fruit.texture = RES.getRes("shortcarrot"),
        this.fruit.x = 250 * Main.sFactor,
        this.fruit.y = .72 * Main.stageH,
        this.short_carrot = !0) : a > .35 && .6 >= a ? (this.fruit.texture = RES.getRes("eggplant"),
        this.fruit.x = 250 * Main.sFactor,
        this.fruit.y = .72 * Main.stageH - 20 * Main.sFactor,
        this.eggplant_item = !0) : a > .6 && .85 >= a ? (this.fruit.texture = RES.getRes("carrot"),
        this.fruit.x = 250 * Main.sFactor - 50 * Main.sFactor,
        this.fruit.y = .72 * Main.stageH,
        this.long_carrot = !0) : a > .85 && .95 >= a ? (this.fruit.texture = RES.getRes("shortonion1"),
        this.fruit.x = 250 * Main.sFactor + 10 * Main.sFactor,
        this.fruit.y = .72 * Main.stageH + 22 * Main.sFactor,
        this.short_onion = !0) : a > .95 && (this.fruit.texture = RES.getRes("cucumber"),
        this.fruit.x = 250 * Main.sFactor - 70 * Main.sFactor,
        this.fruit.y = .72 * Main.stageH + 12 * Main.sFactor,
        this.cucumber_item = !0),
        this.addChildAt(this.fruit, this.numChildren - 4),
        this.setMask()
    }
    ,
    b.prototype.period_ri = function() {
        var a = this.getProbability();
        .05 >= a ? (this.fruit.texture = RES.getRes("shortcarrot"),
        this.fruit.x = 250 * Main.sFactor,
        this.fruit.y = .72 * Main.stageH,
        this.short_carrot = !0) : a > .05 && .15 >= a ? (this.fruit.texture = RES.getRes("eggplant"),
        this.fruit.x = 250 * Main.sFactor,
        this.fruit.y = .72 * Main.stageH - 20 * Main.sFactor,
        this.eggplant_item = !0) : a > .15 && .4 >= a ? (this.fruit.texture = RES.getRes("carrot"),
        this.fruit.x = 250 * Main.sFactor - 50 * Main.sFactor,
        this.fruit.y = .72 * Main.stageH,
        this.long_carrot = !0) : a > .4 && .7 >= a ? (this.fruit.texture = RES.getRes("shortonion1"),
        this.fruit.x = 250 * Main.sFactor + 10 * Main.sFactor,
        this.fruit.y = .72 * Main.stageH + 22 * Main.sFactor,
        this.short_onion = !0) : a > .7 && .9 >= a ? (this.fruit.texture = RES.getRes("cucumber"),
        this.fruit.x = 250 * Main.sFactor - 70 * Main.sFactor,
        this.fruit.y = .72 * Main.stageH + 12 * Main.sFactor,
        this.cucumber_item = !0) : a > .9 && (this.fruit.texture = RES.getRes("onion1"),
        this.fruit.x = 250 * Main.sFactor - 130 * Main.sFactor,
        this.fruit.y = .72 * Main.stageH,
        this.long_onion = !0),
        this.addChildAt(this.fruit, this.numChildren - 4),
        this.setMask()
    }
    ,
    b.prototype.period_Q = function() {
        var a = this.getProbability();
        .05 >= a ? (this.fruit.texture = RES.getRes("eggplant"),
        this.fruit.x = 250 * Main.sFactor,
        this.fruit.y = .72 * Main.stageH - 20 * Main.sFactor,
        this.eggplant_item = !0) : a > .05 && .15 >= a ? (this.fruit.texture = RES.getRes("carrot"),
        this.fruit.x = 250 * Main.sFactor - 50 * Main.sFactor,
        this.fruit.y = .72 * Main.stageH,
        this.long_carrot = !0) : a > .15 && .3 >= a ? (this.fruit.texture = RES.getRes("shortonion1"),
        this.fruit.x = 250 * Main.sFactor + 10 * Main.sFactor,
        this.fruit.y = .72 * Main.stageH + 22 * Main.sFactor,
        this.short_onion = !0) : a > .3 && .6 >= a ? (this.fruit.texture = RES.getRes("cucumber"),
        this.fruit.x = 250 * Main.sFactor - 70 * Main.sFactor,
        this.fruit.y = .72 * Main.stageH + 12 * Main.sFactor,
        this.cucumber_item = !0) : a > .6 && (this.fruit.texture = RES.getRes("onion1"),
        this.fruit.x = 250 * Main.sFactor - 130 * Main.sFactor,
        this.fruit.y = .72 * Main.stageH,
        this.long_onion = !0),
        this.addChildAt(this.fruit, this.numChildren - 4),
        this.setMask()
    }
    ,
    b.prototype.getProbability = function() {
        return Number(Math.random().toFixed(2))
    }
    ,
    b.prototype.setMask = function() {
        this.rect_1 = new egret.Rectangle(0,0,this.fruit.width,this.fruit.height),
        this.fruit.mask = this.rect_1
    }
    ,
    b.prototype.twinkle = function() {
        var b, c, a = this;
        this.gameTimer.stop(),
        this.time.removeEventListener(egret.TimerEvent.TIMER, this.tryCatch, this),
        this.btn_click.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.fuckIt, this),
        this.btn_click.removeEventListener(egret.TouchEvent.TOUCH_END, this.moveIt, this),
        b = new egret.Shape,
        b.graphics.beginFill(16460806, 1),
        b.graphics.drawRect(0, 0, Main.stageW, Main.stageH),
        b.graphics.endFill(),
        b.width = Main.stageW,
        b.height = Main.stageH,
        b.alpha = 0,
        this.addChildAt(b, this.numChildren - 1),
        c = new egret.Shape,
        c.graphics.beginFill(16777215, 1),
        c.graphics.drawRect(0, 0, Main.stageW, Main.stageH),
        c.graphics.endFill(),
        c.width = Main.stageW,
        c.height = Main.stageH,
        c.alpha = 0,
        this.addChildAt(c, this.numChildren - 2),
        egret.Tween.get(b).wait(50).to({
            alpha: 1
        }, 80).to({
            alpha: 0
        }, 80).call(function() {
            egret.Tween.get(c).wait(50).to({
                alpha: 1
            }, 80).to({
                alpha: 0
            }, 80).call(function() {
                egret.Tween.get(b).wait(50).to({
                    alpha: 1
                }, 80).to({
                    alpha: 0
                }, 80).call(function() {
                    egret.Tween.get(c).wait(50).to({
                        alpha: 1
                    }, 80).to({
                        alpha: 0
                    }, 80).call(function() {
                        egret.Tween.get(b).wait(50).to({
                            alpha: 1
                        }, 80).to({
                            alpha: 0
                        }, 80).call(function() {
                            egret.Tween.get(c).wait(50).to({
                                alpha: 1
                            }, 80).to({
                                alpha: 0
                            }, 80).call(function() {
                                a.popPupWindow(!1)
                            }
                            )
                        }
                        )
                    }
                    )
                }
                )
            }
            )
        }
        )
    }
    ,
    b.score = 0,
    b
}
(GamePanel),
Logic.prototype.__class__ = "Logic",
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
OverPanel = function(a) {
    function b(b) {
        var c, d;
        a.call(this),
        c = new egret.Shape,
        c.graphics.beginFill(0, .5),
        c.graphics.drawRect(0, 0, Main.stageW, Main.stageH),
        c.graphics.endFill(),
        this.addChild(c),
        c = this.show_spite(b),
        this.addChild(c),
        d = new egret.Bitmap,
        d.texture = RES.getRes(b),
        d.x = Main.stageW / 2 - d.width / 2,
        d.y = c.y - d.height / 2,
        this.addChild(d)
    }
    return __extends(b, a),
    b.prototype.show_spite = function(a) {
        var c, d, b = new egret.Sprite;
        return b.width = 480 * Main.sFactor,
        b.height = 460 * Main.sFactor + 50,
        b.x = Main.stageW / 2 - b.width / 2,
        b.y = 310 * Main.sFactor,
        c = new egret.Shape,
        c.graphics.beginFill(16777215, 1),
        c.graphics.drawRoundRect(0, 0, b.width, b.height, 20),
        c.graphics.endFill(),
        b.addChild(c),
        d = new egret.TextField,
        d.text = "得分:",
        d.fontFamily = "微软雅黑",
        d.size = 36 * Main.sFactor,
        d.x = 120 * Main.sFactor,
        d.y = 110 * Main.sFactor,
        d.textColor = 3883079,
        b.addChild(d),
        this.score = new egret.TextField,
        this.score.text = Logic.score + "",
        this.score.fontFamily = "微软雅黑",
        this.score.size = 80 * Main.sFactor,
        this.score.x = 240 * Main.sFactor,
        this.score.y = 70 * Main.sFactor,
        this.score.textColor = "win" == a ? 16741446 : 8882055,
        b.addChild(this.score),
        c = new egret.TextField,
        c.text = "    切到手了!怎么那么笨呢?不要切\n多余次数!透明胶拿去缠上继续开工!",
        c.fontFamily = "微软雅黑",
        c.size = 24 * Main.sFactor,
        c.textColor = 8882055,
        c.x = 40 * Main.sFactor,
        c.y = d.y + d.height + 30 * Main.sFactor,
        b.addChild(c),
        c.visible = "win" == a ? !1 : !0,
        a = new egret.Sprite,
        a.width = 326 * Main.sFactor,
        a.height = 84 * Main.sFactor,
        this.restart = new egret.Shape,
        this.restart.graphics.beginFill(1682137, 1),
        this.restart.graphics.drawRoundRect(0, 0, a.width, a.height, 15),
        this.restart.graphics.endFill(),
        a.addChild(this.restart),
        d = new egret.TextField,
        d.text = "重新挑战",
        d.textColor = 16777215,
        d.fontFamily = "微软雅黑",
        d.size = 34 * Main.sFactor,
        d.width = a.width,
        d.textAlign = "center",
        d.y = 25 * Main.sFactor,
        a.addChild(d),
        a.anchorX = a.anchorY = .5,
        a.x = b.width / 2,
        a.y = c.y + c.height + a.height / 2 + 30 * Main.sFactor,
        a.touchEnabled = !0,
        a.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.restartDoGame, this),
        b.addChild(a),
        c = new egret.Sprite,
        c.width = 326 * Main.sFactor,
        c.height = 84 * Main.sFactor,
        this.share = new egret.Shape,
        this.share.graphics.beginFill(6793819, 1),
        this.share.graphics.drawRoundRect(0, 0, c.width, c.height, 15),
        this.share.graphics.endFill(),
        c.addChild(this.share),
        d = new egret.TextField,
        d.text = "分享战绩",
        d.textColor = 16777215,
        d.fontFamily = "微软雅黑",
        d.size = 34 * Main.sFactor,
        d.width = c.width,
        d.textAlign = "center",
        d.y = 25 * Main.sFactor,
        c.addChild(d),
        c.anchorX = c.anchorY = .5,
        c.x = b.width / 2,
        c.y = a.y + a.height + 10 * Main.sFactor,
        c.touchEnabled = !0,
        c.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.show_share, this),
        b.addChild(c),
        c.visible = 1,

        c = new egret.Sprite,
        c.width = 326 * Main.sFactor,
        c.height = 84 * Main.sFactor,
        this.moreGame = new egret.Shape,
        this.moreGame.graphics.beginFill(1682137, 1),
        this.moreGame.graphics.drawRoundRect(0, 0, c.width, c.height, 15),
        this.moreGame.graphics.endFill(),
        c.addChild(this.moreGame),
        d = new egret.TextField,
        d.text = "更多游戏",
        d.textColor = 16777215,
        d.fontFamily = "微软雅黑",
        d.size = 34 * Main.sFactor,
        d.width = c.width,
        d.textAlign = "center",
        d.y = 25 * Main.sFactor,
        c.addChild(d),
        c.anchorX = c.anchorY = .5,
        c.x = b.width / 2,
        c.y = a.y + a.height + 105 * Main.sFactor,
        c.touchEnabled = !0,
        c.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.show_more, this),
        b.addChild(c),
        c.visible = 1,

        Logic.score = 0,
        window.cb_gameover(Number(this.score.text)),
        b
    }
    ,
    b.prototype.show_share = function(a) {
        egret.Tween.get(a.target).to({
            scaleX: .9,
            scaleY: .9
        }, 80).wait(100).to({
            scaleX: 1,
            scaleY: 1
        }, 80).call(function() {
           window.parent.shell && window.parent.shell.share();
        }
        )
    }
    ,
    b.prototype.show_more = function(a) {
        window.parent.shell && window.parent.shell.moreGame();
    }
    ,
    b.prototype.close = function(a) {
        a.target.touchEnabled = !1,
        this.sharePopup.visible = !1
    }
    ,
    b.prototype.restartDoGame = function(a) {
        var b = this;
        a.target.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.restartDoGame, this),
        egret.Tween.get(a.target).to({
            scaleX: .9,
            scaleY: .9
        }, 80).wait(100).to({
            scaleX: 1,
            scaleY: 1
        }, 80).call(function() {
            window.cb_restart(),
            b.dispatchEvent(new egret.Event("restartDoGame"))
        }
        )
    }
    ,
    b
}
(egret.DisplayObjectContainer),
OverPanel.prototype.__class__ = "OverPanel",
__extends = this.__extends || function(a, b) {
    function c() {
        this.constructor = a
    }
    for (var d in b)
        b.hasOwnProperty(d) && (a[d] = b[d]);
    c.prototype = b.prototype,
    a.prototype = new c
}
,
PausePanel = function(a) {
    function b() {
        var c, b = this;
        a.call(this),
        c = new egret.Shape,
        c.graphics.beginFill(0, .7),
        c.graphics.drawRect(0, 0, Main.stageW, Main.stageH),
        c.graphics.endFill(),
        this.addChild(c),
        this.continuous = new egret.Bitmap,
        this.resetGame = new egret.Bitmap,
        this.backHome = new egret.Bitmap,
        this.continuous.texture = RES.getRes("btn_continue"),
        this.resetGame.texture = RES.getRes("btn_again"),
        this.backHome.texture = RES.getRes("btn_back"),
        this.continuous.anchorX = this.continuous.anchorY = .5,
        this.resetGame.anchorX = this.resetGame.anchorY = .5,
        this.backHome.anchorX = this.backHome.anchorY = .5,
        this.continuous.x = this.resetGame.x = this.backHome.x = Main.stageW / 2,
        this.continuous.touchEnabled = this.resetGame.touchEnabled = this.backHome.touchEnabled = !0,
        this.continuous.y = 356 * Main.sFactor + this.continuous.height / 2,
        this.resetGame.y = this.continuous.y + this.continuous.height + 20 * Main.sFactor,
        this.backHome.y = this.resetGame.y + this.resetGame.height + 20 * Main.sFactor,
        this.continuous.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(a) {
            egret.Tween.get(a.target).to({
                scaleX: .9,
                scaleY: .9
            }, 80).wait(100).to({
                scaleX: 1,
                scaleY: 1
            }, 80).call(function() {
                b.dispatchEvent(new egret.Event("continuous"))
            }
            )
        }
        , this),
        this.resetGame.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(a) {
            egret.Tween.get(a.target).to({
                scaleX: .9,
                scaleY: .9
            }, 80).wait(100).to({
                scaleX: 1,
                scaleY: 1
            }, 80).call(function() {
                b.dispatchEvent(new egret.Event("refreshGame"))
            }
            )
        }
        , this),
        this.backHome.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function(a) {
            egret.Tween.get(a.target).to({
                scaleX: .9,
                scaleY: .9
            }, 80).wait(100).to({
                scaleX: 1,
                scaleY: 1
            }, 80).call(function() {
                b.dispatchEvent(new egret.Event("backHome"))
            }
            )
        }
        , this),
        this.addChild(this.continuous),
        this.addChild(this.resetGame),
        this.addChild(this.backHome)
    }
    return __extends(b, a),
    b
}
(egret.DisplayObjectContainer),
PausePanel.prototype.__class__ = "PausePanel";
