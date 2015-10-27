BBAPI.load("array", "hash").module("cookie", function (api) {
	
	var A = api.array, H = api.hash;
	
	var accessor = function (object, property_name, setter, getter) {

		var property_setter = function(value, name) { this[name] = value; return this.$this; };
		var property_getter = function(name) { return this[name]; };

		var g = getter || property_getter, s = setter || property_setter;
		return function (value) {
			return (typeof(value) == "undefined" ? g.apply(object, [property_name]) : s.apply(object, [value, property_name]));
		};
	};
	
	var value2string = function (value) {
		return value === null || value === false ? false : value.toString();
	};
	
	var toNetscapeDateString = function (date) {
		var $0 = function (v) { return Math.abs(v) < 10 ? (v < 0 ? "-0" + Math.abs(v) : "0" + v) : v; };
		return (["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]
			+ ", "
			+ [$0(date.getDate()),
			   ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()], 
			   date.getFullYear()].join("-")
			+ " " 
			+ [$0(date.getUTCHours()), $0(date.getUTCMinutes()), $0(date.getUTCSeconds())].join(":")
			+ " GMT"
		);
	};
	
	var Cookie = function (name, value) {
		var self = this;
		
		var properties = {
			name: name,
			value: value,
			expires: false,
			domain: false,
			path: false,
			secure: false
		};
				
		this.toString = function () {
			return properties.name + "=" + properties.value
				+ (properties.expires !== false ? ";expires=" + toNetscapeDateString(properties.expires) : "")
				+ (properties.path !== false ? ";path=" + properties.path : "")
				+ (properties.domain !== false ? ";domain=" + properties.domain : "")
				+ (properties.secure ? ";secure" : "")
			;
		};
				
		this.expires = accessor(properties, "expires",
			function (time_relative_to_now) {
				this.expires = 
					(time_relative_to_now === null ? false :
						(time_relative_to_now instanceof Date ? time_relative_to_now :
							new Date((new Date()).getTime() + time_relative_to_now * 1000)));
				return self;
		});
					
		this.name = accessor(properties, "name",
			function () { return this.name; }
		);
		
		this.value = accessor(properties, "value",
			function (value) { this.value = value || ""; return self; }
		);
		
		this.domain = accessor(properties, "domain",
			function (domain) { this.domain = value2string(domain); return self; }
		);
		
		this.path = accessor(properties, "path",
			function (path) { this.path = value2string(path); return self; }
		);
				
		this.secure = accessor(properties, "secure",
			function (secure_flag) { this.secure = (secure_flag == true); return self; }
		);
	};
		
	var getCookies = function () {
		return A(A(document.cookie.split("; ")).map(
			function (pair) {
				return pair.indexOf("=") == -1 ? false : new Cookie(pair.substr(0, pair.indexOf("=")), pair.substr(pair.indexOf("=") + 1));
			}
		));
	};
		
	var setCookie = function (cookie) {
		document.cookie = cookie.toString();
	};
	
	var deleteCookie = function (cookie) {
		setCookie(cookie.expires(new Date(0)));
	};
	
	var findCookie = function (name) {
		var a = getCookies().filter(function (cookie) { return cookie && (cookie.name().toLowerCase() == name.toLowerCase()); });
		return a.length >= 1 ? a[0] : false;
	};
	
	var getCookie = function (name) {
		var c = findCookie(name);
		return c === false ? false : c.value();
	};
	
	var clearCookies = function () {
		getCookies().forEach(function (cookie) { deleteCookie(cookie.value(null).path("/")); });
	};
		
	var CookieManager = function (name, value) {
		return new Cookie(name, value);
	};
	
	H.merge(CookieManager, {
		toNetscapeDateString: toNetscapeDateString,
		getCookies: getCookies,
		set: setCookie,
		get: getCookie,
		kill: deleteCookie,
		find: findCookie,
		clearCookies: clearCookies
	});

	return this.publicateAPI("cookie", CookieManager);
});