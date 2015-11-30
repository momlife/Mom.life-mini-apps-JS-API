PREGIEAPI.load('device', 'utils').module('api', function(api) {

    /**
     * Интерфейс, который реализует публичный API
     * @constructor
     */
    var INTERFACE = function(){

    };

    /**
     * MOCK реализация interface с native приложения
     * @return {INTERFACE}
     */

    INTERFACE.prototype.deviceInterface = function(){ return this; };

    /**
     * Описание методов публичного API
     */
    INTERFACE.prototype.getCurrentUserId = function(){
        return '12345';
    };

    /**
     * Описание методов публичного API
     */
    INTERFACE.prototype.showToast = function(message){
        alert(message);
    };

	/**
	 * Описание методов публичного API
	 */
	INTERFACE.prototype.getAuthToken = function(){ return 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcmlnX2lhdCI6MTQ0ODI4NzczMCwidXNlc' +
		'm5hbWUiOiJhZG1pbiIsInVzZXJfaWQiOjEsImVtYWlsIjoiYWRtaW5AYXNkLnJ1IiwiZXhwIjoxNDQ5NDk3MzMwfQ.mPVseayRBHYQmyj1HTC5c2HTHxzS2WGv1SvhKOAeU3o'; };

	/**
	 * Описание методов публичного API
	 */
	INTERFACE.prototype.uploadImage = function(url, options){

        options = JSON.parse(options);

		var progress = 0;
		var s_id = setInterval(function(){
			window[options.progress]({status: 200, progress: (progress+=10)});

			if(progress == 100){
				clearInterval(s_id);

				window[options.done]({status: 200, url: 'https://www.google.ru/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'});
			}
		}, 1000);
	};

	/**
	 * Описание методов публичного API
	 */
	INTERFACE.prototype.makePayment = function(callback_name){

		setTimeout(function(){
			window[callback_name]({
				statusText: 'OK',
				id: '1234567',
				transaction_id: '12345',
				someData: []
			});

		}, 1000);
	};


    /**
     * Глобальный API для всех приложений
     * @alias PREGIEAPI.API
     * @type {Function}
     * @namespace PREGIEAPI.API
     * @namespace PREGIEAPI.api
     * @constructor
     */
    var API = function(){
        /**
         * Реализация interface с native приложения
         */
        this.deviceInterface = function(){
            return api.device.os.android() ? window.Android : (api.device.os.ios() ? window.iOS : new INTERFACE().deviceInterface());
        };
    };

    /**
     * Наследование
     * @type {INTERFACE}
     */
    API.prototype = Object.create(INTERFACE.prototype);
    API.prototype.constructor = API;


    /**
     * Получить id текущего пользователя
     * @example PREGIEAPI.API.getCurrentUserId();
     * @return {*}
     */
    API.prototype.getCurrentUserId = function(){
        return this.deviceInterface().getCurrentUserId();
    };

    /**
     * Вывести сообщение в native приложении
     * @param message
     * @example PREGIEAPI.API.showToast('my-message');
     *
     */
    API.prototype.showToast = function(message){
        this.deviceInterface().showToast(message);
    };

	/**
	 * Получить токен авторизация с native приложения
	 * @example PREGIEAPI.API.getAuthToken();
	 * @example PREGIEAPI.API.getAuthToken(function(token){
	 *  // async
	 * });
	 * @return {*}
	 */
	API.prototype.getAuthToken  = function(){
		return this.deviceInterface().getAuthToken();
	};

	/**
	 * Загрузка фотографии через native приложение
	 * @param {String} url
     * @param {Object} options
	 */
	API.prototype.uploadImage = function(url, options){
        var progress = api.utils.createGlobalCallback(options.progress);
        var done = api.utils.createGlobalCallback(doneCallback);

        /**
         * Функция, вызываемая после успешного завершения загрузки картинки
         * @param data
         */
        function doneCallback(data){
            // после успешного получения картинки удаляем с global scope созданные глобальные функции
            [progress, done].forEach(function(callback){
                api.utils.removeGlobalCallback(callback);
            });

            // и вызываем ранее переданую функцию
            options.done && options.done(data);
        }

		// вызов нативного приложения выбора файла
		this.deviceInterface().uploadImage(
            url,
            JSON.stringify({
			    progress: progress,
			    done: done
		    })
        )
	};

	/**
	 * Совершить платеж (отправить пользователя в приложение для соверешения оплаты)
	 * @example PREGIEAPI.API.makePayment(function(data){
	 *   // data.transaction_id
	 * });
	 * @param callback
	 */
	API.prototype.makePayment = function(callback){
		var callback_name = api.utils.createGlobalCallback(paymentCallback);

		/**
		 * Функция, вызываемая после прохождения оплаты либо ее отмены
		 * @param data
		 */
		function paymentCallback(data){
			// после завершения оплаты либо ее отметы удаляем с global scope созданную глобальную функцию
			api.utils.removeGlobalCallback(callback_name);

			// и вызываем ранее переданую функцию
			callback && callback(data);
		}

		this.deviceInterface().makePayment(callback_name);
	};



	return this.publicateAPI("API", new API());
});