import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationHubComponent } from 'src/app/global/shared/notification-hub/notification-hub.component';
import { PillContainerComponent } from 'src/app/global/shared/pill-container/pill-container.component';
import { PillCardComponent } from 'src/app/global/shared/pill-card/pill-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NotificationHubComponent, PillContainerComponent, PillCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    today = new Date();
}