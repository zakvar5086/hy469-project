import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { calendar_providers } from 'src/app/global/shared/calendar/calendar.providers';
import { DataService, Pill } from 'src/app/global/services/data.services';
import { ProfileStateService } from 'src/app/global/services/profile-state.service';
import { Subject, takeUntil } from 'rxjs';

interface PillWithDate extends Pill {
  date: Date;
}

@Component({
  selector: 'app-tablet-calendar',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
  ],
  providers: [calendar_providers],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class TabletCalendarComponent implements OnInit, OnDestroy {
  viewDate = new Date();
  view: 'month' | 'week' | 'day' = 'month';

  isKid = false;

  allPills: PillWithDate[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private profileState: ProfileStateService
  ) {}

  ngOnInit() {
    const personaId = this.profileState.getPersona();

    this.isKid = personaId === 'persona3';
    
    if (personaId) {
      this.dataService.getPillsForUser(personaId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(pills => {
          this.allPills = this.generatePillSchedule(pills);
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Generate a schedule for the current month
  private generatePillSchedule(pills: Pill[]): PillWithDate[] {
    const schedule: PillWithDate[] = [];
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    // Assign pills to each day of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      
      pills.forEach(pill => {
        schedule.push({
          ...pill,
          date: date
        });
      });
    }

    return schedule;
  }

  // Returns pills scheduled for the given date
  getPillsForDate(date: Date): Pill[] {
    const dateKey = this.getDateKey(date);
    return this.allPills
      .filter(p => this.getDateKey(p.date) === dateKey)
      .map(({ date, ...pill }) => pill); // Remove date property
  }

  private getDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  // Group pills by exact time (hh:mm) and return as a sorted array
  get groupedPills(): { time: string; pills: Pill[] }[] {
    const pills = this.getPillsForDate(this.viewDate);
    const map = new Map<string, Pill[]>();
    
    for (const p of pills) {
      if(!map.has(p.time)) map.set(p.time, []);
      map.get(p.time)!.push(p);
    }

    const groups = Array.from(map.entries()).map(([time, pills]) => ({ time, pills }));
    groups.sort((a, b) => a.time.localeCompare(b.time));
    return groups;
  }

  // Called when a day is clicked on the calendar month view
  onDayClick(date: Date) {
    if(!date) return;
    this.viewDate = date;
  }

  previousMonth() {
    const date = new Date(this.viewDate);
    date.setMonth(date.getMonth() - 1);
    this.viewDate = date;
  }

  nextMonth() {
    const date = new Date(this.viewDate);
    date.setMonth(date.getMonth() + 1);
    this.viewDate = date;
  }
}