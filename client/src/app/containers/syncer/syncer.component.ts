import { Component, OnInit, ChangeDetectorRef, ViewChild, Inject, OnDestroy, isDevMode } from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as io from 'socket.io-client';
import { PlaylistData, Video } from '@shared';
import { Location } from '@angular/common';

@Component({
  selector: 'app-syncer',
  templateUrl: './syncer.component.html',
  styleUrls: ['./syncer.component.scss']
})
export class SyncerComponent {


  @ViewChild(PlayerComponent)
  player: PlayerComponent;

  playlist: Video[] = [];
  connected = 0;
  selected = 0;
  socket: SocketIOClient.Socket;

  constructor(cd: ChangeDetectorRef,
    activatedRoute: ActivatedRoute,
    router: Router,
    location: Location) {

    const socketUrl = isDevMode() ? 'http://localhost:3000' : undefined;
    if (activatedRoute.snapshot.paramMap.get('id'))
      this.socket = io(socketUrl, { query: `room=${activatedRoute.snapshot.paramMap.get('id')}` });
    else
      this.socket = io(socketUrl);
    this.socket.on('joined room', (event: string) => {
      location.go(router.createUrlTree([event]).toString());
    });
    this.socket.on('playlist data', (event: PlaylistData) => {
      this.playlist = event.playlist;
      this.selected = event.selected;
      this.connected = event.connected;
    });
    this.socket.on('join', () => {
      this.connected++;
      cd.detectChanges();
    });
    this.socket.on('leave', () => {
      this.connected--;
      cd.detectChanges();
    });
    this.socket.on('play video', (event: number) => {
      this.selected = event;
    });
    this.socket.on('video added', (event: Video) => {
      console.log(event);
      this.playlist.push(event);
      cd.detectChanges();
    });
    this.socket.on('remove video', (event: number) => {
      if (event < this.selected)
        this.selected--;
      else if (event === this.selected) {
        console.log(this.playlist.length);
        console.log(this.selected);
        if (this.selected === this.playlist.length - 1)
          this.selected--;
        else
          this.selected++;
      }
      this.playlist.splice(event, 1);
      cd.detectChanges();
    });
    this.socket.on('pause', (event: number) => {
      this.player.pause();
      this.player.seekTo(event);
    });
    this.socket.on('play', (event: number) => {
      this.player.seekTo(event);
      this.player.play();
    });
  }

  handlePlayerEvent(event: any) {
    switch (event.data) {
      case 1:
        this.socket.emit('play', event.target.getCurrentTime());
        break;
      case 2:
        this.socket.emit('pause', event.target.getCurrentTime());
        break;
    }
  }
  handleVideoRemove(id: number) {
    this.socket.emit('remove video', id);
  }

  handleSelectedChange(newSelected: number) {
    this.socket.emit('play video', newSelected);
  }

  handleVideoAdd(video: string) {
    this.socket.emit('add video', video);
  }

}
