BBAPI.load("utils", "array", "random", "hash").module("storage", function(api) {
    /**
     * Модуль хранения данных у пользователя в браузере
     * @alias BBAPI.storage
     * @param {string} name - ключ переменной в storage
     * @constructor
     */
    var STORAGE = function(){
        this.config = {
            driver: ["localStorage"]
        };

        // ключ в storage
        this.name = null;

        // сущность получаемая с storage
        this.item = null;
    };

    /**
     * Метод установки настроек модуля
     * @param options
     * @return {STORAGE}
     */
    STORAGE.prototype.init = function(options){
        api.utils.extend(this.config, options);

        return this;
    };

    /**
     * Метод установки имени ключа для поиска в storage
     * @param name
     * @return {STORAGE}
     */
    STORAGE.prototype.setKey = function(name){
        this.name = name;

        this.item = localStorage.getItem(this.name);
        if(this.item) {
            this.item = JSON.parse(this.item);
        }

        return this;
    };

    /**
     * Метод получения данных с storage
     * @return {*}
     */
    STORAGE.prototype.get = function(){
        var result;

        if(this.item){
            result = this.item.value;

            if(this.item.options.expires < new Date().getTime()){
                result = this.remove();
            }
        }

        return result;
    };

    /**
     * Метод установки значения в storage
     * @param value - сохраняемое значение
     * @param options - настройки сохранения
     * @return {STORAGE}
     */
    STORAGE.prototype.set = function(value, options){

        // по умолчанию сохраняем на 1 день
        var d = new Date();
        d.setDate(d.getDate() + 1);

        // дата для записи в storage
        var data = {
            // сохраняемое значение
            "value": value,

            // опции сохранения (время жизни, возможно будет домен и т.д.)
            "options": api.utils.extend({expires: d.getTime()}, options)
        };

        // установка в storage
        if(BBAPI.storage.supportLocalStorage){
            localStorage.setItem(this.name, JSON.stringify(this.item = data));
        }

        return this;
    };

    /**
     * Метод для удаления элемента из storage
     * @return {STORAGE}
     */
    STORAGE.prototype.remove = function(){
        localStorage.removeItem(this.name);

        this.item = null;
    };

    /**
     * Метод получения настроек сохраненного entry из storage
     * @return {object} - настройки сохраненной записи
     */
    STORAGE.prototype.getOptions = function(){
        return this.item && this.item.options;
    };

    return this.publicateAPI("storage", (function(){

        var instance;

        var storage = function(name){
            return (instance ? instance : instance = new STORAGE()).setKey(name);
        };

        /**
         * статичный метод для установки конфигов модуля
         * @param {object} options - настройки всего модуля
         * @memberof BBAPI.storage
         * @returns {storage}
         */
        storage.setup = function(options){
            return (instance ? instance : instance = new STORAGE()).init(options);
        };

        /**
         * статичный метод для проверки поддерживает или нет браузер установку в localStorage
         * @memberof BBAPI.storage
         * @returns {boolean}
         */
        storage.supportLocalStorage = (function(){
            var support = false;

            if(typeof window.localStorage != 'undefined'){
                try {
                    var key = "bbStoragePossible";
                    localStorage.setItem(key, 1);
                    support = localStorage.getItem(key) == "1";
                    localStorage.removeItem(key);
                } catch(e){}
            }

            return support;
        })();

        return storage;
    })());
});