import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {Video} from '@shared';
import * as YouTubePlayer from 'youtube-player';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements AfterViewInit {
  @Input()
  suggestedQuality = 'hd1080';
  @Output()
  stateChange = new EventEmitter<any>();
  player: any;
  ignorePlay = false;
  ignorePause = false;

  _video: Video;

  get video() {
    return this._video;
  }

  @Input()
  set video(value: Video) {
    this._video = value;
    if (this.player) {
      this.player.loadVideoById({
        videoId: value.id,
        suggestedQuality: this.suggestedQuality
      });
    }
  }

  ngAfterViewInit() {
    this.player = YouTubePlayer('player', {
      width: '100%',
      height: '100%'
    });
    this.player.on('stateChange', (event: any) => {
      switch (event.data) {
        case 1:
          if (this.ignorePlay) {
            this.ignorePlay = false;
            return;
          }
          break;
        case 3:
          if (this.ignorePlay) {
            return;
          }
          break;
        case 2:
          if (this.ignorePause) {
            this.ignorePause = false;
            return;
          }
      }
      this.stateChange.emit(event);
    });
    if (this.video) {
      this.player.loadVideoById({
        videoId: this.video.id,
        suggestedQuality: this.suggestedQuality
      });
    }
  }

  public seekTo(seconds: number) {
    this.player.seekTo(seconds, true);
  }

  public pause() {
    this.ignorePause = true;
    this.player.pauseVideo();
  }

  public play() {
    this.ignorePlay = true;
    this.player.playVideo();
  }
}
