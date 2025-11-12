import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationHubComponent } from 'src/app/global/shared/notification-hub/notification-hub.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NotificationHubComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}