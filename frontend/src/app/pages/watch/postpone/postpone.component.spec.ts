import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostponeComponent } from './postpone.component';

describe('PostponeComponent', () => {
  let component: PostponeComponent;
  let fixture: ComponentFixture<PostponeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostponeComponent]
    });
    fixture = TestBed.createComponent(PostponeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
