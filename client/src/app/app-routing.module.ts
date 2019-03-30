import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SyncerComponent} from './syncer/syncer.component';

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
