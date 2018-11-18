"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SocketIO = require("socket.io");
const socketio_1 = require("@tsed/socketio");
const RoomsStorage_1 = require("./RoomsStorage");
const YoutubeService_1 = require("./YoutubeService");
let MySocketService = class MySocketService {
    constructor(roomsStorage, youtubeService) {
        this.roomsStorage = roomsStorage;
        this.youtubeService = youtubeService;
    }
    /**
     * Triggered when a new client connects to the Namespace.
     */
    $onConnection(socket, session) {
        let roomId;
        if ('room' in socket.handshake.query && this.roomsStorage.hasRoom(socket.handshake.query.room))
            roomId = socket.handshake.query.room;
        else
            roomId = this.roomsStorage.generateRoom();
        // add to room
        socket.join(roomId);
        // notify room id to client
        socket.emit('joined room', roomId);
        const room = this.roomsStorage.getRoom(roomId);
        // tell room new user joined        
        room.connected++;
        this.nsp.to(roomId).emit('join');
        session.set('roomId', roomId);
        session.set('room', room);
        // give client data
        socket.emit('playlist data', room);
    }
    /**
     * Triggered when a client disconnects from the Namespace.
     */
    $onDisconnect(session) {
        session.get('room').connected--;
        if (session.get('room').connected > 0)
            this.nsp.to(session.get('roomId')).emit('leave');
        else
            this.roomsStorage.deleteRoom(session.get('roomId'));
    }
    playVideo(id, session) {
        this.nsp.to(session.get('roomId')).emit('play video', id);
    }
    addVideo(videoId, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const newVideo = yield this.youtubeService.createVideo(videoId);
            session.get('room').playlist.push(newVideo);
            this.nsp.to(session.get('roomId')).emit('video added', newVideo);
        });
    }
    removeVideo(id, session) {
        if (id < session.get('room').selected)
            session.get('room').selected--;
        else if (id === session.get('room').selected) {
            if (session.get('room').selected === session.get('room').playlist.length - 1)
                session.get('room').selected--;
            else
                session.get('room').selected++;
        }
        session.get('room').playlist.splice(id, 1);
        this.nsp.to(session.get('roomId')).emit('remove video', id);
    }
    pause(seconds, socket, session) {
        socket.to(session.get('roomId')).emit('pause', seconds);
    }
    play(seconds, socket, session) {
        socket.to(session.get('roomId')).emit('play', seconds);
    }
};
__decorate([
    socketio_1.Nsp,
    __metadata("design:type", Object)
], MySocketService.prototype, "nsp", void 0);
__decorate([
    __param(0, socketio_1.Socket), __param(1, socketio_1.SocketSession),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MySocketService.prototype, "$onConnection", null);
__decorate([
    __param(0, socketio_1.SocketSession),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MySocketService.prototype, "$onDisconnect", null);
__decorate([
    socketio_1.Input('play video'),
    __param(0, socketio_1.Args(0)), __param(1, socketio_1.SocketSession),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], MySocketService.prototype, "playVideo", null);
__decorate([
    socketio_1.Input('add video'),
    __param(0, socketio_1.Args(0)), __param(1, socketio_1.SocketSession),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MySocketService.prototype, "addVideo", null);
__decorate([
    socketio_1.Input('remove video'),
    __param(0, socketio_1.Args(0)), __param(1, socketio_1.SocketSession),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], MySocketService.prototype, "removeVideo", null);
__decorate([
    socketio_1.Input('pause'),
    __param(0, socketio_1.Args(0)), __param(1, socketio_1.Socket), __param(2, socketio_1.SocketSession),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], MySocketService.prototype, "pause", null);
__decorate([
    socketio_1.Input('play'),
    __param(0, socketio_1.Args(0)), __param(1, socketio_1.Socket), __param(2, socketio_1.SocketSession),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], MySocketService.prototype, "play", null);
MySocketService = __decorate([
    socketio_1.SocketService(),
    __metadata("design:paramtypes", [RoomsStorage_1.RoomsStorage,
        YoutubeService_1.YoutubeService])
], MySocketService);
exports.MySocketService = MySocketService;
//# sourceMappingURL=MySocketService.js.map