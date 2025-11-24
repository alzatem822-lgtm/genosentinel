import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GeneListComponent } from '../gene-list/gene-list.component';
import { VariantListComponent } from './variant-list/variant-list.component';
import { ReportListComponent } from './report-list/report-list.component';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';
import { GeneDialogComponent } from './gene-dialog/gene-dialog.component';

const routes: Routes = [
  { path: 'genes', component: GeneListComponent },
  { path: 'variants', component: VariantListComponent },
  { path: 'reports', component: ReportListComponent },
  { path: '', redirectTo: 'genes', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    GeneListComponent,
    VariantListComponent,
    ReportListComponent,
    ReportDialogComponent,
    GeneDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,

    // Material
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSelectModule
  ]
})
export class GenomicaModule { }


