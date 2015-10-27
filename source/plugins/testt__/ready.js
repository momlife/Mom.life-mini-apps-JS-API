BBAPI.module("ready", function(api) {

    var READY = function(callback){
        return $(document).ready(callback)[0];
    };

    return this.publicateAPI("ready", READY);
});