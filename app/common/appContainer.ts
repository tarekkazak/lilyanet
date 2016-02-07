/// <reference path="../../typings/tsd.d.ts" />
'use strict';
var mongoose = require('mongoose');

var daoDecorator = function(mongoose) {
    return function(target:any, key:string)  {
        //property value
        var _val = mongoose;
        
        // property getter
        var getter = function () {
            return _val;
        };
    
        // property setter
        var setter = function (newVal) {
            _val = newVal;
        };
    
        // Delete property.
        if (delete target[key]) {
                                       
            // Create new property with getter and setter
            Object.defineProperty(target, key, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            });
        }
    };
}

export var dao = daoDecorator(mongoose);

let wordSchema = new mongoose.Schema({
    value : String,
    syllables : Array,
    searchTerm : String,
    location : String,
    selected : Boolean
});
export var Word = mongoose.model('Word', wordSchema);

class AppContainer {
    public model:any;
    constructor() {
    }

}

export var appContainer = new AppContainer();