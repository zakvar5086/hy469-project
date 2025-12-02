import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PillCardComponent } from 'src/app/global/shared/pill-card/pill-card.component';
import { DataService, Pill } from 'src/app/global/services/data.services';
import { ProfileStateService } from 'src/app/global/services/profile-state.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pill-container',
  standalone: true,
  imports: [CommonModule, PillCardComponent],
  templateUrl: './pill-container.component.html',
  styleUrls: ['./pill-container.component.scss']
})
export class PillContainerComponent implements OnInit, OnDestroy {

  pillGroups: { time: string; pills: Pill[] }[] = [];
  private destroy$ = new Subject<void>();
  
  private daysLeftCache = new Map<string, number>();

  constructor(
    private dataService: DataService,
    private profileState: ProfileStateService
  ) {}

  ngOnInit() {
    const personaId = this.profileState.getPersona();
    
    if (personaId) {
      this.dataService.getPillsGroupedByTime(personaId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(groups => {
          this.pillGroups = groups;
          this.cacheAllDaysLeft();
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
}
