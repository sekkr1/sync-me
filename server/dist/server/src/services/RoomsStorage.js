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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const shortid = require("shortid");
const YoutubeService_1 = require("./YoutubeService");
let RoomsStorage = class RoomsStorage {
    constructor(youtubeService) {
        this.youtubeService = youtubeService;
        this.rooms = new Map();
    }
    getRoom(roomId) {
        return this.rooms.get(roomId);
    }
    hasRoom(roomId) {
        return this.rooms.has(roomId);
    }
    deleteRoom(roomId) {
        this.rooms.delete(roomId);
    }
    generateRoom() {
        let roomId;
        do
            roomId = shortid.generate();
        while (this.hasRoom(roomId));
        this.rooms.set(roomId, {
            playlist: [],
            selected: 0,
            connected: 0
        });
        return roomId;
    }
    reserveRoom(videoIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomId = this.generateRoom();
            const room = this.getRoom(roomId);
            setTimeout(() => {
                if (room.connected === 0)
                    this.deleteRoom(roomId);
            }, 60000);
            for (let videoId of videoIds) {
                const video = yield this.youtubeService.createVideo(videoId);
                if (video)
                    room.playlist.push(video);
            }
            return roomId;
        });
    }
};
RoomsStorage = __decorate([
    common_1.Service(),
    __metadata("design:paramtypes", [YoutubeService_1.YoutubeService])
], RoomsStorage);
exports.RoomsStorage = RoomsStorage;
//# sourceMappingURL=RoomsStorage.js.map