BBAPI.module("hooks", function (api) {

	var hooks = {
        
        list: {},

        addHook: function (name, func)
        {
            if (!this.list[name]) this.list[name] = [];
            this.list[name].push(func);
        },

        raiseHooks: function (name, params)
        {
            if (this.list[name])
                for (var i in this.list[name])
                    this.list[name][i](params);
        },

        clearHooks: function (name)
        {
           this.list[name] = [];
        }
    };

    return hooks;
});

