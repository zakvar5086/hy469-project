import { Injectable, OnDestroy } from '@angular/core';
import { DataService, Pill } from './data.services';
import { PillPopupService } from './pill-popup.service';
import { ProfileStateService } from './profile-state.service';
import { Subject, interval, takeUntil } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PillReminderService implements OnDestroy {
  
  private destroy$ = new Subject<void>();
  private checkedPills = new Set<string>(); // Track pills shown today

  constructor(
    private dataService: DataService,
    private pillPopupService: PillPopupService,
    private profileState: ProfileStateService
  ) {}

  // Start checking for pill reminders
  startReminderChecks() {    
    this.checkForDuePills();
    
    // Then check every 20secs
    interval(20000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkForDuePills();
      });
  }

  // Stop checking for reminders
  stopReminderChecks() {
    this.destroy$.next();
  }

  // Check if any pills are due now
  private checkForDuePills() {
    const userId = this.profileState.getPersona();
    if (!userId) return;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const today = now.toISOString().split('T')[0];


    this.dataService.getPillsForUser(userId).subscribe(pills => {
      pills.forEach(pill => {
        const pillKey = `${pill.id}-${today}`;
        
        // Check if this pill is due now and hasn't been shown today
        if (pill.time === currentTime && !this.checkedPills.has(pillKey)) {
          // Check if it's still upcoming
          this.dataService.getPillStatus(userId, pill.id, today).subscribe(status => {
            if (status === 'upcoming') {
              this.pillPopupService.open(pill);
              this.checkedPills.add(pillKey);
            }
          });
        }
      });
    });

    // Clear checked pills at midnight
    if (currentTime === '00:00') {
      this.checkedPills.clear();
    }
  }

  ngOnDestroy() {
    this.stopReminderChecks();
  }
}
