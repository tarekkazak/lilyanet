export class MessageService {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
    }

    sendMessage(message, payload, wait = 0) {
        var io = this.io;
        var socket = this.socket;
        
        setTimeout(() => {
            io.to(socket.id).emit(message, payload);
        }, wait);
    }
}
