import {AuthenticatedMiddleware, IMiddleware, OverrideMiddleware, Req} from '@tsed/common';
import * as express from 'express';
import {Forbidden} from 'ts-httpexceptions';

@OverrideMiddleware(AuthenticatedMiddleware)
export class AuthMiddleware implements IMiddleware {

  public use(@Req() req: express.Request) {
    if (req.get('X-SECRET-KEY') !== process.env.API_KEY) {
      throw new Forbidden('Forbidden');
    }
  }
}