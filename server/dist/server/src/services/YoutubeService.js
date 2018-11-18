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
const googleapis_1 = require("googleapis");
let YoutubeService = class YoutubeService {
    constructor() {
        this.yt = googleapis_1.google.youtube({
            version: 'v3',
            auth: 'AIzaSyByzpzk6o8QvbwSzfXXf_LfL7JqdicwIzQ'
        });
    }
    createVideo(videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ytRes = yield this.yt.videos.list({
                id: videoId,
                part: 'snippet'
            });
            if (ytRes.status !== 200 || ytRes.data.items.length === 0)
                return;
            const title = ytRes.data.items[0].snippet.title;
            return {
                id: videoId,
                title
            };
        });
    }
};
YoutubeService = __decorate([
    common_1.Service(),
    __metadata("design:paramtypes", [])
], YoutubeService);
exports.YoutubeService = YoutubeService;
//# sourceMappingURL=YoutubeService.js.map