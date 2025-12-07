import { Component, OnInit, OnDestroy } from '@angular/core';
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

    private startY: number = 0;
    private swipeThreshold = 60; 

    startSwipe(event: TouchEvent) {
        this.startY = event.touches[0].clientY;
    }

    moveSwipe(event: TouchEvent) {
        const currentY = event.touches[0].clientY;
        const diffY = this.startY - currentY;
        if (diffY > this.swipeThreshold) {
            this.navigateTo("postpone");
        }
    }
}
