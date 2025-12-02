import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, AfterViewInit {

    private readonly ITEM_HEIGHT = 40; 

    @ViewChild('dayRef') daySpinner!: ElementRef<HTMLDivElement>;
    @ViewChild('monthRef') monthSpinner!: ElementRef<HTMLDivElement>;
    @ViewChild('yearRef') yearSpinner!: ElementRef<HTMLDivElement>;

 
    daysStatic: string[] = []; 
    month: string[] = []; 
    years: string[] = [];


    selectedDay: string = '';
    selectedMonth: string = '';
    selectedYear: string = '';

    constructor(private router: Router) {
        const today = new Date();
        this.selectedDay = today.getDate().toString().padStart(2, '0');
        this.selectedMonth = (today.getMonth() + 1).toString().padStart(2, '0'); 
        this.selectedYear = today.getFullYear().toString();
    }


    ngOnInit() {
        this.generateDateValues();
    }
    
    ngAfterViewInit() {
        setTimeout(() => {
            this.setInitialScroll('day', this.selectedDay);
            this.setInitialScroll('month', this.selectedMonth);
            this.setInitialScroll('year', this.selectedYear);
        }, 0);
    }


    generateDateValues(){
        for(let i=1; i<=12; i++){
            this.month.push(i.toString().padStart(2, '0'));
        }

        for(let i=2000; i<=2025; i++){
            this.years.push(i.toString());
        }
        
    }
    

    getDaysList(): string[] {
        const year = parseInt(this.selectedYear);
        const monthIndex = parseInt(this.selectedMonth) - 1; 
        
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const days: string[] = [];
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i.toString().padStart(2, '0'));
        }
        return days;
    }
    


    setInitialScroll(type: 'day' | 'month' | 'year', value: string): void {
        let spinnerEl: ElementRef<HTMLDivElement>;
        let list: string[];

    
        if (type === 'day') { spinnerEl = this.daySpinner; list = this.getDaysList(); }
        else if (type === 'month') { spinnerEl = this.monthSpinner; list = this.month; }
        else if (type === 'year') { spinnerEl = this.yearSpinner; list = this.years; }
        else return;

        const initialIndex = list.indexOf(value);
        if (initialIndex !== -1) {
            const targetScrollTop = initialIndex * this.ITEM_HEIGHT;
            spinnerEl.nativeElement.scrollTop = targetScrollTop; 
        }
    }
    
    

    private snapTimeout: any;

    onScroll(type: 'day' | 'month' | 'year'): void {
        let spinnerEl: ElementRef<HTMLDivElement>;
        let list: string[];
        let setter: (value: string) => void;

        if (type === 'day') { 
            spinnerEl = this.daySpinner; 
            list = this.getDaysList(); 
            setter = (val) => this.selectedDay = val;
        } else if (type === 'month') { 
            spinnerEl = this.monthSpinner; 
            list = this.month; 
            setter = (val) => {
                this.selectedMonth = val;
                this.adjustDayForNewMonth();
            };
        } else if (type === 'year') { 
            spinnerEl = this.yearSpinner; 
            list = this.years; 
            setter = (val) => {
                this.selectedYear = val;
                this.adjustDayForNewMonth();
            };
        } else {
            return;
        }

        const scrollTop = spinnerEl.nativeElement.scrollTop;
        let targetIndex = Math.round(scrollTop / this.ITEM_HEIGHT);

        targetIndex = Math.max(0, Math.min(list.length - 1, targetIndex));
        setter(list[targetIndex]);

        clearTimeout(this.snapTimeout);
        this.snapTimeout = setTimeout(() => {
            spinnerEl.nativeElement.scrollTo({
                top: targetIndex * this.ITEM_HEIGHT,
                behavior: 'smooth'
            });
        }, 80); 
    }

   
    adjustDayForNewMonth() {
        const currentDay = parseInt(this.selectedDay);
        const maxDaysList = this.getDaysList(); 
        const maxDays = maxDaysList.length;

        if (currentDay > maxDays) {
            this.selectedDay = maxDays.toString().padStart(2, '0');
            this.setInitialScroll('day', this.selectedDay);
        }
    }


    private getDevicePrefix(): string {
        return '/watch/';
    }
  
    navigateTo(route: string, state?: any) {
        const device = this.getDevicePrefix();
        this.router.navigate([device + route], {
            state,                      
            queryParamsHandling: 'merge'
        });
    }

    onOk() {
        const date = `${this.selectedYear}-${this.selectedMonth}-${this.selectedDay}`; 
        this.navigateTo('schedule', {
            selectedDate: date
        });
        //console.log('Selected Date:', date);
    }

}