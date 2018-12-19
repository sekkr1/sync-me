import { NgModule } from "@angular/core";
import { MatCardModule, MatListModule, MatButtonModule, MatInputModule, MatGridListModule, MatIconModule } from '@angular/material';

const MODULES = [
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
    MatIconModule
]

@NgModule({
    imports: MODULES,
    exports: MODULES
})
export class MatModule { }
