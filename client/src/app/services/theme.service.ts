import {Injectable} from '@angular/core';
import {LocalStorage} from 'ngx-store';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  @LocalStorage()
  isDarkMode = false;
}
