import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PillCardComponent } from 'src/app/global/shared/pill-card/pill-card.component';


@Component({
  selector: 'app-pill-container',
  standalone: true,
  imports: [CommonModule, PillCardComponent],
  templateUrl: './pill-container.component.html',
  styleUrls: ['./pill-container.component.scss']
})
export class PillContainerComponent {

    pills = [
  {
    time: "10:00",
    pillName: "Aspirin",
    dosage: "1 tablet after meal",
    pillIcon: "assets/icons/pill.svg",
    status: "Upcoming",
    daysLeft: 7,
    lowPillWarning: "5 pills remaining for 7 days"
  },
  {
    time: "10:00",
    pillName: "Vitamin D",
    dosage: "1 every morning",
    pillIcon: "assets/icons/pill.svg",
    status: "Upcoming",
    daysLeft: 30,
    lowPillWarning: null
  },
  {
    time: "18:00",
    pillName: "Magnesium",
    dosage: "1 tablet",
    pillIcon: "assets/icons/pill.svg",
    status: "Upcoming",
    daysLeft: 14,
    lowPillWarning: null
  }
];

get pillsByTime() {
  const groups: Record<string, any[]> = {};

  this.pills.forEach(pill => {
    if (!groups[pill.time]) {
      groups[pill.time] = [];
    }
    groups[pill.time].push(pill);
  });

  return groups;
}

}
