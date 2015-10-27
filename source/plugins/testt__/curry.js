BBAPI.load("array").module("curry", function (api) {
	
	var A = api.array;
	
	return function () {
		var f = arguments[0], args = A(arguments).tail();
		
		return function () {
			return f.apply(this, A(args).append(arguments));
		}
	};
});