import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SyncerComponent} from './containers/syncer';

const routes: Routes = [
  {path: ':id', component: SyncerComponent},
  {path: '', component: SyncerComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
