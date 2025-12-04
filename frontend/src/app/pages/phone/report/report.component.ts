import { Component, AfterViewInit, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { ProfileStateService } from 'src/app/global/services/profile-state.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements AfterViewInit, OnInit  {

  activeTab: 'daily' | 'weekly' | 'monthly' = 'monthly';

  isKid=false;
  private chart: Chart | null = null;


  constructor(private profileState: ProfileStateService) {}

  ngOnInit() {
    const persona = this.profileState.getPersona();
    this.isKid = persona === 'persona3';
  }

  // Example data
  intakePercentage = 92;
  missedPills = 3;
  postponedTimes = 5;

  // Swipe variables
  private touchStartX = 0;
  private touchEndX = 0;
  private swipeThreshold = 40;

  ngAfterViewInit() {
    this.createMonthlyChart();
  }

  // ----------------- SWIPE HANDLING -----------------
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe() {
    const delta = this.touchEndX - this.touchStartX;
    if (Math.abs(delta) < this.swipeThreshold) return;

    if (delta < 0) this.goNext();
    else this.goPrev();
  }

  private goNext() {
    if (this.activeTab === 'monthly') this.switchTab('weekly');
    else if (this.activeTab === 'weekly') this.switchTab('daily');
  }

  private goPrev() {
    if (this.activeTab === 'daily') this.switchTab('weekly');
    else if (this.activeTab === 'weekly') this.switchTab('monthly');
  }

  // ----------------- TAB SWITCHING -----------------
  switchTab(tab: 'daily' | 'weekly' | 'monthly') {
    this.activeTab = tab;

    setTimeout(() => {
      this.destroyChart();

      if (tab === 'daily') this.createDailyChart();
      if (tab === 'weekly') this.createWeeklyChart();
      if (tab === 'monthly') this.createMonthlyChart();

    }, 50);
  }

  private destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  // ----------------- CHARTS -----------------
  private createDailyChart() {
    const canvas = document.getElementById('dailyChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Morning', 'Afternoon', 'Evening'],
        datasets: [{
          label: 'Pills Taken',
          data: [1, 0, 1],
          backgroundColor: '#4a90e2'
        }]
      },
      options: { responsive: true }
    });
  }

  private createWeeklyChart() {
    const canvas = document.getElementById('weeklyChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Daily Intake',
          data: [1, 1, 0, 1, 1, 0, 1],
          borderWidth: 3,
          borderColor: '#f2c94c',
          fill: false,
          tension: 0.3
        }]
      },
      options: { responsive: true }
    });
  }

  private createMonthlyChart() {
    const canvas = document.getElementById('monthlyChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.chart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Taken', 'Missed', 'Postponed'],
        datasets: [{
          data: [
            Math.round(this.intakePercentage),
            this.missedPills,
            this.postponedTimes
          ],
          backgroundColor: ['#4a90e2', '#e57373', '#f2c94c']
        }]
      },
      options: { responsive: true }
    });
  }

  sendToDoctor() {
    alert('Report sent to doctor!');
  }
}