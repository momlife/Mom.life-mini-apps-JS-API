PREGGIEAPI.load('device', 'utils', 'random').module('api', function(api) {

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

	INTERFACE.prototype.getAuthToken = function(options){

        options = JSON.parse(options);

        var token = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NjA3MjM3NDAsIm9yaWdfaWF0IjoxNDUyMDgzNz' +
            'QwLCJlbWFpbCI6ImFzZGFkQGFzZC5ydSIsInVzZXJuYW1lIjoiYWRtaW4iLCJ1c2VyX2lkIjoxfQ.g7QP_zYP_OvdBJzvyAlDTQ2ydu0WEXMx2UFE3yON9a4';

        window[options.success]({token: token});
    };


	/**
	 * Описание методов публичного API
	 */
	INTERFACE.prototype.upload = function(url, options){

        options = JSON.parse(options);

		var progress = 0;
		var s_id = setInterval(function(){
			window[options.progress]({progress: (progress+=10)});

            //if(progress == 50){
            //    clearInterval(s_id);
            //
            //    window[options.error]({status: 101, statusText: 'Upload error'});
            //}

			if(progress == 100){
				clearInterval(s_id);

				window[options.success]({name: '2015:12:23:0820a982-8837-4f26-b8e0-cea32c121c6c.jpg'});
			}
		}, 500);

        window[options.preview]('iVBORw0KGgoAAAANSUhEUgAAADEAAAA0CAIAAACsM0f4AAADPklEQVR42u2X30tTYRjHj+gM' +
            'ttqPznYwu9CbKUxCyh9sI6YLERkuJdRQKoKg/gDvu+jeP6Cgq0ohJLULiVkXDpRASwbbErdgY8yBUslsQzfDHjzx8uz17OxsHLcZ52EX73nPe57z2fN+n+' +
            'd9Ts3x8TFTZVajMClMCpPCpDCdb6ZU6ncsFhFZYTSaWJYTvJXNZnZ3E3t7P/hLvZ41ma6oVPX5XMF6shhMo7moVl8SYNrc9E9NPRVhcrvH3O671GQ6vR8Ib' +
            'ESjIWq+p8cFWPlcra158SMWy3WL5YY8TNvb0aWl9xqN+vRiESb4G4uLb/GMbEzJ5M+5uTeCQOJMVJCKYDIYTFqtDq9wOgfsdie5nJ9/fXR0SC61WkNLyzVQ' +
            'BoxBmhzXICgRUNLCwitqUirT5OSz1ta2fDGDXVtd/UguOzsdzc1mRoIFg1+DwY0zYfJ6P+zsxMU9CgZpevo5v92pVJrsuzxMs7Mv+QG4nph4IpL2+YJkNre' +
            'FQgHZmKAULS8v8mOOu+pwDBQbJHhKp9PLyQS+fL7P2B3IKxz+dnCQNhiMICzBjItEQuvrXn5st/f5/V+SyV/FMdlsvUZjTtWGpOPrON4C8B6PR6nchn1pb7' +
            'dSL5iZeaFS1Z4E7M/4+GOP513RTKeNRA4LHMsi9w/0NTY2CQaJT1KZmbC7fFZXd2F4+F6+IFFO5GcCwdpst7LZQ49nAVdRl2uML5u4mMGeQmhLZBLRE8Uk+' +
            'G68fWQ9LhylMInkHXYHR0p//x1yi9Qt8iZcOPC7K8mEEwJEplb/q92JRJzUcRAZyxphgF0Vx4QP9oJMUhKC2MjIoxKZcH2i8qtiTFgiYEND93nZUs0a30KV' +
            'iYnqgUh6w4GD6ydhFTR56hPuM6leEZgymQyeaWoyd3U5RLzJz3S6p8YGdWh09KFgn3mGTEzuEUYZddiVj4k5EfvKyieqK7dae7Xay0whk8RU8ncw7CN8FDA' +
            'nn5oSG06JVpXf5grT/8EUi30Ph3M62o6Om1Ky6QyZtrZ88MO3bbZ+lm2oPFNtbX13dy8/A0GSN89LZNJo9E7n7TJznEMmOEo5rpGfqQhcAY0PDj6oCias8f' +
            'InHXNu9KQwCdhfKV/ntwyR1acAAAAASUVORK5CYII='
        );

        return s_id;
	};

    /**
     * Описание методов публичного API
     */
    INTERFACE.prototype.cancelUpload = function(uploadId){
        clearInterval(uploadId);
    };

	/**
	 * Описание методов публичного API
	 */
	INTERFACE.prototype.makePayment = function(price, options){

        options = JSON.parse(options);

		setTimeout(function(){
			window[options.success]({
				transaction_id: api.random.randomNumber(),
                additionalDate: {}
			});

		}, 1000);

        //setTimeout(function(){
        //    window[options.error]({
        //        status: 100,
        //        statusText: 'Some error'
        //    });
        //
        //}, 1000);
	};

    /**
     * Описание методов публичного API
     */
    INTERFACE.prototype.getAppId = function(){
        return '12345';
    };


    /**
     * Глобальный API для всех приложений
     * @alias PREGGIEAPI.API
     * @alias api.api
     * @namespace PREGGIEAPI.API
     * @namespace api.api
     * @constructor
     */
    var API = function(){
        /**
         * Реализация interface с native приложения
         */
        this.deviceInterface = function(){
            return api.device.os.android() ? window.Android : (api.device.os.ios() ? window.iOS : new INTERFACE().deviceInterface());
        };

        Object.defineProperty(this, '_token', {
            writable: true,
            value: null
        });
    };

    /**
     * Наследование
     * @type {INTERFACE}
     */
    API.prototype = Object.create(INTERFACE.prototype);
    API.prototype.constructor = API;


    /**
     * Получить id текущего пользователя
     * @example PREGGIEAPI.API.getCurrentUserId();
     * @return {*}
     */
    API.prototype.getCurrentUserId = function(){
        return this.deviceInterface().getCurrentUserId();
    };

    /**
     * Вывести сообщение в native приложении
     * @param message
     * @example PREGGIEAPI.API.showToast('my-message');
     *
     */
    API.prototype.showToast = function(message){
        this.deviceInterface().showToast(message);
    };

	/**
	 * Получить токен авторизация с native приложения
     * @param {Function} callback - callback функция, вызываемая в случае получения токена
	 * @example PREGGIEAPI.API.getAuthToken();
	 * @example PREGGIEAPI.API.getAuthToken(function(token){
	 *  // async
	 * });
	 * @return {*}
	 */
	API.prototype.getAuthToken = function(callback){
        var self = this;
        var success = api.utils.createGlobalCallback(successCallback);
        //var error = api.utils.createGlobalCallback(errorCallback);

        function successCallback(data){
            // после успешного получения токена удаляем с global scope созданные глобальные функции
            [success].forEach(function(callback){
                api.utils.removeGlobalCallback(callback);
            });

            // и вызываем ранее переданную функцию
            callback && callback(self._token = data.token, data);
        }

		return callback ? this.deviceInterface().getAuthToken(
            JSON.stringify({
                success: success
            })
        ) : self._token;
	};

	/**
	 * Загрузка изображения через native приложение
	 * @param {String} url - url сервера для загрузки изображения
     * @param {{preview: Function, progress: Function, success: Function, error: Function}} options
	 */
	API.prototype.upload = function(url, options){
        var preview = api.utils.createGlobalCallback(options.preview);
        var progress = api.utils.createGlobalCallback(options.progress);
        var success = api.utils.createGlobalCallback(successCallback);
        var error = api.utils.createGlobalCallback(errorCallback);

        /**
         * Функция, вызываемая после успешного завершения загрузки картинки
         * @param data
         */
        function successCallback(data){
            // после успешного получения картинки удаляем с global scope созданные глобальные функции
            [preview, progress, success, error].forEach(function(callback){
                api.utils.removeGlobalCallback(callback);
            });

            // и вызываем ранее переданую функцию
            options.success && options.success(data);
        }


        /**
         * Функция, вызываемая в случае возникновения ошибок при загрузке
         * @param error
         */
        function errorCallback(error){
            // вызываем ранее переданую функцию
            options.error && options.error(error);
        }

		// вызов нативного приложения выбора файла
		return this.deviceInterface().upload(
            url,
            JSON.stringify({
                preview: preview,
			    progress: progress,
                success: success,
                error: error
		    })
        )
	};

    /**
     * Метод отмены загрузки через native приложение
     * @param uploadId
     * @example PREGGIEAPI.API.cancelUpload('uploadId-1234');
     */
    API.prototype.cancelUpload = function(uploadId){
        // вызов нативного приложения отмены загрузки файла
        this.deviceInterface().cancelUpload(uploadId);
    };

	/**
	 * Совершить платеж (отправить пользователя в приложение для соверешения оплаты)
	 * @example PREGGIEAPI.API.makePayment(function(data){
	 *   // data.transaction_id
	 * });
	 * @param price
     * @param {{success: Function, error: Function}} options
	 */
	API.prototype.makePayment = function(price, options){
        var success = api.utils.createGlobalCallback(successCallback);
        var error = api.utils.createGlobalCallback(errorCallback);

        /**
         * Функция, вызываемая после прохождения оплаты либо ее отмены
         * @param data
         */
        function successCallback(data){
            // после завершения оплаты либо ее отметы удаляем с global scope созданные глобальные функции
            [success, error].forEach(function(callback){
                api.utils.removeGlobalCallback(callback);
            });

            // и вызываем ранее переданую функцию
            options.success && options.success(data);
        }


        /**
         * Функция, вызываемая в случае возникновения ошибок при загрузке
         * @param error
         */
        function errorCallback(error){
            // после завершения оплаты либо ее отметы удаляем с global scope созданные глобальные функции
            [success, error].forEach(function(callback){
                api.utils.removeGlobalCallback(callback);
            });

            // вызываем ранее переданую функцию
            options.error && options.error(error);
        }


		this.deviceInterface().makePayment(
            price,
            JSON.stringify({
                success: success,
                error: error
            })
        );
	};

    /**
     * Метод получения ID приложения
     * @example PREGGIEAPI.API.getAppId();
     * @return {String}
     */
    API.prototype.getAppId = function(){
        return this.deviceInterface().getAppId();
    };


	return this.publicateAPI("API", new API());
});