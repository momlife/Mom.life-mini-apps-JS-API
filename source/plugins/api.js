PREGIEAPI.load("device").module("api", function(api) {

    /**
     * Интерфейс, который реализует публичный API
     * @constructor
     */
    var INTERFACE = function(){
        this.deviceInterface = null;
    };

    /**
     * Описание методов публичного API
     */
    INTERFACE.prototype.getCurrentUserId = function(){ throw new Error("MOCK INTERFACE"); };

    /**
     * Описание методов публичного API
     */
    INTERFACE.prototype.showToast = function(){ throw new Error("MOCK INTERFACE"); };


    /**
     * Глобальный API для всех приложений
     * @alias PREGIEAPI.API
     * @type {Function}
     * @namespace PREGIEAPI.API
     * @constructor
     */
    var API = function(){
        /**
         * Реализация interface с native приложения
         */
        this.deviceInterface = api.device.os.android() ? window.Android : (api.device.os.ios() ? window.iOS : new INTERFACE());
    };

    /**
     * Наследование
     * @type {INTERFACE}
     */
    API.prototype = Object.create(INTERFACE.prototype);
    API.prototype.constructor = API;


    /**
     * Получить id текущего пользователя
     * @return {*}
     */
    API.prototype.getCurrentUserId = function(){
        return this.deviceInterface.getCurrentUserId();
    };

    /**
     * Вывести сообщение в native приложении
     * @param message
     */
    API.prototype.showToast = function(message){
        this.deviceInterface.showToast(message);
    };


    return this.publicateAPI("API", new API());
});