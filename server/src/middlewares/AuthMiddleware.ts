import { OverrideMiddleware, AuthenticatedMiddleware, IMiddleware, Req } from "@tsed/common";
import { Forbidden } from "ts-httpexceptions";
import * as express from 'express';

@OverrideMiddleware(AuthenticatedMiddleware)
export class AuthMiddleware implements IMiddleware {

    public use(@Req() req: express.Request) {
        if (req.get('X-SECRET-KEY') !== process.env.API_KEY)
            throw new Forbidden("Forbidden")
    }
}