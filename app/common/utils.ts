'use strict';
var inspect = require('folktale/core');
export class Utils {
    static trace(value) {
        console.log('trace it', inspect(value));
        return value;
    }

    static curriedFilter(p) {
        return (arr) => arr.filter(p);
    } 
}
