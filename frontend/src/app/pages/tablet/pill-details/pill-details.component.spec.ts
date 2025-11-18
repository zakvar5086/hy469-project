import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillDetailesComponent } from './pill-details.component';

describe('PillDetailesComponent', () => {
  let component: PillDetailesComponent;
  let fixture: ComponentFixture<PillDetailesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PillDetailesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PillDetailesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
