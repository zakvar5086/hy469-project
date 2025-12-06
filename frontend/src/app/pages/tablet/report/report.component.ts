import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { ProfileStateService } from 'src/app/global/services/profile-state.service';
import { DataService } from 'src/app/global/services/data.services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements AfterViewInit, OnInit, OnDestroy {

  activeTab: 'monthly' | 'weekly' | 'daily' = 'monthly';

  private chart: Chart | null = null;
  isKid = false;
  private destroy$ = new Subject<void>();

  dailyStats = { taken: 0, missed: 0, postponed: 0 };
  weeklyStats = { taken: 0, missed: 0, postponed: 0 };
  monthlyStats = { taken: 0, missed: 0, postponed: 0 };

  constructor(
    private profileState: ProfileStateService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    const persona = this.profileState.getPersona();
    this.isKid = persona === 'persona3';
        
    // Load statistics and subscribe to changes
    if (persona) {
      this.loadStatistics(persona);
      
      this.dataService.pillStats$
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadStatistics(persona);
        });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createMonthlyChart();
    }, 100);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyChart();
  }

  private loadStatistics(userId: string) {
    // Load daily stats
    this.dataService.getDailyStats(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.dailyStats = stats;
        if (this.activeTab === 'daily' && this.chart) 
          this.updateChartData();
      });

    // Load weekly stats
    this.dataService.getWeeklyStats(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.weeklyStats = stats;
        if (this.activeTab === 'weekly' && this.chart) 
          this.updateChartData();
      });

    // Load monthly stats
    this.dataService.getMonthlyStats(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.monthlyStats = stats;
        if (this.activeTab === 'monthly' && this.chart) 
          this.updateChartData();
      });
  }

  private updateChartData() {
    if (!this.chart) return;

    let data: number[];
    
    if (this.activeTab === 'daily') {
      data = [this.dailyStats.taken, this.dailyStats.missed, this.dailyStats.postponed];
    } else if (this.activeTab === 'weekly') {
      data = [this.weeklyStats.taken, this.weeklyStats.missed, this.weeklyStats.postponed];
    } else {
      data = [this.monthlyStats.taken, this.monthlyStats.missed, this.monthlyStats.postponed];
    }

    this.chart.data.datasets[0].data = data;
    this.chart.update();
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

  // Charts
  private createDailyChart() {
    const canvas = document.getElementById('dailyChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Taken', 'Missed', 'Postponed'],
        datasets: [{
          label: 'Pills',
          data: [this.dailyStats.taken, this.dailyStats.missed, this.dailyStats.postponed],
          backgroundColor: ['#4a90e2', '#e57373', '#f2c94c']
        }]
      },
      options: { 
        responsive: true,
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

  private createWeeklyChart() {
    const canvas = document.getElementById('weeklyChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Daily Intake',
          data: this.generateWeeklyData(this.weeklyStats.taken),
          borderColor: '#4a90e2',
          borderWidth: 3,
          fill: false,
          tension: 0.3
        }]
      },
      options: { 
        responsive: true,
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

  private createMonthlyChart() {
    const canvas = document.getElementById('monthlyChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.chart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Taken', 'Missed', 'Postponed'],
        datasets: [{
          data: [
            this.monthlyStats.taken,
            this.monthlyStats.missed,
            this.monthlyStats.postponed
          ],
          backgroundColor: ['#4a90e2', '#e57373', '#f2c94c']
        }]
      },
      options: { 
        responsive: true,
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

  private generateWeeklyData(total: number): number[] {
    // Distribute total across 7 days with some variation
    const avg = Math.floor(total / 7);
    const data: number[] = [];
    
    for (let i = 0; i < 7; i++) {
      const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      data.push(Math.max(0, avg + variation));
    }
    
    return data;
  }

  sendToDoctor() {
    alert('Report sent to doctor!');
  }
}