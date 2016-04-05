/// <reference path="../../typings/tsd.d.ts" />
var initialized = false;
export var messageBus;
export function registerSocket(socket) {
    messageBus = socketDecorator(socket);
}

function socketDecorator(socket) {
    return function(target:any, key:string)  {
        //property value
        var _val = socket;
        
        // property getter
        var getter = function () {
            return _val;
        };
    
        // Delete property.
        if (delete target[key]) {
                                       
            // Create new property with getter and setter
            Object.defineProperty(target, key, {
                get: getter,
                enumerable: true,
                configurable: true
            });
        }
    };

}

export function init(socket, io, mode) {
    var mongoose = require('mongoose');

    exports.dao =  function(target:any, key:string)  {
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

    if(!initialized) {
        let wordSchema = new mongoose.Schema({
            value : String,
            syllables : Array,
            searchTerm : String,
            images : Array,
            tags : Array,
            selected : Boolean
        });

        exports.Word = mongoose.model('Word', wordSchema);
    
    }

    var MessageService = require('../core/service/messageService').MessageService;
    var msgService = new MessageService(socket, io);
    exports.messageService = function(target:any, key:string)  {
        //property value
        var _val = msgService;
        
        // property getter
        var getter = function () {
            return _val;
        };
    
        // Delete property.
        if (delete target[key]) {
                                       
            // Create new property with getter and setter
            Object.defineProperty(target, key, {
                get: getter,
                enumerable: true,
                configurable: true
            });
        }
    };
    var LilyaNet = require('../core/model/lilyanet').LilyaNet;
    var lilyaNet = new LilyaNet(mode);
    lilyaNet.init();
    initialized = true;
    return lilyaNet;
}
