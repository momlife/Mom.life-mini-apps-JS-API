PREGIEAPI.load("event", "css", "array", "browser").module("dom", function (api) {
    var self = this, // window.PREGIEAPI
        A = api.array;

    var Dom = function (doc, return_empty) {
        var D = doc || document;

        var appendList = function (element, list, prepend) {
            for(var i = 0; i < list.length; i++) {
                list[i] instanceof Array ?
                    appendList(element, list[i], prepend) :
                    (prepend ?
                        element.insertBefore(list[i], element.firstChild) :
                        element.appendChild(list[i])
                    );
            }
            return element;
        };


        var dom = function (tag_name, css, attributes) {
            var e = D.createElement(tag_name);
            css && (e.setAttribute("class", css), (e.className = css));
            attributes && (function () { for (var i in attributes) { e.setAttribute(i, attributes[i]); } })();
            return e;
        };

        dom.id = function (id) {
            return D.getElementById(id);
        };

        dom.clear = function (element) {
            return (element.innerHTML = "", element);
        };

        dom.text = function (string) {
            return D.createTextNode(string);
        };

        dom.append = function (/* element */) {
            var element = arguments[0], i = 0;
            while(++i < arguments.length) {
                arguments[i] instanceof Array ? appendList(element, arguments[i]) : element.appendChild(arguments[i]);
            }
            return element;
        };

        dom.prepend = function (/* element */) {
            var element = arguments[0], i = 0;
            while(++i < arguments.length) {
                arguments[i] instanceof Array ? appendList(element, arguments[i], true) : element.insertBefore(arguments[i], element.firstChild);
            }
            return element;
        };

        dom.insertAfter = function(element_after, element){
            element_after.parentNode.insertBefore(element, element_after.nextSibling);
        };


        dom.lookup = function (tag_name) {
            return return_empty && D == document ? [] : D.getElementsByTagName(tag_name);
        };

        dom.head = function () {
            return this.lookup("head")[0];
        };

        dom.body = function () {
            return this.lookup("body")[0];
        };

        dom.script = function (url) {
            return this("script", "", { src: url, type: "text/javascript" });
        };

        dom.loadScript = function (url, callback, options) {
            var config = self.utils.extend({
                container: dom.head()
            }, options);

            var ie = window.addEventListener == undefined;
            var listener = ie ? function () {(this.readyState.toLowerCase() == "loaded" || this.readyState.toLowerCase() == "complete") && callback.apply(this, arguments); } : callback;
            var script = dom("script", null, { "src": url, "type": "text/javascript" });
            listener && api.event.addEvent(script, ie ? "readystatechange" : "load", listener, false);
            return config.container.appendChild(script);
        };

        dom.addEvent = function(element, event_name, listener){
            return (api.event.addEvent(element, event_name, listener), element);
        };

        dom.html = function(element, html){
            return html ? (element.innerHTML = html, element) : element.innerHTML;
        };

        dom.remove = function(elements){
            elements instanceof Array ? api.array(elements).forEach(function(element, i){
                dom.remove(element);
            }) : elements.parentNode.removeChild(elements);
        };

        return dom;
    };

	return this.publicateAPI("dom", Dom);
});
