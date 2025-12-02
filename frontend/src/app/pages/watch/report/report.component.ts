import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { AfterViewInit, HostListener, ChangeDetectionStrategy, signal } from '@angular/core';



@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements AfterViewInit {

    intakePercentage = 92;

    dailyTaken = 2;
    dailyMissed = 0;
    dailyPostponed = 1;

    weeklyTaken = 10;
    weeklyMissed = 4;
    weeklyPostponed = 1;

    monthlyTaken = 56;
    monthlyMissed = 4;
    monthlyPostponed = 4;

    totalPillsThisMonth = 60;

    private touchStartX = 0;
    private touchEndX = 0;
    private swipeThreshold = 40;

    constructor(private router: Router) {
        // this.totalPillsThisMonth =
        //     this.missedPills + this.postponeTimes + Math.round((this.intakePercentage / 100) *
        //     (this.missedPills + this.postponeTimes + 30));
    }
    private getDevicePrefix(): string {
        return '/watch/';
    }

     navigateTo(route: string) {
        console.log("Navigating to", route);  
        const device = this.getDevicePrefix();
        this.router.navigate([device + route], {
          queryParamsHandling: 'merge'
        });
      }


      activeTab: 'Daily' | 'Weekly' | 'Monthly' = 'Daily';
      
       
    
      
        private dailyChart: Chart | null = null;
        private weeklyChart: Chart | null = null;
        private monthlyChart: Chart | null = null;
      
        ngAfterViewInit() {
            window.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
            window.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: true });

            this.renderChartForTab('Daily');
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


        private handleSwipeGesture(){
            const deltaX = this.touchEndX - this.touchStartX;

            if(Math.abs(deltaX) < this.swipeThreshold) return;

            if(deltaX < 0){
                this.goToNextTab();
            }else{
                this.goToPrevTab();
            }
        }

        private goToNextTab(){
            if(this.activeTab === 'Daily') this.switchTab('Weekly');
            else if(this.activeTab === 'Weekly') this.switchTab('Monthly');
        }

        private goToPrevTab(){
            if(this.activeTab === 'Monthly') this.switchTab('Weekly');
            else if(this.activeTab === 'Weekly') this.switchTab('Daily');
        }


        switchTab(tab: 'Daily' | 'Weekly' | 'Monthly') {
          this.activeTab = tab;
          setTimeout(() => this.renderChartForTab(tab), 50); 
        }
      
        sendToDoctor() {
          alert('Report sent to doctor!');
        }

        private renderChartForTab(tab: string) {
            switch(tab) {
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
                data: [this.dailyTaken, this.dailyMissed, this.dailyPostponed],
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
                data: [this.weeklyTaken, this.weeklyMissed, this.weeklyPostponed],
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
                data: [this.monthlyTaken, this.monthlyMissed, this.monthlyPostponed],
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
}
