import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubphaseTabComponent } from './subphase-tab.component';

describe('SubphaseTabComponent', () => {
  let component: SubphaseTabComponent;
  let fixture: ComponentFixture<SubphaseTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubphaseTabComponent]
    });
    fixture = TestBed.createComponent(SubphaseTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
