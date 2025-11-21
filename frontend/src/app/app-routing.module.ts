import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'persona', loadComponent: () => import('./pages/persona/persona.component').then(m => m.PersonaComponent) },
    { path: 'tablet', loadChildren: () => import('./pages/tablet/tablet.module').then(m => m.TabletModule) },
    { path: 'phone', loadChildren: () => import('./pages/phone/phone.module').then(m => m.PhoneModule) },
    { path: 'watch', loadChildren: () => import('./pages/watch/watch.module').then(m => m.WatchModule) },
    
    { path: '', redirectTo: 'persona', pathMatch: 'full' },
    { path: '**', redirectTo: 'persona' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
