import { NgModule } from "@angular/core";
import { MatCardModule, MatListModule, MatButtonModule, MatInputModule, MatGridListModule } from '@angular/material';

const MODULES = [
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule
]

@NgModule({
    imports: MODULES,
    exports: MODULES
})
export class MatModule { }
