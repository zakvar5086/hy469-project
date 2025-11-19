import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {

  // Default tab
  activeTab: 'overview' | 'missed' | 'postponed' = 'overview';

  intakePercentage = 92;
  missedPills = 3;
  postponedTimes = 5;

  switchTab(tab: 'overview' | 'missed' | 'postponed') {
    this.activeTab = tab;
  }

  sendToDoctor() {
    alert('Report sent to doctor!');
  }
}