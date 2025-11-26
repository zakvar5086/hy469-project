import { Component, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements AfterViewInit {

  activeTab: 'overview' | 'missed' | 'postponed' = 'overview';

  intakePercentage = 92;
  missedPills = 3;
  postponedTimes = 5;

  totalPillsThisMonth = 0;
  private pieChart: Chart | null = null;

  // Swipe Variables
  private touchStartX = 0;
  private touchEndX = 0;
  private swipeThreshold = 40; // px

  constructor() {
    this.totalPillsThisMonth =
      this.missedPills + this.postponedTimes + Math.round((this.intakePercentage / 100) *
      (this.missedPills + this.postponedTimes + 30));
  }

  ngAfterViewInit() {
    this.createPieChart();
  }

  // Swipe

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipeGesture();
  }

  private handleSwipeGesture() {
    const deltaX = this.touchEndX - this.touchStartX;

    // Ignore tiny movements
    if (Math.abs(deltaX) < this.swipeThreshold) return;

    if (deltaX < 0) {
      // Swipe left → next tab
      this.goToNextTab();
    } else {
      // Swipe right → previous tab
      this.goToPrevTab();
    }
  }

  private goToNextTab() {
    if (this.activeTab === 'overview') this.switchTab('missed');
    else if (this.activeTab === 'missed') this.switchTab('postponed');
  }

  private goToPrevTab() {
    if (this.activeTab === 'postponed') this.switchTab('missed');
    else if (this.activeTab === 'missed') this.switchTab('overview');
  }

  switchTab(tab: 'overview' | 'missed' | 'postponed') {
    this.activeTab = tab;

    if (tab === 'overview') {
      setTimeout(() => this.createPieChart(), 50);
    }
  }

  sendToDoctor() {
    alert('Report sent to doctor!');
  }

  private createPieChart() {
    const canvas: any = document.getElementById('reportPieChart');

    if (!canvas) return;

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const taken = Math.round(this.intakePercentage);
    const missed = this.missedPills;
    const postponed = this.postponedTimes;

    this.pieChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Taken', 'Missed', 'Postponed'],
        datasets: [{
          data: [taken, missed, postponed],
          backgroundColor: ['#4a90e2', '#e57373', '#f2c94c'],
          hoverBackgroundColor: ['#6aa5f3', '#ef8a8a', '#f4d87c'],
          borderWidth: 0
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 16
              }
            }
          }
        }
      }
    });
  }
}