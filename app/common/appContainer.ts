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
    console.log('new socket', socket.id);
    exports.socket = socket;
    exports.io = io;
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
        let tagSchema = new mongoose.Schema({
            text : String
        });

        let wordSchema = new mongoose.Schema({
            value : String,
            syllables : Array,
            searchTerm : String,
            images : Array,
            tags : Array,
            selected : Boolean
        });

        exports.Word = mongoose.model('Word', wordSchema);
        exports.Tag = mongoose.model('Tag', tagSchema);
    
    }

    var MessageService = require('../core/service/messageService').MessageService;

    exports.messageService =  function(target:any) {
            var original = target;

            // a utility function to generate instances of a class
            function construct(constructor, args) {

                let instance =  new constructor(...args);
                instance.messageService = new MessageService(exports.socket, exports.io);
                //console.log('service', instance.messageService.socket.id);
                return instance;
            }

            // the new constructor behaviour
            var f : any = function () {
            //console.log("New: " + original.name); 
                return construct(original, arguments);
            }

            // copy prototype so intanceof operator still works
            f.prototype = original.prototype;

            // return new constructor (will override original)
            return f;

    };
    //exports.messageService = (function(service) {
    //    return function(target:any, key:string)  {
    //        
    //        // property getter
    //        var getter = function () {
    //            return service;
    //        };
    //    
    //        // Delete property.
    //        if (delete target[key]) {
    //                                       
    //            // Create new property with getter and setter
    //            Object.defineProperty(target, key, {
    //                get: getter,
    //                enumerable: true,
    //                configurable: true
    //            });
    //        }
    //    };
    //})(msgService);

    var LilyaNet = require('../core/model/lilyanet').LilyaNet;
    var lilyaNet = new LilyaNet(mode);
    lilyaNet.init();
    initialized = true;
    return lilyaNet;
}
