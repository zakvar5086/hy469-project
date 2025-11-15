import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationHubComponent } from 'src/app/global/shared/notification-hub/notification-hub.component';
import { PillContainerComponent } from 'src/app/global/shared/pill-container/pill-container.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NotificationHubComponent, PillContainerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}