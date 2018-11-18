import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { PlayerComponent } from './containers/syncer/player/player.component';
import { PlaylistComponent } from './containers/syncer/playlist/playlist.component';
import * as io from 'socket.io-client';
import { SOCKET } from './app.config';
import { RouterModule, Routes } from '@angular/router';
import { SyncerComponent } from './containers/syncer/syncer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatModule } from './mat.modules';

const appRoutes: Routes = [
  { path: ':id', component: SyncerComponent },
  { path: '', component: SyncerComponent },
  { path: '**', redirectTo: '' }
];


@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    PlaylistComponent,
    SyncerComponent,
    SyncerComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserModule,
    BrowserAnimationsModule,
    MatModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
