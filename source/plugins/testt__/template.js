BBAPI.load("ajax", "ajax.cacheable", "dom", "array", "utils").module("template", function(api){

    var cache = {};

    var makeElement = function(template_name){
        return function(){
            var div = api.dom()("div");
            div.innerHTML = cache[template_name];

            return div;
        }
    };

    var tplToHTML = function(str) {
        var fn = new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
            // Сделать данные доступными локально при помощи with(){}
            "with(obj){p.push('" +
            // Превратить шаблон в чистый JavaScript
            str
                .replace(/[\r\t\n]/g, " ")
                .split("<%").join("\t")
                .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)%>/g, "',$1,'")
                .split("\t").join("');")
                .split("%>").join("p.push('")
                .split("\r").join("\\'")
            + "');}return p.join('');"
        );
        return fn;
    };


    /**
     * Отрисовка шаблона.
     *
     * @param template_name string - название шабона. Может принимать значения
     *	    //fileName/blockName - будет запрошен файл fileName.xml, в котором находится <template id="blockName">
     *	    //fileName - будет запрошен файл fileName.htm, который будет целиком интерпретирован как один шаблон
     *	    blockName - будет искаться в текущей dom-модели элемент с id = blockName
     * @param data - данные для вставки в шаблон
     * @param callback - каллбэк который вызывается после получения и рендера шаблона
     * @param options - дополнительные настройки для шаблонизатора
     * @return String template_name
     **/
    var makeTpl = function(template_name, data, callback, options) {
        var config = api.utils.extend({
            path: null,
            call_callback: false
        }, options);

        if(typeof data == "function"){
            callback = data;
        }

        var xpath = template_name.match(/(\/\/)?([^\/]*)(?:\/)?(.*)?/),
            remote = xpath[1],
            fileName = xpath[2],
            templateId = xpath[3];


        if(templateId){ // запрашиваем файл //fileName.xml и ищем в нем <element id="blockName">
            api.ajax.cacheable({
                url: (config.path || api.utils.getProjectPath("/js/tpl_js/")) + fileName + '.xml',
                content_type: "text/xml",
                done: function(xhr){

                    var element, nodes = api.dom(xhr.xml()).lookup("*");

                    for(var i=0; i<nodes.length; i++){
                        var item = nodes.item(i);
                        if(item.getAttribute("id") == templateId){
                            element = item;
                        }
                    }

                    /*
                     // IE as always - the filter method on XML DOM does not work.
                     var element = api.array(api.dom(xhr.xml()).lookup("*")).filter(function(e){
                     return e.getAttribute("id") == templateId;
                     })[0];
                     */

                    if(element){
                        callback.call(cache, cache[template_name] = tplToHTML(api.utils.getText(element))(data), makeElement(template_name), data);
                    }

                    // force запус callback (к примеру для получения кэш копии)
                    if(config.call_callback){
                        callback.call(cache);
                    }
                }
            });

        } else if(remote && fileName){ // запрашиваем файл //fileName.htm
            api.ajax.cacheable({
                url: (config.path || api.utils.getProjectPath("/js/tpl_js/")) + fileName + '.htm',
                content_type: "text/html",
                done: function(xhr){
                    if(api.array([200]).indexOf(xhr.status()) != -1){
                        callback.call(cache, cache[template_name] = tplToHTML(xhr.body())(data), makeElement(template_name), data);
                    }
                }
            });

        } else { // используем inline элемент на странице
            var element = api.dom().id(fileName);
            if(element){
                callback.call(cache, cache[template_name] = tplToHTML(element.innerHTML)(data), makeElement(template_name), data);
            }
        }

        return template_name;
    };

    makeTpl.tplToHTML = tplToHTML;


    return this.publicateAPI("template", makeTpl);
});