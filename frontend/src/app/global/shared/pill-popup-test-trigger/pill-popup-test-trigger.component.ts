import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PillPopupService } from 'src/app/global/services/pill-popup.service';
import { DataService, Pill } from 'src/app/global/services/data.services';
import { ProfileStateService } from 'src/app/global/services/profile-state.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-pill-popup-test-trigger',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="test-trigger-container">
      <button class="test-btn" (click)="toggleMenu()">
        🧪 Test
      </button>
      
      <div class="test-menu" *ngIf="showMenu">
        <h4>Test Pill Popup</h4>
        
        <button class="menu-btn" (click)="openTestPopup()">
          Generic Test Pill
        </button>
        
        <div *ngIf="userPills.length > 0" class="divider"></div>
        
        <button *ngFor="let pill of userPills" 
                class="menu-btn pill-btn"
                (click)="openPillPopup(pill)">
          {{ pill.name }} ({{ pill.time }})
        </button>
        
        <div *ngIf="userPills.length === 0" class="no-pills">
          <small>No pills available. Select a persona first.</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .test-trigger-container {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 9998;
    }

    .test-btn {
      background: #9C27B0;
      color: white;
      border: none;
      border-radius: 50px;
      padding: 1rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(156, 39, 176, 0.4);
      transition: all 0.2s ease;
    }

    .test-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(156, 39, 176, 0.5);
    }

    .test-menu {
      position: absolute;
      bottom: 70px;
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      padding: 1rem;
      min-width: 250px;
      max-height: 400px;
      overflow-y: auto;
    }

    h4 {
      margin: 0 0 0.75rem 0;
      color: #333;
      font-size: 1rem;
    }

    .menu-btn {
      width: 100%;
      background: #f5f5f5;
      border: none;
      border-radius: 8px;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      cursor: pointer;
      text-align: left;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }

    .menu-btn:hover {
      background: #e0e0e0;
      transform: translateX(4px);
    }

    .pill-btn {
      background: #EAF3FF;
      color: #2E5CFF;
      font-weight: 500;
    }

    .pill-btn:hover {
      background: #d4e7ff;
    }

    .divider {
      height: 1px;
      background: #ddd;
      margin: 0.75rem 0;
    }

    .no-pills {
      text-align: center;
      color: #999;
      padding: 0.5rem;
    }

    @media (max-width: 768px) {
      .test-trigger-container {
        bottom: 100px;
        right: 20px;
      }

      .test-btn {
        padding: 0.75rem 1.25rem;
        font-size: 0.9rem;
      }

      .test-menu {
        max-height: 300px;
        min-width: 200px;
      }
    }
  `]
})
export class PillPopupTestTriggerComponent {
  showMenu = false;
  userPills: Pill[] = [];

  constructor(
    private pillPopupService: PillPopupService,
    private dataService: DataService,
    private profileState: ProfileStateService
  ) {
    this.loadUserPills();
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    if (this.showMenu) {
      this.loadUserPills();
    }
  }

  openTestPopup() {
    this.pillPopupService.openTestPopup();
    this.showMenu = false;
  }

  openPillPopup(pill: Pill) {
    this.pillPopupService.open(pill);
    this.showMenu = false;
  }

  private loadUserPills() {
    const personaId = this.profileState.getPersona();
    
    if (personaId) {
      this.dataService.getPillsForUser(personaId)
        .pipe(take(1))
        .subscribe(pills => {
          this.userPills = pills;
          console.log(`📋 Loaded ${pills.length} pills for persona: ${personaId}`);
        });
    } else {
      this.userPills = [];
      console.log('⚠️ No persona selected yet');
    }
  }
}
