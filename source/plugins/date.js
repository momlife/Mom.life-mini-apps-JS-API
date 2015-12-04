PREGIEAPI.module("date", function () {
	/**
	 * Модуль работы со временем
	 * @namespace api.date
	 * @type {{}}
	 */
	var date = {};
	
	date.absolute = function () {
		var value = new Date(0);
		
		return {
			day: function (d) {
				return (value.setDate(d), this);
			},

			month: function (m) {
				return (value.setMonth(m-1), this);
			},

			year: function (y) {
				return (value.setFullYear(y), this);
			},

			getTime: function () {
				return value.getTime();
			},

			getUTC: function () {
				return value.toUTCString();
			}
		};
	};

    date.unixtime = function (d) {
        return ~~((d || new Date()).getTime() / 1000);
    };

	/**
	 * Метод возращающий время в формате "Часы:минуты"
	 * @example api.date.H_M(1449242709); // "16:25"
	 * @return {string}
	 */
	date.H_M = function(unixtime){
		var d = new Date(unixtime * 1000);
		return d.getHours() + ':' + d.getMinutes();
	};

	return this.publicateAPI("date", date);
});