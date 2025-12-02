import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pill } from 'src/app/global/services/data.services';

@Injectable({ providedIn: 'root' })
export class PillPopupService {

  private pillSubject = new BehaviorSubject<Pill | null>(null);
  pill$ = this.pillSubject.asObservable();

  open(pill: Pill) {
    this.pillSubject.next(pill);
  }

  close() {
    this.pillSubject.next(null);
  }

  isOpen(): boolean {
    return this.pillSubject.value !== null;
  }

  getCurrentPill(): Pill | null {
    return this.pillSubject.value;
  }

  /** FOR TESTING ONLY */
  openTestPopup() {
    const testPill: Pill = {
      id: 'test-pill-1',
      name: 'Test Medication',
      dosage: '10mg',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      image: 'assets/icons/pill.svg',
      shortInstructions: [
        'Take with water',
        'Take after meals',
        'Do not crush or chew'
      ],
      longDescription: 'This is a test medication popup for demonstration purposes.'
    };

    this.open(testPill);
  }
}
