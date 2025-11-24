import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'genomica',
    loadChildren: () => import('./modules/genomica.module').then(m => m.GenomicaModule)
  },
  {
    path: 'clinica',
    loadChildren: () => import('./modules/clinica/clinica.module').then(m => m.ClinicaModule)
  },
  // TODO: Implementar componente Home
  { path: 'home', component: AppComponent }, 
  // TODO: Implementar componente NotFound
  { path: '**', redirectTo: 'home' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }