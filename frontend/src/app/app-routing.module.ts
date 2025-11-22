import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileGuard } from './global/services/profile.guard';

const routes: Routes = [
    { path: 'persona', loadComponent: () => import('./pages/persona/persona.component').then(m => m.PersonaComponent) },
    { path: 'tablet', canActivate: [ProfileGuard], loadChildren: () => import('./pages/tablet/tablet.module').then(m => m.TabletModule) },
    { path: 'phone', canActivate: [ProfileGuard], loadChildren: () => import('./pages/phone/phone.module').then(m => m.PhoneModule) },
    { path: 'watch', canActivate: [ProfileGuard], loadChildren: () => import('./pages/watch/watch.module').then(m => m.WatchModule) },
    /* { path: 'speaker', loadChildren: () => import('./pages/speaker/speaker.module').then(m => m.SpeakerModule) }, */
    
    { path: '', redirectTo: 'persona', pathMatch: 'full' },
    { path: '**', redirectTo: 'persona' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
