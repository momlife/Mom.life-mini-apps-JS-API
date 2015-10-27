BBAPI.load("event", "css", "dom", "array", "random").module("utils", function (api) {
    var win = window, self = this;

    var utils = {
        isDebug: function(){
            try {
                return 'localStorage' in window && window['localStorage'] !== null && localStorage.getItem('bb-debug') == '1';
            } catch (e) {
                return false;
            }
        },

        closure: function (self, f) { return function () { return f.apply(self, arguments); }},

        callbackDelay: function(delay){
            this.delay = delay || 300;
            this.timeout_id = null;

            return utils.closure(this, function(callback){
                clearTimeout(this.timeout_id);

                this.timeout_id = setTimeout(callback, this.delay);
            });
        },

        waitingFor: function (f_cond, f_call, args) {
            var x = function () { f_cond() ? f_call(args) : setTimeout(x, 50); };
            return x;
        },

        scrollTop: function(){
            return win.pageYOffset || document.documentElement.scrollTop;
        },

        coordinates: function(element){
            var box = element.getBoundingClientRect();

            var body = document.body;
            var docEl = document.documentElement;

            var scrollTop = win.pageYOffset || docEl.scrollTop || body.scrollTop;
            var scrollLeft = win.pageXOffset || docEl.scrollLeft || body.scrollLeft;

            var clientTop = docEl.clientTop || body.clientTop || 0;
            var clientLeft = docEl.clientLeft || body.clientLeft || 0;

            var top  = box.top +  scrollTop - clientTop;
            var left = box.left + scrollLeft - clientLeft;

            return { top: Math.round(top), left: Math.round(left) };
        },

        extend: function(to, from) {
            for(var i in from) {
                if(from.hasOwnProperty(i) && typeof from.nodeType == "undefined"){
                    if(typeof from[i] == "object" && typeof to[i] == "object"){
                        to[i] = utils.extend(to[i], from[i]);
                    } else {
                        typeof from[i] != "undefined" && (to[i] = from[i]);
                    }
                }
            };

            return to;
        },

        isNotNull: function(obj){
            var i = 0;
            for(var key in obj){
	            if (obj.hasOwnProperty(key)) {
		            ++i;
		            break;
	            }
            };

            return i != 0;
        },

        length: function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            };

            return size;
        },

	    /**
	     * Кросбраузерный вариант node.outerHTML
	     */
	    outerHTML: (function() {
			var DIV = document.createElement("div");

			if ('outerHTML' in DIV)
				return function(node) {
					return node.outerHTML;
				};

			return function(node) {
				var div = DIV.cloneNode();
				div.appendChild(node.cloneNode(true));
				return div.innerHTML;
			};
		})(),


        getViewportSize: function(doc) {
            doc = doc || document;
            var elem  = doc.compatMode == 'CSS1Compat' ? doc.documentElement : doc.body;

            var docHeight = Math.max(
                doc.body.scrollHeight, doc.documentElement.scrollHeight,
                doc.body.offsetHeight, doc.documentElement.offsetHeight,
                doc.body.clientHeight, doc.documentElement.clientHeight
            );

            return {docHeight: docHeight, clientHeight: elem.clientHeight, clientWidth: elem.clientWidth};
        },

        /**
         * Utility function for retrieving the text value of DOM nodes
         * @param {Element} elem
         */
        getText: function( elem ) {
            var ret = "",
                nodeType = elem.nodeType;

            if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
                // Use textContent for elements
                if ( typeof elem.textContent === "string" ) {
                    return elem.textContent;
                } else {
                    // Traverse its children
                    for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                        ret += this.getText( elem );
                    }
                }
            } else if ( nodeType === 3 || nodeType === 4 ) {
                return elem.nodeValue;
            }
            // Do not include comment or processing instruction nodes

            return ret;
        },

        /**
         * Utility function for conversion object to string
         * @param {Object} data
         * @param {Function} filter
         */
        data2string: function (data, filter) {
            if(typeof(data) == "string") {
                return data;
            }
            var f = filter || function () { return true; };
            var s = [];
            for(var i in data) {
	            if(utils.isArray(data[i])){
		            api.array(data[i]).forEach(function(e){
			            f(e, i) && s.push(encodeURI(i) + "=" + encodeURIComponent(e));
		            })
	            } else {
		            f(data[i], i) && s.push(encodeURI(i) + "=" + encodeURIComponent(data[i]));
	            }
            }
            return s.join("&");
        },

	    /**
	     * Utililty for check isArray
	     * @param array
	     * @returns boolean
	     */
	    isArray: function(array){
		    return Object.prototype.toString.call( array ) === '[object Array]';
	    },

        /**
         * Function witch create in glogal (window) scope public function
         * @param {Function} f - function callback (self_callback)
         * @param {Number} script_ttl - time to waiting create and call callback
         * @param {Function} f_timeout - function callback witch will be call if self_callback not called
         */
        createGlobalCallback: function (f, script_ttl, f_timeout) {
            var attachCallback = function (name) {
                var timeout = function () {
                    win[name] = function () {
                        try { win[name] = undefined; delete win[name]; } catch (e) {};
                    };
                    f_timeout && f_timeout();
                };

                var t_id = setTimeout(timeout, script_ttl || 5000);
                win[name] = function () {
                    clearTimeout(t_id);
                    try { win[name] = undefined; delete win[name]; } catch (e) {};
                    f.call(win, arguments[0]);
                };
                return name;
            };

            var i = 0;
            while(i++ < 10) {
                var name = "_" + api.random.randomString();
                if(typeof(win[name]) == "undefined") {
                    return attachCallback(name);
                }
            }
            throw new Error("createGlobalCallback: cannot create unique name for callback");
        },

        /**
         * Склонение существительных после числительных
         * @param {Number} number
         * @param {Array} titles
         * @param {Boolean} with_number
         * @example BBAPI.utils.plural(2, ["секунда", "секунды", "секунд"]); // "секунды"
         * @example BBAPI.utils.plural(5, ["секунда", "секунды", "секунд"], true); // "5 секунд"
         * @return {*}
         */
        plural: function(number, titles, with_number){
            var cases = [2, 0, 1, 1, 1, 2];
            return (with_number ? number + ' ' : '') + titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
        }

    };


    return this.publicateAPI("utils", utils);
});