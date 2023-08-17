import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproachComponent } from './approach.component';

describe('ApproachComponent', () => {
  let component: ApproachComponent;
  let fixture: ComponentFixture<ApproachComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApproachComponent]
    });
    fixture = TestBed.createComponent(ApproachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
