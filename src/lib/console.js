;(function(g) {
    'use strict';
    if(typeof g.console === 'object' && g.console != null){
        return true;
    }
    var _console = g.console || {};
    var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'exception', 'error', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
    var console = {version: '0.2.0'};
    var key;
    for(var i = 0; i < methods.length; i++) {
        key = methods[i];
        console[key] = function (key) {
            return function () {
                if (typeof _console[key] !== 'function') {
                    return 0;
                }
                try {
                    _console[key].apply(this,arguments);
                } catch (exp) {
                }
            };
        }(key);
    }

    g.console = console;
}(window));