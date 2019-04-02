import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Video} from '@shared';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent {
  swipeX = 0;
  swiped: number;

  @ViewChild('playlistElem')
  playlistElem: ElementRef<HTMLDivElement>;

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
  newVideo = '';

  constructor(public themeService: ThemeService) {
  }

  handleSwipeEnd(i: number, e: HammerInput) {
    this.swiped = null;
    if (i === this.selected) {
      return;
    }
    if (Math.abs(e.deltaX) > this.playlistElem.nativeElement.clientWidth * 0.35) {
      if (e.deltaX > 0) {
        this.removeVideo(i);
      } else {
        this.playVideo(i);
      }
    }
  }

  handleSwipe(i: number, e: HammerInput) {
    if (e.isFinal || e.pointerType !== 'touch' || matchMedia('(min-width: 576px)').matches) {
      return;
    }
    this.swiped = i;
    this.swipeX = i === this.selected ? Math.max(-20, e.deltaX) : e.deltaX;
  }

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
