BBAPI.load("array").module("css", function (api) {
    var self = this;

    /**
     * @namespace api.array
     * @type {Function}
     */
    var A = api.array;

	var matchArgs = function (patterns) {
		var any_count = patterns["*"] || function () {
			throw "No pattern found for " + arguments;
		};
		
		return function () {
			return (patterns[arguments.length] || any_count).apply(window, arguments);
		};
	};

	var setClassName = function (element, class_name) {
		return (element.className = class_name, element);
	};

	var getClassName = function (element) {
		return element.className;
	};

	var getNamesList = function (class_name) {
		return class_name.split(" ");
	};

	var addClass = function (element, class_name) {
		(A(getNamesList(element.className)).indexOf(class_name) == -1) && (element.className += " " + class_name);
		return element;
	};

	var removeClass = function (element, class_name) {
		element.className = A(getNamesList(element.className)).filter(function (c) { return !!c && (c != class_name); }).join(" ");
		return element;
	};

    var toggleClass = function(element, class_name){
        hasClass(element, class_name) ? removeClass(element, class_name) : addClass(element, class_name);
        return element;
    };

    var hasClass = function (element, class_name) {
        return A(getNamesList(element.className)).indexOf(class_name) != -1;
    };

    var computedStyle = function(element, style){
        return parseInt((window.getComputedStyle ? getComputedStyle(element, '') : element.currentStyle)[style]);
    };

    var isVisible = function(element){
        return element.offsetWidth > 0 && element.offsetHeight > 0;
    };

    var CSS = {
        className: matchArgs({1: getClassName, 2: setClassName }),
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        hasClass: hasClass,

        getComputedStyle: computedStyle,

        isVisible: isVisible,

        style: function(element, styles){
            return (self.utils.extend(element.style, styles), element);
        },

        show: function(element){
            return this.style(element, {display: "block"});
        },

        hide: function(element){
            return this.style(element, {display: "none"});
        },

        showV: function(element){
            return this.style(element, {visibility: "inherit"});
        },

        hideV: function(element){
            return this.style(element, {visibility: "hidden"});
        },

        showIb: function(element){
            return this.style(element, {display: "inline-block"});
        }
    };

	return this.publicateAPI("css", CSS);
});