import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from "@tsed/common";
import "@tsed/socketio";
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as methodOverride from 'method-override';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as fs from 'fs'
import { AuthMiddleware } from "@middlewares";

@ServerSettings({
    rootDir: path.resolve(__dirname),
    port: process.env.PORT || 3000,
    secretKey: 'DESIRED_API_KEY',
    discord: {
        token: 'DISCORD_TOKEN',
        prefix: '!'
    },
    googleToken: 'YOUTUBE_API_TOKEN'
})
export class Server extends ServerLoader {
    /**
  * This method let you configure the middleware required by your application to works.
  * @returns {Server}
  */
    public $onMountingMiddlewares(): void | Promise<any> {
        this.use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compression({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));
    }

    public $afterRoutesInit() {
        this.use(AuthMiddleware);
    }

    public $onReady() {
        console.log('Server started...');
    }

    public $onServerInitError(err) {
        console.error(err);
    }
}