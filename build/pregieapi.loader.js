(function (){

            var plugins = ["source/core.js"
,"source/plugins/api.js"
,"source/plugins/date.js"
,"source/plugins/device.js"
,"source/plugins/random.js"
,"source/plugins/utils.js"
];

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


            var base = findBaseUrl('pregieapi.loader.js').replace(/build.*/, '');

            for(var i=0; i<plugins.length; i++){
                document.write('<script src="' + base + plugins[i] + '"></scr' + 'ipt>');
            }
        })();