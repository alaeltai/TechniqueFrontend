import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseCardComponent } from './phase-card.component';

describe('PhaseCardComponent', () => {
  let component: PhaseCardComponent;
  let fixture: ComponentFixture<PhaseCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhaseCardComponent]
    });
    fixture = TestBed.createComponent(PhaseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
