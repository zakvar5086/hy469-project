import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { ItemShopComponent } from './pages/item-shop/item-shop.component';

const routes: Routes = [
  //{ path: 'socket-events', loadChildren: () => import('./pages/socket-events/socket-events.module').then(m => m.SocketEventsModule) },
  //{ path: 'tasks', loadChildren: () => import('./pages/tasks/tasks.module').then(m => m.TasksModule) },
  { path: 'home', loadChildren: () => import('./pages/tablet/home/home.module').then(m => m.HomeModule) },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
