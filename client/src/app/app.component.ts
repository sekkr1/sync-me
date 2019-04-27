import {Component} from '@angular/core';
import {environment} from '../environments/environment';
import {ThemeService} from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed = true;
  enviroment = environment;

  constructor(public themeService: ThemeService) {
  }

  openDiscordDialog() {
    window.open('https://discordapp.com/oauth2/authorize?client_id=561001100916817920&scope=bot&permissions=10304',
      'newwindow',
      'width=500,height=800');
  }

  openDonate() {
    window.open('https://paypal.me/jprankbro2017',
      'newwindow',
      'width=500,height=950');
  }
}
