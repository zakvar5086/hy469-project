import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { Pill, DataService } from 'src/app/global/services/data.services';
import { PillPopupService } from 'src/app/global/services/pill-popup.service';
import { filter } from 'rxjs';

type WatchPopupState = 'closed' | 'notification' | 'postpone';

@Injectable({ providedIn: 'root' })
export class WatchPillPopupService {

  private stateSubject = new BehaviorSubject<WatchPopupState>('closed');
  private currentPillSubject = new BehaviorSubject<Pill | null>(null);
  private currentRouteIsWatch = false;
  
  state$ = this.stateSubject.asObservable();
  currentPill$ = this.currentPillSubject.asObservable();

  constructor(
    private router: Router,
    private dataService: DataService,
    private globalPopupService: PillPopupService
  ) {
    // Track if we're on watch route
    this.currentRouteIsWatch = this.router.url.startsWith('/watch');
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEnd = event as NavigationEnd;
        this.currentRouteIsWatch = navEnd.url.startsWith('/watch');
      });

    // Subscribe to the global popup service to intercept watch popups
    this.globalPopupService.pill$.subscribe(pill => {
      if (pill && this.currentRouteIsWatch) {
        console.log('🔔 Watch: Intercepting pill popup for', pill.name);
        // Intercept the popup for watch
        this.openNotification(pill);
        // Immediately close the global popup to prevent double-showing
        setTimeout(() => this.globalPopupService.close(), 0);
      }
    });
  }

  // Open the notification popup (first screen)
  openNotification(pill: Pill) {
    console.log('🔔 Watch: Opening notification for', pill.name);
    this.currentPillSubject.next(pill);
    this.stateSubject.next('notification');
    this.router.navigate(['/watch/popNot']);
  }

  // Transition to postpone screen
  showPostpone() {
    console.log('⏰ Watch: Showing postpone screen');
    this.stateSubject.next('postpone');
    this.router.navigate(['/watch/postpone']);
  }

  // Mark current pill as taken
  confirmTaken(userId: string) {
    const pill = this.currentPillSubject.value;
    if (!pill) return;

    console.log('✅ Watch: Marking pill as taken:', pill.name);
    const today = new Date().toISOString().split('T')[0];
    this.dataService.recordPillAction(userId, pill.id, today, 'taken');
    
    this.close();
    this.router.navigate(['/watch/home']);
  }

  // Mark current pill as skipped
  confirmSkipped(userId: string) {
    const pill = this.currentPillSubject.value;
    if (!pill) return;

    console.log('❌ Watch: Marking pill as skipped:', pill.name);
    const today = new Date().toISOString().split('T')[0];
    this.dataService.recordPillAction(userId, pill.id, today, 'skipped');
    
    this.close();
    this.router.navigate(['/watch/home']);
  }

  // Mark current pill as postponed with custom minutes
  confirmPostponed(userId: string, minutes: number = 30) {
    const pill = this.currentPillSubject.value;
    if (!pill) return;

    console.log(`⏱️ Watch: Postponing pill ${pill.name} for ${minutes} minutes`);
    const today = new Date().toISOString().split('T')[0];
    const postponedTo = new Date(Date.now() + minutes * 60000).toISOString();
    
    this.dataService.recordPillAction(userId, pill.id, today, 'postponed', postponedTo);
    
    this.close();
    this.router.navigate(['/watch/home']);
  }

  // Close popup and reset state
  close() {
    console.log('🚪 Watch: Closing popup');
    this.stateSubject.next('closed');
    this.currentPillSubject.next(null);
  }

  getCurrentPill(): Pill | null {
    return this.currentPillSubject.value;
  }

  getState(): WatchPopupState {
    return this.stateSubject.value;
  }
}