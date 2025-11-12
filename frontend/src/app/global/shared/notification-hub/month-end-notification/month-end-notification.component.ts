import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-month-end-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './month-end-notification.component.html',
  styleUrls: ['./month-end-notification.component.scss']
})
export class MonthEndNotificationComponent {
  @Input() data!: { percentage: number; change: number };
}