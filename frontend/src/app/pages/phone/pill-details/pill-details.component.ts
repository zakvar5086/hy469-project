import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DataService, Pill } from 'src/app/global/services/data.services';
import { ProfileStateService } from 'src/app/global/services/profile-state.service';
import { ProfileRoutingService } from 'src/app/global/services/profile-routing.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pill-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pill-details.component.html',
  styleUrls: ['./pill-details.component.scss']
})
export class PillDetailsComponent implements OnInit, OnDestroy {

  pill: Pill | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private profileState: ProfileStateService,
    private profileRouting: ProfileRoutingService
  ) {}

  ngOnInit() {
    const personaId = this.profileState.getPersona();
    
    // Read pillId from route params instead of query params
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const pillId = params['pillId'];
      
      if (personaId && pillId) {
        this.dataService.getPillById(personaId, pillId)
          .pipe(takeUntil(this.destroy$))
          .subscribe(pill => {
            this.pill = pill || null;
          });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack() {
    this.profileRouting.navigateTo('/home');
  }
}
