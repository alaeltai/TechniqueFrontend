import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseNavigationComponent } from './phase-navigation.component';

describe('PhaseNavigationComponent', () => {
  let component: PhaseNavigationComponent;
  let fixture: ComponentFixture<PhaseNavigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhaseNavigationComponent]
    });
    fixture = TestBed.createComponent(PhaseNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
