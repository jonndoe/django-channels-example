!function (e) {
    var t = {};

    function n(r) {
        if (t[r]) return t[r].exports;
        var o = t[r] = {i: r, l: !1, exports: {}};
        return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
    }

    n.m = e, n.c = t, n.d = function (e, t, r) {
        n.o(e, t) || Object.defineProperty(e, t, {enumerable: !0, get: r})
    }, n.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
    }, n.t = function (e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var r = Object.create(null);
        if (n.r(r), Object.defineProperty(r, "default", {
            enumerable: !0,
            value: e
        }), 2 & t && "string" != typeof e) for (var o in e) n.d(r, o, function (t) {
            return e[t]
        }.bind(null, o));
        return r
    }, n.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 1)
}([function (e, t, n) {
    !function (e) {
        "use strict";
        var t = {logger: self.console, WebSocket: self.WebSocket}, n = {
            log: function () {
                if (this.enabled) {
                    for (var e, n = arguments.length, r = Array(n), o = 0; o < n; o++) r[o] = arguments[o];
                    r.push(Date.now()), (e = t.logger).log.apply(e, ["[ActionCable]"].concat(r))
                }
            }
        }, r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
            return typeof e
        } : function (e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }, o = function (e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }, i = function () {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                }
            }

            return function (t, n, r) {
                return n && e(t.prototype, n), r && e(t, r), t
            }
        }(), s = function () {
            return (new Date).getTime()
        }, c = function (e) {
            return (s() - e) / 1e3
        }, a = function () {
            function e(t) {
                o(this, e), this.visibilityDidChange = this.visibilityDidChange.bind(this), this.connection = t, this.reconnectAttempts = 0
            }

            return e.prototype.start = function () {
                this.isRunning() || (this.startedAt = s(), delete this.stoppedAt, this.startPolling(), addEventListener("visibilitychange", this.visibilityDidChange), n.log("ConnectionMonitor started. pollInterval = " + this.getPollInterval() + " ms"))
            }, e.prototype.stop = function () {
                this.isRunning() && (this.stoppedAt = s(), this.stopPolling(), removeEventListener("visibilitychange", this.visibilityDidChange), n.log("ConnectionMonitor stopped"))
            }, e.prototype.isRunning = function () {
                return this.startedAt && !this.stoppedAt
            }, e.prototype.recordPing = function () {
                this.pingedAt = s()
            }, e.prototype.recordConnect = function () {
                this.reconnectAttempts = 0, this.recordPing(), delete this.disconnectedAt, n.log("ConnectionMonitor recorded connect")
            }, e.prototype.recordDisconnect = function () {
                this.disconnectedAt = s(), n.log("ConnectionMonitor recorded disconnect")
            }, e.prototype.startPolling = function () {
                this.stopPolling(), this.poll()
            }, e.prototype.stopPolling = function () {
                clearTimeout(this.pollTimeout)
            }, e.prototype.poll = function () {
                var e = this;
                this.pollTimeout = setTimeout((function () {
                    e.reconnectIfStale(), e.poll()
                }), this.getPollInterval())
            }, e.prototype.getPollInterval = function () {
                var e = this.constructor.pollInterval, t = e.min, n = e.max,
                    r = e.multiplier * Math.log(this.reconnectAttempts + 1);
                return Math.round(1e3 * function (e, t, n) {
                    return Math.max(t, Math.min(n, e))
                }(r, t, n))
            }, e.prototype.reconnectIfStale = function () {
                this.connectionIsStale() && (n.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + this.getPollInterval() + " ms, time disconnected = " + c(this.disconnectedAt) + " s, stale threshold = " + this.constructor.staleThreshold + " s"), this.reconnectAttempts++, this.disconnectedRecently() ? n.log("ConnectionMonitor skipping reopening recent disconnect") : (n.log("ConnectionMonitor reopening"), this.connection.reopen()))
            }, e.prototype.connectionIsStale = function () {
                return c(this.pingedAt ? this.pingedAt : this.startedAt) > this.constructor.staleThreshold
            }, e.prototype.disconnectedRecently = function () {
                return this.disconnectedAt && c(this.disconnectedAt) < this.constructor.staleThreshold
            }, e.prototype.visibilityDidChange = function () {
                var e = this;
                "visible" === document.visibilityState && setTimeout((function () {
                    !e.connectionIsStale() && e.connection.isOpen() || (n.log("ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = " + document.visibilityState), e.connection.reopen())
                }), 200)
            }, e
        }();
        a.pollInterval = {min: 3, max: 30, multiplier: 5}, a.staleThreshold = 6;
        var l = {
            message_types: {
                welcome: "welcome",
                disconnect: "disconnect",
                ping: "ping",
                confirmation: "confirm_subscription",
                rejection: "reject_subscription"
            },
            disconnect_reasons: {
                unauthorized: "unauthorized",
                invalid_request: "invalid_request",
                server_restart: "server_restart"
            },
            default_mount_path: "/cable",
            protocols: ["actioncable-v1-json", "actioncable-unsupported"]
        }, u = l.message_types, f = l.protocols, d = f.slice(0, f.length - 1), p = [].indexOf, h = function () {
            function e(t) {
                o(this, e), this.open = this.open.bind(this), this.consumer = t, this.subscriptions = this.consumer.subscriptions, this.monitor = new a(this), this.disconnected = !0
            }

            return e.prototype.send = function (e) {
                return !!this.isOpen() && (this.webSocket.send(JSON.stringify(e)), !0)
            }, e.prototype.open = function () {
                return this.isActive() ? (n.log("Attempted to open WebSocket, but existing socket is " + this.getState()), !1) : (n.log("Opening WebSocket, current state is " + this.getState() + ", subprotocols: " + f), this.webSocket && this.uninstallEventHandlers(), this.webSocket = new t.WebSocket(this.consumer.url, f), this.installEventHandlers(), this.monitor.start(), !0)
            }, e.prototype.close = function () {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {allowReconnect: !0},
                    t = e.allowReconnect;
                if (t || this.monitor.stop(), this.isActive()) return this.webSocket.close()
            }, e.prototype.reopen = function () {
                if (n.log("Reopening WebSocket, current state is " + this.getState()), !this.isActive()) return this.open();
                try {
                    return this.close()
                } catch (e) {
                    n.log("Failed to reopen WebSocket", e)
                } finally {
                    n.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms"), setTimeout(this.open, this.constructor.reopenDelay)
                }
            }, e.prototype.getProtocol = function () {
                if (this.webSocket) return this.webSocket.protocol
            }, e.prototype.isOpen = function () {
                return this.isState("open")
            }, e.prototype.isActive = function () {
                return this.isState("open", "connecting")
            }, e.prototype.isProtocolSupported = function () {
                return p.call(d, this.getProtocol()) >= 0
            }, e.prototype.isState = function () {
                for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
                return p.call(t, this.getState()) >= 0
            }, e.prototype.getState = function () {
                if (this.webSocket) for (var e in t.WebSocket) if (t.WebSocket[e] === this.webSocket.readyState) return e.toLowerCase();
                return null
            }, e.prototype.installEventHandlers = function () {
                for (var e in this.events) {
                    var t = this.events[e].bind(this);
                    this.webSocket["on" + e] = t
                }
            }, e.prototype.uninstallEventHandlers = function () {
                for (var e in this.events) this.webSocket["on" + e] = function () {
                }
            }, e
        }();
        h.reopenDelay = 500, h.prototype.events = {
            message: function (e) {
                if (this.isProtocolSupported()) {
                    var t = JSON.parse(e.data), r = t.identifier, o = t.message, i = t.reason, s = t.reconnect;
                    switch (t.type) {
                        case u.welcome:
                            return this.monitor.recordConnect(), this.subscriptions.reload();
                        case u.disconnect:
                            return n.log("Disconnecting. Reason: " + i), this.close({allowReconnect: s});
                        case u.ping:
                            return this.monitor.recordPing();
                        case u.confirmation:
                            return this.subscriptions.notify(r, "connected");
                        case u.rejection:
                            return this.subscriptions.reject(r);
                        default:
                            return this.subscriptions.notify(r, "received", o)
                    }
                }
            }, open: function () {
                if (n.log("WebSocket onopen event, using '" + this.getProtocol() + "' subprotocol"), this.disconnected = !1, !this.isProtocolSupported()) return n.log("Protocol is unsupported. Stopping monitor and disconnecting."), this.close({allowReconnect: !1})
            }, close: function (e) {
                if (n.log("WebSocket onclose event"), !this.disconnected) return this.disconnected = !0, this.monitor.recordDisconnect(), this.subscriptions.notifyAll("disconnected", {willAttemptReconnect: this.monitor.isRunning()})
            }, error: function () {
                n.log("WebSocket onerror event")
            }
        };
        var m = function (e, t) {
            if (null != t) for (var n in t) {
                var r = t[n];
                e[n] = r
            }
            return e
        }, y = function () {
            function e(t) {
                var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r = arguments[2];
                o(this, e), this.consumer = t, this.identifier = JSON.stringify(n), m(this, r)
            }

            return e.prototype.perform = function (e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                return t.action = e, this.send(t)
            }, e.prototype.send = function (e) {
                return this.consumer.send({command: "message", identifier: this.identifier, data: JSON.stringify(e)})
            }, e.prototype.unsubscribe = function () {
                return this.consumer.subscriptions.remove(this)
            }, e
        }(), b = function () {
            function e(t) {
                o(this, e), this.consumer = t, this.subscriptions = []
            }

            return e.prototype.create = function (e, t) {
                var n = e, o = "object" === (void 0 === n ? "undefined" : r(n)) ? n : {channel: n},
                    i = new y(this.consumer, o, t);
                return this.add(i)
            }, e.prototype.add = function (e) {
                return this.subscriptions.push(e), this.consumer.ensureActiveConnection(), this.notify(e, "initialized"), this.sendCommand(e, "subscribe"), e
            }, e.prototype.remove = function (e) {
                return this.forget(e), this.findAll(e.identifier).length || this.sendCommand(e, "unsubscribe"), e
            }, e.prototype.reject = function (e) {
                var t = this;
                return this.findAll(e).map((function (e) {
                    return t.forget(e), t.notify(e, "rejected"), e
                }))
            }, e.prototype.forget = function (e) {
                return this.subscriptions = this.subscriptions.filter((function (t) {
                    return t !== e
                })), e
            }, e.prototype.findAll = function (e) {
                return this.subscriptions.filter((function (t) {
                    return t.identifier === e
                }))
            }, e.prototype.reload = function () {
                var e = this;
                return this.subscriptions.map((function (t) {
                    return e.sendCommand(t, "subscribe")
                }))
            }, e.prototype.notifyAll = function (e) {
                for (var t = this, n = arguments.length, r = Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++) r[o - 1] = arguments[o];
                return this.subscriptions.map((function (n) {
                    return t.notify.apply(t, [n, e].concat(r))
                }))
            }, e.prototype.notify = function (e, t) {
                for (var n = arguments.length, r = Array(n > 2 ? n - 2 : 0), o = 2; o < n; o++) r[o - 2] = arguments[o];
                return ("string" == typeof e ? this.findAll(e) : [e]).map((function (e) {
                    return "function" == typeof e[t] ? e[t].apply(e, r) : void 0
                }))
            }, e.prototype.sendCommand = function (e, t) {
                var n = e.identifier;
                return this.consumer.send({command: t, identifier: n})
            }, e
        }(), g = function () {
            function e(t) {
                o(this, e), this._url = t, this.subscriptions = new b(this), this.connection = new h(this)
            }

            return e.prototype.send = function (e) {
                return this.connection.send(e)
            }, e.prototype.connect = function () {
                return this.connection.open()
            }, e.prototype.disconnect = function () {
                return this.connection.close({allowReconnect: !1})
            }, e.prototype.ensureActiveConnection = function () {
                if (!this.connection.isActive()) return this.connection.open()
            }, i(e, [{
                key: "url", get: function () {
                    return v(this._url)
                }
            }]), e
        }();

        function v(e) {
            if ("function" == typeof e && (e = e()), e && !/^wss?:/i.test(e)) {
                var t = document.createElement("a");
                return t.href = e, t.href = t.href, t.protocol = t.protocol.replace("http", "ws"), t.href
            }
            return e
        }

        function A(e) {
            var t = document.head.querySelector("meta[name='action-cable-" + e + "']");
            if (t) return t.getAttribute("content")
        }

        e.Connection = h, e.ConnectionMonitor = a, e.Consumer = g, e.INTERNAL = l, e.Subscription = y, e.Subscriptions = b, e.adapters = t, e.createWebSocketURL = v, e.logger = n, e.createConsumer = function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : A("url") || l.default_mount_path;
            return new g(e)
        }, e.getConfig = A, Object.defineProperty(e, "__esModule", {value: !0})
    }(t)
}, function (e, t, n) {
    "use strict";
    n.r(t);
    var r = function () {
        function e(e, t) {
            this.eventTarget = e, this.eventName = t, this.unorderedBindings = new Set
        }

        return e.prototype.connect = function () {
            this.eventTarget.addEventListener(this.eventName, this, !1)
        }, e.prototype.disconnect = function () {
            this.eventTarget.removeEventListener(this.eventName, this, !1)
        }, e.prototype.bindingConnected = function (e) {
            this.unorderedBindings.add(e)
        }, e.prototype.bindingDisconnected = function (e) {
            this.unorderedBindings.delete(e)
        }, e.prototype.handleEvent = function (e) {
            for (var t = function (e) {
                if ("immediatePropagationStopped" in e) return e;
                var t = e.stopImmediatePropagation;
                return Object.assign(e, {
                    immediatePropagationStopped: !1, stopImmediatePropagation: function () {
                        this.immediatePropagationStopped = !0, t.call(this)
                    }
                })
            }(e), n = 0, r = this.bindings; n < r.length; n++) {
                var o = r[n];
                if (t.immediatePropagationStopped) break;
                o.handleEvent(t)
            }
        }, Object.defineProperty(e.prototype, "bindings", {
            get: function () {
                return Array.from(this.unorderedBindings).sort((function (e, t) {
                    var n = e.index, r = t.index;
                    return n < r ? -1 : n > r ? 1 : 0
                }))
            }, enumerable: !0, configurable: !0
        }), e
    }();
    var o = function () {
        function e(e) {
            this.application = e, this.eventListenerMaps = new Map, this.started = !1
        }

        return e.prototype.start = function () {
            this.started || (this.started = !0, this.eventListeners.forEach((function (e) {
                return e.connect()
            })))
        }, e.prototype.stop = function () {
            this.started && (this.started = !1, this.eventListeners.forEach((function (e) {
                return e.disconnect()
            })))
        }, Object.defineProperty(e.prototype, "eventListeners", {
            get: function () {
                return Array.from(this.eventListenerMaps.values()).reduce((function (e, t) {
                    return e.concat(Array.from(t.values()))
                }), [])
            }, enumerable: !0, configurable: !0
        }), e.prototype.bindingConnected = function (e) {
            this.fetchEventListenerForBinding(e).bindingConnected(e)
        }, e.prototype.bindingDisconnected = function (e) {
            this.fetchEventListenerForBinding(e).bindingDisconnected(e)
        }, e.prototype.handleError = function (e, t, n) {
            void 0 === n && (n = {}), this.application.handleError(e, "Error " + t, n)
        }, e.prototype.fetchEventListenerForBinding = function (e) {
            var t = e.eventTarget, n = e.eventName;
            return this.fetchEventListener(t, n)
        }, e.prototype.fetchEventListener = function (e, t) {
            var n = this.fetchEventListenerMapForEventTarget(e), r = n.get(t);
            return r || (r = this.createEventListener(e, t), n.set(t, r)), r
        }, e.prototype.createEventListener = function (e, t) {
            var n = new r(e, t);
            return this.started && n.connect(), n
        }, e.prototype.fetchEventListenerMapForEventTarget = function (e) {
            var t = this.eventListenerMaps.get(e);
            return t || (t = new Map, this.eventListenerMaps.set(e, t)), t
        }, e
    }(), i = /^((.+?)(@(window|document))?->)?(.+?)(#(.+))?$/;
    var s = function () {
        function e(e, t, n) {
            this.element = e, this.index = t, this.eventTarget = n.eventTarget || e, this.eventName = n.eventName || function (e) {
                var t = e.tagName.toLowerCase();
                if (t in c) return c[t](e)
            }(e) || a("missing event name"), this.identifier = n.identifier || a("missing identifier"), this.methodName = n.methodName || a("missing method name")
        }

        return e.forToken = function (e) {
            return new this(e.element, e.index, (n = e.content, r = n.trim().match(i) || [], {
                eventTarget: (t = r[4], "window" == t ? window : "document" == t ? document : void 0),
                eventName: r[2],
                identifier: r[5],
                methodName: r[7]
            }));
            var t, n, r
        }, e.prototype.toString = function () {
            var e = this.eventTargetName ? "@" + this.eventTargetName : "";
            return "" + this.eventName + e + "->" + this.identifier + "#" + this.methodName
        }, Object.defineProperty(e.prototype, "eventTargetName", {
            get: function () {
                return (e = this.eventTarget) == window ? "window" : e == document ? "document" : void 0;
                var e
            }, enumerable: !0, configurable: !0
        }), e
    }(), c = {
        a: function (e) {
            return "click"
        }, button: function (e) {
            return "click"
        }, form: function (e) {
            return "submit"
        }, input: function (e) {
            return "submit" == e.getAttribute("type") ? "click" : "change"
        }, select: function (e) {
            return "change"
        }, textarea: function (e) {
            return "change"
        }
    };

    function a(e) {
        throw new Error(e)
    }

    var l = function () {
        function e(e, t) {
            this.context = e, this.action = t
        }

        return Object.defineProperty(e.prototype, "index", {
            get: function () {
                return this.action.index
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "eventTarget", {
            get: function () {
                return this.action.eventTarget
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "identifier", {
            get: function () {
                return this.context.identifier
            }, enumerable: !0, configurable: !0
        }), e.prototype.handleEvent = function (e) {
            this.willBeInvokedByEvent(e) && this.invokeWithEvent(e)
        }, Object.defineProperty(e.prototype, "eventName", {
            get: function () {
                return this.action.eventName
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "method", {
            get: function () {
                var e = this.controller[this.methodName];
                if ("function" == typeof e) return e;
                throw new Error('Action "' + this.action + '" references undefined method "' + this.methodName + '"')
            }, enumerable: !0, configurable: !0
        }), e.prototype.invokeWithEvent = function (e) {
            try {
                this.method.call(this.controller, e)
            } catch (n) {
                var t = {
                    identifier: this.identifier,
                    controller: this.controller,
                    element: this.element,
                    index: this.index,
                    event: e
                };
                this.context.handleError(n, 'invoking action "' + this.action + '"', t)
            }
        }, e.prototype.willBeInvokedByEvent = function (e) {
            var t = e.target;
            return this.element === t || (!(t instanceof Element && this.element.contains(t)) || this.scope.containsElement(t))
        }, Object.defineProperty(e.prototype, "controller", {
            get: function () {
                return this.context.controller
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "methodName", {
            get: function () {
                return this.action.methodName
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "element", {
            get: function () {
                return this.scope.element
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "scope", {
            get: function () {
                return this.context.scope
            }, enumerable: !0, configurable: !0
        }), e
    }(), u = function () {
        function e(e, t) {
            var n = this;
            this.element = e, this.started = !1, this.delegate = t, this.elements = new Set, this.mutationObserver = new MutationObserver((function (e) {
                return n.processMutations(e)
            }))
        }

        return e.prototype.start = function () {
            this.started || (this.started = !0, this.mutationObserver.observe(this.element, {
                attributes: !0,
                childList: !0,
                subtree: !0
            }), this.refresh())
        }, e.prototype.stop = function () {
            this.started && (this.mutationObserver.takeRecords(), this.mutationObserver.disconnect(), this.started = !1)
        }, e.prototype.refresh = function () {
            if (this.started) {
                for (var e = new Set(this.matchElementsInTree()), t = 0, n = Array.from(this.elements); t < n.length; t++) {
                    var r = n[t];
                    e.has(r) || this.removeElement(r)
                }
                for (var o = 0, i = Array.from(e); o < i.length; o++) {
                    r = i[o];
                    this.addElement(r)
                }
            }
        }, e.prototype.processMutations = function (e) {
            if (this.started) for (var t = 0, n = e; t < n.length; t++) {
                var r = n[t];
                this.processMutation(r)
            }
        }, e.prototype.processMutation = function (e) {
            "attributes" == e.type ? this.processAttributeChange(e.target, e.attributeName) : "childList" == e.type && (this.processRemovedNodes(e.removedNodes), this.processAddedNodes(e.addedNodes))
        }, e.prototype.processAttributeChange = function (e, t) {
            var n = e;
            this.elements.has(n) ? this.delegate.elementAttributeChanged && this.matchElement(n) ? this.delegate.elementAttributeChanged(n, t) : this.removeElement(n) : this.matchElement(n) && this.addElement(n)
        }, e.prototype.processRemovedNodes = function (e) {
            for (var t = 0, n = Array.from(e); t < n.length; t++) {
                var r = n[t], o = this.elementFromNode(r);
                o && this.processTree(o, this.removeElement)
            }
        }, e.prototype.processAddedNodes = function (e) {
            for (var t = 0, n = Array.from(e); t < n.length; t++) {
                var r = n[t], o = this.elementFromNode(r);
                o && this.elementIsActive(o) && this.processTree(o, this.addElement)
            }
        }, e.prototype.matchElement = function (e) {
            return this.delegate.matchElement(e)
        }, e.prototype.matchElementsInTree = function (e) {
            return void 0 === e && (e = this.element), this.delegate.matchElementsInTree(e)
        }, e.prototype.processTree = function (e, t) {
            for (var n = 0, r = this.matchElementsInTree(e); n < r.length; n++) {
                var o = r[n];
                t.call(this, o)
            }
        }, e.prototype.elementFromNode = function (e) {
            if (e.nodeType == Node.ELEMENT_NODE) return e
        }, e.prototype.elementIsActive = function (e) {
            return e.isConnected == this.element.isConnected && this.element.contains(e)
        }, e.prototype.addElement = function (e) {
            this.elements.has(e) || this.elementIsActive(e) && (this.elements.add(e), this.delegate.elementMatched && this.delegate.elementMatched(e))
        }, e.prototype.removeElement = function (e) {
            this.elements.has(e) && (this.elements.delete(e), this.delegate.elementUnmatched && this.delegate.elementUnmatched(e))
        }, e
    }(), f = function () {
        function e(e, t, n) {
            this.attributeName = t, this.delegate = n, this.elementObserver = new u(e, this)
        }

        return Object.defineProperty(e.prototype, "element", {
            get: function () {
                return this.elementObserver.element
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "selector", {
            get: function () {
                return "[" + this.attributeName + "]"
            }, enumerable: !0, configurable: !0
        }), e.prototype.start = function () {
            this.elementObserver.start()
        }, e.prototype.stop = function () {
            this.elementObserver.stop()
        }, e.prototype.refresh = function () {
            this.elementObserver.refresh()
        }, Object.defineProperty(e.prototype, "started", {
            get: function () {
                return this.elementObserver.started
            }, enumerable: !0, configurable: !0
        }), e.prototype.matchElement = function (e) {
            return e.hasAttribute(this.attributeName)
        }, e.prototype.matchElementsInTree = function (e) {
            var t = this.matchElement(e) ? [e] : [], n = Array.from(e.querySelectorAll(this.selector));
            return t.concat(n)
        }, e.prototype.elementMatched = function (e) {
            this.delegate.elementMatchedAttribute && this.delegate.elementMatchedAttribute(e, this.attributeName)
        }, e.prototype.elementUnmatched = function (e) {
            this.delegate.elementUnmatchedAttribute && this.delegate.elementUnmatchedAttribute(e, this.attributeName)
        }, e.prototype.elementAttributeChanged = function (e, t) {
            this.delegate.elementAttributeValueChanged && this.attributeName == t && this.delegate.elementAttributeValueChanged(e, t)
        }, e
    }();

    function d(e, t, n) {
        h(e, t).add(n)
    }

    function p(e, t, n) {
        h(e, t).delete(n), function (e, t) {
            var n = e.get(t);
            null != n && 0 == n.size && e.delete(t)
        }(e, t)
    }

    function h(e, t) {
        var n = e.get(t);
        return n || (n = new Set, e.set(t, n)), n
    }

    var m = function () {
        function e() {
            this.valuesByKey = new Map
        }

        return Object.defineProperty(e.prototype, "values", {
            get: function () {
                return Array.from(this.valuesByKey.values()).reduce((function (e, t) {
                    return e.concat(Array.from(t))
                }), [])
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "size", {
            get: function () {
                return Array.from(this.valuesByKey.values()).reduce((function (e, t) {
                    return e + t.size
                }), 0)
            }, enumerable: !0, configurable: !0
        }), e.prototype.add = function (e, t) {
            d(this.valuesByKey, e, t)
        }, e.prototype.delete = function (e, t) {
            p(this.valuesByKey, e, t)
        }, e.prototype.has = function (e, t) {
            var n = this.valuesByKey.get(e);
            return null != n && n.has(t)
        }, e.prototype.hasKey = function (e) {
            return this.valuesByKey.has(e)
        }, e.prototype.hasValue = function (e) {
            return Array.from(this.valuesByKey.values()).some((function (t) {
                return t.has(e)
            }))
        }, e.prototype.getValuesForKey = function (e) {
            var t = this.valuesByKey.get(e);
            return t ? Array.from(t) : []
        }, e.prototype.getKeysForValue = function (e) {
            return Array.from(this.valuesByKey).filter((function (t) {
                t[0];
                return t[1].has(e)
            })).map((function (e) {
                var t = e[0];
                e[1];
                return t
            }))
        }, e
    }(), y = function () {
        var e = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
            e.__proto__ = t
        } || function (e, t) {
            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
        };
        return function (t, n) {
            function r() {
                this.constructor = t
            }

            e(t, n), t.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
        }
    }(), b = (function (e) {
        function t() {
            var t = e.call(this) || this;
            return t.keysByValue = new Map, t
        }

        y(t, e), Object.defineProperty(t.prototype, "values", {
            get: function () {
                return Array.from(this.keysByValue.keys())
            }, enumerable: !0, configurable: !0
        }), t.prototype.add = function (t, n) {
            e.prototype.add.call(this, t, n), d(this.keysByValue, n, t)
        }, t.prototype.delete = function (t, n) {
            e.prototype.delete.call(this, t, n), p(this.keysByValue, n, t)
        }, t.prototype.hasValue = function (e) {
            return this.keysByValue.has(e)
        }, t.prototype.getKeysForValue = function (e) {
            var t = this.keysByValue.get(e);
            return t ? Array.from(t) : []
        }
    }(m), function () {
        function e(e, t, n) {
            this.attributeObserver = new f(e, t, this), this.delegate = n, this.tokensByElement = new m
        }

        return Object.defineProperty(e.prototype, "started", {
            get: function () {
                return this.attributeObserver.started
            }, enumerable: !0, configurable: !0
        }), e.prototype.start = function () {
            this.attributeObserver.start()
        }, e.prototype.stop = function () {
            this.attributeObserver.stop()
        }, e.prototype.refresh = function () {
            this.attributeObserver.refresh()
        }, Object.defineProperty(e.prototype, "element", {
            get: function () {
                return this.attributeObserver.element
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "attributeName", {
            get: function () {
                return this.attributeObserver.attributeName
            }, enumerable: !0, configurable: !0
        }), e.prototype.elementMatchedAttribute = function (e) {
            this.tokensMatched(this.readTokensForElement(e))
        }, e.prototype.elementAttributeValueChanged = function (e) {
            var t = this.refreshTokensForElement(e), n = t[0], r = t[1];
            this.tokensUnmatched(n), this.tokensMatched(r)
        }, e.prototype.elementUnmatchedAttribute = function (e) {
            this.tokensUnmatched(this.tokensByElement.getValuesForKey(e))
        }, e.prototype.tokensMatched = function (e) {
            var t = this;
            e.forEach((function (e) {
                return t.tokenMatched(e)
            }))
        }, e.prototype.tokensUnmatched = function (e) {
            var t = this;
            e.forEach((function (e) {
                return t.tokenUnmatched(e)
            }))
        }, e.prototype.tokenMatched = function (e) {
            this.delegate.tokenMatched(e), this.tokensByElement.add(e.element, e)
        }, e.prototype.tokenUnmatched = function (e) {
            this.delegate.tokenUnmatched(e), this.tokensByElement.delete(e.element, e)
        }, e.prototype.refreshTokensForElement = function (e) {
            var t, n, r, o = this.tokensByElement.getValuesForKey(e), i = this.readTokensForElement(e),
                s = (t = o, n = i, r = Math.max(t.length, n.length), Array.from({length: r}, (function (e, r) {
                    return [t[r], n[r]]
                }))).findIndex((function (e) {
                    return !function (e, t) {
                        return e && t && e.index == t.index && e.content == t.content
                    }(e[0], e[1])
                }));
            return -1 == s ? [[], []] : [o.slice(s), i.slice(s)]
        }, e.prototype.readTokensForElement = function (e) {
            var t = this.attributeName;
            return function (e, t, n) {
                return e.trim().split(/\s+/).filter((function (e) {
                    return e.length
                })).map((function (e, r) {
                    return {element: t, attributeName: n, content: e, index: r}
                }))
            }(e.getAttribute(t) || "", e, t)
        }, e
    }());
    var g = function () {
        function e(e, t, n) {
            this.tokenListObserver = new b(e, t, this), this.delegate = n, this.parseResultsByToken = new WeakMap, this.valuesByTokenByElement = new WeakMap
        }

        return Object.defineProperty(e.prototype, "started", {
            get: function () {
                return this.tokenListObserver.started
            }, enumerable: !0, configurable: !0
        }), e.prototype.start = function () {
            this.tokenListObserver.start()
        }, e.prototype.stop = function () {
            this.tokenListObserver.stop()
        }, e.prototype.refresh = function () {
            this.tokenListObserver.refresh()
        }, Object.defineProperty(e.prototype, "element", {
            get: function () {
                return this.tokenListObserver.element
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "attributeName", {
            get: function () {
                return this.tokenListObserver.attributeName
            }, enumerable: !0, configurable: !0
        }), e.prototype.tokenMatched = function (e) {
            var t = e.element, n = this.fetchParseResultForToken(e).value;
            n && (this.fetchValuesByTokenForElement(t).set(e, n), this.delegate.elementMatchedValue(t, n))
        }, e.prototype.tokenUnmatched = function (e) {
            var t = e.element, n = this.fetchParseResultForToken(e).value;
            n && (this.fetchValuesByTokenForElement(t).delete(e), this.delegate.elementUnmatchedValue(t, n))
        }, e.prototype.fetchParseResultForToken = function (e) {
            var t = this.parseResultsByToken.get(e);
            return t || (t = this.parseToken(e), this.parseResultsByToken.set(e, t)), t
        }, e.prototype.fetchValuesByTokenForElement = function (e) {
            var t = this.valuesByTokenByElement.get(e);
            return t || (t = new Map, this.valuesByTokenByElement.set(e, t)), t
        }, e.prototype.parseToken = function (e) {
            try {
                return {value: this.delegate.parseValueForToken(e)}
            } catch (e) {
                return {error: e}
            }
        }, e
    }(), v = function () {
        function e(e, t) {
            this.context = e, this.delegate = t, this.bindingsByAction = new Map
        }

        return e.prototype.start = function () {
            this.valueListObserver || (this.valueListObserver = new g(this.element, this.actionAttribute, this), this.valueListObserver.start())
        }, e.prototype.stop = function () {
            this.valueListObserver && (this.valueListObserver.stop(), delete this.valueListObserver, this.disconnectAllActions())
        }, Object.defineProperty(e.prototype, "element", {
            get: function () {
                return this.context.element
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "identifier", {
            get: function () {
                return this.context.identifier
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "actionAttribute", {
            get: function () {
                return this.schema.actionAttribute
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "schema", {
            get: function () {
                return this.context.schema
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "bindings", {
            get: function () {
                return Array.from(this.bindingsByAction.values())
            }, enumerable: !0, configurable: !0
        }), e.prototype.connectAction = function (e) {
            var t = new l(this.context, e);
            this.bindingsByAction.set(e, t), this.delegate.bindingConnected(t)
        }, e.prototype.disconnectAction = function (e) {
            var t = this.bindingsByAction.get(e);
            t && (this.bindingsByAction.delete(e), this.delegate.bindingDisconnected(t))
        }, e.prototype.disconnectAllActions = function () {
            var e = this;
            this.bindings.forEach((function (t) {
                return e.delegate.bindingDisconnected(t)
            })), this.bindingsByAction.clear()
        }, e.prototype.parseValueForToken = function (e) {
            var t = s.forToken(e);
            if (t.identifier == this.identifier) return t
        }, e.prototype.elementMatchedValue = function (e, t) {
            this.connectAction(t)
        }, e.prototype.elementUnmatchedValue = function (e, t) {
            this.disconnectAction(t)
        }, e
    }(), A = function () {
        function e(e, t) {
            this.module = e, this.scope = t, this.controller = new e.controllerConstructor(this), this.bindingObserver = new v(this, this.dispatcher);
            try {
                this.controller.initialize()
            } catch (e) {
                this.handleError(e, "initializing controller")
            }
        }

        return e.prototype.connect = function () {
            this.bindingObserver.start();
            try {
                this.controller.connect()
            } catch (e) {
                this.handleError(e, "connecting controller")
            }
        }, e.prototype.disconnect = function () {
            try {
                this.controller.disconnect()
            } catch (e) {
                this.handleError(e, "disconnecting controller")
            }
            this.bindingObserver.stop()
        }, Object.defineProperty(e.prototype, "application", {
            get: function () {
                return this.module.application
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "identifier", {
            get: function () {
                return this.module.identifier
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "schema", {
            get: function () {
                return this.application.schema
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "dispatcher", {
            get: function () {
                return this.application.dispatcher
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "element", {
            get: function () {
                return this.scope.element
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "parentElement", {
            get: function () {
                return this.element.parentElement
            }, enumerable: !0, configurable: !0
        }), e.prototype.handleError = function (e, t, n) {
            void 0 === n && (n = {});
            var r = this.identifier, o = this.controller, i = this.element;
            n = Object.assign({
                identifier: r,
                controller: o,
                element: i
            }, n), this.application.handleError(e, "Error " + t, n)
        }, e
    }(), x = function () {
        var e = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
            e.__proto__ = t
        } || function (e, t) {
            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
        };
        return function (t, n) {
            function r() {
                this.constructor = t
            }

            e(t, n), t.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
        }
    }();

    function E(e) {
        var t = w(e);
        return t.bless(), t
    }

    var w = function () {
        function e(e) {
            function t() {
                var n = this && this instanceof t ? this.constructor : void 0;
                return Reflect.construct(e, arguments, n)
            }

            return t.prototype = Object.create(e.prototype, {constructor: {value: t}}), Reflect.setPrototypeOf(t, e), t
        }

        try {
            return (t = e((function () {
                this.a.call(this)
            }))).prototype.a = function () {
            }, new t, e
        } catch (e) {
            return function (e) {
                return function (e) {
                    function t() {
                        return null !== e && e.apply(this, arguments) || this
                    }

                    return x(t, e), t
                }(e)
            }
        }
        var t
    }(), O = function () {
        function e(e, t) {
            this.application = e, this.definition = function (e) {
                return {identifier: e.identifier, controllerConstructor: E(e.controllerConstructor)}
            }(t), this.contextsByScope = new WeakMap, this.connectedContexts = new Set
        }

        return Object.defineProperty(e.prototype, "identifier", {
            get: function () {
                return this.definition.identifier
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "controllerConstructor", {
            get: function () {
                return this.definition.controllerConstructor
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "contexts", {
            get: function () {
                return Array.from(this.connectedContexts)
            }, enumerable: !0, configurable: !0
        }), e.prototype.connectContextForScope = function (e) {
            var t = this.fetchContextForScope(e);
            this.connectedContexts.add(t), t.connect()
        }, e.prototype.disconnectContextForScope = function (e) {
            var t = this.contextsByScope.get(e);
            t && (this.connectedContexts.delete(t), t.disconnect())
        }, e.prototype.fetchContextForScope = function (e) {
            var t = this.contextsByScope.get(e);
            return t || (t = new A(this, e), this.contextsByScope.set(e, t)), t
        }, e
    }(), _ = function () {
        function e(e) {
            this.scope = e
        }

        return Object.defineProperty(e.prototype, "element", {
            get: function () {
                return this.scope.element
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "identifier", {
            get: function () {
                return this.scope.identifier
            }, enumerable: !0, configurable: !0
        }), e.prototype.get = function (e) {
            return e = this.getFormattedKey(e), this.element.getAttribute(e)
        }, e.prototype.set = function (e, t) {
            return e = this.getFormattedKey(e), this.element.setAttribute(e, t), this.get(e)
        }, e.prototype.has = function (e) {
            return e = this.getFormattedKey(e), this.element.hasAttribute(e)
        }, e.prototype.delete = function (e) {
            return !!this.has(e) && (e = this.getFormattedKey(e), this.element.removeAttribute(e), !0)
        }, e.prototype.getFormattedKey = function (e) {
            return "data-" + this.identifier + "-" + e.replace(/([A-Z])/g, (function (e, t) {
                return "-" + t.toLowerCase()
            }))
        }, e
    }();

    function S(e, t) {
        return "[" + e + '~="' + t + '"]'
    }

    var C = function () {
            function e(e) {
                this.scope = e
            }

            return Object.defineProperty(e.prototype, "element", {
                get: function () {
                    return this.scope.element
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty(e.prototype, "identifier", {
                get: function () {
                    return this.scope.identifier
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty(e.prototype, "schema", {
                get: function () {
                    return this.scope.schema
                }, enumerable: !0, configurable: !0
            }), e.prototype.has = function (e) {
                return null != this.find(e)
            }, e.prototype.find = function () {
                for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
                var n = this.getSelectorForTargetNames(e);
                return this.scope.findElement(n)
            }, e.prototype.findAll = function () {
                for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
                var n = this.getSelectorForTargetNames(e);
                return this.scope.findAllElements(n)
            }, e.prototype.getSelectorForTargetNames = function (e) {
                var t = this;
                return e.map((function (e) {
                    return t.getSelectorForTargetName(e)
                })).join(", ")
            }, e.prototype.getSelectorForTargetName = function (e) {
                var t = this.identifier + "." + e;
                return S(this.schema.targetAttribute, t)
            }, e
        }(), T = function () {
            function e(e, t, n) {
                this.schema = e, this.identifier = t, this.element = n, this.targets = new C(this), this.data = new _(this)
            }

            return e.prototype.findElement = function (e) {
                return this.findAllElements(e)[0]
            }, e.prototype.findAllElements = function (e) {
                var t = this.element.matches(e) ? [this.element] : [],
                    n = this.filterElements(Array.from(this.element.querySelectorAll(e)));
                return t.concat(n)
            }, e.prototype.filterElements = function (e) {
                var t = this;
                return e.filter((function (e) {
                    return t.containsElement(e)
                }))
            }, e.prototype.containsElement = function (e) {
                return e.closest(this.controllerSelector) === this.element
            }, Object.defineProperty(e.prototype, "controllerSelector", {
                get: function () {
                    return S(this.schema.controllerAttribute, this.identifier)
                }, enumerable: !0, configurable: !0
            }), e
        }(), N = function () {
            function e(e, t, n) {
                this.element = e, this.schema = t, this.delegate = n, this.valueListObserver = new g(this.element, this.controllerAttribute, this), this.scopesByIdentifierByElement = new WeakMap, this.scopeReferenceCounts = new WeakMap
            }

            return e.prototype.start = function () {
                this.valueListObserver.start()
            }, e.prototype.stop = function () {
                this.valueListObserver.stop()
            }, Object.defineProperty(e.prototype, "controllerAttribute", {
                get: function () {
                    return this.schema.controllerAttribute
                }, enumerable: !0, configurable: !0
            }), e.prototype.parseValueForToken = function (e) {
                var t = e.element, n = e.content, r = this.fetchScopesByIdentifierForElement(t), o = r.get(n);
                return o || (o = new T(this.schema, n, t), r.set(n, o)), o
            }, e.prototype.elementMatchedValue = function (e, t) {
                var n = (this.scopeReferenceCounts.get(t) || 0) + 1;
                this.scopeReferenceCounts.set(t, n), 1 == n && this.delegate.scopeConnected(t)
            }, e.prototype.elementUnmatchedValue = function (e, t) {
                var n = this.scopeReferenceCounts.get(t);
                n && (this.scopeReferenceCounts.set(t, n - 1), 1 == n && this.delegate.scopeDisconnected(t))
            }, e.prototype.fetchScopesByIdentifierForElement = function (e) {
                var t = this.scopesByIdentifierByElement.get(e);
                return t || (t = new Map, this.scopesByIdentifierByElement.set(e, t)), t
            }, e
        }(), P = function () {
            function e(e) {
                this.application = e, this.scopeObserver = new N(this.element, this.schema, this), this.scopesByIdentifier = new m, this.modulesByIdentifier = new Map
            }

            return Object.defineProperty(e.prototype, "element", {
                get: function () {
                    return this.application.element
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty(e.prototype, "schema", {
                get: function () {
                    return this.application.schema
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty(e.prototype, "controllerAttribute", {
                get: function () {
                    return this.schema.controllerAttribute
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty(e.prototype, "modules", {
                get: function () {
                    return Array.from(this.modulesByIdentifier.values())
                }, enumerable: !0, configurable: !0
            }), Object.defineProperty(e.prototype, "contexts", {
                get: function () {
                    return this.modules.reduce((function (e, t) {
                        return e.concat(t.contexts)
                    }), [])
                }, enumerable: !0, configurable: !0
            }), e.prototype.start = function () {
                this.scopeObserver.start()
            }, e.prototype.stop = function () {
                this.scopeObserver.stop()
            }, e.prototype.loadDefinition = function (e) {
                this.unloadIdentifier(e.identifier);
                var t = new O(this.application, e);
                this.connectModule(t)
            }, e.prototype.unloadIdentifier = function (e) {
                var t = this.modulesByIdentifier.get(e);
                t && this.disconnectModule(t)
            }, e.prototype.getContextForElementAndIdentifier = function (e, t) {
                var n = this.modulesByIdentifier.get(t);
                if (n) return n.contexts.find((function (t) {
                    return t.element == e
                }))
            }, e.prototype.handleError = function (e, t, n) {
                this.application.handleError(e, t, n)
            }, e.prototype.scopeConnected = function (e) {
                this.scopesByIdentifier.add(e.identifier, e);
                var t = this.modulesByIdentifier.get(e.identifier);
                t && t.connectContextForScope(e)
            }, e.prototype.scopeDisconnected = function (e) {
                this.scopesByIdentifier.delete(e.identifier, e);
                var t = this.modulesByIdentifier.get(e.identifier);
                t && t.disconnectContextForScope(e)
            }, e.prototype.connectModule = function (e) {
                this.modulesByIdentifier.set(e.identifier, e), this.scopesByIdentifier.getValuesForKey(e.identifier).forEach((function (t) {
                    return e.connectContextForScope(t)
                }))
            }, e.prototype.disconnectModule = function (e) {
                this.modulesByIdentifier.delete(e.identifier), this.scopesByIdentifier.getValuesForKey(e.identifier).forEach((function (t) {
                    return e.disconnectContextForScope(t)
                }))
            }, e
        }(), L = {controllerAttribute: "data-controller", actionAttribute: "data-action", targetAttribute: "data-target"},
        j = function (e, t, n, r) {
            return new (n || (n = Promise))((function (o, i) {
                function s(e) {
                    try {
                        a(r.next(e))
                    } catch (e) {
                        i(e)
                    }
                }

                function c(e) {
                    try {
                        a(r.throw(e))
                    } catch (e) {
                        i(e)
                    }
                }

                function a(e) {
                    e.done ? o(e.value) : new n((function (t) {
                        t(e.value)
                    })).then(s, c)
                }

                a((r = r.apply(e, t || [])).next())
            }))
        }, k = function (e, t) {
            var n, r, o, i, s = {
                label: 0, sent: function () {
                    if (1 & o[0]) throw o[1];
                    return o[1]
                }, trys: [], ops: []
            };
            return i = {
                next: c(0),
                throw: c(1),
                return: c(2)
            }, "function" == typeof Symbol && (i[Symbol.iterator] = function () {
                return this
            }), i;

            function c(i) {
                return function (c) {
                    return function (i) {
                        if (n) throw new TypeError("Generator is already executing.");
                        for (; s;) try {
                            if (n = 1, r && (o = r[2 & i[0] ? "return" : i[0] ? "throw" : "next"]) && !(o = o.call(r, i[1])).done) return o;
                            switch (r = 0, o && (i = [0, o.value]), i[0]) {
                                case 0:
                                case 1:
                                    o = i;
                                    break;
                                case 4:
                                    return s.label++, {value: i[1], done: !1};
                                case 5:
                                    s.label++, r = i[1], i = [0];
                                    continue;
                                case 7:
                                    i = s.ops.pop(), s.trys.pop();
                                    continue;
                                default:
                                    if (!(o = s.trys, (o = o.length > 0 && o[o.length - 1]) || 6 !== i[0] && 2 !== i[0])) {
                                        s = 0;
                                        continue
                                    }
                                    if (3 === i[0] && (!o || i[1] > o[0] && i[1] < o[3])) {
                                        s.label = i[1];
                                        break
                                    }
                                    if (6 === i[0] && s.label < o[1]) {
                                        s.label = o[1], o = i;
                                        break
                                    }
                                    if (o && s.label < o[2]) {
                                        s.label = o[2], s.ops.push(i);
                                        break
                                    }
                                    o[2] && s.ops.pop(), s.trys.pop();
                                    continue
                            }
                            i = t.call(e, s)
                        } catch (e) {
                            i = [6, e], r = 0
                        } finally {
                            n = o = 0
                        }
                        if (5 & i[0]) throw i[1];
                        return {value: i[0] ? i[1] : void 0, done: !0}
                    }([i, c])
                }
            }
        }, R = function () {
            function e(e, t) {
                void 0 === e && (e = document.documentElement), void 0 === t && (t = L), this.element = e, this.schema = t, this.dispatcher = new o(this), this.router = new P(this)
            }

            return e.start = function (t, n) {
                var r = new e(t, n);
                return r.start(), r
            }, e.prototype.start = function () {
                return j(this, void 0, void 0, (function () {
                    return k(this, (function (e) {
                        switch (e.label) {
                            case 0:
                                return [4, new Promise((function (e) {
                                    "loading" == document.readyState ? document.addEventListener("DOMContentLoaded", e) : e()
                                }))];
                            case 1:
                                return e.sent(), this.router.start(), this.dispatcher.start(), [2]
                        }
                    }))
                }))
            }, e.prototype.stop = function () {
                this.router.stop(), this.dispatcher.stop()
            }, e.prototype.register = function (e, t) {
                this.load({identifier: e, controllerConstructor: t})
            }, e.prototype.load = function (e) {
                for (var t = this, n = [], r = 1; r < arguments.length; r++) n[r - 1] = arguments[r];
                var o = Array.isArray(e) ? e : [e].concat(n);
                o.forEach((function (e) {
                    return t.router.loadDefinition(e)
                }))
            }, e.prototype.unload = function (e) {
                for (var t = this, n = [], r = 1; r < arguments.length; r++) n[r - 1] = arguments[r];
                var o = Array.isArray(e) ? e : [e].concat(n);
                o.forEach((function (e) {
                    return t.router.unloadIdentifier(e)
                }))
            }, Object.defineProperty(e.prototype, "controllers", {
                get: function () {
                    return this.router.contexts.map((function (e) {
                        return e.controller
                    }))
                }, enumerable: !0, configurable: !0
            }), e.prototype.getControllerForElementAndIdentifier = function (e, t) {
                var n = this.router.getContextForElementAndIdentifier(e, t);
                return n ? n.controller : null
            }, e.prototype.handleError = function (e, t, n) {
                console.error("%s\n\n%o\n\n%o", t, e, n)
            }, e
        }();

    function I(e) {
        var t = e.prototype;
        (function (e) {
            var t = function (e) {
                var t = [];
                for (; e;) t.push(e), e = Object.getPrototypeOf(e);
                return t
            }(e);
            return Array.from(t.reduce((function (e, t) {
                return function (e) {
                    var t = e.targets;
                    return Array.isArray(t) ? t : []
                }(t).forEach((function (t) {
                    return e.add(t)
                })), e
            }), new Set))
        })(e).forEach((function (e) {
            var n, r, o;
            return r = t, (n = {})[e + "Target"] = {
                get: function () {
                    var t = this.targets.find(e);
                    if (t) return t;
                    throw new Error('Missing target element "' + this.identifier + "." + e + '"')
                }
            }, n[e + "Targets"] = {
                get: function () {
                    return this.targets.findAll(e)
                }
            }, n["has" + function (e) {
                return e.charAt(0).toUpperCase() + e.slice(1)
            }(e) + "Target"] = {
                get: function () {
                    return this.targets.has(e)
                }
            }, o = n, void Object.keys(o).forEach((function (e) {
                if (!(e in r)) {
                    var t = o[e];
                    Object.defineProperty(r, e, t)
                }
            }))
        }))
    }

    var M, V = function () {
        function e(e) {
            this.context = e
        }

        return e.bless = function () {
            I(this)
        }, Object.defineProperty(e.prototype, "application", {
            get: function () {
                return this.context.application
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "scope", {
            get: function () {
                return this.context.scope
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "element", {
            get: function () {
                return this.scope.element
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "identifier", {
            get: function () {
                return this.scope.identifier
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "targets", {
            get: function () {
                return this.scope.targets
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "data", {
            get: function () {
                return this.scope.data
            }, enumerable: !0, configurable: !0
        }), e.prototype.initialize = function () {
        }, e.prototype.connect = function () {
        }, e.prototype.disconnect = function () {
        }, e.targets = [], e
    }();
    var B = "undefined" == typeof document ? void 0 : document, D = !!B && "content" in B.createElement("template"),
        F = !!B && B.createRange && "createContextualFragment" in B.createRange();

    function U(e) {
        return e = e.trim(), D ? function (e) {
            var t = B.createElement("template");
            return t.innerHTML = e, t.content.childNodes[0]
        }(e) : F ? function (e) {
            return M || (M = B.createRange()).selectNode(B.body), M.createContextualFragment(e).childNodes[0]
        }(e) : function (e) {
            var t = B.createElement("body");
            return t.innerHTML = e, t.childNodes[0]
        }(e)
    }

    function $(e, t) {
        var n, r, o = e.nodeName, i = t.nodeName;
        return o === i || (n = o.charCodeAt(0), r = i.charCodeAt(0), n <= 90 && r >= 97 ? o === i.toUpperCase() : r <= 90 && n >= 97 && i === o.toUpperCase())
    }

    function z(e, t, n) {
        e[n] !== t[n] && (e[n] = t[n], e[n] ? e.setAttribute(n, "") : e.removeAttribute(n))
    }

    var W = {
        OPTION: function (e, t) {
            var n = e.parentNode;
            if (n) {
                var r = n.nodeName.toUpperCase();
                "OPTGROUP" === r && (r = (n = n.parentNode) && n.nodeName.toUpperCase()), "SELECT" !== r || n.hasAttribute("multiple") || (e.hasAttribute("selected") && !t.selected && (e.setAttribute("selected", "selected"), e.removeAttribute("selected")), n.selectedIndex = -1)
            }
            z(e, t, "selected")
        }, INPUT: function (e, t) {
            z(e, t, "checked"), z(e, t, "disabled"), e.value !== t.value && (e.value = t.value), t.hasAttribute("value") || e.removeAttribute("value")
        }, TEXTAREA: function (e, t) {
            var n = t.value;
            e.value !== n && (e.value = n);
            var r = e.firstChild;
            if (r) {
                var o = r.nodeValue;
                if (o == n || !n && o == e.placeholder) return;
                r.nodeValue = n
            }
        }, SELECT: function (e, t) {
            if (!t.hasAttribute("multiple")) {
                for (var n, r, o = -1, i = 0, s = e.firstChild; s;) if ("OPTGROUP" === (r = s.nodeName && s.nodeName.toUpperCase())) s = (n = s).firstChild; else {
                    if ("OPTION" === r) {
                        if (s.hasAttribute("selected")) {
                            o = i;
                            break
                        }
                        i++
                    }
                    !(s = s.nextSibling) && n && (s = n.nextSibling, n = null)
                }
                e.selectedIndex = o
            }
        }
    };

    function q() {
    }

    function K(e) {
        if (e) return e.getAttribute && e.getAttribute("id") || e.id
    }

    var H = function (e) {
        return function (t, n, r) {
            if (r || (r = {}), "string" == typeof n) if ("#document" === t.nodeName || "HTML" === t.nodeName || "BODY" === t.nodeName) {
                var o = n;
                (n = B.createElement("html")).innerHTML = o
            } else n = U(n);
            var i = r.getNodeKey || K, s = r.onBeforeNodeAdded || q, c = r.onNodeAdded || q,
                a = r.onBeforeElUpdated || q, l = r.onElUpdated || q, u = r.onBeforeNodeDiscarded || q,
                f = r.onNodeDiscarded || q, d = r.onBeforeElChildrenUpdated || q, p = !0 === r.childrenOnly,
                h = Object.create(null), m = [];

            function y(e) {
                m.push(e)
            }

            function b(e, t, n) {
                !1 !== u(e) && (t && t.removeChild(e), f(e), function e(t, n) {
                    if (1 === t.nodeType) for (var r = t.firstChild; r;) {
                        var o = void 0;
                        n && (o = i(r)) ? y(o) : (f(r), r.firstChild && e(r, n)), r = r.nextSibling
                    }
                }(e, n))
            }

            function g(e) {
                c(e);
                for (var t = e.firstChild; t;) {
                    var n = t.nextSibling, r = i(t);
                    if (r) {
                        var o = h[r];
                        o && $(t, o) ? (t.parentNode.replaceChild(o, t), v(o, t)) : g(t)
                    } else g(t);
                    t = n
                }
            }

            function v(t, n, r) {
                var o = i(n);
                if (o && delete h[o], !r) {
                    if (!1 === a(t, n)) return;
                    if (e(t, n), l(t), !1 === d(t, n)) return
                }
                "TEXTAREA" !== t.nodeName ? function (e, t) {
                    var n, r, o, c, a, l = t.firstChild, u = e.firstChild;
                    e:for (; l;) {
                        for (c = l.nextSibling, n = i(l); u;) {
                            if (o = u.nextSibling, l.isSameNode && l.isSameNode(u)) {
                                l = c, u = o;
                                continue e
                            }
                            r = i(u);
                            var f = u.nodeType, d = void 0;
                            if (f === l.nodeType && (1 === f ? (n ? n !== r && ((a = h[n]) ? o === a ? d = !1 : (e.insertBefore(a, u), r ? y(r) : b(u, e, !0), u = a) : d = !1) : r && (d = !1), (d = !1 !== d && $(u, l)) && v(u, l)) : 3 !== f && 8 != f || (d = !0, u.nodeValue !== l.nodeValue && (u.nodeValue = l.nodeValue))), d) {
                                l = c, u = o;
                                continue e
                            }
                            r ? y(r) : b(u, e, !0), u = o
                        }
                        if (n && (a = h[n]) && $(a, l)) e.appendChild(a), v(a, l); else {
                            var p = s(l);
                            !1 !== p && (p && (l = p), l.actualize && (l = l.actualize(e.ownerDocument || B)), e.appendChild(l), g(l))
                        }
                        l = c, u = o
                    }
                    !function (e, t, n) {
                        for (; t;) {
                            var r = t.nextSibling;
                            (n = i(t)) ? y(n) : b(t, e, !0), t = r
                        }
                    }(e, u, r);
                    var m = W[e.nodeName];
                    m && m(e, t)
                }(t, n) : W.TEXTAREA(t, n)
            }

            !function e(t) {
                if (1 === t.nodeType || 11 === t.nodeType) for (var n = t.firstChild; n;) {
                    var r = i(n);
                    r && (h[r] = n), e(n), n = n.nextSibling
                }
            }(t);
            var A, x, E = t, w = E.nodeType, O = n.nodeType;
            if (!p) if (1 === w) 1 === O ? $(t, n) || (f(t), E = function (e, t) {
                for (var n = e.firstChild; n;) {
                    var r = n.nextSibling;
                    t.appendChild(n), n = r
                }
                return t
            }(t, (A = n.nodeName, (x = n.namespaceURI) && "http://www.w3.org/1999/xhtml" !== x ? B.createElementNS(x, A) : B.createElement(A)))) : E = n; else if (3 === w || 8 === w) {
                if (O === w) return E.nodeValue !== n.nodeValue && (E.nodeValue = n.nodeValue), E;
                E = n
            }
            if (E === n) f(t); else {
                if (n.isSameNode && n.isSameNode(E)) return;
                if (v(E, n, p), m) for (var _ = 0, S = m.length; _ < S; _++) {
                    var C = h[m[_]];
                    C && b(C, C.parentNode, !1)
                }
            }
            return !p && E !== t && t.parentNode && (E.actualize && (E = E.actualize(t.ownerDocument || B)), t.parentNode.replaceChild(E, t)), E
        }
    }((function (e, t) {
        var n, r, o, i, s = t.attributes;
        if (11 !== t.nodeType && 11 !== e.nodeType) {
            for (var c = s.length - 1; c >= 0; c--) r = (n = s[c]).name, o = n.namespaceURI, i = n.value, o ? (r = n.localName || r, e.getAttributeNS(o, r) !== i && ("xmlns" === n.prefix && (r = n.name), e.setAttributeNS(o, r, i))) : e.getAttribute(r) !== i && e.setAttribute(r, i);
            for (var a = e.attributes, l = a.length - 1; l >= 0; l--) r = (n = a[l]).name, (o = n.namespaceURI) ? (r = n.localName || r, t.hasAttributeNS(o, r) || e.removeAttributeNS(o, r)) : t.hasAttribute(r) || e.removeAttribute(r)
        }
    }));
    const G = {INPUT: !0, TEXTAREA: !0, SELECT: !0}, Q = {INPUT: !0, TEXTAREA: !0, OPTION: !0}, J = {
        "datetime-local": !0,
        "select-multiple": !0,
        "select-one": !0,
        color: !0,
        date: !0,
        datetime: !0,
        email: !0,
        month: !0,
        number: !0,
        password: !0,
        range: !0,
        search: !0,
        tel: !0,
        text: !0,
        textarea: !0,
        time: !0,
        url: !0,
        week: !0
    }, X = e => {
        const t = (e && e.nodeType === Node.ELEMENT_NODE ? e : document.querySelector(e)) || te;
        t && t.focus && t.focus()
    }, Y = (e, t, n = {}) => {
        const r = new CustomEvent(t, {bubbles: !0, cancelable: !0, detail: n});
        e.dispatchEvent(r), window.jQuery && window.jQuery(e).trigger(t, n)
    }, Z = e => Array(e).flat(), ee = (e, t) => {
        Array.from(e.selectAll ? e.element : [e.element]).forEach(t)
    };
    let te;
    const ne = [(e, t, n) => !(!Q[t.tagName] && t.isEqualNode(n)), (e, t, n) => {
        const {permanentAttributeName: r} = e;
        if (!r) return !0;
        const o = t.closest(`[${r}]`);
        if (!o && (G[(i = t).tagName] && J[i.type]) && t === te) {
            const e = {value: !0};
            return Array.from(n.attributes).forEach(n => {
                e[n.name] || t.setAttribute(n.name, n.value)
            }), !1
        }
        var i;
        return !o
    }], re = [], oe = e => (t, n) => !ne.map(r => "function" != typeof r || r(e, t, n)).includes(!1), ie = e => t => {
        re.forEach(n => {
            "function" == typeof n && n(e, t)
        })
    }, se = {
        append: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-append", e);
                const {html: n, focusSelector: r} = e;
                e.cancel || (t.insertAdjacentHTML("beforeend", n), X(r)), Y(t, "cable-ready:after-append", e)
            })
        }, graft: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-graft", e);
                const {parent: n, focusSelector: r} = e, o = document.querySelector(n);
                !e.cancel && o && (o.appendChild(t), X(r)), Y(t, "cable-ready:after-graft", e)
            })
        }, innerHtml: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-inner-html", e);
                const {html: n, focusSelector: r} = e;
                e.cancel || (t.innerHTML = n, X(r)), Y(t, "cable-ready:after-inner-html", e)
            })
        }, insertAdjacentHtml: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-insert-adjacent-html", e);
                const {html: n, position: r, focusSelector: o} = e;
                e.cancel || (t.insertAdjacentHTML(r || "beforeend", n), X(o)), Y(t, "cable-ready:after-insert-adjacent-html", e)
            })
        }, insertAdjacentText: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-insert-adjacent-text", e);
                const {text: n, position: r, focusSelector: o} = e;
                e.cancel || (t.insertAdjacentText(r || "beforeend", n), X(o)), Y(t, "cable-ready:after-insert-adjacent-text", e)
            })
        }, morph: e => {
            ee(e, t => {
                const {html: n} = e, r = document.createElement("template");
                r.innerHTML = String(n).trim(), e.content = r.content, Y(t, "cable-ready:before-morph", e);
                const {childrenOnly: o, focusSelector: i} = e, s = t.parentElement,
                    c = Array.from(s.children).indexOf(t);
                e.cancel || (H(t, o ? r.content : r.innerHTML, {
                    childrenOnly: !!o,
                    onBeforeElUpdated: oe(e),
                    onElUpdated: ie(e)
                }), X(i)), Y(s.children[c], "cable-ready:after-morph", e)
            })
        }, outerHtml: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-outer-html", e);
                const {html: n, focusSelector: r} = e, o = t.parentElement, i = Array.from(o.children).indexOf(t);
                e.cancel || (t.outerHTML = n, X(r)), Y(o.children[i], "cable-ready:after-outer-html", e)
            })
        }, prepend: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-prepend", e);
                const {html: n, focusSelector: r} = e;
                e.cancel || (t.insertAdjacentHTML("afterbegin", n), X(r)), Y(t, "cable-ready:after-prepend", e)
            })
        }, remove: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-remove", e);
                const {focusSelector: n} = e;
                e.cancel || (t.remove(), X(n)), Y(document, "cable-ready:after-remove", e)
            })
        }, replace: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-replace", e);
                const {html: n, focusSelector: r} = e, o = t.parentElement, i = Array.from(o.children).indexOf(t);
                e.cancel || (t.outerHTML = n, X(r)), Y(o.children[i], "cable-ready:after-replace", e)
            })
        }, textContent: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-text-content", e);
                const {text: n, focusSelector: r} = e;
                e.cancel || (t.textContent = n, X(r)), Y(t, "cable-ready:after-text-content", e)
            })
        }, addCssClass: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-add-css-class", e);
                const {name: n} = e;
                e.cancel || t.classList.add(...Z(n)), Y(t, "cable-ready:after-add-css-class", e)
            })
        }, removeAttribute: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-remove-attribute", e);
                const {name: n} = e;
                e.cancel || t.removeAttribute(n), Y(t, "cable-ready:after-remove-attribute", e)
            })
        }, removeCssClass: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-remove-css-class", e);
                const {name: n} = e;
                e.cancel || t.classList.remove(...Z(n)), Y(t, "cable-ready:after-remove-css-class", e)
            })
        }, setAttribute: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-set-attribute", e);
                const {name: n, value: r} = e;
                e.cancel || t.setAttribute(n, r), Y(t, "cable-ready:after-set-attribute", e)
            })
        }, setDatasetProperty: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-set-dataset-property", e);
                const {name: n, value: r} = e;
                e.cancel || (t.dataset[n] = r), Y(t, "cable-ready:after-set-dataset-property", e)
            })
        }, setProperty: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-set-property", e);
                const {name: n, value: r} = e;
                !e.cancel && n in t && (t[n] = r), Y(t, "cable-ready:after-set-property", e)
            })
        }, setStyle: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-set-style", e);
                const {name: n, value: r} = e;
                e.cancel || (t.style[n] = r), Y(t, "cable-ready:after-set-style", e)
            })
        }, setStyles: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-set-styles", e);
                const {styles: n} = e;
                for (let [r, o] of Object.entries(n)) e.cancel || (t.style[r] = o);
                Y(t, "cable-ready:after-set-styles", e)
            })
        }, setValue: e => {
            ee(e, t => {
                Y(t, "cable-ready:before-set-value", e);
                const {value: n} = e;
                e.cancel || (t.value = n), Y(t, "cable-ready:after-set-value", e)
            })
        }, dispatchEvent: e => {
            ee(e, t => {
                const {name: n, detail: r} = e;
                Y(t, n, r)
            })
        }, clearStorage: e => {
            Y(document, "cable-ready:before-clear-storage", e);
            const {type: t} = e, n = "session" === t ? sessionStorage : localStorage;
            e.cancel || n.clear(), Y(document, "cable-ready:after-clear-storage", e)
        }, go: e => {
            Y(window, "cable-ready:before-go", e);
            const {delta: t} = e;
            e.cancel || history.go(t), Y(window, "cable-ready:after-go", e)
        }, pushState: e => {
            Y(window, "cable-ready:before-push-state", e);
            const {state: t, title: n, url: r} = e;
            e.cancel || history.pushState(t || {}, n || "", r), Y(window, "cable-ready:after-push-state", e)
        }, removeStorageItem: e => {
            Y(document, "cable-ready:before-remove-storage-item", e);
            const {key: t, type: n} = e, r = "session" === n ? sessionStorage : localStorage;
            e.cancel || r.removeItem(t), Y(document, "cable-ready:after-remove-storage-item", e)
        }, replaceState: e => {
            Y(window, "cable-ready:before-replace-state", e);
            const {state: t, title: n, url: r} = e;
            e.cancel || history.replaceState(t || {}, n || "", r), Y(window, "cable-ready:after-replace-state", e)
        }, scrollIntoView: e => {
            const {element: t} = e;
            Y(t, "cable-ready:before-scroll-into-view", e), e.cancel || t.scrollIntoView(e), Y(t, "cable-ready:after-scroll-into-view", e)
        }, setCookie: e => {
            Y(document, "cable-ready:before-set-cookie", e);
            const {cookie: t} = e;
            e.cancel || (document.cookie = t), Y(document, "cable-ready:after-set-cookie", e)
        }, setFocus: e => {
            const {element: t} = e;
            Y(t, "cable-ready:before-set-focus", e), e.cancel || X(t), Y(t, "cable-ready:after-set-focus", e)
        }, setStorageItem: e => {
            Y(document, "cable-ready:before-set-storage-item", e);
            const {key: t, value: n, type: r} = e, o = "session" === r ? sessionStorage : localStorage;
            e.cancel || o.setItem(t, n), Y(document, "cable-ready:after-set-storage-item", e)
        }, consoleLog: e => {
            const {message: t, level: n} = e;
            n && ["warn", "info", "error"].includes(n) ? console[n](t) : console.log(t)
        }, notification: e => {
            Y(document, "cable-ready:before-notification", e);
            const {title: t, options: n} = e;
            e.cancel || Notification.requestPermission().then(r => {
                e.permission = r, "granted" === r && new Notification(t || "", n)
            }), Y(document, "cable-ready:after-notification", e)
        }, playSound: e => {
            Y(document, "cable-ready:before-play-sound", e);
            const {src: t} = e;
            if (e.cancel) Y(document, "cable-ready:after-play-sound", e); else {
                const n = () => {
                    document.audio.removeEventListener("canplaythrough", n), document.audio.play()
                }, r = () => {
                    document.audio.removeEventListener("ended", n), Y(document, "cable-ready:after-play-sound", e)
                };
                document.audio.addEventListener("canplaythrough", n), document.audio.addEventListener("ended", r), document.audio.src = t, document.audio.play()
            }
        }
    }, ce = (e, t = {emitMissingElementWarnings: !0}) => {
        for (let r in e) if (e.hasOwnProperty(r)) {
            const o = e[r];
            for (let e = 0; e < o.length; e++) {
                const i = o[e];
                try {
                    i.selector ? i.element = i.xpath ? (n = i.selector, document.evaluate(n, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) : document[i.selectAll ? "querySelectorAll" : "querySelector"](i.selector) : i.element = document, (i.element || t.emitMissingElementWarnings) && (te = document.activeElement, se[r](i))
                } catch (e) {
                    i.element ? (console.error(`CableReady detected an error in ${r}: ${e.message}. If you need to support older browsers make sure you've included the corresponding polyfills. https://docs.stimulusreflex.com/setup#polyfills-for-ie11.`), console.error(e)) : console.log(`CableReady ${r} failed due to missing DOM element for selector: '${i.selector}'`)
                }
            }
        }
        var n
    };
    document.addEventListener("DOMContentLoaded", (function () {
        if (!document.audio) {
            document.audio = new Audio("data:audio/mpeg;base64,//OExAAAAAAAAAAAAEluZm8AAAAHAAAABAAAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/P39/f39/f39/f39/f39/f39/f39/f39/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/AAAAAAAAAAAAAAAAAAAAAAAAAAAAJAa/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//MUxAAAAANIAAAAAExBTUUzLjk2LjFV//MUxAsAAANIAAAAAFVVVVVVVVVVVVVV//MUxBYAAANIAAAAAFVVVVVVVVVVVVVV//MUxCEAAANIAAAAAFVVVVVVVVVVVVVV");
            const e = () => {
                document.body.removeEventListener("click", e), document.body.removeEventListener("touchstart", e), document.audio.play().then(() => {
                }).catch(() => {
                })
            };
            document.body.addEventListener("click", e), document.body.addEventListener("touchstart", e)
        }
    }));
    var ae = ce;
    const le = {
        reflexAttribute: "data-reflex",
        reflexPermanentAttribute: "data-reflex-permanent",
        reflexRootAttribute: "data-reflex-root",
        reflexDatasetAttribute: "data-reflex-dataset"
    };
    var ue = n(0);

    function fe() {
        return function e(t, n = 0) {
            return t ? n > 3 ? null : function (e) {
                if (e) try {
                    return "Consumer" === e.constructor.name && e.connect && e.disconnect && e.send
                } catch (e) {
                }
                return !1
            }(t) ? t : Object.values(t).map(t => e(t, n + 1)).find(e => e) : null
        }(window) || Object(ue.createConsumer)()
    }

    const de = (e, t = !0) => "string" != typeof e ? "" : (e = e.replace(/[\s_](.)/g, e => e.toUpperCase()).replace(/[\s_]/g, "").replace(/^(.)/, e => e.toLowerCase()), t && (e = e.substr(0, 1).toUpperCase() + e.substr(1)), e),
        pe = (e, t) => {
            document.dispatchEvent(new CustomEvent(e, {
                bubbles: !0,
                cancelable: !1,
                detail: t
            })), window.jQuery && window.jQuery(document).trigger(e, t)
        }, he = e => {
            if ("" !== e.id) return "//*[@id='" + e.id + "']";
            if (e === document.body) return "/html/body";
            let t = 0;
            const n = e.parentNode.childNodes;
            for (var r = 0; r < n.length; r++) {
                const o = n[r];
                if (o === e) {
                    return `${he(e.parentNode)}/${e.tagName.toLowerCase()}[${t + 1}]`
                }
                1 === o.nodeType && o.tagName === e.tagName && t++
            }
        }, me = e => document.evaluate(e, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    let ye = !1;
    var be = {
        get enabled() {
            return ye
        }, get disabled() {
            return !ye
        }, get value() {
            return ye
        }, set(e) {
            ye = !!e
        }, set debug(e) {
            ye = !!e
        }
    };
    const ge = (e, t, n, r) => {
        if (!n || !n.reflexData[r]) return;
        const o = n.reflexController[r], i = n.reflexData[r].target, s = i.split("#")[1],
            c = o[["before", "after", "finalize"].includes(e) ? `${e}${de(s)}` : `${de(s, !1)}${de(e)}`],
            a = o[["before", "after", "finalize"].includes(e) ? `${e}Reflex` : `reflex${de(e)}`];
        "function" == typeof c && c.call(o, t, i, n.reflexError[r], r), "function" == typeof a && a.call(o, t, i, n.reflexError[r], r), reflexes[r] && e === reflexes[r].finalStage && (Reflect.deleteProperty(n.reflexController, r), Reflect.deleteProperty(n.reflexData, r), Reflect.deleteProperty(n.reflexError, r), Reflect.deleteProperty(reflexes, r))
    };
    document.addEventListener("stimulus-reflex:before", e => ge("before", e.detail.element, e.detail.controller.element, e.detail.reflexId), !0), document.addEventListener("stimulus-reflex:success", e => {
        ge("success", e.detail.element, e.detail.controller.element, e.detail.reflexId), ve("after", e.detail.element, e.detail.controller.element, e.detail.reflexId)
    }, !0), document.addEventListener("stimulus-reflex:nothing", e => {
        ge("success", e.detail.element, e.detail.controller.element, e.detail.reflexId), ve("after", e.detail.element, e.detail.controller.element, e.detail.reflexId)
    }, !0), document.addEventListener("stimulus-reflex:error", e => {
        ge("error", e.detail.element, e.detail.controller.element, e.detail.reflexId), ve("after", e.detail.element, e.detail.controller.element, e.detail.reflexId)
    }, !0), document.addEventListener("stimulus-reflex:halted", e => ge("halted", e.detail.element, e.detail.controller.element, e.detail.reflexId), !0), document.addEventListener("stimulus-reflex:after", e => ge("after", e.detail.element, e.detail.controller.element, e.detail.reflexId), !0), document.addEventListener("stimulus-reflex:finalize", e => ge("finalize", e.detail.element, e.detail.controller.element, e.detail.reflexId), !0);
    const ve = (e, t, n, r) => {
        if (!n) return void (be.enabled && !reflexes[r].warned && (console.warn(`StimulusReflex was not able execute callbacks or emit events for "${e}" or later life-cycle stages for this Reflex. The StimulusReflex Controller Element is no longer present in the DOM. Could you move the StimulusReflex Controller to an element higher in your DOM?`), reflexes[r].warned = !0));
        if (!n.reflexController || n.reflexController && !n.reflexController[r]) return void (be.enabled && !reflexes[r].warned && (console.warn(`StimulusReflex detected that the StimulusReflex Controller responsible for this Reflex has been replaced with a new instance. Callbacks and events for "${e}" or later life-cycle stages cannot be executed.`), reflexes[r].warned = !0));
        const {target: o} = n.reflexData[r] || {}, i = `stimulus-reflex:${e}`,
            s = {reflex: o, controller: n.reflexController[r] || {}, reflexId: r, element: t};
        n.dispatchEvent(new CustomEvent(i, {
            bubbles: !0,
            cancelable: !1,
            detail: s
        })), window.jQuery && window.jQuery(n).trigger(i, s)
    }, Ae = (e = []) => {
        const t = e.filter(e => e && String(e).length).map(e => e.trim()).join(" ").trim();
        return t.length ? t : null
    }, xe = e => e && e.length ? e.split(" ").filter(e => e.trim().length) : [], Ee = e => {
        let t = Array.from(e.attributes).reduce((e, t) => (e[t.name] = t.value, e), {});
        if (t.checked = !!e.checked, t.selected = !!e.selected, t.tag_name = e.tagName, e.tagName.match(/select/i) || (e => !!["checkbox", "radio"].includes(e.type) && document.querySelectorAll(`input[type="${e.type}"][name="${e.name}"]`).length > 1)(e)) {
            const n = (e => Array.from(e.querySelectorAll("option:checked")).concat(Array.from(document.querySelectorAll(`input[type="${e.type}"][name="${e.name}"]`)).filter(e => e.checked)).map(e => e.value))(e);
            t.values = n, t.value = n.join(",")
        } else t.value = e.value;
        return t
    }, we = e => {
        let t = {};
        return e && e.attributes && Array.from(e.attributes).forEach(e => {
            e.name.startsWith("data-") && (t[e.name] = e.value)
        }), t
    }, Oe = (e, t) => xe(t.getAttribute(e.schema.controllerAttribute)).reduce((n, r) => {
        const o = e.getControllerForElementAndIdentifier(t, r);
        return o && o.StimulusReflex && n.push(o), n
    }, []);
    var _e = {
        request: function (e, t, n, r, o, i) {
            reflexes[e].timestamp = new Date, console.log(`??? stimulus ??? ${t}`, {
                reflexId: e,
                args: n,
                controller: r,
                element: o,
                controllerElement: i
            })
        }, success: function (e) {
            const {detail: t} = e || {}, {selector: n} = t || {}, {
                    reflexId: r,
                    target: o,
                    morph: i,
                    serverMessage: s
                } = t.stimulusReflex || {}, c = reflexes[r],
                a = c.totalOperations > 1 ? ` ${c.completedOperations}/${c.totalOperations}` : "",
                l = c.timestamp ? `in ${new Date - c.timestamp}ms` : "CLONED",
                u = e.type.split(":")[1].split("-").slice(1).join("_"), f = s && "halted" === s.subject || !1;
            console.log(`??? reflex ??? ${o} ??? ${n || "???"}${a} ${l}`, {reflexId: r, morph: i, operation: u, halted: f})
        }, error: function (e) {
            const {detail: t} = e || {}, {reflexId: n, target: r, serverMessage: o} = t.stimulusReflex || {},
                i = reflexes[n], s = i.timestamp ? `in ${new Date - i.timestamp}ms` : "CLONED", c = t.stimulusReflex;
            console.log(`??? reflex ??? ${r} ${s} %cERROR: ${o.body}`, "color: #f00;", {reflexId: n, payload: c})
        }
    };
    const Se = () => {
    };
    let Ce, Te, Ne, Pe, Le = !1;
    window.reflexes = {};
    const je = e => {
        Object.assign(e, {
            isActionCableConnectionOpen() {
                return this.StimulusReflex.subscription.consumer.connection.isOpen()
            }, stimulate() {
                const e = location.href, t = Array.from(arguments),
                    n = t.shift() || "StimulusReflex::Reflex#default_reflex", r = this.element,
                    o = t[0] && t[0].nodeType === Node.ELEMENT_NODE ? t.shift() : r;
                if ("number" === o.type && o.validity && o.validity.badInput) return void (be.enabled && console.warn("Reflex aborted: invalid numeric input"));
                const i = {};
                if (t[0] && "object" == typeof t[0] && Object.keys(t[0]).filter(e => ["attrs", "selectors", "reflexId", "resolveLate", "serializeForm"].includes(e)).length) {
                    const e = t.shift();
                    Object.keys(e).forEach(t => i[t] = e[t])
                }
                const s = i.attrs || Ee(o), c = i.reflexId || (() => {
                    const e = window.crypto || window.msCrypto;
                    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, t => (t ^ e.getRandomValues(new Uint8Array(1))[0] & 15 >> t / 4).toString(16))
                })();
                let a = i.selectors || Be(o);
                "string" == typeof a && (a = [a]);
                const l = i.resolveLate || !1, u = Ce.schema.reflexDatasetAttribute, f = ((e, t = null) => {
                    let n = we(e) || {};
                    const r = t && e.attributes[t];
                    if (r && "combined" === r.value) {
                        let t = e.parentElement;
                        for (; t;) n = {...we(t), ...n}, t = t.parentElement
                    }
                    return n
                })(o, u), d = he(r), p = he(o), h = {
                    target: n,
                    args: t,
                    url: e,
                    attrs: s,
                    dataset: f,
                    selectors: a,
                    reflexId: c,
                    resolveLate: l,
                    xpathController: d,
                    xpathElement: p,
                    reflexController: this.identifier,
                    permanentAttributeName: Ce.schema.reflexPermanentAttribute
                }, {subscription: m} = this.StimulusReflex;
                if (!this.isActionCableConnectionOpen()) throw"The ActionCable connection is not open! `this.isActionCableConnectionOpen()` must return true before calling `this.stimulate()`";
                if (!Le) throw"The ActionCable channel subscription for StimulusReflex was rejected.";
                r.reflexController = r.reflexController || {}, r.reflexData = r.reflexData || {}, r.reflexError = r.reflexError || {}, r.reflexController[c] = this, r.reflexData[c] = h, ve("before", o, r, c), setTimeout(() => {
                    const {params: e} = r.reflexData[c] || {}, t = !1 === i.serializeForm ? "" : ((e, t = {}) => {
                        if (!e) return "";
                        const n = t.w || window, {element: r} = t, o = new n.FormData(e),
                            i = Array.from(o, e => e.map(encodeURIComponent).join("=")),
                            s = e.querySelector("input[type=submit]");
                        return r && r.name && "INPUT" === r.nodeName && "submit" === r.type ? i.push(`${encodeURIComponent(r.name)}=${encodeURIComponent(r.value)}`) : s && s.name && i.push(`${encodeURIComponent(s.name)}=${encodeURIComponent(s.value)}`), Array.from(new Set(i)).join("&")
                    })(o.closest("form"), {element: o});
                    r.reflexData[c] = {...h, params: e, formData: t}, m.send(r.reflexData[c])
                });
                const y = ke(h);
                return be.enabled && _e.request(c, n, t, this.context.scope.identifier, o, r), y
            }, __perform(e) {
                let t, n = e.target;
                for (; n && !t;) t = n.getAttribute(Ce.schema.reflexAttribute), t && t.trim().length || (n = n.parentElement);
                const r = xe(t).find(t => t.split("->")[0] === e.type);
                r && (e.preventDefault(), e.stopPropagation(), this.stimulate(r.split("->")[1], n))
            }
        })
    }, ke = e => {
        const {reflexId: t} = e;
        reflexes[t] = {finalStage: "finalize"};
        const n = new Promise((n, r) => {
            reflexes[t].promise = {resolve: n, reject: r, data: e}
        });
        return n.reflexId = t, be.enabled && n.catch(Se), n
    }, Re = (e, t = {}) => {
        e.StimulusReflex = {...t, channel: "StimulusReflex::Channel"}, (e => {
            Te = Te || fe();
            const {channel: t} = e.StimulusReflex, n = {channel: t, ...Ne}, r = JSON.stringify(n);
            e.StimulusReflex.subscription = Te.subscriptions.findAll(r)[0] || Te.subscriptions.create(n, {
                received: e => {
                    if (!e.cableReady) return;
                    let t = {};
                    for (let n in e.operations) if (e.operations.hasOwnProperty(n)) {
                        for (let r = e.operations[n].length - 1; r >= 0; r--) (e.operations[n][r].stimulusReflex || e.operations[n][r].detail && e.operations[n][r].detail.stimulusReflex) && (t[n] = t[n] || [], t[n].push(e.operations[n][r]), e.operations[n].splice(r, 1));
                        e.operations[n].length || Reflect.deleteProperty(e.operations, n)
                    }
                    let n, r = 0;
                    if ([t.dispatchEvent, t.morph, t.innerHtml].forEach(e => {
                        if (e && e.length) {
                            const t = Array.from(new Set(e.map(e => e.detail ? e.detail.stimulusReflex.url : e.stimulusReflex.url)));
                            if (1 !== t.length || t[0] !== location.href) return;
                            r += e.length, n || (n = e[0].detail ? e[0].detail.stimulusReflex : e[0].stimulusReflex)
                        }
                    }), n) {
                        const {reflexId: e} = n;
                        if (!reflexes[e] && !Pe) {
                            const t = me(n.xpathController), r = me(n.xpathElement);
                            t.reflexController = t.reflexController || {}, t.reflexData = t.reflexData || {}, t.reflexError = t.reflexError || {}, t.reflexController[e] = Ce.getControllerForElementAndIdentifier(t, n.reflexController), t.reflexData[e] = n, ve("before", r, t, e), ke(n)
                        }
                        reflexes[e] && (reflexes[e].totalOperations = r, reflexes[e].pendingOperations = r, reflexes[e].completedOperations = 0, ae(t))
                    }
                    ae(e.operations)
                }, connected: () => {
                    Le = !0, pe("stimulus-reflex:connected")
                }, rejected: () => {
                    Le = !1, pe("stimulus-reflex:rejected"), be.enabled && console.warn("Channel subscription was rejected.")
                }, disconnected: e => {
                    Le = !1, pe("stimulus-reflex:disconnected", e)
                }
            })
        })(e), je(e)
    };

    class Ie extends V {
        constructor(...e) {
            super(...e), Re(this)
        }
    }

    const Me = ((e, t = 250) => {
        let n;
        return (...r) => {
            clearTimeout(n), n = setTimeout(() => {
                n = null, e(...r)
            }, t)
        }
    })(() => {
        document.querySelectorAll(`[${Ce.schema.reflexAttribute}]`).forEach(e => {
            const t = xe(e.getAttribute(Ce.schema.controllerAttribute)),
                n = xe(e.getAttribute(Ce.schema.reflexAttribute)), r = xe(e.getAttribute(Ce.schema.actionAttribute));
            n.forEach(n => {
                const o = Ve(n, ((e, t) => {
                    let n = [];
                    for (; t;) n = n.concat(Oe(e, t)), t = t.parentElement;
                    return n
                })(Ce, e));
                let i;
                o ? (i = `${n.split("->")[0]}->${o.identifier}#__perform`, r.includes(i) || r.push(i)) : (i = `${n.split("->")[0]}->stimulus-reflex#__perform`, t.includes("stimulus-reflex") || t.push("stimulus-reflex"), r.includes(i) || r.push(i))
            });
            const o = Ae(t), i = Ae(r);
            o && e.getAttribute(Ce.schema.controllerAttribute) != o && e.setAttribute(Ce.schema.controllerAttribute, o), i && e.getAttribute(Ce.schema.actionAttribute) != i && e.setAttribute(Ce.schema.actionAttribute, i)
        }), pe("stimulus-reflex:ready")
    }, 20), Ve = (e, t) => t.find(t => {
        if (t.identifier) return (e => {
            const t = e.match(/(?:.*->)?(.*?)(?:Reflex)?#/);
            return t ? t[1] : ""
        })(e).toLowerCase() === t.identifier.toLowerCase()
    }) || t[0], Be = e => {
        let t = [];
        for (; 0 === t.length && e;) {
            const n = e.getAttribute(Ce.schema.reflexRootAttribute);
            if (n) {
                0 === n.length && e.id && (n = `#${e.id}`);
                const r = n.split(",").filter(e => e.trim().length);
                0 === r.length && console.error(`No value found for ${Ce.schema.reflexRootAttribute}. Add an #id to the element or provide a value for ${Ce.schema.reflexRootAttribute}.`, e), t = t.concat(r.filter(e => document.querySelector(e)))
            }
            e = e.parentElement ? e.parentElement.closest(`[${Ce.schema.reflexRootAttribute}]`) : null
        }
        return t
    };
    if (!document.stimulusReflexInitialized) {
        document.stimulusReflexInitialized = !0, window.addEventListener("load", () => {
            Me(), new MutationObserver(Me).observe(document.documentElement, {
                attributes: !0,
                childList: !0,
                subtree: !0
            })
        });
        const e = e => {
            const {stimulusReflex: t} = e.detail || {};
            if (!t) return;
            const {reflexId: n, xpathElement: r, xpathController: o} = t, i = me(o), s = me(r), c = reflexes[n],
                a = c.promise;
            c.pendingOperations--, c.pendingOperations > 0 || (t.resolveLate || setTimeout(() => a.resolve({
                element: s,
                event: e,
                data: a.data
            })), setTimeout(() => ve("success", s, i, n)))
        };
        document.addEventListener("cable-ready:before-inner-html", e), document.addEventListener("cable-ready:before-morph", e);
        const t = e => {
            const {stimulusReflex: t} = e.detail || {};
            if (!t) return;
            const {reflexId: n, xpathElement: r, xpathController: o} = t, i = me(o), s = me(r), c = reflexes[n],
                a = c.promise;
            c.completedOperations++, be.enabled && _e.success(e), c.completedOperations < c.totalOperations || (t.resolveLate && setTimeout(() => a.resolve({
                element: s,
                event: e,
                data: a.data
            })), setTimeout(() => ve("finalize", s, i, n)))
        };
        document.addEventListener("cable-ready:after-inner-html", t), document.addEventListener("cable-ready:after-morph", t), document.addEventListener("stimulus-reflex:server-message", e => {
            const {
                reflexId: t,
                serverMessage: n,
                xpathController: r,
                xpathElement: o
            } = e.detail.stimulusReflex || {}, {subject: i, body: s} = n, c = me(r), a = me(o), l = reflexes[t].promise;
            c.reflexError = c.reflexError || {}, c && "error" === i && (c.reflexError[t] = s), l["error" === i ? "reject" : "resolve"]({
                data: l.data,
                element: a,
                event: e,
                toString: () => s
            }), reflexes[t].finalStage = "halted" === i ? "halted" : "after", be.enabled && _e["error" === i ? "error" : "success"](e), {
                error: !0,
                halted: !0,
                nothing: !0,
                success: !0
            }[i] && ve(i, a, c, t)
        })
    }
    var De = {
        initialize: (e, t = {}) => {
            const {controller: n, consumer: r, debug: o, params: i, isolate: s} = t;
            Te = r, Ne = i, Pe = !!s, Ce = e, Ce.schema = {...le, ...e.schema}, Ce.register("stimulus-reflex", n || Ie), be.set(!!o)
        }, register: Re, get debug() {
            return be.value
        }, set debug(e) {
            be.set(!!e)
        }
    }, Fe = function (e, t) {
        return (Fe = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
            e.__proto__ = t
        } || function (e, t) {
            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
        })(e, t)
    };

    /*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
    function Ue(e, t) {
        function n() {
            this.constructor = e
        }

        Fe(e, t), e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
    }

    function $e(e, t) {
        var n = "function" == typeof Symbol && e[Symbol.iterator];
        if (!n) return e;
        var r, o, i = n.call(e), s = [];
        try {
            for (; (void 0 === t || t-- > 0) && !(r = i.next()).done;) s.push(r.value)
        } catch (e) {
            o = {error: e}
        } finally {
            try {
                r && !r.done && (n = i.return) && n.call(i)
            } finally {
                if (o) throw o.error
            }
        }
        return s
    }

    function ze() {
        for (var e = [], t = 0; t < arguments.length; t++) e = e.concat($e(arguments[t]));
        return e
    }

    var We = function (e, t) {
        this.target = t, this.type = e
    }, qe = function (e) {
        function t(t, n) {
            var r = e.call(this, "error", n) || this;
            return r.message = t.message, r.error = t, r
        }

        return Ue(t, e), t
    }(We), Ke = function (e) {
        function t(t, n, r) {
            void 0 === t && (t = 1e3), void 0 === n && (n = "");
            var o = e.call(this, "close", r) || this;
            return o.wasClean = !0, o.code = t, o.reason = n, o
        }

        return Ue(t, e), t
    }(We), He = function () {
        if ("undefined" != typeof WebSocket) return WebSocket
    }, Ge = {
        maxReconnectionDelay: 1e4,
        minReconnectionDelay: 1e3 + 4e3 * Math.random(),
        minUptime: 5e3,
        reconnectionDelayGrowFactor: 1.3,
        connectionTimeout: 4e3,
        maxRetries: 1 / 0,
        maxEnqueuedMessages: 1 / 0,
        startClosed: !1,
        debug: !1
    }, Qe = function () {
        function e(e, t, n) {
            var r = this;
            void 0 === n && (n = {}), this._listeners = {
                error: [],
                message: [],
                open: [],
                close: []
            }, this._retryCount = -1, this._shouldReconnect = !0, this._connectLock = !1, this._binaryType = "blob", this._closeCalled = !1, this._messageQueue = [], this.onclose = null, this.onerror = null, this.onmessage = null, this.onopen = null, this._handleOpen = function (e) {
                r._debug("open event");
                var t = r._options.minUptime, n = void 0 === t ? Ge.minUptime : t;
                clearTimeout(r._connectTimeout), r._uptimeTimeout = setTimeout((function () {
                    return r._acceptOpen()
                }), n), r._ws.binaryType = r._binaryType, r._messageQueue.forEach((function (e) {
                    return r._ws.send(e)
                })), r._messageQueue = [], r.onopen && r.onopen(e), r._listeners.open.forEach((function (t) {
                    return r._callEventListener(e, t)
                }))
            }, this._handleMessage = function (e) {
                r._debug("message event"), r.onmessage && r.onmessage(e), r._listeners.message.forEach((function (t) {
                    return r._callEventListener(e, t)
                }))
            }, this._handleError = function (e) {
                r._debug("error event", e.message), r._disconnect(void 0, "TIMEOUT" === e.message ? "timeout" : void 0), r.onerror && r.onerror(e), r._debug("exec error listeners"), r._listeners.error.forEach((function (t) {
                    return r._callEventListener(e, t)
                })), r._connect()
            }, this._handleClose = function (e) {
                r._debug("close event"), r._clearTimeouts(), r._shouldReconnect && r._connect(), r.onclose && r.onclose(e), r._listeners.close.forEach((function (t) {
                    return r._callEventListener(e, t)
                }))
            }, this._url = e, this._protocols = t, this._options = n, this._options.startClosed && (this._shouldReconnect = !1), this._connect()
        }

        return Object.defineProperty(e, "CONNECTING", {
            get: function () {
                return 0
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e, "OPEN", {
            get: function () {
                return 1
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e, "CLOSING", {
            get: function () {
                return 2
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e, "CLOSED", {
            get: function () {
                return 3
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "CONNECTING", {
            get: function () {
                return e.CONNECTING
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "OPEN", {
            get: function () {
                return e.OPEN
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "CLOSING", {
            get: function () {
                return e.CLOSING
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "CLOSED", {
            get: function () {
                return e.CLOSED
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "binaryType", {
            get: function () {
                return this._ws ? this._ws.binaryType : this._binaryType
            }, set: function (e) {
                this._binaryType = e, this._ws && (this._ws.binaryType = e)
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "retryCount", {
            get: function () {
                return Math.max(this._retryCount, 0)
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "bufferedAmount", {
            get: function () {
                return this._messageQueue.reduce((function (e, t) {
                    return "string" == typeof t ? e += t.length : t instanceof Blob ? e += t.size : e += t.byteLength, e
                }), 0) + (this._ws ? this._ws.bufferedAmount : 0)
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "extensions", {
            get: function () {
                return this._ws ? this._ws.extensions : ""
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "protocol", {
            get: function () {
                return this._ws ? this._ws.protocol : ""
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "readyState", {
            get: function () {
                return this._ws ? this._ws.readyState : this._options.startClosed ? e.CLOSED : e.CONNECTING
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "url", {
            get: function () {
                return this._ws ? this._ws.url : ""
            }, enumerable: !0, configurable: !0
        }), e.prototype.close = function (e, t) {
            void 0 === e && (e = 1e3), this._closeCalled = !0, this._shouldReconnect = !1, this._clearTimeouts(), this._ws ? this._ws.readyState !== this.CLOSED ? this._ws.close(e, t) : this._debug("close: already closed") : this._debug("close enqueued: no ws instance")
        }, e.prototype.reconnect = function (e, t) {
            this._shouldReconnect = !0, this._closeCalled = !1, this._retryCount = -1, this._ws && this._ws.readyState !== this.CLOSED ? (this._disconnect(e, t), this._connect()) : this._connect()
        }, e.prototype.send = function (e) {
            if (this._ws && this._ws.readyState === this.OPEN) this._debug("send", e), this._ws.send(e); else {
                var t = this._options.maxEnqueuedMessages, n = void 0 === t ? Ge.maxEnqueuedMessages : t;
                this._messageQueue.length < n && (this._debug("enqueue", e), this._messageQueue.push(e))
            }
        }, e.prototype.addEventListener = function (e, t) {
            this._listeners[e] && this._listeners[e].push(t)
        }, e.prototype.dispatchEvent = function (e) {
            var t, n, r = this._listeners[e.type];
            if (r) try {
                for (var o = function (e) {
                    var t = "function" == typeof Symbol && e[Symbol.iterator], n = 0;
                    return t ? t.call(e) : {
                        next: function () {
                            return e && n >= e.length && (e = void 0), {value: e && e[n++], done: !e}
                        }
                    }
                }(r), i = o.next(); !i.done; i = o.next()) {
                    var s = i.value;
                    this._callEventListener(e, s)
                }
            } catch (e) {
                t = {error: e}
            } finally {
                try {
                    i && !i.done && (n = o.return) && n.call(o)
                } finally {
                    if (t) throw t.error
                }
            }
            return !0
        }, e.prototype.removeEventListener = function (e, t) {
            this._listeners[e] && (this._listeners[e] = this._listeners[e].filter((function (e) {
                return e !== t
            })))
        }, e.prototype._debug = function () {
            for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
            this._options.debug && console.log.apply(console, ze(["RWS>"], e))
        }, e.prototype._getNextDelay = function () {
            var e = this._options, t = e.reconnectionDelayGrowFactor,
                n = void 0 === t ? Ge.reconnectionDelayGrowFactor : t, r = e.minReconnectionDelay,
                o = void 0 === r ? Ge.minReconnectionDelay : r, i = e.maxReconnectionDelay,
                s = void 0 === i ? Ge.maxReconnectionDelay : i, c = 0;
            return this._retryCount > 0 && (c = o * Math.pow(n, this._retryCount - 1)) > s && (c = s), this._debug("next delay", c), c
        }, e.prototype._wait = function () {
            var e = this;
            return new Promise((function (t) {
                setTimeout(t, e._getNextDelay())
            }))
        }, e.prototype._getNextUrl = function (e) {
            if ("string" == typeof e) return Promise.resolve(e);
            if ("function" == typeof e) {
                var t = e();
                if ("string" == typeof t) return Promise.resolve(t);
                if (t.then) return t
            }
            throw Error("Invalid URL")
        }, e.prototype._connect = function () {
            var e = this;
            if (!this._connectLock && this._shouldReconnect) {
                this._connectLock = !0;
                var t = this._options, n = t.maxRetries, r = void 0 === n ? Ge.maxRetries : n, o = t.connectionTimeout,
                    i = void 0 === o ? Ge.connectionTimeout : o, s = t.WebSocket, c = void 0 === s ? He() : s;
                if (this._retryCount >= r) this._debug("max retries reached", this._retryCount, ">=", r); else {
                    if (this._retryCount++, this._debug("connect", this._retryCount), this._removeListeners(), void 0 === (a = c) || !a || 2 !== a.CLOSING) throw Error("No valid WebSocket class provided");
                    var a;
                    this._wait().then((function () {
                        return e._getNextUrl(e._url)
                    })).then((function (t) {
                        e._closeCalled || (e._debug("connect", {
                            url: t,
                            protocols: e._protocols
                        }), e._ws = e._protocols ? new c(t, e._protocols) : new c(t), e._ws.binaryType = e._binaryType, e._connectLock = !1, e._addListeners(), e._connectTimeout = setTimeout((function () {
                            return e._handleTimeout()
                        }), i))
                    }))
                }
            }
        }, e.prototype._handleTimeout = function () {
            this._debug("timeout event"), this._handleError(new qe(Error("TIMEOUT"), this))
        }, e.prototype._disconnect = function (e, t) {
            if (void 0 === e && (e = 1e3), this._clearTimeouts(), this._ws) {
                this._removeListeners();
                try {
                    this._ws.close(e, t), this._handleClose(new Ke(e, t, this))
                } catch (e) {
                }
            }
        }, e.prototype._acceptOpen = function () {
            this._debug("accept open"), this._retryCount = 0
        }, e.prototype._callEventListener = function (e, t) {
            "handleEvent" in t ? t.handleEvent(e) : t(e)
        }, e.prototype._removeListeners = function () {
            this._ws && (this._debug("removeListeners"), this._ws.removeEventListener("open", this._handleOpen), this._ws.removeEventListener("close", this._handleClose), this._ws.removeEventListener("message", this._handleMessage), this._ws.removeEventListener("error", this._handleError))
        }, e.prototype._addListeners = function () {
            this._ws && (this._debug("addListeners"), this._ws.addEventListener("open", this._handleOpen), this._ws.addEventListener("close", this._handleClose), this._ws.addEventListener("message", this._handleMessage), this._ws.addEventListener("error", this._handleError))
        }, e.prototype._clearTimeouts = function () {
            clearTimeout(this._connectTimeout), clearTimeout(this._uptimeTimeout)
        }, e
    }();

    class Je {
        constructor(e, t = {}, n) {
            this.consumer = e, this.identifier = JSON.stringify(t), function (e, t) {
                if (null != t) for (let n in t) {
                    const r = t[n];
                    e[n] = r
                }
            }(this, n)
        }

        send(e) {
            return this.consumer.send(e, this.identifier)
        }

        unsubscribe() {
            return this.consumer.subscriptions.remove(this)
        }
    }

    class Xe {
        constructor(e) {
            this.consumer = e, this.subscriptions = []
        }

        findAll(e) {
            return this.subscriptions.filter(t => t.identifier === e)
        }

        add(e) {
            return this.subscriptions.push(e), this.consumer.connection.send(JSON.stringify({
                type: "subscribe",
                channelName: e.identifier
            })), e
        }

        create(e, t) {
            const n = "object" == typeof e ? e : {channel: e}, r = new Je(this.consumer, n, t);
            return this.add(r)
        }

        forget(e) {
            return this.subscriptions = this.subscriptions.filter(t => t !== e), e
        }

        remove(e) {
            return this.forget(e), 0 == this.findAll(e.identifier).length && this.consumer.connection.send(JSON.stringify({
                type: "unsubscribe",
                channelName: e.identifier
            })), e
        }

        notify(e, t, ...n) {
            let r;
            return r = "string" == typeof e ? this.findAll(e) : [e], r.map(e => "function" == typeof e[t] ? e[t](...n) : void 0)
        }

        notifyAll(e, ...t) {
            return this.subscriptions.map(n => this.notify(n, e, ...t))
        }
    }

    const Ye = R.start(), Ze = new class {
        constructor(e, t = {}) {
            this._url = e, this.subscriptions = new Xe(this), t = {maxRetries: 3, ...t}, this.connection = new Qe(e, [], t), this.connection.isOpen = function () {
                return this.readyState === Qe.OPEN
            }, document.addEventListener("beforeunload", () => {
                this.disconnect()
            }), this.connection.addEventListener("open", e => {
                var t = this;
                let n = function () {
                    t.subscriptions.notifyAll("connected")
                };
                t.subscriptions.subscriptions.map(e => e.identifier).join().includes("StimulusReflex::Channel") ? n() : setTimeout(n, 200)
            }), this.connection.addEventListener("message", e => {
                let t = JSON.parse(e.data);
                "cookie" !== t.meta_type ? this.subscriptions.notify(t.identifier, "received", t) : document.cookie = `${t.key}=${t.value || ""}; max-age=${t.max_age}; path=/`
            })
        }

        get url() {
            return function (e) {
                if ("function" == typeof e && (e = e()), e && !/^wss?:/i.test(e)) {
                    const t = document.createElement("a");
                    return t.href = e, t.href = t.href, t.protocol = t.protocol.replace("http", "ws"), t.href
                }
                return e
            }(this._url)
        }

        send(e, t) {
            return e.identifier = t, this.connection.send(JSON.stringify(e))
        }

        connect() {
            return this.connection.open()
        }

        disconnect() {
            return this.connection.close()
        }
    }(`${"https:" == location.protocol ? "wss" : "ws"}://${window.location.host}/ws/sockpuppet-sync`, {debug: !1});
    De.initialize(Ye, {consumer: Ze})
}]);
//# sourceMappingURL=/static/sockpuppet/sockpuppet.js.map