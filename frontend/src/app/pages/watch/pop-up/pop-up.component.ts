import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WatchPillPopupService } from 'src/app/global/services/watch-pill-reminder.service';
import { ProfileStateService } from 'src/app/global/services/profile-state.service';
import { Pill } from 'src/app/global/services/data.services';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-pop-up',
    imports: [CommonModule],
    standalone: true,
    templateUrl: './pop-up.component.html',
    styleUrls: ['./pop-up.component.scss'],
})
export class PopUpComponent implements OnInit, OnDestroy {
    
    pill: Pill | null = null;
    private destroy$ = new Subject<void>();
    
    // Swipe detection properties
    private touchStartY: number = 0;
    private touchStartX: number = 0;
    private touchStartTime: number = 0;
    private swipeThreshold: number = 40;
    private swipeTimeLimit: number = 300;
    
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

    onConfirm() {
        const userId = this.profileState.getPersona();
        if (userId) {
            this.watchPopupService.confirmTaken(userId);
        }
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent) {
        this.touchStartY = event.touches[0].clientY;
        this.touchStartX = event.touches[0].clientX;
        this.touchStartTime = Date.now();
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(event: TouchEvent) {
        const touchEndY = event.changedTouches[0].clientY;
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndTime = Date.now();
        
        const deltaY = this.touchStartY - touchEndY;
        const deltaX = Math.abs(touchEndX - this.touchStartX);
        const deltaTime = touchEndTime - this.touchStartTime;
        
        if (
            Math.abs(deltaY) > this.swipeThreshold &&
            deltaX < Math.abs(deltaY) &&
            deltaTime < this.swipeTimeLimit
        ) {
            if (deltaY > 0) this.navigateTo('postpone');
        }
    }
}