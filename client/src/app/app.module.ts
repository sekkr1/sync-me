import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MatModule} from './mat.module';
import {PlayerComponent} from './syncer/player/player.component';
import {PlaylistComponent} from './syncer/playlist/playlist.component';
import {SyncerComponent} from './syncer/syncer.component';

@NgModule({
  declarations: [
    AppComponent,
    SyncerComponent,
    PlayerComponent,
    PlaylistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatModule,
    FormsModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
