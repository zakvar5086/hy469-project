import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular-calendar';
import { calendar_providers } from 'src/app/global/shared/calendar/calendar.providers';

interface Pill {
  id: number;
  name: string;
  date: string;
  time: string;
  dosage?: string;
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
export class TabletCalendarComponent {
  viewDate = new Date();
  view: 'month' | 'week' | 'day' = 'month';

  // sample data — later this can come from the backend
  samplePills: Pill[] = [];

  constructor() {
    // populate sample pills for today and tomorrow
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    this.samplePills = [
      { id: 1, name: 'Aspirin', date: today.toISOString().split('T')[0], time: '08:00', dosage: '1 tablet' },
      { id: 2, name: 'Vitamin D', date: today.toISOString().split('T')[0], time: '08:00', dosage: '1 capsule' },
      { id: 3, name: 'Metformin', date: today.toISOString().split('T')[0], time: '20:00', dosage: '500 mg' },
      { id: 4, name: 'Metformin', date: today.toISOString().split('T')[0], time: '20:00', dosage: '500 mg' },
      { id: 5, name: 'Metformin', date: today.toISOString().split('T')[0], time: '20:00', dosage: '500 mg' },
      { id: 6, name: 'Metformin', date: today.toISOString().split('T')[0], time: '20:00', dosage: '500 mg' },
      { id: 7, name: 'Calcium', date: tomorrow.toISOString().split('T')[0], time: '09:00', dosage: '1 tablet' },
      { id: 8, name: 'Metformin', date: today.toISOString().split('T')[0], time: '20:00', dosage: '500 mg' },
      { id: 9, name: 'Metformin', date: today.toISOString().split('T')[0], time: '20:00', dosage: '500 mg' },
    ];
  }

  // Returns pills scheduled for the given date
  getPillsForDate(date: Date): Pill[] {
    const key = date.toISOString().split('T')[0];
    return this.samplePills.filter(p => p.date === key);
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
