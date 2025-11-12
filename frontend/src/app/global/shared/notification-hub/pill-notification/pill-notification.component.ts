import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pill-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pill-notification.component.html',
  styleUrls: ['./pill-notification.component.scss']
})
export class PillNotificationComponent {
  @Input() data!: { time: string; note: string; taken: boolean };
}