import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import {ModalModule, PaginationModule} from 'ngx-bootstrap';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {APIComponent} from './api/api.component';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {FAQComponent} from './faq/faq.component';
import {NewRoomComponent} from './modals/new-room/new-room.component';
import {SafePipe} from './pipes/safe.pipe';
import {ThemeService} from './services/theme.service';
import {YoutubeService} from './services/youtube.service';
import {PlayerComponent} from './syncer/player/player.component';
import {PlaylistComponent} from './syncer/playlist/playlist.component';
import {SyncerComponent} from './syncer/syncer.component';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    pan: {direction: Hammer.DIRECTION_HORIZONTAL} // override default settings
  };
}

@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    SyncerComponent,
    PlayerComponent,
    PlaylistComponent,
    NewRoomComponent,
    FAQComponent,
    APIComponent
  ],
  imports: [
    BrowserModule,
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    YoutubeService,
    ThemeService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ],
  entryComponents: [
    NewRoomComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
