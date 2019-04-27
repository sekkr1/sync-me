import {RoomsStorage} from '@services';
import {Authenticated, BodyParams, Controller, Get, PathParams, Post, Response} from '@tsed/common';

@Controller('/reserve')
export class MyController {
  constructor(private roomsStorage: RoomsStorage) {
  }

  @Get('/video/:videoId')
  async openRoom(@PathParams('videoId') videoId: string, @Response() res: Express.Response) {
    console.log('asdasd');
    console.log(videoId);
    const roomId = await this.roomsStorage.reserveRoom([videoId]);
    res.redirect(`/${roomId}`);
  }

  @Post('/playlist')
  @Authenticated()
  async reserveRoom(@BodyParams() videoIds: string[]): Promise<string> {
    return this.roomsStorage.reserveRoom(videoIds);
  }
}
