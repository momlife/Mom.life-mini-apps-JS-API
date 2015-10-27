PREGIEAPI.module("date", function () {
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

	return this.publicateAPI("date", date);
});