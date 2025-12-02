import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pill } from 'src/app/global/services/data.services';
import { PillPopupService } from 'src/app/global/services/pill-popup.service';

@Component({
  selector: 'app-pill-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pill-popup.component.html',
  styleUrls: ['./pill-popup.component.scss']
})
export class PillPopupComponent {
  @Input() pill!: Pill;

  constructor(public popupService: PillPopupService) {}

  onTake() {
    // TODO: Implement logic to mark pill as taken
    this.popupService.close();
  }

  onSkip() {
    // TODO: Implement logic to mark pill as skipped
    this.popupService.close();
  }

  onPostpone() {
    // TODO: Implement logic to postpone pill reminder
    this.popupService.close();
  }
}
