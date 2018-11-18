import { IMiddleware, Middleware, Next, Res, Value } from '@tsed/common';
import * as express from 'express';
import * as path from 'path';

@Middleware()
export class SinglePageMiddleware implements IMiddleware {
    @Value('serveStatic')
    public serveStatic: { [path: string]: string };

    public use(@Res() res: express.Response,
        @Next() next: express.NextFunction): void {
        return res.status(200).sendFile(path.resolve(this.serveStatic['/'], 'index.html'), next);
    }
}
