import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NotificationHubComponent } from 'src/app/global/shared/notification-hub/notification-hub.component';


@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    HomeComponent,
    NotificationHubComponent
  ]
})
export class HomeModule { }
