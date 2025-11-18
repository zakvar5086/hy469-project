import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'home', loadChildren: () => import('./pages/tablet/home/home.module').then(m => m.HomeModule) },
    { path: 'calendar', loadComponent: () => import('./pages/tablet/calendar/calendar.component').then(m => m.TabletCalendarComponent) },
    { path: 'notifications', loadComponent: () => import('./pages/tablet/notifications/notifications.component').then(m => m.TabletNotificationsComponent) },
    { path: 'pills', loadComponent: () => import('./pages/tablet/pill-details/pill-details.component').then(m => m.PillDetailesComponent) },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
