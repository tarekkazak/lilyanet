/// <reference path="../../../typings/tsd.d.ts" />
export class MessageService {

    constructor(private socket,  private io) { 
    }


    on(channel, callback) {
        this.socket.on(channel, callback);
    }

    sendMessage(message, payload, wait) {
        wait = wait > 0 ? wait : 0;
                   
        var io = this.io;
        var socket = this.socket;
        
        setTimeout(() => {
            io.to(socket.id).emit(message, payload);
        }, wait);
    }
}


/*export function messageService(target:any) {
    var original = target;

    // a utility function to generate instances of a class
    function construct(constructor, args) {

        let instance =  new constructor(...args);
        //let getMsgService = monads.map((x) => x.isJust ? x.get() : new MessageService(instance.io, instance.socket)),  
        let msgService = messageServiceMap.get(instance.socket.id);
        instance.messageService = msgService ? msgService : new MessageService(instance.io, instance.socket);
        //getMsgService(Maybe.fromNullable(messageServiceMap.get(instance.socket.id)));
        return instance;
    }

    // the new constructor behaviour
    var f : any = function () {
        console.log("New: " + original.name); 
        return construct(original, arguments);
    }

    // copy prototype so intanceof operator still works
    f.prototype = original.prototype;

    // return new constructor (will override original)
    return f;
}*/
