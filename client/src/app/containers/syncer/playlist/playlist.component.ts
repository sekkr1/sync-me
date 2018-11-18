import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Video } from '@shared';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent {

  @Input()
  videos: Video[];

  @Input()
  selected: number;

  @Output()
  selectedChange = new EventEmitter<number>();

  @Output()
  videoRemove = new EventEmitter<number>();

  @Output()
  videoAdd = new EventEmitter<string>();

  addVideo(newVideo: string) {
    let newVideoId = newVideo;
    if (newVideo.length !== 11) {
      const match = newVideo.match(/(\?v=|youtu\.be\/)(.{11})/i);
      if (!match)
        return;
      newVideoId = match[2];
    }
    this.videoAdd.emit(newVideoId);
  }

  removeVideo(id: number) {
    this.videoRemove.emit(id);
  }

  playVideo(id: number) {
    this.selectedChange.emit(id);
  }
}
