import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pill-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pill-card.component.html',
  styleUrls: ['./pill-card.component.scss']
})
export class PillCardComponent {

  @Input() pillName: string = 'Aspirin';
  @Input() dosage: string = 'Take 1 after meal';
  @Input() pillIcon: string = 'assets/icons/pill.svg';

  @Input() status: string = 'Upcoming';
  @Input() daysLeft: number = 7;

  @Input() lowPillWarning: string | null = null;
}