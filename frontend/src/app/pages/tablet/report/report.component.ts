import { Component, AfterViewInit, OnInit } from '@angular/core';
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
export class ReportComponent implements AfterViewInit, OnInit {

  activeTab: 'monthly' | 'weekly' | 'daily' = 'monthly';

  private chart: Chart | null = null;
  isKid = false;

  intakePercentage = 92;
  missedPills = 3;
  postponedTimes = 5;

  constructor(private profileState: ProfileStateService) {}

  ngOnInit() {
    const persona = this.profileState.getPersona();
    this.isKid = persona === 'persona3';
  }

  ngAfterViewInit() {
    this.createMonthlyChart();
  }

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

  // DAILY BAR CHART
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

  // WEEKLY LINE CHART
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
          borderColor: '#f2c94c',
          borderWidth: 3,
          tension: 0.3,
          fill: false
        }]
      },
      options: { responsive: true }
    });
  }

  // MONTHLY PIE CHART
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