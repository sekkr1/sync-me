import {SocketErr, SocketMiddlewareError} from '@tsed/socketio';

@SocketMiddlewareError()
export class ErrorHandlerSocketMiddleware {
  async use(@SocketErr err: any) {
    if (err.toString().includes('Cast error')) {
      return;
    }
    console.error(err);
  }
}
