"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
require("@tsed/socketio");
const path = require("path");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const express = require("express");
const _middlewares_1 = require("@middlewares");
let Server = class Server extends common_1.ServerLoader {
    /**
  * This method let you configure the middleware required by your application to works.
  * @returns {Server}
  */
    $onMountingMiddlewares() {
        this.use(common_1.GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compression({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
            extended: true
        }))
            .use(express.static(this.settings.serveStatic['/']));
    }
    $afterRoutesInit() {
        this.use(_middlewares_1.SinglePageMiddleware)
            .use(_middlewares_1.AuthMiddleware);
    }
    $onReady() {
        console.log('Server started...');
    }
    $onServerInitError(err) {
        console.error(err);
    }
};
Server = __decorate([
    common_1.ServerSettings({
        rootDir: path.resolve(__dirname),
        port: process.env.PORT || 800,
        httpsPort: false,
        secretKey: 'ZemfkEcxI04A4CE7sBW3kCpollfA4GFx',
        serveStatic: {
            '/': path.resolve('../client/dist/ngytsync'),
            '/assets': path.resolve('../assets')
        }
    })
], Server);
exports.Server = Server;
//# sourceMappingURL=server.js.map