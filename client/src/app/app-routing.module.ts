import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SyncerComponent } from './containers/syncer/syncer.component';

const routes: Routes = [
  { path: ':id', component: SyncerComponent },
  { path: '', component: SyncerComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
