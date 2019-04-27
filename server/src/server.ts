import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from '@tsed/common';
import '@tsed/socketio';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as methodOverride from 'method-override';
import * as path from 'path';

@ServerSettings({
  rootDir: path.resolve(__dirname),
  port: 3000,
  discordPrefix: '!',
  socketIO: {
    pingInterval: 7000,
    pingTimeout: 3500
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
    }));
  }

  public $afterRoutesInit() {
    //this.use(AuthMiddleware);
  }

  public $onReady() {
    console.log('Server started...');
  }

  public $onServerInitError(err) {
    console.error(err);
  }
}
