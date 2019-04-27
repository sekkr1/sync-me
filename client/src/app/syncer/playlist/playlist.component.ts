import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Video} from '@shared';
import {PageChangedEvent, PaginationComponent} from 'ngx-bootstrap';
import {combineLatest, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ThemeService} from '../../services/theme.service';
import {YoutubeService} from '../../services/youtube.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent {
  swipeX = 0;
  swiped: number;
  searchMode = true;
  lastPaste = '';
  inputReset = true;
  playlistMode = true;
  searchList: Observable<Video[]>;
  @ViewChild(PaginationComponent)
  searchPager: PaginationComponent;

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

  constructor(public themeService: ThemeService,
              private yt: YoutubeService,
              private cdr: ChangeDetectorRef) {
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

  handlePaste(str: string) {
    this.lastPaste = str;
    console.log('pasted ' + str);
  }

  handleChange(str: string) {
    console.log('change ' + str);
    if (str === this.lastPaste) {
      this.searchMode = false;
      this.inputReset = false;
    } else {
      if (str === '') {
        this.searchMode = true;
        this.inputReset = true;
      } else if (this.inputReset) {
        this.searchMode = true;
        this.inputReset = false;
      }
    }
  }

  searchVideos() {
    this.playlistMode = false;
    this.cdr.detectChanges();
    this.searchList = combineLatest([this.yt.searchVideos(this.newVideo),
      this.searchPager.pageChanged.pipe(
        map((e: PageChangedEvent) => e.page - 1),
        startWith(0)
      )]).pipe(
      map(([vids, page]: [Video[], number]) => {
        return vids.slice(this.searchPager.itemsPerPage * page, this.searchPager.itemsPerPage * (page + 1));
      })
    );
  }

  log(e: any) {
    console.log(e);
  }
}
