import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'app-new-room',
  templateUrl: './new-room.component.html',
  styleUrls: ['./new-room.component.scss']
})
export class NewRoomComponent {
  @ViewChild('linkInput')
  linkInput: ElementRef<HTMLInputElement>;

  @Input()
  addVideo: (video: string) => void;

  pastedUrl = '';

  constructor(public bsModalRef: BsModalRef,
              public route: ActivatedRoute) {
  }

  getURL() {
    return document.URL;
  }

  copyLink() {
    this.linkInput.nativeElement.select();
    document.execCommand('copy');
    if (this.pastedUrl) {
      this.addVideo(this.pastedUrl);
    }
    this.bsModalRef.hide();
  }
}
