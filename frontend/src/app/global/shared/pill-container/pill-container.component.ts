import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PillCardComponent } from 'src/app/global/shared/pill-card/pill-card.component';
import { DataService, Pill } from 'src/app/global/services/data.services';
import { ProfileStateService } from 'src/app/global/services/profile-state.service';
import { Subject, takeUntil, combineLatest } from 'rxjs';

interface PillWithStatus extends Pill {
  currentStatus: 'taken' | 'skipped' | 'postponed' | 'upcoming';
}

@Component({
  selector: 'app-pill-container',
  standalone: true,
  imports: [CommonModule, PillCardComponent],
  templateUrl: './pill-container.component.html',
  styleUrls: ['./pill-container.component.scss']
})
export class PillContainerComponent implements OnInit, OnDestroy {

  pillGroups: { time: string; pills: PillWithStatus[] }[] = [];
  private destroy$ = new Subject<void>();
  
  private daysLeftCache = new Map<string, number>();

  constructor(
    private dataService: DataService,
    private profileState: ProfileStateService
  ) {}

  ngOnInit() {
    const personaId = this.profileState.getPersona();
    
    if (personaId) {
      this.loadPillsWithStatus(personaId);
      
      // Re-subscribe to pillStats to get updates when pills are taken/skipped/postponed
      this.dataService.pillStats$
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadPillsWithStatus(personaId);
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPillsWithStatus(userId: string) {
    const today = new Date().toISOString().split('T')[0];

    combineLatest([
      this.dataService.getPillsGroupedByTime(userId),
      this.dataService.pillStats$
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([groups, stats]) => {
      const userStats = stats.find(s => s.userId === userId);
      
      this.pillGroups = groups.map(group => ({
        time: group.time,
        pills: group.pills.map(pill => {
          // Find the status for this pill today
          const record = userStats?.intakeRecords.find(
            r => r.pillId === pill.id && r.date === today
          );
          
          return {
            ...pill,
            currentStatus: record ? record.status : 'upcoming'
          };
        })
      }));
      
      this.cacheAllDaysLeft();
    });
  }

  private cacheAllDaysLeft() {
    this.pillGroups.forEach(group => {
      group.pills.forEach(pill => {
        if (!this.daysLeftCache.has(pill.id)) {
          this.daysLeftCache.set(pill.id, Math.floor(Math.random() * 30) + 1);
        }
      });
    });
  }

  getDaysLeft(pill: Pill): number {
    // Return cached value or generate and cache if not exists
    if (!this.daysLeftCache.has(pill.id)) {
      const daysLeft = Math.floor(Math.random() * 30) + 1;
      this.daysLeftCache.set(pill.id, daysLeft);
      return daysLeft;
    }
    return this.daysLeftCache.get(pill.id)!;
  }

  // Helper to check if pill stock is low
  isLowStock(pill: Pill): string | null {
    const daysLeft = this.getDaysLeft(pill);
    if (daysLeft <= 7) {
      return `${daysLeft} pills for 7 days`;
    }
    return null;
  }

  // Get the display status for pill card
  getDisplayStatus(pill: PillWithStatus): string {
    switch (pill.currentStatus) {
      case 'taken':
        return 'Taken';
      case 'skipped':
        return 'Skipped';
      case 'postponed':
        return 'Postponed';
      case 'upcoming':
      default:
        return 'Upcoming';
    }
  }

  // Filter out taken pills from display
  getVisiblePills(pills: PillWithStatus[]): PillWithStatus[] {
    return pills.filter(pill => pill.currentStatus !== 'taken');
  }

  // Get total count of visible pills
  getTotalVisiblePillsCount(): number {
    return this.pillGroups.reduce((total, group) => {
      return total + this.getVisiblePills(group.pills).length;
    }, 0);
  }
}