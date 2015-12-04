PREGIEAPI.module("device", function(api) {
    var userAgent = navigator.userAgent, version = null;

    var webkit = userAgent.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
        android = userAgent.match(/(Android);?[\s\/]+([\d.]+)?/),
        ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/),
        ipod = userAgent.match(/(iPod)(.*OS\s([\d_]+))?/),
        iphone = !ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/);


    /**
     * Модуль определения ОС и версии.
     * @alias api.device
     * @namespace api.device
     * @example
     *  PREGIEAPI.device.os.android(); // true || false
     *  PREGIEAPI.device.os.ios(); // true || false
     * @type {{platform: {name: string}, webview: Function, os: {version: Function, android: Function, ios: Function, ipad: Function, ipod: Function, iphone: Function}}}
     */
	var Device = {
		platform: {name: (navigator.platform.match(/mac|win|linux/i) || ["unknown"])[0].toLowerCase()},

        webview: function(){
            return typeof window.Android != 'undefined' || typeof window.iOS != 'undefined';
        },

        os: {
            version: function(){
                return version;
            },

            android: function(){
                if(android) version = android[2];
                return android;
            },

            ios: function(){
                return this.ipad() || this.ipod() || this.iphone();
            },

            ipad: function(){
                if(ipad) version = ipad[2].replace(/_/g, '.');
                return ipad;
            },

            ipod: function(){
                if(ipod) version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
                return ipod;
            },

            iphone: function(){
                if(iphone && !ipod) version = iphone[2].replace(/_/g, '.');
                return iphone;
            }

        }

	};

    return this.publicateAPI("device", Device);
});