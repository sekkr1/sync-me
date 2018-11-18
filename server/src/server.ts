import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from "@tsed/common";
import "@tsed/socketio";
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as methodOverride from 'method-override';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { SinglePageMiddleware, AuthMiddleware } from "@middlewares";

@ServerSettings({
    rootDir: path.resolve(__dirname),
    domain: 'https://youtube-syncplay.herokuapp.com',
    port: process.env.PORT || 80,
    httpsPort: false,
    secretKey: 'DESIRED_API_KEY',
    discord: {
        token: 'DISCORD_TOKEN',
        prefix: '!'
    },
    googleToken: 'YOUTUBE_API_TOKEN',
    serveStatic: {
        '/': path.resolve('../client/dist/ngytsync'),
        '/assets': path.resolve('../assets')
    }
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
            }))
            .use(express.static(this.settings.serveStatic['/']));
    }

    public $afterRoutesInit() {
        this.use(SinglePageMiddleware)
            .use(AuthMiddleware);
    }

    public $onReady() {
        console.log('Server started...');
    }

    public $onServerInitError(err) {
        console.error(err);
    }
}