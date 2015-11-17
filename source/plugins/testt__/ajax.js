PREGIEAPI.load("random", "browser", "utils", "array").module("ajax", function (api) {

    var win = window, self = this;

    /**
     *
     *
     * var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
     xmlhttp.open("POST", "/json-handler");
     xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
     xmlhttp.send(JSON.stringify({name:"John Rambo", time:"2pm"}));
     *
     *
     *
     *
     return new Promise(function(resolve, reject) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = function() {
      if (this.status == 200) {
        resolve(this.response);
      } else {
        var error = new Error(this.statusText);
        error.code = this.status;
        reject(error);
      }
    };

    xhr.onerror = function() {
      reject(new Error("Network Error"));
    };

    xhr.send();
  });

     * @constructor
     */
    var AJAX = function () {
        var url, callback, fail, method = "GET", data = {}, content_type = "application/x-www-form-urlencoded";

        /**
         * Функция helper - hash -> array
         * @param hash
         * @return {Array}
         */
        var hash2array = function (hash) {
            var a = [];
            for(var k in hash) {
                if(hash.hasOwnProperty(k)) {
                    a.push(encodeURIComponent(k) + "=" + encodeURIComponent(hash[k]));
                }
            }
            return a;
        };

        var XhrResponse = function (xhr) {
            return {
                header: function (name) {
                    return xhr.getResponseHeader(name);
                },

                body: function () {
                    return xhr.responseText;
                },

                json: function(){
                    return JSON.parse(xhr.responseText);
                },

                xml: function () {
                    return xhr.responseXML;
                },

                status: function () {
                    return xhr.status;
                },

                statusText: function () {
                    return xhr.statusText;
                },

                self: xhr
            };
        };

        var loadScript = function (src) {

            var loadScript = function (url, jsonp_callback) {
                var ie = win.addEventListener == undefined;
                var listener = ie ? function () {(this.readyState.toLowerCase() == "loaded" || this.readyState.toLowerCase() == "complete") && jsonp_callback.apply(this, arguments); } : jsonp_callback;
                var script = document.createElement("script");
                script.setAttribute("src", url);
                script.setAttribute("type", "text/javascript");
                listener && api.event.addEvent(script, ie ? "readystatechange" : "load", listener, false);
                return document.getElementsByTagName("head")[0].appendChild(script);
            };

            return loadScript(src, function () { this.parentNode.removeChild(this); });
        };

        var createCallback = function (f, script_ttl, f_timeout) {
            var attachCallback = function (name) {
                var timeout = function () {
                    win[name] = function () {
                        try { win[name] = undefined; delete win[name]; } catch (e) {};
                    };
                    f_timeout && f_timeout();
                };

                var t_id = setTimeout(timeout, script_ttl);
                win[name] = function () {
                    clearTimeout(t_id);
                    try { win[name] = undefined; delete win[name]; } catch (e) {};
                    f.call(win, arguments[0]);
                };
                return name;
            };

            var i = 0;
            while(i++ < 10) {
                var name = "PREGIEJSONP_" + api.random.randomString();
                if(typeof(window[name]) == "undefined") {
                    return attachCallback(name);
                }
            }
            throw new Error("PREGIEAPI.JSONP.createCallback: cannot create unique name for callback");
        };

        var data2string = function (data, filter) {
            if(typeof(data) == "string") {
                return data;
            }
            var f = filter || function () { return true; };
            var s = [];
            for(var i in data) {
                f(data[i], i) && s.push(encodeURI(i) + "=" + encodeURIComponent(data[i]));
            }
            return s.join("&");
        };

        var action2string = function (params) {
            return data2string(params, function (value) { return api.array([undefined, null, false, "false", "null"]).indexOf(value) == -1});
        };

        var makeSendbody = function(callback_build, callback_error) {
            var cb = createCallback(callback_build, 10000, callback_error);
            var _data_ = self.utils.extend(data, {callback: cb});
            return action2string(_data_);
        };


        var Ajax = function () {

            return {
                done: function(cb){
                    return (cb && (callback = cb), this);
                },

                fail: function(cb){
                    return (cb && (fail = cb), this);
                },

                url: function (string) {
                    return (string && (url = string), this);
                },

                method: function (string) {
                    return (string && (method = string), this);
                },

                content_type: function(c_type){
                    return (c_type && (content_type = c_type), this);
                },

                data: function (hash) {
                    return (hash && (data = hash), this);
                },

                run: function () {
                    var r = (typeof(XMLHttpRequest) != "undefined") ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

                    var get = function () {
                        var u = url + (self.utils.isNotNull(data) ? (url.indexOf("?") == -1 ? "?" : "&") : "") + hash2array(data).join("&");
                        r.open(method, u, !!callback);
                        return send(null);
                    };

                    var post = function () {
                        r.open(method, url, !!callback);
                        r.setRequestHeader("Content-Type", content_type);
                        return send(hash2array(data).join("&"));
                    };

                    var send = function (data) {
                        //r.setRequestHeader("If-Modified-Since", new Date(0).toUTCString());
                        //r.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                        //r.setRequestHeader("Content-Type", content_type);
                        if(!!callback) {
                            r.onreadystatechange = function () {
                                if(r.readyState == 4) {
                                    if(r.status != 200 && fail){
                                        fail(new XhrResponse(r));
                                    } else {
                                        callback(new XhrResponse(r));
                                    }
                                };
                            };
                        };
                        r.send(data);
                        return new XhrResponse(r);
                    };

                    return method == "GET" ? get() : post();
                },

                jsonp: function(){
                    loadScript(url + (url.indexOf("?") == -1 ? "?" : "&") + makeSendbody(callback, fail));
                }
            }
        };

        return new Ajax();
    };

    return this.publicateAPI("ajax", AJAX);
});
