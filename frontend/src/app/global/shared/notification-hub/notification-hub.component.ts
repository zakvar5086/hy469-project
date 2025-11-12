import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PillNotificationComponent } from 'src/app/global/shared/notification-hub/pill-notification/pill-notification.component';
import { MonthEndNotificationComponent } from 'src/app/global/shared/notification-hub/month-end-notification/month-end-notification.component';

@Component({
  selector: 'app-notification-hub',
  standalone: true,
  imports: [CommonModule, PillNotificationComponent, MonthEndNotificationComponent],
  templateUrl: './notification-hub.component.html',
  styleUrls: ['./notification-hub.component.scss']
})
export class NotificationHubComponent {
  @Input() type: 'pill' | 'monthEnd' | null = null;
  @Input() data: any;
}