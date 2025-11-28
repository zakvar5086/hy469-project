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
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDaysLeft(pill: Pill): number {
    return Math.floor(Math.random() * 30) + 1;
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