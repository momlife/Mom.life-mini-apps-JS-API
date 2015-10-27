BBAPI.module("hash", function (api) {

	var iterate = function (hash, f)  {
		for(var i in hash) {
			f(hash[i], i, hash);
		}
	};

	var Hash = function (hash) {
		return {
			forEach: function (f) {
				iterate(hash, function () { f.apply(this, arguments); });
			},

			map: function (f) {
				var h = {};
				iterate(hash, function (item, i, hash) { h[i] = f.call(this, item, i, hash); });
				return h;
			},

			filter: function (f) {
				var h = {};
				iterate(hash, function (item, i, hash) { var r = f.call(this, item, i, hash); r && (h[i] = item); });
				return h;
			},

			reduce: function (f, initial) {
				var r = initial || undefined;
				iterate(hash, function (item, i, hash) { r = f(r, item, i, hash); });
				return r;
			}
		}
	};

	Hash.merge = function (dst, src) {
		iterate(src, function (item, i) { dst[i] = item; });
		return dst;
	};

	Hash.copy = function (src) {
		return Hash.merge({}, src);
	};

	return Hash;
});