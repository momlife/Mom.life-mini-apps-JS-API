BBAPI.load("browser", "event", "utils").module("require", function(api){

    /**
     * Внутренний кэш
     * @type {{}}
     */
    var cache = {};

    /**
     * Модуль загрузки скриптов
     * @constructor
     */
    var REQUIRE = function(){
        this.asyncLoaded = [];
    };

    /**
     * Метод получения конфига
     * @return {{async: boolean, syncIndex: number, delay: number, noCache: boolean, afterLoad: Function}}
     */
    REQUIRE.prototype.getConfig = function(){
        return this.config = {
            async: false,
            syncIndex: -1,
            delay: 0,
            noCache: false,
            afterLoad: function(){}
        };
    };

    /**
     * Основной метод используемый для загрузки
     * @param lists - массив объектов для загрузки
     * @return {REQUIRE}
     */
    REQUIRE.prototype.load = function(lists){
        if(lists[0]){
            api.utils.extend(this.getConfig(), lists[0]);

            this.lists = lists;
            this.list = lists[0];

            if(this.config.async){
                this.loadAsync();
            }else{
                this.loadSync();
            }
        }

        return this;
    };

    /**
     * Метод загрузки асинхронно
     */
    REQUIRE.prototype.loadAsync = function(){
        var self = this;

        var afterLoad = function(){
            self.asyncLoaded.push(this.src);

            if(self.list.urls.length == self.asyncLoaded.length){
                self.config.afterLoad.call(self);
            }
        };

        if(this.config.delay){
            this.loadScript(this.list.urls[0], afterLoad); // загрузить первый элемент без задержки

            var index = 1, list = this.list, iid = setInterval(function(){
                if(list.urls[index]){
                    self.loadScript(list.urls[index++], afterLoad);
                } else {
                    clearInterval(iid);
                }
            }, this.config.delay);

        }else{
            for(var i=0; i<this.list.urls.length; i++){
                this.loadScript(this.list.urls[i], afterLoad);
            }
        }

        this.lists.shift();
        this.load(this.lists);
    };

    /**
     * Метод загрузки синхронно
     */
    REQUIRE.prototype.loadSync = function(){

        if(this.list.urls[++this.config.syncIndex]){
            this.loadScript(this.list.urls[this.config.syncIndex], api.utils.closure(this, this.loadSync));
        }else{
            this.config.afterLoad.call(this);
            this.lists.shift();
            this.load(this.lists);
        }
    };

    /**
     * Метод создания и фактической загрузки скрипта
     * @param src - src скртипта
     * @param callback - функция по завершению загрузки
     */
    REQUIRE.prototype.loadScript = function(src, callback){

        var loadScript = function (url, jsonp_callback, no_cache) {
            var listener = api.browser.ie ? function () {(this.readyState.toLowerCase() == "loaded" || this.readyState.toLowerCase() == "complete") && jsonp_callback.apply(this, arguments); } : jsonp_callback;
            var script = document.createElement("script");

            if(no_cache){
                url += (url.indexOf("?") == -1 ? "?" : "&") + "_=" + new Date().getTime();
            }

            script.setAttribute("src", url);
            script.setAttribute("type", "text/javascript");
            listener && api.event.addEvent(script, api.browser.ie ? "readystatechange" : "load", function(){ cache[url] = this; listener.call(this); }, false);
            return document.getElementsByTagName("head")[0].appendChild(script);
        };

        // кэширование запросов
        if(!this.config.noCache && cache[src]){
            return callback.call(cache[src]);
        }

        return loadScript(src, callback || function () { this.parentNode.removeChild(this); }, this.config.noCache);
    };

    return this.publicateAPI("require", function(){ return new REQUIRE(); });
});