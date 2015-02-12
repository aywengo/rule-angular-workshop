(function (global) {
    var EE;

    if (!global.rule) {
        global.rule = {};
    }

    EE = function () {
        this.listeners = {};
    };

    EE.prototype.on = function (eventName, listener, context) {
        var that = this;

        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }

        var listenerData = {lstnr: listener, cntx: context};
        this.listeners[eventName].push(listenerData);

        return function () {
            for (var i = 0; i < that.listeners[eventName].length; i++) {
                if (that.listeners[eventName][i] === listenerData) {
                    that.listeners[eventName].splice(i, 1);
                    break;
                }
            }
        }
    };

    EE.prototype.emit = function (eventName, data) {
        var args = Array.prototype.splice.call(arguments, data);

        this.listeners[eventName].forEach(function (callback) {
            callback.lstnr.apply(callback.cntx, args);
        });
    };

    global.rule.EventEmitter = EE;

}(window));
