import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WatchPillPopupService } from 'src/app/global/services/watch-pill-reminder.service';
import { ProfileStateService } from 'src/app/global/services/profile-state.service';
import { Pill } from 'src/app/global/services/data.services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-postpone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './postpone.component.html',
  styleUrls: ['./postpone.component.scss']
})
export class PostponeComponent implements OnInit, OnDestroy {
    
    pill: Pill | null = null;
    selectedMinutes: number = 5;
    
    postponeOptions = [5, 10, 15, 20, 25, 30];
    currentIndex = 0;
    
    private destroy$ = new Subject<void>();
    private touchStartY: number = 0;
    
    constructor(
        private router: Router,
        private watchPopupService: WatchPillPopupService,
        private profileState: ProfileStateService
    ) {}

    ngOnInit() {
        this.watchPopupService.currentPill$
            .pipe(takeUntil(this.destroy$))
            .subscribe(pill => {
                this.pill = pill;
            });
        
        // Initialize selected minutes to first option
        this.selectedMinutes = this.postponeOptions[this.currentIndex];
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
          
    private getDevicePrefix(): string {
        return '/watch/';
    }
        
    navigateTo(route: string) {
        const device = this.getDevicePrefix();
        this.router.navigate([device + route], {
            queryParamsHandling: 'merge'
        });
    }

    increaseTime() {
        if (this.currentIndex < this.postponeOptions.length - 1) {
            this.currentIndex++;
            this.selectedMinutes = this.postponeOptions[this.currentIndex];
        }
    }

    decreaseTime() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.selectedMinutes = this.postponeOptions[this.currentIndex];
        }
    }

    onConfirm() {
        const userId = this.profileState.getPersona();
        if (userId) {
            this.watchPopupService.confirmPostponed(userId, this.selectedMinutes);
        }
    }

    onCancel() {
        const userId = this.profileState.getPersona();
        if (userId) {
            this.watchPopupService.confirmSkipped(userId);
        }
    }

    // Swipe down to go back to notification
    onTouchStart(event: TouchEvent) {
        this.touchStartY = event.touches[0].clientY;
    }

    onTouchEnd(event: TouchEvent) {
        const touchEndY = event.changedTouches[0].clientY;
        const diff = touchEndY - this.touchStartY;
        
        // Swipe down threshold
        if (diff > 60) {
            this.navigateTo('popNot');
        }
    }
}
