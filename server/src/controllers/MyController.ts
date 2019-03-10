import {RoomsStorage} from '@services';
import {Authenticated, BodyParams, Controller, Post} from '@tsed/common';

@Controller('/reserve')
export class MyController {
  constructor(private roomsStorage: RoomsStorage) {
  }

  @Post('/')
  @Authenticated()
  async reserveRoom(@BodyParams() videoIds: string[]): Promise<string> {
    return this.roomsStorage.reserveRoom(videoIds);
  }
}