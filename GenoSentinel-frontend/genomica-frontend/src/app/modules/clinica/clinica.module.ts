import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PatientListComponent } from './patient-list/patient-list.component';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Routes = [
  { path: 'patients', component: PatientListComponent },
  { path: '', redirectTo: 'patients', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    PatientListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    // Material
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule
  ]
})
export class ClinicaModule { }