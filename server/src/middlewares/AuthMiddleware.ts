import { OverrideMiddleware, AuthenticatedMiddleware, IMiddleware, Req, Value } from "@tsed/common";
import { Forbidden } from "ts-httpexceptions";
import * as express from 'express';

@OverrideMiddleware(AuthenticatedMiddleware)
export class AuthMiddleware implements IMiddleware {
    @Value('secretKey')
    secretKey: string;

    public use(@Req() req: express.Request) {
        if (req.get('X-SECRET-KEY') !== this.secretKey)
            throw new Forbidden("Forbidden")
    }
}