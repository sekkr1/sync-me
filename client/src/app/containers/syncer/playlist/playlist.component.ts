import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Video } from '@shared';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
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

  newVideo: string = '';

  addVideo() {
    this.videoAdd.emit(this.newVideo);
    this.newVideo = '';
  }

  removeVideo(id: number) {
    this.videoRemove.emit(id);
  }

  playVideo(id: number) {
    this.selectedChange.emit(id);
  }
}
