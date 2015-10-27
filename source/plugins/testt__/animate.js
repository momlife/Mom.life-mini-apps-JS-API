BBAPI.load("array", "css").module("animate", function(api){
    var win = window;

    var requestAnimFrame = (function(){
        return win.requestAnimationFrame    ||
            win.webkitRequestAnimationFrame ||
            win.mozRequestAnimationFrame    ||
            win.oRequestAnimationFrame      ||
            win.msRequestAnimationFrame     ||
            function(callback){
                setTimeout(callback, 16.66);
            }
    })();

    var makeSlide = function(element, duration, after_callback){

        api.css.show(element);
        var maxHeight = element.offsetHeight - api.css.getComputedStyle(element, "paddingBottom") - api.css.getComputedStyle(element, "paddingTop");

        var afterCallback = function(callback){
            return function(){
                api.css.style(element, {"overflow": "", "height": ""});
                callback && callback();
                after_callback && after_callback();
            }
        };

        return {
            down: function(){
                api.css.style(element, {"overflow": "hidden", "height": "0px"});

                ANIMATE(function(progress){
                    element.style.height = (progress*maxHeight) + "px";
                }, duration, afterCallback());
            },

            up: function(){
                api.css.style(element, {"overflow": "hidden", "height": maxHeight + "px"});

                ANIMATE(function(progress){
                    element.style.height = ((1-progress)*maxHeight) + "px";
                }, duration, afterCallback(function(){
                    api.css.hide(element)
                }));
            }
        }
    };


    var ANIMATE = function(loop_callback, _duration, after_callback){

        if(typeof loop_callback == "string"){
            switch (loop_callback){
                case "slideDown":
                    makeSlide.apply(this, api.array(arguments).tail()).down();
                    break;
                case "slideUp":
                    makeSlide.apply(this, api.array(arguments).tail()).up();
                    break;
            }

            return false;
        }

        var start = +new Date,
            duration = _duration || 300,
            finish = start + duration,
            running = true,
            easing = function(pos){ return (-Math.cos(pos*Math.PI)/2) + 0.5; },
            pos = 0,

            loop = function(){

                if (!running) {
                    after_callback && after_callback();
                    return;
                };

                // This is needed for opera. It doesn't pass timestamp as first
                // argument to loop.
                var time = +new Date;

                pos = time > finish ? 1 : (time-start) / duration;

                loop_callback(easing(pos), pos);

                requestAnimFrame.call(window, loop);

                if(time > finish) {
                    running = false;
                };
            };

        requestAnimFrame.call(window, loop);
    };

    return this.publicateAPI("animate", ANIMATE);
});

