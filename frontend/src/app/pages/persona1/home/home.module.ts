import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NotificationHubComponent } from 'src/app/global/shared/notification-hub/notification-hub.component';
import { PillContainerComponent } from 'src/app/global/shared/pill-container/pill-container.component';
import { PillCardComponent } from 'src/app/global/shared/pill-card/pill-card.component';


@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    HomeComponent,
    NotificationHubComponent,
    PillContainerComponent,
    PillCardComponent
  ]
})
export class HomeModule { }
