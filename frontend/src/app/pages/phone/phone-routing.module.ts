import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
            { path: 'calendar', loadComponent: () => import('./calendar/calendar.component').then(m => m.CalendarComponent) },
            { path: 'notifications', loadComponent: () => import('./notifications/notifications.component').then(m => m.NotificationsComponent) },
            { path: 'report', loadComponent: () => import('./report/report.component').then(m => m.ReportComponent) },
            { path: 'settings', loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent) },
            { path: 'pill-details/:pillId', loadComponent: () => import('./pill-details/pill-details.component').then(m => m.PillDetailsComponent) },

            { path: '', redirectTo: 'home', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PhoneRoutingModule { }
