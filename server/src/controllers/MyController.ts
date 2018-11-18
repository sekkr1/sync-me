import { Controller, Post, BodyParams, Authenticated } from "@tsed/common";
import { RoomsStorage } from "@services";

@Controller('/reserve')
export class MyController {
    constructor(private roomsStorage: RoomsStorage) { }

    @Post("/")
    @Authenticated()
    async reserveRoom(@BodyParams() videoIds: string[]): Promise<string> {
        return this.roomsStorage.reserveRoom(videoIds);
    }
}