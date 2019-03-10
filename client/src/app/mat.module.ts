import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSnackBarModule
} from '@angular/material';

const MODULES = [
  MatCardModule,
  MatListModule,
  MatButtonModule,
  MatInputModule,
  MatGridListModule,
  MatIconModule,
  MatSnackBarModule
];

@NgModule({
  imports: MODULES,
  exports: MODULES
})
export class MatModule {
}
