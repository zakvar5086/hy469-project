import { Component, AfterViewInit, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingService } from 'src/app/global/services/profile-routing.service';
import { ProfileStateService } from 'src/app/global/services/profile-state.service';
import { DataService } from 'src/app/global/services/data.services';
import { Subject, takeUntil } from 'rxjs';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements AfterViewInit, OnDestroy, OnInit {
    
  activeTab: 'Daily' | 'Weekly' | 'Monthly' = 'Daily';
  private destroy$ = new Subject<void>();

  dailyStats = { taken: 0, missed: 0, postponed: 0 };
  weeklyStats = { taken: 0, missed: 0, postponed: 0 };
  monthlyStats = { taken: 0, missed: 0, postponed: 0 };
  
  private touchStartX = 0;
  private touchEndX = 0;
  private swipeThreshold = 40;
  
  private dailyChart: Chart | null = null;
  private weeklyChart: Chart | null = null;
  private monthlyChart: Chart | null = null;

  constructor(
    private profileRouting: ProfileRoutingService,
    private profileState: ProfileStateService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    const persona = this.profileState.getPersona();
    
    console.log('📊 Watch Report component initializing...');
    
    // Load statistics
    if (persona) {
      this.loadStatistics(persona);
      
      // Subscribe to pillStats changes to update in real-time
      this.dataService.pillStats$
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadStatistics(persona);
        });
    }
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.renderChartForTab('Daily');
    }, 100);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyAllCharts();
  }

  private loadStatistics(userId: string) {
    // Load daily stats
    this.dataService.getDailyStats(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.dailyStats = stats;
        if (this.activeTab === 'Daily' && this.dailyChart) {
          this.updateChartData(this.dailyChart, stats);
        }
      });

    // Load weekly stats
    this.dataService.getWeeklyStats(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.weeklyStats = stats;
        if (this.activeTab === 'Weekly' && this.weeklyChart) {
          this.updateChartData(this.weeklyChart, stats);
        }
      });

    // Load monthly stats
    this.dataService.getMonthlyStats(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.monthlyStats = stats;
        if (this.activeTab === 'Monthly' && this.monthlyChart) {
          this.updateChartData(this.monthlyChart, stats);
        }
      });
  }

  private updateChartData(chart: Chart, stats: { taken: number; missed: number; postponed: number }) {
    if (chart && chart.data.datasets[0]) {
      chart.data.datasets[0].data = [stats.taken, stats.missed, stats.postponed];
      chart.update();
    }
  }

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

    if (Math.abs(deltaX) < this.swipeThreshold) return;

    if (deltaX < 0) {
      this.goToNextTab();
    } else {
      this.goToPrevTab();
    }
  }

  private goToNextTab() {
    if (this.activeTab === 'Daily') this.switchTab('Weekly');
    else if (this.activeTab === 'Weekly') this.switchTab('Monthly');
  }

  private goToPrevTab() {
    if (this.activeTab === 'Monthly') this.switchTab('Weekly');
    else if (this.activeTab === 'Weekly') this.switchTab('Daily');
  }

  switchTab(tab: 'Daily' | 'Weekly' | 'Monthly') {
    this.activeTab = tab;
    setTimeout(() => this.renderChartForTab(tab), 50); 
  }

  sendToDoctor() {
    alert('Report sent to doctor!');
  }

  navigateTo(route: string) {
    this.profileRouting.navigateTo(route);
  }

  private renderChartForTab(tab: string) {
    switch (tab) {
      case 'Daily':
        this.createDailyChart();
        break;
      case 'Weekly':
        this.createWeeklyChart();
        break;
      case 'Monthly':
        this.createMonthlyChart();
        break;
    }
  }

  private createDailyChart() {
    const canvas = document.getElementById('dailyPieChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.dailyChart) this.dailyChart.destroy();

    this.dailyChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Taken', 'Missed', 'Postpone'],
        datasets: [{
          data: [this.dailyStats.taken, this.dailyStats.missed, this.dailyStats.postponed],
          backgroundColor: ['#4a90e2', '#e57373', '#f2c94c'],
          hoverBackgroundColor: ['#6aa5f3', '#ef8a8a', '#f4d87c'],
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 13
              }
            }
          }
        }
      }
    });
  }

  private createWeeklyChart() {
    const canvas = document.getElementById('weeklyPieChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.weeklyChart) this.weeklyChart.destroy();

    this.weeklyChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Taken', 'Missed', 'Postpone'],
        datasets: [{
          data: [this.weeklyStats.taken, this.weeklyStats.missed, this.weeklyStats.postponed],
          backgroundColor: ['#4a90e2', '#e57373', '#f2c94c'],
          hoverBackgroundColor: ['#6aa5f3', '#ef8a8a', '#f4d87c'],
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 13
              }
            }
          }
        }
      }
    });
  }
  
  private createMonthlyChart() {
    const canvas = document.getElementById('monthlyPieChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.monthlyChart) this.monthlyChart.destroy();

    this.monthlyChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Taken', 'Missed', 'Postpone'],
        datasets: [{
          data: [this.monthlyStats.taken, this.monthlyStats.missed, this.monthlyStats.postponed],
          backgroundColor: ['#4a90e2', '#e57373', '#f2c94c'],
          hoverBackgroundColor: ['#6aa5f3', '#ef8a8a', '#f4d87c'],
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 13
              }
            }
          }
        }
      }
    });
  }

  private destroyAllCharts() {
    if (this.dailyChart) {
      this.dailyChart.destroy();
      this.dailyChart = null;
    }
    if (this.weeklyChart) {
      this.weeklyChart.destroy();
      this.weeklyChart = null;
    }
    if (this.monthlyChart) {
      this.monthlyChart.destroy();
      this.monthlyChart = null;
    }
  }
}
