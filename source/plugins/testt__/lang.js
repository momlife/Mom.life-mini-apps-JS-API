BBAPI.module("lang", function () {

    var lang = function(property_name, replacer) {
        if (window.bbLangContent && bbLangContent[property_name]) {
            if (replacer) {
                return bbLangContent[property_name].replace(/%s/g, replacer);
            } else {
                return bbLangContent[property_name];
            }
        }

        return property_name;
    };

    return this.publicateAPI("lang", lang);
});