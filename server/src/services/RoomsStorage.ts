import {PlaylistData} from '@shared';
import {Service} from '@tsed/common';
import * as shortid from 'shortid';
import {YoutubeService} from './YoutubeService';

@Service()
export class RoomsStorage {

  private readonly rooms: Map<string, PlaylistData> = new Map<string, PlaylistData>();

  constructor(private youtubeService: YoutubeService) {
  }

  public getRoom(roomId: string): PlaylistData {
    return this.rooms.get(roomId);
  }

  public hasRoom(roomId: string): boolean {
    return this.rooms.has(roomId);
  }

  public deleteRoom(roomId: string) {
    this.rooms.delete(roomId);
  }

  public generateRoom(): string {
    let roomId: string;
    do
      roomId = shortid.generate();
    while (this.hasRoom(roomId));

    this.rooms.set(roomId, {
      playlist: [],
      selected: 0,
      connected: 0
    });
    return roomId;
  }

  public async reserveRoom(videoLinks: string[]): Promise<string> {
    const roomId = this.generateRoom();
    const room = this.getRoom(roomId);
    setTimeout(() => {
      if (room.connected === 0) {
        this.deleteRoom(roomId);
      }
    }, 60000);
    for (let videoLink of videoLinks) {
      const video = await this.youtubeService.createVideo(videoLink);
      console.log(video);
      if (video) {
        room.playlist.push(video);
      }
    }
    console.log(videoLinks);
    console.log(room);
    return roomId;
  }
}