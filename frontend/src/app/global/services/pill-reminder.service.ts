import { Injectable, OnDestroy } from '@angular/core';
import { DataService, Pill } from './data.services';
import { PillPopupService } from './pill-popup.service';
import { ProfileStateService } from './profile-state.service';
import { Subject, interval, takeUntil } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PillReminderService implements OnDestroy {
  
  private destroy$ = new Subject<void>();
  private checkedPills = new Set<string>();

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

        // Get the pill's current status
        this.dataService.getPillStatus(userId, pill.id, today).subscribe(status => {
          
          // If pill has a key and isn't postponed, return
          if (this.checkedPills.has(pillKey) && status !== 'postponed') return;

          // Case 1: Regular scheduled upcoming pills
          if (status === 'upcoming' && pill.time === currentTime) {
            this.pillPopupService.open(pill);
            this.checkedPills.add(pillKey);
          }
          
          // Case 2: Postponed pill
          if (status === 'postponed') {
            this.dataService.getUserIntakeRecords(userId).subscribe(records => {
              const record = records.find(r => r.pillId === pill.id && r.date === today);
              
              if (record && record.postponedTo) {
                const postponedDate = new Date(record.postponedTo);
                const postponedTime = `${String(postponedDate.getHours()).padStart(2, '0')}:${String(postponedDate.getMinutes()).padStart(2, '0')}`;
                
                if (postponedTime === currentTime) {
                  this.pillPopupService.open(pill);
                  this.checkedPills.add(pillKey);                  
                  this.dataService.recordPillAction(userId, pill.id, today, 'upcoming');
                }
              }
            });
          }
        });
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
