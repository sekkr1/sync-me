import { Component, AfterViewInit, Input, Output, EventEmitter, Optional } from '@angular/core';
import * as YouTubePlayer from 'youtube-player';
import { Video } from '@shared';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements AfterViewInit {
  _video: Video;

  @Input()
  set video(value: Video) {
    this._video = value;
    if (this.player)
      this.player.loadVideoById({
        videoId: value.id,
        suggestedQuality: this.suggestedQuality
      });
  }
  get video() {
    return this._video;
  }

  @Input()
  suggestedQuality = 'hd1080';

  @Output()
  stateChange = new EventEmitter<any>();

  player: any;
  ignorePlay = false;
  ignorePause = false;

  ngAfterViewInit() {
    this.player = YouTubePlayer('player', {
      width: "100%",
      height: "100%"
    });
    this.player.on('stateChange', (event: any) => {
      switch (event.data) {
        case 1:
          if (this.ignorePlay) {
            this.ignorePlay = false;
            return;
          }
        case 3:
          if (this.ignorePlay)
            return;
        case 2:
          if (this.ignorePause) {
            this.ignorePause = false;
            return;
          }
      }
      this.stateChange.emit(event);
    });
    if (this.video)
      this.player.loadVideoById({
        videoId: this.video.id,
        suggestedQuality: this.suggestedQuality
      });
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
