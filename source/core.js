window['PREGGIEAPI'] || (window['PREGGIEAPI'] = function (PREGGIEAPI) {
	var modules = {},
		paths = {},
		packages = {},
		hooks = [],
		cache = {};

	var Options = {
	    forced_loading: false
    };

	var A = function (array) {
		var a = array || [];
		var iter = function (f) {
			for(var i = 0; i < a.length; i++) {
				f(a[i], i, a);
			}
			return a;
		};

		return {
			forEach: function (f) {
				return iter(function () { f.apply(a, arguments); });
			},

			map: function (f) {
				var r = [];
				iter(function () { r.push(f.apply(a, arguments)); });
				return r;
			},

			filter: function (f) {
				var r = [];
				iter(function () { f.apply(a, arguments) && r.push(arguments[0]); });
				return r;
			}
		};
	};

	var addHook = function (f, modules_list) {
		hooks.push([f, modules_list]);
		runHooks();
	};

	var registerModule = function (name, f, api) {
		modules[name] || (modules[name] = f.call(window[PREGGIEAPI], api || undefined));
		runHooks();
	};

	var runHooks = function () {
		var runnable = [];
		hooks = A(hooks).filter(function (hook) {
			return (A(hook[1]).filter(function (module) {
				return !modules[module];
			}).length > 0) || (function () {
				runnable.push(function (f, api) {
					return function () { f(api); };
				}(hook[0], makeApi(hook[1])));
			})();
		});
		A(runnable).forEach(function (f) { f(); });
	};

	var makeApi = function (list) {
		var api = {};
		A(list).forEach(function (path) {
			var x = api, l = path.split("."), last = l.pop();
			A(l).forEach(function (point) { x = x[point] || (x[point] = {}) });
			x[last] = modules[path];
		});
		return api;
	};

	var Code = function (api) {
		return {
			run: function (f) {
				addHook(function(api){ f.call(window[PREGGIEAPI], api) }, api);
			},

			module: function (name, f) {
				addHook(function (api) {
					registerModule(name, f, api);
				}, api);
				cache[findUrl(name)] = name;
			}
		};
	};
	
	var findBaseUrl = function (self_name) {
		var nodes = document.getElementsByTagName("script");
		for(var i = 0; i < nodes.length; i++) {
			var src = nodes[i].getAttribute("src") || "";
			if(src.indexOf(self_name) != -1) {
				return src.substr(0, src.indexOf(self_name));
			}
		}
		return "";
	};

	var findUrl = function (module) {
		for(var i in packages) {
			if(module.indexOf(i) == 0) {
				return packages[i];
			}
		}
		return (function () {
			var l = module.length + 1;
			while(--l > 0) {
				var s = module.substring(0, l);
				if(typeof paths[s] != "undefined") {
					return paths[s] + "/" + module.substr(s.length).split(".").join("/") + ".js";
				}
			}
//			for(var i in paths) {
//				if(module.indexOf(i) == 0) {
//					return paths[i] + "/" + module.substr(i.length).split(".").join("/") + ".js";
//				}
//			}
			return (findBaseUrl("/preggieapi.") + "/plugins/" + module.split(".").join("/") + ".js")
		})().replace(/([A-Z])/g, function (m) { return "-" + m.toLowerCase(); }).replace(/\/-/g, "/");
	};
	
	var loadScript = (function () {
		return function (src) {
			if(!cache[src] || Options.forced_loading) {
				var s = document.createElement("script");
				s.setAttribute("src", src + (Options.forced_loading ? "?" + Math.random() : ""));
				s.setAttribute("type", "text/javascript");
				document.getElementsByTagName("head")[0].appendChild(s);
				cache[src] = true;
			} else {
				runHooks();
			}
		};
	})();
	
	var load = function (list) {
		var expand = function (string) {
			var m = string.match(/^(.*)\((.*)\)$/) || [];
			return (m.length == 3) ? A(m[2].split("|")).map(function (s) { return m[1] + s; }) : [string];
		};

		var l = [];
		A(list).forEach(function (path) {
			A(expand(path)).forEach(function (path) {
				l.push(path);
				//modules[path] || loadScript(findUrl(path));
			});
		});

		return l;
	};

	paths["preggieapi."] = findBaseUrl("/preggieapi.") + "/plugins";

	var merge = function (dst, src) {
		for(var i in src) {
			dst[i] = src[i];
		}
		return dst;
	};

	return {
		load: function () {
			return Code(load(arguments));
		},

		addPath: function (prefix, path) {
			paths[prefix] = path;
		},

		addPackage: function (prefix, path) {
			packages[prefix] = path;
		},

        publicateAPI: function(name, exports){
            if(typeof(window[PREGGIEAPI][name]) == "undefined") {
                window[PREGGIEAPI][name] = exports;
            }
            return exports;
        },

		self: function (path) {
			cache[path] = true;
		},

		module: function (name, f) {
			registerModule(name, f);
		},

		setup: function (options) {
			return (merge(Options, options), this);
		},

		$debugger: {
			modules: modules,
			paths: paths,
			packages: packages,
			hooks: hooks
		}
	};

}('PREGGIEAPI'));