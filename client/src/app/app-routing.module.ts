import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {APIComponent} from './api/api.component';
import {FAQComponent} from './faq/faq.component';
import {SyncerComponent} from './syncer/syncer.component';

const routes: Routes = [
  {path: 'faq', component: FAQComponent},
  {path: 'api', component: APIComponent},
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
