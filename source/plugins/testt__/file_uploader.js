BBAPI.load("random", "utils", "event", "dom", "css", "array").module("fileUploader", function(api){
    var win = window;

    var FILE_UPLOADER = function(){
        this.config = {
            login: "",
            data: {},
            folder: "/",
            url: api.utils.getProjectPath() + "/js/uploader.php",
            start: function(){},
            done: function(){},
            fail: function(){},
            statusCode: {}
        };

        this.input = !0;
    };

    FILE_UPLOADER.prototype.init = function(element, options){

        api.utils.extend(this.config, options);

        // если это input type="file" - работаем с ним, иначе создаем новый input в element, который получили
        if(element.tagName.toUpperCase() == "INPUT" && element.type.toUpperCase() == "FILE"){
            this.input = element;
        } else {
            this.input = this.createInput(element);
        };

        // создание <form>
        this.input.parentNode.insertBefore(this.createForm(), this.input);

        // перенос input-а в форму
        this.form.insertBefore(this.input, null);

        // собыия по onchange
        api.event.addEvent(this.input, "change", api.utils.closure(this, this.onchange));

        return this;
    };

    FILE_UPLOADER.prototype.createForm = function(){
        var dom = api.dom();

        var unique_name = "file_uploader_" + Math.round(Math.random()*1000000);
        var iframe = api.css.hide(dom("iframe", "", {name: unique_name, width: "0", height: "0"}));

        return this.form = dom.append(dom("form", "", {enctype: "multipart/form-data", method: "post", target: unique_name, action: this.config.url}), [
            iframe,
            dom("input", "", {type: "hidden", name: "login", value: this.config.login}),
            dom("input", "", {type: "hidden", name: "folder", value: this.config.folder})
        ]);
    };

    FILE_UPLOADER.prototype.createInput = function(element){
        var dom = api.dom();

        var input = dom("input", "", {type: "file", "name": "file"});
        dom.append(element, input);

        return input;
    };

    FILE_UPLOADER.prototype.createCallback = function(f){
        var attachCallback = function (name) {
            win[name] = function () {
                try { win[name] = undefined; delete win[name]; } catch (e) {};
                f.call(win, arguments[0]);
            };
            return name;
        };

        var i = 0;
        while(i++ < 10) {
            var name = "BBJSONP_fileUploader_" + api.random.randomString();
            if(typeof(win[name]) == "undefined") {
                return attachCallback(name);
            };
        };

        throw new Error("BBAPI.fileUploader.createCallback: cannot create unique name for callback");
    };

    FILE_UPLOADER.prototype.onchange = function(){
        var dom = api.dom();

        var input_callback = dom("input", "", {type: "hidden", name: "namecallback", value: this.createCallback(api.utils.closure(this, this.done))});
        dom.append(this.form, input_callback);

        var data = [];
        for(var i in this.config.data){
            var el = dom('input', null, {'type': 'hidden', 'name': i, 'value': this.config.data[i]});
            data.push(el);
            dom.append(this.form, el);
        }

        this.config.start.call(this);
        this.form.submit();

        api.array(data).forEach(function(e){
            dom.remove(e);
        });

        input_callback.parentNode.removeChild(input_callback);

    };

    FILE_UPLOADER.prototype.done = function(result){
        (this.config.statusCode[result.status] || (result.status.toString().match(/^20\d$/) ? this.config.done : this.config.fail)).call(this, result.data, result);
    };

    var fileUploader = function(el, opt){
        return new FILE_UPLOADER().init(el, opt);
    };

    fileUploader.isSupported = function(){
        var notSupportedBrowsers = ["Windows Phone 8.0"];

        return !navigator.userAgent.match(new RegExp(notSupportedBrowsers.join("|"), "ig"));
    };

    return this.publicateAPI("fileUploader", fileUploader);
});