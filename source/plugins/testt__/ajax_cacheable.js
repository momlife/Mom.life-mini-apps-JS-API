BBAPI.load("ajax").module("ajax.cacheable", function(api){
    var cache = {};

    var ajaxCacheable = function(options){
        if(options.url){

            if(cache[options.url] && !options['no_cache']){
                options.done && options.done(cache[options.url]);
            } else {
                var req = api.ajax()
                    .url(options.url)
                    .done(function(xhr){
                        cache[options.url] = xhr;

                        options.once && options.once.call(this, xhr);
                        options.done && options.done.call(this, xhr);
                    })
                    .fail(options.fail)
                    .method(options.method)
                    .data(options.data)
                    .content_type(options.content_type);

                options.jsonp ? req.jsonp() : req.run();
            }
        }
    };

    return ajaxCacheable;
});

